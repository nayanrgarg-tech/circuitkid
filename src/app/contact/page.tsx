import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Btn, Card, Pill, Section, SectionHead, accent } from '@/components/ui';
import { stats } from '@/data/curriculum';
import { links, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Questions about the kit, or about a robot that has stopped cooperating? Reach Nayan by form, email or phone. Parents and students both welcome.',
};

type Route = {
  /** Short wayfinding label. Does the work the emoji used to. */
  kind: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  accentKey: string;
  best: string;
};

const routes: Route[] = [
  {
    kind: 'Form',
    title: 'Ask a question',
    body: 'Tell me what you are building and where it went sideways. A photo of your wiring helps more than any description.',
    cta: 'Open the form',
    href: links.askQuestion,
    accentKey: 'orange',
    best: 'Best for a specific project problem',
  },
  {
    kind: 'Live',
    title: 'Schedule a meeting',
    body: 'Book a spot in the weekly live session. Hold your breadboard up to the camera and we get it working together.',
    cta: 'Pick a time',
    href: links.scheduleMeeting,
    accentKey: 'violet',
    best: 'Best for hands-on help',
  },
  {
    kind: 'Sign-up',
    title: 'Get a kit',
    body: 'The sign-up form. Tell me a bit about the student, and I will get you a kit and set up course access.',
    cta: 'Sign up',
    href: links.signUp,
    accentKey: 'lime',
    best: 'Best for getting started',
  },
  {
    kind: 'Email',
    title: 'Email',
    body: 'Write to me about anything. Shipping questions, or a project idea you want to try that I have not filmed yet.',
    cta: site.email,
    href: `mailto:${site.email}`,
    accentKey: 'cyan',
    best: 'Fastest way to reach a real person',
  },
  {
    kind: 'Phone',
    title: 'Call or text',
    body: 'If it is easier to just talk it through, this number works for both. Texts usually get the quicker reply.',
    cta: site.phoneLabel,
    href: `tel:${site.phone}`,
    accentKey: 'amber',
    best: 'Best for quick questions',
  },
];

const LINK =
  'font-semibold text-brand-600 underline decoration-brand-500/50 underline-offset-4 transition-colors hover:text-brand-500';

type Faq = { q: string; a: ReactNode };

const faqs: Faq[] = [
  {
    q: 'Does my kid need coding experience?',
    a: (
      <>
        No. None at all. The course opens by installing the software and writing one line that makes
        an LED blink. Everything stacks up from there, one part at a time.
      </>
    ),
  },
  {
    q: 'What computer do we need?',
    a: (
      <>
        Any Windows or Mac computer that runs the free Arduino IDE. Nothing to buy on the software
        side. Just{' '}
        <a href={links.arduinoSoftware} target="_blank" rel="noopener noreferrer" className={LINK}>
          download the Arduino IDE
        </a>{' '}
        and plug in the cable that comes in the kit. That is the whole setup.
      </>
    ),
  },
  {
    q: 'How long does the course take?',
    a: (
      <>
        As long as your kid wants it to. There are {stats.lessons} lessons and no clock running on
        any of them. Some students do one a night. Others sit on a single build all Saturday because
        they keep adding to it. The Inventor Lab projects at the end are the long ones, and that is
        rather the point of them.
      </>
    ),
  },
  {
    q: 'What if we get stuck?',
    a: (
      <>
        Start with the{' '}
        <Link href="/lessons/troubleshooting" className={LINK}>
          troubleshooting lesson
        </Link>
        , which covers the mistakes almost everybody makes at least once. If that does not do it,
        send a photo through the question form up there. It comes straight to me. The weekly live
        sessions exist for exactly this, so bring the stubborn build along.
      </>
    ),
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ---------------- header ---------------- */}
      <Section className="grid-dots pb-8 sm:pb-10">
        <header className="max-w-3xl animate-rise">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
            Contact
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
            Get in touch
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-cream-dim sm:text-xl">
            Parents and students, both welcome. Ask about the kit, or about a robot that has decided
            to stop cooperating. Pick whichever way is easiest for you.
          </p>
        </header>
      </Section>

      {/* ---------------- contact routes ---------------- */}
      <Section className="pt-0 sm:pt-0">
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {routes.map((r) => {
            const a = accent(r.accentKey);
            return (
              <Card as="li" key={r.title} className="flex flex-col">
                <span
                  className={`hard-shadow-xs mb-4 w-fit rounded-full border-2 border-ink-line px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.14em] ${a.bg}`}
                >
                  {r.kind}
                </span>
                <h2 className={`font-display text-xl font-bold ${a.text}`}>{r.title}</h2>
                <p className="mt-3 flex-1 leading-relaxed text-cream-dim">{r.body}</p>
                <p className="mt-4 text-sm font-semibold text-cream-dim">{r.best}</p>
                <div className="mt-5">
                  <Btn href={r.href} variant="outline" external>
                    {r.cta}
                  </Btn>
                </div>
              </Card>
            );
          })}
        </ul>
      </Section>

      {/* ---------------- for parents ---------------- */}
      <Section>
        <SectionHead eyebrow="For parents" title="What you’re signing up for" />
        <div className="card p-8 sm:p-10">
          <ul className="mb-6 flex flex-wrap gap-2.5">
            <li>
              <Pill tone="brand">{site.ages}</Pill>
            </li>
            <li>
              <Pill tone="good">100% online</Pill>
            </li>
            <li>
              <Pill>No coding experience needed</Pill>
            </li>
            <li>
              <Pill tone="muted">Self-paced</Pill>
            </li>
          </ul>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-cream-dim">
            <p>
              {site.name} teaches electronics and programming on real Arduino hardware. Your student
              gets a box with every part in it and {stats.lessons} video lessons that go in order.
              The course ends in the Inventor Lab, where the builds get big. An RC car assembled
              from a bare chassis. A tic-tac-toe board that plays against you. I am still filming
              the rest of those projects.
            </p>
            <p>
              It all happens online, live help sessions included, so there is nothing to drive to.
              It is built for {site.ages.toLowerCase()} and for beginners of any age. No prior
              coding. No prior electronics.
            </p>
            <p>
              Want to talk to a person before you decide? Email is fastest:{' '}
              <a href={`mailto:${site.email}`} className={LINK}>
                {site.email}
              </a>
              . You can call or text {site.phoneLabel} too.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Btn href={links.signUp} external>
              Get a kit
            </Btn>
            <Btn href="/curriculum" variant="outline">
              See every lesson
            </Btn>
          </div>
        </div>
      </Section>

      {/* ---------------- faq ---------------- */}
      <Section className="border-t-[3px] border-ink-line bg-ink-800">
        <SectionHead eyebrow="FAQ" title="Quick answers" />
        <ul className="max-w-3xl space-y-4">
          {faqs.map((f) => (
            <li key={f.q}>
              <details className="group card px-6 py-5 transition-colors duration-200 open:border-brand-500 hover:border-brand-500">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold text-cream [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink-line bg-amber/40 text-lg font-bold text-cream transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-cream-dim">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
