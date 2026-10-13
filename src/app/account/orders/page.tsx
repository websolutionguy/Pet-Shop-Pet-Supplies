import React from 'react';
import { Metadata } from 'next';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { CartDrawer } from '../../../components/layout/CartDrawer';
import { AccountOrdersContent } from '../../../components/account/AccountOrdersContent';

export const metadata: Metadata = {
  title: 'Order History & Invoices | Rowan & Hound Supply Co.',
  description:
    'Review all past and current Pacific Northwest provisions orders, delivery receipts, carrier tracking details, and small-batch invoices.',
  openGraph: {
    title: 'Order History & Invoices — Rowan & Hound Supply Co.',
    description:
      'Review all past and current Pacific Northwest provisions orders, delivery receipts, and carrier tracking details.',
  },
};

export default function AccountOrdersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Orders Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <AccountOrdersContent />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Global Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
