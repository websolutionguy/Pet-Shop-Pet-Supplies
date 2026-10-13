import React from 'react';
import { Leaf, Sprout, Compass, RefreshCw } from 'lucide-react';

export function SourcingStandards() {
  const standards = [
    {
      icon: Leaf,
      title: 'Identifiable Single Proteins',
      detail:
        'Grass-grazed venison, wild line-caught sockeye salmon, and cage-free heritage turkey. Never mystery "animal digest" or multi-poultry mixes that trigger canine allergic hot-spots.',
    },
    {
      icon: Sprout,
      title: 'Sprouted Slow-Burn Grains',
      detail:
        'We replace high-heat processed corn and soy with cold-milled sprouted spelt, pumpkin seed, and whole kelp to sustain stamina without insulin spikes.',
    },
    {
      icon: RefreshCw,
      title: 'Small Kettle Roasting Runs',
      detail:
        'Baked in modest 800-lb runs every three weeks. Fats and natural omega oils don’t oxidize on dusty distributor pallets for a year before reaching your doorstep.',
    },
    {
      icon: Compass,
      title: 'Zero Chemical Bleached Rawhide',
      detail:
        'Our dental chews consist solely of Himalayan yak cheese and hand-trimmed marrow bones sun-cured naturally, free of bleach, formaldehyde, and glued leather shavings.',
    },
  ];

  return (
    <section id="sourcing" className="py-16 border-t border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            Merchant Philosophy
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl font-serif font-semibold text-stone-900 tracking-tight">
            How we select what enters our store.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-stone-600 leading-relaxed">
            Every provision in our apothecary undergoes rigorous review. If we wouldn’t feed it to our own dogs and cats, it never earns shelf space or subscription allocation.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          {standards.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="flex gap-4 p-5 bg-stone-50/70 border border-stone-200/80 rounded-xs">
                <div className="shrink-0 w-8 h-8 bg-stone-200/80 text-stone-800 rounded-xs flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900 font-serif">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-stone-600 leading-relaxed">
                    {s.detail}
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
