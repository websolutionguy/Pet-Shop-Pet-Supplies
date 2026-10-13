import React from 'react';
import { Metadata } from 'next';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/layout/CartDrawer';
import { SubscriptionBuilderView } from '../../components/subscription-builder/SubscriptionBuilderView';
import { generatePageMetadata, buildBreadcrumbSchema } from '../../lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Pet Food Subscription & Auto-Ship Delivery | Rowan & Hound',
  description:
    'Customizable pet supply subscription routines. Save 10% on kettle-roasted dog food delivery and natural cat litter subscriptions with zero-penalty skip, pause, or reschedule.',
  path: '/subscriptions',
  keywords: [
    'pet food subscription',
    'pet supply subscription',
    'dog food delivery',
    'cat litter subscription',
    'pet supplies auto ship',
    'dog food recurring delivery',
  ],
});

export default function SubscriptionsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Subscriptions', path: '/subscriptions' },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* 1. Header with active Subscriptions indicator */}
      <Header activeFilter="subscriptions" />

      {/* 2. Main Subscription Builder Experience */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <SubscriptionBuilderView />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Slide-out Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
