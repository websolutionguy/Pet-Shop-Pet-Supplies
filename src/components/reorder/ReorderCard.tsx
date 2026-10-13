'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  RotateCcw,
  Repeat,
  Plus,
  Minus,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Product, ProductVariant, ProductCadence } from '../../types/product';
import { QuickReorderButton } from './QuickReorderButton';
import { QuantityStepper } from '../ui/QuantityStepper';
import { useCart } from '../../providers/CartProvider';
import { formatCurrency, cn } from '../../lib/utils';
import { CADENCE_OPTIONS, SUBSCRIPTION_DISCOUNT_PERCENT } from '../../lib/constants';

interface ReorderCardProps {
  product: Product;
  lastPurchasedAt?: string;
  targetPetName?: string;
  timesOrdered?: number;
  pantryStatus?: 'depleted' | 'low' | 'stocked';
  estimatedDaysRemaining?: number;
  onAdded?: (product: Product, quantity: number, isSub: boolean) => void;
}

export function ReorderCard({
  product,
  lastPurchasedAt,
  targetPetName,
  timesOrdered = 1,
  pantryStatus,
  estimatedDaysRemaining,
  onAdded,
}: ReorderCardProps) {
  const { addItem } = useCart();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: 'default',
      name: 'Standard Package',
      sizeOrWeight: product.unitMeasurement,
      price: product.basePrice,
      sku: 'SKU',
      inStock: true,
      inventoryCount: 10,
    }
  );

  const [quantity, setQuantity] = useState(1);
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>(
    product.subscription.eligible ? 'one-time' : 'one-time'
  );
  const [cadence, setCadence] = useState<ProductCadence>(
    product.subscription.defaultCadence || '4-weeks'
  );

  const discountPercent = product.subscription.discountPercentage || SUBSCRIPTION_DISCOUNT_PERCENT;
  const unitPrice = selectedVariant.price;
  const discountedSubUnitPrice = Number(
    (unitPrice - (unitPrice * discountPercent) / 100).toFixed(2)
  );
  const effectiveUnitPrice = purchaseType === 'subscription' ? discountedSubUnitPrice : unitPrice;
  const effectiveTotal = Number((effectiveUnitPrice * quantity).toFixed(2));

  const handleReorder = () => {
    addItem(product, {
      variantId: selectedVariant.id,
      quantity,
      purchaseType,
      cadence: purchaseType === 'subscription' ? cadence : undefined,
      targetPetName,
    });
    onAdded?.(product, quantity, purchaseType === 'subscription');
  };

  const formattedDate = lastPurchasedAt
    ? new Date(lastPurchasedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;

  return (
    <article className="bg-white border border-stone-200/90 rounded-xs p-4 sm:p-5 flex flex-col justify-between shadow-xs transition-all hover:border-stone-300">
      <div>
        {/* Top Header: Pantry Status & Target Pet */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {targetPetName && (
              <span className="font-mono text-[10px] text-stone-700 bg-stone-100 px-2 py-0.5 rounded-xs border border-stone-200">
                For {targetPetName}
              </span>
            )}
            {timesOrdered > 1 && (
              <span className="font-mono text-[10px] text-stone-600 bg-stone-50 px-2 py-0.5 rounded-xs border border-stone-200/80">
                Ordered {timesOrdered}×
              </span>
            )}
          </div>

          {pantryStatus === 'low' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-900 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200 font-medium">
              <AlertCircle className="w-3 h-3 text-amber-700" />
              <span>Pantry Low ({estimatedDaysRemaining || 5}d)</span>
            </span>
          )}
          {pantryStatus === 'depleted' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-red-900 bg-red-50 px-2 py-0.5 rounded-xs border border-red-200 font-medium">
              <AlertCircle className="w-3 h-3 text-red-700" />
              <span>Empty Bowl · Due for Refill</span>
            </span>
          )}
        </div>

        {/* Main Product Info Row */}
        <div className="flex gap-3.5 mb-3.5">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200">
            {product.primaryImage ? (
              <Image
                src={product.primaryImage}
                alt={product.name}
                fill
                loading="lazy"
                sizes="80px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-stone-200" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-stone-500 font-mono block truncate">
              {product.brand}
            </span>
            <h3 className="font-serif text-sm sm:text-base font-normal text-stone-900 leading-snug line-clamp-2">
              <Link href={`/products/${product.slug}`} className="hover:underline">
                {product.name}
              </Link>
            </h3>

            {formattedDate && (
              <span className="text-[11px] text-stone-500 font-mono mt-1 block">
                Last ordered: {formattedDate}
              </span>
            )}
          </div>
        </div>

        {/* Variant / Size Options */}
        {product.variants.length > 1 && (
          <div className="mb-3.5">
            <div className="flex flex-wrap gap-1.5">
              {product.variants.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={cn(
                      'text-[11px] px-2 py-1 rounded-xs border transition-colors cursor-pointer',
                      isSelected
                        ? 'border-stone-900 bg-stone-900 text-white font-medium'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                    )}
                  >
                    {v.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Subscription Conversion Toggle (Core Requirement) */}
        {product.subscription.eligible && (
          <div className="mb-4 p-2.5 bg-stone-50 border border-stone-200 rounded-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-800">Order Method:</span>
              {purchaseType === 'subscription' && (
                <span className="font-mono text-[10px] text-emerald-900 bg-emerald-100 font-bold px-1.5 py-0.2 rounded-xs border border-emerald-300">
                  Save 10% Auto-Ship
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setPurchaseType('one-time')}
                className={cn(
                  'py-1.5 px-2 text-center text-[11px] rounded-xs border transition-colors cursor-pointer',
                  purchaseType === 'one-time'
                    ? 'border-stone-900 bg-stone-900 text-white font-medium'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                )}
              >
                One-Time Reorder
              </button>

              <button
                type="button"
                onClick={() => setPurchaseType('subscription')}
                className={cn(
                  'py-1.5 px-2 text-center text-[11px] rounded-xs border transition-colors cursor-pointer flex items-center justify-center gap-1',
                  purchaseType === 'subscription'
                    ? 'border-emerald-800 bg-emerald-800 text-white font-medium'
                    : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                )}
              >
                <Repeat className="w-3 h-3" />
                <span>Auto-Ship (-10%)</span>
              </button>
            </div>

            {/* If subscription conversion selected, show rhythm */}
            {purchaseType === 'subscription' && (
              <div className="pt-2 border-t border-stone-200/80">
                <label className="text-[10px] font-mono text-stone-600 block mb-1">
                  Recurring Cadence:
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['2-weeks', '4-weeks', '8-weeks'] as ProductCadence[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCadence(c)}
                      className={cn(
                        'py-1 text-center text-[10px] rounded-xs border transition-colors cursor-pointer font-mono',
                        cadence === c
                          ? 'border-emerald-800 bg-emerald-100 text-emerald-950 font-bold'
                          : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                      )}
                    >
                      {CADENCE_OPTIONS[c]?.shortLabel || c}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Pricing & Actions */}
      <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-base font-bold text-stone-900 tabular-nums">
              {formatCurrency(effectiveTotal)}
            </span>
            {purchaseType === 'subscription' && (
              <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                {formatCurrency(unitPrice * quantity)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-stone-500 font-mono block">
            {purchaseType === 'subscription' ? 'recurring total' : 'one-time total'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quantity Stepper with 44px touch target */}
          <QuantityStepper
            quantity={quantity}
            onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
            onIncrease={() => setQuantity((q) => Math.min(10, q + 1))}
            min={1}
            max={10}
            size="sm"
          />

          {/* Quick Reorder Action */}
          <QuickReorderButton
            onReorder={handleReorder}
            label={purchaseType === 'subscription' ? 'Subscribe' : 'Reorder'}
            isSubscription={purchaseType === 'subscription'}
            size="sm"
            variant={purchaseType === 'subscription' ? 'secondary' : 'primary'}
          />
        </div>
      </div>
    </article>
  );
}
