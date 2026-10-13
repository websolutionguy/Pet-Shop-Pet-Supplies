'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types/product';
import { Category } from '../../types/category';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { ProductCard } from './ProductCard';
import { usePetProfile } from '../../providers/PetProfileProvider';
import { FeatureEmptyState, FeatureLoadingState } from '../ui/StateFeedback';

interface ProductCatalogProps {
  onQuickView: (product: Product) => void;
  externalPetFilter?: string;
}

export function ProductCatalog({ onQuickView, externalPetFilter }: ProductCatalogProps) {
  const { selectedPet } = usePetProfile();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userSpeciesFilter, setUserSpeciesFilter] = useState<'all' | 'dog' | 'cat' | null>(null);
  const [userSubscriptionOnly, setUserSubscriptionOnly] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  useEffect(() => {
    let isMounted = true;
    Promise.all([productService.getAll(), categoryService.getAll()])
      .then(([prods, cats]) => {
        if (!isMounted) return;
        setProducts(prods);
        setCategories(cats);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Derive active filters without cascading useEffect state setters
  const activeSpecies =
    userSpeciesFilter ??
    (selectedPet
      ? selectedPet.species
      : externalPetFilter === 'dog' || externalPetFilter === 'cat'
      ? externalPetFilter
      : 'all');

  const activeSubscriptionOnly =
    userSubscriptionOnly ?? (externalPetFilter === 'subscriptions');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by pet species
    if (activeSpecies !== 'all') {
      result = result.filter(
        (p) => p.petType === activeSpecies || p.petType === 'both'
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryId === selectedCategory);
    } else if (externalPetFilter === 'food') {
      result = result.filter((p) => p.categoryId === 'dog-food' || p.categoryId === 'cat-food');
    } else if (externalPetFilter === 'treats') {
      result = result.filter((p) => p.categoryId === 'treats');
    } else if (externalPetFilter === 'toys') {
      result = result.filter((p) => p.categoryId === 'toys');
    } else if (externalPetFilter === 'small-pets') {
      result = result.filter((p) => p.petType === 'both' || p.categoryId === 'treats');
    }

    // Filter by subscription eligibility
    if (activeSubscriptionOnly) {
      result = result.filter((p) => p.subscription.eligible);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, activeSpecies, selectedCategory, externalPetFilter, activeSubscriptionOnly, sortBy]);

  return (
    <section id="catalog" className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <div className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              The Seasonal Roster
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-serif font-semibold text-stone-900 tracking-tight">
              Small-Batch Pet Provisions
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-500">
              {filteredProducts.length} items formulated with honest ingredients & steady reorder options.
            </p>
          </div>

          {/* Species tabs (Optimized segmented control on mobile) */}
          <div className="w-full sm:w-auto flex items-center gap-1 p-1 bg-stone-100 rounded-xs self-stretch sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setUserSpeciesFilter('all')}
              className={`flex-1 sm:flex-none px-3.5 py-2.5 font-medium rounded-xs transition-colors cursor-pointer min-h-[44px] flex items-center justify-center text-center touch-manipulation ${
                activeSpecies === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Animals
            </button>
            <button
              type="button"
              onClick={() => setUserSpeciesFilter('dog')}
              className={`flex-1 sm:flex-none px-3.5 py-2.5 font-medium rounded-xs transition-colors cursor-pointer min-h-[44px] flex items-center justify-center text-center touch-manipulation ${
                activeSpecies === 'dog'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Dog Provisions
            </button>
            <button
              type="button"
              onClick={() => setUserSpeciesFilter('cat')}
              className={`flex-1 sm:flex-none px-3.5 py-2.5 font-medium rounded-xs transition-colors cursor-pointer min-h-[44px] flex items-center justify-center text-center touch-manipulation ${
                activeSpecies === 'cat'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Feline Nutrition
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs border-b border-stone-200/80">
          {/* Categories: Smooth horizontal swipe on mobile, wrap on desktop */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none touch-pan-x sm:flex-wrap w-full md:w-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xs transition-colors font-medium whitespace-nowrap shrink-0 min-h-[44px] flex items-center touch-manipulation ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xs transition-colors font-medium whitespace-nowrap shrink-0 min-h-[44px] flex items-center touch-manipulation ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Controls: Subscription filter + Sort */}
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 w-full md:w-auto shrink-0">
            {/* Auto-Ship Only toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700 min-h-[44px] py-1">
              <input
                type="checkbox"
                checked={activeSubscriptionOnly}
                onChange={(e) => setUserSubscriptionOnly(e.target.checked)}
                className="w-4 h-4 text-stone-900 rounded-xs border-stone-300 focus:ring-stone-800 accent-stone-900 cursor-pointer"
              />
              <span className="font-medium text-xs">Auto-Ship (Save 10%)</span>
            </label>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-stone-200 px-3 py-2 rounded-xs min-h-[44px]">
              <span className="text-stone-400 font-mono text-[11px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-stone-800 font-medium focus:outline-none cursor-pointer text-xs"
              >
                <option value="featured">Featured Fresh</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid (3 columns desktop, 2 columns tablet) */}
        {isLoading ? (
          <div className="mt-8">
            <FeatureLoadingState
              title="Loading seasonal small-batch catalog..."
              message="Fetching freshly baked kettle batches, single-ingredient chews, and cold-pressed oils."
            />
          </div>
        ) : filteredProducts.length === 0 ? (
          activeSubscriptionOnly ? (
            <FeatureEmptyState
              title="No subscription products available in this category"
              description="Artisan leather gear, grooming brushes, and seasonal craft provisions are one-time purchases only. Whole-food kibble, freeze-dried organ treats, and feline broths remain available for recurring auto-ship."
              primaryAction={{
                label: 'Show One-Time Provisions in This Category',
                onClick: () => setUserSubscriptionOnly(false),
              }}
              secondaryAction={{
                label: 'Reset All Catalog Filters',
                onClick: () => {
                  setSelectedCategory('all');
                  setUserSpeciesFilter('all');
                  setUserSubscriptionOnly(false);
                },
              }}
              className="mt-6"
            />
          ) : (
            <FeatureEmptyState
              title="No recipes found for your current filter combination"
              description={`We couldn't locate pantry provisions matching your active filters (${selectedCategory !== 'all' ? selectedCategory : 'all categories'}, ${activeSpecies !== 'all' ? activeSpecies + ' provisions' : 'all species'}). Try broadening your selection.`}
              primaryAction={{
                label: 'Reset Filters to All Provisions',
                onClick: () => {
                  setSelectedCategory('all');
                  setUserSpeciesFilter('all');
                  setUserSubscriptionOnly(false);
                },
              }}
              className="mt-6"
            />
          )
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
