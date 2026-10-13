'use client';

import React, { useState } from 'react';
import { RotateCcw, Check, Loader2, Repeat } from 'lucide-react';
import { cn } from '../../lib/utils';

interface QuickReorderButtonProps {
  onReorder: () => Promise<void> | void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  isSubscription?: boolean;
  disabled?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export function QuickReorderButton({
  onReorder,
  label = 'Quick Reorder',
  size = 'md',
  variant = 'primary',
  isSubscription = false,
  disabled = false,
  className,
  iconOnly = false,
}: QuickReorderButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'added'>('idle');

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (status !== 'idle' || disabled) return;

    setStatus('loading');
    try {
      await Promise.resolve(onReorder());
      setStatus('added');
      setTimeout(() => {
        setStatus('idle');
      }, 1800);
    } catch {
      setStatus('idle');
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-xs gap-1.5 min-h-[44px] touch-manipulation',
    md: 'px-3.5 py-2.5 text-xs gap-2 min-h-[44px] touch-manipulation',
    lg: 'px-5 py-3 text-sm gap-2.5 min-h-[48px] touch-manipulation',
  };

  const variantClasses = {
    primary:
      'bg-stone-900 text-white hover:bg-stone-800 border border-stone-900 shadow-xs focus-visible:ring-stone-900',
    secondary:
      'bg-emerald-900 text-white hover:bg-emerald-800 border border-emerald-900 shadow-xs focus-visible:ring-emerald-900',
    outline:
      'bg-white text-stone-800 hover:bg-stone-50 border border-stone-300 focus-visible:ring-stone-900',
  };

  return (
    <button
      type="button"
      disabled={disabled || status === 'loading'}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none overflow-hidden',
        sizeClasses[size],
        status === 'added'
          ? 'bg-emerald-800 text-white border border-emerald-800'
          : variantClasses[variant],
        className
      )}
      aria-label={label}
    >
      {status === 'loading' ? (
        <span className="inline-flex items-center gap-1.5 animate-fadeIn">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          {!iconOnly && <span>Adding...</span>}
        </span>
      ) : status === 'added' ? (
        <span className="inline-flex items-center gap-1.5 text-white animate-fadeIn">
          <Check className="w-3.5 h-3.5 stroke-3" />
          {!iconOnly && <span>Added to Basket!</span>}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5">
          {isSubscription ? (
            <Repeat className="w-3.5 h-3.5 text-emerald-300" />
          ) : (
            <RotateCcw className="w-3.5 h-3.5" />
          )}
          {!iconOnly && <span>{label}</span>}
        </span>
      )}
    </button>
  );
}
