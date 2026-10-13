'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { ProductCard } from '../ui/ProductCard';
import { ArrowRight } from 'lucide-react';

interface BestsellingShelfProps {
  onQuickView: (product: Product) => void;
  onViewAllCatalog: () => void;
}

export function BestsellingShelf({ onQuickView, onViewAllCatalog }: BestsellingShelfProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<'all' | 'dog' | 'cat'>('all');

  useEffect(() => {
    let isMounted = true;
    productService.getFeatured().then((featured) => {
      if (isMounted) setProducts(featured);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const displayed = products.filter((p) => {
    if (filter === 'all') return true;
    return p.petType === filter || p.petType === 'both';
  });

  return (
    <section className="bg-[#FAF8F5] border-b border-stone-200 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-1.5 font-sans">
              House Favorites
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 tracking-tight">
              Bestselling Kitchen Provisions
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-xl">
              Our most-requested small-batch recipes, loved by companion animals and trusted by veterinarians.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xs border border-stone-200 self-start md:self-end">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                filter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Provisions
            </button>
            <button
              type="button"
              onClick={() => setFilter('dog')}
              className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                filter === 'dog'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Canine
            </button>
            <button
              type="button"
              onClick={() => setFilter('cat')}
              className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                filter === 'cat'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Feline
            </button>
          </div>
        </div>

        {/* Shelf Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.slice(0, 3).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Bottom prompt */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onViewAllCatalog}
            className="inline-flex items-center gap-2 text-xs font-medium text-stone-800 hover:text-stone-950 underline underline-offset-8 cursor-pointer"
          >
            <span>Explore the complete 32-item provisions catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
