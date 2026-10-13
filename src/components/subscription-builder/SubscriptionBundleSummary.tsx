'use client';

import React from 'react';
import Image from 'next/image';
import {
  Calendar,
  Sparkles,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  Repeat,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SelectedSubscriptionBundleItem } from './SubscriptionBuilderTypes';
import { ProductCadence } from '../../types/product';
import { FrequencySelector } from '../subscription/FrequencySelector';
import { formatCurrency, cn } from '../../lib/utils';
import { CADENCE_OPTIONS } from '../../lib/constants';
import { Button } from '../ui/Button';

interface SubscriptionBundleSummaryProps {
  items: SelectedSubscriptionBundleItem[];
  cadence: ProductCadence;
  onCadenceChange: (cadence: ProductCadence) => void;
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onAddToCart: () => void;
  isAddingToCart?: boolean;
  className?: string;
}

function computeEstimatedDelivery(cadence: ProductCadence): string {
  const cadenceDays = CADENCE_OPTIONS[cadence]?.intervalDays || 28;
  const nextDeliveryDate = new Date(Date.now() + cadenceDays * 24 * 60 * 60 * 1000);
  return nextDeliveryDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function SubscriptionBundleSummary({
  items,
  cadence,
  onCadenceChange,
  onUpdateQuantity,
  onRemoveItem,
  onAddToCart,
  isAddingToCart = false,
  className,
}: SubscriptionBundleSummaryProps) {
  // Calculations
  const oneTimeSubtotal = Number(
    items
      .reduce((sum, item) => sum + item.variant.price * item.quantity, 0)
      .toFixed(2)
  );

  const discountAmount = Number(
    items
      .reduce((sum, item) => {
        const discountPercent = item.product.subscription.discountPercentage || 10;
        return sum + (item.variant.price * (discountPercent / 100)) * item.quantity;
      }, 0)
      .toFixed(2)
  );

  const recurringSubtotal = Number((oneTimeSubtotal - discountAmount).toFixed(2));
  const estimatedNextDelivery = computeEstimatedDelivery(cadence);

  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside
      className={cn(
        'bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-6',
        className
      )}
      aria-label="Subscription Routine Summary"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-200">
          <div>
            <h3 className="font-serif text-base font-semibold text-stone-900">
              Pantry Routine Bundle
            </h3>
            <span className="text-[11px] text-stone-500 font-mono">
              {totalItemCount} item{totalItemCount !== 1 ? 's' : ''} across {items.length} provision{items.length !== 1 ? 's' : ''}
            </span>
          </div>

          <span className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
            Auto-Ship -10%
          </span>
        </div>

        {/* Selected Products List */}
        <div className="py-4 space-y-3 max-h-[340px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-500 border border-dashed border-stone-200 rounded-xs p-4 bg-stone-50/50">
              <Repeat className="w-6 h-6 text-stone-400 mx-auto mb-2" />
              <p className="font-medium text-stone-700">No provisions added yet</p>
              <p className="text-[11px] text-stone-500 mt-1">
                Choose whole food kibbles, organic treats, supplements or litter to add to this recurring box.
              </p>
            </div>
          ) : (
            items.map((item) => {
              const unitRegularPrice = item.variant.price;
              const unitDiscountedPrice = Number(
                (unitRegularPrice * 0.9).toFixed(2)
              );
              const lineTotal = Number(
                (unitDiscountedPrice * item.quantity).toFixed(2)
              );

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 bg-stone-50 rounded-xs border border-stone-200/70"
                >
                  <div className="relative w-12 h-12 rounded-xs overflow-hidden bg-white shrink-0 border border-stone-200">
                    {item.product.primaryImage ? (
                      <Image
                        src={item.product.primaryImage}
                        alt={item.product.name}
                        fill
                        loading="lazy"
                        sizes="48px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-stone-100" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-xs font-medium text-stone-900 truncate">
                      {item.product.name}
                    </h4>
                    <span className="text-[11px] text-stone-500 font-mono block">
                      {item.variant.name}
                    </span>
                    <span className="font-mono text-xs font-semibold text-emerald-950 tabular-nums">
                      {formatCurrency(lineTotal)}
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-stone-300 rounded-xs bg-white shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        item.quantity <= 1
                          ? onRemoveItem(item.id)
                          : onUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center font-mono text-xs font-bold text-stone-900 tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateQuantity(item.id, Math.min(10, item.quantity + 1))
                      }
                      className="w-6 h-6 flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-stone-400 hover:text-red-700 p-1 cursor-pointer"
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Frequency Selector */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-stone-200">
            <FrequencySelector
              selectedCadence={cadence}
              cadenceOptions={['2-weeks', '4-weeks', '6-weeks', '8-weeks']}
              onSelectCadence={onCadenceChange}
              estimatedDelivery={estimatedNextDelivery}
            />
          </div>
        )}

        {/* Price Breakdown */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-stone-600">
              <span>One-Time Subtotal:</span>
              <span className="font-mono tabular-nums line-through text-stone-400">
                {formatCurrency(oneTimeSubtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between text-emerald-900 font-medium">
              <span>Auto-Ship Savings (10%):</span>
              <span className="font-mono tabular-nums">
                -{formatCurrency(discountAmount)}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-stone-200 text-stone-900">
              <div>
                <span className="font-serif text-sm sm:text-base font-semibold block">
                  Recurring Subtotal:
                </span>
                <span className="text-[11px] text-stone-500 font-mono">
                  Billed {CADENCE_OPTIONS[cadence]?.shortLabel || cadence}
                </span>
              </div>
              <div className="text-right">
                <span className="font-mono text-lg sm:text-xl font-bold text-emerald-950 tabular-nums block">
                  {formatCurrency(recurringSubtotal)}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  Free regional dispatch
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-50/60 border border-emerald-200/70 rounded-xs text-[11px] text-emerald-900 flex items-center justify-between font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                <span>Next Delivery:</span>
              </span>
              <strong>{estimatedNextDelivery}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-stone-200">
        <Button
          variant="primary"
          size="lg"
          disabled={items.length === 0 || isAddingToCart}
          onClick={onAddToCart}
          className="w-full text-sm font-medium"
          leftIcon={<Repeat className="w-4 h-4 text-emerald-300" />}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          {items.length === 0
            ? 'Add Provisions to Begin'
            : isAddingToCart
            ? 'Activating Routine...'
            : `Add Subscription to Basket · ${formatCurrency(recurringSubtotal)}`}
        </Button>

        <p className="mt-2 text-center text-[10px] text-stone-500 font-mono">
          Pause, edit items, or cancel anytime with one click
        </p>
      </div>
    </aside>
  );
}
