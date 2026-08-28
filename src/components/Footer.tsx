import Link from 'next/link';
import { nav, links, site } from '@/data/site';

const socials = [
  { label: 'YouTube', href: links.youtube, emoji: '▶️' },
  { label: 'Instagram', href: links.instagram, emoji: '📸' },
  { label: 'TikTok', href: links.tiktok, emoji: '🎵' },
];

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-ink-800/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-display text-xl font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-lg text-ink-900">
              ⚡
            </span>
            Circuit<span className="-ml-2 text-brand-400">Kid</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream-faint">
            {site.description}
          </p>
          <p className="mt-5 text-sm text-cream-faint">
            Questions? Email{' '}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-brand-300 underline decoration-brand-500/40 underline-offset-4 hover:text-brand-400"
            >
              {site.email}
            </a>
          </p>
          <p className="mt-1.5 text-sm text-cream-faint">
            Or call{' '}
            <a href={`tel:${site.phone}`} className="font-semibold text-brand-300 hover:text-brand-400">
              {site.phoneLabel}
            </a>
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <h3 className="mb-4 font-display text-base font-bold">Explore</h3>
          <ul className="space-y-2.5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-cream-faint transition-colors hover:text-brand-300">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login" className="text-cream-faint transition-colors hover:text-brand-300">
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
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream-faint transition-colors hover:text-brand-300"
                  >
                    {s.emoji} {s.label}
                  </a>
                </li>
              ) : (
                <li key={s.label} className="text-cream-faint/50">
                  {s.emoji} {s.label} <span className="text-xs">— soon</span>
                </li>
              ),
            )}
          </ul>
          <a
            href={links.signUp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-brand-500 px-5 py-2.5 text-sm font-bold text-ink-900 transition-all hover:bg-brand-400 hover:-translate-y-0.5"
          >
            Get the kit →
          </a>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-6 text-xs text-cream-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. Built by a student, for students.
          </p>
          <p>Made with Arduino, solder, and a lot of blinking LEDs. ⚡</p>
        </div>
      </div>
    </footer>
  );
}
