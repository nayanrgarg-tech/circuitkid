'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav, links, site } from '@/data/site';
import { useStudent } from '@/lib/student';

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { ready, student } = useStudent();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-cream/10 bg-ink-900/85 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-3.5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5 font-display text-xl font-extrabold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-lg text-ink-900 transition-transform duration-300 group-hover:rotate-12">
            ⚡
          </span>
          <span>
            Circuit<span className="text-brand-400">Kid</span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive(item.href)
                  ? 'bg-brand-500/15 text-brand-300'
                  : 'text-cream-dim hover:bg-cream/8 hover:text-cream'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {ready && student ? (
            <Link
              href="/dashboard"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-lime/15 px-3.5 py-2 text-sm font-semibold text-lime ring-1 ring-lime/30 transition-colors hover:bg-lime/25"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full bg-lime text-[11px] font-bold text-ink-900">
                {student.name.charAt(0).toUpperCase()}
              </span>
              My Progress
            </Link>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-ink-900 transition-all hover:bg-brand-400 hover:-translate-y-0.5"
            >
              Student Login
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="ml-auto grid h-10 w-10 place-items-center rounded-xl bg-cream/8 text-cream md:hidden"
        >
          <span className="text-lg">{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-cream/10 bg-ink-800/98 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4 sm:px-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-base font-semibold ${
                  isActive(item.href) ? 'bg-brand-500/15 text-brand-300' : 'text-cream-dim'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={ready && student ? '/dashboard' : '/login'}
              className="mt-2 rounded-xl bg-brand-500 px-4 py-3 text-center text-base font-bold text-ink-900"
            >
              {ready && student ? `My Progress (${student.name})` : 'Student Login'}
            </Link>
            <a
              href={links.signUp}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl px-4 py-3 text-center text-base font-semibold text-brand-300 ring-1 ring-brand-500/40"
            >
              Get the {site.name} kit
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
