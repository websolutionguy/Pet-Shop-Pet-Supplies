'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, HelpCircle } from 'lucide-react';
import { Button } from '../Button';

interface FeatureErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  compact?: boolean;
  className?: string;
}

export function FeatureErrorState({
  title = 'Service Notice',
  message,
  onRetry,
  retryLabel = 'Try Again',
  secondaryHref = '/contact',
  secondaryLabel = 'Contact Pantry Care',
  compact = false,
  className = '',
}: FeatureErrorStateProps) {
  if (compact) {
    return (
      <div
        role="alert"
        className={`p-3.5 bg-amber-50/90 border border-amber-300/80 rounded-xs text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold block font-mono text-[11px] uppercase tracking-wider text-amber-900">
              {title}
            </span>
            <p className="mt-0.5 text-stone-700 leading-relaxed font-sans">{message}</p>
          </div>
        </div>

        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3 h-3" />}
            className="shrink-0 self-start sm:self-center"
          >
            {retryLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={`py-12 sm:py-16 px-6 bg-amber-50/40 border border-amber-200/90 rounded-xs text-center flex flex-col items-center justify-center space-y-3 max-w-xl mx-auto my-6 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-amber-100/80 border border-amber-300 flex items-center justify-center text-amber-800 shadow-2xs">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>

      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-800 bg-amber-100/90 border border-amber-300 px-2.5 py-0.5 rounded-xs">
        {title}
      </span>

      <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-900 tracking-tight">
        Temporary Service Interruption
      </h3>

      <p className="text-xs sm:text-sm text-stone-700 max-w-md mx-auto leading-relaxed">
        {message}
      </p>

      {/* Recovery Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
        {onRetry && (
          <Button
            variant="primary"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            {retryLabel}
          </Button>
        )}

        {secondaryHref && (
          <Link
            href={secondaryHref}
            className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-stone-50 text-stone-800 text-xs font-medium border border-stone-300 rounded-xs transition-colors flex items-center justify-center gap-2 min-h-[36px]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>{secondaryLabel}</span>
          </Link>
        )}
      </div>
    </div>
  );
}
