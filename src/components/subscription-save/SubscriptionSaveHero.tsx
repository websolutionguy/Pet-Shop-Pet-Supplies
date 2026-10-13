'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Repeat, ShieldCheck, ArrowRight } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { SubscriptionConfigData } from '../../types/data';

export function SubscriptionSaveHero() {
  const [config, setConfig] = useState<SubscriptionConfigData | null>(null);

  useEffect(() => {
    let isMounted = true;
    subscriptionService.getConfig().then((cfg) => {
      if (isMounted) setConfig(cfg);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const programName = config?.programName || 'Rowan & Hound Routine Auto-Ship Program';
  const defaultDiscountPercentage = config?.defaultDiscountPercentage ?? 10;
  const freeShippingThreshold = config?.freeShippingThreshold ?? 49;

  return (
    <section className="bg-stone-900 text-stone-100 rounded-xs p-6 sm:p-10 lg:p-12 border border-stone-800 shadow-sm relative overflow-hidden">
      <div className="relative z-10 max-w-3xl space-y-5">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/70 text-emerald-300 rounded-xs text-[11px] font-mono uppercase tracking-widest border border-emerald-700/60">
          <Repeat className="w-3.5 h-3.5 text-emerald-400" />
          <span>Independent Auto-Ship Nutrition Program</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-[1.15]">
          A Dependable Feeding Cadence for Your Household Companion
        </h1>

        <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
          The <strong>{programName}</strong> is not an algorithmic trap or an unyielding contract.
          It is a scheduled reservation of our small-batch Pacific Northwest recipes that automatically delivers to your doorstep on your animal’s natural feeding rhythm.
        </p>

        {/* 3 Immutable Program Commitments */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-stone-800/80 rounded-xs border border-stone-700/80 space-y-1">
            <span className="text-emerald-400 font-bold block text-sm">
              {defaultDiscountPercentage}% Guaranteed Savings
            </span>
            <span className="text-stone-400 text-[11px] leading-snug block">
              Applied automatically to every recurring delivery cycle, forever.
            </span>
          </div>

          <div className="p-3 bg-stone-800/80 rounded-xs border border-stone-700/80 space-y-1">
            <span className="text-white font-bold block text-sm">
              0 Minimum Cycles
            </span>
            <span className="text-stone-400 text-[11px] leading-snug block">
              Pause, reschedule, or cancel anytime in your account with zero penalty.
            </span>
          </div>

          <div className="p-3 bg-stone-800/80 rounded-xs border border-stone-700/80 space-y-1">
            <span className="text-white font-bold block text-sm">
              Free Courier at ${freeShippingThreshold.toFixed(0)}
            </span>
            <span className="text-stone-400 text-[11px] leading-snug block">
              Complimentary regional delivery directly to your covered porch.
            </span>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/subscriptions"
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xs transition-colors inline-flex items-center gap-2"
          >
            <span>Curate Custom Routine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/shop"
            className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-xs border border-stone-700 transition-colors"
          >
            Browse Eligible Provisions
          </Link>
        </div>
      </div>
    </section>
  );
}
