'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { RotateCcw, Package, Clock, Check, Plus, AlertCircle } from 'lucide-react';
import pantryImg from '../../assets/images/pantry_pet_provisions_1790398242767.jpg';
import { Product } from '../../types/product';
import { reorderService } from '../../services/reorderService';
import { useCart } from '../../providers/CartProvider';
import { usePetProfile } from '../../providers/PetProfileProvider';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';
import {
  FeatureLoadingState,
  FeatureEmptyState,
  FeatureErrorState,
} from '../ui/StateFeedback';

export function ReorderSection() {
  const [candidates, setCandidates] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const { addItem } = useCart();
  const { selectedPet } = usePetProfile();

  const loadCandidates = () => {
    setIsLoading(true);
    setError(null);
    reorderService
      .getReorderableProducts()
      .then((items) => setCandidates(items))
      .catch(() => {
        setError(
          "We couldn't retrieve your pantry restock candidates right now. Please try again or visit our full provisions catalog."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    reorderService
      .getReorderableProducts()
      .then((items) => {
        if (isMounted) setCandidates(items);
      })
      .catch(() => {
        if (isMounted) {
          setError(
            "We couldn't retrieve your pantry restock candidates right now. Please try again or visit our full provisions catalog."
          );
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleQuickReorder = (product: Product) => {
    addItem(product, {
      quantity: 1,
      purchaseType: 'one-time',
    });
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="reorder" className="bg-white border-b border-stone-200 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Practical Reorder Workflow & Quick-Add Candidates */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-2">
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Pantry Replenishment</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-stone-900 tracking-tight leading-tight">
                Running low on essentials?
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
                Whether you’re on a recurring auto-ship routine or prefer ordering as needed,
                our pantry quick-reorder tool remembers what your companion loves. Restock your bin in two clicks.
              </p>
            </div>

            {/* Smart Depletion Notice for Active Companion */}
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-xs p-3.5 flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div className="text-xs text-stone-700">
                <span className="font-semibold text-stone-900 block">
                  Pantry Depletion Indicator:
                </span>
                <span>
                  Based on daily feeding intake for{' '}
                  <strong>{selectedPet ? selectedPet.name : 'Jasper'}</strong>, standard 14 lb bags
                  typically need replenishment every <strong>4 weeks</strong>.
                </span>
              </div>
            </div>

            {/* Reorder Candidates List */}
            <div className="space-y-2.5">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block">
                Top Pantry Candidates (Ready to Restock)
              </span>

              {isLoading ? (
                <FeatureLoadingState
                  compact={true}
                  title="Checking companion pantry history..."
                  message="Calculating replenishment dates based on animal meal size."
                />
              ) : error ? (
                <FeatureErrorState
                  compact={true}
                  title="Pantry Sync Issue"
                  message={error}
                  onRetry={loadCandidates}
                  retryLabel="Refresh History"
                />
              ) : candidates.length === 0 ? (
                <FeatureEmptyState
                  compact={true}
                  title="No reorderable products available"
                  description="Your reorder list is empty because you don't have any eligible previous purchases recorded in your current pantry session. Explore our fresh-roasted recipes and cold-pressed treats to get started."
                  primaryAction={{
                    label: 'Explore Our Provisions Catalog',
                    href: '/shop',
                  }}
                />
              ) : (
                <div className="divide-y divide-stone-200 border border-stone-200 rounded-xs bg-stone-50/50">
                  {candidates.slice(0, 3).map((item) => {
                    const isAdded = addedIds[item.id];
                    return (
                      <div
                        key={item.id}
                        className="p-3 sm:p-4 flex items-center justify-between gap-3 bg-white hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-[10px] text-stone-500 uppercase tracking-wider">
                            <span>{item.brand}</span>
                            <span>·</span>
                            <span>{item.categoryName}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-medium text-stone-900 truncate">
                            {item.name}
                          </h4>
                          <div className="mt-0.5 flex items-baseline gap-2">
                            <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                              {formatCurrency(item.basePrice)}
                            </span>
                            <span className="text-[10px] text-stone-500 font-mono">
                              {item.unitMeasurement}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <Button
                            variant={isAdded ? 'secondary' : 'outline'}
                            size="sm"
                            onClick={() => handleQuickReorder(item)}
                            leftIcon={isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                          >
                            {isAdded ? 'Added' : 'Restock Bin'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Lifestyle Imagery & Reassurances */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/3 sm:aspect-16/10 lg:aspect-4/5 rounded-xs overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
              <Image
                src={pantryImg}
                alt="Neat pet pantry with artisan provisions, amber bottles and stoneware containers"
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 42vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent flex flex-col justify-end p-4 sm:p-6 text-white">
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                  Stress-Free Kitchens
                </span>
                <p className="font-serif text-base sm:text-lg font-medium mt-1 text-balance">
                  &ldquo;We haven’t made a frantic late-night pet store run in two years.&rdquo;
                </p>
                <p className="text-[11px] text-stone-300 mt-1">
                  — Marcus & Jasper, Northwest Portland
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
