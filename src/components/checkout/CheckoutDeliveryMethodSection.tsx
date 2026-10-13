'use client';

import React from 'react';
import { Truck, Zap, Leaf, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { DELIVERY_METHODS, DeliveryMethodId, cartService } from '../../services/cartService';
import { useCart } from '../../providers/CartProvider';
import { formatCurrency, cn } from '../../lib/utils';

interface CheckoutDeliveryMethodSectionProps {
  selectedMethod: DeliveryMethodId;
  onSelectMethod: (method: DeliveryMethodId) => void;
}

export function CheckoutDeliveryMethodSection({
  selectedMethod,
  onSelectMethod,
}: CheckoutDeliveryMethodSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const { summary, items } = useCart();
  const netSubtotal = Math.max(
    0,
    summary.productSubtotal - summary.subscriptionSavings - (summary.promotionDiscount || 0)
  );

  return (
    <section
      aria-labelledby="section-delivery-heading"
      className="p-5 sm:p-6 bg-white border border-stone-200/90 rounded-xs shadow-xs"
    >
      <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
        <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-mono font-semibold">
          3
        </span>
        <h2 id="section-delivery-heading" className="font-serif text-lg font-semibold text-stone-900">
          Delivery Method
        </h2>
      </div>

      <div className="mt-5 space-y-3" role="radiogroup" aria-labelledby="section-delivery-heading">
        {DELIVERY_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          const inputId = `delivery-method-${method.id}`;
          const { shippingFee, qualifiesForFreeShipping } = cartService.calculateShipping(
            netSubtotal,
            summary.itemCount,
            summary.appliedPromoCode === 'FREESHIP49',
            method.id
          );

          const feeText = qualifiesForFreeShipping && method.id !== 'express' ? 'Free' : formatCurrency(shippingFee);

          return (
            <label
              key={method.id}
              htmlFor={inputId}
              className={cn(
                'flex items-start justify-between p-4 border rounded-xs cursor-pointer transition-colors relative overflow-hidden focus-within:ring-2 focus-within:ring-stone-900 focus-within:ring-offset-2 outline-none',
                isSelected
                  ? 'border-emerald-900 ring-1 ring-emerald-900 font-medium bg-emerald-50/20'
                  : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 text-stone-700'
              )}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeDeliveryMethodPill"
                  className="absolute inset-0 bg-emerald-50/60 pointer-events-none -z-0"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 380, damping: 32 }
                  }
                />
              )}

              <div className="relative z-10 flex items-start gap-3">
                <input
                  id={inputId}
                  type="radio"
                  name="delivery-method"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => onSelectMethod(method.id)}
                  className="accent-emerald-900 mt-1 cursor-pointer w-4 h-4"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-serif font-semibold text-stone-900">
                      {method.name}
                    </span>
                    {method.id === 'carbon-neutral' && (
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded-xs font-bold border border-emerald-200">
                        Most Sustainable
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">{method.description}</p>
                  <p className="text-[11px] font-mono text-stone-500 mt-1">
                    Transit speed: {method.timeframe}
                  </p>
                </div>
              </div>

              <div className="relative z-10 text-right shrink-0">
                <span className="sr-only">
                  Delivery cost: {feeText}. Estimated transit: {method.timeframe}.
                </span>
                <span className="font-mono text-xs font-semibold text-stone-900 block" aria-hidden="true">
                  {feeText}
                </span>
                {qualifiesForFreeShipping && method.id !== 'express' && (
                  <span className="text-[10px] font-mono text-emerald-800" aria-hidden="true">
                    Order &gt; $49
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </section>
  );
}
