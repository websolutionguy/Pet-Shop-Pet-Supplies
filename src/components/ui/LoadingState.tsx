import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'skeleton-card' | 'skeleton-list';
  count?: number;
  className?: string;
}

export function LoadingState({
  message = 'Retrieving fresh provisions...',
  variant = 'spinner',
  count = 3,
  className,
}: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div
        className={cn(
          'py-12 flex flex-col items-center justify-center text-center space-y-3',
          className
        )}
      >
        <Loader2 className="w-6 h-6 text-stone-700 animate-spin" />
        <p className="font-serif text-xs text-stone-600 tracking-wide">{message}</p>
      </div>
    );
  }

  if (variant === 'skeleton-card') {
    return (
      <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-stone-200 rounded-xs overflow-hidden p-4 space-y-3 animate-pulse"
          >
            <div className="aspect-4/3 bg-stone-100 rounded-xs" />
            <div className="h-3 bg-stone-100 rounded-xs w-1/3" />
            <div className="h-4 bg-stone-200 rounded-xs w-3/4" />
            <div className="h-3 bg-stone-100 rounded-xs w-full" />
            <div className="pt-2 flex justify-between items-center">
              <div className="h-5 bg-stone-200 rounded-xs w-1/4" />
              <div className="h-8 bg-stone-100 rounded-xs w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-14 bg-stone-100/80 rounded-xs animate-pulse border border-stone-200/50"
        />
      ))}
    </div>
  );
}
