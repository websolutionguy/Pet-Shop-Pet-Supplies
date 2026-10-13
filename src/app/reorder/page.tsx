import React from 'react';
import { Metadata } from 'next';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/layout/CartDrawer';
import { ReorderView } from '../../components/reorder/ReorderView';
import { generatePageMetadata, buildBreadcrumbSchema } from '../../lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Quick Pet Food Reorder & Pantry Replenishment | Rowan & Hound',
  description:
    'Fast one-click pet food reorder for your companion’s favorite recipes. Refill pantry supplies before the bowl runs dry or switch to a 10% saving auto-ship routine.',
  path: '/reorder',
  keywords: [
    'pet food reorder',
    'pet food replenishment',
    'dog food delivery',
    'cat food reorder',
    'pet supplies',
    'quick pet reorder',
  ],
});

export default function ReorderPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Quick Reorder', path: '/reorder' },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* 1. Header with active Reorder indicator */}
      <Header activeFilter="reorder" />

      {/* 2. Main Fast Reorder Workspace */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <ReorderView />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Slide-out Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
