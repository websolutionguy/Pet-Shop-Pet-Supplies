'use client';

import React, { useState, useMemo } from 'react';
import { Scale, Wind, Sparkles, ArrowRight, Check } from 'lucide-react';
import { petService } from '../../services/petService';

export function PetCareEditorial() {
  const [testWeight, setTestWeight] = useState(35);
  const calculation = useMemo(() => petService.calculatePetCadence(testWeight, 14), [testWeight]);

  return (
    <section className="bg-[#FAF8F5] border-b border-stone-200 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <p className="text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-2 font-sans">
            Independent Care Notes
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl font-normal text-stone-900 tracking-tight leading-snug">
            Nutrition and care fundamentals, guided by biology.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
            Practical veterinary guidance on replenishment cycles, feline hydration habits, and
            daily feeding routines.
          </p>
        </div>

        {/* 3 Distinct Practical Editorial Blocks (Different structures!) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* Guide 1: Interactive Replenishment Cadence Calculator */}
          <div className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div>
              <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono uppercase tracking-wider mb-2">
                <Scale className="w-3.5 h-3.5 text-stone-500" />
                <span>Pantry Mathematics</span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-900">
                How often should you reorder dog food?
              </h3>

              <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                Oxygen exposure degrades essential fats once a bag is cut open. Ideally, kibble
                should be consumed within 30 to 45 days.
              </p>

              {/* Interactive Weight Slider Calculator */}
              <div className="mt-5 p-3.5 bg-stone-50 rounded-xs border border-stone-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-stone-700">Companion Weight:</span>
                  <span className="font-mono font-semibold text-stone-900 tabular-nums">
                    {testWeight} lbs
                  </span>
                </div>

                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={testWeight}
                  onChange={(e) => setTestWeight(Number(e.target.value))}
                  className="w-full accent-stone-900 cursor-pointer"
                  aria-label="Dog weight in lbs"
                />

                <div className="pt-2 border-t border-stone-200/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-stone-400 block font-mono text-[10px]">Daily Intake:</span>
                    <strong className="text-stone-800 font-mono">
                      ~{calculation.dailyIntakeCups} cups/day
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-mono text-[10px]">14 lb Bag Cadence:</span>
                    <strong className="text-emerald-900 font-mono">
                      Every {calculation.recommendedWeeks} weeks
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-stone-500 italic">
              *Calculated using veterinary caloric guidelines for average active companion dogs.
            </p>
          </div>

          {/* Guide 2: Choosing the Right Cat Litter */}
          <div className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div>
              <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono uppercase tracking-wider mb-2">
                <Wind className="w-3.5 h-3.5 text-stone-500" />
                <span>Respiratory Wellness</span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-900">
                Choosing the right cat litter
              </h3>

              <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                Conventional bentonite clay litters produce fine silica dust that irritates feline
                nasal passages and paws.
              </p>

              <div className="mt-4 space-y-2 text-xs text-stone-700">
                <div className="flex items-start gap-2 bg-emerald-50/60 p-2.5 rounded-xs border border-emerald-200/60">
                  <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block font-medium">Reclaimed Wood Fiber:</strong>
                    Naturally traps ammonia odors without synthetic chemical perfumes.
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xs border border-stone-200/70">
                  <Check className="w-3.5 h-3.5 text-stone-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-stone-900 block font-medium">Crushed Walnut Shells:</strong>
                    Fast clumping with 99.8% less tracking around the apartment.
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <span>Low-Dust Formulations</span>
              <span className="font-mono text-[11px] text-stone-400">Natural Substrates</span>
            </div>
          </div>

          {/* Guide 3: Building a Practical Routine */}
          <div className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <div>
              <div className="flex items-center gap-2 text-[10px] text-stone-400 font-mono uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-stone-500" />
                <span>Daily Care Structure</span>
              </div>

              <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-900">
                Building a practical pet-care routine
              </h3>

              <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                Consistent biological timing reduces digestive distress and separation anxiety in
                both dogs and domestic cats.
              </p>

              <div className="mt-4 space-y-2.5 text-xs text-stone-600">
                <div className="border-l-2 border-[#1E3A2F] pl-3 py-0.5">
                  <strong className="text-stone-900 block font-sans">07:30 · Hydrated Morning Meal</strong>
                  <span>Kibble or pate served with 2 tbsp warm bone broth to prime gut lining.</span>
                </div>

                <div className="border-l-2 border-amber-700 pl-3 py-0.5">
                  <strong className="text-stone-900 block font-sans">13:00 · Mental Enrichment & Chewing</strong>
                  <span>20 minutes with a Himalayan yak bar to lower salivary cortisol.</span>
                </div>

                <div className="border-l-2 border-stone-400 pl-3 py-0.5">
                  <strong className="text-stone-900 block font-sans">18:30 · Evening Omega Supplement</strong>
                  <span>Cold-pressed wild salmon oil added to dinner for overnight tissue repair.</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
              <span>Veterinary Formulated Routine</span>
              <span className="font-mono text-[11px] text-stone-400">Circadian Feeding</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
