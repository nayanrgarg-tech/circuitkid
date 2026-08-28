import Link from 'next/link';
import { nav, links, site } from '@/data/site';

const socials = [
  { label: 'YouTube', href: links.youtube },
  { label: 'Instagram', href: links.instagram },
  { label: 'TikTok', href: links.tiktok },
];

const linkStyle = 'text-cream-dim transition-colors hover:text-brand-600';

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-ink-line bg-ink-800">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-display text-xl font-bold">
            <span className="grid h-10 w-10 -rotate-3 place-items-center rounded-[10px] border-[3px] border-ink-line bg-brand-500 text-lg font-bold text-cream shadow-[3px_3px_0_var(--color-ink-line)]">
              C
            </span>
            <span>
              Circuit<span className="text-brand-600">Kid</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-dim">
            {site.description}
          </p>
          <p className="mt-5 text-sm text-cream-dim">
            Questions? Email{' '}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-brand-600 underline decoration-2 underline-offset-4 hover:text-brand-500"
            >
              {site.email}
            </a>
          </p>
          <p className="mt-1.5 text-sm text-cream-dim">
            Or call{' '}
            <a
              href={`tel:${site.phone}`}
              className="font-semibold text-brand-600 underline decoration-2 underline-offset-4 hover:text-brand-500"
            >
              {site.phoneLabel}
            </a>
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <h3 className="mb-4 font-display text-base font-bold">Explore</h3>
          <ul className="space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkStyle}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login" className={linkStyle}>
                Student Login
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <h3 className="mb-4 font-display text-base font-bold">Follow along</h3>
          <ul className="space-y-2.5">
            {socials.map((s) =>
              s.href ? (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkStyle}>
                    {s.label}
                  </a>
                </li>
              ) : (
                <li key={s.label} className="text-cream-faint">
                  {s.label} <span className="text-xs">(soon)</span>
                </li>
              ),
            )}
          </ul>
          <a
            href={links.signUp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full border-[3px] border-ink-line bg-brand-500 px-5 py-2.5 text-sm font-bold text-cream shadow-[3px_3px_0_var(--color-ink-line)] transition-all duration-200 ease-[cubic-bezier(0.34,1.7,0.5,1)] hover:-translate-y-0.5 hover:shadow-[4px_6px_0_var(--color-ink-line)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0_var(--color-ink-line)]"
          >
            Get the kit
          </a>
        </div>
      </div>

      <div className="border-t-[3px] border-ink-line">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-cream-dim sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. Built by a student, for students.
          </p>
          <p>Made with a soldering iron and a lot of blinking LEDs.</p>
        </div>
      </div>
    </footer>
  );
}
