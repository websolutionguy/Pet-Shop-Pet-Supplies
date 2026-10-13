'use client';

import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export const JOURNAL_CATEGORIES = [
  'All',
  'Dog Care',
  'Cat Care',
  'Nutrition',
  'Grooming',
  'Training',
  'Pet Supplies',
  'Buying Guides',
  'Pet Routines',
] as const;

interface JournalHeaderProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  postCount: number;
}

export function JournalHeader({
  selectedCategory,
  onSelectCategory,
  postCount,
}: JournalHeaderProps) {
  return (
    <header className="space-y-6">
      {/* Top Volume Identifier */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 text-[11px] font-mono uppercase tracking-widest text-stone-500">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-800" />
          <span>The Rowan &amp; Hound Journal · Field Notes &amp; Care</span>
        </div>
        <div className="hidden sm:block">
          <span>Est. 2018 · Portland, Oregon</span>
        </div>
      </div>

      {/* Editorial Title Banner */}
      <div className="space-y-3 max-w-3xl">
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 tracking-tight leading-tight">
          Thoughtful Practices for Modern Animal Companions
        </h1>
        <p className="text-stone-600 text-xs sm:text-sm lg:text-base leading-relaxed">
          Independent nutritional science, feline hydration biology, and low-waste pantry routines written by our Portland veterinary advisors and sourcing team.
        </p>
      </div>

      {/* Horizontal Category Filter Navigation */}
      <div className="pt-2 border-t border-stone-200">
        <nav
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1"
          aria-label="Filter journal articles by category"
        >
          {JOURNAL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xs text-xs font-mono transition-colors border cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-stone-900 text-white border-stone-900 shadow-2xs font-semibold'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
