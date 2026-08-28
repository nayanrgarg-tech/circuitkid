'use client';

import Link from 'next/link';
import { useStudent } from '@/lib/student';

export function ProgressBar({
  done,
  total,
  accent = 'bg-brand-500',
  className = '',
  showLabel = true,
}: {
  done: number;
  total: number;
  accent?: string;
  className?: string;
  showLabel?: boolean;
}) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done === total;
  return (
    <div className={className}>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-cream/10"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${done} of ${total} lessons complete`}
      >
        <div
          className={`h-full rounded-full transition-[width] duration-700 ease-out ${complete ? 'bg-lime' : accent}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <p className="mt-1.5 text-xs font-semibold text-cream-faint">
          {complete ? '🎉 Unit complete!' : `${done} / ${total} done`}
        </p>
      )}
    </div>
  );
}

/** Big circular meter for the dashboard. */
export function ProgressRing({ pct, size = 168 }: { pct: number; size?: number }) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-cream/10" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          className={pct === 100 ? 'text-lime' : 'text-brand-500'}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display text-4xl font-extrabold">{pct}%</div>
          <div className="text-xs font-semibold uppercase tracking-wider text-cream-faint">done</div>
        </div>
      </div>
    </div>
  );
}

/** The "mark this lesson complete" control on a lesson page. */
export function CompleteButton({ slug }: { slug: string }) {
  const { ready, student, isDone, toggle } = useStudent();

  if (!ready) return <div className="h-12 w-56 animate-pulse rounded-full bg-cream/8" />;

  if (!student) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-full bg-cream/8 px-5 py-3 text-sm font-semibold text-cream-dim ring-1 ring-cream/12 transition-colors hover:bg-cream/12"
      >
        🔑 Sign in to track your progress
      </Link>
    );
  }

  const done = isDone(slug);
  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={done}
      className={`inline-flex items-center gap-2.5 rounded-full px-5 py-3 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
        done
          ? 'bg-lime text-ink-900 shadow-lg shadow-lime/25'
          : 'bg-brand-500 text-ink-900 shadow-lg shadow-brand-600/25 hover:bg-brand-400'
      }`}
    >
      <span
        className={`grid h-5 w-5 place-items-center rounded-full text-xs ${
          done ? 'bg-ink-900/20' : 'bg-ink-900/15'
        }`}
        aria-hidden
      >
        {done ? '✓' : '○'}
      </span>
      {done ? 'Completed!' : 'Mark as complete'}
    </button>
  );
}

/** Small tick shown next to a lesson title in lists. */
export function DoneTick({ slug }: { slug: string }) {
  const { ready, student, isDone } = useStudent();
  if (!ready || !student || !isDone(slug)) return null;
  return (
    <span
      className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-lime text-[11px] font-bold text-ink-900"
      title="Completed"
    >
      ✓
    </span>
  );
}
