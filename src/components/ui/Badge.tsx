import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'success' | 'warning' | 'forest' | 'terracotta' | 'outline';
  size?: 'sm' | 'md';
}

export function Badge({
  className,
  variant = 'neutral',
  size = 'sm',
  children,
  ...props
}: BadgeProps) {
  const base =
    'inline-flex items-center font-mono font-medium rounded-xs uppercase tracking-wider select-none';

  const variants = {
    neutral: 'bg-stone-100 text-stone-800 border border-stone-200/80',
    forest: 'bg-emerald-50 text-[#1E3A2F] border border-emerald-200/70',
    terracotta: 'bg-amber-50 text-[#9E5A26] border border-amber-200/70',
    success: 'bg-[#EAF3EF] text-[#1B4D3E] border border-[#C5DFD4]',
    warning: 'bg-[#FDF6E2] text-[#8A5A00] border border-[#F4E0A8]',
    outline: 'bg-transparent text-stone-700 border border-stone-300',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 leading-none',
    md: 'text-[11px] px-2 py-0.5 leading-tight',
  };

  return (
    <span className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
