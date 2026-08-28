import type { Metadata } from 'next';
import { Section, SectionHead, Btn } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    "That page isn't plugged in. Head back to the start or browse the CircuitKid lessons.",
};

export default function NotFound() {
  return (
    <Section className="text-center">
      <h1 className="sr-only">Page not found</h1>

      <p className="animate-float text-7xl leading-none sm:text-8xl" aria-hidden="true">
        🔌
      </p>

      <div className="mt-10">
        <SectionHead
          align="center"
          eyebrow="Error 404"
          title="This wire goes nowhere"
          sub="Nothing is broken — the link is just loose. Maybe the page moved, or a letter got lost on the way here. Let's plug you back in."
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Btn href="/" size="lg">
          🏠 Back to the start
        </Btn>
        <Btn href="/curriculum" size="lg" variant="outline">
          🧭 Browse the lessons
        </Btn>
      </div>
    </Section>
  );
}
