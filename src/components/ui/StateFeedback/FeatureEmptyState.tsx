'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, PackageOpen, ArrowRight } from 'lucide-react';
import { Button } from '../Button';

interface StateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

interface FeatureEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  primaryAction?: StateAction;
  secondaryAction?: StateAction;
  compact?: boolean;
  className?: string;
  badge?: string;
}

export function FeatureEmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  primaryAction,
  secondaryAction,
  compact = false,
  className = '',
  badge,
}: FeatureEmptyStateProps) {
  return (
    <div
      role="region"
      aria-label={title}
      className={`text-center flex flex-col items-center justify-center ${
        compact
          ? 'py-8 px-4 bg-stone-50/80 border border-stone-200 rounded-xs'
          : 'py-14 sm:py-20 px-6 bg-white border border-stone-200/90 rounded-xs shadow-xs max-w-2xl mx-auto my-6'
      } ${className}`}
    >
      {badge && (
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-stone-500 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-xs mb-3">
          {badge}
        </span>
      )}

      <div className="w-14 h-14 rounded-full bg-stone-100/90 border border-stone-200 flex items-center justify-center text-stone-500 mb-3.5">
        <Icon className="w-6 h-6 text-stone-600" aria-hidden="true" />
      </div>

      <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-900 tracking-tight">
        {title}
      </h3>

      <p className="mt-2 text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
        {description}
      </p>

      {/* Action buttons with clear recovery routes */}
      {(primaryAction || secondaryAction) && (
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          {primaryAction &&
            (primaryAction.href ? (
              <Link
                href={primaryAction.href}
                className="w-full sm:w-auto px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 min-h-[40px]"
              >
                <span>{primaryAction.label}</span>
                {primaryAction.icon || <ArrowRight className="w-3.5 h-3.5" />}
              </Link>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={primaryAction.onClick}
                rightIcon={primaryAction.icon || <ArrowRight className="w-3.5 h-3.5" />}
              >
                {primaryAction.label}
              </Button>
            ))}

          {secondaryAction &&
            (secondaryAction.href ? (
              <Link
                href={secondaryAction.href}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium border border-stone-300 rounded-xs transition-colors flex items-center justify-center gap-2 min-h-[40px]"
              >
                {secondaryAction.icon}
                <span>{secondaryAction.label}</span>
              </Link>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={secondaryAction.onClick}
                leftIcon={secondaryAction.icon}
              >
                {secondaryAction.label}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}
