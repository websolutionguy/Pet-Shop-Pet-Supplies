'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Repeat, RotateCcw, Check, Sparkles, ArrowRight } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { SubscriptionConfigData, ReorderConfigData } from '../../types/data';

export function SubscriptionVsReorderComparison() {
  const [subConfig, setSubConfig] = useState<SubscriptionConfigData | null>(null);
  const [reorderConfig, setReorderConfig] = useState<ReorderConfigData | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([subscriptionService.getConfig(), subscriptionService.getReorderConfig()]).then(
      ([sub, reorder]) => {
        if (!isMounted) return;
        setSubConfig(sub);
        setReorderConfig(reorder);
      }
    );
    return () => {
      isMounted = false;
    };
  }, []);

  const defaultDiscountPercentage = subConfig?.defaultDiscountPercentage ?? 10;
  const reorderDiscountPercentage = reorderConfig?.reorderDiscountPercentage ?? 5;
  const reorderWindowDays = reorderConfig?.reorderWindowDays ?? 30;

  const comparisonRows = [
    {
      feature: 'Ordering Mechanism',
      autoShip: 'Automated recurring delivery on your chosen cadence (2, 4, 6, 8, or 12 weeks).',
      reorder: 'Manual one-click replenishment initiated whenever you notice the jar running low.',
    },
    {
      feature: 'Discount Level',
      autoShip: `Guaranteed ${defaultDiscountPercentage}% continuous savings on every recurring delivery.`,
      reorder: `${reorderDiscountPercentage}% reorder loyalty discount within ${reorderWindowDays} days of prior order.`,
    },
    {
      feature: 'Fresh Batch Allocation',
      autoShip: 'Provisions reserved directly from Pacific Northwest fortnightly roasts prior to public shelves.',
      reorder: 'Dispatched from current depot inventory on shelf.',
    },
    {
      feature: 'Pre-Dispatch Notice',
      autoShip: 'Automated notification sent 3 days before roasting and courier dispatch.',
      reorder: 'Immediate dispatch confirmation upon clicking Reorder.',
    },
    {
      feature: 'Best Household Match',
      autoShip: 'Daily staples: baseline kibble, daily digestive oils, essential dental chews.',
      reorder: 'Variable treats, seasonal novel broths, or rotation feeding recipes.',
    },
  ];

  return (
    <section aria-labelledby="comparison-heading" className="bg-white border border-stone-200/90 rounded-xs p-6 sm:p-10 shadow-xs space-y-8">
      <div className="max-w-2xl">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold block mb-1">
          Pantry Options
        </span>
        <h2 id="comparison-heading" className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight">
          How Does Reorder Differ from Subscription?
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
          Both options eliminate lengthy store visits, but they serve different household rhythms.
          Compare the two models below to determine which works best for your companion.
        </p>
      </div>

      {/* Side-by-side Editorial Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: Steady Auto-Ship */}
        <div className="p-6 bg-emerald-50/50 border-2 border-emerald-800/80 rounded-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-emerald-800" />
                <h3 className="font-serif text-lg font-semibold text-emerald-950">
                  Steady Auto-Ship Subscription
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-200/70 text-emerald-900 rounded-xs">
                {defaultDiscountPercentage}% Off
              </span>
            </div>

            <p className="text-xs text-emerald-950/80 leading-relaxed">
              Automated continuity. We reserve your companion’s provisions from each small roast so you never run out of food.
            </p>

            <div className="pt-3 border-t border-emerald-200/80 space-y-2 text-xs text-stone-700">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                <span>Highest continuous savings ({defaultDiscountPercentage}% off every cycle)</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                <span>Pre-allocated stock from fortnightly small-batch roasts</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                <span>Pause, skip, or cancel anytime with zero commitments</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-emerald-200">
            <Link
              href="/subscriptions"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Build an Auto-Ship Routine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Column 2: On-Demand Reorder */}
        <div className="p-6 bg-stone-50 border border-stone-200 rounded-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-stone-700" />
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  On-Demand Reorder
                </h3>
              </div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-stone-200 text-stone-700 rounded-xs">
                {reorderDiscountPercentage}% Off
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Manual flexibility. When your jar is nearly empty, visit your pantry dashboard and replenish in one click without recurring schedules.
            </p>

            <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-700">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-stone-700 shrink-0 mt-0.5" />
                <span>Zero recurring billing; you control the exact timing</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-stone-700 shrink-0 mt-0.5" />
                <span>Fast one-click checkout from past purchased favorites</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-stone-700 shrink-0 mt-0.5" />
                <span>Perfect for treats, chews, or varied rotation feeding</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200">
            <Link
              href="/reorder"
              className="w-full py-2.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Reorder Pantry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
