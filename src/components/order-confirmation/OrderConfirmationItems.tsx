'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Repeat, ArrowUpRight } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { formatCurrency, formatCadenceLabel } from '../../lib/utils';
import { AppImage } from '../ui/AppImage';


interface OrderConfirmationItemsProps {
  items: CartItem[];
}

export function OrderConfirmationItems({ items }: OrderConfirmationItemsProps) {
  return (
    <div className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-stone-100">
        <h2 className="font-serif text-lg font-semibold text-stone-900">
          Enclosed Provisions ({items.reduce((acc, i) => acc + i.quantity, 0)})
        </h2>
        <span className="text-xs text-stone-500 font-mono">
          {items.length} {items.length === 1 ? 'line item' : 'line items'}
        </span>
      </div>

      <div className="divide-y divide-stone-100">
        {items.map((item) => {
          const isSubscription = item.purchaseType === 'subscription';
          const cadence = item.subscriptionCadence || item.product.subscription.defaultCadence || '4-weeks';

          return (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
              {/* Product Thumbnail */}
              <div className="relative w-16 h-16 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200">
                {item.product.primaryImage ? (
                  <AppImage
                    src={item.product.primaryImage}
                    alt={item.product.name}
                    fill
                    loading="lazy"
                    sizes="64px"
                    className="object-cover"
                    showSpinner={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <Package className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
                      {item.product.brand}
                    </span>
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-serif text-sm font-medium text-stone-900 hover:text-stone-700 transition-colors inline-flex items-center gap-1 group"
                    >
                      <span>{item.product.name}</span>
                      <ArrowUpRight className="w-3 h-3 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-stone-500 font-mono">
                      {item.variant && <span>Format: {item.variant.name}</span>}
                      {item.targetPetName && (
                        <span className="text-emerald-800 font-medium">Companion: {item.targetPetName}</span>
                      )}
                    </div>
                  </div>

                  {/* Financials */}
                  <div className="text-left sm:text-right shrink-0">
                    <span className="font-mono text-sm font-semibold text-stone-900 tabular-nums">
                      {formatCurrency(item.lineTotal)}
                    </span>
                    <span className="block text-[11px] text-stone-500 font-mono">
                      {item.quantity} × {formatCurrency(item.discountedUnitPrice)}
                    </span>
                  </div>
                </div>

                {/* Purchase Type & Cadence Badge */}
                <div className="mt-2.5 flex items-center gap-2">
                  {isSubscription ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-xs text-[11px] font-mono font-medium">
                      <Repeat className="w-3 h-3 text-emerald-800" />
                      <span>Auto-Ship Delivery · {formatCadenceLabel(cadence)} (Save 10%)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 bg-stone-100 text-stone-700 rounded-xs text-[11px] font-mono">
                      One-Time Purchase
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
