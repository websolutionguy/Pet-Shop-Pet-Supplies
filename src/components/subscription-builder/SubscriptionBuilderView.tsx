'use client';

import React, { useState, useEffect, useMemo } from 'react';

import {
  Sparkles,
  Repeat,
  RotateCcw,
  Check,
  Search,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductVariant, ProductCadence } from '../../types/product';
import { productService } from '../../services/productService';
import { useCart } from '../../providers/CartProvider';
import { usePetProfile } from '../../providers/PetProfileProvider';
import {
  SelectedSubscriptionBundleItem,
  BUILDER_CATEGORIES,
  BUILDER_PET_TYPES,
} from './SubscriptionBuilderTypes';
import { SubscriptionStepProgress, BuilderStep } from './SubscriptionStepProgress';
import { SubscriptionItemCard } from './SubscriptionItemCard';
import { SubscriptionBundleSummary } from './SubscriptionBundleSummary';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import {
  FeatureLoadingState,
  FeatureEmptyState,
  FeatureErrorState,
} from '../ui/StateFeedback';

export function SubscriptionBuilderView() {
  const { addMultipleItems } = useCart();
  const { selectedPet: activeProfilePet } = usePetProfile();

  // Data states
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Builder configuration states
  const [currentStep, setCurrentStep] = useState<BuilderStep>(1);
  const [selectedPet, setSelectedPet] = useState<string>(
    activeProfilePet?.species === 'cat'
      ? 'cat'
      : activeProfilePet?.species === 'dog'
      ? 'dog'
      : 'all'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCadence, setSelectedCadence] = useState<ProductCadence>('4-weeks');

  // Multi-item bundle storage
  const [bundleItems, setBundleItems] = useState<SelectedSubscriptionBundleItem[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isMobileReviewOpen, setIsMobileReviewOpen] = useState(false);

  // Load products
  const loadEligibleProducts = React.useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    productService
      .getAll()
      .then((prods) => {
        const eligible = prods.filter((p) => p.subscription.eligible);
        setAllProducts(eligible);
      })
      .catch(() => {
        setLoadError("We couldn't load subscription-eligible recipes. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let isMounted = true;
    productService
      .getAll()
      .then((prods) => {
        if (!isMounted) return;
        const eligible = prods.filter((p) => p.subscription.eligible);
        setAllProducts(eligible);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadError("We couldn't load subscription-eligible recipes. Please try again.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // Pet filter
    if (selectedPet !== 'all') {
      const pet = selectedPet.toLowerCase();
      if (pet === 'dog') {
        list = list.filter(
          (p) => p.petType === 'dog' || p.petType === 'both' || p.rawPetType === 'dogs' || p.rawPetType === 'dog'
        );
      } else if (pet === 'cat') {
        list = list.filter(
          (p) => p.petType === 'cat' || p.petType === 'both' || p.rawPetType === 'cats' || p.rawPetType === 'cat'
        );
      } else if (pet === 'small-pets') {
        list = list.filter(
          (p) => p.rawPetType === 'small-pets' || p.petType === 'both'
        );
      }
    }

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'food') {
        list = list.filter(
          (p) => p.categoryId === 'dog-food' || p.categoryId === 'cat-food' || p.categoryId === 'food'
        );
      } else {
        list = list.filter((p) => p.categoryId === selectedCategory);
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allProducts, selectedPet, selectedCategory, searchQuery]);

  // Bundle operations
  const handleUpdateBundleItem = (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => {
    const key = `${product.id}_${variant.id}`;
    setBundleItems((prev) => {
      const filtered = prev.filter((item) => item.id !== key);
      return [
        ...filtered,
        {
          id: key,
          product,
          variant,
          quantity,
        },
      ];
    });
  };

  const handleRemoveBundleItem = (itemId: string) => {
    setBundleItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleUpdateBundleQuantity = (itemId: string, newQty: number) => {
    setBundleItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Add all bundle items to cart
  const handleAddBundleToCart = () => {
    if (bundleItems.length === 0) return;
    setIsAddingToCart(true);

    const batch = bundleItems.map((item) => ({
      product: item.product,
      options: {
        variantId: item.variant.id,
        quantity: item.quantity,
        purchaseType: 'subscription' as const,
        cadence: selectedCadence,
      },
    }));

    addMultipleItems(batch);

    setTimeout(() => {
      setIsAddingToCart(false);
      setIsMobileReviewOpen(false);
    }, 600);
  };

  const totalBundleCount = bundleItems.reduce((sum, item) => sum + item.quantity, 0);
  const recurringSubtotal = bundleItems.reduce((sum, item) => {
    const unitDiscounted = Number((item.variant.price * 0.9).toFixed(2));
    return sum + unitDiscounted * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Editorial Header Banner */}
      <header className="bg-stone-900 text-stone-100 py-10 sm:py-14 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
              <Repeat className="w-3.5 h-3.5" />
              <span>Small-Batch Auto-Ship Program</span>
              <span>·</span>
              <span>Save 10% on Every Cycle</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white">
              Curate Your Companion&apos;s Routine
            </h1>
            <p className="mt-3 text-stone-300 text-xs sm:text-sm leading-relaxed">
              Bundle oven-roasted dry kibbles, freeze-dried single-protein rewards, cold-pressed
              botanical supplements, and natural pine litters into one tailored recurring box.
              Adjust, skip, or cancel anytime with complete freedom.
            </p>
          </div>
        </div>
      </header>

      {/* Step Progress Bar */}
      <SubscriptionStepProgress
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        selectedItemCount={totalBundleCount}
      />

      {/* Main Workspace Layout: Filters + Product Grid + Live Routine Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center Area: Companion, Category, & Products (8 cols on lg) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Step 1 Controls: Pet Companion & Categories */}
            <section
              className="bg-white border border-stone-200/90 rounded-xs p-5 shadow-xs space-y-5"
              aria-label="Filter Companion and Category"
            >
              {/* Pet Companion Selector */}
              <div>
                <label id="builder-companion-label" className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-2 font-mono">
                  1. Select Companion Animal:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-labelledby="builder-companion-label">
                  {BUILDER_PET_TYPES.map((pet) => {
                    const isSelected = selectedPet === pet.id;
                    return (
                      <button
                        key={pet.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          setSelectedPet(pet.id);
                          setCurrentStep(2);
                        }}
                        className={cn(
                          'py-2 px-3 text-xs rounded-xs border text-center transition-all cursor-pointer font-medium min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none',
                          isSelected
                            ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                            : 'border-stone-200 bg-stone-50/70 hover:bg-stone-100 text-stone-800'
                        )}
                      >
                        {pet.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Category Pills */}
              <div>
                <label id="builder-category-label" className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-2 font-mono">
                  2. Choose Provision Category:
                </label>
                <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-labelledby="builder-category-label">
                  {BUILDER_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setCurrentStep(2);
                        }}
                        className={cn(
                          'px-3 py-1.5 text-xs rounded-xs border transition-colors cursor-pointer min-h-[38px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-emerald-900 focus-visible:ring-offset-1 outline-none',
                          isSelected
                            ? 'border-emerald-800 bg-emerald-800 text-white font-medium shadow-xs'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        )}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Keyword Search within Auto-Ship Catalog */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3 pointer-events-none" aria-hidden="true" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search salmon, dental chews, venison, oil..."
                    aria-label="Search auto-ship provisions catalog"
                    className="w-full pl-8 pr-3 py-2 min-h-[40px] bg-stone-50/60 border border-stone-200 rounded-xs text-xs text-stone-900 focus-visible:ring-2 focus-visible:ring-stone-900 focus:outline-none"
                  />
                </div>

                <div className="text-[11px] text-stone-500 font-mono shrink-0">
                  {filteredProducts.length} provision{filteredProducts.length !== 1 ? 's' : ''} available
                </div>
              </div>
            </section>

            {/* Step 2: Browse & Select Subscription Provisions Grid */}
            <section aria-label="Available Subscription Provisions">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-serif text-lg font-semibold text-stone-900">
                    3. Select Provisions for Recurring Delivery
                  </h2>
                  <p className="text-xs text-stone-500 font-sans">
                    Choose multiple items to build a unified replenishment delivery.
                  </p>
                </div>

                {bundleItems.length > 0 && (
                  <span className="text-xs font-mono text-emerald-900 font-semibold bg-emerald-50 px-2 py-1 rounded-xs border border-emerald-200">
                    {totalBundleCount} item{totalBundleCount !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <FeatureLoadingState
                    title="Loading auto-ship eligible recipes..."
                    message="Retrieving small-batch kettle recipes, frequency rules, and 10% recurring savings configurations."
                  />
                </div>
              ) : loadError ? (
                <FeatureErrorState
                  title="Subscription Catalog Notice"
                  message={loadError}
                  onRetry={loadEligibleProducts}
                  retryLabel="Reload Subscription Recipes"
                />
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProducts.map((product) => {
                    const matchedItem = bundleItems.find(
                      (item) => item.product.id === product.id
                    );

                    return (
                      <SubscriptionItemCard
                        key={product.id}
                        product={product}
                        selectedItem={matchedItem}
                        onUpdateItem={(variant, qty) => {
                          handleUpdateBundleItem(product, variant, qty);
                          setCurrentStep(2);
                        }}
                        onRemoveItem={() => {
                          const key = matchedItem?.id;
                          if (key) handleRemoveBundleItem(key);
                        }}
                      />
                    );
                  })}
                </div>
              ) : (
                <FeatureEmptyState
                  icon={Repeat}
                  badge="No Subscription Products Available"
                  title="No subscription products available"
                  description="None of the recipes matching your selected companion and department are currently configured for recurring delivery. Try adjusting your filters or browse one-time pantry staples."
                  primaryAction={{
                    label: 'Reset Filter Choices',
                    onClick: () => {
                      setSelectedPet('all');
                      setSelectedCategory('all');
                      setSearchQuery('');
                    },
                    icon: <RotateCcw className="w-3.5 h-3.5" />,
                  }}
                  secondaryAction={{
                    label: 'Explore General Provisions',
                    href: '/shop',
                  }}
                />
              )}
            </section>
          </div>

          {/* Right Column: Live Routine Bundle Summary (5 cols on lg) */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-20">
            <SubscriptionBundleSummary
              items={bundleItems}
              cadence={selectedCadence}
              onCadenceChange={setSelectedCadence}
              onUpdateQuantity={handleUpdateBundleQuantity}
              onRemoveItem={handleRemoveBundleItem}
              onAddToCart={handleAddBundleToCart}
              isAddingToCart={isAddingToCart}
            />
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar: Opens Bottom Sheet Drawer */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0.75rem))] shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="font-serif text-xs font-semibold text-stone-900 block">
            Routine Box ({totalBundleCount} item{totalBundleCount !== 1 ? 's' : ''})
          </span>
          <span className="font-mono text-xs font-bold text-emerald-950 tabular-nums">
            {formatCurrency(recurringSubtotal)} / cycle
          </span>
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={bundleItems.length === 0}
          onClick={() => setIsMobileReviewOpen(true)}
          leftIcon={<Repeat className="w-3.5 h-3.5" />}
        >
          Review Routine ({totalBundleCount})
        </Button>
      </div>

      {/* Mobile Review Drawer */}
      <AnimatePresence>
        {isMobileReviewOpen && (
          <div
            className="fixed inset-0 z-50 overflow-hidden lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Review Subscription Routine"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
              onClick={() => setIsMobileReviewOpen(false)}
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full"
              >
                <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
                  <h3 className="font-serif text-base font-semibold text-stone-900">
                    Review Your Routine Box
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsMobileReviewOpen(false)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 hover:text-stone-900"
                    aria-label="Close review"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <SubscriptionBundleSummary
                    items={bundleItems}
                    cadence={selectedCadence}
                    onCadenceChange={setSelectedCadence}
                    onUpdateQuantity={handleUpdateBundleQuantity}
                    onRemoveItem={handleRemoveBundleItem}
                    onAddToCart={handleAddBundleToCart}
                    isAddingToCart={isAddingToCart}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
