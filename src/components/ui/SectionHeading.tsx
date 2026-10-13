import React from 'react';
import { cn } from '../../lib/utils';

export interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  kicker,
  title,
  description,
  action,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const isCenter = align === 'center';

  return (
    <div
      className={cn(
        'mb-8 sm:mb-10 flex flex-col',
        isCenter ? 'items-center text-center' : 'items-start text-left',
        action && !isCenter && 'md:flex-row md:items-end md:justify-between gap-4',
        className
      )}
    >
      <div className={cn('max-w-2xl', isCenter && 'mx-auto')}>
        {kicker && (
          <p className="text-[11px] uppercase tracking-widest text-emerald-950 font-bold mb-1.5 font-sans">
            {kicker}
          </p>
        )}
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 tracking-tight leading-tight">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className={cn('shrink-0 mt-4 md:mt-0', isCenter && 'mt-6')}>
          {action}
        </div>
      )}
    </div>
  );
}
