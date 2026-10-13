import React from 'react';
import { Metadata } from 'next';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { CartDrawer } from '../../../components/layout/CartDrawer';
import {
  SubscriptionSaveHero,
  SubscriptionJourneyFlow,
  SubscriptionEligibleProducts,
  SubscriptionCadenceGuide,
  SubscriptionPricingCalculator,
  SubscriptionFlexibilityRules,
  SubscriptionVsReorderComparison,
  SubscriptionSaveCTA,
} from '../../../components/subscription-save';

export const metadata: Metadata = {
  title: 'How Subscribe & Save Works | Rowan & Hound Supply Co.',
  description:
    'An unadulterated guide to our small-batch nutrition subscriptions: guaranteed 10% member savings, custom feeding intervals, zero minimum cycles, and flexible pantry adjustments.',
  openGraph: {
    title: 'Subscribe & Save Guide — Rowan & Hound Supply Co.',
    description:
      'Understand how our recurring pet provisions work: 10% savings, custom cadences, and complete household control.',
  },
};

export default function SubscriptionSavePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* 1. Global Header */}
      <Header activeFilter="subscriptions" />

      {/* 2. Educational & Editorial Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Editorial Masthead */}
        <SubscriptionSaveHero />

        {/* Practical Visual Journey (Choose essentials → frequency → savings → recurring → adjust) */}
        <SubscriptionJourneyFlow />

        {/* Which products can be subscribed to? */}
        <SubscriptionEligibleProducts />

        {/* How often deliveries happen? */}
        <SubscriptionCadenceGuide />

        {/* How pricing and savings are calculated */}
        <SubscriptionPricingCalculator />

        {/* Flexibility: change frequency, skip, cancel */}
        <SubscriptionFlexibilityRules />

        {/* How does reorder differ from subscription? */}
        <SubscriptionVsReorderComparison />

        {/* Closing Action */}
        <SubscriptionSaveCTA />
      </main>

      {/* 3. Global Footer */}
      <Footer />

      {/* 4. Global Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
