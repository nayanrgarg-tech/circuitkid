import type { Metadata } from 'next';
import Image from 'next/image';
import { Btn, Card, Container, Pill, Section, SectionHead, accent } from '@/components/ui';
import { asset, gallery, kitContents, links, site } from '@/data/site';
import { stats } from '@/data/curriculum';

export const metadata: Metadata = {
  title: 'The Kit',
  description: `Every part needed for all ${stats.lessons} ${site.name} lessons and all ${stats.capstones} capstone projects — an Arduino UNO R4, 30+ sensor modules, screens, motors and a robot car chassis, shipped in one organized box.`,
};

/** 🔎 The five things people ask about first. */
const highlights = [
  { emoji: '🧠', label: 'Arduino UNO R4 Minima', tone: 'orange' },
  { emoji: '🔌', label: '830-pt breadboard + wires', tone: 'cyan' },
  { emoji: '📟', label: 'LCD + OLED screens', tone: 'violet' },
  { emoji: '🎛️', label: '30+ snap-in sensor modules', tone: 'lime' },
  { emoji: '🚗', label: '2WD robot car chassis', tone: 'amber' },
] as const;

const groupCount = kitContents.length;
const partCount = kitContents.reduce((sum, group) => sum + group.items.length, 0);

export default function KitPage() {
  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <Section className="pt-12 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="animate-rise">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
              The hardware
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              The <span className="text-brand-400">CircuitKid</span> Kit
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-dim sm:text-xl">
              Every part you need for all {stats.lessons} lessons and all {stats.capstones}{' '}
              capstone projects, shipped to your door in one box — already sorted into labeled
              cases so nothing is a mystery bag of parts on day one.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Btn href={links.signUp} size="lg">
                Sign up for a kit →
              </Btn>
              <Btn href="/curriculum" variant="outline" size="lg">
                See what you&apos;ll build
              </Btn>
            </div>
            <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-cream-faint">
              <Pill tone="brand">{site.ages}</Pill>
              <Pill tone="neutral">No experience needed</Pill>
              <Pill tone="neutral">Reusable forever</Pill>
            </p>
          </div>

          {/* The decorative glow bleeds past its box, so clip it here — at 375px
              an unclipped -inset-6 pushed the whole page 4px wide. */}
          <div className="relative isolate overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-brand-500/15 blur-3xl"
            />
            <div className="overflow-hidden rounded-card border border-cream/12 bg-ink-700/60 shadow-2xl shadow-brand-900/40">
              <Image
                src={asset('/images/kit/kit-lcd-build.jpg')}
                alt="Arduino UNO R4 wired to a breadboard and an LCD screen showing a message"
                width={1600}
                height={1064}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------- highlights */}
      <Container>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {highlights.map((item) => {
            const a = accent(item.tone);
            return (
              <li
                key={item.label}
                className={`flex flex-col gap-2 rounded-card px-4 py-5 ring-1 transition-transform duration-300 hover:-translate-y-1 ${a.bg} ${a.ring}`}
              >
                <span className="text-2xl" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className={`text-sm font-semibold leading-snug ${a.text}`}>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </Container>

      {/* ----------------------------------------------------- gallery */}
      <Section>
        <SectionHead
          emoji="📸"
          title="A look inside the box"
          sub="These are real photos of the actual kit sitting on my desk — not stock images, not renders. What you see is what shows up."
        />
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {gallery.map((photo, i) => (
            <li
              key={photo.src}
              className={`group relative overflow-hidden rounded-card border border-cream/10 bg-ink-700/60 ${
                i === 0 ? 'md:col-span-2' : ''
              }`}
            >
              <div className={i === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'}>
                <Image
                  src={asset(photo.src)}
                  alt={photo.alt}
                  width={1600}
                  height={1064}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink-900 via-ink-900/60 to-transparent"
              />
              <p className="absolute inset-x-0 bottom-0 p-4 text-sm font-semibold text-cream sm:text-base">
                {photo.caption}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* --------------------------------------------- what's included */}
      <Section className="border-y border-cream/10 bg-ink-800/50">
        <SectionHead
          emoji="📦"
          title="Every single part"
          sub="No upgrade packs, no “sold separately” surprises halfway through the course. Here is the whole bill of materials."
        />
        <p className="mb-8 text-sm font-semibold uppercase tracking-[0.15em] text-brand-300">
          {groupCount} labeled groups · {partCount} listed parts
        </p>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {kitContents.map((group) => (
            <Card key={group.group} as="li">
              <h3 className="flex items-start gap-2.5 text-lg font-bold leading-snug">
                <span className="text-xl" aria-hidden="true">
                  {group.emoji}
                </span>
                {group.group}
              </h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-cream-dim">
                    <span
                      aria-hidden="true"
                      className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------------- also needed */}
      <Section>
        <div className="card grid gap-6 p-7 sm:p-9 md:grid-cols-[auto_1fr] md:items-start">
          <span className="text-4xl" aria-hidden="true">
            🔋
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold sm:text-3xl">What you&apos;ll need at home</h2>
              <Pill tone="muted">Not in the box</Pill>
            </div>
            <ul className="mt-5 space-y-3 text-cream-dim">
              <li className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"
                />
                <span>
                  A Windows or Mac computer, to run the{' '}
                  <a
                    href={links.arduinoSoftware}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-300 underline decoration-brand-500/40 underline-offset-4 hover:text-brand-400"
                  >
                    Arduino IDE
                  </a>
                  . It&apos;s a free download, and Lesson 1 walks through installing it.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-amber"
                />
                <span>4 × AA batteries for the motor and robot car projects.</span>
              </li>
            </ul>
            <p className="mt-5 text-sm text-cream-faint">That&apos;s genuinely it.</p>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------ sign up */}
      <Section className="pb-20 sm:pb-28">
        <div className="grid-dots relative overflow-hidden rounded-card border border-brand-500/30 bg-brand-500/10 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <span className="text-4xl animate-float inline-block" aria-hidden="true">
              📬
            </span>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
              Ready to get a kit?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cream-dim">
              Fill out the sign-up form and Nayan will reply with the details — pricing, shipping,
              and how to get started on Lesson 1. That form is how you request a kit; there&apos;s
              no checkout to rush through.
            </p>
            <div className="mt-9 flex justify-center">
              <Btn href={links.signUp} size="lg">
                Open the sign-up form →
              </Btn>
            </div>
            <p className="mt-7 text-sm text-cream-faint">
              Questions first? Email{' '}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-brand-300 underline decoration-brand-500/40 underline-offset-4 hover:text-brand-400"
              >
                {site.email}
              </a>{' '}
              or call{' '}
              <a
                href={`tel:${site.phone}`}
                className="font-semibold text-brand-300 hover:text-brand-400"
              >
                {site.phoneLabel}
              </a>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
