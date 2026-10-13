import React from 'react';
import { Metadata } from 'next';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/layout/CartDrawer';
import { CartPageContent } from '../../components/cart/CartPageContent';

export const metadata: Metadata = {
  title: 'Your Provisions Basket | Rowan & Hound Supply Co.',
  description:
    'Review your companion’s artisan kibble, treats, botanical supplements, and auto-ship delivery frequencies. Transparent batch pricing and Pacific Northwest shipping.',
  openGraph: {
    title: 'Your Provisions Basket — Rowan & Hound Supply Co.',
    description:
      'Review your companion’s artisan kibble, treats, botanical supplements, and auto-ship delivery frequencies.',
  },
};

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* 1. Header */}
      <Header />

      {/* 2. Full Cart Page Content */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <CartPageContent />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Slide-out Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
