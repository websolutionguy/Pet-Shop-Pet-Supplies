'use client';

import React from 'react';
import { Search, RotateCcw, Check, Sparkles, Repeat } from 'lucide-react';
import {
  ShopFilterState,
  PET_FILTER_OPTIONS,
  PRICE_RANGE_OPTIONS,
} from './types';
import { Category } from '../../types/category';
import { BrandData, ProductTypeData } from '../../types/data';

interface FilterSidebarContentProps {
  filters: ShopFilterState;
  onChange: (patch: Partial<ShopFilterState>) => void;
  onReset: () => void;
  categories: Category[];
  brands: BrandData[];
  productTypes: ProductTypeData[];
  totalMatches: number;
}

export function FilterSidebarContent({
  filters,
  onChange,
  onReset,
  categories,
  brands,
  productTypes,
  totalMatches,
}: FilterSidebarContentProps) {
  const isAnyFilterActive =
    filters.searchQuery !== '' ||
    filters.pet !== 'all' ||
    filters.category !== 'all' ||
    filters.brand !== 'all' ||
    filters.productType !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.subscriptionOnly ||
    filters.reorderOnly ||
    filters.inStockOnly;

  return (
    <div className="space-y-6 text-xs text-stone-700">
      {/* Search Input Filter */}
      <div>
        <label
          htmlFor="catalog-search"
          className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-1.5 font-mono"
        >
          Keyword Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5 pointer-events-none" />
          <input
            id="catalog-search"
            type="search"
            value={filters.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            placeholder="Search salmon, liver, chews..."
            className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-xs text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900"
          />
        </div>
      </div>

      {/* Pet Companion Filter */}
      <div className="pt-4 border-t border-stone-200">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-2 font-mono">
          Companion Animal
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {PET_FILTER_OPTIONS.map((opt) => {
            const isSelected = filters.pet === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ pet: opt.id })}
                className={`py-1.5 px-2.5 text-left rounded-xs border transition-colors cursor-pointer text-xs ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white font-medium shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-400 text-stone-700'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Routine & Replenishment Quick Toggles */}
      <div className="pt-4 border-t border-stone-200 space-y-2">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-1 font-mono">
          Replenishment Programs
        </label>

        {/* Subscription Eligible Toggle */}
        <label className="flex items-center gap-2.5 p-2 bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200/80 rounded-xs cursor-pointer select-none transition-colors">
          <input
            type="checkbox"
            checked={filters.subscriptionOnly}
            onChange={(e) => onChange({ subscriptionOnly: e.target.checked })}
            className="w-4 h-4 accent-emerald-800 rounded-xs cursor-pointer"
          />
          <div className="flex-1">
            <span className="font-semibold text-emerald-950 block">
              Auto-Ship & Save 10%
            </span>
            <span className="text-[10px] text-emerald-800 leading-tight block">
              Recurring pantry delivery eligible
            </span>
          </div>
        </label>

        {/* Reorder Candidate Toggle */}
        <label className="flex items-center gap-2.5 p-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xs cursor-pointer select-none transition-colors">
          <input
            type="checkbox"
            checked={filters.reorderOnly}
            onChange={(e) => onChange({ reorderOnly: e.target.checked })}
            className="w-4 h-4 accent-stone-900 rounded-xs cursor-pointer"
          />
          <div className="flex-1">
            <span className="font-semibold text-stone-900 block">
              Quick Reorder Staples
            </span>
            <span className="text-[10px] text-stone-500 leading-tight block">
              Pantry essentials for high-frequency restock
            </span>
          </div>
        </label>

        {/* Availability: In Stock Only */}
        <label className="flex items-center gap-2.5 px-2 py-1.5 hover:bg-stone-50 rounded-xs cursor-pointer select-none transition-colors">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => onChange({ inStockOnly: e.target.checked })}
            className="w-4 h-4 accent-stone-900 rounded-xs cursor-pointer"
          />
          <span className="text-stone-800 font-medium">In-Stock Provisions Only</span>
        </label>
      </div>

      {/* Category Filter */}
      <div className="pt-4 border-t border-stone-200">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-2 font-mono">
          Provisions Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
          className="w-full p-2 bg-white border border-stone-300 rounded-xs text-xs text-stone-900 focus:outline-none focus:border-stone-900 cursor-pointer"
        >
          <option value="all">All Categories ({categories.length})</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>
              {cat.name} ({cat.productCount})
            </option>
          ))}
        </select>
      </div>

      {/* Product Type Filter */}
      <div className="pt-4 border-t border-stone-200">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-2 font-mono">
          Product Formulation
        </label>
        <select
          value={filters.productType}
          onChange={(e) => onChange({ productType: e.target.value })}
          className="w-full p-2 bg-white border border-stone-300 rounded-xs text-xs text-stone-900 focus:outline-none focus:border-stone-900 cursor-pointer"
        >
          <option value="all">All Formulations</option>
          {productTypes.map((pt) => (
            <option key={pt.id} value={pt.id}>
              {pt.name}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="pt-4 border-t border-stone-200">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-2 font-mono">
          Ranch & Kitchen Brand
        </label>
        <select
          value={filters.brand}
          onChange={(e) => onChange({ brand: e.target.value })}
          className="w-full p-2 bg-white border border-stone-300 rounded-xs text-xs text-stone-900 focus:outline-none focus:border-stone-900 cursor-pointer"
        >
          <option value="all">All Brands ({brands.length})</option>
          {brands.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name} ({b.origin})
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-stone-200">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 block mb-2 font-mono">
          Price Range
        </label>
        <div className="space-y-1">
          {PRICE_RANGE_OPTIONS.map((range) => {
            const isSelected = filters.priceRange === range.id;
            return (
              <label
                key={range.id}
                className="flex items-center gap-2 py-1 px-1.5 hover:bg-stone-50 rounded-xs cursor-pointer text-stone-700"
              >
                <input
                  type="radio"
                  name="price-range"
                  checked={isSelected}
                  onChange={() => onChange({ priceRange: range.id })}
                  className="w-3.5 h-3.5 accent-stone-900 cursor-pointer"
                />
                <span className={isSelected ? 'font-medium text-stone-950' : ''}>
                  {range.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Reset Action */}
      {isAnyFilterActive && (
        <div className="pt-4 border-t border-stone-200">
          <button
            type="button"
            onClick={onReset}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-stone-600 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 rounded-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
