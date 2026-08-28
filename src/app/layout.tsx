import type { Metadata } from 'next';
import { Baloo_2, Outfit } from 'next/font/google';
import './globals.css';
import { StudentProvider } from '@/lib/student';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { site, asset, BASE_PATH } from '@/data/site';

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-baloo',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-outfit',
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
    <html lang="en" className={`${baloo.variable} ${outfit.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <StudentProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-brand-500 focus:px-4 focus:py-2 focus:font-semibold focus:text-ink-900"
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
