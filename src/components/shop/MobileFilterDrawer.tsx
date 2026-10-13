'use client';

import React, { useEffect } from 'react';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FilterSidebarContent } from './FilterSidebarContent';
import { ShopFilterState } from './types';
import { Category } from '../../types/category';
import { BrandData, ProductTypeData } from '../../types/data';
import { Button } from '../ui/Button';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: ShopFilterState;
  onChange: (patch: Partial<ShopFilterState>) => void;
  onReset: () => void;
  categories: Category[];
  brands: BrandData[];
  productTypes: ProductTypeData[];
  totalMatches: number;
  activeFilterCount: number;
}

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  categories,
  brands,
  productTypes,
  totalMatches,
  activeFilterCount,
}: MobileFilterDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          {/* Drawer / Bottom sheet panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full border-l border-stone-200"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 shrink-0">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-stone-700" />
                  <h3 className="font-serif text-base font-semibold text-stone-900">
                    Refine Provisions
                  </h3>
                  {activeFilterCount > 0 && (
                    <span className="font-mono text-xs bg-stone-900 text-white px-2 py-0.5 rounded-full font-bold">
                      {activeFilterCount}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-xs transition-colors cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Filter Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <FilterSidebarContent
                  filters={filters}
                  onChange={onChange}
                  onReset={onReset}
                  categories={categories}
                  brands={brands}
                  productTypes={productTypes}
                  totalMatches={totalMatches}
                />
              </div>

              {/* Sticky Drawer Footer Actions */}
              <div className="p-4 border-t border-stone-200 bg-stone-50/95 flex items-center gap-3 shrink-0">
                {activeFilterCount > 0 && (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={onReset}
                    className="shrink-0 text-xs"
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                  >
                    Reset
                  </Button>
                )}

                <Button
                  variant="primary"
                  size="md"
                  onClick={onClose}
                  className="flex-1 text-xs"
                  rightIcon={<Check className="w-4 h-4" />}
                >
                  Show {totalMatches} Provision{totalMatches !== 1 ? 's' : ''}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
