import React from 'react';
import { Metadata } from 'next';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/layout/CartDrawer';
import { JournalListView } from '../../components/journal';
import { generatePageMetadata, buildBreadcrumbSchema } from '../../lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Companion Journal & Nutrition Field Notes | Rowan & Hound',
  description:
    'Veterinary-guided field notes on small-batch pet nutrition, feline hydration biology, natural timber cat litter schedules, and pantry feeding routines.',
  path: '/journal',
  keywords: [
    'pet supplies',
    'dog food',
    'cat food',
    'pet treats',
    'cat litter subscription',
    'pet nutrition journal',
  ],
});

export default function JournalPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'The Journal', path: '/journal' },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* 1. Global Header */}
      <Header />

      {/* 2. Main Journal Body */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 outline-none">
        <JournalListView />
      </main>

      {/* 3. Global Footer */}
      <Footer />

      {/* 4. Global Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
