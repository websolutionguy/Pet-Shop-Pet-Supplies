import type { Metadata } from 'next';
import { Inter, Newsreader, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '../providers';
import {
  SITE_URL,
  NATURAL_SEO_KEYWORDS,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from '../lib/seo';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  style: ['normal', 'italic'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      'Rowan & Hound Pet Supply Co. | Independent Pet Shop & Auto-Ship Subscriptions',
    template: '%s | Rowan & Hound Pet Supply Co.',
  },
  description:
    'Independent Pacific Northwest pet shop providing small-batch fresh roasted dog food, feline hydration broths, single-protein pet treats, and flexible auto-ship pet supply subscriptions.',
  keywords: NATURAL_SEO_KEYWORDS,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Rowan & Hound Supply Co.',
    title:
      'Rowan & Hound Pet Supply Co. | Independent Pet Shop & Auto-Ship Subscriptions',
    description:
      'Independent Pacific Northwest pet shop providing small-batch fresh roasted dog food, feline hydration broths, single-protein pet treats, and flexible auto-ship pet supply subscriptions.',
    images: [
      {
        url: `${SITE_URL}/src/assets/images/hero_dog_natural_1790396014202.jpg`,
        width: 1200,
        height: 630,
        alt: 'Rowan & Hound Pet Supply Co. — Pacific Northwest Natural Pet Nutrition',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Rowan & Hound Pet Supply Co. | Independent Pet Shop & Auto-Ship Subscriptions',
    description:
      'Independent Pacific Northwest pet shop providing small-batch fresh roasted dog food, feline hydration broths, single-protein pet treats, and flexible auto-ship pet supply subscriptions.',
    images: [`${SITE_URL}/src/assets/images/hero_dog_natural_1790396014202.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = buildOrganizationSchema();
  const websiteSchema = buildWebSiteSchema();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable} min-h-screen bg-stone-50 text-stone-900 font-sans antialiased selection:bg-stone-800 selection:text-stone-100 overflow-x-hidden`}
      >
        {/* Skip to Main Content for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-stone-900 focus:text-white focus:shadow-xl focus:ring-2 focus:ring-emerald-500 rounded-xs font-mono text-xs focus:outline-none"
        >
          Skip to main content
        </a>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
