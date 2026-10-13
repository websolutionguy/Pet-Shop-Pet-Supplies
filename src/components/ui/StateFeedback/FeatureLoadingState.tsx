'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface FeatureLoadingStateProps {
  title?: string;
  message?: string;
  compact?: boolean;
  className?: string;
}

export function FeatureLoadingState({
  title = 'Loading provisions...',
  message = 'Preparing small-batch recipes, nutrition analyses, and pantry records.',
  compact = false,
  className = '',
}: FeatureLoadingStateProps) {
  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`py-8 flex flex-col items-center justify-center text-center space-y-2 text-stone-600 ${className}`}
      >
        <Loader2 className="w-5 h-5 animate-spin text-[#1E3A2F]" aria-hidden="true" />
        <p className="text-xs font-mono text-stone-500">{title}</p>
        <span className="sr-only">{message}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`py-16 sm:py-24 px-4 bg-stone-50/70 border border-stone-200/90 rounded-xs text-center flex flex-col items-center justify-center space-y-3 max-w-2xl mx-auto my-6 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#1E3A2F]" aria-hidden="true" />
      </div>

      <h3 className="font-serif text-lg font-normal text-stone-900 tracking-tight">
        {title}
      </h3>

      <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
        {message}
      </p>

      {/* Screen reader only live update */}
      <span className="sr-only">Content is loading, please wait.</span>
    </div>
  );
}
