import React from 'react';
import { Metadata } from 'next';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/layout/CartDrawer';
import { AccountOverviewContent } from '../../components/account/AccountOverviewContent';

export const metadata: Metadata = {
  title: 'My Account & Pantry | Rowan & Hound Supply Co.',
  description:
    'Manage your companion pantry, past provisions dispatches, auto-ship subscriptions, and companion profiles with Rowan & Hound Supply Co.',
  openGraph: {
    title: 'My Account & Pantry — Rowan & Hound Supply Co.',
    description:
      'Manage your companion pantry, past provisions dispatches, auto-ship subscriptions, and companion profiles.',
  },
};

export default function AccountPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Consumer Account Workspace */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 outline-none">
        <AccountOverviewContent />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Global Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
