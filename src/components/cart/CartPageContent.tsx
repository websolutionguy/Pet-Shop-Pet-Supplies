'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Truck,
  Trash2,
  ChevronLeft,
  Package,
  Info,
} from 'lucide-react';
import { useCart } from '../../providers/CartProvider';
import { CartItemRow } from './CartItemRow';
import { CartOrderSummary } from './CartOrderSummary';
import { EmptyCart } from './EmptyCart';
import { CartLoadingState } from './CartLoadingState';
import { CartErrorState } from './CartErrorState';
import { Button } from '../ui/Button';

export function CartPageContent() {
  const router = useRouter();
  const {
    items,
    summary,
    isLoading,
    error,
    clearCart,
    clearError,
  } = useCart();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Editorial Header */}
      <header className="bg-stone-900 text-stone-100 py-10 sm:py-12 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pacific Northwest Provisions</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white">
                Provisions Basket
              </h1>
              <p className="mt-2 text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Review your companion&apos;s whole-food recipes, adjust delivery rhythms, and prepare your household restock.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xs text-xs font-mono border border-stone-700 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Error notification if any */}
        {error && <CartErrorState message={error} onDismiss={clearError} />}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8">
              <CartLoadingState />
            </div>
            <div className="lg:col-span-4">
              <div className="h-64 bg-stone-200 animate-pulse rounded-xs" />
            </div>
          </div>
        ) : items.length === 0 ? (
          /* Empty Basket State */
          <EmptyCart />
        ) : (
          /* Active Basket Layout */
          <div>
            {/* Mixed Cart or Auto-Ship Notice Banner */}
            {summary.isMixedCart && (
              <div className="mb-6 p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-xs flex items-start gap-3 text-xs text-emerald-950">
                <Info className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-semibold block font-mono text-[11px] uppercase tracking-wider">
                    Mixed Provisions Basket Notice
                  </span>
                  <p className="leading-relaxed text-emerald-900">
                    Your basket contains both <strong>one-time purchases</strong> and <strong>continuous auto-ship provisions</strong>.
                    One-time items will dispatch immediately in your initial box. Auto-ship provisions will repeat automatically on their chosen cadence with continuous 10% savings.
                  </p>
                </div>
              </div>
            )}

            {summary.hasSubscriptionItems && !summary.isMixedCart && (
              <div className="mb-6 p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xs flex items-center justify-between gap-3 text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>
                    Your routine box qualifies for <strong>10% Subscribe &amp; Save</strong> on all recurring items. Pause or adjust cadence anytime.
                  </span>
                </div>
                <Link
                  href="/subscriptions"
                  className="font-mono text-[11px] font-semibold underline underline-offset-4 text-emerald-900 hover:text-emerald-700 shrink-0"
                >
                  Manage Routine →
                </Link>
              </div>
            )}

            {/* 2-Column Grid: Left (Items), Right (Order Summary) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Item List */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <h2 className="font-serif text-lg sm:text-xl font-normal text-stone-900">
                    Items in Your Basket ({summary.itemCount})
                  </h2>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear all items from your basket?')) {
                        clearCart();
                      }
                    }}
                    className="text-xs text-stone-500 hover:text-red-700 flex items-center gap-1 font-mono transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Basket</span>
                  </button>
                </div>

                {/* Item List */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItemRow key={item.id} item={item} />
                  ))}
                </div>

                {/* Back to shopping & Reorder link */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <Link
                    href="/shop"
                    className="text-stone-700 hover:text-stone-950 font-medium flex items-center gap-1.5 underline underline-offset-4"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Add More Recipes or Chews</span>
                  </Link>

                  <Link
                    href="/reorder"
                    className="text-stone-600 hover:text-stone-900 flex items-center gap-1.5 font-mono"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Quick Reorder Previous Deliveries</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-4 sticky top-20">
                <CartOrderSummary onCheckout={handleCheckout} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
