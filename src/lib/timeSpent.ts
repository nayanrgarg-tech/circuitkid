/**
 * How long a student actually spends on each lesson.
 *
 * Counts ACTIVE time only. The clock stops when the tab is hidden, the window
 * loses focus, or there has been no keyboard/mouse/touch activity for a while.
 * Without that, leaving a tab open overnight would report 8 hours of study.
 *
 * Stored per student, in their own browser, next to their progress.
 */

const IDLE_AFTER_MS = 60_000; // no input for a minute = not studying
const TICK_MS = 5_000;        // how often we bank the time
const MAX_SESSION_MS = 4 * 60 * 60 * 1000; // sanity cap per lesson

export type TimeMap = Record<string, number>; // slug -> seconds

export const timeKey = (studentId: string) => `circuitkid.time.v1.${studentId}`;

export function readTime(studentId: string): TimeMap {
  try {
    const raw = localStorage.getItem(timeKey(studentId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { seconds?: unknown };
    if (!parsed.seconds || typeof parsed.seconds !== 'object') return {};
    const out: TimeMap = {};
    for (const [slug, v] of Object.entries(parsed.seconds as Record<string, unknown>)) {
      if (typeof v === 'number' && Number.isFinite(v) && v >= 0) out[slug] = Math.round(v);
    }
    return out;
  } catch {
    return {};
  }
}

export function writeTime(studentId: string, seconds: TimeMap) {
  try {
    localStorage.setItem(
      timeKey(studentId),
      JSON.stringify({ seconds, updatedAt: new Date().toISOString() }),
    );
  } catch {
    /* storage disabled — timing just won't persist */
  }
}

/** Human-readable, and deliberately coarse. "4 min", "1 hr 20 min". */
export function formatSpent(seconds: number) {
  if (seconds < 60) return 'under a minute';
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

/**
 * Starts an active-time clock for one lesson. Returns a stop function that banks
 * whatever is owed. Safe to call with a null studentId (then it does nothing).
 */
export function startLessonClock(
  studentId: string | null,
  slug: string,
  onBank?: (seconds: TimeMap) => void,
) {
  if (!studentId || typeof window === 'undefined') return () => {};

  let lastInput = Date.now();
  let accrued = 0;         // ms banked this visit, for the cap
  let lastTick = Date.now();

  const bump = () => { lastInput = Date.now(); };
  const events: (keyof WindowEventMap)[] = [
    'keydown', 'mousemove', 'mousedown', 'wheel', 'touchstart', 'scroll',
  ];
  for (const e of events) window.addEventListener(e, bump, { passive: true });

  const active = () =>
    document.visibilityState === 'visible' &&
    document.hasFocus() &&
    Date.now() - lastInput < IDLE_AFTER_MS;

  const bank = () => {
    const now = Date.now();
    const elapsed = now - lastTick;
    lastTick = now;
    if (!active() || elapsed <= 0) return;
    if (accrued >= MAX_SESSION_MS) return;
    accrued += elapsed;

    const map = readTime(studentId);
    map[slug] = (map[slug] ?? 0) + Math.round(elapsed / 1000);
    writeTime(studentId, map);
    onBank?.(map);
  };

  const timer = window.setInterval(bank, TICK_MS);
  // Bank on the way out too, so short visits still register.
  const onHide = () => bank();
  document.addEventListener('visibilitychange', onHide);
  window.addEventListener('pagehide', onHide);

  return () => {
    bank();
    window.clearInterval(timer);
    for (const e of events) window.removeEventListener(e, bump);
    document.removeEventListener('visibilitychange', onHide);
    window.removeEventListener('pagehide', onHide);
  };
}
