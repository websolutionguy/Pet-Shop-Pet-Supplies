import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: 'slash' | 'chevron' | 'dot';
  className?: string;
}

export function Breadcrumbs({
  items,
  separator = 'chevron',
  className,
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-stone-500', className)}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && (
                <span className="text-stone-400 select-none" aria-hidden="true">
                  {separator === 'slash' && '/'}
                  {separator === 'dot' && '·'}
                  {separator === 'chevron' && <ChevronRight className="w-3 h-3 text-stone-300" />}
                </span>
              )}

              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-stone-900 transition-colors underline-offset-4 hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    isLast ? 'text-stone-900 font-medium' : 'text-stone-500'
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
