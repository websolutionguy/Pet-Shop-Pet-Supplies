'use client';

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary:
        'bg-stone-900 text-stone-50 hover:bg-stone-800 active:bg-stone-950 border border-transparent shadow-xs',
      secondary:
        'bg-[#1E3A2F] text-stone-50 hover:bg-[#142720] active:bg-[#0E1B16] border border-transparent shadow-xs',
      outline:
        'bg-white text-stone-800 hover:bg-stone-50 border border-stone-300 active:bg-stone-100 shadow-xs',
      subtle:
        'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-transparent active:bg-stone-300',
      ghost:
        'text-stone-700 hover:bg-stone-100 active:bg-stone-200 border border-transparent',
      danger:
        'bg-[#9A2B2B] text-white hover:bg-[#7D2222] border border-transparent shadow-xs',
    };

    const sizes = {
      sm: 'text-xs py-2 px-3 gap-1.5 min-h-[44px] sm:min-h-[38px]',
      md: 'text-xs sm:text-sm py-2.5 px-4 gap-2 min-h-[44px]',
      lg: 'text-sm sm:text-base py-3 px-5 gap-2.5 min-h-[48px]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
