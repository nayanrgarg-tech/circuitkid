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
  createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode,
} from 'react';
import roster from '@/data/roster.json';
import { trackedLessons, units } from '@/data/curriculum';
import { asset } from '@/data/site';
import { openCourse, sha256Hex, unwrapCourseKey, type RosterEntry } from './courseKey';
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
};

const C = createContext<Ctx | null>(null);
const normalize = (s: string) => s.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
const students = roster.students as RosterEntry[];
const validSlugs = new Set(trackedLessons.map((l) => l.slug));

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

    let entry: RosterEntry | undefined;
    try {
      const hash = await sha256Hex(cleaned);
      entry = students.find((s) => s.hash === hash);
    } catch {
      return { ok: false, error: 'This browser blocked the sign-in check. Try Chrome or Safari.' };
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
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...next, key } satisfies Session));
    } catch { /* ignore */ }
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setStudent(null);
    setContent(null);
    setCompleted(new Set());
    try { localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }, []);

  const toggle = useCallback((slug: string) => {
    if (!student) return;
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      writeProgress(student.id, next);
      return next;
    });
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

  const value = useMemo<Ctx>(() => ({
    ready, student, content,
    lesson: (slug) => content?.[slug] ?? null,
    signIn, signOut, completed,
    isDone: (slug) => completed.has(slug),
    toggle, reset, exportCode, importCode,
  }), [ready, student, content, signIn, signOut, completed, toggle, reset, exportCode, importCode]);

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
