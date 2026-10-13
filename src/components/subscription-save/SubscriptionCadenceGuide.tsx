'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { SubscriptionFrequencyData } from '../../types/data';
import { formatCadenceLabel } from '../../lib/utils';
import { ProductCadence } from '../../types/product';

export function SubscriptionCadenceGuide() {
  const [frequencies, setFrequencies] = useState<SubscriptionFrequencyData[]>([]);

  useEffect(() => {
    let isMounted = true;
    subscriptionService.getFrequencies().then((freqs) => {
      if (isMounted) setFrequencies(freqs);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section aria-labelledby="cadence-guide-heading" className="bg-white border border-stone-200/90 rounded-xs p-6 sm:p-10 shadow-xs space-y-8">
      <div className="max-w-2xl">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold block mb-1">
          Delivery Cadences
        </span>
        <h2 id="cadence-guide-heading" className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight">
          How Often Can Deliveries Happen?
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
          Deliveries follow strict natural intervals rather than arbitrary calendar dates.
          Every cadence interval is tied directly to bag weight and companion caloric requirements.
        </p>
      </div>

      <div className="divide-y divide-stone-200 border-y border-stone-200">
        {frequencies.map((freq) => (
          <div
            key={freq.id}
            className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 first:pt-4 last:pb-4"
          >
            <div className="space-y-1 md:max-w-md">
              <div className="flex items-center gap-3">
                <span className="font-serif text-base font-semibold text-stone-900">
                  {freq.name}
                </span>

                <span className="font-mono text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-xs">
                  {freq.intervalDays} Days Interval
                </span>

                {freq.popular && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-xs border border-emerald-300">
                    Most Popular Cadence
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {freq.description}
              </p>
            </div>

            <div className="flex items-center gap-6 shrink-0 text-xs font-mono text-stone-700">
              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                  Cycles / Year
                </span>
                <span className="font-bold text-stone-900 text-sm">
                  {Math.floor(365 / freq.intervalDays)} Deliveries
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                  Lead Notification
                </span>
                <span className="text-emerald-800 font-semibold">
                  3 Days Prior
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cadence Calibration Rule */}
      <div className="p-4 bg-stone-50 border border-stone-200 rounded-xs text-xs text-stone-700 space-y-1.5">
        <div className="flex items-center gap-2 font-semibold text-stone-900 font-mono text-[11px] uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-emerald-800" />
          <span>Need to Modify Your Interval Later?</span>
        </div>
        <p className="leading-relaxed text-stone-600">
          Your chosen interval is never locked. If your companion enters an active summer hiking season or switches to alternate proteins, you can adjust frequency at any time from your member account dashboard with immediate effect on the following cycle.
        </p>
      </div>
    </section>
  );
}
