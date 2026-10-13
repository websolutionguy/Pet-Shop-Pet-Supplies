'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  Repeat,
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Heart,
  Calendar,
  Layers,
} from 'lucide-react';
import { CuratedBundle } from '../../types/bundle';
import { ProductCadence } from '../../types/product';
import { bundleService } from '../../services/bundleService';
import { useCart } from '../../providers/CartProvider';
import { usePetProfile } from '../../providers/PetProfileProvider';
import { formatCurrency, formatCadenceLabel } from '../../lib/utils';
import { Button } from '../ui/Button';

interface BundleCardEditorialProps {
  bundle: CuratedBundle;
  alternateLayout?: boolean;
}

export function BundleCardEditorial({
  bundle,
  alternateLayout = false,
}: BundleCardEditorialProps) {
  const { addMultipleItems } = useCart();
  const { pets, selectedPet } = usePetProfile();

  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>(
    bundle.subscriptionEligible ? 'subscription' : 'one-time'
  );
  const [cadence, setCadence] = useState<ProductCadence>(bundle.defaultCadence || '4-weeks');
  const [targetPetName, setTargetPetName] = useState<string>(selectedPet?.name || '');
  const [isAdding, setIsAdding] = useState(false);

  // Accurate pricing calculations via bundleService
  const pricing = bundleService.calculateBundlePrice(bundle, purchaseType, cadence);

  const handleAddBundleToCart = () => {
    setIsAdding(true);
    try {
      const itemsToAdd = bundle.products.map((product) => ({
        product,
        options: {
          purchaseType: purchaseType,
          cadence: purchaseType === 'subscription' ? cadence : undefined,
          quantity: 1,
          variantId: product.variants?.[0]?.id,
          targetPetName: targetPetName || undefined,
        },
      }));

      addMultipleItems(itemsToAdd);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const primaryImage =
    bundle.images?.[0] ||
    bundle.products[0]?.primaryImage ||
    '/src/assets/images/hero_dog_natural_1790396014202.jpg';

  return (
    <article
      id={`bundle-${bundle.slug}`}
      className="bg-white border border-stone-200/90 rounded-xs shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Visual & Editorial Column */}
        <div className={`lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 ${
          alternateLayout ? 'lg:order-2 lg:border-l border-stone-200' : 'lg:border-r border-stone-200'
        } bg-[#FAF9F6]`}>
          <div className="space-y-4">
            {/* Header Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {bundle.badge && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-900 text-stone-100 rounded-xs text-[10px] font-mono uppercase tracking-widest font-semibold">
                  <Layers className="w-3 h-3 text-emerald-400" />
                  <span>{bundle.badge}</span>
                </span>
              )}

              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-stone-200 text-stone-700 rounded-xs">
                {bundle.petType === 'dogs' ? 'Canine' : bundle.petType === 'cats' ? 'Feline' : bundle.petType === 'small-pets' ? 'Small Herbivore' : 'Household'}
              </span>

              {bundle.discountPercentage > 0 && (
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs border border-emerald-300">
                  Save {bundle.discountPercentage}% as Bundle
                </span>
              )}
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 tracking-tight leading-tight">
                {bundle.name}
              </h2>
              <p className="text-xs font-mono text-emerald-900 mt-1 uppercase tracking-wider font-medium">
                {bundle.tagline}
              </p>
            </div>

            {/* Editorial Curator Note */}
            <blockquote className="p-3.5 bg-white border-l-2 border-emerald-800 rounded-xs text-xs text-stone-700 leading-relaxed italic">
              &ldquo;{bundle.editorialCuratorNotes}&rdquo;
            </blockquote>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {bundle.description}
            </p>
          </div>

          <div className="pt-6">
            <Link
              href={`/bundles/${bundle.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-800 hover:text-stone-950 font-semibold underline underline-offset-4"
            >
              <span>Explore In-Depth Bundle Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Products Included & Pricing Workspace */}
        <div className={`lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between ${
          alternateLayout ? 'lg:order-1' : ''
        }`}>
          {/* Section 1: Products Included */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif text-base font-semibold text-stone-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-800" />
                <span>Enclosed Provisions ({bundle.products.length})</span>
              </h3>
              <span className="text-[11px] font-mono text-stone-500">
                Individual MSRP sum: <strong className="text-stone-800">{formatCurrency(bundle.individualTotal)}</strong>
              </span>
            </div>

            <div className="space-y-2.5">
              {bundle.products.map((product, idx) => (
                <div
                  key={`${product.id}-${idx}`}
                  className="p-3 bg-stone-50 border border-stone-200/80 rounded-xs flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-xs bg-stone-200 overflow-hidden shrink-0 border border-stone-300">
                      {product.primaryImage ? (
                        <Image
                          src={product.primaryImage}
                          alt={product.name}
                          fill
                          loading="lazy"
                          sizes="40px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                          <Package className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block truncate">
                        {product.brand}
                      </span>
                      <Link
                        href={`/products/${product.slug}`}
                        className="font-serif font-medium text-stone-900 hover:text-stone-700 truncate block text-xs"
                      >
                        {product.name}
                      </Link>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {product.unitMeasurement}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-xs text-stone-700">
                    <span>{formatCurrency(product.basePrice)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Purchase Configuration (One-Time vs Auto-Ship) */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xs space-y-4 text-xs">
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-stone-800 block">
              Purchase Preference
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: One-Time Purchase */}
              <label
                className={`p-3 border rounded-xs cursor-pointer flex flex-col justify-between space-y-2 transition-all ${
                  purchaseType === 'one-time'
                    ? 'border-stone-900 bg-white shadow-xs'
                    : 'border-stone-200 bg-stone-50/50 hover:bg-white text-stone-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`purchase-type-${bundle.id}`}
                      value="one-time"
                      checked={purchaseType === 'one-time'}
                      onChange={() => setPurchaseType('one-time')}
                      className="accent-stone-900"
                    />
                    <span className="font-semibold text-stone-900">One-Time Set</span>
                  </div>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    {formatCurrency(bundle.bundlePrice)}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 leading-snug">
                  Single delivery of all enclosed provisions. Zero recurring schedule.
                </p>
              </label>

              {/* Option B: Steady Auto-Ship */}
              {bundle.subscriptionEligible && (
                <label
                  className={`p-3 border rounded-xs cursor-pointer flex flex-col justify-between space-y-2 transition-all ${
                    purchaseType === 'subscription'
                      ? 'border-emerald-800 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-800/20'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-white text-stone-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`purchase-type-${bundle.id}`}
                        value="subscription"
                        checked={purchaseType === 'subscription'}
                        onChange={() => setPurchaseType('subscription')}
                        className="accent-emerald-900"
                      />
                      <span className="font-semibold text-emerald-950 flex items-center gap-1">
                        <Repeat className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Steady Auto-Ship</span>
                      </span>
                    </div>
                    <span className="font-mono font-bold text-emerald-900 tabular-nums">
                      {formatCurrency(pricing.subscriptionPrice)}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80 leading-snug">
                    Save extra {pricing.subscriptionDiscountPercentage}%. Pause, skip, or cancel anytime.
                  </p>
                </label>
              )}
            </div>

            {/* Cadence Selector if Subscription is Active */}
            {purchaseType === 'subscription' && (
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-t border-emerald-200/80 font-mono">
                <span className="text-stone-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Replenishment Rhythm:</span>
                </span>

                <select
                  value={cadence}
                  onChange={(e) => setCadence(e.target.value as ProductCadence)}
                  className="px-3 py-1.5 bg-white border border-emerald-300 rounded-xs text-xs font-mono text-emerald-950 focus:outline-none"
                >
                  {(bundle.supportedCadences || ['2-weeks', '4-weeks', '6-weeks', '8-weeks']).map((c) => (
                    <option key={c} value={c}>
                      {formatCadenceLabel(c)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Optional Companion Assignment */}
            {pets.length > 0 && (
              <div className="pt-2 flex items-center justify-between gap-3 text-xs border-t border-stone-200 font-mono">
                <span className="text-stone-600 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Assign to Companion:</span>
                </span>

                <select
                  value={targetPetName}
                  onChange={(e) => setTargetPetName(e.target.value)}
                  className="px-3 py-1 bg-white border border-stone-300 rounded-xs text-xs font-mono text-stone-800 focus:outline-none"
                >
                  <option value="">No preference</option>
                  {pets.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.species})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Section 3: Financial Summary & Add to Cart */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
                  {formatCurrency(pricing.finalPrice)}
                </span>
                {pricing.totalSavings > 0 && (
                  <span className="text-xs font-mono text-emerald-800 font-semibold">
                    (Save {formatCurrency(pricing.totalSavings)})
                  </span>
                )}
              </div>

              <div className="text-[11px] font-mono text-stone-500">
                Individual MSRP total: <span className="line-through">{formatCurrency(bundle.individualTotal)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              disabled={isAdding}
              onClick={handleAddBundleToCart}
              className="w-full sm:w-auto px-6 py-2.5 font-semibold text-xs tracking-wider"
            >
              {isAdding ? 'Adding Provisions...' : 'Add Complete Set to Basket'}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
