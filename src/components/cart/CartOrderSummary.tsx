'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Truck,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Tag,
  X,
  AlertCircle,
  Repeat,
  Package,
} from 'lucide-react';
import { useCart } from '../../providers/CartProvider';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface CartOrderSummaryProps {
  className?: string;
  onCheckout?: () => void;
  showCheckoutButton?: boolean;
}

export function CartOrderSummary({
  className,
  onCheckout,
  showCheckoutButton = true,
}: CartOrderSummaryProps) {
  const { summary, promoCode, promoMessage, applyPromoCode, removePromoCode } = useCart();
  const [inputCode, setInputCode] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setIsApplying(true);
    setInputError(null);

    const result = applyPromoCode(inputCode.trim());
    if (!result.valid) {
      setInputError(result.message);
    } else {
      setInputCode('');
    }
    setIsApplying(false);
  };

  const handleRemovePromo = () => {
    removePromoCode();
    setInputError(null);
  };

  return (
    <aside
      className={cn(
        'bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 shadow-xs space-y-5',
        className
      )}
      aria-label="Order summary breakdown"
    >
      {/* Header & Basket Type Indicator */}
      <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
        <h3 className="font-serif text-lg font-semibold text-stone-900">
          Order Summary
        </h3>

        {summary.isMixedCart ? (
          <span className="font-mono text-[11px] font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-xs border border-emerald-300">
            Mixed Basket
          </span>
        ) : summary.hasSubscriptionItems ? (
          <span className="font-mono text-[11px] font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-xs border border-emerald-300">
            Auto-Ship Routine
          </span>
        ) : (
          <span className="font-mono text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-xs border border-stone-200">
            One-Time Order
          </span>
        )}
      </div>

      {/* Free Shipping Progress Meter */}
      <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs text-xs space-y-1.5">
        {summary.qualifiesForFreeShipping ? (
          <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Complimentary Pacific Northwest courier delivery qualified!</span>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-stone-700">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-stone-500" />
                <span>Add {formatCurrency(summary.amountNeededForFreeShipping)} for free shipping</span>
              </span>
              <span className="font-mono tabular-nums text-stone-500">
                {Math.round(
                  ((summary.freeShippingThreshold - summary.amountNeededForFreeShipping) /
                    summary.freeShippingThreshold) *
                    100
                )}%
              </span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-800 h-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      ((summary.freeShippingThreshold - summary.amountNeededForFreeShipping) /
                        summary.freeShippingThreshold) *
                        100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Summary Financial Calculations from cartService */}
      <div className="space-y-2 text-xs text-stone-600">
        {/* Screen-reader full order totals breakdown */}
        <div className="sr-only">
          Order financial summary:
          Subtotal: {formatCurrency(summary.productSubtotal)}.
          {summary.subscriptionSavings > 0 && ` Auto-ship subscription savings: minus ${formatCurrency(summary.subscriptionSavings)}.`}
          {summary.promotionDiscount > 0 && ` Promotion discount: minus ${formatCurrency(summary.promotionDiscount)}.`}
          Shipping: {summary.qualifiesForFreeShipping ? 'Free Pacific Northwest courier dispatch' : formatCurrency(summary.estimatedShipping)}.
          Estimated sales tax: {formatCurrency(summary.estimatedTax)}.
          Order grand total: {formatCurrency(summary.total)}.
        </div>

        {/* Product Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-stone-700">Product Subtotal</span>
          <span className="font-mono text-stone-900 tabular-nums">
            {formatCurrency(summary.productSubtotal)}
          </span>
        </div>

        {/* Subscription Savings */}
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

        {/* Promotional Code Discount */}
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

        {/* Shipping */}
        <div className="flex items-center justify-between">
          <span className="text-stone-700">Courier Shipping</span>
          <span className="font-mono tabular-nums text-stone-900">
            {summary.qualifiesForFreeShipping ? (
              <span className="text-emerald-800 font-semibold">FREE</span>
            ) : (
              formatCurrency(summary.estimatedShipping)
            )}
          </span>
        </div>

        {/* Estimated Tax */}
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
                  ? 'First shipment + one-time provisions'
                  : 'First auto-ship cycle shipment'
                : 'USD inclusive of batch packaging'}
            </span>
          </div>

          <span className="font-mono text-xl sm:text-2xl font-bold tracking-tight tabular-nums">
            {formatCurrency(summary.total)}
          </span>
        </div>

        {summary.hasSubscriptionItems && (
          <div className="p-2.5 bg-stone-50 rounded-xs border border-stone-200/80 text-[11px] text-stone-600 font-mono flex items-center justify-between">
            <span className="text-stone-500">Recurring Cycle Charge:</span>
            <span className="font-bold text-emerald-950">
              {formatCurrency(summary.recurringCycleTotal || summary.total)} / routine cycle
            </span>
          </div>
        )}
      </div>

      {/* Promotion Code Form */}
      <div className="pt-2 border-t border-stone-100 space-y-2">
        {summary.appliedPromoCode ? (
          <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xs text-xs">
            <div className="flex items-center gap-1.5 text-emerald-950 font-mono font-medium">
              <Tag className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
              <span>Code <strong>{summary.appliedPromoCode}</strong> applied</span>
            </div>
            <button
              type="button"
              onClick={handleRemovePromo}
              className="text-stone-400 hover:text-red-700 p-0.5 cursor-pointer transition-colors"
              title="Remove promotion code"
              aria-label="Remove promotion code"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromo} className="space-y-1.5">
            <label htmlFor="promo-code-cart-input" className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Promotion / Routine Code
            </label>
            <div className="flex gap-1.5">
              <input
                id="promo-code-cart-input"
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value);
                  if (inputError) setInputError(null);
                }}
                aria-invalid={Boolean(inputError)}
                aria-describedby={inputError ? 'cart-promo-error' : promoMessage ? 'cart-promo-success' : undefined}
                placeholder="e.g. BUNDLE12 or FREESHIP49"
                className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xs text-stone-900 focus-visible:ring-2 focus-visible:ring-stone-900 focus:outline-none uppercase font-mono min-h-[38px]"
              />
              <button
                type="submit"
                disabled={isApplying || !inputCode.trim()}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 border border-stone-300 rounded-xs transition-colors cursor-pointer min-h-[38px] focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none"
              >
                Apply
              </button>
            </div>
          </form>
        )}

        {inputError && (
          <p id="cart-promo-error" role="alert" className="text-[11px] text-red-700 flex items-center gap-1 font-mono">
            <AlertCircle className="w-3 h-3 shrink-0" aria-hidden="true" />
            <span>{inputError}</span>
          </p>
        )}

        {promoMessage && (
          <p id="cart-promo-success" role="status" aria-live="polite" className="text-[11px] text-emerald-800 font-mono">
            {promoMessage}
          </p>
        )}
      </div>

      {/* Subscription Reassurance */}
      {summary.hasSubscriptionItems && (
        <div className="p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xs text-xs text-emerald-950 space-y-1">
          <div className="flex items-center gap-1.5 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span>Flexible Auto-Ship Routine</span>
          </div>
          <p className="text-[11px] text-emerald-900/80 leading-relaxed">
            Auto-ship items renew automatically on your chosen rhythm. You can pause, adjust cadence, or cancel anytime before upcoming dispatches.
          </p>
        </div>
      )}

      {/* Checkout Action CTA */}
      {showCheckoutButton && (
        <div className="space-y-2 pt-2">
          <Button
            variant="primary"
            size="lg"
            disabled={summary.itemCount === 0}
            onClick={onCheckout}
            className="w-full text-xs uppercase tracking-wider font-semibold"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Proceed to Checkout ({summary.itemCount} {summary.itemCount === 1 ? 'Item' : 'Items'})
          </Button>

          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
            <span>Portland Regional Quality &amp; Freshness Guarantee</span>
          </div>
        </div>
      )}
    </aside>
  );
}
