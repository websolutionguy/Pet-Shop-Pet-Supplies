'use client';

import React from 'react';
import {
  RotateCcw,
  Sparkles,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../../providers/CartProvider';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface ReorderSummaryProps {
  className?: string;
  onProceedToCheckout?: () => void;
}

export function ReorderSummary({ className, onProceedToCheckout }: ReorderSummaryProps) {
  const { items, summary, openCart } = useCart();

  const totalItemCount = summary.itemCount;

  return (
    <aside
      className={cn(
        'bg-white border border-stone-200/90 rounded-xs p-5 shadow-xs space-y-5',
        className
      )}
      aria-label="Reorder Basket Summary"
    >
      <div className="pb-3 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-base font-semibold text-stone-900">
            Reorder Restock Basket
          </h3>
          <span className="text-[11px] text-stone-500 font-mono">
            {totalItemCount} item{totalItemCount !== 1 ? 's' : ''} in your pantry basket
          </span>
        </div>

        <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-xs border border-stone-200">
          Fast Restock
        </span>
      </div>

      {totalItemCount === 0 ? (
        <div className="py-6 text-center text-xs text-stone-500 border border-dashed border-stone-200 rounded-xs p-4 bg-stone-50/50">
          <RotateCcw className="w-5 h-5 text-stone-400 mx-auto mb-2" />
          <p className="font-medium text-stone-700">No restock items queued</p>
          <p className="text-[11px] text-stone-500 mt-1">
            Click &ldquo;Reorder&rdquo; on any previous order or pantry staple to queue items.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Quick list preview */}
          <div className="max-h-48 overflow-y-auto divide-y divide-stone-100">
            {items.map((item) => (
              <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <span className="font-medium text-stone-900 truncate block">
                    {item.product.name}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Qty: {item.quantity} · {item.purchaseType === 'subscription' ? 'Auto-Ship' : 'One-time'}
                  </span>
                </div>
                <span className="font-mono font-semibold text-stone-900 tabular-nums">
                  {formatCurrency(item.lineTotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-stone-600">
              <span>Subtotal:</span>
              <span className="font-mono tabular-nums">{formatCurrency(summary.subtotal)}</span>
            </div>

            {summary.subscriptionSavings > 0 && (
              <div className="flex items-center justify-between text-emerald-900 font-medium">
                <span>Auto-Ship Savings:</span>
                <span className="font-mono tabular-nums">
                  -{formatCurrency(summary.subscriptionSavings)}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-stone-600">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-stone-400" />
                <span>Shipping:</span>
              </span>
              <span className="font-mono tabular-nums">
                {summary.qualifiesForFreeShipping
                  ? 'FREE'
                  : formatCurrency(summary.estimatedShipping)}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-stone-200 text-stone-900">
              <span className="font-serif text-sm font-semibold">Estimated Total:</span>
              <span className="font-mono text-base font-bold text-stone-900 tabular-nums">
                {formatCurrency(summary.total)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          variant="primary"
          size="md"
          disabled={totalItemCount === 0}
          onClick={() => {
            if (onProceedToCheckout) {
              onProceedToCheckout();
            } else {
              openCart();
            }
          }}
          className="w-full text-xs font-medium"
          leftIcon={<ShoppingBag className="w-3.5 h-3.5" />}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          {totalItemCount === 0 ? 'Restock Basket Empty' : `Review Basket (${totalItemCount} items)`}
        </Button>
      </div>

      <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs text-[11px] text-stone-600 space-y-1">
        <div className="flex items-center gap-1.5 text-stone-700">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
          <span>Same-day Portland dispatch before 2:00 PM PST</span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
          <span>100% small-batch freshness guarantee</span>
        </div>
      </div>
    </aside>
  );
}
