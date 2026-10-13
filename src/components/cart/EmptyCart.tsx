'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, RotateCcw, Sparkles, ArrowRight, Package } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyCartProps {
  onCloseDrawer?: () => void;
  compact?: boolean;
}

export function EmptyCart({ onCloseDrawer, compact = false }: EmptyCartProps) {
  return (
    <div
      className={`text-center flex flex-col items-center justify-center ${
        compact ? 'py-12 px-4' : 'py-16 sm:py-24 px-4 bg-white border border-stone-200/90 rounded-xs shadow-xs max-w-2xl mx-auto my-8'
      }`}
    >
      <div className="w-16 h-16 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-400 mb-4">
        <ShoppingBag className="w-7 h-7 text-stone-500" />
      </div>

      <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 tracking-tight">
        Your Provisions Basket is Empty
      </h3>

      <p className="mt-2 text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
        You haven&apos;t added any whole-nutrition kibble, freeze-dried treats, or small-batch botanical supplements yet.
      </p>

      {/* Suggested Quick Actions */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <Link
          href="/shop"
          onClick={onCloseDrawer}
          className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xs transition-colors flex items-center justify-center gap-2"
        >
          <span>Explore Provisions Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          href="/reorder"
          onClick={onCloseDrawer}
          className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium border border-stone-300 rounded-xs transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Quick Reorder Staples</span>
        </Link>
      </div>

      {/* Quick category links */}
      <div className="mt-8 pt-6 border-t border-stone-200/80 w-full max-w-md">
        <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 block mb-3">
          Popular Departments
        </span>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            href="/shop?pet=dogs"
            onClick={onCloseDrawer}
            className="px-3 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs text-stone-700 rounded-xs transition-colors"
          >
            Canine Nutrition
          </Link>
          <Link
            href="/shop?pet=cats"
            onClick={onCloseDrawer}
            className="px-3 py-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs text-stone-700 rounded-xs transition-colors"
          >
            Feline Nutrition
          </Link>
          <Link
            href="/subscriptions"
            onClick={onCloseDrawer}
            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs text-emerald-900 font-medium rounded-xs transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-emerald-700" />
            <span>Auto-Ship Routines</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
