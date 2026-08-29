'use client';

/**
 * Announcements — posted with `npm run announce`, read out of
 * src/data/announcements.json.
 *
 * Two surfaces:
 *   <AnnouncementBanner />  one bar at the top of the home page, dismissable
 *   <AnnouncementList />    the whole notice board, on the dashboard
 *
 * The list uses no hooks, so it renders the same on the server as in the
 * browser. The banner needs localStorage, which is why this module is a
 * client module.
 *
 * The file can be empty. Everything here renders nothing when it is — no
 * empty state, no gap where a bar would have been.
 */

import { useEffect, useState } from 'react';

import { Card, Container, Pill } from '@/components/ui';
import data from '@/data/announcements.json';

export type Announcement = {
  id: string;
  date: string;
  title: string;
  body?: string;
  pinned: boolean;
};

/** Dismissed id lives here. Written on click, read once on mount. */
const DISMISSED_KEY = 'circuitkid.dismissed-announcement';

/**
 * Pinned first, then newest first. The dates are ISO, so a string compare
 * is a date compare.
 */
export const announcements: Announcement[] = [...(data.items as Announcement[])].sort(
  (a, b) => Number(b.pinned) - Number(a.pinned) || b.date.localeCompare(a.date),
);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * "2026-08-29" → "Aug 29, 2026". Done by hand rather than with Date, so the
 * server and the browser can never disagree about the timezone.
 */
function formatDate(iso: string): string {
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!parts) return iso;
  const month = MONTHS[Number(parts[2]) - 1];
  if (!month) return iso;
  return `${month} ${Number(parts[3])}, ${parts[1]}`;
}

/** localStorage throws outright in some privacy modes. Never let it take the page down. */
function readDismissed(): string | null {
  try {
    return localStorage.getItem(DISMISSED_KEY);
  } catch {
    return null;
  }
}

function writeDismissed(id: string) {
  try {
    localStorage.setItem(DISMISSED_KEY, id);
  } catch {
    /* private mode — the bar comes back next visit */
  }
}

/* ------------------------------------------------------------------ */

/**
 * The one announcement that matters, as a slim bar above the hero.
 * Dismissing it remembers that id, so it stays gone until a newer
 * announcement takes the top slot.
 */
export function AnnouncementBanner() {
  const top = announcements[0] ?? null;
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState<string | null>(null);

  // Nothing renders on the first pass, so the markup can't disagree with
  // whatever this browser has stored.
  useEffect(() => {
    setDismissed(readDismissed());
    setMounted(true);
  }, []);

  if (!mounted || !top || dismissed === top.id) return null;

  return (
    <Container className="pt-6 sm:pt-8">
      <div className="relative -rotate-[0.35deg] rounded-card border-[3px] border-ink-line bg-amber/25 px-5 py-4 hard-shadow sm:px-6">
        <div className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                Announcement
              </span>
              <time dateTime={top.date} className="text-xs font-semibold text-cream-dim">
                {formatDate(top.date)}
              </time>
            </div>

            <p className="mt-1.5 font-display text-lg font-bold leading-snug sm:text-xl">
              {top.title}
            </p>

            {top.body && (
              <p className="mt-1.5 text-sm leading-relaxed text-cream-dim">{top.body}</p>
            )}
          </div>

          <button
            type="button"
            aria-label="Dismiss announcement"
            onClick={() => {
              writeDismissed(top.id);
              setDismissed(top.id);
            }}
            className="press grid h-9 w-9 shrink-0 place-items-center rounded-full border-[3px] border-ink-line bg-ink-700 font-display text-lg font-bold leading-none text-cream hard-shadow-xs hover:bg-brand-500/12"
          >
            <span aria-hidden>×</span>
          </button>
        </div>
      </div>
    </Container>
  );
}

/**
 * Every announcement, pinned ones first. No hooks, so this is safe from a
 * server component too.
 */
export function AnnouncementList() {
  if (announcements.length === 0) return null;

  return (
    <ul className="space-y-6">
      {announcements.map((a) => (
        <Card as="li" key={a.id} className="flex flex-col">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <time
              dateTime={a.date}
              className="text-xs font-bold uppercase tracking-[0.16em] text-brand-600"
            >
              {formatDate(a.date)}
            </time>
            {a.pinned && <Pill tone="brand">Pinned</Pill>}
          </div>

          <h3 className="mt-2 font-display text-xl font-bold leading-snug">{a.title}</h3>

          {a.body && <p className="mt-2 leading-relaxed text-cream-dim">{a.body}</p>}
        </Card>
      ))}
    </ul>
  );
}
