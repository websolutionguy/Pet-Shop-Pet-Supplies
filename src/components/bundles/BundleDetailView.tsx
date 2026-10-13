'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  Repeat,
  Sparkles,
  Check,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  Layers,
  Heart,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { CuratedBundle } from '../../types/bundle';
import { ProductCadence } from '../../types/product';
import { bundleService } from '../../services/bundleService';
import { useCart } from '../../providers/CartProvider';
import { usePetProfile } from '../../providers/PetProfileProvider';
import { formatCurrency, formatCadenceLabel } from '../../lib/utils';
import { Button } from '../ui/Button';

interface BundleDetailViewProps {
  bundle: CuratedBundle;
}

export function BundleDetailView({ bundle }: BundleDetailViewProps) {
  const { addMultipleItems } = useCart();
  const { pets, selectedPet } = usePetProfile();

  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>(
    bundle.subscriptionEligible ? 'subscription' : 'one-time'
  );
  const [cadence, setCadence] = useState<ProductCadence>(bundle.defaultCadence || '4-weeks');
  const [targetPetName, setTargetPetName] = useState<string>(selectedPet?.name || '');
  const [isAdding, setIsAdding] = useState(false);

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

  return (
    <div className="space-y-10">
      {/* Back Link Breadcrumb */}
      <div>
        <Link
          href="/bundles"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Curated Bundles</span>
        </Link>
      </div>

      {/* Main Two-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Editorial Overview & Included Products Dossier */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Header Card */}
          <div className="bg-white border border-stone-200/90 rounded-xs p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {bundle.badge && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-900 text-stone-100 rounded-xs text-[10px] font-mono uppercase tracking-widest font-semibold">
                  <Layers className="w-3 h-3 text-emerald-400" />
                  <span>{bundle.badge}</span>
                </span>
              )}

              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-stone-200 text-stone-700 rounded-xs">
                {bundle.petType === 'dogs' ? 'Canine Care' : bundle.petType === 'cats' ? 'Feline Care' : bundle.petType === 'small-pets' ? 'Small Herbivore' : 'Household'}
              </span>

              {bundle.discountPercentage > 0 && (
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs border border-emerald-300">
                  Save {bundle.discountPercentage}% as Bundle
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 tracking-tight leading-tight">
              {bundle.name}
            </h1>

            <p className="text-sm font-mono text-emerald-900 uppercase tracking-wider font-semibold">
              {bundle.tagline}
            </p>

            <blockquote className="p-4 bg-stone-50 border-l-3 border-emerald-800 rounded-xs text-xs text-stone-700 leading-relaxed italic">
              &ldquo;{bundle.editorialCuratorNotes}&rdquo;
            </blockquote>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {bundle.description}
            </p>
          </div>

          {/* Itemized Products Dossier */}
          <div className="bg-white border border-stone-200/90 rounded-xs p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h2 className="font-serif text-lg font-semibold text-stone-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-800" />
                <span>What’s Enclosed in This Set ({bundle.products.length} Provisions)</span>
              </h2>

              <span className="text-xs font-mono text-stone-500">
                Individual MSRP sum: <strong className="text-stone-900">{formatCurrency(bundle.individualTotal)}</strong>
              </span>
            </div>

            <div className="space-y-6 divide-y divide-stone-100">
              {bundle.products.map((product, idx) => (
                <div key={`${product.id}-${idx}`} className="pt-6 first:pt-0 flex flex-col sm:flex-row gap-5 items-start">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200">
                    {product.primaryImage ? (
                      <Image
                        src={product.primaryImage}
                        alt={product.name}
                        fill
                        loading="lazy"
                        sizes="96px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                          {product.brand} · {product.categoryName}
                        </span>
                        <Link
                          href={`/products/${product.slug}`}
                          className="font-serif text-base font-semibold text-stone-900 hover:text-stone-700 transition-colors"
                        >
                          {product.name}
                        </Link>
                        <span className="block text-[11px] text-stone-500 font-mono mt-0.5">
                          Package Format: {product.unitMeasurement}
                        </span>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="font-mono text-sm font-bold text-stone-900 tabular-nums">
                          {formatCurrency(product.basePrice)}
                        </span>
                        <span className="block text-[10px] text-stone-400 font-mono">
                          Standard MSRP
                        </span>
                      </div>
                    </div>

                    <p className="text-stone-600 leading-relaxed text-xs">
                      {product.shortDescription}
                    </p>

                    {product.keyBenefits && product.keyBenefits.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {product.keyBenefits.map((b, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-stone-50 border border-stone-200 rounded-xs text-[10px] font-mono text-stone-700"
                          >
                            ✓ {b}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Purchase Configurator Sticky */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 sticky top-20">
          <div className="bg-white border border-stone-200/90 rounded-xs p-6 shadow-xs space-y-5">
            <div className="pb-3 border-b border-stone-200">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                Regimen Options
              </span>
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Configure Set Delivery
              </h3>
            </div>

            {/* Purchase Type Radios */}
            <div className="space-y-3">
              {/* One-Time */}
              <label
                className={`p-3.5 border rounded-xs cursor-pointer block transition-all ${
                  purchaseType === 'one-time'
                    ? 'border-stone-900 bg-white shadow-xs ring-1 ring-stone-900'
                    : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="bundle-purchase-type-detail"
                      value="one-time"
                      checked={purchaseType === 'one-time'}
                      onChange={() => setPurchaseType('one-time')}
                      className="accent-stone-900"
                    />
                    <span className="font-semibold text-xs text-stone-900">One-Time Delivery</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-stone-900 tabular-nums">
                    {formatCurrency(bundle.bundlePrice)}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1 pl-5">
                  Single delivery of all enclosed provisions. No recurring commitment.
                </p>
              </label>

              {/* Auto-Ship */}
              {bundle.subscriptionEligible && (
                <label
                  className={`p-3.5 border rounded-xs cursor-pointer block transition-all ${
                    purchaseType === 'subscription'
                      ? 'border-emerald-800 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-800'
                      : 'border-stone-200 bg-stone-50 hover:bg-white text-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="bundle-purchase-type-detail"
                        value="subscription"
                        checked={purchaseType === 'subscription'}
                        onChange={() => setPurchaseType('subscription')}
                        className="accent-emerald-900"
                      />
                      <span className="font-semibold text-xs text-emerald-950 flex items-center gap-1">
                        <Repeat className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Steady Auto-Ship</span>
                      </span>
                    </div>
                    <span className="font-mono font-bold text-xs text-emerald-900 tabular-nums">
                      {formatCurrency(pricing.subscriptionPrice)}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80 mt-1 pl-5">
                    Save extra {pricing.subscriptionDiscountPercentage}%. Pause, skip, or cancel anytime.
                  </p>
                </label>
              )}
            </div>

            {/* Cadence Selector if Subscription */}
            {purchaseType === 'subscription' && (
              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xs space-y-2 text-xs font-mono">
                <span className="text-emerald-950 font-semibold block flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Delivery Cadence:</span>
                </span>
                <select
                  value={cadence}
                  onChange={(e) => setCadence(e.target.value as ProductCadence)}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-xs text-xs font-mono text-emerald-950 focus:outline-none"
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
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xs space-y-2 text-xs font-mono">
                <span className="text-stone-700 font-semibold block flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Assign to Companion:</span>
                </span>
                <select
                  value={targetPetName}
                  onChange={(e) => setTargetPetName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xs text-xs font-mono text-stone-800 focus:outline-none"
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

            {/* Mathematical Summary Breakdown */}
            <div className="pt-3 border-t border-stone-200 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-stone-600">
                <span>Individual MSRP Total</span>
                <span className="line-through">{formatCurrency(bundle.individualTotal)}</span>
              </div>

              {bundle.bundleSavings > 0 && (
                <div className="flex items-center justify-between text-emerald-800 font-medium">
                  <span>Bundled Set Discount</span>
                  <span>-{formatCurrency(bundle.bundleSavings)}</span>
                </div>
              )}

              {purchaseType === 'subscription' && (
                <div className="flex items-center justify-between text-emerald-800 font-medium">
                  <span>Auto-Ship Savings (10%)</span>
                  <span>-{formatCurrency(pricing.subscriptionSavings)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between text-stone-900">
                <div>
                  <span className="font-serif text-base font-semibold block">
                    Total
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {purchaseType === 'subscription' ? 'Per Recurring Cycle' : 'One-Time Delivery'}
                  </span>
                </div>
                <span className="font-mono text-2xl font-bold tabular-nums">
                  {formatCurrency(pricing.finalPrice)}
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <Button
              variant="primary"
              size="lg"
              disabled={isAdding}
              onClick={handleAddBundleToCart}
              className="w-full py-3 font-semibold text-xs tracking-wider"
            >
              {isAdding ? 'Adding Provisions...' : 'Add Complete Set to Basket'}
            </Button>

            <div className="pt-2 text-[11px] font-mono text-stone-500 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Small-batch packed in Portland depot</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600">
                <Truck className="w-3.5 h-3.5" />
                <span>Free courier shipping on orders over $49</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
