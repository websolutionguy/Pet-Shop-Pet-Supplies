'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  Truck,
  Repeat,
  Sparkles,
  Lock,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useCart } from '../../providers/CartProvider';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { FeatureErrorState } from '../ui/StateFeedback';

interface CheckoutOrderReviewProps {
  onPlaceOrder: () => void;
  isSubmitting: boolean;
  generalError?: string | null;
}

export function CheckoutOrderReview({
  onPlaceOrder,
  isSubmitting,
  generalError,
}: CheckoutOrderReviewProps) {
  const shouldReduceMotion = useReducedMotion();
  const { summary } = useCart();

  return (
    <aside
      aria-labelledby="order-review-heading"
      className="p-5 sm:p-6 bg-white border border-stone-200/90 rounded-xs shadow-xs space-y-5 sticky top-20"
    >
      <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
        <h2 id="order-review-heading" className="font-serif text-lg font-semibold text-stone-900">
          Order Review
        </h2>

        <span className="font-mono text-xs text-stone-500">
          {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Cart Composition Tag */}
      <div>
        {summary.isMixedCart ? (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xs text-[11px] text-emerald-950 flex items-center gap-2">
            <Repeat className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span>
              <strong>Mixed Basket:</strong> One-time provisions dispatch now; auto-ship provisions repeat on schedule.
            </span>
          </div>
        ) : summary.hasSubscriptionItems ? (
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xs text-[11px] text-emerald-950 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span>
              <strong>Auto-Ship Routine:</strong> 10% continuous savings applied to recurring provisions.
            </span>
          </div>
        ) : (
          <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xs text-[11px] text-stone-700">
            <span>
              <strong>One-Time Delivery:</strong> Standard courier single fulfillment.
            </span>
          </div>
        )}
      </div>

      {/* Financial Calculations (Generated strictly from cartService) */}
      <div className="space-y-2.5 text-xs text-stone-600">
        {/* Screen-reader order summary breakdown */}
        <div className="sr-only">
          Order financial summary:
          Product subtotal: {formatCurrency(summary.productSubtotal)}.
          {summary.subscriptionSavings > 0 && ` Auto-ship recurring savings: minus ${formatCurrency(summary.subscriptionSavings)}.`}
          {summary.promotionDiscount > 0 && ` Promotion discount: minus ${formatCurrency(summary.promotionDiscount)}.`}
          Courier shipping: {summary.estimatedShipping === 0 ? 'Free courier dispatch' : formatCurrency(summary.estimatedShipping)}.
          Estimated sales tax: {formatCurrency(summary.estimatedTax)}.
          Order grand total: {formatCurrency(summary.total)}.
        </div>

        <div className="flex items-center justify-between">
          <span className="text-stone-700">Product Subtotal</span>
          <span className="font-mono text-stone-900 tabular-nums">
            {formatCurrency(summary.productSubtotal)}
          </span>
        </div>

        {summary.subscriptionSavings > 0 && (
          <div className="flex items-center justify-between text-emerald-900 font-medium">
            <span className="flex items-center gap-1">
              <Repeat className="w-3 h-3 text-emerald-800" />
              <span>Subscribe &amp; Save (10%)</span>
            </span>
            <span className="font-mono tabular-nums">
              -{formatCurrency(summary.subscriptionSavings)}
            </span>
          </div>
        )}

        {summary.promotionDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-900 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-800" />
              <span>Promotion ({summary.appliedPromoCode})</span>
            </span>
            <span className="font-mono tabular-nums">
              -{formatCurrency(summary.promotionDiscount)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-stone-700">Courier Shipping</span>
          <span className="font-mono tabular-nums text-stone-900">
            {summary.estimatedShipping === 0 ? (
              <span className="text-emerald-800 font-semibold">FREE</span>
            ) : (
              formatCurrency(summary.estimatedShipping)
            )}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-stone-700">Estimated Sales Tax (8.25%)</span>
          <span className="font-mono tabular-nums text-stone-900">
            {formatCurrency(summary.estimatedTax)}
          </span>
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between text-stone-900">
          <div>
            <span className="font-serif text-base font-semibold block leading-tight">
              Due Today
            </span>
            <span className="text-[10px] text-stone-500 font-mono">
              {summary.hasSubscriptionItems
                ? summary.isMixedCart
                  ? 'First shipment + one-time items'
                  : 'First auto-ship recurring order'
                : 'USD inclusive of batch packaging'}
            </span>
          </div>

          <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight tabular-nums overflow-hidden inline-block">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={summary.total}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0.5, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0.5, y: 2 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.16 }}
                className="inline-block"
              >
                {formatCurrency(summary.total)}
              </motion.span>
            </AnimatePresence>
          </span>
        </div>

        {summary.hasSubscriptionItems && (
          <div className="p-2.5 bg-emerald-50/70 rounded-xs border border-emerald-200 text-[11px] text-emerald-950 font-mono flex items-center justify-between">
            <span className="text-emerald-800">Recurring Routine Charge:</span>
            <strong>{formatCurrency(summary.recurringCycleTotal || summary.total)} / cycle</strong>
          </div>
        )}
      </div>

      {/* General validation error notification */}
      {generalError && (
        <FeatureErrorState
          compact={true}
          title="Order Submission Notice"
          message={generalError}
          onRetry={onPlaceOrder}
          retryLabel="Resubmit Order"
        />
      )}

      {/* Primary Action Button: "Place Order" */}
      <div className="space-y-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          disabled={isSubmitting || summary.itemCount === 0}
          onClick={onPlaceOrder}
          className="w-full text-xs uppercase tracking-wider font-semibold min-h-[48px] cursor-pointer"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </Button>

        <p className="text-[11px] text-stone-500 text-center leading-relaxed font-mono">
          By clicking &ldquo;Place Order&rdquo;, you authorize the scheduling of your provisions. No real charges occur in prototype mode.
        </p>
      </div>

      {/* Trust & Guarantee Indicators */}
      <div className="pt-3 border-t border-stone-100 space-y-2 text-[11px] text-stone-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>Pacific Northwest 100% Satisfaction Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-stone-600 shrink-0" />
          <span>256-Bit SSL Encrypted &amp; PCI Compliant Architecture</span>
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-stone-600 shrink-0" />
          <span>Temperature-monitored, small-batch courier dispatch</span>
        </div>
      </div>

      {/* Edit Basket Link */}
      <div className="pt-2 text-center">
        <Link
          href="/cart"
          className="text-xs font-mono text-stone-600 hover:text-stone-900 underline underline-offset-4"
        >
          ← Return to Edit Basket
        </Link>
      </div>
    </aside>
  );
}
