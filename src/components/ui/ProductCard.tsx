'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Repeat, Plus, Check } from 'lucide-react';
import { Product, ProductVariant, ProductCadence } from '../../types/product';
import { useCart } from '../../providers/CartProvider';
import { formatCurrency, cn } from '../../lib/utils';
import { CADENCE_OPTIONS } from '../../lib/constants';
import { subscriptionService } from '../../services/subscriptionService';
import { Price } from './Price';
import { Button } from './Button';

export interface ProductCardProps {
  product: Product;
  variantLayout?: 'grid' | 'compact' | 'horizontal';
  onQuickView?: (product: Product) => void;
  className?: string;
}

export function ProductCard({
  product,
  variantLayout = 'grid',
  onQuickView,
  className,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants?.[0] || {
      id: 'default',
      name: 'Standard',
      sizeOrWeight: product.unitMeasurement,
      sku: 'SKU',
      price: product.basePrice,
      inStock: true,
      inventoryCount: 10,
    }
  );

  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>(
    product.subscription.eligible ? 'subscription' : 'one-time'
  );
  const [selectedCadence, setSelectedCadence] = useState<ProductCadence>(
    product.subscription.defaultCadence || '4-weeks'
  );
  const [addedNotice, setAddedNotice] = useState(false);

  const discountPercent = product.subscription.discountPercentage || 10;
  const currentPrice = selectedVariant.price;
  const subPrice = subscriptionService.calculateSubscriptionPriceSync(
    currentPrice,
    discountPercent
  );

  const handleAdd = () => {
    addItem(product, {
      variantId: selectedVariant.id,
      quantity: 1,
      purchaseType,
      cadence: purchaseType === 'subscription' ? selectedCadence : undefined,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1400);
  };

  // Compact horizontal layout (for shelves / drawer / quick reorder)
  if (variantLayout === 'compact' || variantLayout === 'horizontal') {
    return (
      <article
        className={cn(
          'flex items-center gap-3 p-3 bg-white border border-stone-200/90 rounded-xs hover:border-stone-400 transition-colors',
          className
        )}
      >
        <div
          className="relative w-16 h-16 sm:w-20 sm:h-20 bg-stone-100 rounded-xs overflow-hidden shrink-0 cursor-pointer"
          onClick={() => onQuickView?.(product)}
        >
          {product.primaryImage ? (
            <Image
              src={product.primaryImage}
              alt={product.name}
              fill
              loading="lazy"
              sizes="80px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-stone-200" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[10px] text-stone-500 uppercase tracking-wider">
            <span>{product.brand}</span>
            <span>·</span>
            <span>{product.categoryName}</span>
          </div>

          <h4
            className="text-xs sm:text-sm font-medium text-stone-900 truncate cursor-pointer hover:underline"
            onClick={() => onQuickView?.(product)}
          >
            {product.name}
          </h4>

          <div className="mt-1 flex items-baseline gap-2">
            <Price
              price={currentPrice}
              subscriptionPrice={purchaseType === 'subscription' ? subPrice : undefined}
              size="sm"
              showSavings={false}
            />
            {product.subscription.eligible && (
              <span className="text-[10px] text-emerald-800 font-mono">
                Auto-Ship Save {discountPercent}%
              </span>
            )}
          </div>
        </div>

        <div className="shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            {addedNotice ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Plus className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </article>
    );
  }

  // Standard editorial grid layout
  return (
    <article
      className={cn(
        'group flex flex-col bg-white border border-stone-200/90 rounded-xs overflow-hidden hover:border-stone-400/80 transition-colors',
        className
      )}
    >
      {/* Visual Image field */}
      <div
        className="relative aspect-4/3 bg-stone-100/70 overflow-hidden cursor-pointer"
        onClick={() => onQuickView?.(product)}
      >
        {product.primaryImage ? (
          <Image
            src={product.primaryImage}
            alt={product.name}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
            Provisions Photo
          </div>
        )}

        {/* Quick view button overlay */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView?.(product);
          }}
          aria-label={`Quick view ${product.name}`}
          className="absolute bottom-2 right-2 text-[11px] font-medium bg-white/95 text-stone-800 px-2.5 py-1 border border-stone-200 rounded-xs opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity shadow-xs cursor-pointer hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-stone-900 outline-none"
        >
          Quick Look
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata: Zero-pill inline text */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 mb-1.5">
            <span className="font-semibold text-stone-700">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span>{product.categoryName}</span>
            {product.isQuickReorderCandidate && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[10px] font-mono text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded-xs">
                  Reorder Staple
                </span>
              </>
            )}
          </div>

          <h3 className="font-serif text-base sm:text-lg text-stone-900 font-normal leading-snug group-hover:text-stone-700 transition-colors">
            <Link href={`/products/${product.slug}`} className="hover:underline">
              {product.name}
            </Link>
          </h3>

          <p className="mt-1 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Size or Variant Options */}
          {product.variants && product.variants.length > 1 && (
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
              <span className="text-[11px] text-stone-400 font-mono">Format:</span>
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={cn(
                    'text-[11px] font-mono px-2 py-0.5 rounded-xs border transition-colors cursor-pointer',
                    selectedVariant.id === v.id
                      ? 'border-stone-900 bg-stone-900 text-white font-medium'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300'
                  )}
                >
                  {v.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pricing & Auto-ship controls */}
        <div className="mt-4 pt-3 border-t border-stone-100">
          {product.subscription.eligible ? (
            <div className="space-y-2 mb-3">
              {/* Subscription availability label with supporting icon & text - not color alone */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-stone-600">Option:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-950 bg-emerald-100/90 px-1.5 py-0.5 rounded-xs border border-emerald-300">
                  <Repeat className="w-3 h-3 text-emerald-800" aria-hidden="true" />
                  <span>Subscription available · Save {discountPercent}%</span>
                </span>
              </div>

              <div
                className="grid grid-cols-2 gap-1 p-0.5 bg-stone-100 rounded-xs text-[11px]"
                role="radiogroup"
                aria-label={`Purchase options for ${product.name}`}
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={purchaseType === 'subscription'}
                  onClick={() => setPurchaseType('subscription')}
                  className={cn(
                    'py-1 px-1.5 text-center font-medium rounded-xs transition-colors cursor-pointer min-h-[36px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-900 focus-visible:ring-offset-1 outline-none',
                    purchaseType === 'subscription'
                      ? 'bg-white text-emerald-950 font-bold shadow-xs border border-emerald-300'
                      : 'text-stone-600 hover:text-stone-900'
                  )}
                  aria-label={`Auto-Ship subscription: ${formatCurrency(subPrice)}, saving ${discountPercent}% off regular price ${formatCurrency(currentPrice)}`}
                >
                  Auto-Ship (-{discountPercent}%)
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={purchaseType === 'one-time'}
                  onClick={() => setPurchaseType('one-time')}
                  className={cn(
                    'py-1 px-1.5 text-center font-medium rounded-xs transition-colors cursor-pointer min-h-[36px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none',
                    purchaseType === 'one-time'
                      ? 'bg-white text-stone-900 font-bold shadow-xs border border-stone-300'
                      : 'text-stone-600 hover:text-stone-900'
                  )}
                  aria-label={`One-Time delivery: ${formatCurrency(currentPrice)}`}
                >
                  One-Time
                </button>
              </div>

              {/* Price display based on mode */}
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="sr-only">
                      {purchaseType === 'subscription'
                        ? `Recurring subscription price: ${formatCurrency(subPrice)}. Original price: ${formatCurrency(currentPrice)}, saving ${discountPercent} percent. Frequency: every ${CADENCE_OPTIONS[selectedCadence]?.label || selectedCadence}.`
                        : `One-time purchase price: ${formatCurrency(currentPrice)}.`}
                    </span>
                    <span className="font-mono text-base font-semibold text-stone-900 tabular-nums" aria-hidden="true">
                      {formatCurrency(purchaseType === 'subscription' ? subPrice : currentPrice)}
                    </span>
                    {purchaseType === 'subscription' && (
                      <span className="font-mono text-xs text-stone-400 line-through tabular-nums" aria-hidden="true">
                        {formatCurrency(currentPrice)}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500 block" aria-hidden="true">
                    {purchaseType === 'subscription'
                      ? `Delivered every ${CADENCE_OPTIONS[selectedCadence]?.shortLabel || selectedCadence}`
                      : 'Single shipment'}
                  </span>
                </div>

                {purchaseType === 'subscription' && (
                  <div>
                    <label htmlFor={`cadence-select-${product.id}`} className="sr-only">
                      Select delivery frequency for {product.name}
                    </label>
                    <select
                      id={`cadence-select-${product.id}`}
                      value={selectedCadence}
                      onChange={(e) => setSelectedCadence(e.target.value as ProductCadence)}
                      className="text-[11px] bg-white border border-stone-300 rounded-xs px-2 py-1 text-stone-800 focus-visible:ring-2 focus-visible:ring-stone-900 focus:outline-none cursor-pointer min-h-[32px]"
                      aria-label={`Delivery frequency for ${product.name}`}
                    >
                      {product.subscription.cadenceOptions.map((c) => (
                        <option key={c} value={c}>
                          {CADENCE_OPTIONS[c]?.shortLabel || c}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <div className="flex items-baseline gap-2">
                <span className="sr-only">
                  Price: {formatCurrency(currentPrice)}
                  {selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > currentPrice
                    ? `, was ${formatCurrency(selectedVariant.compareAtPrice)}`
                    : ''}
                </span>
                <span className="font-mono text-base font-semibold text-stone-900 tabular-nums" aria-hidden="true">
                  {formatCurrency(currentPrice)}
                </span>
                {selectedVariant.compareAtPrice && selectedVariant.compareAtPrice > currentPrice && (
                  <span className="font-mono text-xs text-stone-400 line-through tabular-nums" aria-hidden="true">
                    {formatCurrency(selectedVariant.compareAtPrice)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-stone-500 block">
                Single delivery · {selectedVariant.sizeOrWeight}
              </span>
            </div>
          )}

          <Button
            variant="primary"
            onClick={handleAdd}
            className="w-full"
            leftIcon={
              addedNotice ? (
                <Check className="w-3.5 h-3.5" />
              ) : purchaseType === 'subscription' ? (
                <Repeat className="w-3.5 h-3.5" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )
            }
          >
            {addedNotice
              ? 'Added to Basket'
              : purchaseType === 'subscription'
              ? `Subscribe & Save ${discountPercent}%`
              : 'Add to Basket'}
          </Button>
        </div>
      </div>
    </article>
  );
}
