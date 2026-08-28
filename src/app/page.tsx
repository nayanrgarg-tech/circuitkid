import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import StatCounter from '@/components/StatCounter';
import { Btn, Card, Container, Pill, Section, SectionHead, accent } from '@/components/ui';
import { capstones, stats, units } from '@/data/curriculum';
import { asset, links, showcase, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Robotics & Arduino video lessons for kids',
  description: site.description,
};

/* Decorative hero confetti — desktop only, purely cosmetic. */
const FLOATERS = [
  { emoji: '🤖', pos: 'right-[5%] top-[16%]', size: 'text-6xl', delay: '0s' },
  { emoji: '⚡', pos: 'right-[26%] top-[28%]', size: 'text-4xl', delay: '1.1s' },
  { emoji: '💡', pos: 'right-[13%] top-[56%]', size: 'text-5xl', delay: '2.2s' },
  { emoji: '🔧', pos: 'right-[31%] top-[72%]', size: 'text-4xl', delay: '3.1s' },
] as const;

const STEPS = [
  {
    emoji: '📺',
    title: 'Watch it',
    body:
      'Short videos, plain English. Every new word gets explained the first time it shows up, not three lessons later.',
  },
  {
    emoji: '🔌',
    title: 'Wire it up',
    body:
      'Pause and build the circuit on your breadboard. Every wire is on screen, pin by pin. Rewind as often as you need to.',
  },
  {
    emoji: '💻',
    title: 'Run the code',
    body:
      'Copy the sketch out of the workbook and hit upload. Then change a number and see what breaks. That part is the whole point.',
  },
] as const;

/** Big-number tile that visually matches <StatCounter/> but never animates. */
function AgesTile() {
  const range = site.ages.replace('Ages ', '');
  return (
    <div className="text-center">
      <div className="mb-1.5 text-2xl" aria-hidden>
        🎂
      </div>
      <div className="font-display text-4xl font-extrabold text-brand-400 sm:text-5xl">{range}</div>
      <div className="mt-1.5 text-sm font-semibold uppercase tracking-wider text-cream-faint">
        Ages
      </div>
    </div>
  );
}

export default function HomePage() {
  const courseUnits = units.filter((u) => u.num !== '★');

  return (
    <>
      {/* ------------------------------------------------ 1. HERO */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-dots opacity-70" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-56 left-1/2 h-[640px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[140px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-900 to-transparent"
        />

        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          {FLOATERS.map((f) => (
            <span
              key={f.emoji}
              style={{ animationDelay: f.delay }}
              className={`absolute ${f.pos} ${f.size} animate-float opacity-80 drop-shadow-2xl`}
            >
              {f.emoji}
            </span>
          ))}
        </div>

        <Container className="relative flex min-h-[80vh] flex-col justify-center py-20 sm:py-28 lg:min-h-[85vh]">
          <div className="max-w-3xl">
            <div className="animate-rise">
              <Pill tone="brand">⚡ {site.ages} · No experience needed</Pill>
            </div>

            <h1
              className="mt-6 animate-rise font-display text-6xl font-extrabold leading-[0.92] sm:text-7xl lg:text-8xl"
              style={{ animationDelay: '0.08s' }}
            >
              Circuit<span className="text-brand-400">Kid</span>
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
              A video course for kids who want to build robots. You get a real Arduino kit and you
              start building with it right away. First a blinking light, which sounds small until it
              is your light and you are the one who made it blink. By the end you have a car that
              drives itself around your living room. No coding experience needed. Nobody has any at
              the start.
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
              🎥 Live help every week. Bring whatever is broken and we fix it together.
            </p>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------- 2. STAT STRIP */}
      <section className="pb-16 sm:pb-24">
        <Container>
          <div className="card grid grid-cols-2 gap-8 p-8 sm:gap-10 sm:p-10 lg:grid-cols-4">
            <StatCounter value={stats.lessons} label="Lessons" emoji="📚" />
            <StatCounter value={stats.videos} label="Videos ready" emoji="🎬" />
            <StatCounter value={stats.capstones} label="Big builds" emoji="🚀" />
            <AgesTile />
          </div>
        </Container>
      </section>

      {/* -------------------------------------- 3. WHAT YOU'LL BUILD */}
      <Section className="relative">
        <SectionHead
          emoji="🛠️"
          eyebrow="Inventor Lab"
          title="Five builds you get to keep"
          sub="The last unit is the Inventor Lab. Each project runs over a handful of lessons and uses most of what you picked up on the way there. Pick one. Or be stubborn and do all five."
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capstones.map((c) => {
            const filming = c.lessonCount === 0;
            return (
              <Card
                as="li"
                key={c.letter}
                className={`relative flex flex-col ${filming ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-4xl" aria-hidden>
                    {c.emoji}
                  </span>
                  <Pill tone={filming ? 'muted' : 'brand'}>Project {c.letter}</Pill>
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  <Link
                    href="/curriculum#unit-5"
                    className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-brand-300"
                  >
                    {c.name}
                  </Link>
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-cream-dim">{c.blurb}</p>

                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-cream-faint">
                  {filming ? 'Still filming' : `${c.lessonCount} lessons`}
                </p>

                <ul className="mt-4 flex flex-wrap gap-1.5 pt-1">
                  {c.skills.map((s) => (
                    <li key={s}>
                      <Pill tone="muted">{s}</Pill>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </ul>
      </Section>

      {/* ------------------------------------------ 4. HOW IT WORKS */}
      <Section className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-dots opacity-40" />
        <div className="relative">
          <SectionHead
            emoji="🔁"
            eyebrow="How it works"
            title="Every lesson runs the same way"
            sub="Three steps, in the same order, every time. Learn the loop once and the rest of the course is that loop again with better parts in it."
          />

          <ol className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Card as="li" key={s.title} className="flex flex-col">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-500/15 font-display text-xl font-extrabold text-brand-300 ring-1 ring-brand-500/30">
                    {i + 1}
                  </span>
                  <span className="text-3xl" aria-hidden>
                    {s.emoji}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-dim">{s.body}</p>
              </Card>
            ))}
          </ol>
        </div>
      </Section>

      {/* -------------------------------------- 5. CURRICULUM TEASER */}
      <Section>
        <SectionHead
          emoji="🗺️"
          eyebrow="The map"
          title={`${stats.units} units, in order`}
          sub="Nothing gets skipped. Each unit only assumes what the one before it already taught you, so if you start at Unit 0 you never walk into a wall."
        />

        <ul className="grid gap-5 md:grid-cols-2">
          {courseUnits.map((u) => {
            const a = accent(u.accent);
            const filming = u.lessons.filter((l) => !l.video).length;
            return (
              <Card as="li" key={u.id} className="relative flex items-start gap-5">
                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-2xl ring-1 ${a.bg} ${a.ring}`}
                  aria-hidden
                >
                  {u.emoji}
                </span>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${a.dot}`} aria-hidden />
                    <span className={`text-xs font-bold uppercase tracking-[0.18em] ${a.text}`}>
                      Unit {u.num}
                    </span>
                  </div>

                  <h3 className="mt-1.5 text-lg font-bold leading-snug">
                    <Link
                      href={`/curriculum#${u.id}`}
                      className="transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-brand-300"
                    >
                      {u.title}
                    </Link>
                  </h3>

                  <p className="mt-1 text-sm text-cream-dim">{u.tagline}</p>

                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-cream-faint">
                    {u.lessons.length} {u.lessons.length === 1 ? 'lesson' : 'lessons'}
                    {filming > 0 ? ` · ${filming} still filming` : ''}
                  </p>
                </div>
              </Card>
            );
          })}
        </ul>

        <div className="mt-10 text-center">
          <Btn href="/curriculum" variant="outline" size="lg">
            See all {stats.lessons} lessons →
          </Btn>
        </div>
      </Section>

      {/* ------------------------------------------------ 6. SHOWCASE */}
      <Section>
        <SectionHead
          emoji="✨"
          eyebrow="Student builds"
          title="Made out of the same box"
          sub="No extra parts ordered, no 3D printer. Everything down here came out of the kit that shows up at your door."
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((p) => (
            <Card as="li" key={p.src} className="overflow-hidden">
              <Image
                src={asset(p.src)}
                alt={p.alt}
                width={600}
                height={400}
                className="h-48 w-full rounded-xl object-cover ring-1 ring-cream/10"
              />
              <h3 className="mt-5 text-lg font-bold">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim">{p.blurb}</p>
            </Card>
          ))}
        </ul>
      </Section>

      {/* ----------------------------------------------- 7. FINAL CTA */}
      <Section>
        <div className="card relative overflow-hidden p-10 text-center sm:p-16">
          <div aria-hidden className="pointer-events-none absolute inset-0 grid-dots opacity-50" />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-[120px]"
          />

          <div className="relative mx-auto max-w-2xl">
            <span className="text-5xl animate-spark inline-block" aria-hidden>
              🤖
            </span>

            <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
              Go build something that moves
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-cream-dim">
              Get the kit, open Unit 0, and start. Something on your desk will be blinking before
              dinner. The car takes a little longer.
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
                className="font-semibold text-cream-dim underline decoration-brand-500/40 underline-offset-4 transition-colors hover:text-brand-300"
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
