'use client';

/**
 * The stepped walkthrough that stands in for a video on lesson 0.2.
 *
 * Every picture here is drawn with divs and the site's own tokens, never a
 * screenshot. The old recording of the site went stale the week the site
 * changed; a diagram this simple only ever drifts a little.
 */

import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { Btn, Pill } from '@/components/ui';

/* ---------------- illustration parts ----------------
   All of this is decorative. The whole art column is aria-hidden, so nothing
   in here needs a label. */

/** Stands in for a line of text. */
function Bar({ w, tone = 'bg-ink-400', h = 'h-2' }: { w: string; tone?: string; h?: string }) {
  return <span className={`block shrink-0 rounded-full ${h} ${w} ${tone}`} />;
}

/** Stands in for the little lesson-number chip. */
function Chip() {
  return <span className="h-3 w-6 shrink-0 rounded border-2 border-ink-line bg-ink-700" />;
}

/** Stands in for the video. */
function Screen({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`grid place-items-center rounded-lg border-[3px] border-ink-line bg-ink-500 ${
        small ? 'h-14' : 'aspect-video'
      }`}
    >
      <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-ink-line bg-brand-500 text-[11px] text-cream">
        &#9654;
      </span>
    </div>
  );
}

/** The page the diagram sits on. */
function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="w-full rounded-card border-[3px] border-ink-line bg-ink-700 p-3.5 hard-shadow-sm">
      {children}
    </div>
  );
}

function ArtCurriculum() {
  return (
    <Frame>
      <div className="space-y-2.5">
        <div className="rounded-lg border-2 border-ink-line bg-ink-600">
          <div className="flex items-center gap-2 px-2.5 py-2">
            <span className="h-3.5 w-3.5 shrink-0 rounded-full border-2 border-ink-line bg-lime" />
            <Bar w="w-24" tone="bg-ink-line" />
            <span className="ml-auto rotate-90 text-[11px] font-bold leading-none text-cream-faint">
              &rsaquo;
            </span>
          </div>
          <ul className="space-y-2.5 border-t-2 border-ink-line bg-ink-700 px-2.5 py-3">
            {['w-28', 'w-20', 'w-24'].map((w) => (
              <li key={w} className="flex items-center gap-2">
                <Chip />
                <Bar w={w} />
              </li>
            ))}
          </ul>
        </div>
        {[
          { dot: 'bg-cyan', w: 'w-20' },
          { dot: 'bg-violet', w: 'w-16' },
        ].map((u) => (
          <div
            key={u.dot}
            className="flex items-center gap-2 rounded-lg border-2 border-ink-line bg-ink-600 px-2.5 py-2"
          >
            <span className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 border-ink-line ${u.dot}`} />
            <Bar w={u.w} tone="bg-ink-line" />
            <span className="ml-auto text-[11px] font-bold leading-none text-cream-faint">
              &rsaquo;
            </span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function ArtLesson() {
  return (
    <Frame>
      <Bar w="w-16" h="h-1.5" tone="bg-brand-500" />
      <div className="mt-2.5 space-y-2">
        <Bar w="w-3/4" h="h-3" tone="bg-ink-line" />
        <Bar w="w-1/2" h="h-1.5" />
      </div>
      <div className="mt-3.5">
        <Screen />
      </div>
    </Frame>
  );
}

function ArtFollow() {
  return (
    <Frame>
      <Screen small />
      <div className="mt-2.5 grid grid-cols-3 gap-2">
        {[
          { icon: '▤', tone: 'bg-amber' },
          { icon: '⌘', tone: 'bg-cyan' },
          { icon: '⏦', tone: 'bg-pink' },
        ].map((panel) => (
          <div key={panel.icon} className="rounded-lg border-2 border-ink-line bg-ink-600 p-2">
            <span
              className={`grid h-5 w-5 place-items-center rounded border-2 border-ink-line text-[9px] leading-none text-cream ${panel.tone}`}
            >
              {panel.icon}
            </span>
            <span className="mt-2 block space-y-1.5">
              <Bar w="w-full" h="h-1.5" />
              <Bar w="w-2/3" h="h-1.5" />
            </span>
          </div>
        ))}
      </div>
    </Frame>
  );
}

function ArtSide() {
  return (
    <Frame>
      <div className="grid grid-cols-[1.5fr_1fr] gap-2.5">
        <div>
          <Bar w="w-2/3" h="h-2.5" tone="bg-ink-line" />
          <ul className="mt-3 space-y-2.5">
            {['w-full', 'w-5/6', 'w-4/6'].map((w) => (
              <li key={w} className="flex items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                <Bar w={w} h="h-1.5" />
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border-2 border-ink-line bg-ink-600 p-2">
          <Bar w="w-3/4" h="h-2" tone="bg-ink-line" />
          <ul className="mt-2.5 space-y-2">
            {['w-full', 'w-4/5', 'w-3/5', 'w-2/3'].map((w) => (
              <li key={w} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cream-faint" />
                <Bar w={w} h="h-1.5" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Frame>
  );
}

function ArtTick() {
  return (
    <Frame>
      <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink-line bg-lime px-2.5 py-1 text-[10px] font-bold text-cream hard-shadow-xs">
        <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-ink-700 text-[8px] leading-none">
          &#10003;
        </span>
        Completed
      </span>

      <div className="mt-3.5 h-3 w-full overflow-hidden rounded-full border-2 border-ink-line bg-ink-600">
        <span className="block h-full w-2/5 rounded-full bg-brand-500" />
      </div>

      <ul className="mt-3.5 space-y-2.5">
        {['w-24', 'w-20'].map((w) => (
          <li key={w} className="flex items-center gap-2">
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-ink-line bg-lime text-[8px] leading-none text-cream">
              &#10003;
            </span>
            <Chip />
            <Bar w={w} />
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function ArtReady() {
  return (
    <Frame>
      <div className="grid grid-cols-3 gap-2">
        {[
          { dot: 'bg-lime', done: true },
          { dot: 'bg-cyan', done: false },
          { dot: 'bg-violet', done: false },
        ].map((tile) => (
          <div key={tile.dot} className="rounded-lg border-2 border-ink-line bg-ink-600 p-2">
            <div className="flex items-center gap-1.5">
              <span className={`h-3 w-3 shrink-0 rounded-full border-2 border-ink-line ${tile.dot}`} />
              {tile.done && (
                <span className="ml-auto grid h-4 w-6 shrink-0 place-items-center rounded-full border-2 border-ink-line bg-lime text-[9px] leading-none text-cream">
                  &#10003;
                </span>
              )}
            </div>
            <span className="mt-2 block space-y-1.5">
              <Bar w="w-full" h="h-1.5" />
              <Bar w="w-2/3" h="h-1.5" />
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" />
        <Bar w="w-1/2" h="h-2" tone="bg-ink-line" />
      </div>
    </Frame>
  );
}

/* ---------------- the steps ---------------- */

type Step = {
  /** Short name, used on the step dots. */
  label: string;
  title: string;
  lines: string[];
  art: ReactNode;
};

const STEPS: Step[] = [
  {
    label: 'Curriculum',
    title: 'Where the lessons live',
    lines: [
      'Every lesson sits on the curriculum page.',
      'The big boxes are units. Click one to open it.',
      'The lessons are inside. Click a lesson title to go to it.',
    ],
    art: <ArtCurriculum />,
  },
  {
    label: 'Lesson page',
    title: 'The top of a lesson',
    lines: [
      'The video comes first.',
      'Watch it once. Then get your parts out and build along with it.',
    ],
    art: <ArtLesson />,
  },
  {
    label: 'Follow along',
    title: 'Everything under the video',
    lines: [
      'The slides, the code and the wiring picture stay on the page.',
      'Nothing to hunt for. Scroll inside a panel to move through it.',
    ],
    art: <ArtFollow />,
  },
  {
    label: 'The side',
    title: 'Parts and goals',
    lines: [
      'Materials needed lists the parts to grab.',
      'What you’ll learn says what the lesson is for.',
      'Read both before you start building.',
    ],
    art: <ArtSide />,
  },
  {
    label: 'Progress',
    title: 'Tick it off',
    lines: [
      'Built it? Press Mark as complete.',
      'A green tick shows up next to that lesson in the curriculum.',
      'Your dashboard adds the ticks up for you.',
    ],
    art: <ArtTick />,
  },
  {
    label: 'Done',
    title: 'That is the whole site',
    lines: ['You know your way around now.', 'Start at Unit 0 and work down the list.'],
    art: <ArtReady />,
  },
];

/* ---------------- the tour ---------------- */

export default function SiteTour() {
  const [index, setIndex] = useState(0);

  const total = STEPS.length;
  const step = STEPS[index];
  const last = index === total - 1;

  const go = (n: number) => setIndex(Math.min(total - 1, Math.max(0, n)));

  // Arrows move the tour whenever focus is inside it: the dots, either button,
  // or the panel itself after a click on the background.
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(index + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(index - 1);
    }
  };

  return (
    <section
      aria-label="Interactive tour of the site"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="card overflow-hidden"
    >
      <div className="flex flex-wrap items-center gap-3 border-b-[3px] border-ink-line px-5 py-4 sm:px-7">
        <h2 className="font-display text-lg font-extrabold">Take the tour</h2>
        <Pill tone="muted" className="ml-auto">
          Step {index + 1} of {total}
        </Pill>
      </div>

      <div className="grid-dots bg-ink-600 px-5 py-7 sm:px-7 sm:py-9">
        <div
          key={step.label}
          className="grid animate-rise gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] sm:items-center sm:gap-9"
        >
          <div aria-hidden className="mx-auto w-full max-w-xs sm:mx-0 sm:max-w-none">
            {step.art}
          </div>
          <div>
            <h3 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              {step.title}
            </h3>
            <div className="mt-4 space-y-3 text-lg leading-relaxed text-cream-dim">
              {step.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p aria-live="polite" className="sr-only">
        Step {index + 1} of {total}. {step.title}.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 border-t-[3px] border-ink-line px-5 py-4 sm:justify-between sm:px-7">
        <Btn variant="outline" onClick={() => go(index - 1)} disabled={index === 0}>
          Back
        </Btn>

        <div role="group" aria-label="Jump to a step" className="flex items-center gap-2">
          {STEPS.map((s, n) => (
            <button
              key={s.label}
              type="button"
              onClick={() => go(n)}
              aria-label={`Step ${n + 1}: ${s.label}`}
              aria-current={n === index ? 'step' : undefined}
              className={`h-3.5 rounded-full border-2 border-ink-line transition-all duration-200 ease-bounce ${
                n === index ? 'w-8 bg-brand-500' : 'w-3.5 bg-ink-700 hover:bg-brand-400'
              }`}
            />
          ))}
        </div>

        {/* Full width once it wraps onto its own line, so the way forward is
            always the biggest thing to press. */}
        {last ? (
          <Btn href="/curriculum" className="w-full sm:w-auto">
            Go to the curriculum
          </Btn>
        ) : (
          <Btn onClick={() => go(index + 1)} className="w-full sm:w-auto">
            Next
          </Btn>
        )}
      </div>
    </section>
  );
}
