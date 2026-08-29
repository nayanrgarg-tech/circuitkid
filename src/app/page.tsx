import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { AnnouncementBanner } from '@/components/Announcements';
import StatCounter from '@/components/StatCounter';
import { Btn, Card, Container, Pill, Section, SectionHead, accent } from '@/components/ui';
import { capstones, stats, units } from '@/data/curriculum';
import { asset, links, showcase, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Robotics & Arduino video lessons for kids',
  description: site.description,
};

/** Two real photos, hung in the hero like pictures on a fridge. */
const HERO_SHOTS = [
  {
    src: '/images/kit/kit-lcd-build.jpg',
    alt: "An Arduino UNO R4 wired to a breadboard and an LCD reading 'I heart Arduino'",
    caption: 'The screen build, straight out of the box',
    tilt: 'rotate-[-2.5deg]',
  },
  {
    src: '/images/kit/kit-robot-car.jpg',
    alt: 'The two-wheel-drive robot car chassis with its motors and wheels',
    caption: 'The car, before it learns to dodge',
    tilt: 'rotate-[2deg]',
  },
] as const;

const STEPS = [
  {
    title: 'Watch it',
    tone: 'bg-cyan',
    body:
      'Short videos, plain English. Every new word gets explained the first time it shows up, not three lessons later.',
  },
  {
    title: 'Wire it up',
    tone: 'bg-amber',
    body:
      'Pause and build the circuit on your breadboard. Every wire is on screen, pin by pin. Rewind as often as you need.',
  },
  {
    title: 'Run the code',
    tone: 'bg-lime',
    body:
      'Copy the sketch out of the workbook and hit upload. Then change a number and see what breaks. That part is the whole point.',
  },
] as const;

/** Candy tile behind each Inventor Lab project letter. */
const PROJECT_TONE: Record<string, string> = {
  A: 'bg-pink',
  B: 'bg-cyan',
  C: 'bg-violet',
  D: 'bg-amber',
  E: 'bg-lime',
};

/** Word tile that visually matches <StatCounter/> but never counts. */
function WordTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      {/* StatCounter still renders an (empty) icon slot above its number.
          This spacer keeps all four tiles sitting on the same line. */}
      <div className="mb-1.5 text-2xl" aria-hidden />
      <div className="font-display text-4xl font-extrabold text-brand-400 sm:text-5xl">{value}</div>
      <div className="mt-1.5 text-sm font-semibold uppercase tracking-wider text-cream-faint">
        {label}
      </div>
    </div>
  );
}

export default function HomePage() {
  const courseUnits = units.filter((u) => u.num !== '★');

  return (
    <>
      {/* Renders nothing at all when there is no announcement, so the hero
          keeps its place. */}
      <AnnouncementBanner />

      {/* ------------------------------------------------ 1. HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-dots opacity-60" />

        <Container className="relative grid min-h-[78vh] items-center gap-14 py-20 sm:py-28 lg:min-h-[84vh] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-3xl">
            <div className="animate-rise">
              <Pill tone="brand">{site.ages} · No experience needed</Pill>
            </div>

            <h1
              className="mt-6 animate-rise font-display text-6xl font-extrabold leading-[0.92] sm:text-7xl lg:text-8xl"
              style={{ animationDelay: '0.08s' }}
            >
              Circuit<span className="text-brand-500">Kid</span>
            </h1>

            <p
              className="mt-4 animate-rise font-display text-2xl font-bold text-cream sm:text-3xl"
              style={{ animationDelay: '0.14s' }}
            >
              Learn robotics by building robots.
            </p>

            <p
              className="mt-6 max-w-2xl animate-rise text-lg leading-relaxed text-cream-dim sm:text-xl"
              style={{ animationDelay: '0.2s' }}
            >
              A video course for kids who want to build robots. A real Arduino kit shows up at your
              door and you start building with it the same day. First a blinking light. That sounds
              small until it is your light, and you are the one who made it blink. By the end you
              have a car that drives itself around the living room. Nobody starts this course
              knowing how to code.
            </p>

            <div
              className="mt-9 flex animate-rise flex-col gap-3 sm:flex-row sm:items-center"
              style={{ animationDelay: '0.26s' }}
            >
              <Btn href={links.signUp} external size="lg">
                Get the kit →
              </Btn>
              <Btn href="/curriculum" variant="outline" size="lg">
                See the curriculum
              </Btn>
            </div>

            <p
              className="mt-6 animate-rise text-sm font-semibold text-cream-faint"
              style={{ animationDelay: '0.32s' }}
            >
              Live help every week. Bring whatever is broken and we fix it together.
            </p>
          </div>

          <ul
            className="hidden animate-rise flex-col items-center lg:flex"
            style={{ animationDelay: '0.24s' }}
          >
            {HERO_SHOTS.map((shot, i) => (
              <li
                key={shot.src}
                className={`polaroid tape relative w-full max-w-[320px] p-3 pb-5 transition-transform duration-300 hover:rotate-0 ${shot.tilt} ${
                  i === 1 ? 'mt-4 ml-16' : ''
                }`}
              >
                <Image
                  src={asset(shot.src)}
                  alt={shot.alt}
                  width={600}
                  height={400}
                  className="h-44 w-full border-2 border-ink-line object-cover"
                />
                <p className="mt-3 text-center font-display text-sm font-semibold text-cream-dim">
                  {shot.caption}
                </p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ------------------------------------------- 2. STAT STRIP */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="card grid grid-cols-2 gap-8 p-8 sm:gap-10 sm:p-10 lg:grid-cols-4">
            <StatCounter value={stats.units} label="Units" emoji="" />
            <StatCounter value={stats.capstones} label="Big builds" emoji="" />
            <WordTile value={site.ages.replace('Ages ', '')} label="Ages" />
            <WordTile value="Weekly" label="Live help" />
          </div>
        </Container>
      </section>

      {/* -------------------------------------- 3. WHAT YOU'LL BUILD */}
      <Section className="border-y-[3px] border-ink-line bg-ink-800">
        <SectionHead
          eyebrow="Inventor Lab"
          title="Five builds you get to keep"
          sub="The last unit is the Inventor Lab. Each project runs over a handful of lessons and uses most of what you picked up getting there. Pick one. Or be stubborn and do all five."
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capstones.map((c) => (
            <Card as="li" key={c.letter} className="relative flex flex-col">
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border-[3px] border-ink-line font-display text-2xl font-extrabold text-cream shadow-[3px_3px_0_var(--color-ink-line)] ${
                  PROJECT_TONE[c.letter] ?? 'bg-amber'
                }`}
              >
                {c.letter}
              </span>

              <h3 className="mt-4 text-xl font-bold">
                <Link
                  href="/curriculum#unit-5"
                  className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-brand-600"
                >
                  {c.name}
                </Link>
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-cream-dim">{c.blurb}</p>

              <ul className="mt-4 flex flex-wrap gap-1.5 pt-1">
                {c.skills.map((s) => (
                  <li key={s}>
                    <Pill tone="muted">{s}</Pill>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </ul>
      </Section>

      {/* ------------------------------------------ 4. HOW IT WORKS */}
      <Section className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-dots opacity-40" />
        <div className="relative">
          <SectionHead
            eyebrow="How it works"
            title="Every lesson runs the same way"
            sub="Three steps, same order, every time. Learn the loop once and the rest of the course is that loop again with better parts in it."
          />

          <ol className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Card as="li" key={s.title} className="flex flex-col">
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border-[3px] border-ink-line font-display text-xl font-extrabold text-cream shadow-[3px_3px_0_var(--color-ink-line)] ${s.tone}`}
                >
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-dim">{s.body}</p>
              </Card>
            ))}
          </ol>
        </div>
      </Section>

      {/* -------------------------------------- 5. CURRICULUM TEASER */}
      <Section className="border-y-[3px] border-ink-line bg-ink-800">
        <SectionHead
          eyebrow="The map"
          title={`${stats.units} units, in order`}
          sub="Nothing gets skipped. Each unit only assumes what the one before it taught you, so if you start at Unit 0 you never walk into a wall."
        />

        <ul className="grid gap-5 md:grid-cols-2">
          {courseUnits.map((u) => {
            const a = accent(u.accent);
            return (
              <Card as="li" key={u.id} className="relative flex items-start gap-5">
                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-xl border-[3px] border-ink-line text-2xl shadow-[3px_3px_0_var(--color-ink-line)] ${a.bg}`}
                  aria-hidden
                >
                  {u.emoji}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${a.dot}`} aria-hidden />
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-cream-dim">
                      Unit {u.num}
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-lg font-bold leading-snug">
                    <Link
                      href={`/curriculum#${u.id}`}
                      className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-brand-600"
                    >
                      {u.title}
                    </Link>
                  </h3>

                  <p className="mt-1 text-sm text-cream-dim">{u.tagline}</p>
                </div>
              </Card>
            );
          })}
        </ul>

        <div className="mt-10 text-center">
          <Btn href="/curriculum" variant="outline" size="lg">
            Open the full curriculum →
          </Btn>
        </div>
      </Section>

      {/* ------------------------------------------------ 6. SHOWCASE */}
      <Section>
        <SectionHead
          eyebrow="Student builds"
          title="Made out of the same box"
          sub="No extra parts ordered, no 3D printer. Everything down here came out of the kit that shows up at your door."
        />

        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((p, i) => (
            <li
              key={p.src}
              className={`polaroid tape relative p-3 pb-6 transition-transform duration-300 hover:rotate-0 ${
                ['rotate-[-2.5deg]', 'rotate-[2deg]', 'rotate-[-1.5deg]'][i % 3]
              }`}
            >
              <Image
                src={asset(p.src)}
                alt={p.alt}
                width={600}
                height={400}
                className="h-48 w-full border-2 border-ink-line object-cover"
              />
              <h3 className="mt-4 font-display text-lg font-bold">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">{p.blurb}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ----------------------------------------------- 7. FINAL CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-[30px] border-[3px] border-ink-line bg-ink-700 p-10 text-center shadow-[10px_10px_0_var(--color-ink-line)] sm:p-16">
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-dots opacity-50" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              Go build something that moves
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-cream-dim">
              Get the kit, open Unit 0, and start. Something on your desk will be blinking before
              dinner. The car takes longer.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Btn href={links.signUp} external size="lg">
                Get the kit →
              </Btn>
              <Btn href="/kit" variant="outline" size="lg">
                See what&rsquo;s in the kit
              </Btn>
            </div>

            <p className="mt-7 text-sm text-cream-faint">
              Questions first? Email{' '}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-cream-dim underline decoration-brand-500/50 underline-offset-4 transition-colors hover:text-brand-600"
              >
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
