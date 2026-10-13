'use client';

import React from 'react';
import {
  AlertCircle,
  Repeat,
  Check,
  ShieldAlert,
  Info,
} from 'lucide-react';
import { Product, ProductVariant, ProductCadence } from '../../types/product';
import {
  SubscriptionPriceCalculation,
  SUBSCRIPTION_STATES,
} from '../../types/subscription';
import { FrequencySelector } from './FrequencySelector';
import { SubscriptionSavings } from './SubscriptionSavings';
import { SubscriptionSummary } from './SubscriptionSummary';
import { FeatureUnavailableNotice } from '../ui/StateFeedback';
import { formatCurrency, cn } from '../../lib/utils';

interface SubscriptionSelectorProps {
  product: Product;
  selectedVariant?: ProductVariant;
  quantity?: number;
  purchaseType: 'one-time' | 'subscription';
  onPurchaseTypeChange: (type: 'one-time' | 'subscription') => void;
  selectedCadence: ProductCadence;
  onCadenceChange: (cadence: ProductCadence) => void;
  calculation: SubscriptionPriceCalculation;
  className?: string;
  showSummary?: boolean;
}

export function SubscriptionSelector({
  product,
  selectedVariant,
  quantity = 1,
  purchaseType,
  onPurchaseTypeChange,
  selectedCadence,
  onCadenceChange,
  calculation,
  className,
  showSummary = true,
}: SubscriptionSelectorProps) {
  const isAvailable = calculation.status === SUBSCRIPTION_STATES.SUBSCRIPTION_AVAILABLE;
  const unitPrice = selectedVariant?.price ?? product.basePrice;
  const oneTimeTotal = Number((unitPrice * quantity).toFixed(2));

  return (
    <fieldset className={cn('space-y-3.5 border-0 p-0 m-0', className)}>
      <legend className="sr-only">Purchase and Subscription Delivery Options</legend>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-900 font-mono" aria-hidden="true">
          Purchase Options:
        </span>
        {isAvailable ? (
          <span className="text-[11px] font-mono text-emerald-950 font-semibold bg-emerald-100/90 px-2 py-0.5 rounded-xs border border-emerald-300">
            Subscription Available · Save {calculation.discountPercentage}%
          </span>
        ) : (
          <span className="text-[11px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded-xs border border-stone-200">
            Subscription Unavailable · One-Time Only
          </span>
        )}
      </div>

      <div className="space-y-2.5" role="radiogroup" aria-label="Purchase Options">
        {/* Option 1: One-time purchase */}
        <label
          htmlFor="purchase-type-one-time"
          className={cn(
            'p-3.5 border rounded-xs transition-all cursor-pointer flex items-center justify-between gap-3 focus-within:ring-2 focus-within:ring-stone-900 focus-within:ring-offset-2 outline-none',
            purchaseType === 'one-time'
              ? 'border-stone-900 bg-white ring-1 ring-stone-900 shadow-xs'
              : 'border-stone-200 bg-stone-50/60 hover:bg-stone-50 text-stone-700'
          )}
        >
          <div className="flex items-center gap-3">
            <input
              id="purchase-type-one-time"
              type="radio"
              name="purchaseType"
              value="one-time"
              checked={purchaseType === 'one-time'}
              onChange={() => onPurchaseTypeChange('one-time')}
              className="accent-stone-900 w-4 h-4 cursor-pointer focus:outline-none"
            />
            <div>
              <span className="text-xs font-semibold text-stone-900 font-serif block">
                One-Time Delivery
              </span>
              <span className="text-[11px] text-stone-600 font-mono">
                Standard single-dispatch fulfillment
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="sr-only">One-time delivery price: {formatCurrency(oneTimeTotal)}</span>
            <span className="font-mono text-xs font-semibold text-stone-900" aria-hidden="true">
              {formatCurrency(oneTimeTotal)}
            </span>
          </div>
        </label>

        {/* Option 2: Subscription routine */}
        {isAvailable ? (
          <div
            className={cn(
              'p-3.5 border rounded-xs transition-all flex flex-col gap-3 focus-within:ring-2 focus-within:ring-emerald-900 focus-within:ring-offset-2 outline-none',
              purchaseType === 'subscription'
                ? 'border-emerald-800 bg-emerald-50/30 ring-1 ring-emerald-800 shadow-xs'
                : 'border-stone-200 bg-stone-50/60 hover:bg-stone-50 text-stone-700'
            )}
          >
            <label
              htmlFor="purchase-type-subscription"
              className="flex items-center justify-between gap-3 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <input
                  id="purchase-type-subscription"
                  type="radio"
                  name="purchaseType"
                  value="subscription"
                  checked={purchaseType === 'subscription'}
                  onChange={() => onPurchaseTypeChange('subscription')}
                  className="accent-emerald-900 w-4 h-4 cursor-pointer focus:outline-none"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-900 font-serif">
                      Auto-Ship Subscription Routine
                    </span>
                    <span className="text-[10px] font-mono text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded-xs font-bold border border-emerald-200">
                      Save {calculation.discountPercentage}%
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-600 font-mono block mt-0.5">
                    Subscription Available · Zero lock-in · Skip, pause, or reschedule anytime
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="sr-only">
                  Recurring subscription price: {formatCurrency(calculation.subscriptionPrice)}, regular price was {formatCurrency(oneTimeTotal)}.
                </span>
                <span className="font-mono text-xs font-bold text-emerald-950 block" aria-hidden="true">
                  {formatCurrency(calculation.subscriptionPrice)}
                </span>
                <span className="font-mono text-[10px] text-stone-500 line-through block" aria-hidden="true">
                  {formatCurrency(oneTimeTotal)}
                </span>
              </div>
            </label>

            {/* Expandable Frequency Configuration when Subscription is active */}
            {purchaseType === 'subscription' && (
              <div className="pt-3 border-t border-emerald-200/80 space-y-3 transition-opacity duration-200">
                <FrequencySelector
                  selectedCadence={selectedCadence}
                  cadenceOptions={product.subscription.cadenceOptions || []}
                  onSelectCadence={onCadenceChange}
                  estimatedDelivery={calculation.estimatedNextDelivery}
                />

                {/* Savings pill badge */}
                <div className="p-2.5 bg-emerald-100/70 rounded-xs border border-emerald-300 text-xs flex items-center justify-between text-emerald-950 font-mono">
                  <span>Per-cycle recurring discount:</span>
                  <span className="font-bold">
                    {formatCurrency(calculation.savings)} ({calculation.discountPercentage}% off)
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <FeatureUnavailableNotice
            compact={true}
            title="Subscription Unavailable For This Product"
            message="That product is currently unavailable for recurring delivery. This recipe is available as a standard one-time purchase, or you can explore auto-ship eligible alternatives."
            actionHref="/subscriptions"
            actionLabel="Browse Auto-Ship Recipes →"
          />
        )}
      </div>

      {showSummary && purchaseType === 'subscription' && isAvailable && (
        <SubscriptionSummary
          productName={product.name}
          variantName={selectedVariant?.name}
          calculation={calculation}
        />
      )}
    </fieldset>
  );
}
