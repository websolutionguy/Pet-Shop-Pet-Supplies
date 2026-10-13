'use client';

import React from 'react';

export function CartLoadingState({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`space-y-4 animate-pulse ${
        compact ? 'py-4' : 'p-6 bg-white border border-stone-200 rounded-xs'
      }`}
      aria-label="Loading basket provisions"
    >
      <div className="flex gap-4 items-center">
        <div className="w-16 h-16 bg-stone-200 rounded-xs shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-stone-200 rounded-xs w-3/4" />
          <div className="h-3 bg-stone-100 rounded-xs w-1/2" />
          <div className="h-3 bg-stone-100 rounded-xs w-1/4" />
        </div>
      </div>

      <div className="h-10 bg-stone-100 rounded-xs w-full" />

      <div className="flex gap-4 items-center pt-3 border-t border-stone-100">
        <div className="w-16 h-16 bg-stone-200 rounded-xs shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-stone-200 rounded-xs w-2/3" />
          <div className="h-3 bg-stone-100 rounded-xs w-1/3" />
        </div>
      </div>
    </div>
  );
}
