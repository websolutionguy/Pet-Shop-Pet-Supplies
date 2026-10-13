'use client';

import React from 'react';
import Link from 'next/link';
import {
  X,
  Search,
  User,
  ShoppingBag,
  PawPrint,
  Repeat,
  RotateCcw,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useCart } from '../../providers/CartProvider';
import { usePetProfile } from '../../providers/PetProfileProvider';
import { formatCurrency } from '../../lib/utils';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: string) => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenPetManager: () => void;
  activeFilter?: string;
}

export function MobileNavDrawer({
  isOpen,
  onClose,
  onSelectCategory,
  onOpenSearch,
  onOpenAccount,
  onOpenPetManager,
  activeFilter,
}: MobileNavDrawerProps) {
  const shouldReduceMotion = useReducedMotion();
  const { summary, openCart } = useCart();
  const { selectedPet, pets } = usePetProfile();
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElementRef = React.useRef<HTMLElement | null>(null);

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose]
  );

  React.useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      const timer = setTimeout(() => {
        if (drawerRef.current) {
          const focusable = drawerRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable) {
            focusable.focus();
          } else {
            drawerRef.current.focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, handleKeyDown]);

  const handleLinkClick = (filter: string) => {
    onSelectCategory(filter);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-nav-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
            <motion.div
              ref={drawerRef}
              tabIndex={-1}
              initial={shouldReduceMotion ? { opacity: 0 } : { x: '-100%' }}
              animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: '-100%' }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', damping: 28, stiffness: 280 }
              }
              className="w-screen max-w-xs sm:max-w-sm bg-white shadow-2xl flex flex-col h-full border-r border-stone-200 outline-none"
            >
              {/* Header */}
              <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
                <div className="flex flex-col">
                  <h2 id="mobile-nav-title" className="font-serif text-lg font-semibold text-stone-900 tracking-tight">
                    Rowan &amp; Hound
                  </h2>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider font-mono">
                    Supply Co. · Est. 2018
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Search Action Bar */}
              <div className="p-4 border-b border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSearch();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 bg-stone-100 hover:bg-stone-200/80 text-stone-500 text-xs rounded-xs border border-stone-200 transition-colors cursor-pointer text-left"
                >
                  <Search className="w-4 h-4 text-stone-400" />
                  <span>Search kibble, chews, oils...</span>
                </button>
              </div>

              {/* Navigation Links Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6 divide-y divide-stone-100">
                {/* 1. Companion Categories */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 px-2 block mb-1">
                    Shop by Companion
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('dog')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xs min-h-[44px] transition-colors cursor-pointer ${
                      activeFilter === 'dog' ? 'bg-stone-900 text-white' : 'text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <span>Dogs</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('cat')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xs min-h-[44px] transition-colors cursor-pointer ${
                      activeFilter === 'cat' ? 'bg-stone-900 text-white' : 'text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <span>Cats</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('small-pets')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xs min-h-[44px] transition-colors cursor-pointer ${
                      activeFilter === 'small-pets' ? 'bg-stone-900 text-white' : 'text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <span>Small Pets</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>
                </div>

                {/* 2. Provision Categories */}
                <div className="pt-4 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 px-2 block mb-1">
                    Provisions & Nutrition
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('food')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xs min-h-[44px] transition-colors cursor-pointer ${
                      activeFilter === 'food' ? 'bg-stone-900 text-white' : 'text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <span>Food & Fresh Batches</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('treats')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xs min-h-[44px] transition-colors cursor-pointer ${
                      activeFilter === 'treats' ? 'bg-stone-900 text-white' : 'text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <span>Treats & Chews</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLinkClick('toys')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xs min-h-[44px] transition-colors cursor-pointer ${
                      activeFilter === 'toys' ? 'bg-stone-900 text-white' : 'text-stone-800 hover:bg-stone-50'
                    }`}
                  >
                    <span>Toys & Enrichment</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </button>
                </div>

                {/* 3. Essential Recurring Programs */}
                <div className="pt-4 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 px-2 block mb-1">
                    Replenishment Services
                  </span>
                  <Link
                    href="/bundles"
                    onClick={() => onClose()}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xs min-h-[44px] text-stone-800 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-800" />
                      <span>Curated Bundles</span>
                    </div>
                    <span className="font-mono text-[10px] bg-stone-200 text-stone-800 px-1.5 py-0.5 rounded-xs font-semibold">
                      6 Sets
                    </span>
                  </Link>

                  <Link
                    href="/journal"
                    onClick={() => onClose()}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xs min-h-[44px] text-stone-800 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-800 font-serif font-bold text-sm">J</span>
                      <span>The Journal</span>
                    </div>
                    <span className="font-mono text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded-xs">
                      Field Notes
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleLinkClick('subscriptions')}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xs min-h-[44px] bg-emerald-50 text-emerald-950 border border-emerald-200 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Repeat className="w-4 h-4 text-emerald-800" />
                      <span>Subscriptions</span>
                    </div>
                    <span className="font-mono text-[10px] bg-emerald-200/80 text-emerald-950 px-1.5 py-0.5 rounded-xs font-semibold">
                      Save 10%
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLinkClick('reorder')}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-xs min-h-[44px] text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-stone-600" />
                      <span>Quick Reorder</span>
                    </div>
                    <span className="text-xs text-stone-500 font-mono">Pantry</span>
                  </button>
                </div>

                {/* 4. Household Pet Profile Affordance */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenPetManager();
                    }}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xs text-left cursor-pointer hover:bg-stone-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                        <PawPrint className="w-3.5 h-3.5 text-stone-500" />
                        Pet Focus: {selectedPet ? selectedPet.name : `${pets.length} Pets`}
                      </span>
                      <span className="text-[10px] text-stone-500 underline">Switch</span>
                    </div>
                    {selectedPet && (
                      <p className="text-[11px] text-stone-500 mt-1">
                        {selectedPet.breed} · Replenish every {selectedPet.calculatedBagCadenceWeeks} weeks
                      </p>
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAccount();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-stone-800 bg-white hover:bg-stone-100 border border-stone-300 rounded-xs min-h-[44px] transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-stone-600" />
                  <span>Account & Past Invoices</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openCart();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xs min-h-[44px] transition-colors cursor-pointer shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Basket · {summary.itemCount} items ({formatCurrency(summary.total)})</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
