import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/layout/CartDrawer';
import { OrderConfirmationContent } from '../../components/order-confirmation/OrderConfirmationContent';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Order Confirmation | Rowan & Hound Supply Co.',
  description:
    'Review your confirmed provisions order reference, batch packing timeline, recurring auto-ship routine schedule, and Pacific Northwest courier delivery details.',
  openGraph: {
    title: 'Order Confirmation — Rowan & Hound Supply Co.',
    description:
      'Review your confirmed provisions order reference, recurring auto-ship routine schedule, and courier delivery details.',
  },
};

function OrderConfirmationFallback() {
  return (
    <div className="py-24 flex flex-col items-center justify-center space-y-3 text-stone-500">
      <Loader2 className="w-8 h-8 animate-spin text-stone-800" />
      <p className="text-xs font-mono">Loading order confirmation details...</p>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* 1. Header */}
      <Header />

      {/* 2. Main Order Confirmation Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Suspense fallback={<OrderConfirmationFallback />}>
          <OrderConfirmationContent />
        </Suspense>
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Global Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
