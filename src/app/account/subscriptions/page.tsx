import React from 'react';
import { Metadata } from 'next';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { CartDrawer } from '../../../components/layout/CartDrawer';
import { AccountSubscriptionsContent } from '../../../components/account/AccountSubscriptionsContent';

export const metadata: Metadata = {
  title: 'Manage Auto-Ship Subscriptions | Rowan & Hound Supply Co.',
  description:
    'Tailor your companion auto-ship routine: adjust replenishment frequencies, skip upcoming shipments, modify quantities, swap artisan recipes, or pause anytime with zero penalty.',
  openGraph: {
    title: 'Manage Auto-Ship Subscriptions — Rowan & Hound Supply Co.',
    description:
      'Tailor your companion auto-ship routine: adjust frequencies, skip shipments, modify quantities, swap recipes, or pause anytime.',
  },
};

export default function AccountSubscriptionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Subscription Management Workspace */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 outline-none">
        <AccountSubscriptionsContent />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Global Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
