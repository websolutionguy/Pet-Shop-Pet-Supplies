'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Repeat, Loader2 } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { formatCurrency } from '../../lib/utils';
import { useCart } from '../../providers/CartProvider';
import { AppImage } from '../ui/AppImage';


interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

const POPULAR_SEARCHES = [
  'Grain-Free Salmon Kibble',
  'Freeze-Dried Beef Liver',
  'Wild Alaskan Salmon Oil',
  'Grass-Fed Yak Cheese Chew',
  'Organic Catnip',
  'Air-Dried Turkey',
];

function SearchDialogContent({
  onClose,
  onSelectProduct,
}: {
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => inputRef.current?.focus(), 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const found = await productService.searchProducts(query);
        if (!cancelled) setResults(found);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const displayedResults = query.trim() ? results : [];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-start"
      role="dialog"
      aria-modal="true"
      aria-label="Search provisions catalog"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }}
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
      />

      {/* Search container */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-3xl mx-auto mt-4 sm:mt-12 px-4"
      >
        <div className="bg-white rounded-xs border border-stone-200 shadow-2xl overflow-hidden">
          {/* Input field */}
          <div className="flex items-center px-4 py-3 border-b border-stone-200">
            <Search className="w-5 h-5 text-stone-400 shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search kibble, organic treats, supplements, chew toys..."
              className="w-full pl-3 pr-4 py-2 text-base text-stone-900 placeholder:text-stone-400 focus:outline-none bg-transparent"
              aria-label="Search provisions catalog"
            />
            {isLoading && (
              <Loader2 className="w-4 h-4 text-stone-400 animate-spin shrink-0 mr-2" />
            )}
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-400 hover:text-stone-700 rounded-xs mr-1 cursor-pointer touch-manipulation"
                aria-label="Clear search input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-mono font-medium text-stone-600 hover:text-stone-900 px-3.5 py-2 min-h-[44px] flex items-center bg-stone-100 rounded-xs cursor-pointer touch-manipulation shrink-0"
            >
              Close
            </button>
          </div>

          {/* Content area */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
            {/* Popular searches suggestions */}
            {!query.trim() && (
              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 mb-2">
                  Popular Provisions Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQuery(item)}
                      className="text-xs px-3 py-2 min-h-[38px] flex items-center bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xs transition-colors cursor-pointer touch-manipulation"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results list */}
            {query.trim() && displayedResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500 pb-1 border-b border-stone-100">
                  <span>{displayedResults.length} provisions found for &ldquo;{query}&rdquo;</span>
                  <span className="font-mono text-[11px]">Independent Brand Selection</span>
                </div>

                <div className="divide-y divide-stone-100">
                  {displayedResults.map((product) => (
                    <div
                      key={product.id}
                      className="py-2.5 flex items-center justify-between gap-3 group hover:bg-stone-50/80 px-2 rounded-xs transition-colors"
                    >
                      <div
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                        onClick={() => {
                          onSelectProduct?.(product);
                          onClose();
                        }}
                      >
                        <div className="relative w-12 h-12 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200">
                          {product.primaryImage ? (
                            <AppImage
                              src={product.primaryImage}
                              alt={product.name}
                              fill
                              loading="lazy"
                              sizes="48px"
                              className="object-cover"
                              showSpinner={false}
                            />
                          ) : (
                            <div className="w-full h-full bg-stone-200" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 text-[10px] text-stone-500 uppercase tracking-wider">
                            <span>{product.brand}</span>
                            <span>·</span>
                            <span className="capitalize">{product.petType}</span>
                          </div>
                          <h5 className="text-xs sm:text-sm font-medium text-stone-900 truncate group-hover:text-emerald-900 transition-colors">
                            {product.name}
                          </h5>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                              {formatCurrency(product.basePrice)}
                            </span>
                            {product.subscription.eligible && (
                              <span className="text-[10px] text-emerald-800 flex items-center gap-0.5 font-medium">
                                <Repeat className="w-2.5 h-2.5" />
                                Auto-Ship Save {product.subscription.discountPercentage}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          addItem(product, { quantity: 1 });
                          onClose();
                        }}
                        className="shrink-0 text-xs font-medium px-3.5 py-2 min-h-[44px] flex items-center justify-center bg-stone-900 hover:bg-stone-800 text-white rounded-xs transition-colors cursor-pointer touch-manipulation"
                      >
                        Add to Basket
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {query.trim() && !isLoading && displayedResults.length === 0 && (
              <div className="py-8 text-center">
                <p className="font-serif text-stone-800 text-sm">
                  No matching provisions found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  Try searching by companion (Dog, Cat), ingredient (Salmon, Duck, Pumpkin), or category (Kibble, Chews).
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function SearchModal({ isOpen, onClose, onSelectProduct }: SearchModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <SearchDialogContent
          onClose={onClose}
          onSelectProduct={onSelectProduct}
        />
      )}
    </AnimatePresence>
  );
}
