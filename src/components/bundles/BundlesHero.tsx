'use client';

import React from 'react';
import { Sparkles, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function BundlesHero() {
  return (
    <section className="bg-stone-900 text-stone-100 rounded-xs p-6 sm:p-10 lg:p-12 border border-stone-800 shadow-sm relative overflow-hidden">
      <div className="relative z-10 max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-900/60 text-emerald-300 rounded-xs text-[11px] font-mono uppercase tracking-widest border border-emerald-700/60">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>Curated Whole-Health Sets</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-tight">
          Purpose-Matched Provision Bundles
        </h1>

        <p className="text-stone-300 text-xs sm:text-sm lg:text-base leading-relaxed">
          Crafted to remove guesswork from daily care. We pair slow-baked kibbles, pure marine lipids, natural timber litters, and single-source chews into harmonious pantry regimens.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-stone-300">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Honest Mathematical Pricing</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>One-Time or Steady Auto-Ship</span>
          </span>
          <span>·</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Free Courier on Qualifying Orders ($49+)</span>
          </span>
        </div>
      </div>
    </section>
  );
}
