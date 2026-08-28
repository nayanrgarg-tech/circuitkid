'use client';

/**
 * Everything on a lesson page that needs an access code: the video, the slides,
 * the code, the wiring, the materials list and the learning goals.
 *
 * The server renders only the outline (title, blurb, where it sits in the
 * course). This component asks the student context for the decrypted content
 * and renders a locked state until there is some.
 */

import Link from 'next/link';
import VideoEmbed from '@/components/VideoEmbed';
import { CompleteButton } from '@/components/Progress';
import { Btn, Pill } from '@/components/ui';
import { useStudent } from '@/lib/student';
import type { Resource, ResourceKind } from '@/lib/types';

const RESOURCE_ICON: Record<ResourceKind, string> = {
  slides: '▤', code: '⌘', wiring: '⏦', form: '✎', download: '↓',
};

function ResourceChip({ resource }: { resource: Resource }) {
  const base =
    'inline-flex items-center gap-1.5 rounded-full border-2 border-ink-line px-3 py-1 text-xs font-bold';
  if (!resource.url) {
    return (
      <span className={`${base} cursor-default opacity-50`} title="Not linked yet">
        <span aria-hidden>{RESOURCE_ICON[resource.kind]}</span>
        {resource.label}
      </span>
    );
  }
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} bg-ink-700 transition-transform hover:-translate-y-0.5`}
    >
      <span aria-hidden>{RESOURCE_ICON[resource.kind]}</span>
      {resource.label}
    </a>
  );
}

export default function LessonBody({ slug, title }: { slug: string; title: string }) {
  const { ready, student, lesson } = useStudent();
  const content = lesson(slug);

  if (!ready) {
    return (
      <div className="mt-8 animate-pulse space-y-5" aria-hidden>
        <div className="aspect-video w-full rounded-card bg-ink-600" />
        <div className="h-11 w-56 rounded-full bg-ink-600" />
      </div>
    );
  }

  /* ---------------- locked ---------------- */
  if (!student || !content) {
    return (
      <section className="mt-8">
        <div className="card grid place-items-center px-6 py-16 text-center">
          <div className="max-w-md">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-600">
              Members only
            </p>
            <h2 className="mt-3 font-display text-3xl font-extrabold leading-tight">
              This lesson is locked
            </h2>
            <p className="mt-4 leading-relaxed text-cream-dim">
              The video, the wiring diagram and the code all come with the kit. Sign in with
              the access code that came with yours.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Btn href="/login" size="lg">Sign in</Btn>
              <Btn href="/kit" variant="outline">Get a kit</Btn>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- unlocked ---------------- */
  const embeds = content.resources.filter((r) => r.embed);
  const linkOnly = content.resources.filter((r) => !r.embed);

  return (
    <>
      <div className="mt-8">
        <VideoEmbed src={content.video} title={title} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <CompleteButton slug={slug} />
        {linkOnly.length > 0 && (
          <span className="ml-auto flex flex-wrap gap-2">
            {linkOnly.map((r) => <ResourceChip key={`${r.kind}-${r.label}`} resource={r} />)}
          </span>
        )}
      </div>

      {embeds.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Follow along</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-cream-dim">
            The deck, the wiring picture and the code all sit right here. Scroll inside a panel
            to move through it.
          </p>
          <div className="mt-6 space-y-8">
            {embeds.map((r) => (
              <div key={`${r.kind}-${r.label}`} className="card overflow-hidden p-0">
                <div className="flex items-center gap-3 border-b-2 border-ink-line px-5 py-3">
                  <span aria-hidden>{RESOURCE_ICON[r.kind]}</span>
                  <span className="font-display text-lg font-bold">{r.label}</span>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs font-bold underline underline-offset-4 hover:text-brand-600"
                  >
                    Open in Google
                  </a>
                </div>
                <div className={r.embed?.includes('/document/') ? 'min-h-[560px]' : 'aspect-[4/3]'}>
                  <iframe
                    src={r.embed ?? undefined}
                    title={`${r.label} for ${title}`}
                    className="h-full w-full"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <section>
          <h2 className="font-display text-2xl font-extrabold sm:text-3xl">What you&rsquo;ll learn</h2>
          <ul className="mt-5 space-y-3">
            {content.learn.map((item) => (
              <li key={item} className="flex gap-3 leading-relaxed">
                <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="card mt-8 p-6">
            <h3 className="font-display text-lg font-bold">Stuck?</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-dim">
              Everyone gets stuck. Start with the troubleshooting lesson, then ask.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Btn href="/lessons/troubleshooting" variant="outline">Troubleshooting</Btn>
              <Btn href="/contact" variant="ghost">Ask a question</Btn>
            </div>
          </div>
        </section>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="font-display text-xl font-extrabold">Materials needed</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {content.materials.map((m) => (
                <li key={m} className="flex gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cream-faint" aria-hidden />
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-cream-faint">
              All of this ships in the CircuitKid kit.
            </p>
            <div className="mt-4">
              <Link href="/kit" className="text-sm font-bold underline underline-offset-4 hover:text-brand-600">
                What&rsquo;s in the kit
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
