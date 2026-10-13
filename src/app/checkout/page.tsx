import React from 'react';
import { Metadata } from 'next';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/layout/CartDrawer';
import { CheckoutPageContent } from '../../components/checkout/CheckoutPageContent';

export const metadata: Metadata = {
  title: 'Secure Checkout | Rowan & Hound Supply Co.',
  description:
    'Complete your order for whole-protein kibble, freeze-dried treats, and continuous auto-ship provisions. Transparent courier shipping across the Pacific Northwest.',
  openGraph: {
    title: 'Secure Checkout — Rowan & Hound Supply Co.',
    description:
      'Complete your order for whole-protein kibble, freeze-dried treats, and continuous auto-ship provisions.',
  },
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Checkout Flow */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <CheckoutPageContent />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Global Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
