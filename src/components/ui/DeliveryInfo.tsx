import React from 'react';
import { Truck, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { cn, formatCurrency } from '../../lib/utils';

export interface DeliveryInfoProps {
  currentSubtotal: number;
  freeShippingThreshold?: number;
  nextBatchDate?: string;
  showMetroBadge?: boolean;
  className?: string;
}

export function DeliveryInfo({
  currentSubtotal,
  freeShippingThreshold = 49.0,
  nextBatchDate = 'Wednesday, next week',
  showMetroBadge = true,
  className,
}: DeliveryInfoProps) {
  const qualifies = currentSubtotal >= freeShippingThreshold;
  const needed = Math.max(0, Number((freeShippingThreshold - currentSubtotal).toFixed(2)));
  const progressPercent = Math.min(100, Math.round((currentSubtotal / freeShippingThreshold) * 100));

  return (
    <div className={cn('bg-stone-50 border border-stone-200/90 rounded-xs p-3 space-y-2.5', className)}>
      {/* Free shipping progress */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-medium text-stone-800 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-stone-600" />
            {qualifies ? (
              <strong className="text-[#1E4B33]">Free Regional Delivery Unlocked!</strong>
            ) : (
              <span>
                Add <strong className="font-mono text-stone-900">{formatCurrency(needed)}</strong> for Free Delivery
              </span>
            )}
          </span>
          <span className="font-mono text-[11px] text-stone-500 tabular-nums">
            {formatCurrency(currentSubtotal)} / {formatCurrency(freeShippingThreshold)}
          </span>
        </div>

        <div className="w-full h-1.5 bg-stone-200 rounded-xs overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300',
              qualifies ? 'bg-[#1E4B33]' : 'bg-stone-800'
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Dispatch & Freshness Note */}
      <div className="pt-2 border-t border-stone-200/70 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-600">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>Next Fresh Oven Run: <strong className="text-stone-800">{nextBatchDate}</strong></span>
        </div>

        {showMetroBadge && (
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span>Portland Metro 0-Emission Courier</span>
          </div>
        )}
      </div>
    </div>
  );
}
