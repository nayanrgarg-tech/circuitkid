import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import LessonBody from '@/components/LessonBody';
import { Container, Pill, accent } from '@/components/ui';
import { allLessons, capstones, lessonBySlug, lessonNeighbours, unitById } from '@/data/curriculum';

export function generateStaticParams() {
  return allLessons.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const lesson = lessonBySlug.get(slug);
  if (!lesson) return { title: 'Lesson not found' };
  return { title: lesson.title, description: lesson.blurb };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = lessonBySlug.get(slug);
  if (!lesson) notFound();

  const unit = unitById.get(lesson.unitId);
  const a = accent(unit?.accent ?? 'orange');
  const { prev, next } = lessonNeighbours(slug);
  const project = lesson.project ? capstones.find((c) => c.letter === lesson.project) : undefined;

  return (
    <article className="pb-20">
      <Container className="pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-cream-faint sm:text-sm">
            <li><Link href="/" className="hover:text-cream">Home</Link></li>
            <li aria-hidden className="opacity-50">/</li>
            <li><Link href="/curriculum" className="hover:text-cream">Curriculum</Link></li>
            {unit && (
              <>
                <li aria-hidden className="opacity-50">/</li>
                <li>
                  <Link href={`/curriculum#${unit.id}`} className={`hover:text-cream ${a.text}`}>
                    {unit.num === '★' ? 'Extras' : `Unit ${unit.num}`} {unit.title}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>
      </Container>

      <Container className="pt-8 sm:pt-10">
        <header className="max-w-3xl">
          <p className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.2em] text-cream-faint">
            <span aria-hidden className={`h-2.5 w-2.5 shrink-0 rounded-full ${a.dot}`} />
            <span className={a.text}>{unit?.num === '★' ? 'Extras' : `Unit ${unit?.num}`}</span>
            <span aria-hidden className="opacity-40">·</span>
            <span>Lesson {lesson.id}</span>
          </p>

          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-5xl">
            {lesson.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-cream-dim">{lesson.blurb}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {lesson.optional && <Pill tone="muted">Side quest</Pill>}
            {project && (
              <Link href="/curriculum#unit-5">
                <Pill tone="brand">Inventor Lab &middot; {project.name}</Pill>
              </Link>
            )}
          </div>
        </header>

        <LessonBody slug={lesson.slug} title={lesson.title} />

        {/* ---------- prev / next ---------- */}
        <nav className="mt-16 grid gap-4 sm:grid-cols-2" aria-label="Lesson navigation">
          {prev ? (
            <Link href={`/lessons/${prev.slug}`} className="card group p-5 transition-transform hover:-translate-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cream-faint">Previous</p>
              <p className="mt-2 font-display text-lg font-bold leading-snug group-hover:text-brand-600">
                {prev.id} &middot; {prev.title}
              </p>
            </Link>
          ) : <div aria-hidden />}
          {next ? (
            <Link href={`/lessons/${next.slug}`} className="card group p-5 text-right transition-transform hover:-translate-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-cream-faint">Next</p>
              <p className="mt-2 font-display text-lg font-bold leading-snug group-hover:text-brand-600">
                {next.id} &middot; {next.title}
              </p>
            </Link>
          ) : <div aria-hidden />}
        </nav>

        <p className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t-2 border-ink-line pt-5 text-sm text-cream-faint">
          <span>Lesson {lesson.id}</span>
          {unit && (
            <Link href={`/curriculum#${unit.id}`} className="font-bold underline underline-offset-4 hover:text-brand-600">
              Back to {unit.num === '★' ? 'Extras' : `Unit ${unit.num}`}
            </Link>
          )}
        </p>
      </Container>
    </article>
  );
}
