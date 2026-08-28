'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Btn, Card, Pill, Section, accent } from '@/components/ui';
import { ProgressBar, ProgressRing } from '@/components/Progress';
import { allLessons, units, unitById } from '@/data/curriculum';
import { useProgressStats, useStudent } from '@/lib/student';

type ImportMsg = { ok: boolean; text: string };

export default function DashboardPage() {
  const { ready, student, completed, signOut, reset, exportCode, importCode } = useStudent();
  const { done, total, pct, byUnit } = useProgressStats();

  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [importValue, setImportValue] = useState('');
  const [importMsg, setImportMsg] = useState<ImportMsg | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  // Let "Copied!" fade back to the normal label on its own.
  useEffect(() => {
    if (copyState === 'idle') return;
    const t = setTimeout(() => setCopyState('idle'), 2200);
    return () => clearTimeout(t);
  }, [copyState]);

  /* ---------- loading ---------- */
  if (!ready) {
    return (
      <Section>
        <div className="animate-pulse space-y-6" aria-hidden>
          <div className="h-10 w-64 rounded-full bg-cream/10" />
          <div className="h-4 w-80 rounded-full bg-cream/8" />
          <div className="h-56 w-full rounded-card bg-cream/8" />
          <div className="h-40 w-full rounded-card bg-cream/8" />
        </div>
        <p className="sr-only">Loading your progress…</p>
      </Section>
    );
  }

  /* ---------- signed out ---------- */
  if (!student) {
    return (
      <Section>
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 text-7xl animate-float" aria-hidden>
            📊
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Sign in to see your progress
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-cream-dim">
            Your ticks, your percentage and your next lesson all live behind your access code.
          </p>
          <div className="mt-8">
            <Btn href="/login" size="lg">
              🔑 Sign in
            </Btn>
          </div>
        </div>
      </Section>
    );
  }

  /* ---------- signed in ---------- */
  const remaining = Math.max(total - done, 0);
  const nextUp = allLessons.find((l) => !l.optional && !completed.has(l.slug)) ?? null;
  const nextUnit = nextUp ? unitById.get(nextUp.unitId) : undefined;
  /* Everything ticked off, grouped under the unit it came from. */
  const finishedByUnit = units
    .map((u) => ({ unit: u, lessons: u.lessons.filter((l) => completed.has(l.slug)) }))
    .filter((g) => g.lessons.length > 0);
  const transferCode = exportCode();

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(transferCode);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  }

  function handleImport() {
    const result = importCode(importValue);
    if (result.ok) {
      setImportValue('');
      setImportMsg({ ok: true, text: 'Progress merged! Your ticks are up to date. 🎉' });
    } else {
      setImportMsg({ ok: false, text: result.error });
    }
  }

  function handleReset() {
    reset();
    setConfirmingReset(false);
    setImportMsg(null);
  }

  return (
    <Section>
      {/* ---------- greeting ---------- */}
      <header className="mb-10 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            Hey {student.name} 👋
          </h1>
          <p className="mt-3 text-lg text-cream-dim">
            {done} of {total} lessons done.{' '}
            {remaining > 0 ? `${remaining} still to go.` : 'That is all of them. 🏆'}
          </p>
        </div>
        <Btn variant="ghost" onClick={signOut}>
          Sign out
        </Btn>
      </header>

      {/* ---------- next up ---------- */}
      <div className="card grid-dots p-7 sm:p-9">
        <div className="flex flex-col items-center gap-9 lg:flex-row">
          <div className="shrink-0">
            <ProgressRing pct={pct} />
          </div>

          <div className="w-full flex-1">
            {nextUp ? (
              <>
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-brand-400">
                  ⚡ Next up
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {nextUnit && (
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-2xl ring-1 ${accent(nextUnit.accent).bg} ${accent(nextUnit.accent).ring}`}
                      aria-hidden
                    >
                      {nextUnit.emoji}
                    </span>
                  )}
                  <span className="rounded-md bg-ink-900/60 px-2 py-0.5 font-mono text-xs font-bold text-cream-faint ring-1 ring-cream/10">
                    {nextUp.id}
                  </span>
                  {nextUnit && (
                    <span className={`text-xs font-bold uppercase tracking-[0.16em] ${accent(nextUnit.accent).text}`}>
                      {nextUnit.num === '★' ? 'Extras' : `Unit ${nextUnit.num}`}
                    </span>
                  )}
                </div>

                <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
                  {nextUp.title}
                </h2>
                <p className="mt-3 max-w-xl leading-relaxed text-cream-dim">{nextUp.blurb}</p>

                <div className="mt-7">
                  <Btn href={`/lessons/${nextUp.slug}`} size="lg">
                    Start this one →
                  </Btn>
                </div>
              </>
            ) : (
              <div className="rounded-card bg-lime/10 p-6 ring-1 ring-lime/30">
                <p className="font-display text-3xl font-extrabold text-lime">
                  🏆 You finished the whole course.
                </p>
                <p className="mt-3 text-cream-dim">
                  Every lesson ticked. Go build something nobody asked for.
                </p>
                <div className="mt-6">
                  <Btn href="/curriculum" variant="outline">
                    Go back through a lesson
                  </Btn>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- everything finished ---------- */}
      <h2 className="mt-16 mb-6 text-2xl font-extrabold sm:text-3xl">
        <span className="mr-2.5 align-middle" aria-hidden>
          ✅
        </span>
        Lessons you have finished
      </h2>

      {finishedByUnit.length === 0 ? (
        <Card>
          <p className="text-cream-dim">
            Nothing here yet. Tick a lesson off at the bottom of its page and it shows up here.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {finishedByUnit.map(({ unit, lessons }) => {
            const a = accent(unit.accent);
            const tracked = unit.lessons.filter((l) => !l.optional).length;
            const doneHere = lessons.filter((l) => !l.optional).length;
            return (
              <div key={unit.id} className="card overflow-hidden">
                <div className="flex flex-wrap items-center gap-3 border-b border-cream/8 px-5 py-4 sm:px-6">
                  <span className="text-xl" aria-hidden>
                    {unit.emoji}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-[0.16em] ${a.text}`}>
                    {unit.num === '★' ? 'Extras' : `Unit ${unit.num}`}
                  </span>
                  <span className="font-display text-lg font-bold">{unit.title}</span>
                  <Pill tone="good" className="ml-auto">
                    {doneHere} of {tracked}
                  </Pill>
                </div>
                <ul>
                  {lessons.map((l) => (
                    <li
                      key={l.slug}
                      className="flex flex-wrap items-center gap-3 border-t border-cream/8 px-5 py-3 first:border-t-0 hover:bg-cream/[0.03] sm:px-6"
                    >
                      <span
                        className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lime text-[11px] font-bold text-ink-900"
                        aria-hidden
                      >
                        ✓
                      </span>
                      <span className="rounded-md bg-ink-900/60 px-2 py-0.5 font-mono text-xs font-bold text-cream-faint ring-1 ring-cream/10">
                        {l.id}
                      </span>
                      <Link
                        href={`/lessons/${l.slug}`}
                        className="font-semibold transition-colors hover:text-brand-300"
                      >
                        {l.title}
                      </Link>
                      {l.optional && <Pill tone="muted">Side quest</Pill>}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* ---------- per-unit breakdown ---------- */}
      <h2 className="mt-16 mb-6 text-2xl font-extrabold sm:text-3xl">
        <span className="mr-2.5 align-middle" aria-hidden>
          🗺️
        </span>
        Unit by unit
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {units.map((u) => {
          const a = accent(u.accent);
          const stat = byUnit[u.id] ?? { done: 0, total: 0 };
          const complete = stat.total > 0 && stat.done === stat.total;
          return (
            <Card as="li" key={u.id} className="flex flex-col">
              <div className="flex items-start gap-4">
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl ring-1 ${a.bg} ${a.ring}`}
                  aria-hidden
                >
                  {u.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-bold uppercase tracking-[0.16em] ${a.text}`}>
                    {u.num === '★' ? 'Extras' : `Unit ${u.num}`}
                  </p>
                  <h3 className="mt-1 text-lg font-extrabold leading-snug">{u.title}</h3>
                </div>
                {complete && <Pill tone="good">✓ Done</Pill>}
              </div>

              <div className="mt-5">
                {stat.total > 0 ? (
                  <ProgressBar done={stat.done} total={stat.total} accent={a.dot} />
                ) : (
                  <p className="text-xs font-semibold text-cream-faint">Nothing tracked here yet</p>
                )}
              </div>

              <Link
                href={`/curriculum#${u.id}`}
                className={`mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${a.text} hover:text-cream`}
              >
                Open this unit
                <span aria-hidden>→</span>
              </Link>
            </Card>
          );
        })}
      </ul>

      {/* ---------- device transfer ---------- */}
      <h2 className="mt-16 mb-6 text-2xl font-extrabold sm:text-3xl">
        <span className="mr-2.5 align-middle" aria-hidden>
          📲
        </span>
        Move your progress to another device
      </h2>
      <div className="card p-6 sm:p-7">
        <p className="text-cream-dim">
          Your progress is saved in this browser, on this device. Copy the code below, sign in on
          the other device, then paste it there to merge everything together.
        </p>

        {/* export */}
        <div className="mt-6">
          <label
            htmlFor="transfer-code"
            className="block text-xs font-bold uppercase tracking-[0.16em] text-brand-400"
          >
            Your transfer code
          </label>
          <textarea
            id="transfer-code"
            readOnly
            rows={3}
            value={transferCode}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-3 w-full resize-none rounded-2xl border border-cream/12 bg-ink-800/80 px-4 py-3 text-xs font-mono leading-relaxed break-all text-cream-dim focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Btn variant="outline" onClick={handleCopy}>
              {copyState === 'copied' ? 'Copied! ✓' : 'Copy'}
            </Btn>
            <p aria-live="polite" className="text-sm font-semibold text-cream-faint">
              {copyState === 'copied' && <span className="text-lime">Code copied.</span>}
              {copyState === 'failed' && (
                <span className="text-pink">
                  Couldn&rsquo;t reach the clipboard — select the code and copy it yourself.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* import */}
        <div className="mt-8 border-t border-cream/10 pt-7">
          <label
            htmlFor="import-code"
            className="block text-xs font-bold uppercase tracking-[0.16em] text-brand-400"
          >
            Paste a code from another device
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              id="import-code"
              type="text"
              value={importValue}
              onChange={(e) => setImportValue(e.target.value)}
              placeholder="Paste the whole transfer code"
              autoComplete="off"
              spellCheck={false}
              className="min-w-0 flex-1 rounded-2xl border border-cream/12 bg-ink-800/80 px-4 py-3 text-sm font-mono text-cream placeholder:font-sans placeholder:text-cream-faint/70 focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
            <Btn onClick={handleImport} disabled={importValue.trim().length === 0}>
              Import
            </Btn>
          </div>
          <p aria-live="polite" className="mt-3 min-h-[1.25rem] text-sm font-semibold">
            {importMsg && (
              <span className={importMsg.ok ? 'text-lime' : 'text-pink'}>
                {importMsg.ok ? '✓ ' : '⚠️ '}
                {importMsg.text}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* ---------- start over ---------- */}
      <div className="mt-12 rounded-card border border-cream/8 bg-ink-800/40 p-6">
        {confirmingReset ? (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="font-semibold text-pink">
              Really reset? This clears all your ticks — every lesson goes back to unfinished.
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-full bg-pink/15 px-5 py-2.5 text-sm font-semibold text-pink ring-2 ring-pink/40 transition-all duration-200 hover:-translate-y-0.5 hover:bg-pink/25"
              >
                Yes, reset everything
              </button>
              <Btn variant="ghost" onClick={() => setConfirmingReset(false)}>
                Cancel
              </Btn>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-cream-faint">
              Want a totally clean slate? You can wipe your ticks and start the course again.
            </p>
            <Btn variant="ghost" onClick={() => setConfirmingReset(true)}>
              Start over
            </Btn>
          </div>
        )}
      </div>
    </Section>
  );
}
