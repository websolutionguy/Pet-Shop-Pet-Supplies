'use client';

import React from 'react';
import { RotateCcw, Search, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  onResetFilters: () => void;
  activeFilterCount: number;
  searchQuery?: string;
  isSubscriptionFilter?: boolean;
  onSelectSuggestion?: (patch: Record<string, string>) => void;
}

export function EmptyState({
  onResetFilters,
  activeFilterCount,
  searchQuery,
  isSubscriptionFilter = false,
  onSelectSuggestion,
}: EmptyStateProps) {
  const isSubscriptionOnly = isSubscriptionFilter;

  return (
    <div className="bg-white border border-stone-200/90 rounded-xs p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 shadow-xs">
      <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-500">
        <Search className="w-5 h-5" />
      </div>

      <h3 className="font-serif text-xl sm:text-2xl font-medium text-stone-900 mb-2">
        {isSubscriptionOnly
          ? 'No subscription products available'
          : searchQuery
          ? `No provisions found for “${searchQuery}”`
          : 'No provisions match your active filters'}
      </h3>

      <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed mb-6">
        {isSubscriptionOnly
          ? 'None of the recipes matching your current filter are currently configured for recurring auto-ship delivery. Clear the subscription constraint or view all pantry provisions.'
          : activeFilterCount > 0
          ? `You have ${activeFilterCount} filter${
              activeFilterCount > 1 ? 's' : ''
            } currently active. Try clearing one or more constraints to see more independent kitchen recipes.`
          : 'We could not find any provisions matching that exact search term. Try checking for typos or searching by ingredient.'}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <Button
          variant="primary"
          size="md"
          onClick={onResetFilters}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          {isSubscriptionOnly ? 'View All Provisions' : 'Reset All Filters'}
        </Button>
      </div>

      {/* Suggested Quick Jumps */}
      <div className="pt-6 border-t border-stone-100">
        <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-3 font-mono">
          Popular Provisions Collections:
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onSelectSuggestion?.({ pet: 'dog', category: 'all' })}
            className="text-xs px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xs text-stone-700 transition-colors cursor-pointer"
          >
            All Dog Provisions
          </button>
          <button
            type="button"
            onClick={() => onSelectSuggestion?.({ pet: 'cat', category: 'all' })}
            className="text-xs px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xs text-stone-700 transition-colors cursor-pointer"
          >
            All Cat Nutrition
          </button>
          <button
            type="button"
            onClick={() => onSelectSuggestion?.({ category: 'treats' })}
            className="text-xs px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xs text-stone-700 transition-colors cursor-pointer"
          >
            Treats & Chews
          </button>
          <button
            type="button"
            onClick={() => onSelectSuggestion?.({ subscription: 'true' })}
            className="text-xs px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xs text-emerald-900 transition-colors cursor-pointer"
          >
            Auto-Ship Eligible (-10%)
          </button>
        </div>
      </div>
    </div>
  );
}
