'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Calendar, Repeat, ShieldCheck, Package } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { formatCurrency, formatCadenceLabel } from '../../lib/utils';
import { cartService } from '../../services/cartService';

interface CheckoutSubscriptionItemsSectionProps {
  items: CartItem[];
}

export function CheckoutSubscriptionItemsSection({
  items,
}: CheckoutSubscriptionItemsSectionProps) {
  const subscriptionItems = items.filter((i) => i.purchaseType === 'subscription');

  return (
    <section
      aria-labelledby="section-subscriptions-heading"
      className="p-5 sm:p-6 bg-white border border-stone-200/90 rounded-xs shadow-xs"
    >
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-emerald-900 text-white flex items-center justify-center text-xs font-mono font-semibold">
            5
          </span>
          <h2 id="section-subscriptions-heading" className="font-serif text-lg font-semibold text-stone-900">
            Auto-Ship Subscription Items
          </h2>
        </div>

        {subscriptionItems.length > 0 && (
          <span className="text-[11px] font-mono font-semibold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
            10% Savings Active
          </span>
        )}
      </div>

      <div className="mt-4">
        {subscriptionItems.length === 0 ? (
          <div className="p-4 bg-stone-50 border border-stone-200/80 rounded-xs text-xs text-stone-600">
            <p>
              No recurring auto-ship subscriptions are present in this order. Your provisions basket consists entirely of single-dispatch items.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="divide-y divide-stone-100">
              {subscriptionItems.map((item) => {
                const cadence = item.subscriptionCadence || item.product.subscription.defaultCadence || '4-weeks';
                const nextDeliveryDate = cartService.calculateNextDeliveryDate(cadence);

                return (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3.5">
                      {/* Product Image */}
                      <div className="relative w-16 h-16 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200">
                        {item.product.primaryImage ? (
                          <Image
                            src={item.product.primaryImage}
                            alt={item.product.name}
                            fill
                            loading="lazy"
                            sizes="64px"
                            className="object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        {/* Screen reader complete subscription item announcement */}
                        <div className="sr-only">
                          Subscription item: {item.product.name}. Recurring price: {formatCurrency(item.lineTotal)}, saving {formatCurrency(item.totalDiscount)} discount. Delivery frequency: every {formatCadenceLabel(cadence)}. Next delivery: {nextDeliveryDate}.
                        </div>

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
                              {item.quantity} × {formatCurrency(item.discountedUnitPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Subscription Specification Grid */}
                        <div className="mt-3 p-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xs grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {/* Frequency */}
                          <div className="flex items-center gap-2 text-emerald-950">
                            <Repeat className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                            <span>
                              Subscription Frequency: <strong>{formatCadenceLabel(cadence)}</strong>
                            </span>
                          </div>

                          {/* Recurring Amount */}
                          <div className="flex items-center gap-2 text-emerald-950 font-mono">
                            <span className="text-emerald-800 font-bold">$</span>
                            <span>
                              Recurring Amount: <strong>{formatCurrency(item.lineTotal)} / cycle</strong>
                            </span>
                          </div>

                          {/* Next Delivery Date */}
                          <div className="flex items-center gap-2 text-emerald-950 font-mono text-[11px]">
                            <Calendar className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                            <span>
                              Next Expected Delivery: <strong>{nextDeliveryDate}</strong>
                            </span>
                          </div>

                          {/* Subscription Discount */}
                          <div className="flex items-center gap-2 text-emerald-950 text-[11px]">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                            <span>
                              Subscription Discount: <strong>10% Auto-Ship (-{formatCurrency(item.totalDiscount)})</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Routine Reassurance */}
            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs text-[11px] text-stone-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <span>
                <strong>Flexible Companion Routine:</strong> Recurring auto-ship dispatches renew automatically on your chosen schedule.
                You can pause, reschedule, modify quantities, or cancel anytime in your member dashboard prior to subsequent batch dispatch.
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
