'use client';

import React, { useState } from 'react';
import { Plus, Minus, Check, Repeat, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '../../types/product';
import { SelectedSubscriptionBundleItem } from './SubscriptionBuilderTypes';
import { formatCurrency, cn } from '../../lib/utils';
import { subscriptionService } from '../../services/subscriptionService';
import { AppImage } from '../ui/AppImage';


interface SubscriptionItemCardProps {
  product: Product;
  selectedItem?: SelectedSubscriptionBundleItem;
  onUpdateItem: (variant: ProductVariant, quantity: number) => void;
  onRemoveItem: () => void;
}

export function SubscriptionItemCard({
  product,
  selectedItem,
  onUpdateItem,
  onRemoveItem,
}: SubscriptionItemCardProps) {
  const [activeVariant, setActiveVariant] = useState<ProductVariant>(
    selectedItem?.variant || product.variants[0]
  );

  const discountPercent = product.subscription.discountPercentage || 10;
  const currentPrice = activeVariant.price;
  const subPrice = subscriptionService.calculateSubscriptionPriceSync(
    currentPrice,
    discountPercent
  );

  const isSelected = Boolean(selectedItem);
  const currentQuantity = selectedItem?.quantity || 0;

  const handleVariantChange = (v: ProductVariant) => {
    setActiveVariant(v);
    if (isSelected) {
      onUpdateItem(v, currentQuantity);
    }
  };

  const handleAdd = () => {
    onUpdateItem(activeVariant, 1);
  };

  const handleIncrement = () => {
    onUpdateItem(activeVariant, Math.min(10, currentQuantity + 1));
  };

  const handleDecrement = () => {
    if (currentQuantity <= 1) {
      onRemoveItem();
    } else {
      onUpdateItem(activeVariant, currentQuantity - 1);
    }
  };

  return (
    <article
      className={cn(
        'bg-white border rounded-xs p-4 flex flex-col justify-between transition-all shadow-xs',
        isSelected
          ? 'border-emerald-800 ring-1 ring-emerald-800/80 bg-emerald-50/20'
          : 'border-stone-200 hover:border-stone-300'
      )}
    >
      <div>
        {/* Top Image + Status Badge */}
        <div className="relative aspect-4/3 bg-stone-100 rounded-xs overflow-hidden mb-3 border border-stone-200/80">
          {product.primaryImage ? (
            <AppImage
              src={product.primaryImage}
              alt={product.name}
              fill
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-103"
            />
          ) : (
            <div className="w-full h-full bg-stone-200" />
          )}

          <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
            <span className="font-mono text-[10px] text-emerald-950 font-bold bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-xs border border-emerald-300 shadow-xs flex items-center gap-1">
              <Repeat className="w-3 h-3 text-emerald-800" aria-hidden="true" />
              <span>Subscription available · Save {discountPercent}%</span>
            </span>
          </div>

          {isSelected && (
            <div className="absolute top-2 right-2 bg-emerald-800 text-white rounded-full p-1 shadow-sm" aria-label="Added to routine">
              <Check className="w-3.5 h-3.5 stroke-3" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Brand & Category Info */}
        <div className="text-[11px] text-stone-500 font-mono mb-1">
          <span>{product.brand}</span>
          <span className="mx-1" aria-hidden="true">·</span>
          <span>{product.categoryName}</span>
        </div>

        <h3 className="font-serif text-base font-normal text-stone-900 leading-snug mb-1">
          {product.name}
        </h3>

        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
          {product.shortDescription}
        </p>

        {/* Variants selector if available */}
        {product.variants.length > 1 && (
          <div className="mb-3">
            <label id={`format-label-${product.id}`} className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-1">
              Select Format:
            </label>
            <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-labelledby={`format-label-${product.id}`}>
              {product.variants.map((v) => {
                const isVariantActive = activeVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="radio"
                    aria-checked={isVariantActive}
                    onClick={() => handleVariantChange(v)}
                    className={cn(
                      'text-[11px] px-2.5 py-1 min-h-[36px] rounded-xs border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-900 outline-none',
                      isVariantActive
                        ? 'border-stone-900 bg-stone-900 text-white font-medium'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                    )}
                    aria-label={`${v.name}, price ${formatCurrency(v.price)}`}
                  >
                    {v.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Pricing & Action */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
        <div>
          <span className="sr-only">
            Subscription available. Recurring price: {formatCurrency(subPrice)}, regular price was {formatCurrency(currentPrice)}, saving {discountPercent} percent.
          </span>
          <div className="flex items-baseline gap-1.5" aria-hidden="true">
            <span className="font-mono text-base font-bold text-emerald-950 tabular-nums">
              {formatCurrency(subPrice)}
            </span>
            <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
              {formatCurrency(currentPrice)}
            </span>
          </div>
          <span className="text-[10px] text-stone-500 font-sans block" aria-hidden="true">
            recurring price per unit
          </span>
        </div>

        {/* Action: Add or Stepper */}
        {isSelected ? (
          <div className="flex items-center border border-emerald-800 rounded-xs bg-white shrink-0 min-h-[44px]">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer touch-manipulation focus-visible:ring-2 focus-visible:ring-stone-900 outline-none"
              aria-label={`Decrease quantity of ${product.name}, current quantity is ${currentQuantity}`}
            >
              <Minus className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <span className="w-8 text-center font-mono text-xs font-bold text-stone-900 tabular-nums" aria-live="polite">
              <span className="sr-only">Quantity: </span>{currentQuantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={currentQuantity >= 10}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-700 hover:bg-stone-100 disabled:opacity-30 cursor-pointer touch-manipulation focus-visible:ring-2 focus-visible:ring-stone-900 outline-none"
              aria-label={`Increase quantity of ${product.name}, current quantity is ${currentQuantity}`}
            >
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.name} to recurring routine for ${formatCurrency(subPrice)} per cycle`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] bg-stone-900 hover:bg-stone-800 text-white rounded-xs text-xs font-medium transition-colors cursor-pointer shadow-xs touch-manipulation focus-visible:ring-2 focus-visible:ring-stone-900 outline-none"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add to Routine</span>
          </button>
        )}
      </div>
    </article>
  );
}
