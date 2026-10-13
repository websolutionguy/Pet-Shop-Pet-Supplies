'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Clock,
  Sparkles,
  Truck,
  Sliders,
  ArrowDown,
  CheckCircle2,
} from 'lucide-react';

export function SubscriptionJourneyFlow() {
  const steps = [
    {
      number: '01',
      title: 'Choose essentials',
      icon: ShoppingBag,
      summary: 'Select whole-protein kibbles, freeze-dried toppers, or botanical oils for your companion.',
      details:
        'Select the exact formulation and bag size matched to your animal’s age and dietary profile. You can combine multiple items into a single consolidated delivery.',
      example: 'e.g. 1× 14 lb Pacific Salmon Kibble + 1× Oregon Yak Cheese Chews',
    },
    {
      number: '02',
      title: 'Choose frequency',
      icon: Clock,
      summary: 'Align deliveries with your companion’s actual daily cup consumption.',
      details:
        'Select from 2, 4, 6, 8, or 12-week intervals. Deliveries are calibrated to arrive 48 hours before your prior bag is emptied, eliminating emergency store runs.',
      example: 'e.g. Every 4 weeks (28 days) — recommended for a 45 lb companion eating 2 cups daily',
    },
    {
      number: '03',
      title: 'Review savings',
      icon: Sparkles,
      summary: '10% continuous discount is calculated immediately on every item in your routine.',
      details:
        'Your recurring discount is transparently deducted from each product’s base price. Orders exceeding $49 also qualify for complimentary regional courier dispatch.',
      example: 'e.g. $84.00 subtotal → 10% auto-ship savings (-$8.40) = $75.60 per cycle',
    },
    {
      number: '04',
      title: 'Receive recurring orders',
      icon: Truck,
      summary: 'Freshly milled provisions arrive at your door in recyclable, insulated cartons.',
      details:
        'We notify you via email 3 days before each batch dispatch. Your provisions are roasted and cold-packed in Portland, then couriered directly to your porch.',
      example: 'e.g. Batch notice on Oct 24 → Dispatched Oct 27 via USPS Overland Courier',
    },
    {
      number: '05',
      title: 'Adjust whenever needed',
      icon: Sliders,
      summary: 'Full control in your companion member pantry without calls or minimums.',
      details:
        'Going on holiday? Feeding less in winter? Skip an upcoming shipment, modify quantities, swap protein flavors, or cancel in your account with zero penalties.',
      example: 'e.g. One-click skip or cadence adjustment in /account/subscriptions',
    },
  ];

  return (
    <section aria-labelledby="journey-heading" className="bg-white border border-stone-200/90 rounded-xs p-6 sm:p-10 shadow-xs space-y-8">
      <div className="max-w-2xl">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold block mb-1">
          Practical Process
        </span>
        <h2 id="journey-heading" className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 tracking-tight">
          How Steady Auto-Ship Operates
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
          From first selection to scheduled porch deliveries, here is the exact progression of your recurring nutrition service.
        </p>
      </div>

      {/* Sequential Editorial Timeline */}
      <div className="relative border-l-2 border-stone-200 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8 sm:space-y-10">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.number} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-0 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-mono font-bold shadow-xs">
                {step.number}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-emerald-800 shrink-0" />
                  <h3 className="font-serif text-lg font-semibold text-stone-900">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm font-medium text-stone-800">
                  {step.summary}
                </p>

                <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                  {step.details}
                </p>

                {/* Practical Concrete Example Card */}
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs text-[11px] font-mono text-stone-700 inline-block max-w-xl">
                  <span className="text-emerald-800 font-semibold block text-[10px] uppercase tracking-wider mb-0.5">
                    Realistic Execution
                  </span>
                  {step.example}
                </div>
              </div>

              {!isLast && (
                <div className="pt-4 text-stone-300">
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
