'use client';

import React, { useState, useEffect } from 'react';
import { Package, Repeat, Check, Plus, ArrowRight } from 'lucide-react';
import { bundleService } from '../../services/bundleService';
import { CuratedBundle } from '../../types/bundle';
import { useCart } from '../../providers/CartProvider';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';

export function SubscriptionBundles() {
  const [bundles, setBundles] = useState<CuratedBundle[]>([]);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const { addMultipleItems } = useCart();

  useEffect(() => {
    let isMounted = true;
    bundleService.getBundles().then((data) => {
      if (isMounted) setBundles(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddBundle = async (bundle: CuratedBundle) => {
    // Add all enclosed bundle provisions to cart
    const itemsToAdd = [];
    for (const prodId of bundle.productIds) {
      const prod = await productService.getProductById(prodId);
      if (prod) {
        itemsToAdd.push({
          product: prod,
          options: {
            quantity: 1,
            purchaseType: 'subscription' as const,
            variantId: prod.variants?.[0]?.id,
          },
        });
      }
    }

    if (itemsToAdd.length > 0) {
      addMultipleItems(itemsToAdd);
    }

    setAddedIds((prev) => ({ ...prev, [bundle.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [bundle.id]: false }));
    }, 1500);
  };

  return (
    <section className="bg-white border-b border-stone-200 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-1.5 font-sans">
              Curated Regimens
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-stone-900 tracking-tight">
              Curated Recurring Bundles
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-xl">
              Complete nutrition, joint lipids, and enrichment paired together into a synchronized
              routine delivery with stacked savings.
            </p>
          </div>

          <span className="text-xs text-stone-500 font-mono hidden md:inline">
            Free Local Regional Courier Included
          </span>
        </div>

        {/* 2-Column Asymmetric Bundle Showcase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bundles.map((bundle) => {
            const savings = bundleService.calculateBundleSavings(bundle);
            const isAdded = addedIds[bundle.id];

            return (
              <div
                key={bundle.id}
                className="bg-stone-50 border border-stone-200/90 rounded-xs p-6 flex flex-col justify-between hover:border-stone-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded-xs font-semibold">
                      Save {savings.percentageSaved}% Bundle Savings
                    </span>
                    <span className="text-xs capitalize font-medium text-stone-500">
                      {bundle.petType === 'dogs' ? 'Canine Regimen' : 'Feline Regimen'}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900">
                    {bundle.name}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {bundle.description}
                  </p>

                  {/* Included items summary */}
                  <div className="mt-4 p-3 bg-white border border-stone-200/80 rounded-xs text-xs text-stone-700 space-y-1.5">
                    <span className="text-[10px] uppercase font-mono font-semibold text-stone-400 block">
                      Routine Pack Contents:
                    </span>
                    <p className="font-medium text-stone-800 leading-normal">
                      {bundle.shortDescription}
                    </p>
                  </div>
                </div>

                {/* Bottom Pricing & Subscription Action */}
                <div className="mt-6 pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-xl sm:text-2xl font-semibold text-stone-900 tabular-nums">
                        {formatCurrency(bundle.bundlePrice)}
                      </span>
                      {(bundle.compareAtPrice || bundle.individualTotal) && (
                        <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                          {formatCurrency(bundle.compareAtPrice || bundle.individualTotal)}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-emerald-800 font-medium block">
                      {bundle.savingsText}
                    </span>
                  </div>

                  <Button
                    variant={isAdded ? 'secondary' : 'primary'}
                    size="md"
                    onClick={() => handleAddBundle(bundle)}
                    leftIcon={isAdded ? <Check className="w-3.5 h-3.5" /> : <Repeat className="w-3.5 h-3.5" />}
                  >
                    {isAdded ? 'Subscribed to Routine' : 'Auto-Ship This Bundle'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
