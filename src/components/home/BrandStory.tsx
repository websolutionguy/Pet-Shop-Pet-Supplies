import React from 'react';
import { MapPin, Flame, ShieldCheck, HeartHandshake } from 'lucide-react';

export function BrandStory() {
  return (
    <section className="bg-[#FAF8F5] border-b border-stone-200 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Brand Story narrative */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-2 font-sans">
                Our Story & Origins
              </p>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-stone-900 tracking-tight leading-tight">
                Crafted by veterinary technicians, not industrial food conglomerates.
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Rowan & Hound Supply Co. was established in Portland, Oregon by veterinary technicians
              and companion pet parents frustrated by mass-market pet food distribution, where extruded
              kibble often sits in warm multi-state distribution warehouses for over a year before
              reaching retail shelves.
            </p>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We partnered directly with Pacific Northwest family ranches and clean fisheries to roast
              nutrient-dense single-protein dry kibble, simmer hydration-rich bone broths, and cure
              whole-milk yak bars in small 800-lb kettle batches every three weeks in Yamhill County.
            </p>

            {/* Physical Storefront & Kitchen transparency */}
            <div className="pt-4 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
              <div className="p-3 bg-white border border-stone-200/90 rounded-xs space-y-1">
                <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  Portland Flagship Storefront
                </span>
                <p className="text-stone-500 text-[11px]">
                  142 Market St, Portland, OR 97201
                </p>
                <span className="text-[10px] text-stone-400 font-mono block">
                  Open Mon–Sat 9am–7pm
                </span>
              </div>

              <div className="p-3 bg-white border border-stone-200/90 rounded-xs space-y-1">
                <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-700" />
                  Willamette Valley Kitchen
                </span>
                <p className="text-stone-500 text-[11px]">
                  Carlton, Yamhill County, OR 97111
                </p>
                <span className="text-[10px] text-stone-400 font-mono block">
                  Small-batch 21-day kettle roasting
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Real Sourcing Standards (Zero Slop) */}
          <div className="lg:col-span-6 space-y-3.5">
            <h3 className="font-serif text-lg text-stone-900 font-medium mb-3">
              The Four Independent Provisions Standards
            </h3>

            <div className="bg-white border border-stone-200/90 rounded-xs p-4 space-y-1.5">
              <strong className="text-xs uppercase tracking-wider font-semibold text-stone-900 block font-mono">
                1. 21-Day Fresh-Batch Roasting
              </strong>
              <p className="text-xs text-stone-600 leading-relaxed">
                Baking dry foods every three weeks ensures that volatile omega fatty acids and viable
                live probiotics never oxidize on warm warehouse shelves.
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-xs p-4 space-y-1.5">
              <strong className="text-xs uppercase tracking-wider font-semibold text-stone-900 block font-mono">
                2. Single-Source Red Meats & Fish
              </strong>
              <p className="text-xs text-stone-600 leading-relaxed">
                Free-range pasture venison, line-caught Alaskan sockeye salmon, and cage-free heritage
                turkey—with absolutely zero mystery poultry byproduct meals.
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-xs p-4 space-y-1.5">
              <strong className="text-xs uppercase tracking-wider font-semibold text-stone-900 block font-mono">
                3. Strict Zero-Rawhide Policy
              </strong>
              <p className="text-xs text-stone-600 leading-relaxed">
                100% grass-fed yak cheese bars and whole marrow bones. Completely free from chemical
                bleach, glue adhesives, or synthetic flavorings.
              </p>
            </div>

            <div className="bg-white border border-stone-200/90 rounded-xs p-4 space-y-1.5">
              <strong className="text-xs uppercase tracking-wider font-semibold text-stone-900 block font-mono">
                4. No-Trap Subscriptions
              </strong>
              <p className="text-xs text-stone-600 leading-relaxed">
                Recurring auto-ship with guaranteed 10% savings, full flexibility to pause or skip in
                one click, and zero hidden cancellation barriers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
