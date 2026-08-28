/**
 * Shared presentational primitives.
 * Server-safe (no hooks, no 'use client') so any page can import them.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';

/* ---------------- accents ---------------- */

/**
 * One candy colour per unit, so the curriculum reads like a map.
 * `text` is the darkened variant — the plain pop is a fill colour and
 * goes muddy under words on paper. `ring` is always ink: borders in this
 * theme do not take an accent.
 */
export const ACCENT: Record<
  string,
  { text: string; bg: string; ring: string; dot: string; glow: string }
> = {
  orange: { text: 'text-brand-600', bg: 'bg-brand-500/15', ring: 'ring-ink-line', dot: 'bg-brand-500', glow: 'shadow-brand-600/25' },
  amber: { text: 'text-amber-deep', bg: 'bg-amber/25', ring: 'ring-ink-line', dot: 'bg-amber', glow: 'shadow-amber-deep/25' },
  cyan: { text: 'text-cyan-deep', bg: 'bg-cyan/15', ring: 'ring-ink-line', dot: 'bg-cyan', glow: 'shadow-cyan-deep/25' },
  lime: { text: 'text-lime-deep', bg: 'bg-lime/18', ring: 'ring-ink-line', dot: 'bg-lime', glow: 'shadow-lime-deep/25' },
  violet: { text: 'text-violet-deep', bg: 'bg-violet/15', ring: 'ring-ink-line', dot: 'bg-violet', glow: 'shadow-violet-deep/25' },
  pink: { text: 'text-pink-deep', bg: 'bg-pink/15', ring: 'ring-ink-line', dot: 'bg-pink', glow: 'shadow-pink-deep/25' },
  slate: { text: 'text-slate-deep', bg: 'bg-slate/18', ring: 'ring-ink-line', dot: 'bg-slate', glow: 'shadow-slate-deep/25' },
};

export const accent = (key: string) => ACCENT[key] ?? ACCENT.orange;

/* ---------------- layout ---------------- */

export function Container({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

/** Section header. The `emoji` slot is optional and usually stays empty. */
export function SectionHead({
  emoji,
  eyebrow,
  title,
  sub,
  align = 'left',
}: {
  emoji?: string;
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: 'left' | 'center';
}) {
  const centered = align === 'center';
  return (
    <header className={`mb-10 ${centered ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl'}`}>
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-extrabold leading-tight text-cream sm:text-4xl">
        {emoji && <span className="mr-2.5 align-middle">{emoji}</span>}
        {title}
      </h2>
      {sub && <p className="mt-4 text-lg leading-relaxed text-cream-dim">{sub}</p>}
    </header>
  );
}

/* ---------------- bits ---------------- */

export function Pill({
  children,
  tone = 'neutral',
  className = '',
}: {
  children: ReactNode;
  tone?: 'neutral' | 'brand' | 'good' | 'muted';
  className?: string;
}) {
  const tones = {
    neutral: 'bg-ink-700 text-cream',
    brand: 'bg-brand-400 text-cream',
    good: 'bg-lime/35 text-cream',
    muted: 'bg-ink-500 text-cream-dim',
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-ink-line px-2.5 py-1 text-xs font-semibold hard-shadow-xs ${tones} ${className}`}
    >
      {children}
    </span>
  );
}

type BtnProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'md' | 'lg';
  external?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

export function Btn({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  external,
  className = '',
  type = 'button',
  disabled,
}: BtnProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-bounce disabled:opacity-50 disabled:pointer-events-none';
  const sizes = { md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' }[size];
  // Ink border, hard shadow, and the shadow collapses under the press.
  const solid =
    'border-[3px] border-ink-line hard-shadow hover:-translate-y-1 hover:hard-shadow-lg active:translate-y-0.5 active:hard-shadow-xs';
  const variants = {
    primary: `${solid} bg-brand-500 text-cream hover:bg-brand-400`,
    outline: `${solid} bg-ink-700 text-cream hover:bg-brand-500/12`,
    ghost: 'text-cream-dim hover:text-cream hover:bg-cream/8',
  }[variant];
  const cls = `${base} ${sizes} ${variants} ${className}`;

  if (href) {
    if (external || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return (
        <a
          href={href}
          className={cls}
          {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  );
}

/** The polaroid: 3px ink border, hard shadow, lifts and straightens on hover. */
export function Card({
  children,
  className = '',
  as: As = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  return <As className={`group polaroid p-6 ${className}`}>{children}</As>;
}
