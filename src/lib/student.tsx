'use client';

/**
 * Student session + lesson progress.
 *
 * ── How logins work ──────────────────────────────────────────────────
 * You issue an access code with `npm run issue-login -- "Ava"`. Only the
 * SHA-256 hash lands in src/data/roster.json, so the roster is safe to
 * commit and deploy. At sign-in the browser hashes what the student typed
 * and looks for a matching hash.
 *
 * ── What this is and isn't ───────────────────────────────────────────
 * This is a *soft gate*: enough to give every student their own identity
 * and their own progress, and to keep the lesson area off-limits to
 * randoms. It is NOT content security — a static site ships all of its
 * HTML and JS to every visitor, so a determined person can read lesson
 * text without a code. For course material that is the right trade-off.
 * See README ("Upgrading to real accounts") if you ever need more.
 *
 * ── Progress ─────────────────────────────────────────────────────────
 * Stored in localStorage, per student, on the device being used. The
 * dashboard can emit a transfer code so a student can carry progress to
 * another device.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import roster from '@/data/roster.json';
import { trackedLessons, units } from '@/data/curriculum';

const SESSION_KEY = 'circuitkid.session.v1';
const progressKey = (id: string) => `circuitkid.progress.v1.${id}`;

export type Student = { id: string; name: string };

type SignInResult = { ok: true } | { ok: false; error: string };

type StudentContext = {
  /** false until localStorage has been read (avoids a hydration flash) */
  ready: boolean;
  student: Student | null;
  signIn: (code: string) => Promise<SignInResult>;
  signOut: () => void;
  completed: Set<string>;
  isDone: (slug: string) => boolean;
  toggle: (slug: string) => void;
  reset: () => void;
  /** Portable snapshot the student can paste on another device. */
  exportCode: () => string;
  importCode: (code: string) => SignInResult;
};

const Ctx = createContext<StudentContext | null>(null);

const normalize = (s: string) => s.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

async function sha256Hex(input: string) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const validSlugs = new Set(trackedLessons.map((l) => l.slug));

function readProgress(id: string): Set<string> {
  try {
    const raw = localStorage.getItem(progressKey(id));
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as { completed?: unknown };
    if (!Array.isArray(parsed.completed)) return new Set();
    // Drop anything that is no longer a real lesson slug.
    return new Set(parsed.completed.filter((s): s is string => typeof s === 'string' && validSlugs.has(s)));
  } catch {
    return new Set();
  }
}

function writeProgress(id: string, completed: Set<string>) {
  try {
    localStorage.setItem(
      progressKey(id),
      JSON.stringify({ completed: [...completed], updatedAt: new Date().toISOString() }),
    );
  } catch {
    /* private mode / storage disabled — progress just won't persist */
  }
}

export function StudentProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Restore the session on first paint.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Student;
        const stillOnRoster = roster.students.some((s) => s.id === saved.id);
        if (stillOnRoster) {
          setStudent(saved);
          setCompleted(readProgress(saved.id));
        } else {
          localStorage.removeItem(SESSION_KEY); // login was revoked
        }
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const signIn = useCallback(async (code: string): Promise<SignInResult> => {
    const cleaned = normalize(code);
    if (!cleaned) return { ok: false, error: 'Type your access code to get in.' };
    let hash: string;
    try {
      hash = await sha256Hex(cleaned);
    } catch {
      return { ok: false, error: 'This browser blocked the sign-in check. Try Chrome or Safari.' };
    }
    const match = roster.students.find((s) => s.hash === hash);
    if (!match) {
      return { ok: false, error: "That code didn't work. Check for typos, or ask for a new one." };
    }
    const next: Student = { id: match.id, name: match.name };
    setStudent(next);
    setCompleted(readProgress(next.id));
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setStudent(null);
    setCompleted(new Set());
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(
    (slug: string) => {
      if (!student) return;
      setCompleted((prev) => {
        const next = new Set(prev);
        if (next.has(slug)) next.delete(slug);
        else next.add(slug);
        writeProgress(student.id, next);
        return next;
      });
    },
    [student],
  );

  const reset = useCallback(() => {
    if (!student) return;
    setCompleted(new Set());
    writeProgress(student.id, new Set());
  }, [student]);

  const exportCode = useCallback(() => {
    const payload = JSON.stringify({ v: 1, id: student?.id ?? '', c: [...completed] });
    // btoa needs latin1; lesson slugs are ASCII so this is safe.
    return btoa(payload).replace(/=+$/, '');
  }, [student, completed]);

  const importCode = useCallback(
    (code: string): SignInResult => {
      if (!student) return { ok: false, error: 'Sign in first, then paste your transfer code.' };
      try {
        const padded = code.trim() + '='.repeat((4 - (code.trim().length % 4)) % 4);
        const parsed = JSON.parse(atob(padded)) as { v?: number; c?: unknown };
        if (parsed.v !== 1 || !Array.isArray(parsed.c)) throw new Error('bad payload');
        const merged = new Set(completed);
        for (const s of parsed.c) if (typeof s === 'string' && validSlugs.has(s)) merged.add(s);
        setCompleted(merged);
        writeProgress(student.id, merged);
        return { ok: true };
      } catch {
        return { ok: false, error: "That transfer code didn't look right. Copy the whole thing." };
      }
    },
    [student, completed],
  );

  const value = useMemo<StudentContext>(
    () => ({
      ready,
      student,
      signIn,
      signOut,
      completed,
      isDone: (slug: string) => completed.has(slug),
      toggle,
      reset,
      exportCode,
      importCode,
    }),
    [ready, student, signIn, signOut, completed, toggle, reset, exportCode, importCode],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStudent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStudent must be used inside <StudentProvider>');
  return ctx;
}

/** Completion counts for the whole course and for one unit. */
export function useProgressStats() {
  const { completed } = useStudent();
  return useMemo(() => {
    const total = trackedLessons.length;
    const done = trackedLessons.filter((l) => completed.has(l.slug)).length;
    const byUnit = Object.fromEntries(
      units.map((u) => {
        const tracked = u.lessons.filter((l) => !l.optional);
        return [
          u.id,
          {
            done: tracked.filter((l) => completed.has(l.slug)).length,
            total: tracked.length,
          },
        ];
      }),
    ) as Record<string, { done: number; total: number }>;
    return { done, total, pct: total ? Math.round((done / total) * 100) : 0, byUnit };
  }, [completed]);
}
