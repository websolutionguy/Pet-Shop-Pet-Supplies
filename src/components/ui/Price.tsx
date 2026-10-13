import React from 'react';
import { cn, formatCurrency } from '../../lib/utils';

export interface PriceProps {
  price: number;
  compareAtPrice?: number;
  subscriptionPrice?: number;
  unitMeasurement?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSavings?: boolean;
  className?: string;
}

export function Price({
  price,
  compareAtPrice,
  subscriptionPrice,
  unitMeasurement,
  size = 'md',
  showSavings = true,
  className,
}: PriceProps) {
  const currentPrice = subscriptionPrice !== undefined ? subscriptionPrice : price;
  const isDiscounted =
    (subscriptionPrice !== undefined && subscriptionPrice < price) ||
    (compareAtPrice !== undefined && compareAtPrice > price);

  const originalPrice = subscriptionPrice !== undefined ? price : compareAtPrice;

  const sizeClasses = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-lg',
    xl: 'text-xl sm:text-2xl',
  };

  const savingsAmount = originalPrice ? originalPrice - currentPrice : 0;
  const savingsPercent = originalPrice ? Math.round((savingsAmount / originalPrice) * 100) : 0;

  return (
    <div className={cn('inline-flex flex-col', className)}>
      {/* Screen-reader accessible pricing announcement */}
      <span className="sr-only">
        {isDiscounted && originalPrice !== undefined
          ? `Current price: ${formatCurrency(currentPrice)}${unitMeasurement ? ` per ${unitMeasurement}` : ''}. Regular price was ${formatCurrency(originalPrice)}, savings of ${formatCurrency(savingsAmount)} (${savingsPercent}% discount).`
          : `Price: ${formatCurrency(currentPrice)}${unitMeasurement ? ` per ${unitMeasurement}` : ''}.`}
      </span>

      <div className="flex items-baseline gap-2" aria-hidden="true">
        <span
          className={cn(
            'font-mono font-semibold text-stone-900 tabular-nums',
            sizeClasses[size]
          )}
        >
          {formatCurrency(currentPrice)}
        </span>

        {isDiscounted && originalPrice !== undefined && (
          <span className="font-mono text-xs text-stone-500 line-through tabular-nums">
            {formatCurrency(originalPrice)}
          </span>
        )}

        {unitMeasurement && (
          <span className="text-[11px] text-stone-600 font-sans">
            / {unitMeasurement}
          </span>
        )}
      </div>

      {showSavings && isDiscounted && savingsPercent > 0 && (
        <span className="text-[10px] text-emerald-800 font-medium font-sans" aria-hidden="true">
          Save {formatCurrency(savingsAmount)} ({savingsPercent}%)
        </span>
      )}
    </div>
  );
}
