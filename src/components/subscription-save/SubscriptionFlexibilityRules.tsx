'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  FastForward,
  XCircle,
  Bell,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { subscriptionService } from '../../services/subscriptionService';
import { SubscriptionConfigData } from '../../types/data';

export function SubscriptionFlexibilityRules() {
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

  const minimumCyclesBeforeCancellation = config?.minimumCyclesBeforeCancellation ?? 0;
  const reminderNoticeDaysBeforeDispatch = config?.reminderNoticeDaysBeforeDispatch ?? 3;

  return (
    <section aria-labelledby="flexibility-heading" className="bg-white border border-stone-200/90 rounded-xs p-6 sm:p-10 shadow-xs space-y-8">
      <div className="max-w-2xl">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold block mb-1">
          Household Control Policy
        </span>
        <h2 id="flexibility-heading" className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight">
          Pantry Flexibility &amp; Cancellation Rules
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
          We treat members like neighbors. You retain uncompromised control of every order without phone calls, retainment hoops, or cancellation penalties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rule 1: Change Frequency */}
        <div className="p-5 bg-stone-50 border border-stone-200 rounded-xs space-y-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-900">
            <RotateCcw className="w-4 h-4" />
          </div>

          <h3 className="font-serif text-base font-semibold text-stone-900">
            Can I change my frequency?
          </h3>

          <p className="text-xs text-stone-600 leading-relaxed">
            <strong>Yes, at any time.</strong> If your companion is eating faster or slower than expected, switch between 2, 4, 6, 8, or 12 weeks with one click in your account. The new rhythm applies immediately to all future dispatches.
          </p>

          <span className="inline-block text-[11px] font-mono text-emerald-800 font-semibold pt-1">
            ✓ Instant cadence recalculation
          </span>
        </div>

        {/* Rule 2: Skip a Delivery */}
        <div className="p-5 bg-stone-50 border border-stone-200 rounded-xs space-y-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-900">
            <FastForward className="w-4 h-4" />
          </div>

          <h3 className="font-serif text-base font-semibold text-stone-900">
            Can I skip an upcoming delivery?
          </h3>

          <p className="text-xs text-stone-600 leading-relaxed">
            <strong>Yes, with zero penalty.</strong> If your pantry is still stocked, or you are traveling on a trail expedition, click &ldquo;Skip Next Delivery&rdquo;. Your next shipment date advances forward by one full cadence cycle.
          </p>

          <span className="inline-block text-[11px] font-mono text-emerald-800 font-semibold pt-1">
            ✓ Push shipment forward 1 cycle
          </span>
        </div>

        {/* Rule 3: Cancellation */}
        <div className="p-5 bg-stone-50 border border-stone-200 rounded-xs space-y-3">
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-stone-800">
            <XCircle className="w-4 h-4" />
          </div>

          <h3 className="font-serif text-base font-semibold text-stone-900">
            Can I cancel my subscription?
          </h3>

          <p className="text-xs text-stone-600 leading-relaxed">
            <strong>Yes, without restriction.</strong> We enforce a strict <strong>{minimumCyclesBeforeCancellation} minimum cycle commitment</strong>. You can cancel your routine immediately online at any time prior to batch dispatch with zero fees.
          </p>

          <span className="inline-block text-[11px] font-mono text-emerald-800 font-semibold pt-1">
            ✓ 0 minimum commitments required
          </span>
        </div>
      </div>

      {/* Pre-Dispatch Reminder Commitment */}
      <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xs flex items-start gap-3.5 text-xs text-emerald-950">
        <Bell className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold block font-mono text-[11px] uppercase tracking-wider text-emerald-900">
            Automated {reminderNoticeDaysBeforeDispatch}-Day Pre-Dispatch Notice
          </span>
          <p className="leading-relaxed text-emerald-900/90">
            We will never quietly bill or ship provisions behind your back. Three days before your batch enters Portland mill preparation, you will receive an email and optional SMS notice detailing enclosed items and arrival window, giving you ample time to pause, skip, or modify.
          </p>
        </div>
      </div>
    </section>
  );
}
