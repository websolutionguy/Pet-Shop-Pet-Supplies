'use client';

import React from 'react';
import Link from 'next/link';
import { Repeat, Calendar, Sparkles, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '../../types/cart';
import { formatCurrency, formatCadenceLabel } from '../../lib/utils';
import { cartService } from '../../services/cartService';

interface OrderConfirmationSubscriptionsProps {
  subscriptionItems: CartItem[];
  placedAt: string;
}

export function OrderConfirmationSubscriptions({
  subscriptionItems,
  placedAt,
}: OrderConfirmationSubscriptionsProps) {
  if (subscriptionItems.length === 0) return null;

  const subscriptionStartedFormatted = new Date(placedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-emerald-50/40 border border-emerald-200/90 rounded-xs p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-emerald-200/80">
        <div className="flex items-center gap-2">
          <Repeat className="w-4 h-4 text-emerald-800" />
          <h2 className="font-serif text-lg font-semibold text-emerald-950">
            Registered Auto-Ship Routines ({subscriptionItems.length})
          </h2>
        </div>

        <Link
          href="/subscriptions"
          className="text-xs font-mono font-medium text-emerald-900 hover:text-emerald-700 underline underline-offset-4 flex items-center gap-1"
        >
          <span>Manage Routines</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptionItems.map((item) => {
          const cadence = item.subscriptionCadence || item.product.subscription.defaultCadence || '4-weeks';
          const nextDeliveryDate = cartService.calculateNextDeliveryDate(cadence);

          return (
            <div
              key={item.id}
              className="p-4 bg-white border border-emerald-200/80 rounded-xs space-y-3"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block truncate">
                  {item.product.brand}
                </span>
                <h3 className="font-serif text-sm font-semibold text-stone-900 leading-snug line-clamp-1">
                  {item.product.name}
                </h3>
                {item.targetPetName && (
                  <span className="text-xs text-emerald-800 font-mono">
                    For {item.targetPetName}
                  </span>
                )}
              </div>

              {/* 4 Required Subscription Specs */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
                {/* 1. Subscription Started */}
                <div className="flex items-center justify-between text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Subscription Started:</span>
                  </span>
                  <span className="font-mono font-medium text-stone-900">
                    {subscriptionStartedFormatted}
                  </span>
                </div>

                {/* 2. Frequency */}
                <div className="flex items-center justify-between text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <Repeat className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Frequency:</span>
                  </span>
                  <span className="font-mono font-semibold text-emerald-900">
                    {formatCadenceLabel(cadence)}
                  </span>
                </div>

                {/* 3. Recurring Amount */}
                <div className="flex items-center justify-between text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Recurring Amount:</span>
                  </span>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    {formatCurrency(item.lineTotal)} / cycle
                  </span>
                </div>

                {/* 4. Next Delivery Estimate */}
                <div className="flex items-center justify-between text-stone-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Next Delivery Estimate:</span>
                  </span>
                  <span className="font-mono font-medium text-stone-900">
                    {nextDeliveryDate}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                <span>10% Auto-Ship savings included</span>
                <span className="text-emerald-800">Pause or Skip Anytime</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-white/80 border border-emerald-200/60 rounded-xs text-[11px] text-emerald-950 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Auto-Ship Transparency:</strong> You will receive an email reminder 3 days prior to your next recurring delivery date. You can alter bag sizes, change frequency, skip upcoming cycles, or cancel at any time in your pantry dashboard with zero cancellation penalties.
        </p>
      </div>
    </div>
  );
}
