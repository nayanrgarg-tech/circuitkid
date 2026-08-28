'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Counts up to `value` the first time the strip scrolls into view.
 * Respects prefers-reduced-motion by jumping straight to the number.
 */
export default function StatCounter({
  value,
  label,
  emoji,
  prefix = '',
  suffix = '',
  duration = 1400,
}: {
  value: number;
  label: string;
  emoji: string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Seeded with the real value so the server-rendered HTML (and any visitor
  // without JS) shows the true number instead of a zero.
  const [shown, setShown] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(value);
      return;
    }

    const run = () => {
      if (started.current) return;
      started.current = true;
      setShown(0);
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / duration);
        // easeOutCubic — fast start, gentle landing
        const eased = 1 - Math.pow(1 - p, 3);
        setShown(Math.round(value * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const onScreenAtLoad = (() => {
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0;
    })();
    if (onScreenAtLoad) {
      // Already visible: leave the real number alone rather than flashing 0.
      started.current = true;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="mb-1.5 text-2xl" aria-hidden>
        {emoji}
      </div>
      <div className="font-display text-4xl font-extrabold text-brand-400 sm:text-5xl">
        {prefix}
        {shown}
        {suffix}
      </div>
      <div className="mt-1.5 text-sm font-semibold uppercase tracking-wider text-cream-faint">
        {label}
      </div>
    </div>
  );
}
