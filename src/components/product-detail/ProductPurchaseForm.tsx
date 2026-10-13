'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Star,
  Repeat,
  Check,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Product, ProductVariant, ProductCadence } from '../../types/product';
import { SubscriptionPriceCalculation } from '../../types/subscription';
import { useCart } from '../../providers/CartProvider';
import { formatCurrency, cn } from '../../lib/utils';
import { CADENCE_OPTIONS, SUBSCRIPTION_DISCOUNT_PERCENT } from '../../lib/constants';
import { subscriptionService } from '../../services/subscriptionService';
import { SubscriptionSelector } from '../subscription/SubscriptionSelector';
import { Button } from '../ui/Button';

interface ProductPurchaseFormProps {
  product: Product;
  onAddedToCart?: () => void;
}

export function ProductPurchaseForm({
  product,
  onAddedToCart,
}: ProductPurchaseFormProps) {
  const shouldReduceMotion = useReducedMotion();
  const { addItem, openCart } = useCart();

  // Selected Variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants?.[0] || {
      id: 'default',
      name: 'Standard',
      sizeOrWeight: product.unitMeasurement,
      sku: 'SKU',
      price: product.basePrice,
      inStock: product.inStock,
      inventoryCount: 10,
    }
  );

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Purchase Type: 'one-time' or 'subscription'
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>(
    product.subscription.eligible ? 'subscription' : 'one-time'
  );

  // Cadence: default or first available
  const [selectedCadence, setSelectedCadence] = useState<ProductCadence>(
    product.subscription.defaultCadence || '4-weeks'
  );

  // Async & sync calculated subscription price structure
  const [calculation, setCalculation] = useState<SubscriptionPriceCalculation>(() => {
    return subscriptionService.calculatePriceSync(
      {
        productId: product.id,
        quantity,
        frequency: selectedCadence,
        variant: selectedVariant,
      },
      product
    );
  });

  const [addedNotice, setAddedNotice] = useState(false);

  // Update subscription price whenever variant, quantity, or cadence changes
  useEffect(() => {
    let isMounted = true;
    subscriptionService
      .calculatePrice({
        productId: product.id,
        quantity,
        frequency: selectedCadence,
        variant: selectedVariant,
      })
      .then((calc) => {
        if (isMounted) setCalculation(calc);
      });

    return () => {
      isMounted = false;
    };
  }, [product.id, quantity, selectedCadence, selectedVariant]);

  const oneTimeTotal = Number((selectedVariant.price * quantity).toFixed(2));
  const totalItemPrice =
    purchaseType === 'subscription' && calculation.isEligible
      ? calculation.subscriptionPrice
      : oneTimeTotal;

  // Handle Add To Basket
  const handleAddToCart = () => {
    addItem(product, {
      variantId: selectedVariant.id,
      quantity,
      purchaseType,
      cadence: purchaseType === 'subscription' ? selectedCadence : undefined,
    });

    setAddedNotice(true);
    onAddedToCart?.();
    setTimeout(() => {
      setAddedNotice(false);
      openCart();
    }, 450);
  };

  const availableCadences: ProductCadence[] =
    product.subscription.cadenceOptions && product.subscription.cadenceOptions.length > 0
      ? product.subscription.cadenceOptions
      : ['2-weeks', '4-weeks', '6-weeks', '8-weeks'];

  return (
    <div className="space-y-6">
      {/* Brand & Category Navigation */}
      <div>
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 uppercase tracking-wider font-mono">
          <Link
            href={`/shop?brand=${encodeURIComponent(product.brand)}`}
            className="hover:text-stone-900 transition-colors"
          >
            {product.brand}
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href={`/shop?category=${encodeURIComponent(product.categoryId)}`}
            className="hover:text-stone-900 transition-colors"
          >
            {product.categoryName}
          </Link>
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 tracking-tight leading-tight">
          {product.name}
        </h1>

        {/* Rating row & reviews anchor */}
        <div className="mt-2.5 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-amber-700">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-current text-amber-700"
                />
              ))}
            </div>
            <span className="font-bold text-stone-900 ml-1">
              {product.rating.toFixed(1)}
            </span>
          </div>

          <span className="text-stone-300">·</span>

          <a
            href="#reviews"
            className="text-stone-600 hover:text-stone-950 underline underline-offset-4 font-mono text-[11px]"
          >
            {product.reviewCount} pantry reviews
          </a>

          {product.isQuickReorderCandidate && (
            <>
              <span className="text-stone-300">·</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                <RotateCcw className="w-3 h-3 text-emerald-800" />
                Frequent Pantry Staple
              </span>
            </>
          )}
        </div>
      </div>

      {/* Short Summary */}
      <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
        {product.shortDescription}
      </p>

      {/* Format / Size Selector */}
      {product.variants && product.variants.length > 1 && (
        <div className="pt-2 border-t border-stone-200">
          <label id="format-selector-label" className="text-[11px] uppercase tracking-wider font-semibold text-stone-700 block mb-2 font-mono">
            Package Size / Format:
          </label>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            role="radiogroup"
            aria-labelledby="format-selector-label"
          >
            {product.variants.map((v) => {
              const isSelected = selectedVariant.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedVariant(v)}
                  className={cn(
                    'relative p-2.5 text-left border rounded-xs transition-colors cursor-pointer overflow-hidden focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 outline-none',
                    isSelected
                      ? 'border-stone-900 text-white shadow-xs font-medium'
                      : 'border-stone-200 bg-white hover:border-stone-400 text-stone-800'
                  )}
                  aria-label={`${v.name}, price: ${formatCurrency(v.price)}${isSelected ? ' (selected)' : ''}`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="activeVariantPill"
                      className="absolute inset-0 bg-stone-900 pointer-events-none -z-0"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 380, damping: 32 }
                      }
                    />
                  )}
                  <span
                    className={cn(
                      'relative z-10 font-medium text-xs block truncate',
                      isSelected ? 'text-white' : 'text-stone-900'
                    )}
                    aria-hidden="true"
                  >
                    {v.name}
                  </span>
                  <span
                    className={cn(
                      'relative z-10 font-mono text-[11px] block mt-0.5',
                      isSelected ? 'text-stone-300' : 'text-stone-600'
                    )}
                    aria-hidden="true"
                  >
                    {formatCurrency(v.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Subscription & Purchase Options via Phase 8 Engine */}
      <div className="pt-4 border-t border-stone-200">
        <SubscriptionSelector
          product={product}
          selectedVariant={selectedVariant}
          quantity={quantity}
          purchaseType={purchaseType}
          onPurchaseTypeChange={setPurchaseType}
          selectedCadence={selectedCadence}
          onCadenceChange={setSelectedCadence}
          calculation={calculation}
        />
      </div>

      {/* Quantity & Add to Basket Row */}
      <div className="pt-4 border-t border-stone-200 flex items-center gap-2.5 sm:gap-3">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-stone-300 rounded-xs bg-white shrink-0 min-h-[44px]">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer touch-manipulation focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none"
            aria-label={`Decrease quantity of ${product.name}, current quantity is ${quantity}`}
          >
            <Minus className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <span className="w-9 sm:w-10 text-center font-mono text-sm font-semibold text-stone-900 tabular-nums overflow-hidden" aria-live="polite" aria-atomic="true">
            <span className="sr-only">Quantity: </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={quantity}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0.5, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0.5, y: 2 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }}
                className="inline-block"
              >
                {quantity}
              </motion.span>
            </AnimatePresence>
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            disabled={quantity >= 10}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer touch-manipulation focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none"
            aria-label={`Increase quantity of ${product.name}, current quantity is ${quantity}`}
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="flex-1 min-w-0">
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            className="w-full text-xs sm:text-sm font-medium relative overflow-hidden min-h-[48px]"
            leftIcon={
              addedNotice ? (
                <motion.div
                  initial={shouldReduceMotion ? { scale: 1 } : { scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.18 }}
                >
                  <Check className="w-4 h-4 text-emerald-300" />
                </motion.div>
              ) : purchaseType === 'subscription' ? (
                <Repeat className="w-4 h-4 text-emerald-300" />
              ) : (
                <Plus className="w-4 h-4" />
              )
            }
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={addedNotice ? 'added' : 'cta'}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -2 }}
                transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.16 }}
              >
                {addedNotice
                  ? 'Added to Provision Basket!'
                  : purchaseType === 'subscription'
                  ? `Subscribe · ${formatCurrency(totalItemPrice)} (${CADENCE_OPTIONS[selectedCadence]?.shortLabel || '4-wk'})`
                  : `Add to Basket · ${formatCurrency(totalItemPrice)}`}
              </motion.span>
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Shipping & Local Dispatch Notice */}
      <div className="pt-2 text-xs text-stone-500 space-y-1 font-mono">
        <p className="flex items-center gap-1.5">
          <Truck className="w-3.5 h-3.5 text-stone-400" />
          <span>Free regional dispatch on orders over $49 · Portland Metro local courier available</span>
        </p>
      </div>
    </div>
  );
}
