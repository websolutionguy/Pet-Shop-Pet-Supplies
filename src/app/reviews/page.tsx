import React from 'react';
import { Metadata } from 'next';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/layout/CartDrawer';
import { ReviewsListView } from '../../components/reviews';

export const metadata: Metadata = {
  title: 'Customer Reviews & Feedback | Rowan & Hound Supply Co.',
  description:
    'Read honest feedback from Pacific Northwest companion guardians feeding our small-batch venison kibbles, cold-pressed marine oils, and natural chews.',
  openGraph: {
    title: 'Customer Reviews & Feedback — Rowan & Hound Supply Co.',
    description:
      'Direct observations from companion guardians feeding our small-batch recipes.',
  },
};

export default function ReviewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* 1. Global Header */}
      <Header />

      {/* 2. Main Reviews Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        <ReviewsListView />
      </main>

      {/* 3. Global Footer */}
      <Footer />

      {/* 4. Global Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
