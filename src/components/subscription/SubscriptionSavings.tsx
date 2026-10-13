'use client';

import React from 'react';
import { Sparkles, TrendingDown } from 'lucide-react';
import { formatCurrency, cn } from '../../lib/utils';
import { SubscriptionPriceCalculation } from '../../types/subscription';

interface SubscriptionSavingsProps {
  calculation: SubscriptionPriceCalculation;
  className?: string;
  variant?: 'inline' | 'card';
}

export function SubscriptionSavings({
  calculation,
  className,
  variant = 'card',
}: SubscriptionSavingsProps) {
  if (!calculation.isEligible || calculation.savings <= 0) {
    return null;
  }

  if (variant === 'inline') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs text-emerald-800 font-mono', className)}>
        <TrendingDown className="w-3.5 h-3.5 text-emerald-700" />
        <span>Save {formatCurrency(calculation.savings)} every cycle</span>
        {calculation.annualSavings > 0 && (
          <span className="text-stone-500 font-sans">
            (~{formatCurrency(calculation.annualSavings)}/yr)
          </span>
        )}
      </span>
    );
  }

  return (
    <div
      className={cn(
        'p-3 bg-emerald-50/70 border border-emerald-200/90 rounded-xs flex items-center justify-between gap-3 text-xs',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-emerald-800 shrink-0" />
        <div>
          <span className="font-semibold text-emerald-950 block">
            Auto-Ship Program Savings:
          </span>
          <span className="text-[11px] text-emerald-800">
            {calculation.discountPercentage}% off retail rate on every shipment
          </span>
        </div>
      </div>

      <div className="text-right shrink-0">
        <span className="font-mono font-bold text-emerald-950 block tabular-nums">
          Save {formatCurrency(calculation.savings)}/cycle
        </span>
        {calculation.annualSavings > 0 && (
          <span className="font-mono text-[10px] text-emerald-800 block tabular-nums">
            ~{formatCurrency(calculation.annualSavings)} saved per year
          </span>
        )}
      </div>
    </div>
  );
}
