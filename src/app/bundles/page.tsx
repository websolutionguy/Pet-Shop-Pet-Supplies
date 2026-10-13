import React from 'react';
import { Metadata } from 'next';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/layout/CartDrawer';
import { BundlesHero, BundlesListView } from '../../components/bundles';
import { generatePageMetadata, buildBreadcrumbSchema } from '../../lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Curated Pet Supply Bundles & Nutrition Kits | Rowan & Hound',
  description:
    'Purpose-matched companion kits: New Puppy Essentials, Everyday Dog Care, Cat Litter Routine, and Indoor Feline Hydration. Save up to 15% with complete bundle routines.',
  path: '/bundles',
  keywords: [
    'pet supply subscription',
    'pet supplies',
    'dog food delivery',
    'cat litter subscription',
    'pet treats',
    'curated pet bundle',
  ],
});

export default function BundlesPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Curated Bundles', path: '/bundles' },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* 1. Header with active Bundles link */}
      <Header activeFilter="bundles" />

      {/* 2. Main Bundles Workspace */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12 outline-none">
        <BundlesHero />
        <BundlesListView />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
