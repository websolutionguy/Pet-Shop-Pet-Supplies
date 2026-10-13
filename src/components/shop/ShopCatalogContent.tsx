'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  Search,
  Check,
  ChevronDown,
  PawPrint,
} from 'lucide-react';
import { Product } from '../../types/product';
import { Category } from '../../types/category';
import { BrandData, ProductTypeData } from '../../types/data';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { ProductCard } from '../ui/ProductCard';
import { ProductQuickModal } from '../products/ProductQuickModal';
import { DesktopFilters } from './DesktopFilters';
import { MobileFilterDrawer } from './MobileFilterDrawer';
import { EmptyState } from './EmptyState';
import { FeatureErrorState } from '../ui/StateFeedback';
import {
  ShopFilterState,
  DEFAULT_FILTER_STATE,
  SORT_OPTIONS,
  PET_FILTER_OPTIONS,
  PRICE_RANGE_OPTIONS,
} from './types';

export function ShopCatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [productTypes, setProductTypes] = useState<ProductTypeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // UI states
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Initialize filters from URL search params
  const currentFilters: ShopFilterState = useMemo(() => {
    return {
      searchQuery: searchParams.get('q') || searchParams.get('search') || '',
      pet: searchParams.get('pet') || 'all',
      category: searchParams.get('category') || 'all',
      brand: searchParams.get('brand') || 'all',
      productType: searchParams.get('productType') || 'all',
      priceRange: searchParams.get('price') || searchParams.get('priceRange') || 'all',
      subscriptionOnly: searchParams.get('subscription') === 'true',
      reorderOnly: searchParams.get('reorder') === 'true',
      inStockOnly: searchParams.get('availability') === 'in-stock',
      sort: searchParams.get('sort') || 'featured',
    };
  }, [searchParams]);

  // Load initial product and category roster
  const loadInitialData = useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    Promise.all([
      productService.getAll(),
      categoryService.getAll(),
      productService.getBrands(),
      productService.getProductTypes(),
    ])
      .then(([prodList, catList, brandList, typeList]) => {
        setProducts(prodList);
        setCategories(catList);
        setBrands(brandList);
        setProductTypes(typeList);
      })
      .catch(() => {
        setLoadError(
          "We couldn't load the provisions catalog right now. Please check your network connection and try again."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      productService.getAll(),
      categoryService.getAll(),
      productService.getBrands(),
      productService.getProductTypes(),
    ])
      .then(([prodList, catList, brandList, typeList]) => {
        if (!isMounted) return;
        setProducts(prodList);
        setCategories(catList);
        setBrands(brandList);
        setProductTypes(typeList);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadError(
          "We couldn't load the provisions catalog right now. Please check your network connection and try again."
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync state changes back to URL
  const updateURLParams = useCallback(
    (patch: Partial<ShopFilterState>) => {
      const merged = { ...currentFilters, ...patch };
      const params = new URLSearchParams();

      if (merged.searchQuery) params.set('q', merged.searchQuery);
      if (merged.pet && merged.pet !== 'all') params.set('pet', merged.pet);
      if (merged.category && merged.category !== 'all') params.set('category', merged.category);
      if (merged.brand && merged.brand !== 'all') params.set('brand', merged.brand);
      if (merged.productType && merged.productType !== 'all') params.set('productType', merged.productType);
      if (merged.priceRange && merged.priceRange !== 'all') params.set('price', merged.priceRange);
      if (merged.subscriptionOnly) params.set('subscription', 'true');
      if (merged.reorderOnly) params.set('reorder', 'true');
      if (merged.inStockOnly) params.set('availability', 'in-stock');
      if (merged.sort && merged.sort !== 'featured') params.set('sort', merged.sort);

      const queryString = params.toString();
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(targetUrl, { scroll: false });
    },
    [currentFilters, pathname, router]
  );

  const handleResetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  // Filter and sort products based on active criteria
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // 1. Search Query
    if (currentFilters.searchQuery.trim()) {
      const q = currentFilters.searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.dietaryTags.some((tag) => tag.toLowerCase().includes(q)) ||
          p.ingredients?.some((ing) => ing.toLowerCase().includes(q))
        );
      });
    }

    // 2. Pet Type Filter
    if (currentFilters.pet !== 'all') {
      const pet = currentFilters.pet.toLowerCase();
      if (pet === 'dog' || pet === 'dogs') {
        list = list.filter(
          (p) => p.petType === 'dog' || p.petType === 'both' || p.rawPetType === 'dogs' || p.rawPetType === 'dog'
        );
      } else if (pet === 'cat' || pet === 'cats') {
        list = list.filter(
          (p) => p.petType === 'cat' || p.petType === 'both' || p.rawPetType === 'cats' || p.rawPetType === 'cat'
        );
      } else if (pet === 'small-pets' || pet === 'small-pet') {
        list = list.filter(
          (p) => p.rawPetType === 'small-pets' || p.petType === 'both'
        );
      } else if (pet === 'bird' || pet === 'birds') {
        list = list.filter(
          (p) => p.rawPetType === 'birds' || p.rawPetType === 'bird'
        );
      } else if (pet === 'fish') {
        list = list.filter((p) => p.rawPetType === 'fish');
      }
    }

    // 3. Category Filter
    if (currentFilters.category !== 'all') {
      const cat = currentFilters.category.toLowerCase();
      if (cat === 'food') {
        list = list.filter(
          (p) => p.categoryId === 'dog-food' || p.categoryId === 'cat-food' || p.categoryId === 'food'
        );
      } else {
        list = list.filter((p) => p.categoryId === cat);
      }
    }

    // 4. Brand Filter
    if (currentFilters.brand !== 'all') {
      list = list.filter(
        (p) => p.brand.toLowerCase() === currentFilters.brand.toLowerCase()
      );
    }

    // 5. Product Type Filter
    if (currentFilters.productType !== 'all') {
      list = list.filter((p) => p.productType === currentFilters.productType);
    }

    // 6. Price Range Filter
    if (currentFilters.priceRange !== 'all') {
      const range = PRICE_RANGE_OPTIONS.find((r) => r.id === currentFilters.priceRange);
      if (range && range.min !== undefined && range.max !== undefined) {
        list = list.filter(
          (p) => p.basePrice >= range.min && p.basePrice <= range.max
        );
      }
    }

    // 7. Subscription Eligibility Filter
    if (currentFilters.subscriptionOnly) {
      list = list.filter((p) => p.subscription.eligible);
    }

    // 8. Reorder Eligibility Filter
    if (currentFilters.reorderOnly) {
      list = list.filter((p) => p.isQuickReorderCandidate);
    }

    // 9. In-Stock Filter
    if (currentFilters.inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // 10. Sort
    switch (currentFilters.sort) {
      case 'price-low':
        list.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-high':
        list.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'new':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // 'featured'
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [products, currentFilters]);

  // Count active filters (excluding default sort)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (currentFilters.searchQuery) count++;
    if (currentFilters.pet !== 'all') count++;
    if (currentFilters.category !== 'all') count++;
    if (currentFilters.brand !== 'all') count++;
    if (currentFilters.productType !== 'all') count++;
    if (currentFilters.priceRange !== 'all') count++;
    if (currentFilters.subscriptionOnly) count++;
    if (currentFilters.reorderOnly) count++;
    if (currentFilters.inStockOnly) count++;
    return count;
  }, [currentFilters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header Banner & Breadcrumbs */}
      <div className="border-b border-stone-200 pb-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-1.5 font-sans">
              <span className="w-1.5 h-1.5 bg-[#1E3A2F] rounded-full" />
              <span>Full Provisions Catalog</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-500 font-mono font-normal">Independent Kitchen Roster</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight">
              Small-Batch Pet Provisions
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              Explore whole-protein oven-baked foods, single-ingredient freeze-dried bites, cold-pressed
              botanical supplements, and handcrafted accessories sourced directly from Pacific Northwest makers.
            </p>

            {searchParams.get('petName') && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200/90 rounded-xs flex items-center justify-between text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <PawPrint className="w-4 h-4 text-emerald-800 shrink-0" />
                  <span>
                    Showing provisions tailored for <strong>{searchParams.get('petName')}</strong> based on their companion profile.
                  </span>
                </div>
                <a
                  href="/account/pets"
                  className="underline underline-offset-2 font-mono text-[11px] text-emerald-900 hover:text-emerald-700 shrink-0"
                >
                  View Profile →
                </a>
              </div>
            )}
          </div>

          <div className="text-xs text-stone-500 font-mono shrink-0">
            Showing <strong className="text-stone-900 font-bold">{filteredProducts.length}</strong> of{' '}
            {products.length} provisions
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFilterCount > 0 && (
          <div className="mt-6 pt-4 border-t border-stone-200 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-stone-400 font-semibold mr-1">
              Active Filters:
            </span>

            {currentFilters.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 rounded-xs text-xs">
                Keyword: &ldquo;{currentFilters.searchQuery}&rdquo;
                <button
                  type="button"
                  onClick={() => updateURLParams({ searchQuery: '' })}
                  className="hover:text-stone-950 p-0.5 cursor-pointer"
                  aria-label="Remove keyword filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {currentFilters.pet !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 rounded-xs text-xs capitalize">
                Pet: {currentFilters.pet}
                <button
                  type="button"
                  onClick={() => updateURLParams({ pet: 'all' })}
                  className="hover:text-stone-950 p-0.5 cursor-pointer"
                  aria-label="Remove pet filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {currentFilters.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 rounded-xs text-xs">
                Category: {currentFilters.category.replace(/-/g, ' ')}
                <button
                  type="button"
                  onClick={() => updateURLParams({ category: 'all' })}
                  className="hover:text-stone-950 p-0.5 cursor-pointer"
                  aria-label="Remove category filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {currentFilters.brand !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 rounded-xs text-xs">
                Brand: {currentFilters.brand}
                <button
                  type="button"
                  onClick={() => updateURLParams({ brand: 'all' })}
                  className="hover:text-stone-950 p-0.5 cursor-pointer"
                  aria-label="Remove brand filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {currentFilters.productType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 rounded-xs text-xs">
                Type: {currentFilters.productType.replace(/-/g, ' ')}
                <button
                  type="button"
                  onClick={() => updateURLParams({ productType: 'all' })}
                  className="hover:text-stone-950 p-0.5 cursor-pointer"
                  aria-label="Remove product type filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {currentFilters.priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 rounded-xs text-xs">
                Price: {PRICE_RANGE_OPTIONS.find((p) => p.id === currentFilters.priceRange)?.label}
                <button
                  type="button"
                  onClick={() => updateURLParams({ priceRange: 'all' })}
                  className="hover:text-stone-950 p-0.5 cursor-pointer"
                  aria-label="Remove price filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {currentFilters.subscriptionOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xs text-xs font-medium">
                Auto-Ship Save 10%
                <button
                  type="button"
                  onClick={() => updateURLParams({ subscriptionOnly: false })}
                  className="hover:text-emerald-950 p-0.5 cursor-pointer"
                  aria-label="Remove subscription filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {currentFilters.reorderOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 rounded-xs text-xs">
                Reorder Staples
                <button
                  type="button"
                  onClick={() => updateURLParams({ reorderOnly: false })}
                  className="hover:text-stone-950 p-0.5 cursor-pointer"
                  aria-label="Remove reorder filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {currentFilters.inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-stone-100 border border-stone-200 text-stone-800 rounded-xs text-xs">
                In-Stock Only
                <button
                  type="button"
                  onClick={() => updateURLParams({ inStockOnly: false })}
                  className="hover:text-stone-950 p-0.5 cursor-pointer"
                  aria-label="Remove in-stock filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-stone-500 hover:text-stone-950 underline underline-offset-4 ml-1 cursor-pointer"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Main Layout: Sticky Desktop Sidebar + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <DesktopFilters
          filters={currentFilters}
          onChange={updateURLParams}
          onReset={handleResetFilters}
          categories={categories}
          brands={brands}
          productTypes={productTypes}
          totalMatches={filteredProducts.length}
        />

        {/* Main Content Area */}
        <div className="flex-1 w-full min-w-0">
          {/* Mobile & Tablet Filter Trigger Bar + Sort Controls */}
          <div className="flex items-center justify-between gap-3 pb-4 mb-6 border-b border-stone-200/80">
            {/* Mobile Filter Drawer Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden min-h-[44px] inline-flex items-center gap-2 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xs text-xs font-semibold shadow-xs cursor-pointer"
              aria-label="Open filter settings"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Refine Provisions</span>
              {activeFilterCount > 0 && (
                <span className="font-mono text-[10px] bg-white text-stone-900 px-1.5 py-0.2 rounded-full font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 ml-auto">
              <label
                htmlFor="sort-select"
                className="text-xs font-medium text-stone-500 hidden sm:inline"
              >
                Sort by:
              </label>
              <select
                id="sort-select"
                value={currentFilters.sort}
                onChange={(e) => updateURLParams({ sort: e.target.value })}
                className="min-h-[40px] px-3 py-1.5 bg-white border border-stone-300 rounded-xs text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-900 cursor-pointer"
                aria-label="Sort product catalog"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Grid, Loading, Error, or Empty State */}
          {isLoading ? (
            <div className="space-y-4">
              <div className="p-3 bg-stone-100/70 border border-stone-200 rounded-xs text-xs font-mono text-stone-600 flex items-center gap-2" role="status" aria-live="polite">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>Product catalog loading · Preparing small-batch kibbles, air-dried treats, and cold-pressed botanical supplements...</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-stone-200 rounded-xs p-4 animate-pulse space-y-4"
                  >
                    <div className="aspect-4/3 bg-stone-100 rounded-xs" />
                    <div className="h-4 bg-stone-100 rounded-xs w-3/4" />
                    <div className="h-3 bg-stone-100 rounded-xs w-1/2" />
                    <div className="h-8 bg-stone-100 rounded-xs" />
                  </div>
                ))}
              </div>
            </div>
          ) : loadError ? (
            <FeatureErrorState
              title="Catalog Sync Notice"
              message={loadError}
              onRetry={loadInitialData}
              retryLabel="Reload Catalog"
            />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              onResetFilters={handleResetFilters}
              activeFilterCount={activeFilterCount}
              searchQuery={currentFilters.searchQuery}
              isSubscriptionFilter={currentFilters.subscriptionOnly}
              onSelectSuggestion={(patch) => updateURLParams(patch)}
            />
          )}
        </div>
      </div>

      {/* Mobile Drawer Filter (Practical drawer, not just shrunken desktop) */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={currentFilters}
        onChange={updateURLParams}
        onReset={handleResetFilters}
        categories={categories}
        brands={brands}
        productTypes={productTypes}
        totalMatches={filteredProducts.length}
        activeFilterCount={activeFilterCount}
      />

      {/* Quick View Modal */}
      <ProductQuickModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
