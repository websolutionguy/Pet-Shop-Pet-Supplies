import React from 'react';
import { PackageOpen } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'text-center py-12 px-4 sm:px-6 bg-stone-50/70 border border-dashed border-stone-300 rounded-xs flex flex-col items-center justify-center max-w-md mx-auto my-6',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xs bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 mb-4">
        {icon || <PackageOpen className="w-6 h-6 stroke-[1.5]" />}
      </div>

      <h3 className="font-serif text-lg text-stone-900 font-medium">{title}</h3>
      <p className="mt-1.5 text-xs text-stone-600 leading-relaxed max-w-xs">
        {description}
      </p>

      {actionLabel && onAction && (
        <div className="mt-5">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
