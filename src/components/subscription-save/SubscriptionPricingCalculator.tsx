'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, Sparkles, Check, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { subscriptionService } from '../../services/subscriptionService';
import { SubscriptionConfigData } from '../../types/data';

export function SubscriptionPricingCalculator() {
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

  const defaultDiscountPercentage = config?.defaultDiscountPercentage ?? 10;
  const freeShippingThreshold = config?.freeShippingThreshold ?? 49;

  // Interactive sample selector for the educational demonstration
  const [sampleBags, setSampleBags] = useState<number>(1);
  const basePricePerBag = 68.0; // Standard 14 lb Pacific Salmon recipe
  const unitDiscount = basePricePerBag * (defaultDiscountPercentage / 100);
  const discountedPricePerBag = basePricePerBag - unitDiscount;
  const subtotal = discountedPricePerBag * sampleBags;
  const shipping = subtotal >= freeShippingThreshold ? 0 : 6.5;
  const tax = subtotal * 0.0825;
  const totalPerCycle = subtotal + shipping + tax;
  const savingsPerCycle = unitDiscount * sampleBags;
  const annualSavings4Weeks = savingsPerCycle * 13; // 13 cycles/year

  return (
    <section aria-labelledby="pricing-heading" className="bg-white border border-stone-200/90 rounded-xs p-6 sm:p-10 shadow-xs space-y-8">
      <div className="max-w-2xl">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold block mb-1">
          Formula &amp; Arithmetic
        </span>
        <h2 id="pricing-heading" className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight">
          How Pricing &amp; Savings Are Calculated
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
          No hidden replenishment fees, membership surcharges, or fine-print expiration dates.
          Here is the complete arithmetic governing every invoice.
        </p>
      </div>

      {/* Visual Calculation Table & Interactive Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Arithmetic Formula Rules */}
        <div className="lg:col-span-6 space-y-4 text-xs">
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xs space-y-2.5">
            <h3 className="font-serif text-sm font-semibold text-stone-900">
              The 4 Rules of Auto-Ship Pricing
            </h3>

            <div className="space-y-3 text-stone-600 pt-1">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <strong className="text-stone-900">Guaranteed 10% Discount:</strong> Subtracted directly from the item’s standard catalog price on every single recurring cycle.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <strong className="text-stone-900">Free Courier at ${freeShippingThreshold.toFixed(0)}:</strong> Whenever your recurring order subtotal meets or exceeds $49.00, courier shipping is 100% complimentary.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <strong className="text-stone-900">State Sales Tax (8.25%):</strong> Assessed only against the net discounted subtotal, ensuring you never pay tax on savings.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-900 text-white flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <strong className="text-stone-900">No Sneak Price Jumps:</strong> If a recipe’s base price adjusts due to Pacific Northwest agricultural yields, we notify you 14 days in advance.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Concrete Example Ledger */}
        <div className="lg:col-span-6 p-5 sm:p-6 bg-stone-900 text-stone-100 rounded-xs border border-stone-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 block">
                Representative Invoice
              </span>
              <h4 className="font-serif text-base font-semibold text-white">
                14 lb Pacific Salmon Kibble
              </h4>
            </div>

            {/* Bag Quantity Toggle for testing arithmetic */}
            <div className="flex items-center gap-1.5 bg-stone-800 p-1 rounded-xs border border-stone-700 text-xs font-mono">
              <span className="text-[10px] text-stone-400 pl-1">Qty:</span>
              <button
                type="button"
                onClick={() => setSampleBags(1)}
                className={`px-2 py-0.5 rounded-xs transition-colors ${
                  sampleBags === 1 ? 'bg-emerald-800 text-white font-bold' : 'text-stone-300 hover:text-white'
                }`}
              >
                1
              </button>
              <button
                type="button"
                onClick={() => setSampleBags(2)}
                className={`px-2 py-0.5 rounded-xs transition-colors ${
                  sampleBags === 2 ? 'bg-emerald-800 text-white font-bold' : 'text-stone-300 hover:text-white'
                }`}
              >
                2
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-stone-300">
              <span>Standard One-Time Retail Price</span>
              <span className="line-through text-stone-500">
                {formatCurrency(basePricePerBag * sampleBags)}
              </span>
            </div>

            <div className="flex items-center justify-between text-emerald-400 font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Ship Savings (10%)</span>
              </span>
              <span>-{formatCurrency(savingsPerCycle)}</span>
            </div>

            <div className="flex items-center justify-between text-stone-300">
              <span>Provisions Net Subtotal</span>
              <span className="text-white font-medium">{formatCurrency(subtotal)}</span>
            </div>

            <div className="flex items-center justify-between text-stone-300">
              <span>Overland Courier Delivery</span>
              <span>{shipping === 0 ? <strong className="text-emerald-400">FREE</strong> : formatCurrency(shipping)}</span>
            </div>

            <div className="flex items-center justify-between text-stone-300">
              <span>Estimated Sales Tax (8.25%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-baseline justify-between text-white">
              <span className="font-serif text-sm">Total Per Delivery</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">
                {formatCurrency(totalPerCycle)}
              </span>
            </div>
          </div>

          {/* Cumulative Annual Value Callout */}
          <div className="p-3 bg-stone-800/80 border border-stone-700/80 rounded-xs text-[11px] font-mono text-stone-300 space-y-1">
            <span className="text-emerald-400 font-bold block">
              Cumulative Annual Value (Every 4 Weeks):
            </span>
            <p className="text-stone-400 leading-snug">
              Saving <strong className="text-white">{formatCurrency(annualSavings4Weeks)} per year</strong> on food alone, plus free courier delivery on qualifying baskets.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
