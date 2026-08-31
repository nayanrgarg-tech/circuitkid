'use client';

/**
 * Student session, course unlocking, and lesson progress.
 *
 * ── Signing in ───────────────────────────────────────────────────────
 * You issue an access code with `npm run issue-login -- "Ava"`. The roster
 * stores a SHA-256 of the code (a cheap way to find the right entry) plus the
 * course key wrapped under that code. Signing in:
 *
 *   code → SHA-256 → find entry → PBKDF2 → unwrap course key
 *        → decrypt public/course.enc.json → lesson content
 *
 * ── What this does and doesn't protect ───────────────────────────────
 * Lesson content — the unlisted video URLs, slides, code and wiring — is
 * genuinely encrypted. It is not in the JS bundle and not in the HTML. Without
 * a valid code it is ciphertext.
 *
 * The course *outline* (unit and lesson titles) is deliberately public, so the
 * curriculum page still works as a shop window and search engines can read it.
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
  type ReactNode,
} from 'react';
import roster from '@/data/roster.json';
import { allLessons, trackedLessons, units } from '@/data/curriculum';
import { asset } from '@/data/site';
import { openCourse, sha256Hex, unwrapCourseKey, type RosterEntry } from './courseKey';
import { flushReportQueue, report } from './report';
import { readTime, startLessonClock, type TimeMap } from './timeSpent';
import type { LessonContent } from './types';

const SESSION_KEY = 'circuitkid.session.v2';
const progressKey = (id: string) => `circuitkid.progress.v1.${id}`;

export type Student = { id: string; name: string };
type Session = Student & { key: string };
type Result = { ok: true } | { ok: false; error: string };

type Ctx = {
  ready: boolean;
  student: Student | null;
  /** Decrypted lesson content, keyed by slug. null until signed in. */
  content: Record<string, LessonContent> | null;
  /** Convenience: content for one lesson, or null while locked. */
  lesson: (slug: string) => LessonContent | null;
  signIn: (code: string) => Promise<Result>;
  signOut: () => void;
  completed: Set<string>;
  isDone: (slug: string) => boolean;
  toggle: (slug: string) => void;
  reset: () => void;
  exportCode: () => string;
  importCode: (code: string) => Result;
  /** Active seconds per lesson slug, for this student on this device. */
  timeSpent: TimeMap;
  /** Starts the active-time clock for a lesson. Returns a stop function. */
  trackLesson: (slug: string) => () => void;
};

const C = createContext<Ctx | null>(null);
const normalize = (s: string) => s.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
const students = roster.students as RosterEntry[];
/* Every lesson can be ticked, side quests included. trackedLessons is only
   used for the percentage denominator, never for validating saved progress. */
const validSlugs = new Set(allLessons.map((l) => l.slug));
const labelBySlug = new Map(allLessons.map((l) => [l.slug, `${l.id} ${l.title}`]));
const lessonLabel = (slug: string) => labelBySlug.get(slug) ?? slug;

function readProgress(id: string): Set<string> {
  try {
    const raw = localStorage.getItem(progressKey(id));
    if (!raw) return new Set();
    const p = JSON.parse(raw) as { completed?: unknown };
    if (!Array.isArray(p.completed)) return new Set();
    return new Set(p.completed.filter((s): s is string => typeof s === 'string' && validSlugs.has(s)));
  } catch { return new Set(); }
}

function writeProgress(id: string, completed: Set<string>) {
  try {
    localStorage.setItem(progressKey(id), JSON.stringify({
      completed: [...completed], updatedAt: new Date().toISOString(),
    }));
  } catch { /* private mode — progress just won't persist */ }
}

/** Fetch + decrypt the sealed course. Cached so we only do it once per load. */
let coursePromise: Promise<{ iv: string; data: string }> | null = null;
function fetchSealed() {
  if (!coursePromise) coursePromise = fetch(asset('/course.enc.json')).then((r) => {
    if (!r.ok) throw new Error(`course file ${r.status}`);
    return r.json();
  });
  return coursePromise;
}

export function StudentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [content, setContent] = useState<Record<string, LessonContent> | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [timeSpent, setTimeSpent] = useState<TimeMap>({});
  const completedRef = useRef<Set<string>>(new Set());

  // Restore a session and re-open the course with the stored key.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Session;
          if (students.some((s) => s.id === saved.id)) {
            setStudent({ id: saved.id, name: saved.name });
            setCompleted(readProgress(saved.id));
            setTimeSpent(readTime(saved.id));
            void flushReportQueue();
            try {
              const opened = await openCourse(saved.key, await fetchSealed());
              if (!cancelled) setContent(opened);
            } catch { /* key no longer opens it — they can sign in again */ }
          } else {
            localStorage.removeItem(SESSION_KEY); // revoked
          }
        }
      } catch { /* ignore */ }
      if (!cancelled) setReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const signIn = useCallback(async (code: string): Promise<Result> => {
    const cleaned = normalize(code);
    if (!cleaned) return { ok: false, error: 'Type your access code to get in.' };

    // Web Crypto only exists on a secure origin (https, or localhost). On plain
    // http it is undefined, and no code can possibly work — say so plainly rather
    // than blaming the student's typing.
    if (!window.isSecureContext || !window.crypto?.subtle) {
      return {
        ok: false,
        error:
          location.protocol === 'http:'
            ? 'Signing in needs a secure connection. Open this site with https:// instead of http://.'
            : 'This browser cannot run the sign-in check. Try Chrome, Safari or Firefox.',
      };
    }

    let entry: RosterEntry | undefined;
    try {
      const hash = await sha256Hex(cleaned);
      entry = students.find((s) => s.hash === hash);
    } catch {
      return { ok: false, error: 'This browser cannot run the sign-in check. Try Chrome, Safari or Firefox.' };
    }
    if (!entry) return { ok: false, error: "That code didn't work. Check for typos, or ask for a new one." };

    let key: string;
    try {
      key = await unwrapCourseKey(entry, cleaned);
    } catch {
      return { ok: false, error: 'That login needs to be re-issued. Ask for a new code.' };
    }

    let opened: Record<string, LessonContent>;
    try {
      opened = await openCourse(key, await fetchSealed());
    } catch {
      return { ok: false, error: "Couldn't open the lessons. Check your connection and try again." };
    }

    const next: Student = { id: entry.id, name: entry.name };
    setStudent(next);
    setContent(opened);
    setCompleted(readProgress(next.id));
    setTimeSpent(readTime(next.id));
    void flushReportQueue();
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...next, key } satisfies Session));
    } catch { /* ignore */ }
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setStudent(null);
    setContent(null);
    setCompleted(new Set());
    setTimeSpent({});
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }, []);

  const toggle = useCallback((slug: string) => {
    if (!student) return;
    setCompleted((prev) => {
      const next = new Set(prev);
      const nowDone = !next.has(slug);
      nowDone ? next.add(slug) : next.delete(slug);
      writeProgress(student.id, next);

      const times = readTime(student.id);
      const totalMins = Math.round(
        Object.values(times).reduce((a, b) => a + b, 0) / 60,
      );
      void report({
        student: student.name,
        lesson: lessonLabel(slug),
        status: nowDone ? 'done' : 'unmarked',
        minutes: Math.round((times[slug] ?? 0) / 60),
        total: totalMins,
      });
      return next;
    });
  }, [student]);

  /* Runs an active-time clock for one lesson and reports the total when the
     student leaves, so time shows up even on lessons they never tick off. */
  const trackLesson = useCallback((slug: string) => {
    if (!student) return () => {};
    const stop = startLessonClock(student.id, slug, setTimeSpent);
    return () => {
      stop();
      const times = readTime(student.id);
      const secs = times[slug] ?? 0;
      if (secs >= 60) {
        void report({
          student: student.name,
          lesson: lessonLabel(slug),
          status: completedRef.current.has(slug) ? 'done' : 'opened',
          minutes: Math.round(secs / 60),
          total: Math.round(Object.values(times).reduce((a, b) => a + b, 0) / 60),
        });
      }
    };
  }, [student]);

  const reset = useCallback(() => {
    if (!student) return;
    setCompleted(new Set());
    writeProgress(student.id, new Set());
  }, [student]);

  const exportCode = useCallback(
    () => btoa(JSON.stringify({ v: 1, id: student?.id ?? '', c: [...completed] })).replace(/=+$/, ''),
    [student, completed],
  );

  const importCode = useCallback((code: string): Result => {
    if (!student) return { ok: false, error: 'Sign in first, then paste your transfer code.' };
    try {
      const padded = code.trim() + '='.repeat((4 - (code.trim().length % 4)) % 4);
      const parsed = JSON.parse(atob(padded)) as { v?: number; c?: unknown };
      if (parsed.v !== 1 || !Array.isArray(parsed.c)) throw new Error('bad');
      const merged = new Set(completed);
      for (const s of parsed.c) if (typeof s === 'string' && validSlugs.has(s)) merged.add(s);
      setCompleted(merged);
      writeProgress(student.id, merged);
      return { ok: true };
    } catch {
      return { ok: false, error: "That transfer code didn't look right. Copy the whole thing." };
    }
  }, [student, completed]);

  useEffect(() => { completedRef.current = completed; }, [completed]);

  const value = useMemo<Ctx>(() => ({
    ready, student, content,
    lesson: (slug) => content?.[slug] ?? null,
    signIn, signOut, completed,
    isDone: (slug) => completed.has(slug),
    toggle, reset, exportCode, importCode, timeSpent, trackLesson,
  }), [ready, student, content, signIn, signOut, completed, toggle, reset, exportCode,
       importCode, timeSpent, trackLesson]);

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useStudent() {
  const ctx = useContext(C);
  if (!ctx) throw new Error('useStudent must be used inside <StudentProvider>');
  return ctx;
}

export function useProgressStats() {
  const { completed } = useStudent();
  return useMemo(() => {
    const total = trackedLessons.length;
    const done = trackedLessons.filter((l) => completed.has(l.slug)).length;
    const byUnit = Object.fromEntries(units.map((u) => {
      const tracked = u.lessons.filter((l) => !l.optional);
      return [u.id, { done: tracked.filter((l) => completed.has(l.slug)).length, total: tracked.length }];
    })) as Record<string, { done: number; total: number }>;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0, byUnit };
  }, [completed]);
}
