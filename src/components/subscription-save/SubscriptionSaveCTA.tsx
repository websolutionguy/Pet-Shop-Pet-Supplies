'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Repeat, Heart } from 'lucide-react';

export function SubscriptionSaveCTA() {
  return (
    <section className="bg-stone-900 text-stone-100 rounded-xs p-8 sm:p-12 border border-stone-800 shadow-sm text-center relative overflow-hidden">
      <div className="max-w-2xl mx-auto space-y-5 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/60 text-emerald-300 rounded-xs text-[11px] font-mono uppercase tracking-widest border border-emerald-700/60">
          <Repeat className="w-3.5 h-3.5 text-emerald-400" />
          <span>Begin Your Companion’s Routine</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-white tracking-tight">
          Reliable Small-Batch Nutrition, Always On Schedule
        </h2>

        <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
          Start with our signature whole-protein recipes, select your companion’s interval, and let our Pacific Northwest couriers handle the rest.
        </p>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/subscriptions"
            className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Curate Custom Subscription Box</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-5 py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium rounded-xs border border-stone-700 transition-colors"
          >
            Browse Full Pantry
          </Link>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-stone-400">
          <span>✓ 10% Continuous Savings</span>
          <span>·</span>
          <span>✓ 0 Minimum Commitment</span>
          <span>·</span>
          <span>✓ Free Courier Delivery Over $49</span>
        </div>
      </div>
    </section>
  );
}
