'use client';

import React from 'react';
import {
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { SubscriptionPriceCalculation } from '../../types/subscription';
import { CADENCE_OPTIONS } from '../../lib/constants';
import { formatCurrency, cn } from '../../lib/utils';
import { ProductCadence } from '../../types/product';

interface SubscriptionSummaryProps {
  productName: string;
  variantName?: string;
  calculation: SubscriptionPriceCalculation;
  className?: string;
}

export function SubscriptionSummary({
  productName,
  variantName,
  calculation,
  className,
}: SubscriptionSummaryProps) {
  if (!calculation.isEligible) {
    return null;
  }

  const cadenceObj = CADENCE_OPTIONS[calculation.frequency as ProductCadence];

  return (
    <div
      className={cn(
        'p-4 bg-stone-50 border border-stone-200/90 rounded-xs space-y-3.5 text-xs text-stone-700',
        className
      )}
    >
      {/* Screen-reader live region */}
      <div className="sr-only" aria-live="polite">
        Subscription summary: {productName} {variantName ? `(${variantName})` : ''}, recurring price {formatCurrency(calculation.subscriptionPrice)} every {cadenceObj?.label || calculation.frequency}, next estimated delivery {calculation.estimatedNextDelivery}, saving {calculation.discountPercentage}% ({formatCurrency(calculation.savings)} off per cycle).
      </div>

      <div className="flex items-center justify-between pb-2.5 border-b border-stone-200" aria-hidden="true">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
            Routine Summary
          </span>
          <h4 className="font-serif text-sm font-semibold text-stone-900">
            {productName} {variantName ? `· ${variantName}` : ''}
          </h4>
        </div>
        <div className="text-right">
          <span className="font-mono text-sm font-bold text-emerald-950 block tabular-nums">
            {formatCurrency(calculation.subscriptionPrice)}
          </span>
          <span className="text-[10px] text-emerald-800 font-mono">
            {cadenceObj?.shortLabel || calculation.frequency} cycle
          </span>
        </div>
      </div>

      {/* Structured metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
        <div className="p-2 bg-white border border-stone-200/80 rounded-xs">
          <span className="text-stone-500 block font-mono text-[10px] uppercase">
            Cadence Rhythm
          </span>
          <strong className="text-stone-900 font-semibold block mt-0.5">
            {cadenceObj?.label || calculation.frequency}
          </strong>
        </div>

        <div className="p-2 bg-white border border-stone-200/80 rounded-xs">
          <span className="text-stone-500 block font-mono text-[10px] uppercase">
            Next Estimated Dispatch
          </span>
          <strong className="text-emerald-950 font-semibold block mt-0.5 font-mono">
            {calculation.estimatedNextDelivery}
          </strong>
        </div>

        <div className="p-2 bg-white border border-stone-200/80 rounded-xs col-span-2 sm:col-span-1">
          <span className="text-stone-500 block font-mono text-[10px] uppercase">
            Cycle Discount
          </span>
          <strong className="text-emerald-900 font-semibold block mt-0.5 font-mono">
            {calculation.discountPercentage}% ({formatCurrency(calculation.savings)})
          </strong>
        </div>
      </div>

      {/* Transparent Service Guarantees */}
      <div className="space-y-1.5 pt-2 border-t border-stone-200/80 text-[11px] text-stone-600">
        <div className="flex items-center gap-1.5 text-stone-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
          <span>Pause, skip, or cancel anytime with one click — zero phone calls.</span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
          <span>3-day advance dispatch email & SMS reminder notice.</span>
        </div>
        <div className="flex items-center gap-1.5 text-stone-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
          <span>Guaranteed fresh batch allocation from 21-day Oregon kettle roasts.</span>
        </div>
      </div>
    </div>
  );
}
