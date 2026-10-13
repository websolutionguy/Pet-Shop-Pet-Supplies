import React from 'react';
import Link from 'next/link';
import { ShoppingBag, RotateCcw, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] text-stone-900 px-4 py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 mb-4">
        <ShoppingBag className="w-6 h-6" />
      </div>

      <p className="text-xs font-mono uppercase tracking-widest text-[#1E3A2F] font-bold mb-2">
        404 · Provision Not Found
      </p>

      <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 mb-3 tracking-tight">
        This provision could not be found.
      </h1>

      <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mb-8 leading-relaxed">
        The recipe, bundle, or article you requested may have been retired or moved to another department in our pantry.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
        <Link
          href="/shop"
          className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xs text-xs font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <span>Explore Provisions Catalog</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          href="/reorder"
          className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs text-xs font-medium border border-stone-300 transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Quick Reorder Staples</span>
        </Link>
      </div>
    </div>
  );
}
