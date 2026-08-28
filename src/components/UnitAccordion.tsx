'use client';

/**
 * One expandable unit on the curriculum page.
 *
 * Each lesson keeps its video inside a <details> so only the slots a
 * student actually opens ever mount an iframe — the full course is 60+
 * lessons and mounting every embed at once would tank the page.
 */

import { useCallback, useEffect, useId, useState } from 'react';
import Link from 'next/link';
import VideoEmbed from '@/components/VideoEmbed';
import { DoneTick, ProgressBar } from '@/components/Progress';
import { Pill, accent } from '@/components/ui';
import { capstones } from '@/data/curriculum';
import { useProgressStats, useStudent } from '@/lib/student';
import type { Lesson, Resource, ResourceKind, Unit } from '@/lib/types';

const RESOURCE_EMOJI: Record<ResourceKind, string> = {
  slides: '🖼️',
  code: '💻',
  wiring: '🔌',
  download: '⬇️',
  form: '📝',
};

/** A resource with an empty url exists but isn't linked yet — show it, don't link it. */
function ResourceChip({ resource }: { resource: Resource }) {
  const emoji = RESOURCE_EMOJI[resource.kind];
  const base =
    'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 transition-colors';

  if (!resource.url) {
    return (
      <span
        className={`${base} cursor-default bg-cream/5 text-cream-faint ring-cream/8`}
        title="Not linked yet"
      >
        <span aria-hidden>{emoji}</span>
        {resource.label}
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">soon</span>
      </span>
    );
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-cream/8 text-cream-dim ring-cream/12 hover:bg-brand-500/15 hover:text-brand-300 hover:ring-brand-500/30`}
    >
      <span aria-hidden>{emoji}</span>
      {resource.label}
    </a>
  );
}

function LessonRow({ lesson }: { lesson: Lesson }) {
  const { lesson: contentFor } = useStudent();
  const content = contentFor(lesson.slug);
  return (
    <li className="border-t border-cream/8 px-5 py-5 transition-colors hover:bg-cream/[0.03] sm:px-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <DoneTick slug={lesson.slug} />
        <span className="rounded-md bg-ink-900/60 px-2 py-0.5 font-mono text-xs font-bold tabular-nums text-cream-faint ring-1 ring-cream/10">
          {lesson.id}
        </span>
        <Link
          href={`/lessons/${lesson.slug}`}
          className="font-display text-lg font-bold leading-snug transition-colors hover:text-brand-300"
        >
          {lesson.title}
        </Link>

        <span className="flex flex-wrap items-center gap-1.5 sm:ml-auto">
          {lesson.optional && <Pill tone="muted">Side quest</Pill>}
        </span>
      </div>

      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-cream-faint">{lesson.blurb}</p>

      {content ? (
        <>
          {content.resources.length > 0 && (
            <ul className="mt-3 flex flex-wrap items-center gap-1.5">
              {content.resources.map((r) => (
                <li key={`${r.kind}-${r.label}`}>
                  <ResourceChip resource={r} />
                </li>
              ))}
            </ul>
          )}
          <details className="group/vid mt-3">
            <summary className="inline-flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border-2 border-ink-line bg-ink-700 px-3 py-1.5 text-xs font-bold transition-transform hover:-translate-y-0.5 [&::-webkit-details-marker]:hidden">
              <span className="transition-transform duration-200 group-open/vid:rotate-90" aria-hidden>
                &rsaquo;
              </span>
              Watch here
            </summary>
            <div className="mt-3 max-w-2xl">
              <VideoEmbed src={content.video} title={lesson.title} />
            </div>
          </details>
        </>
      ) : (
        <p className="mt-3 text-xs font-semibold text-cream-faint">
          <Link href="/login" className="underline underline-offset-4 hover:text-brand-600">
            Sign in
          </Link>{' '}
          to watch this lesson and open its code and wiring.
        </p>
      )}
    </li>
  );
}

type ProjectGroup = {
  letter: string;
  /** The capstone name, or undefined if the letter has no capstone. */
  name?: string;
  lessons: Lesson[];
};

const capstoneName = new Map(capstones.map((c) => [c.letter, c.name]));

/**
 * The Inventor Lab arrives as one flat run: the intro, then every project's
 * lessons back to back. Split it so each build reads as its own block. A
 * letter with no lessons gets no group, so nothing empty ever renders.
 */
function groupByProject(lessons: Lesson[]): { intro: Lesson[]; groups: ProjectGroup[] } {
  const intro = lessons.filter((l) => !l.project);
  const letters = [...new Set(lessons.flatMap((l) => (l.project ? [l.project] : [])))].sort();

  return {
    intro,
    groups: letters.map((letter) => ({
      letter,
      name: capstoneName.get(letter),
      lessons: lessons.filter((l) => l.project === letter),
    })),
  };
}

/** One project: a banded heading in the unit accent, then its lessons. */
function ProjectBlock({
  group,
  unitAccent,
}: {
  group: ProjectGroup;
  unitAccent: Unit['accent'];
}) {
  const a = accent(unitAccent);
  return (
    <li>
      <div className={`border-t-2 border-ink-line px-5 py-3.5 sm:px-6 ${a.bg}`}>
        <h4 className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <span
            className={`h-3 w-3 shrink-0 rounded-full border-2 border-ink-line ${a.dot}`}
            aria-hidden
          />
          <span
            className={`font-sans text-[11px] font-bold uppercase tracking-[0.18em] ${a.text}`}
          >
            Project {group.letter}
          </span>
          {group.name && (
            <>
              <span className="text-cream-faint" aria-hidden>
                ·
              </span>
              <span className="text-lg font-extrabold leading-tight">{group.name}</span>
            </>
          )}
        </h4>
      </div>
      <ul>
        {group.lessons.map((lesson) => (
          <LessonRow key={lesson.slug} lesson={lesson} />
        ))}
      </ul>
    </li>
  );
}

export default function UnitAccordion({ unit }: { unit: Unit }) {
  const [open, setOpen] = useState(unit.id === 'unit-0');
  const reactId = useId();
  const panelId = `${reactId}panel`;
  const { byUnit } = useProgressStats();

  const trackedCount = unit.lessons.filter((l) => !l.optional).length;
  const progress = byUnit[unit.id] ?? { done: 0, total: trackedCount };
  const a = accent(unit.accent);
  const grouped = unit.id === 'unit-5' ? groupByProject(unit.lessons) : null;

  // Deep links like /curriculum#unit-3 should land on an open unit — on first
  // paint and when the hash changes while already on the page.
  const syncToHash = useCallback(() => {
    if (window.location.hash === `#${unit.id}`) setOpen(true);
  }, [unit.id]);

  useEffect(() => {
    syncToHash();
    window.addEventListener('hashchange', syncToHash);
    return () => window.removeEventListener('hashchange', syncToHash);
  }, [syncToHash]);

  return (
    <section id={unit.id} className="scroll-mt-24">
      <div
        className={`card overflow-hidden transition-colors duration-300 ${
          open ? 'border-cream/16' : 'hover:border-cream/16'
        }`}
      >
        {/* ---- header ---- */}
        <h3>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={panelId}
            className="flex w-full flex-col gap-4 p-5 text-left font-sans sm:flex-row sm:items-center sm:gap-6 sm:p-6"
          >
            <span
              className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl ring-1 ${a.bg} ${a.ring}`}
              aria-hidden
            >
              {unit.emoji}
            </span>

            <span className="min-w-0 flex-1">
              <span
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] ${a.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} aria-hidden />
                Unit {unit.num}
              </span>
              <span className="mt-1.5 block font-display text-2xl font-extrabold leading-tight sm:text-[1.7rem]">
                {unit.title}
              </span>
              <span className="mt-1 block text-sm text-cream-faint">{unit.tagline}</span>
            </span>

            <svg
              viewBox="0 0 24 24"
              className={`h-5 w-5 shrink-0 text-cream-faint transition-transform duration-300 ${
                open ? 'rotate-180' : ''
              }`}
              aria-hidden
            >
              <path
                d="m6 9 6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </h3>

        {/* Progress lives just below the header row — a <div> with its own
            progressbar role can't legally sit inside the <button>. */}
        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <ProgressBar
            done={progress.done}
            total={progress.total}
            accent={a.dot}
            className="max-w-sm"
          />
        </div>

        {/* ---- body ----
            Always rendered, never conditionally mounted: the served HTML has to
            contain all 72 lesson rows so search engines and any reader without
            JS still get the whole curriculum. Collapsing is done with an
            animatable 0fr/1fr grid row plus `inert`, which keeps the hidden
            rows out of the accessibility tree and out of the tab order. */}
        <div
          id={panelId}
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden" inert={!open}>
            <p className="border-t border-cream/8 bg-ink-900/25 px-5 py-4 text-sm leading-relaxed text-cream-dim sm:px-6">
              {unit.blurb}
            </p>
            <ul>
              {(grouped ? grouped.intro : unit.lessons).map((lesson) => (
                <LessonRow key={lesson.slug} lesson={lesson} />
              ))}
              {grouped?.groups.map((group) => (
                <ProjectBlock key={group.letter} group={group} unitAccent={unit.accent} />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
