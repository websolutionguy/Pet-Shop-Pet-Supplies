'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onChange?: (val: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

export function QuantitySelector({
  quantity,
  onIncrease,
  onDecrease,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
  disabled = false,
  className,
}: QuantitySelectorProps) {
  const isSm = size === 'sm';

  return (
    <div
      className={cn(
        'inline-flex items-center border border-stone-300 rounded-xs bg-white select-none',
        isSm ? 'min-h-[38px]' : 'min-h-[44px]',
        disabled && 'opacity-50 pointer-events-none bg-stone-50',
        className
      )}
      role="group"
      aria-label="Quantity adjustment"
    >
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min || disabled}
        className={cn(
          'flex items-center justify-center text-stone-600 hover:text-stone-950 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer relative touch-manipulation',
          isSm
            ? 'w-9 h-9 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px] after:absolute after:-inset-1'
            : 'w-11 h-11 min-w-[44px] min-h-[44px]'
        )}
        aria-label="Decrease quantity"
      >
        <Minus className={cn(isSm ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      </button>

      {onChange ? (
        <input
          type="number"
          min={min}
          max={max}
          value={quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= min && val <= max) {
              onChange(val);
            }
          }}
          className={cn(
            'text-center font-mono font-medium text-stone-900 border-x border-stone-200 focus:outline-none tabular-nums bg-transparent',
            isSm ? 'w-9 text-xs py-1 h-9' : 'w-11 text-sm py-1.5 h-11'
          )}
          aria-label="Current quantity"
        />
      ) : (
        <span
          className={cn(
            'flex items-center justify-center font-mono font-medium text-stone-900 border-x border-stone-200 tabular-nums',
            isSm ? 'w-9 text-xs h-9' : 'w-11 text-sm h-11'
          )}
        >
          {quantity}
        </span>
      )}

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max || disabled}
        className={cn(
          'flex items-center justify-center text-stone-600 hover:text-stone-950 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer relative touch-manipulation',
          isSm
            ? 'w-9 h-9 sm:w-8 sm:h-8 min-w-[36px] min-h-[36px] after:absolute after:-inset-1'
            : 'w-11 h-11 min-w-[44px] min-h-[44px]'
        )}
        aria-label="Increase quantity"
      >
        <Plus className={cn(isSm ? 'w-3 h-3' : 'w-3.5 h-3.5')} />
      </button>
    </div>
  );
}
