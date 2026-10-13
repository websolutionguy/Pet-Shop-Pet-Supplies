'use client';

import React from 'react';
import { FilterSidebarContent } from './FilterSidebarContent';
import { ShopFilterState } from './types';
import { Category } from '../../types/category';
import { BrandData, ProductTypeData } from '../../types/data';

interface DesktopFiltersProps {
  filters: ShopFilterState;
  onChange: (patch: Partial<ShopFilterState>) => void;
  onReset: () => void;
  categories: Category[];
  brands: BrandData[];
  productTypes: ProductTypeData[];
  totalMatches: number;
}

export function DesktopFilters({
  filters,
  onChange,
  onReset,
  categories,
  brands,
  productTypes,
  totalMatches,
}: DesktopFiltersProps) {
  return (
    <aside
      className="hidden lg:block w-72 shrink-0 self-start sticky top-20 bg-stone-50/80 border border-stone-200/90 rounded-xs p-5 shadow-xs"
      aria-label="Product Catalog Filters"
    >
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-stone-200">
        <h2 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900">
          Refine Provisions
        </h2>
        <span className="font-mono text-xs text-stone-500 tabular-nums">
          {totalMatches} item{totalMatches !== 1 ? 's' : ''}
        </span>
      </div>

      <FilterSidebarContent
        filters={filters}
        onChange={onChange}
        onReset={onReset}
        categories={categories}
        brands={brands}
        productTypes={productTypes}
        totalMatches={totalMatches}
      />
    </aside>
  );
}
