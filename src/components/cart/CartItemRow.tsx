'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Repeat, Check, Sparkles, Tag, Package } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { ProductCadence } from '../../types/product';
import { useCart } from '../../providers/CartProvider';
import { QuantityStepper } from '../ui/QuantityStepper';
import { formatCurrency, formatCadenceLabel } from '../../lib/utils';
import { CADENCE_OPTIONS, SUBSCRIPTION_DISCOUNT_PERCENT } from '../../lib/constants';
import { cartService } from '../../services/cartService';
import { cn } from '../../lib/utils';

interface CartItemRowProps {
  item: CartItem;
  compact?: boolean;
}

export function CartItemRow({ item, compact = false }: CartItemRowProps) {
  const {
    removeItem,
    updateQuantity,
    updateItemPurchaseType,
    updateItemCadence,
  } = useCart();

  const isSub = item.purchaseType === 'subscription';
  const cadence = item.subscriptionCadence || item.product.subscription.defaultCadence || '4-weeks';
  const discountPercent = item.product.subscription.discountPercentage || SUBSCRIPTION_DISCOUNT_PERCENT;

  return (
    <article
      className={cn(
        'group transition-colors',
        compact ? 'py-4 first:pt-0 last:pb-0' : 'p-4 sm:p-5 bg-white border border-stone-200/90 rounded-xs shadow-xs mb-3'
      )}
      aria-label={`Basket item: ${item.product.name}`}
    >
      <div className="flex gap-3.5 sm:gap-4 items-start">
        {/* Product Thumbnail */}
        <Link
          href={`/products/${item.product.slug}`}
          className={cn(
            'relative bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200 block hover:opacity-90 transition-opacity',
            compact ? 'w-16 h-16 sm:w-18 sm:h-18' : 'w-20 h-20 sm:w-24 sm:h-24'
          )}
        >
          {item.product.primaryImage ? (
            <Image
              src={item.product.primaryImage}
              alt={item.product.name}
              fill
              loading="lazy"
              sizes={compact ? '72px' : '96px'}
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400 bg-stone-100">
              <Package className="w-6 h-6" />
            </div>
          )}
        </Link>

        {/* Core Product Information */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] sm:text-[11px] text-stone-500 font-mono block uppercase tracking-wider truncate">
                {item.product.brand}
              </span>
              <h3 className="font-serif text-sm sm:text-base font-medium text-stone-900 leading-snug line-clamp-2">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="hover:underline underline-offset-2"
                >
                  {item.product.name}
                </Link>
              </h3>

              {/* Variant / Size info */}
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-600 font-mono flex-wrap">
                {item.variant && (
                  <span className="bg-stone-100 px-1.5 py-0.5 rounded-xs border border-stone-200">
                    Format: {item.variant.name}
                  </span>
                )}
                {item.targetPetName && (
                  <span className="bg-emerald-50 text-emerald-900 px-1.5 py-0.5 rounded-xs border border-emerald-200">
                    For {item.targetPetName}
                  </span>
                )}
              </div>
            </div>

            {/* Remove item button (Minimum 44px practical touch target) */}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-stone-400 hover:text-red-700 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-2 rounded-xs transition-colors cursor-pointer shrink-0 touch-manipulation"
              title="Remove item from basket"
              aria-label={`Remove ${item.product.name} from basket`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Pricing Row: Unit Price, Discount & Subtotal */}
          <div className="mt-2.5 flex items-baseline justify-between flex-wrap gap-2 pt-2 border-t border-stone-100">
            <div className="flex items-baseline gap-2">
              <span className="sr-only">
                {isSub
                  ? `Recurring line total: ${formatCurrency(item.lineTotal)}, recurring unit price ${formatCurrency(item.discountedUnitPrice)}, saving ${formatCurrency(item.totalDiscount)} (${discountPercent}% discount). Frequency: every ${CADENCE_OPTIONS[cadence]?.label || cadence}.`
                  : `Line total: ${formatCurrency(item.lineTotal)}, unit price ${formatCurrency(item.discountedUnitPrice)}.`}
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-stone-900 tabular-nums" aria-hidden="true">
                {formatCurrency(item.lineTotal)}
              </span>
              <span className="text-[11px] text-stone-500 font-mono" aria-hidden="true">
                ({formatCurrency(item.discountedUnitPrice)} / unit)
              </span>

              {isSub && item.totalDiscount > 0 && (
                <span className="text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-xs border border-emerald-200" aria-hidden="true">
                  Save {formatCurrency(item.totalDiscount)} ({discountPercent}%)
                </span>
              )}
            </div>

            {/* Subtotal Label */}
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500" aria-hidden="true">
              Subtotal
            </span>
          </div>

          {/* Order Type & Subscription Controls */}
          {item.product.subscription.eligible && (
            <div className="mt-3 p-2.5 bg-stone-50 rounded-xs border border-stone-200/80 space-y-2">
              {/* Purchase Type Selector */}
              <div className="flex items-center justify-between text-xs flex-wrap gap-1.5">
                <span className="text-stone-700 font-medium text-[11px] flex items-center gap-1">
                  <Repeat className="w-3 h-3 text-stone-500" aria-hidden="true" />
                  <span>Purchase Type:</span>
                </span>

                <div
                  className="inline-flex rounded-xs border border-stone-200 bg-white p-0.5"
                  role="radiogroup"
                  aria-label={`Purchase type for ${item.product.name}`}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={!isSub}
                    onClick={() => updateItemPurchaseType(item.id, 'one-time')}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-xs transition-colors cursor-pointer font-medium min-h-[38px] flex items-center touch-manipulation focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-inset outline-none',
                      !isSub
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    )}
                    aria-label={`One-Time delivery for ${item.product.name}`}
                  >
                    One-Time
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={isSub}
                    onClick={() => updateItemPurchaseType(item.id, 'subscription', cadence)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-xs transition-colors cursor-pointer font-medium flex items-center gap-1.5 min-h-[38px] touch-manipulation focus-visible:ring-2 focus-visible:ring-emerald-900 focus-visible:ring-inset outline-none',
                      isSub
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'text-stone-600 hover:text-emerald-900'
                    )}
                    aria-label={`Auto-Ship recurring subscription for ${item.product.name}, saving ${discountPercent}%`}
                  >
                    <Sparkles className="w-3 h-3 text-emerald-300" aria-hidden="true" />
                    <span>Subscribe &amp; Save ({discountPercent}%)</span>
                  </button>
                </div>
              </div>

              {/* Cadence Selection for Subscription */}
              {isSub && (
                <div className="pt-2 border-t border-stone-200/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                    <label htmlFor={`cadence-cart-${item.id}`} className="text-stone-600 text-[11px] font-mono">
                      Delivery Rhythm:
                    </label>

                    <select
                      id={`cadence-cart-${item.id}`}
                      value={cadence}
                      onChange={(e) =>
                        updateItemCadence(item.id, e.target.value as ProductCadence)
                      }
                      className="bg-white border border-stone-300 text-stone-900 rounded-xs px-3 py-2 text-xs font-mono focus-visible:ring-2 focus-visible:ring-stone-900 outline-none cursor-pointer min-h-[44px]"
                      aria-label={`Subscription frequency for ${item.product.name}`}
                    >
                      {item.product.subscription.cadenceOptions.map((c) => (
                        <option key={c} value={c}>
                          {CADENCE_OPTIONS[c]?.label || formatCadenceLabel(c)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-[11px] text-emerald-950 font-mono bg-emerald-50/70 px-2 py-1 rounded-xs border border-emerald-200 flex items-center justify-between">
                    <span className="text-emerald-800">Next Estimated Delivery:</span>
                    <strong>{cartService.calculateNextDeliveryDate(cadence)}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity Stepper & Inline Controls */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-500 font-mono">Quantity:</span>
              <QuantityStepper
                quantity={item.quantity}
                productName={item.product.name}
                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                size="sm"
              />
            </div>

            {isSub ? (
              <span className="text-[11px] font-mono text-emerald-900 font-semibold bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                Subscribe &amp; Save · {formatCadenceLabel(cadence)}
              </span>
            ) : (
              <span className="text-[11px] font-mono text-stone-500">
                One-time dispatch
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
