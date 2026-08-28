import type { Metadata } from 'next';
import { Fredoka, Inter } from 'next/font/google';
import './globals.css';
import { StudentProvider } from '@/lib/student';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { site, asset, BASE_PATH } from '@/data/site';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(`https://${site.domain}${BASE_PATH}`),
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: `https://${site.domain}`,
    siteName: site.name,
    type: 'website',
  },
  icons: {
    icon: [{ url: asset('/favicon.svg'), type: 'image/svg+xml' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable}`}>
      <body className="min-h-dvh flex flex-col bg-ink-900 text-cream">
        <StudentProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:border-[3px] focus:border-ink-line focus:bg-brand-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-cream"
          >
            Skip to content
          </a>
          <Nav />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </StudentProvider>
      </body>
    </html>
  );
}
