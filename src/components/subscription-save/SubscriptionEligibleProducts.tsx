'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Check, X, ArrowRight, ShieldCheck } from 'lucide-react';

export function SubscriptionEligibleProducts() {
  const eligibleCategories = [
    {
      title: 'Artisan Whole-Protein Kibble',
      description: 'Slow-baked, high-protein formulations milled in fortnightly small batches.',
      examples: ['Venison & Ancient Spelt', 'Wild Pacific Salmon & Whitefish', 'Free-Range Duck Feast'],
      cadenceBestFor: '4 to 6-week replenishment',
      icon: '🌾',
    },
    {
      title: 'Freeze-Dried Raw & Single-Source Chews',
      description: 'Gently dehydrated novel organs and high-altitude yak chews for dental vitality.',
      examples: ['Oregon Yak Cheese Chews', 'Grass-Fed Beef Liver Bites', 'Freeze-Dried Turkey Hearts'],
      cadenceBestFor: '2 to 4-week replenishment',
      icon: '🥩',
    },
    {
      title: 'Slow-Simmered Broths & Botanical Oils',
      description: 'Bioavailable joint and coat enrichments bottled in recyclable glass flacons.',
      examples: ['Wild Alaskan Salmon Oil', 'Slow-Simmered Turkey Bone Broth', 'Flax & Kelp Topper'],
      cadenceBestFor: '6 to 8-week replenishment',
      icon: '🌿',
    },
  ];

  return (
    <section aria-labelledby="eligible-products-heading" className="bg-white border border-stone-200/90 rounded-xs p-6 sm:p-10 shadow-xs space-y-8">
      <div className="max-w-2xl">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold block mb-1">
          Catalog Eligibility
        </span>
        <h2 id="eligible-products-heading" className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight">
          Which Products Can Be Subscribed To?
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
          We only enable auto-ship for recipes where consistent fresh-batch milling can be guaranteed.
          Provisions that are seasonal or hardware-based are reserved for one-time orders.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {eligibleCategories.map((cat, i) => (
          <div
            key={i}
            className="p-5 bg-stone-50 border border-stone-200 rounded-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="text-2xl">{cat.icon}</div>
              <h3 className="font-serif text-base font-semibold text-stone-900">
                {cat.title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {cat.description}
              </p>

              <div className="pt-2 border-t border-stone-200/70 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                  Eligible Recipes:
                </span>
                <ul className="text-xs text-stone-700 space-y-1 font-mono">
                  {cat.examples.map((ex, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-800 shrink-0" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 text-[11px] font-mono text-emerald-900 bg-emerald-100/50 p-2 rounded-xs">
              Optimal Rhythm: <strong>{cat.cadenceBestFor}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Distinction of What Does Not Qualify */}
      <div className="p-4 bg-stone-50 border border-stone-200 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1 max-w-xl">
          <span className="font-semibold text-stone-900 block font-mono text-[11px] uppercase tracking-wider">
            Items Ineligible for Auto-Ship
          </span>
          <p className="text-stone-600 leading-relaxed">
            Leather trail leashes, ceramic feeding bowls, limited holiday gift sets, and seasonal farm harvests are sold exclusively as <strong>One-Time Purchases</strong> to prevent unintentional recurring shipments of non-perishable goods.
          </p>
        </div>

        <Link
          href="/shop?subscription=true"
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold rounded-xs transition-colors shrink-0 text-center inline-flex items-center gap-1.5"
        >
          <span>Shop Auto-Ship Eligible</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
