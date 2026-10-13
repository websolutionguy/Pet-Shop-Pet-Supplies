import React from 'react';
import { Metadata } from 'next';
import { faqService } from '../../services/faqService';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/layout/CartDrawer';
import { FaqAccordionView } from '../../components/faq';
import {
  generatePageMetadata,
  buildFAQSchema,
  buildBreadcrumbSchema,
} from '../../lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Frequently Asked Questions & Care Policies | Rowan & Hound',
  description:
    'Answers about small-batch pet provisions, 10% auto-ship subscriptions, one-click reordering, delivery schedules, and non-toxic ingredient standards.',
  path: '/faq',
  keywords: [
    'pet food subscription',
    'pet supply subscription',
    'dog food delivery',
    'cat litter subscription',
    'pet food reorder',
    'pet supplies',
  ],
});

export default async function FaqPage() {
  const faqs = await faqService.getFaqs();
  const faqSchema = buildFAQSchema(faqs);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: '/faq' },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 1. Global Header */}
      <Header />

      {/* 2. Main FAQ Accordion Body */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 outline-none">
        <FaqAccordionView />
      </main>

      {/* 3. Global Footer */}
      <Footer />

      {/* 4. Global Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
