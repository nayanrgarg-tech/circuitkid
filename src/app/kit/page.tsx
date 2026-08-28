import type { Metadata } from 'next';
import Image from 'next/image';
import { Btn, Card, Pill, Section, SectionHead, accent } from '@/components/ui';
import { asset, gallery, kitContents, links, site } from '@/data/site';
import { stats } from '@/data/curriculum';

export const metadata: Metadata = {
  title: 'The Kit',
  description: `Every part needed for the ${site.name} course and all ${stats.capstones} capstone projects. An Arduino UNO R4, 30+ sensor modules, screens, motors and a robot car chassis, sorted into labeled cases.`,
};

/** The five parts people ask about before anything else. */
const highlights = [
  { label: 'Arduino UNO R4 Minima', tone: 'orange' },
  { label: '830-point breadboard and wires', tone: 'cyan' },
  { label: 'LCD and OLED screens', tone: 'violet' },
  { label: '30+ snap-in sensor modules', tone: 'lime' },
  { label: '2WD robot car chassis', tone: 'amber' },
] as const;

/**
 * Captions in src/data ship with a trailing emoji. Neither it nor the
 * exclamation mark it was propping up survives the redesign.
 */
const plainCaption = (caption: string) =>
  caption
    .replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu, '')
    .replace(/\s*!+\s*$/, '')
    .trim();

/** The hero shows this one full size, so the wall below skips it. */
const HERO_PHOTO = '/images/kit/kit-lcd-build.jpg';
const photos = gallery.filter((photo) => photo.src !== HERO_PHOTO);

const groupCount = kitContents.length;
const partCount = kitContents.reduce((sum, group) => sum + group.items.length, 0);

/** Inner frame around every photo, inside the white polaroid margin. */
const FRAME = 'overflow-hidden rounded-[4px] border-2 border-ink-line/10';
const CAPTION = 'px-1 pt-3 pb-1 text-center font-display text-sm font-semibold';

export default function KitPage() {
  return (
    <>
      {/* ---------------------------------------------------------- hero */}
      <Section className="pt-12 sm:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="animate-rise">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
              The hardware
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              The <span className="text-brand-600">CircuitKid</span> Kit
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-dim sm:text-xl">
              Every part for the whole course and all {stats.capstones} capstone projects, shipped to your door in one box. Sorted into labeled cases before it goes
              out, so day one is not a mystery bag of parts.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Btn href={links.signUp} size="lg">
                Sign up for a kit →
              </Btn>
              <Btn href="/curriculum" variant="outline" size="lg">
                See what you&apos;ll build
              </Btn>
            </div>
            <p className="mt-6 flex flex-wrap items-center gap-2 text-sm">
              <Pill tone="brand">{site.ages}</Pill>
              <Pill tone="neutral">No experience needed</Pill>
              <Pill tone="neutral">Reusable forever</Pill>
            </p>
          </div>

          <div className="polaroid tape mx-auto w-full max-w-lg -rotate-[1.5deg] p-3 hover:rotate-0">
            <div className={`aspect-[16/10] ${FRAME}`}>
              <Image
                src={asset('/images/kit/kit-lcd-build.jpg')}
                alt="Arduino UNO R4 wired to a breadboard and an LCD screen showing a message"
                width={1600}
                height={1064}
                priority
                className="h-full w-full object-cover"
              />
            </div>
            <p className={CAPTION}>Lesson 1, finished</p>
          </div>
        </div>
      </Section>

      {/* ----------------------------------------------------- gallery */}
      <Section className="border-y-[3px] border-ink-line bg-ink-800">
        <SectionHead
          title="A look inside the box"
          sub="Real photos of the actual kit on my desk. Not stock images, not renders. What shows up is what you see here."
        />
        <ul className="grid grid-cols-2 gap-5 sm:gap-8 md:grid-cols-3 lg:gap-10">
          {photos.map((photo) => (
            <li key={photo.src} className="polaroid-photo tape p-3">
              <div className={`aspect-[4/3] ${FRAME}`}>
                <Image
                  src={asset(photo.src)}
                  alt={photo.alt}
                  width={1600}
                  height={1064}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className={CAPTION}>{plainCaption(photo.caption)}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* -------------------------------------------------- highlights */}
      <Section>
        <SectionHead
          eyebrow="The short list"
          title="What you get"
          sub="If you only read five lines about the kit, read these."
        />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {highlights.map((item) => {
            const a = accent(item.tone);
            return (
              <li
                key={item.label}
                className={`hard-shadow-sm flex flex-col gap-3 rounded-[10px] border-[3px] border-ink-line px-4 py-5 transition-all duration-200 ease-bounce hover:-translate-y-1 hover:hard-shadow ${a.bg}`}
              >
                <span aria-hidden className={`h-3 w-3 rounded-[2px] ${a.dot}`} />
                <span className="font-display text-sm font-semibold leading-snug">{item.label}</span>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* --------------------------------------------- what's included */}
      <Section className="border-y-[3px] border-ink-line bg-ink-800">
        <SectionHead
          title="Every single part"
          sub="No upgrade packs. Nothing sold separately halfway through the course. This is the whole bill of materials."
        />
        <p className="mb-8 text-sm font-semibold uppercase tracking-[0.15em] text-brand-600">
          {groupCount} labeled groups · {partCount} listed parts
        </p>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {kitContents.map((group) => (
            <Card key={group.group} as="li">
              <h3 className="font-display text-lg font-bold leading-snug">{group.group}</h3>
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-cream-dim">
                    <span
                      aria-hidden
                      className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-[1px] bg-brand-500"
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
        <div className="card p-7 sm:p-9">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              What you&apos;ll need at home
            </h2>
            <Pill tone="muted">Not in the box</Pill>
          </div>
          <ul className="mt-5 max-w-2xl space-y-3 text-cream-dim">
            <li className="flex items-start gap-2.5">
              <span aria-hidden className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-[1px] bg-cyan" />
              <span>
                A Windows or Mac computer to run the{' '}
                <a
                  href={links.arduinoSoftware}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand-600 underline decoration-brand-500/50 underline-offset-4 transition-colors hover:text-brand-500"
                >
                  Arduino IDE
                </a>
                . It&apos;s a free download, and Lesson 1 walks through installing it.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <span
                aria-hidden
                className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-[1px] bg-amber"
              />
              <span>4 × AA batteries for the motor and robot car projects.</span>
            </li>
          </ul>
          <p className="mt-5 text-sm text-cream-dim">That&apos;s genuinely it.</p>
        </div>
      </Section>

      {/* ------------------------------------------------------ sign up */}
      <Section className="pb-20 sm:pb-28">
        <div className="grid-dots hard-shadow rounded-card border-[3px] border-ink-line bg-brand-500/12 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Ready to get a kit?
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-cream-dim">
              Fill out the sign-up form. You get a reply with pricing and shipping, plus what to do
              to start Lesson 1. That form is how you request a kit. There is no checkout to rush
              through.
            </p>
            <div className="mt-9 flex justify-center">
              <Btn href={links.signUp} size="lg">
                Open the sign-up form →
              </Btn>
            </div>
            <p className="mt-7 text-sm text-cream-dim">
              Questions first? Email{' '}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-brand-600 underline decoration-brand-500/50 underline-offset-4 transition-colors hover:text-brand-500"
              >
                {site.email}
              </a>{' '}
              or call{' '}
              <a
                href={`tel:${site.phone}`}
                className="font-semibold text-brand-600 transition-colors hover:text-brand-500"
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
