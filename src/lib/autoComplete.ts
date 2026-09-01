/**
 * Ticks a lesson off once the student has actually worked through it.
 *
 * Two signals, because lessons differ:
 *
 *   Lesson with a video  → they have watched most of it (WATCHED_FRACTION).
 *                          A three minute lesson and a twenty minute one should
 *                          not need the same stopwatch, so we ask YouTube how
 *                          far through they are rather than guessing.
 *   Lesson without one   → ACTIVE_MINUTES of real attention on the page.
 *                          Used for the tour and the two challenge lessons, and
 *                          as the fallback if YouTube's player API is blocked.
 *
 * "Active" excludes a hidden tab, an unfocused window, and going idle. Leaving
 * a laptop open on a lesson does not tick it off.
 *
 * Nothing here is stored or sent anywhere. It only decides when to call the same
 * toggle the student's own button calls, and they can always untick it.
 */

/** How much of the video counts as watched. */
export const WATCHED_FRACTION = 0.85;
/** Attention needed on a lesson that has no video. */
export const ACTIVE_MINUTES = 4;

const IDLE_AFTER_MS = 60_000;
const TICK_MS = 2_000;

type Stop = () => void;

/** True while the student is plausibly present and looking at the page. */
function makePresenceCheck(): { active: () => boolean; dispose: Stop } {
  let lastInput = Date.now();
  const bump = () => { lastInput = Date.now(); };
  const events = ['keydown', 'mousemove', 'mousedown', 'wheel', 'touchstart', 'scroll'] as const;
  for (const e of events) window.addEventListener(e, bump, { passive: true });
  return {
    active: () =>
      document.visibilityState === 'visible' &&
      document.hasFocus() &&
      Date.now() - lastInput < IDLE_AFTER_MS,
    dispose: () => {
      for (const e of events) window.removeEventListener(e, bump);
    },
  };
}

/* ---------------- YouTube player API ---------------- */

type YTPlayer = { getCurrentTime: () => number; getDuration: () => number; destroy: () => void };
type YTNamespace = { Player: new (el: Element | string, opts: unknown) => YTPlayer };
declare global {
  interface Window { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void }
}

let apiPromise: Promise<YTNamespace | null> | null = null;

/** Loads YouTube's iframe API once. Resolves null if it cannot be loaded. */
function loadYouTubeApi(): Promise<YTNamespace | null> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);

    const done = (v: YTNamespace | null) => resolve(v);
    const timeout = window.setTimeout(() => done(null), 8000);

    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      window.clearTimeout(timeout);
      done(window.YT ?? null);
    };

    if (!document.querySelector('script[data-yt-api]')) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      s.dataset.ytApi = 'true';
      s.onerror = () => { window.clearTimeout(timeout); done(null); };
      document.head.appendChild(s);
    }
  });
  return apiPromise;
}

/**
 * Watches one lesson and calls `onComplete` once, when it has been worked
 * through. `iframeId` is the video's iframe when there is one.
 */
export function watchLesson(opts: {
  iframeId: string | null;
  onComplete: () => void;
}): Stop {
  if (typeof window === 'undefined') return () => {};

  const presence = makePresenceCheck();
  let fired = false;
  let cancelled = false;
  let player: YTPlayer | null = null;
  let activeMs = 0;
  let lastTick = Date.now();

  const finish = () => {
    if (fired) return;
    fired = true;
    opts.onComplete();
  };

  /* Fallback / no-video path: bank attention until the threshold. */
  const interval = window.setInterval(() => {
    const now = Date.now();
    const delta = now - lastTick;
    lastTick = now;
    if (fired) return;

    /* The player is only trusted once it reports a real duration. If YouTube's
       API is blocked, slow, or never hands us a ready player, we must not sit
       here forever — the timer below is the backstop in that case. */
    if (player) {
      try {
        const dur = player.getDuration();
        if (dur > 0) {
          if (player.getCurrentTime() / dur >= WATCHED_FRACTION) finish();
          return; // a working player judges the lesson, not the clock
        }
      } catch {
        player = null; // player went away; the timer takes over
      }
    }

    if (presence.active() && delta > 0) {
      activeMs += delta;
      if (activeMs >= ACTIVE_MINUTES * 60_000) finish();
    }
  }, TICK_MS);

  if (opts.iframeId) {
    void loadYouTubeApi().then((YT) => {
      if (cancelled || !YT) return; // blocked → the timer above still applies
      const el = document.getElementById(opts.iframeId!);
      if (!el) return;
      try {
        player = new YT.Player(el, {});
      } catch {
        player = null;
      }
    });
  }

  return () => {
    cancelled = true;
    window.clearInterval(interval);
    presence.dispose();
    try { player?.destroy(); } catch { /* already gone */ }
  };
}
