import React from 'react';
import {
  Repeat,
  Calendar,
  Clock,
  Truck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from 'lucide-react';

interface SubscriptionFeatureProps {
  onExploreAutoShip?: () => void;
}

const STEPS = [
  {
    step: '01',
    title: 'Choose Your Routine Essentials',
    description:
      'Select your companion’s favorite small-batch kibble, single-ingredient chews, bone broths, or cold-pressed fish oils.',
  },
  {
    step: '02',
    title: 'Select Your Delivery Frequency',
    description:
      'Choose from 2, 4, 6, 8, or 12 weeks. Our canine and feline intake calculator can recommend the exact cadence based on your pet’s weight.',
  },
  {
    step: '03',
    title: 'Save 10% & Time on Every Order',
    description:
      'Receive automatic 10% savings on every recurring order with no coupons or discount codes needed.',
  },
  {
    step: '04',
    title: 'Fresh-Batch Delivery to Your Door',
    description:
      'Provisions arrive directly from our 21-day Oregon kettle runs, protected in temperature-stable packaging.',
  },
  {
    step: '05',
    title: 'Pause, Skip, or Adjust Anytime',
    description:
      'Going on holiday or have extra kibble left? Defer, speed up, or cancel in a single click from your member dashboard—no phone calls required.',
  },
];

export function SubscriptionFeature({ onExploreAutoShip }: SubscriptionFeatureProps) {
  return (
    <section id="subscriptions" className="bg-white border-b border-stone-200 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-2 font-sans">
            Routine Replenishment
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight leading-[1.12]">
            Never scrape the bottom of the food bin again.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            Auto-ship isn’t a sales lock-in; it’s a dependable logistics system designed by veterinary
            technicians to ensure companion animals receive unoxidized, fresh nutrition right on schedule.
          </p>
        </div>

        {/* Asymmetric 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: 5 Sequential Steps */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif text-lg text-stone-900 font-medium mb-3">
              How the Routine Auto-Ship Workflow Works
            </h3>

            <div className="divide-y divide-stone-200 border-y border-stone-200">
              {STEPS.map((s) => (
                <div key={s.step} className="py-4 grid grid-cols-12 gap-3 items-start">
                  <div className="col-span-2 sm:col-span-1">
                    <span className="font-mono text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                      {s.step}
                    </span>
                  </div>

                  <div className="col-span-10 sm:col-span-11">
                    <h4 className="font-serif text-base font-medium text-stone-900">
                      {s.title}
                    </h4>
                    <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <a
                href="#catalog"
                className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xs text-xs font-mono font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-stone-900 outline-none"
              >
                <Repeat className="w-4 h-4 text-emerald-300" />
                <span>Browse Auto-Ship Eligible Provisions (-10%)</span>
              </a>
            </div>
          </div>

          {/* Right Column: Practical Comparison Table (Zero Slop) */}
          <div className="lg:col-span-5 bg-stone-50 border border-stone-200 rounded-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-base font-semibold text-stone-900">
                Pantry Model Comparison
              </h3>
              <span className="text-[10px] uppercase font-mono text-stone-500">
                Warehouse vs. Routine
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Row 1 */}
              <div className="space-y-1.5 pb-3 border-b border-stone-200/70">
                <span className="font-semibold text-stone-800 block">Food Freshness & Lipids</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="text-stone-500 bg-white p-2 rounded-xs border border-stone-200">
                    <span className="text-red-700 font-medium block">Industrial Store:</span>
                    12–18 months in warm regional distribution hubs.
                  </div>
                  <div className="text-emerald-950 bg-emerald-50/70 p-2 rounded-xs border border-emerald-200">
                    <span className="text-emerald-800 font-medium block">Rowan & Hound:</span>
                    Baked every 21 days in Oregon kettle batches.
                  </div>
                </div>
              </div>

              {/* Row 2 */}
              <div className="space-y-1.5 pb-3 border-b border-stone-200/70">
                <span className="font-semibold text-stone-800 block">Pricing & Savings</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="text-stone-500 bg-white p-2 rounded-xs border border-stone-200">
                    <span className="text-stone-700 font-medium block">Full Retail Price:</span>
                    Requires clipping coupons or unpredictable sale cycles.
                  </div>
                  <div className="text-emerald-950 bg-emerald-50/70 p-2 rounded-xs border border-emerald-200">
                    <span className="text-emerald-800 font-medium block">Automatic 10% Off:</span>
                    Applied to every recurring delivery, guaranteed.
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="space-y-1.5 pb-2">
                <span className="font-semibold text-stone-800 block">Subscription Flexibility</span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="text-stone-500 bg-white p-2 rounded-xs border border-stone-200">
                    <span className="text-red-700 font-medium block">Big Box Subscriptions:</span>
                    Difficult cancellations, phone calls, or minimum cycles.
                  </div>
                  <div className="text-emerald-950 bg-emerald-50/70 p-2 rounded-xs border border-emerald-200">
                    <span className="text-emerald-800 font-medium block">Complete Control:</span>
                    Pause, skip, or cancel in 1 click from your browser.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200/80 flex items-center gap-2 text-[11px] text-stone-600">
              <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
              <span>Free regional dispatch on all recurring orders over $49.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
