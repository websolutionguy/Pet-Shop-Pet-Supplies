'use client';

import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { formatCurrency, cn } from '../../lib/utils';
import { SubscriptionPriceCalculation } from '../../types/subscription';

interface SubscriptionPriceProps {
  calculation: SubscriptionPriceCalculation;
  purchaseType?: 'one-time' | 'subscription';
  size?: 'sm' | 'md' | 'lg';
  showSavingsBadge?: boolean;
  className?: string;
}

export function SubscriptionPrice({
  calculation,
  purchaseType = 'subscription',
  size = 'md',
  showSavingsBadge = true,
  className,
}: SubscriptionPriceProps) {
  const shouldReduceMotion = useReducedMotion();
  const isSubscription = purchaseType === 'subscription' && calculation.isEligible;
  const displayPrice = isSubscription
    ? calculation.subscriptionPrice
    : calculation.basePrice;

  const sizeClasses = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  };

  return (
    <div className={cn('inline-flex flex-col items-start', className)}>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            'font-mono font-bold text-stone-900 tabular-nums relative inline-block overflow-hidden',
            sizeClasses[size],
            isSubscription && 'text-emerald-950'
          )}
        >
          {/* Subtle animated numeric transition communicating price updates */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={displayPrice}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0.5, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0.5, y: 2 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.18, ease: 'easeOut' }
              }
              className="inline-block"
            >
              {formatCurrency(displayPrice)}
            </motion.span>
          </AnimatePresence>
        </span>

        {isSubscription && calculation.savings > 0 && (
          <span className="font-mono text-xs sm:text-sm text-stone-400 line-through tabular-nums">
            {formatCurrency(calculation.basePrice)}
          </span>
        )}

        {isSubscription && showSavingsBadge && calculation.discountPercentage > 0 && (
          <span className="text-[10px] font-mono font-bold uppercase text-emerald-900 bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 rounded-xs">
            Save {calculation.discountPercentage}%
          </span>
        )}
      </div>

      <span className="text-[11px] text-stone-500 font-sans mt-0.5">
        {isSubscription
          ? 'Guaranteed recurring member pricing'
          : 'Standard single-purchase price'}
      </span>
    </div>
  );
}
