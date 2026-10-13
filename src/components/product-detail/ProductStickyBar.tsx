'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Repeat, Plus, Check } from 'lucide-react';
import { Product } from '../../types/product';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';

interface ProductStickyBarProps {
  product: Product;
  onAddToCart: () => void;
  price: number;
  isSubscription: boolean;
  addedNotice: boolean;
}

export function ProductStickyBar({
  product,
  onAddToCart,
  price,
  isSubscription,
  addedNotice,
}: ProductStickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling past top viewport hero (approx 450px)
      if (window.scrollY > 450) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <aside
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-lg px-3 sm:px-4 py-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] lg:hidden"
      aria-label="Quick Add to Basket"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-3">
        {/* Product preview */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="relative w-10 h-10 rounded-xs overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
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
              <div className="w-full h-full bg-stone-200" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-xs font-medium text-stone-900 truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                {formatCurrency(price)}
              </span>
              {isSubscription && (
                <span className="text-[10px] text-emerald-800 font-mono font-medium">
                  Auto-Ship (-10%)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Button: Minimum 44px touch target */}
        <div className="shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={onAddToCart}
            aria-label={
              addedNotice
                ? `Added ${product.name} to basket`
                : isSubscription
                ? `Subscribe to ${product.name} for ${formatCurrency(price)}`
                : `Add ${product.name} to basket for ${formatCurrency(price)}`
            }
            className="min-h-[44px] px-3.5 sm:px-4 text-xs font-semibold touch-manipulation shadow-xs"
            leftIcon={
              addedNotice ? (
                <Check className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />
              ) : isSubscription ? (
                <Repeat className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" />
              ) : (
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              )
            }
          >
            {addedNotice
              ? 'Added'
              : isSubscription
              ? 'Subscribe'
              : 'Add to Basket'}
          </Button>
        </div>
      </div>
    </aside>
  );
}
