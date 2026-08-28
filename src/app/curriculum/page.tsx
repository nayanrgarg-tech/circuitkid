import type { Metadata } from 'next';
import { Btn, Card, Pill, Section, SectionHead, accent } from '@/components/ui';
import UnitAccordion from '@/components/UnitAccordion';
import { stats, units } from '@/data/curriculum';
import { links, site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Curriculum',
  description: `Every lesson in the ${site.name} course. ${stats.units} units plus a shelf of extras, ending in the Inventor Lab builds. Start at Unit 0 and work down.`,
};

export default function CurriculumPage() {
  return (
    <>
      <Section className="pb-8 sm:pb-10">
        <SectionHead
          emoji="🗺️"
          eyebrow="The full course"
          title="Curriculum"
          sub={
            <>
              {stats.units} units, plus a shelf of extras for when something breaks. Every unit
              builds on the one before it, so{' '}
              <strong className="font-semibold text-cream">start at Unit 0</strong> and go down the
              list. Side quests are optional. Do them when you feel like pushing further.
            </>
          }
        />

        {/* Static jump-links: this is a server component, so the live progress
            numbers live inside each <UnitAccordion> instead. */}
        <Card className="grid-dots">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-cream-faint">
            Jump to a unit
          </p>
          <ul className="flex flex-wrap gap-2.5">
            {units.map((u) => {
              const a = accent(u.accent);
              return (
                <li key={u.id}>
                  <a
                    href={`#${u.id}`}
                    className={`flex items-center gap-2.5 rounded-full bg-ink-900/50 py-2 pl-2.5 pr-4 ring-1 transition-all duration-200 hover:-translate-y-0.5 hover:bg-ink-600 ${a.ring}`}
                  >
                    <span className={`grid h-7 w-7 place-items-center rounded-full text-base ${a.bg}`} aria-hidden>
                      {u.emoji}
                    </span>
                    <span className="leading-tight">
                      <span className={`block text-[10px] font-bold uppercase tracking-[0.16em] ${a.text}`}>
                        Unit {u.num}
                      </span>
                      <span className="block text-sm font-semibold text-cream">{u.title}</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>

          <ul className="mt-5 flex flex-wrap gap-2 border-t border-cream/8 pt-4">
            <li>
              <Pill tone="brand">{stats.units} units</Pill>
            </li>
            <li>
              <Pill>🚀 {stats.capstones} big builds</Pill>
            </li>
            <li>
              <Pill tone="good">Live help every week</Pill>
            </li>
            <li>
              <Pill tone="muted">{site.ages}</Pill>
            </li>
          </ul>
        </Card>
      </Section>

      <Section className="pt-0">
        <ul className="space-y-5">
          {units.map((u) => (
            <li key={u.id}>
              <UnitAccordion unit={u} />
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0">
        <Card className="border-brand-500/25 bg-brand-500/[0.06]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-extrabold sm:text-3xl">
                <span className="mr-2.5 align-middle">🙋</span>Stuck on a step?
              </h2>
              <p className="mt-3 leading-relaxed text-cream-dim">
                Nobody wires it right the first time. Send me a photo of your breadboard through the
                question form, or bring the build to a live session and we will find the loose wire
                together on screen.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-cream-faint">
                Every lesson lists{' '}
                <span className="font-semibold text-cream-dim">
                  the parts you need and the code you run
                </span>
                , so you can work ahead whenever you want.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3">
              <Btn href={links.askQuestion} size="lg">
                📝 Ask a question
              </Btn>
              <Btn href={links.scheduleMeeting} variant="outline" size="lg">
                📅 Join a live session
              </Btn>
            </div>
          </div>
        </Card>
      </Section>
    </>
  );
}
