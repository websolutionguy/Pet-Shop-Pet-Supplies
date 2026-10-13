'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, ExternalLink } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { formatCurrency } from '../../lib/utils';

interface CheckoutOrderItemsSectionProps {
  items: CartItem[];
}

export function CheckoutOrderItemsSection({ items }: CheckoutOrderItemsSectionProps) {
  const oneTimeItems = items.filter((i) => i.purchaseType === 'one-time');

  return (
    <section
      aria-labelledby="section-order-items-heading"
      className="p-5 sm:p-6 bg-white border border-stone-200/90 rounded-xs shadow-xs"
    >
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-mono font-semibold">
            4
          </span>
          <h2 id="section-order-items-heading" className="font-serif text-lg font-semibold text-stone-900">
            One-Time Order Items
          </h2>
        </div>

        <span className="text-xs text-stone-500 font-mono">
          {oneTimeItems.length} {oneTimeItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="mt-4">
        {oneTimeItems.length === 0 ? (
          <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xs text-xs text-stone-600">
            <p>
              There are no one-time purchases in this order. All provisions in your basket are configured for recurring auto-ship delivery in Section 5.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {oneTimeItems.map((item) => (
              <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3.5">
                {/* Thumbnail */}
                <div className="relative w-14 h-14 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200">
                  {item.product.primaryImage ? (
                    <Image
                      src={item.product.primaryImage}
                      alt={item.product.name}
                      fill
                      loading="lazy"
                      sizes="56px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <Package className="w-5 h-5" />
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block truncate">
                        {item.product.brand}
                      </span>
                      <h3 className="font-serif text-xs sm:text-sm font-medium text-stone-900 leading-snug line-clamp-1">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-stone-500 font-mono">
                        {item.variant && <span>Format: {item.variant.name}</span>}
                        {item.targetPetName && (
                          <span className="text-emerald-800">For {item.targetPetName}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs sm:text-sm font-semibold text-stone-900 tabular-nums">
                        {formatCurrency(item.lineTotal)}
                      </span>
                      <span className="block text-[10px] text-stone-500 font-mono">
                        {item.quantity} × {formatCurrency(item.unitPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
