/**
 * Shared presentational primitives.
 * Server-safe (no hooks, no 'use client') so any page can import them.
 */
import Link from 'next/link';
import type { ReactNode } from 'react';

/* ---------------- accents ---------------- */

export const ACCENT: Record<
  string,
  { text: string; bg: string; ring: string; dot: string; glow: string }
> = {
  orange: { text: 'text-brand-400', bg: 'bg-brand-500/12', ring: 'ring-brand-500/30', dot: 'bg-brand-500', glow: 'shadow-brand-500/20' },
  amber: { text: 'text-amber', bg: 'bg-amber/12', ring: 'ring-amber/30', dot: 'bg-amber', glow: 'shadow-amber/20' },
  cyan: { text: 'text-cyan', bg: 'bg-cyan/12', ring: 'ring-cyan/30', dot: 'bg-cyan', glow: 'shadow-cyan/20' },
  lime: { text: 'text-lime', bg: 'bg-lime/12', ring: 'ring-lime/30', dot: 'bg-lime', glow: 'shadow-lime/20' },
  violet: { text: 'text-violet', bg: 'bg-violet/12', ring: 'ring-violet/30', dot: 'bg-violet', glow: 'shadow-violet/20' },
  pink: { text: 'text-pink', bg: 'bg-pink/12', ring: 'ring-pink/30', dot: 'bg-pink', glow: 'shadow-pink/20' },
  slate: { text: 'text-slate', bg: 'bg-slate/12', ring: 'ring-slate/30', dot: 'bg-slate', glow: 'shadow-slate/20' },
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

/** Emoji-accented section header. */
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
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl">
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
    neutral: 'bg-cream/8 text-cream-dim ring-cream/12',
    brand: 'bg-brand-500/15 text-brand-300 ring-brand-500/30',
    good: 'bg-lime/15 text-lime ring-lime/30',
    muted: 'bg-cream/5 text-cream-faint ring-cream/8',
  }[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${tones} ${className}`}
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
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none';
  const sizes = { md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' }[size];
  const variants = {
    primary:
      'bg-brand-500 text-ink-900 shadow-lg shadow-brand-600/25 hover:bg-brand-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/30',
    outline:
      'ring-2 ring-brand-500/50 text-brand-300 hover:bg-brand-500/10 hover:ring-brand-400 hover:-translate-y-0.5',
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

/** Hover-lifting card used across every grid on the site. */
export function Card({
  children,
  className = '',
  as: As = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  return (
    <As
      className={`group card p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-500/40 hover:bg-ink-600/80 hover:shadow-2xl hover:shadow-brand-900/40 ${className}`}
    >
      {children}
    </As>
  );
}
