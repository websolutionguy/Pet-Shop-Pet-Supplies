'use client';

import React from 'react';
import { Repeat, Check, ShieldCheck } from 'lucide-react';
import { ProductCadence } from '../../types/product';
import { CADENCE_OPTIONS } from '../../lib/constants';
import { formatCurrency, formatCadenceLabel } from '../../lib/utils';
import { cn } from '../../lib/utils';

export interface SubscriptionSelectorProps {
  purchaseType: 'one-time' | 'subscription';
  onPurchaseTypeChange: (type: 'one-time' | 'subscription') => void;
  cadence: ProductCadence;
  onCadenceChange: (cadence: ProductCadence) => void;
  cadenceOptions?: ProductCadence[];
  oneTimePrice: number;
  subscriptionPrice: number;
  discountPercentage?: number;
  showPerksSummary?: boolean;
  className?: string;
}

export function SubscriptionSelector({
  purchaseType,
  onPurchaseTypeChange,
  cadence,
  onCadenceChange,
  cadenceOptions = ['2-weeks', '4-weeks', '6-weeks', '8-weeks'],
  oneTimePrice,
  subscriptionPrice,
  discountPercentage = 10,
  showPerksSummary = true,
  className,
}: SubscriptionSelectorProps) {
  const savingsAmount = Number((oneTimePrice - subscriptionPrice).toFixed(2));

  return (
    <div className={cn('space-y-3', className)}>
      {/* Explicit status banner (never relying only on color) */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-700">
          Purchase &amp; Delivery:
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-950 bg-emerald-100/90 px-2 py-0.5 rounded-xs border border-emerald-300">
          <Repeat className="w-3 h-3 text-emerald-800" aria-hidden="true" />
          <span>Subscription available · Save {discountPercentage}%</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Purchase and Delivery Options">
        {/* Auto-Ship Option */}
        <button
          type="button"
          role="radio"
          aria-checked={purchaseType === 'subscription'}
          onClick={() => onPurchaseTypeChange('subscription')}
          className={cn(
            'p-3 border rounded-xs text-left transition-colors relative cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900 focus-visible:ring-offset-2',
            purchaseType === 'subscription'
              ? 'border-emerald-800 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-800'
              : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
          )}
          aria-label={`Auto-Ship recurring delivery: ${formatCurrency(subscriptionPrice)}, saving ${formatCurrency(savingsAmount)} (${discountPercentage}% discount), delivered every ${CADENCE_OPTIONS[cadence]?.label || cadence}${purchaseType === 'subscription' ? ' (selected)' : ''}`}
        >
          {/* Screen reader specific breakdown */}
          <span className="sr-only">
            Subscription available. Recurring price: {formatCurrency(subscriptionPrice)}. Discount: save {formatCurrency(savingsAmount)} ({discountPercentage}% off regular price {formatCurrency(oneTimePrice)}). Delivery frequency: every {CADENCE_OPTIONS[cadence]?.label || cadence}.
          </span>

          <div className="flex items-center justify-between text-xs font-semibold" aria-hidden="true">
            <span className="flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-emerald-800" />
              <span>Auto-Ship</span>
            </span>
            <span className="font-mono text-emerald-900 bg-emerald-100 px-1 py-0.5 rounded-xs text-[10px] font-bold border border-emerald-200">
              Save {discountPercentage}%
            </span>
          </div>

          <div className="font-mono text-sm sm:text-base font-semibold tabular-nums mt-1 text-stone-900" aria-hidden="true">
            {formatCurrency(subscriptionPrice)}
          </div>
          <span className="text-[10px] text-stone-600 block mt-0.5" aria-hidden="true">
            Recurring batch delivery
          </span>
        </button>

        {/* One-Time Option */}
        <button
          type="button"
          role="radio"
          aria-checked={purchaseType === 'one-time'}
          onClick={() => onPurchaseTypeChange('one-time')}
          className={cn(
            'p-3 border rounded-xs text-left transition-colors cursor-pointer min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2',
            purchaseType === 'one-time'
              ? 'border-stone-900 bg-stone-100/70 text-stone-950 ring-1 ring-stone-900'
              : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
          )}
          aria-label={`One-Time delivery: ${formatCurrency(oneTimePrice)}, single shipment${purchaseType === 'one-time' ? ' (selected)' : ''}`}
        >
          <span className="sr-only">
            One-time purchase price: {formatCurrency(oneTimePrice)}. Single shipment dispatch.
          </span>

          <div className="flex items-center justify-between text-xs font-semibold" aria-hidden="true">
            <span>One-Time</span>
          </div>
          <div className="font-mono text-sm sm:text-base font-semibold tabular-nums mt-1 text-stone-900" aria-hidden="true">
            {formatCurrency(oneTimePrice)}
          </div>
          <span className="text-[10px] text-stone-600 block mt-0.5" aria-hidden="true">
            Single shipment
          </span>
        </button>
      </div>

      {/* Frequency selector when Auto-Ship is active */}
      {purchaseType === 'subscription' && (
        <div className="bg-stone-50 border border-stone-200/80 rounded-xs p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="cadence-select-ui" className="text-xs font-medium text-stone-800">
              Delivery Rhythm:
            </label>
            <select
              id="cadence-select-ui"
              value={cadence}
              onChange={(e) => onCadenceChange(e.target.value as ProductCadence)}
              className="bg-white border border-stone-300 text-stone-900 text-xs rounded-xs px-2.5 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 min-h-[38px] cursor-pointer"
              aria-label="Select delivery cadence"
            >
              {cadenceOptions.map((c) => (
                <option key={c} value={c}>
                  {CADENCE_OPTIONS[c]?.label || c}
                </option>
              ))}
            </select>
          </div>

          {showPerksSummary && (
            <div className="pt-2 border-t border-stone-200/60 flex items-center gap-1.5 text-[11px] text-stone-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" aria-hidden="true" />
              <span>Pause, skip or change frequency anytime with 1 click</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
