import type { Metadata } from 'next';
import Image from 'next/image';
import StatCounter from '@/components/StatCounter';
import { Btn, Card, Pill, Section, SectionHead, accent } from '@/components/ui';
import { stats } from '@/data/curriculum';
import { asset, links, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'About',
  description:
    'I am Nayan. I am in high school, I have been into robots since I was little, and I built CircuitKid because everything I could find online was written for engineers instead of kids.',
};

type Principle = {
  emoji: string;
  title: string;
  body: string;
  accentKey: string;
  cta?: { label: string; href: string };
};

const principles: Principle[] = [
  {
    emoji: '🔨',
    title: 'Build it, then find out why it works',
    body: 'You wire the thing up and watch it do something. Then I explain what just happened. A blinking LED sitting on your desk is a much better reason to care than a page of theory you have to take my word for.',
    accentKey: 'orange',
  },
  {
    emoji: '✅',
    title: 'No lesson stops in the middle',
    body: 'By the end of every video, something in front of you is doing a thing it was not doing before. Usually it blinks. Sometimes it drives across the floor. Either way you can go show somebody.',
    accentKey: 'lime',
  },
  {
    emoji: '🔌',
    title: 'Real parts, not a simulator',
    body: 'You get a real Arduino and real jumper wires, and you will absolutely plug some of them in backwards. Good. A simulator that never lets you make the mistake never teaches you how to spot it.',
    accentKey: 'cyan',
  },
  {
    emoji: '🙋',
    title: 'Getting stuck is normal, staying stuck is not',
    body: 'I run a live session online every week. If your build refuses to cooperate, hold your wiring up to the camera and we sort it out right there. I would rather look at your breadboard than guess over email.',
    accentKey: 'violet',
    cta: { label: 'Join a live session', href: links.scheduleMeeting },
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ---------------- hero ---------------- */}
      <Section className="grid-dots">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="animate-rise">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
              About
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Hi, I&rsquo;m Nayan <span className="inline-block animate-float">👋</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream-dim sm:text-xl">
              I&rsquo;m in high school and I&rsquo;ve been into robots since I was little. When I
              started out, everything I could find online was written for people who already knew
              what they were doing. So I built the version I wanted back then. {site.name} is a box
              with every part in it and a set of videos that don&rsquo;t skip steps.
            </p>
            <ul className="mt-7 flex flex-wrap gap-2.5">
              <li>
                <Pill tone="brand">🤖 Built by a student</Pill>
              </li>
              <li>
                <Pill tone="good">🎥 {stats.videos} videos so far</Pill>
              </li>
              <li>
                <Pill>🗓️ Live help every week</Pill>
              </li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div
              className="absolute -inset-4 -z-10 rounded-[2.25rem] bg-brand-500/12 blur-2xl"
              aria-hidden
            />
            <Image
              src={asset('/images/nayan.jpg')}
              alt="Nayan, the creator of CircuitKid"
              width={600}
              height={653}
              priority
              className="h-auto w-full rounded-card border border-cream/10 object-cover shadow-2xl shadow-brand-900/50"
            />
          </div>
        </div>
      </Section>

      {/* ---------------- the story ---------------- */}
      <Section className="pt-0 sm:pt-0">
        <SectionHead
          emoji="💡"
          eyebrow="The story"
          title="Why I made this"
          sub="Short version: I got annoyed, then I built the fix."
        />
        <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-cream-dim">
          <p>
            When I got curious about robotics, I did what everybody does. I searched. What came back
            was datasheets and forum threads where engineers talked to other engineers. The
            tutorials that were supposed to be for beginners still jumped about four steps between
            &ldquo;plug it in&rdquo; and &ldquo;now it works.&rdquo; I was a kid who wanted to make
            something move. Almost none of it was written for me.
          </p>
          <p>
            So I did it the slow way instead. Take a thing apart. Wire it wrong. Sit there until I
            worked out what the mistake had been telling me. It got there in the end, but it took
            far longer than it should have, and by then I was pretty sure the electronics were never
            the hard part. The hard part was that nobody explained it to a beginner like a beginner.
          </p>
          <p>
            That&rsquo;s what {site.name} is. Every part you need lives in one box, and I filmed the
            lessons I wanted when I was starting, boring middle steps included. The course ends in
            the Inventor Lab, where you build an RC car out of a bare chassis and a tic-tac-toe
            board that plays against you. And I run a live session every week, so you never have to
            sit there stuck the way I did.
          </p>
        </div>
      </Section>

      {/* ---------------- teaching philosophy ---------------- */}
      <Section className="pt-0 sm:pt-0">
        <SectionHead
          emoji="🧠"
          eyebrow="Philosophy"
          title="How I teach it"
          sub="Four rules I hold every lesson to. If a video breaks one, I film it again."
        />
        <ul className="grid gap-5 sm:grid-cols-2">
          {principles.map((p) => {
            const a = accent(p.accentKey);
            return (
              <Card as="li" key={p.title} className="flex flex-col">
                <span
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ring-1 ${a.bg} ${a.ring}`}
                  aria-hidden
                >
                  {p.emoji}
                </span>
                <h3 className={`text-xl font-bold ${a.text}`}>{p.title}</h3>
                <p className="mt-3 leading-relaxed text-cream-dim">{p.body}</p>
                {p.cta && (
                  <div className="mt-5">
                    <Btn href={p.cta.href} variant="outline" external>
                      {p.cta.label}
                    </Btn>
                  </div>
                )}
              </Card>
            );
          })}
        </ul>
      </Section>

      {/* ---------------- the numbers ---------------- */}
      <Section className="pt-0 sm:pt-0">
        <div className="card grid grid-cols-2 gap-8 p-8 sm:p-10 lg:grid-cols-4">
          <StatCounter value={stats.lessons} label="Lessons" emoji="🎬" />
          <StatCounter value={stats.videos} label="Videos" emoji="🎥" />
          <StatCounter value={stats.capstones} label="Big builds" emoji="🏆" />
          <div className="text-center">
            <div className="mb-1.5 text-2xl" aria-hidden>
              🎈
            </div>
            <div className="font-display text-3xl font-extrabold leading-tight text-brand-400 sm:text-4xl">
              {site.ages}
            </div>
            <div className="mt-1.5 text-sm font-semibold uppercase tracking-wider text-cream-faint">
              Who it&rsquo;s for
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------- cta ---------------- */}
      <Section className="pt-0 sm:pt-0">
        <div className="card grid-dots overflow-hidden p-8 text-center sm:p-14">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Want to build the first one with me? 🚀
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-cream-dim">
            Grab a kit and start at lesson one. Or read the whole curriculum first and see exactly
            what you&rsquo;d be making.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Btn href={links.signUp} size="lg" external>
              Get the kit 🎒
            </Btn>
            <Btn href="/curriculum" variant="outline" size="lg">
              See the curriculum
            </Btn>
          </div>
          <p className="mt-8 text-cream-faint">
            Questions before you start? Email me at{' '}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-brand-300 underline decoration-brand-500/40 underline-offset-4 transition-colors hover:text-brand-400 hover:decoration-brand-400"
            >
              {site.email}
            </a>
            . I read all of them.
          </p>
        </div>
      </Section>
    </>
  );
}
