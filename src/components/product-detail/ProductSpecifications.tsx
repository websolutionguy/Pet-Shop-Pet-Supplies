'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  ShieldCheck,
  Truck,
  Repeat,
  Scale,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Product } from '../../types/product';
import { siteService } from '../../services/siteService';
import { subscriptionService } from '../../services/subscriptionService';
import { ShippingData, SubscriptionConfigData } from '../../types/data';
import { cn } from '../../lib/utils';

interface ProductSpecificationsProps {
  product: Product;
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const [activeTab, setActiveTab] = useState<
    'details' | 'ingredients' | 'nutrition' | 'usage' | 'shipping' | 'subscription'
  >('details');
  const [shippingConfig, setShippingConfig] = useState<ShippingData | null>(null);
  const [subscriptionConfig, setSubscriptionConfig] = useState<SubscriptionConfigData | null>(null);

  useEffect(() => {
    let isMounted = true;
    Promise.all([siteService.getShipping(), subscriptionService.getConfig()]).then(
      ([ship, sub]) => {
        if (!isMounted) return;
        setShippingConfig(ship);
        setSubscriptionConfig(sub);
      }
    );
    return () => {
      isMounted = false;
    };
  }, []);

  const tabList = [
    { id: 'details', label: 'Description & Benefits' },
    { id: 'ingredients', label: 'Whole Ingredients' },
    ...(product.guaranteedAnalysis ? [{ id: 'nutrition', label: 'Guaranteed Analysis' }] : []),
    { id: 'usage', label: 'How to Use & Feeding' },
    { id: 'shipping', label: 'Eco Shipping & Courier' },
    { id: 'subscription', label: 'Auto-Ship Program' },
  ] as const;

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIdx = (index + 1) % tabList.length;
      setActiveTab(tabList[nextIdx].id as any);
      const nextEl = document.getElementById(`tab-${tabList[nextIdx].id}`);
      nextEl?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIdx = (index - 1 + tabList.length) % tabList.length;
      setActiveTab(tabList[prevIdx].id as any);
      const prevEl = document.getElementById(`tab-${tabList[prevIdx].id}`);
      prevEl?.focus();
    }
  };

  return (
    <section className="bg-white border border-stone-200/90 rounded-xs overflow-hidden shadow-xs" aria-label="Product Specifications & Details">
      {/* Editorial Navigation Tabs */}
      <div
        className="border-b border-stone-200 bg-stone-50/70 overflow-x-auto scrollbar-none touch-pan-x flex items-center"
        role="tablist"
        aria-label="Product Specifications Tabs"
      >
        {tabList.map((t, idx) => {
          const isSelected = activeTab === t.id;
          return (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={`panel-${t.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveTab(t.id as any)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={cn(
                'px-4 sm:px-5 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors cursor-pointer min-h-[44px] flex items-center focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 outline-none',
                isSelected
                  ? 'border-stone-900 text-stone-950 font-semibold bg-white'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div
        className="p-6 sm:p-8 focus-visible:ring-1 focus-visible:ring-stone-900 outline-none"
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
      >
        {/* Tab 1: Description, Features & Benefits */}
        {activeTab === 'details' && (
          <div className="space-y-6 max-w-4xl text-xs sm:text-sm text-stone-700 leading-relaxed">
            <div>
              <h3 className="font-serif text-lg font-medium text-stone-900 mb-2">
                About this Recipe
              </h3>
              <p className="text-stone-600 leading-relaxed">
                {product.fullDescription || product.shortDescription}
              </p>
            </div>

            {/* Features & Key Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              {product.features && product.features.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900 font-mono mb-3">
                    Formulation Highlights
                  </h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-stone-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.keyBenefits && product.keyBenefits.length > 0 && (
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-900 font-mono mb-3">
                    Targeted Biological Benefits
                  </h4>
                  <ul className="space-y-2">
                    {product.keyBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-stone-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Whole Ingredients */}
        {activeTab === 'ingredients' && (
          <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-stone-700 leading-relaxed">
            <h3 className="font-serif text-lg font-medium text-stone-900 mb-1">
              Guaranteed Ingredients
            </h3>
            <p className="text-stone-500 text-xs">
              Every single protein and botanical component is fully traceable to regenerative
              Pacific Northwest ranches and clean fisheries. Zero synthetic coloring, zero animal
              byproducts, zero chemical preservatives.
            </p>

            {product.ingredients && product.ingredients.length > 0 ? (
              <div className="mt-4 p-4 bg-stone-50 border border-stone-200 rounded-xs">
                <ol className="list-decimal list-inside space-y-1.5 text-stone-800">
                  {product.ingredients.map((ing, idx) => (
                    <li key={idx} className="leading-normal">
                      <strong>{ing}</strong>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <p className="text-stone-500 italic">
                Single-source whole foods. Detailed batch certificate included with delivery.
              </p>
            )}
          </div>
        )}

        {/* Tab 3: Guaranteed Analysis */}
        {activeTab === 'nutrition' && product.guaranteedAnalysis && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="font-serif text-lg font-medium text-stone-900 mb-1">
              Guaranteed Nutritional Analysis
            </h3>
            <p className="text-xs text-stone-500">
              Formulated to meet or exceed veterinary nutritional levels established by AAFCO Dog & Cat Food Nutrient Profiles.
            </p>

            <div className="divide-y divide-stone-200 border border-stone-200 rounded-xs bg-stone-50/50 text-xs">
              <div className="p-3 flex items-center justify-between">
                <span className="font-medium text-stone-800">Crude Protein</span>
                <span className="font-mono font-semibold text-stone-900 tabular-nums">
                  {product.guaranteedAnalysis.crudeProtein}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="font-medium text-stone-800">Crude Fat</span>
                <span className="font-mono font-semibold text-stone-900 tabular-nums">
                  {product.guaranteedAnalysis.crudeFat}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="font-medium text-stone-800">Crude Fiber</span>
                <span className="font-mono font-semibold text-stone-900 tabular-nums">
                  {product.guaranteedAnalysis.crudeFiber}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="font-medium text-stone-800">Moisture Content</span>
                <span className="font-mono font-semibold text-stone-900 tabular-nums">
                  {product.guaranteedAnalysis.moisture}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: How to Use & Daily Feeding Guidelines */}
        {activeTab === 'usage' && (
          <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-stone-700 leading-relaxed">
            <h3 className="font-serif text-lg font-medium text-stone-900 mb-1">
              Daily Serving & Transition Guidelines
            </h3>
            <p className="text-stone-600">
              When transitioning from conventional industrial dry food, introduce Rowan & Hound
              gradually over 7 to 10 days to allow delicate digestive microbiomes to adjust:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs">
                <strong className="text-stone-900 font-mono text-xs block mb-1">
                  Days 1–3
                </strong>
                <p className="text-[11px] text-stone-600">
                  25% Rowan & Hound, 75% previous food.
                </p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs">
                <strong className="text-stone-900 font-mono text-xs block mb-1">
                  Days 4–7
                </strong>
                <p className="text-[11px] text-stone-600">
                  50% Rowan & Hound, 50% previous food.
                </p>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xs">
                <strong className="text-stone-900 font-mono text-xs block mb-1">
                  Days 8+
                </strong>
                <p className="text-[11px] text-stone-600">
                  100% full nutrition routine.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xs flex items-start gap-2.5 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <span>
                Always provide fresh, filtered drinking water alongside dry kibble. For enhanced gut
                hydration, add 2 tablespoons of warm bone broth or bone broth pate to each meal.
              </span>
            </div>
          </div>
        )}

        {/* Tab 5: Shipping Information */}
        {activeTab === 'shipping' && (
          <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-stone-700 leading-relaxed">
            <h3 className="font-serif text-lg font-medium text-stone-900 mb-1">
              Pacific Northwest Eco Shipping
            </h3>
            <p className="text-stone-600">
              We pack all orders using {shippingConfig?.packagingMaterials || '100% recyclable post-consumer corrugated boxes and water-activated paper tape.'} Cutoff for same-day
              dispatch from Carlton, OR is {shippingConfig?.sameDayCutoffHourPST ?? 14}:00 PST on business days.
            </p>

            {shippingConfig?.carriers && (
              <div className="divide-y divide-stone-200 border border-stone-200 rounded-xs bg-stone-50/50 text-xs">
                {shippingConfig.carriers.map((c) => (
                  <div key={c.id} className="p-3 flex items-center justify-between gap-4">
                    <div>
                      <strong className="text-stone-900 block font-medium">{c.name}</strong>
                      <span className="text-[11px] text-stone-500">{c.serviceArea} ({c.estimatedDays})</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-semibold text-stone-900 block">
                        ${c.cost.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-800 font-medium">
                        Free over ${c.freeThreshold}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Subscription Information */}
        {activeTab === 'subscription' && (
          <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-stone-700 leading-relaxed">
            <div className="flex items-center gap-2">
              <Repeat className="w-4 h-4 text-emerald-800" />
              <h3 className="font-serif text-lg font-medium text-stone-900">
                {subscriptionConfig?.programName || 'Subscribe & Save Routine Delivery'}
              </h3>
            </div>
            <p className="text-stone-600">
              Our auto-ship program is built with complete transparency. You are never locked in or
              forced into minimum order quantities.
            </p>

            <div className="space-y-2 pt-2">
              {(subscriptionConfig?.guarantees || [
                'Save 10% on every recurring delivery cycle.',
                'Zero commitment: pause, skip, or cancel in your account with 1 click.',
                'Fresh kettle-batch guarantee with unoxidized lipids.',
              ]).map((g, idx) => (
                <div key={idx} className="flex items-start gap-2 text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                  <span>{g}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center gap-4 text-xs font-mono text-stone-500">
              <span>Minimum cycles: {subscriptionConfig?.minimumCyclesBeforeCancellation ?? 0} (Cancel anytime)</span>
              <span>·</span>
              <span>Advance reminder: {subscriptionConfig?.reminderNoticeDaysBeforeDispatch ?? 3} days</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
