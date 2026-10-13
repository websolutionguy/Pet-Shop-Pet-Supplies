import React from 'react';
import { Calendar, Shield, Clock, Sparkles } from 'lucide-react';

export function AutoShipExplainer() {
  const pillars = [
    {
      icon: Clock,
      title: 'Paced to Your Pet’s Daily Scoops',
      description:
        'Choose a 2, 4, 6, or 8-week cycle matched to your dog or cat’s weight. Your fresh provisions arrive 48 hours before the last cup runs dry.',
    },
    {
      icon: Sparkles,
      title: 'Small-Batch Freshness Priority',
      description:
        'Unlike mega-retailers that warehouse dry kibble for 14+ months, subscription orders are allocated directly from our regional fortnightly oven bakes.',
    },
    {
      icon: Calendar,
      title: 'Guaranteed 10% Recurring Savings',
      description:
        'Not a first-month promotional hook. Every scheduled delivery automatically saves 10% with complimentary shipping on carts over $49.',
    },
    {
      icon: Shield,
      title: 'Zero-Friction Control',
      description:
        'Travelling or feeding more treats this month? Skip an upcoming shipment, alter your bag size, or pause with one click. No phone calls required.',
    },
  ];

  return (
    <section id="subscriptions" className="py-16 bg-stone-900 text-stone-100 rounded-sm overflow-hidden my-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
            Independent Shop Routine Auto-Ship
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-semibold text-white tracking-tight">
            Fresh Pet Provisions on Steady Cadence.
          </h2>
          <p className="mt-3 text-sm text-stone-300 leading-relaxed">
            Recurring deliveries designed to be dependable, practical, and transparent. Keep your companions nourished with unadulterated food without haul trips or pantry stress.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="flex flex-col justify-between border-t border-stone-800 pt-5">
                <div>
                  <div className="w-8 h-8 rounded-xs bg-stone-800 flex items-center justify-center text-stone-300 mb-4">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white font-serif">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
