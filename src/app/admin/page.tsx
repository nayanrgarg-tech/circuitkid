'use client';

/**
 * Teacher view. Nayan pastes the Google Sheet in and gets a readable roll-up.
 *
 * The sheet has one row per tick and one row per lesson visit, so the same
 * student + lesson turns up many times. Everything here aggregates: the LATEST
 * row per student + lesson decides whether that lesson counts as done, which
 * means a later "unmarked" row undoes an earlier "done".
 *
 * Nothing is stored except the CSV link, and nothing is sent anywhere.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Btn, Card, Pill, Section, accent } from '@/components/ui';
import { ProgressBar } from '@/components/Progress';
import { allLessons, trackedLessons, units } from '@/data/curriculum';
import type { Lesson, Unit } from '@/lib/types';
import { formatSpent } from '@/lib/timeSpent';

const URL_KEY = 'circuitkid.admin.csv-url';

/* ------------------------------------------------------------------ *
 *  Delimited-text parsing
 *
 *  Pasted spreadsheet data, so: commas or tabs, quoted fields holding
 *  the delimiter, "" for a literal quote, CRLF or LF, ragged rows.
 * ------------------------------------------------------------------ */

/** Counts commas against tabs in the first record, ignoring quoted stretches. */
function detectDelimiter(text: string): ',' | '\t' {
  let commas = 0;
  let tabs = 0;
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }
    if (inQuotes) continue;
    if (ch === '\n') break;
    if (ch === ',') commas++;
    else if (ch === '\t') tabs++;
  }
  return tabs > commas ? '\t' : ',';
}

function parseDelimited(text: string, delim: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }
    if (ch === delim) {
      row.push(field);
      field = '';
      continue;
    }
    if (ch === '\r') continue;
    if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      continue;
    }
    field += ch;
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/* ---------------- columns ---------------- */

const COLUMNS = ['timestamp', 'student', 'lesson', 'status', 'total', 'minutes'] as const;
type ColumnName = (typeof COLUMNS)[number];
type ColumnMap = Record<ColumnName, number>;

const REQUIRED: ColumnName[] = ['student', 'lesson', 'status'];

/**
 * Matches columns by header name, not position. Exact names win first, so a
 * sheet with both "Minutes" and "Total Minutes" lands the right way round.
 */
function mapHeaders(header: string[]): ColumnMap {
  const clean = header.map((h) => h.trim().toLowerCase());
  const taken = new Set<number>();
  const out: ColumnMap = { timestamp: -1, student: -1, lesson: -1, status: -1, total: -1, minutes: -1 };

  for (const key of COLUMNS) {
    let hit = clean.findIndex((h, i) => !taken.has(i) && h === key);
    if (hit === -1) hit = clean.findIndex((h, i) => !taken.has(i) && h.includes(key));
    if (hit !== -1) {
      out[key] = hit;
      taken.add(hit);
    }
  }
  return out;
}

/* ---------------- timestamps ---------------- */

const SLASH_DATE =
  /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})(?:[ ,T]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?\s*(am|pm|AM|PM)?/;

/**
 * Slash dates are ambiguous, so the whole column votes: one row with a first
 * number above 12 makes the file day-first. Google's own default is US order.
 */
function detectDayFirst(stamps: string[]): boolean {
  for (const s of stamps) {
    const m = SLASH_DATE.exec(s.trim());
    if (!m) continue;
    if (Number(m[1]) > 12) return true;
    if (Number(m[2]) > 12) return false;
  }
  return false;
}

function parseWhen(raw: string, dayFirst: boolean): number | null {
  const s = raw.trim();
  if (!s) return null;

  const m = SLASH_DATE.exec(s);
  if (m) {
    const first = Number(m[1]);
    const second = Number(m[2]);
    let year = Number(m[3]);
    if (year < 100) year += 2000;
    const day = dayFirst ? first : second;
    const month = dayFirst ? second : first;
    let hours = m[4] ? Number(m[4]) : 0;
    const mins = m[5] ? Number(m[5]) : 0;
    const secs = m[6] ? Number(m[6]) : 0;
    const suffix = (m[7] || '').toLowerCase();
    if (suffix === 'pm' && hours < 12) hours += 12;
    if (suffix === 'am' && hours === 12) hours = 0;
    const t = new Date(year, month - 1, day, hours, mins, secs).getTime();
    return Number.isNaN(t) ? null : t;
  }

  const direct = Date.parse(s);
  if (!Number.isNaN(direct)) return direct;
  const spaced = Date.parse(s.replace(' ', 'T'));
  return Number.isNaN(spaced) ? null : spaced;
}

function parseNum(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^0-9.-]/g, '');
  if (!cleaned || cleaned === '-' || cleaned === '.') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/* ---------------- reading the sheet ---------------- */

type Row = {
  student: string;
  lesson: string;
  status: string;
  minutes: number | null;
  total: number | null;
  at: number | null;
  /** Position in the sheet, the tie-break when timestamps match or are absent. */
  order: number;
};

type Sheet = {
  rows: Row[];
  skipped: number;
  missing: ColumnName[];
  hasTimestamps: boolean;
  readAt: number;
};

function readSheet(text: string): Sheet {
  const body = text.replace(/^\uFEFF/, '');
  const table = parseDelimited(body, detectDelimiter(body)).filter((r) =>
    r.some((c) => c.trim() !== ''),
  );

  const empty: Sheet = { rows: [], skipped: 0, missing: [...REQUIRED], hasTimestamps: false, readAt: Date.now() };
  if (!table.length) return empty;

  const cols = mapHeaders(table[0]);
  const missing = REQUIRED.filter((k) => cols[k] === -1);
  if (missing.length) return { ...empty, missing };

  const at = (r: string[], i: number) => (i === -1 ? '' : (r[i] ?? '').trim());
  const dataRows = table.slice(1);
  const dayFirst = detectDayFirst(dataRows.map((r) => at(r, cols.timestamp)));

  const rows: Row[] = [];
  let skipped = 0;

  dataRows.forEach((raw, i) => {
    const student = at(raw, cols.student);
    const lesson = at(raw, cols.lesson);
    if (!student || !lesson) {
      skipped++;
      return;
    }
    rows.push({
      student,
      lesson,
      status: at(raw, cols.status).toLowerCase(),
      minutes: parseNum(at(raw, cols.minutes)),
      total: parseNum(at(raw, cols.total)),
      at: parseWhen(at(raw, cols.timestamp), dayFirst),
      order: i,
    });
  });

  return {
    rows,
    skipped,
    missing: [],
    hasTimestamps: cols.timestamp !== -1 && rows.some((r) => r.at !== null),
    readAt: Date.now(),
  };
}

/* ------------------------------------------------------------------ *
 *  Matching sheet rows back to the curriculum
 *
 *  The site reports a lesson as "2.1 LED Blink", so the full label
 *  matches outright almost every time. The rest are fallbacks.
 * ------------------------------------------------------------------ */

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

const byLabel = new Map(allLessons.map((l) => [norm(`${l.id} ${l.title}`), l]));
const byTitle = new Map(allLessons.map((l) => [norm(l.title), l]));
const orderOf = new Map(allLessons.map((l, i) => [l.slug, i]));
const byId = new Map<string, Lesson>();
for (const l of allLessons) {
  const key = norm(l.id);
  if (!byId.has(key)) byId.set(key, l);
}

function resolveLesson(label: string): Lesson | null {
  const key = norm(label);
  const exact = byLabel.get(key);
  if (exact) return exact;

  const gap = key.indexOf(' ');
  if (gap > 0) {
    const viaId = byId.get(key.slice(0, gap));
    if (viaId) return viaId;
    const viaTitle = byTitle.get(key.slice(gap + 1));
    if (viaTitle) return viaTitle;
  }
  return byId.get(key) ?? byTitle.get(key) ?? null;
}

/* ------------------------------------------------------------------ *
 *  Aggregation
 * ------------------------------------------------------------------ */

type LessonRoll = {
  label: string;
  lesson: Lesson | null;
  done: boolean;
  /** Minutes on this lesson. The column is cumulative, so the max is the truth. */
  minutes: number;
};

type UnitRoll = { unit: Unit; done: number; total: number };

type StudentRoll = {
  name: string;
  done: LessonRoll[];
  trackedDone: number;
  minutes: number;
  lastSeen: number | null;
  unitRolls: UnitRoll[];
  rowCount: number;
};

type Latest = { status: string; at: number | null; order: number };

const isLater = (a: Latest, b: Latest) => {
  const at = a.at ?? Number.NEGATIVE_INFINITY;
  const bt = b.at ?? Number.NEGATIVE_INFINITY;
  return at === bt ? a.order > b.order : at > bt;
};

const trackedTotal = trackedLessons.length;

function rollUp(rows: Row[]): StudentRoll[] {
  type Bucket = {
    name: string;
    rowCount: number;
    lastSeen: number | null;
    maxTotal: number | null;
    lessons: Map<string, { label: string; latest: Latest; minutes: number }>;
  };

  const buckets = new Map<string, Bucket>();

  for (const r of rows) {
    const key = norm(r.student);
    let bucket = buckets.get(key);
    if (!bucket) {
      bucket = { name: r.student, rowCount: 0, lastSeen: null, maxTotal: null, lessons: new Map() };
      buckets.set(key, bucket);
    }
    bucket.rowCount++;
    if (r.at !== null && (bucket.lastSeen === null || r.at > bucket.lastSeen)) bucket.lastSeen = r.at;
    if (r.total !== null && (bucket.maxTotal === null || r.total > bucket.maxTotal)) bucket.maxTotal = r.total;

    const lessonKey = norm(r.lesson);
    const seen = bucket.lessons.get(lessonKey);
    const stamp: Latest = { status: r.status, at: r.at, order: r.order };
    if (!seen) {
      bucket.lessons.set(lessonKey, { label: r.lesson, latest: stamp, minutes: r.minutes ?? 0 });
    } else {
      if (isLater(stamp, seen.latest)) {
        seen.latest = stamp;
        seen.label = r.lesson;
      }
      if (r.minutes !== null && r.minutes > seen.minutes) seen.minutes = r.minutes;
    }
  }

  const rolls: StudentRoll[] = [];

  for (const bucket of buckets.values()) {
    const all: LessonRoll[] = [...bucket.lessons.values()].map((entry) => ({
      label: entry.label,
      lesson: resolveLesson(entry.label),
      done: entry.latest.status === 'done',
      minutes: entry.minutes,
    }));

    const done = all
      .filter((l) => l.done)
      .sort((a, b) => {
        const ai = a.lesson ? (orderOf.get(a.lesson.slug) ?? 9e6) : 9e6;
        const bi = b.lesson ? (orderOf.get(b.lesson.slug) ?? 9e6) : 9e6;
        return ai - bi || a.label.localeCompare(b.label);
      });

    // Total is cumulative across every lesson, so the biggest one is the answer.
    // With no usable Total column, add up the per-lesson figures instead.
    const summed = all.reduce((sum, l) => sum + l.minutes, 0);
    const minutes = bucket.maxTotal !== null ? Math.max(bucket.maxTotal, 0) : summed;

    const unitRolls = units
      .map((u) => ({
        unit: u,
        done: done.filter((l) => l.lesson && !l.lesson.optional && l.lesson.unitId === u.id).length,
        total: u.lessons.filter((l) => !l.optional).length,
      }))
      .filter((u) => u.done > 0);

    rolls.push({
      name: bucket.name,
      done,
      trackedDone: done.filter((l) => l.lesson && !l.lesson.optional).length,
      minutes,
      lastSeen: bucket.lastSeen,
      unitRolls,
      rowCount: bucket.rowCount,
    });
  }

  return rolls;
}

/* ------------------------------------------------------------------ *
 *  Formatting
 * ------------------------------------------------------------------ */

const timePhrase = (mins: number) => (mins >= 1 ? formatSpent(Math.round(mins) * 60) : 'no time logged');

function relativeDay(then: number, now: number) {
  const a = new Date(then);
  a.setHours(0, 0, 0, 0);
  const b = new Date(now);
  b.setHours(0, 0, 0, 0);
  const days = Math.round((b.getTime() - a.getTime()) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 45) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months < 12 ? `${months} months ago` : 'over a year ago';
}

function wordList(items: string[]) {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/* ------------------------------------------------------------------ *
 *  Page
 * ------------------------------------------------------------------ */

type SortKey = 'lessons' | 'time' | 'seen';

const SORT_LABEL: Record<SortKey, string> = {
  lessons: 'lessons done',
  time: 'time spent',
  seen: 'last seen',
};

const FIELD =
  'w-full rounded-2xl border border-cream/12 bg-ink-800/80 px-4 py-3 text-cream placeholder:font-sans placeholder:text-cream-faint/70 focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/40';
const LABEL = 'block text-xs font-bold uppercase tracking-[0.16em] text-brand-600';

export default function AdminPage() {
  const [pasted, setPasted] = useState('');
  const [url, setUrl] = useState('');
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [source, setSource] = useState<'paste' | 'link'>('paste');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [inputOpen, setInputOpen] = useState(true);
  const [sort, setSort] = useState<SortKey>('lessons');

  // Remember the link so he does not retype it. Loading stays manual.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(URL_KEY);
      if (saved) setUrl(saved);
    } catch {
      /* storage off, no harm */
    }
  }, []);

  const ingest = useCallback((text: string, from: 'paste' | 'link') => {
    if (!text.trim()) {
      setError('Nothing to read yet. Paste the rows in first.');
      return;
    }
    if (text.trimStart().startsWith('<')) {
      setError('That came back as a web page instead of CSV. The sheet is probably not published yet.');
      return;
    }

    const next = readSheet(text);

    if (next.missing.length) {
      setSheet(null);
      setError(
        `No ${wordList(next.missing)} column in there. Copy the header row along with the data.`,
      );
      return;
    }
    if (!next.rows.length) {
      setSheet(null);
      setError('Found the header row, but no readable data under it.');
      return;
    }

    setError(null);
    setSource(from);
    setSheet(next);
    setInputOpen(false);
  }, []);

  const loadFromUrl = useCallback(async () => {
    const target = url.trim();
    if (!target) {
      setError('Put the published CSV link in the box first.');
      return;
    }
    setBusy(true);
    // Keep the link either way. A failed load is not a reason to retype it.
    try {
      localStorage.setItem(URL_KEY, target);
    } catch {
      /* storage off, no harm */
    }
    try {
      const res = await fetch(target, { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      ingest(await res.text(), 'link');
    } catch {
      setError(
        'That link would not load from the browser. Use File, Share, Publish to web, CSV, or paste the rows below instead.',
      );
    } finally {
      setBusy(false);
    }
  }, [ingest, url]);

  const rolls = useMemo(() => (sheet ? rollUp(sheet.rows) : []), [sheet]);

  const sorted = useMemo(() => {
    const list = [...rolls];
    const byName = (a: StudentRoll, b: StudentRoll) => a.name.localeCompare(b.name);
    if (sort === 'time') {
      list.sort((a, b) => b.minutes - a.minutes || b.done.length - a.done.length || byName(a, b));
    } else if (sort === 'seen') {
      list.sort((a, b) => (b.lastSeen ?? 0) - (a.lastSeen ?? 0) || byName(a, b));
    } else {
      list.sort((a, b) => b.done.length - a.done.length || b.minutes - a.minutes || byName(a, b));
    }
    return list;
  }, [rolls, sort]);

  const totals = useMemo(
    () => ({
      students: rolls.length,
      lessons: rolls.reduce((n, r) => n + r.done.length, 0),
      minutes: rolls.reduce((n, r) => n + r.minutes, 0),
    }),
    [rolls],
  );

  const readAt = sheet?.readAt ?? 0;

  return (
    <Section>
      {/* ---------- header ---------- */}
      <header className="mb-8 max-w-3xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          Teacher view
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
          Where everyone is up to
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-cream-dim">
          Drop the form responses in and you get one card per student, with lessons ticked off and
          time on task.
        </p>
      </header>

      {/* ---------- the honest bit ---------- */}
      <div className="mb-10 rounded-card border-[3px] border-ink-line bg-amber/25 p-5 hard-shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-deep">
          This page is not private
        </p>
        <p className="mt-2 leading-relaxed text-cream">
          The site is static, so everything shipped with it is public. This address is unlisted, not
          protected — anyone who has it can open it. No student data is built into the page. The
          numbers only appear once you paste them in, and they go when you close the tab. The link
          box is the one thing this browser remembers.
        </p>
      </div>

      {/* ---------- input ---------- */}
      <div className="card p-6 sm:p-7">
        {inputOpen ? (
          <div className="space-y-8">
            <div>
              <label htmlFor="csv-paste" className={LABEL}>
                Paste the rows
              </label>
              <p className="mt-2 text-sm text-cream-dim">
                In the sheet: File, Download, CSV. Or select the cells and copy them straight across.
                Both work.
              </p>
              <textarea
                id="csv-paste"
                rows={8}
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
                spellCheck={false}
                placeholder={'Timestamp,Student,Lesson,Status,Minutes,Total'}
                className={`mt-3 resize-y font-mono text-xs leading-relaxed ${FIELD}`}
              />
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Btn onClick={() => ingest(pasted, 'paste')} disabled={pasted.trim().length === 0}>
                  Read this
                </Btn>
                {pasted.length > 0 && (
                  <Btn
                    variant="ghost"
                    onClick={() => {
                      setPasted('');
                      setError(null);
                    }}
                  >
                    Clear
                  </Btn>
                )}
              </div>
            </div>

            <div className="border-t border-cream/10 pt-7">
              <label htmlFor="csv-url" className={LABEL}>
                Or load a published CSV link
              </label>
              <p className="mt-2 text-sm text-cream-dim">
                In the sheet: File, Share, Publish to web, then pick CSV. The link is remembered here.
              </p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <input
                  id="csv-url"
                  type="url"
                  inputMode="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://docs.google.com/.../pub?output=csv"
                  autoComplete="off"
                  spellCheck={false}
                  className={`min-w-0 flex-1 text-sm ${FIELD}`}
                />
                <Btn variant="outline" onClick={() => void loadFromUrl()} disabled={busy}>
                  {busy ? 'Loading' : 'Load'}
                </Btn>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm font-semibold text-cream-dim">
              {sheet?.rows.length ?? 0} rows read from {source === 'link' ? 'the link' : 'your paste'}
              {totals.students > 0 && `, ${totals.students} students in there`}.
            </p>
            <Btn variant="ghost" onClick={() => setInputOpen(true)}>
              Load different data
            </Btn>
          </div>
        )}

        <p
          aria-live="polite"
          className={`text-sm font-semibold ${error || inputOpen ? 'mt-4 min-h-[1.25rem]' : ''}`}
        >
          {error && <span className="text-pink">{error}</span>}
        </p>
      </div>

      {/* ---------- nothing loaded ---------- */}
      {!sheet && (
        <Card className="mt-10">
          <h2 className="font-display text-2xl font-extrabold">No data yet</h2>
          <p className="mt-3 leading-relaxed text-cream-dim">
            Every tick and every lesson visit writes a row to your form, which lands in the sheet.
            Nothing reaches this page on its own, so you feed it one of two ways.
          </p>
          <ol className="mt-5 space-y-3 text-sm leading-relaxed text-cream-dim">
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-ink-line bg-brand-500 text-xs font-bold text-cream hard-shadow-xs">
                1
              </span>
              <span>
                Open the sheet, copy the cells including the header row, and paste them into the box
                above.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-ink-line bg-brand-500 text-xs font-bold text-cream hard-shadow-xs">
                2
              </span>
              <span>
                Publish the sheet to the web as CSV once, paste that link in, and after that you only
                press Load.
              </span>
            </li>
          </ol>
          <p className="mt-5 text-sm text-cream-faint">
            The columns can be in any order. It reads them by name.
          </p>
        </Card>
      )}

      {/* ---------- results ---------- */}
      {sheet && rolls.length > 0 && (
        <>
          {/* summary strip */}
          <div className="card grid-dots mt-10 p-6 sm:p-7">
            <dl className="grid gap-6 sm:grid-cols-3">
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-cream-faint">
                  Students reporting
                </dt>
                <dd className="mt-2 font-display text-4xl font-extrabold">{totals.students}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-cream-faint">
                  Lessons finished
                </dt>
                <dd className="mt-2 font-display text-4xl font-extrabold">{totals.lessons}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-[0.16em] text-cream-faint">
                  Time on task
                </dt>
                <dd className="mt-2 font-display text-4xl font-extrabold">
                  {timePhrase(totals.minutes)}
                </dd>
              </div>
            </dl>
          </div>

          {/* caveats */}
          {(sheet.skipped > 0 || !sheet.hasTimestamps) && (
            <div className="mt-4 space-y-1.5 text-sm text-cream-faint">
              {sheet.skipped > 0 && (
                <p>
                  Couldn&rsquo;t read {sheet.skipped} {sheet.skipped === 1 ? 'row' : 'rows'}. The rest
                  went through.
                </p>
              )}
              {!sheet.hasTimestamps && (
                <p>No readable timestamps, so the lowest row in the sheet wins and last seen is blank.</p>
              )}
            </div>
          )}

          {/* sort */}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-cream-faint">
              Sort by
            </span>
            {(['lessons', 'time', 'seen'] as SortKey[]).map((key) => (
              <Btn
                key={key}
                variant={sort === key ? 'primary' : 'outline'}
                onClick={() => setSort(key)}
              >
                {SORT_LABEL[key]}
              </Btn>
            ))}
            <p className="sr-only" aria-live="polite">
              Sorted by {SORT_LABEL[sort]}.
            </p>
          </div>

          {/* student cards */}
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {sorted.map((s) => (
              <Card as="li" key={s.name} className="flex flex-col">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="font-display text-2xl font-extrabold leading-tight">{s.name}</h2>
                  <Pill tone={s.lastSeen === null ? 'muted' : 'neutral'}>
                    {s.lastSeen === null ? 'no date' : relativeDay(s.lastSeen, readAt)}
                  </Pill>
                </div>

                <div className="mt-5 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                  <p className="font-display text-3xl font-extrabold text-brand-600">
                    {s.done.length}
                    <span className="ml-2 text-sm font-semibold uppercase tracking-[0.14em] text-cream-faint">
                      {s.done.length === 1 ? 'lesson done' : 'lessons done'}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-cream-dim">{timePhrase(s.minutes)}</p>
                </div>

                <div className="mt-5">
                  <ProgressBar
                    done={Math.min(s.trackedDone, trackedTotal)}
                    total={trackedTotal}
                    showLabel={false}
                  />
                  <p className="mt-2 text-xs font-semibold text-cream-faint">
                    {s.trackedDone} of {trackedTotal} core lessons, {s.rowCount}{' '}
                    {s.rowCount === 1 ? 'row' : 'rows'} in the sheet
                  </p>
                </div>

                {s.unitRolls.length > 0 && (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.unitRolls.map(({ unit, done, total }) => {
                      const a = accent(unit.accent);
                      return (
                        <li
                          key={unit.id}
                          className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink-line px-2.5 py-1 text-xs font-semibold hard-shadow-xs ${a.bg} ${a.text}`}
                        >
                          {unit.num === '★' ? 'Extras' : `Unit ${unit.num}`}
                          <span className="text-cream">
                            {done}/{total}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {s.done.length > 0 && (
                  <details className="mt-5 border-t border-ink-line/15 pt-4 [&[open]_.caret]:rotate-90">
                    <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-300 [&::-webkit-details-marker]:hidden">
                      <span className="caret inline-block transition-transform duration-200" aria-hidden>
                        ▸
                      </span>
                      Which lessons
                    </summary>
                    <ul className="mt-3 space-y-2 overflow-x-auto">
                      {s.done.map((l) => (
                        <li
                          key={l.label}
                          className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm"
                        >
                          {l.lesson ? (
                            <>
                              <span className="rounded-md bg-ink-500 px-1.5 py-0.5 font-mono text-[11px] font-bold text-cream-dim">
                                {l.lesson.id}
                              </span>
                              <span className="min-w-0 font-semibold">{l.lesson.title}</span>
                              {l.lesson.optional && <Pill tone="muted">Side quest</Pill>}
                            </>
                          ) : (
                            <span className="min-w-0 font-semibold">{l.label}</span>
                          )}
                          <span className="ml-auto shrink-0 text-xs font-semibold text-cream-faint">
                            {timePhrase(l.minutes)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </Card>
            ))}
          </ul>
        </>
      )}

      {/* ---------- read, but empty ---------- */}
      {sheet && rolls.length === 0 && (
        <Card className="mt-10">
          <h2 className="font-display text-2xl font-extrabold">Read it, found nobody</h2>
          <p className="mt-3 text-cream-dim">
            The headers lined up, but every row was missing a student or a lesson.
          </p>
        </Card>
      )}
    </Section>
  );
}
