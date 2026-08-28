import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import VideoEmbed from '@/components/VideoEmbed';
import { CompleteButton } from '@/components/Progress';
import { Btn, Card, Container, Pill, accent } from '@/components/ui';
import {
  allLessons,
  capstones,
  lessonBySlug,
  lessonNeighbours,
  unitById,
} from '@/data/curriculum';
import { links } from '@/data/site';
import type { Lesson, Resource, ResourceKind } from '@/lib/types';

type PageProps = { params: Promise<{ slug: string }> };

/* ------------------------------------------------------------------ *
 *  Static export: every lesson URL is pre-rendered at build time.
 * ------------------------------------------------------------------ */
export function generateStaticParams() {
  return allLessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = lessonBySlug.get(slug);
  if (!lesson) return { title: 'Lesson not found' };
  return { title: lesson.title, description: lesson.blurb };
}

/* ---------------- resources ---------------- */

const RESOURCE_EMOJI: Record<ResourceKind, string> = {
  slides: '🖼️',
  code: '💻',
  wiring: '🔌',
  form: '📝',
  download: '⬇️',
};

function ResourceChip({ resource }: { resource: Resource }) {
  const emoji = RESOURCE_EMOJI[resource.kind];
  const base =
    'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold ring-1 transition-all duration-200';

  if (!resource.url) {
    return (
      <span
        className={`${base} bg-cream/5 text-cream-faint ring-cream/8`}
        title="Not linked up yet"
      >
        <span aria-hidden>{emoji}</span>
        {resource.label}
        <span className="text-[10px] uppercase tracking-wider opacity-70">soon</span>
      </span>
    );
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-cream/8 text-cream-dim ring-cream/12 hover:-translate-y-0.5 hover:bg-brand-500/15 hover:text-brand-300 hover:ring-brand-500/30`}
    >
      <span aria-hidden>{emoji}</span>
      {resource.label}
      <span aria-hidden className="text-cream-faint">
        ↗
      </span>
    </a>
  );
}

/**
 * A Google Doc needs room to scroll; a slide deck is 4:3 and doesn't.
 * Both get a grid container so the iframe actually fills it.
 */
function EmbedPanel({ resource, lessonTitle }: { resource: Resource; lessonTitle: string }) {
  if (!resource.embed) return null;
  const isDoc = resource.embed.includes('/document/');

  return (
    <section className="overflow-hidden rounded-card border border-cream/12 bg-ink-800">
      <div className="flex items-center justify-between gap-4 border-b border-cream/10 px-4 py-3 sm:px-5">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-cream sm:text-lg">
          <span aria-hidden>{RESOURCE_EMOJI[resource.kind]}</span>
          {resource.label}
        </h3>
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-semibold text-cream-faint transition-colors hover:text-brand-300"
        >
          Open in Google ↗
        </a>
      </div>
      <div className={`grid bg-ink-800 ${isDoc ? 'min-h-[560px]' : 'aspect-[4/3]'}`}>
        <iframe
          src={resource.embed}
          className="h-full w-full"
          loading="lazy"
          allowFullScreen
          title={`${resource.label} for ${lessonTitle}`}
        />
      </div>
    </section>
  );
}

/* ---------------- prev / next ---------------- */

function NeighbourCard({ lesson, dir }: { lesson: Lesson; dir: 'prev' | 'next' }) {
  const isPrev = dir === 'prev';
  return (
    <Link href={`/lessons/${lesson.slug}`} className="block">
      <Card className={`h-full ${isPrev ? '' : 'text-right'}`}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-400">
          {isPrev ? '← Previous' : 'Next →'}
        </p>
        <p className="mt-3 text-xs font-semibold text-cream-faint">Lesson {lesson.id}</p>
        <p className="mt-1 font-display text-lg font-bold leading-snug text-cream group-hover:text-brand-300 sm:text-xl">
          {lesson.title}
        </p>
      </Card>
    </Link>
  );
}

/* ---------------- page ---------------- */

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const lesson = lessonBySlug.get(slug);
  if (!lesson) notFound();

  const unit = unitById.get(lesson.unitId);
  if (!unit) notFound();

  const a = accent(unit.accent);
  const { prev, next, index } = lessonNeighbours(slug);
  // The Extras section is numbered "★" — reading "Unit ★" would be odd.
  const unitLabel = unit.num === '★' ? unit.title : `Unit ${unit.num}`;
  const unitCrumb = unit.num === '★' ? unit.title : `Unit ${unit.num} ${unit.title}`;

  const project = lesson.project ? capstones.find((c) => c.letter === lesson.project) : undefined;
  const hasEmbeds = lesson.resources.some((r) => r.embed);
  const linkOnly = lesson.resources.filter((r) => !r.embed);

  return (
    <article className="pb-20">
      {/* ---- breadcrumb ---- */}
      <Container className="pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-cream-faint sm:text-sm">
            <li>
              <Link href="/" className="transition-colors hover:text-cream">
                Home
              </Link>
            </li>
            <li aria-hidden className="opacity-50">
              /
            </li>
            <li>
              <Link href="/curriculum" className="transition-colors hover:text-cream">
                Curriculum
              </Link>
            </li>
            <li aria-hidden className="opacity-50">
              /
            </li>
            <li>
              <Link
                href={`/curriculum#${unit.id}`}
                className={`transition-colors hover:text-cream ${a.text}`}
              >
                {unit.emoji} {unitCrumb}
              </Link>
            </li>
          </ol>
        </nav>
      </Container>

      {/* ---- header ---- */}
      <Container className="pt-8 sm:pt-10">
        <header className="max-w-3xl animate-rise">
          <p className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.2em] text-cream-faint">
            <span aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-full ${a.dot}`} />
            <span className={a.text}>{unitLabel}</span>
            <span aria-hidden className="opacity-40">
              ·
            </span>
            <span>Lesson {lesson.id}</span>
          </p>

          <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.08] sm:text-4xl lg:text-5xl">
            {lesson.title}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-cream-dim sm:text-xl">{lesson.blurb}</p>

          {(project || lesson.optional) && (
            <ul className="mt-6 flex flex-wrap items-center gap-2">
              {project && (
                <li>
                  <Link href="/curriculum#unit-5" className="inline-flex">
                    <Pill tone="brand">
                      <span aria-hidden>{project.emoji}</span>
                      Build {project.letter}: {project.name}
                    </Pill>
                  </Link>
                </li>
              )}
              {lesson.optional && (
                <li>
                  <Pill tone="neutral">✨ Side quest</Pill>
                </li>
              )}
            </ul>
          )}
        </header>
      </Container>

      {/* ---- video ---- */}
      <Container className="mt-10 sm:mt-12">
        <VideoEmbed src={lesson.video} title={lesson.title} />

        <div className="mt-6 flex flex-col gap-5 border-b border-cream/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <CompleteButton slug={lesson.slug} />

          {lesson.resources.length > 0 && (
            <ul className="flex flex-wrap items-center gap-2 lg:justify-end">
              {lesson.resources.map((r) => (
                <li key={`${r.kind}-${r.label}`}>
                  <ResourceChip resource={r} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>

      {/* ---- inline slides / wiring / code ---- */}
      {hasEmbeds && (
        <Container className="mt-10 sm:mt-12">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
            <span aria-hidden className="mr-2.5 align-middle">
              🧩
            </span>
            Follow along
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-cream-dim">
            The deck, the wiring picture and the code all sit right here. Scroll inside a panel to
            move through it. Want it bigger? Open it in Google.
          </p>

          <div className="mt-6 space-y-6">
            {lesson.resources
              .filter((r) => r.embed)
              .map((r) => (
                <EmbedPanel key={`${r.kind}-${r.label}`} resource={r} lessonTitle={lesson.title} />
              ))}
          </div>

          {linkOnly.length > 0 && (
            <ul className="mt-6 flex flex-wrap items-center gap-2">
              {linkOnly.map((r) => (
                <li key={`link-${r.kind}-${r.label}`}>
                  <ResourceChip resource={r} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      )}

      {/* ---- learn + materials ---- */}
      <Container className="mt-12 sm:mt-16">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:gap-10">
          {/* LEFT */}
          <div className="space-y-8">
            <section>
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
                <span aria-hidden className="mr-2.5 align-middle">
                  🎯
                </span>
                What you&rsquo;ll learn
              </h2>
              <ul className="mt-6 space-y-4">
                {lesson.learn.map((item) => (
                  <li key={item} className="flex items-start gap-3.5">
                    <span
                      aria-hidden
                      className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/15 text-[13px] font-bold text-brand-300 ring-1 ring-brand-500/30"
                    >
                      ✓
                    </span>
                    <span className="text-base leading-relaxed text-cream-dim sm:text-lg">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <Card className="bg-ink-600/50">
              <h3 className="font-display text-xl font-bold">
                <span aria-hidden className="mr-2">
                  🙋
                </span>
                Stuck?
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-cream-dim">
                A wire that will not behave. A red error you cannot read. Send it over and I will
                take a look. Or bring it to a live session and we fix it together, on the spot.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Btn href={links.askQuestion} variant="outline">
                  📝 Ask a question
                </Btn>
                <Btn href={links.scheduleMeeting} variant="ghost">
                  📅 Schedule a meeting
                </Btn>
              </div>
            </Card>
          </div>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-24">
            <Card>
              <h2 className="font-display text-xl font-bold">
                <span aria-hidden className="mr-2">
                  🧰
                </span>
                Materials needed
              </h2>
              <ul className="mt-5 space-y-3">
                {lesson.materials.map((m) => (
                  <li key={m} className="flex items-start gap-3 text-sm leading-relaxed text-cream-dim">
                    <span
                      aria-hidden
                      className={`mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full ${a.dot}`}
                    />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-cream/10 pt-5 text-xs leading-relaxed text-cream-faint">
                All of it ships in the kit. Nothing here needs a shopping trip.
              </p>
              <div className="mt-4">
                <Btn href="/kit" variant="outline" className="w-full">
                  📦 See what&rsquo;s in the kit
                </Btn>
              </div>
            </Card>
          </aside>
        </div>
      </Container>

      {/* ---- prev / next ---- */}
      <Container className="mt-16 sm:mt-20">
        <nav aria-label="Lesson navigation" className="grid gap-4 sm:grid-cols-2">
          {prev ? <NeighbourCard lesson={prev} dir="prev" /> : <div aria-hidden />}
          {next ? <NeighbourCard lesson={next} dir="next" /> : <div aria-hidden />}
        </nav>
      </Container>

      {/* ---- footer bar ---- */}
      <Container className="mt-8">
        <div className="flex flex-col items-start gap-3 rounded-full border border-cream/10 bg-ink-700/60 px-5 py-3.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="font-semibold text-cream-faint">
            Lesson <span className="text-cream">{index + 1}</span> of {allLessons.length}
          </p>
          <Link
            href={`/curriculum#${lesson.unitId}`}
            className="font-semibold text-brand-300 transition-colors hover:text-brand-400"
          >
            ← Back to {unitLabel}
          </Link>
        </div>
      </Container>
    </article>
  );
}
