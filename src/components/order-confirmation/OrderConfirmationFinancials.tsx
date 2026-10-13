'use client';

import React from 'react';
import { CreditCard, Tag, Repeat, Receipt } from 'lucide-react';
import { CartSummary } from '../../types/cart';
import { formatCurrency } from '../../lib/utils';

interface OrderConfirmationFinancialsProps {
  summary: CartSummary;
}

export function OrderConfirmationFinancials({ summary }: OrderConfirmationFinancialsProps) {
  const totalDiscount = summary.subscriptionSavings + (summary.promotionDiscount || 0);

  return (
    <div className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
        <Receipt className="w-4 h-4 text-stone-700" />
        <h2 className="font-serif text-lg font-semibold text-stone-900">
          Financial Summary
        </h2>
      </div>

      <div className="space-y-2.5 text-xs text-stone-600">
        {/* Subtotal */}
        <div className="flex items-center justify-between">
          <span className="text-stone-700">Provisions Subtotal</span>
          <span className="font-mono text-stone-900 tabular-nums">
            {formatCurrency(summary.productSubtotal)}
          </span>
        </div>

        {/* Subscription Discount */}
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

        {/* Promo Discount */}
        {summary.promotionDiscount > 0 && (
          <div className="flex items-center justify-between text-emerald-900 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-800" />
              <span>Promotion Discount ({summary.appliedPromoCode})</span>
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
            {summary.estimatedShipping === 0 ? (
              <span className="text-emerald-800 font-semibold">FREE</span>
            ) : (
              formatCurrency(summary.estimatedShipping)
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex items-center justify-between">
          <span className="text-stone-700">Estimated Sales Tax (8.25%)</span>
          <span className="font-mono tabular-nums text-stone-900">
            {formatCurrency(summary.estimatedTax)}
          </span>
        </div>

        {/* Total */}
        <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between text-stone-900">
          <div>
            <span className="font-serif text-base font-semibold block leading-tight">
              Order Total
            </span>
            <span className="text-[10px] text-stone-500 font-mono">
              USD Inclusive
            </span>
          </div>

          <span className="font-mono text-xl font-bold tracking-tight tabular-nums">
            {formatCurrency(summary.total)}
          </span>
        </div>
      </div>

      {/* Payment Method Recap */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-mono">
        <div className="flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-stone-400" />
          <span>Payment Placeholder</span>
        </div>
        <span>Test Card Ending in •••• 4242</span>
      </div>
    </div>
  );
}
