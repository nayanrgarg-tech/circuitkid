'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { nav, links, site } from '@/data/site';
import { useStudent } from '@/lib/student';

/* Hard ink shadow, collapsing on press so buttons feel physical. */
const PRESSABLE =
  'border-[3px] border-ink-line shadow-[3px_3px_0_var(--color-ink-line)] transition-all duration-200 ease-[cubic-bezier(0.34,1.7,0.5,1)] hover:-translate-y-0.5 hover:shadow-[4px_6px_0_var(--color-ink-line)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_var(--color-ink-line)]';

function Wordmark() {
  return (
    <Link href="/" className="group flex items-center gap-2.5 font-display text-xl font-bold">
      <span className="grid h-10 w-10 -rotate-3 place-items-center rounded-[10px] border-[3px] border-ink-line bg-brand-500 text-lg font-bold text-cream shadow-[3px_3px_0_var(--color-ink-line)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.7,0.5,1)] group-hover:rotate-6">
        C
      </span>
      <span>
        Circuit<span className="text-brand-600">Kid</span>
      </span>
    </Link>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { ready, student } = useStudent();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink-line bg-ink-900">
      <nav className="mx-auto flex w-full max-w-6xl items-center gap-4 px-5 py-3.5 sm:px-8">
        <Wordmark />

        <div className="ml-auto hidden items-center gap-1.5 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 ease-[cubic-bezier(0.34,1.7,0.5,1)] ${
                isActive(item.href)
                  ? 'border-[3px] border-ink-line bg-brand-500 text-cream shadow-[3px_3px_0_var(--color-ink-line)]'
                  : 'border-[3px] border-transparent text-cream-dim hover:border-ink-line hover:bg-ink-700 hover:text-cream hover:shadow-[3px_3px_0_var(--color-ink-line)]'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {ready && student ? (
            <Link
              href="/dashboard"
              className={`ml-2 inline-flex items-center gap-2 rounded-full bg-lime py-1.5 pl-1.5 pr-4 text-sm font-bold text-cream ${PRESSABLE}`}
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-cream text-[11px] font-bold text-lime">
                {student.name.charAt(0).toUpperCase()}
              </span>
              My Progress
            </Link>
          ) : (
            <Link
              href="/login"
              className={`ml-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-bold text-cream ${PRESSABLE}`}
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
          className={`ml-auto grid h-10 w-10 place-items-center rounded-[10px] bg-ink-700 text-cream md:hidden ${PRESSABLE}`}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
          >
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t-[3px] border-ink-line bg-ink-700 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-4 sm:px-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`rounded-[14px] border-[3px] px-4 py-3 text-base font-semibold ${
                  isActive(item.href)
                    ? 'border-ink-line bg-brand-500 text-cream shadow-[3px_3px_0_var(--color-ink-line)]'
                    : 'border-transparent text-cream-dim'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={ready && student ? '/dashboard' : '/login'}
              className={`mt-2 rounded-[14px] bg-brand-500 px-4 py-3 text-center text-base font-bold text-cream ${PRESSABLE}`}
            >
              {ready && student ? `My Progress (${student.name})` : 'Student Login'}
            </Link>
            <a
              href={links.signUp}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-[14px] bg-ink-900 px-4 py-3 text-center text-base font-semibold text-cream ${PRESSABLE}`}
            >
              Get the {site.name} kit
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
