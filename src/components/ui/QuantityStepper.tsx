'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  productName?: string;
  className?: string;
}

export function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 99,
  size = 'sm',
  productName,
  className,
}: QuantityStepperProps) {
  const isSm = size === 'sm';

  return (
    <div
      role="group"
      aria-label={productName ? `Quantity for ${productName}` : 'Quantity selector'}
      className={cn(
        'inline-flex items-center border border-stone-200 bg-white rounded-xs select-none min-h-[44px]',
        isSm ? 'text-xs' : 'text-sm',
        className
      )}
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className={cn(
          'flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer relative touch-manipulation w-11 min-w-[44px] h-full min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-inset'
        )}
        aria-label={productName ? `Decrease quantity for ${productName}` : 'Decrease quantity'}
      >
        <Minus className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
      </button>

      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Quantity: ${quantity}`}
        className={cn(
          'font-mono tabular-nums text-center font-medium text-stone-900 flex items-center justify-center',
          isSm ? 'w-8' : 'w-10'
        )}
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className={cn(
          'flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer relative touch-manipulation w-11 min-w-[44px] h-full min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-inset'
        )}
        aria-label={productName ? `Increase quantity for ${productName}` : 'Increase quantity'}
      >
        <Plus className={isSm ? 'w-3.5 h-3.5' : 'w-4 h-4'} aria-hidden="true" />
      </button>
    </div>
  );
}
