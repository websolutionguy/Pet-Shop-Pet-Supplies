'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { ProductCard } from '../ui/ProductCard';

interface RelatedProductsProps {
  currentProductId: string;
  relatedIds?: string[];
  petType?: string;
  categorySlug?: string;
  onQuickView?: (product: Product) => void;
}

export function RelatedProducts({
  currentProductId,
  relatedIds,
  petType,
  categorySlug,
  onQuickView,
}: RelatedProductsProps) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadRelated() {
      try {
        let loaded: Product[] = [];

        // 1. Try to load products from relatedProductIds
        if (relatedIds && relatedIds.length > 0) {
          const promises = relatedIds.map((id) => productService.getProductById(id));
          const results = await Promise.all(promises);
          loaded = results.filter((p): p is Product => p !== null && p.id !== currentProductId);
        }

        // 2. If fewer than 3, fallback to same petType or featured
        if (loaded.length < 3) {
          const all = await productService.getAll();
          const more = all.filter(
            (p) =>
              p.id !== currentProductId &&
              !loaded.some((existing) => existing.id === p.id) &&
              (petType ? p.petType === petType || p.petType === 'both' : true)
          );
          loaded = [...loaded, ...more].slice(0, 3);
        }

        if (isMounted) setItems(loaded.slice(0, 3));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRelated();

    return () => {
      isMounted = false;
    };
  }, [currentProductId, relatedIds, petType, categorySlug]);

  if (loading || items.length === 0) return null;

  return (
    <section className="space-y-6 pt-4">
      <div className="pb-4 border-b border-stone-200">
        <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-1 font-sans">
          <span>Complementary Kitchen Roster</span>
        </div>
        <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 tracking-tight">
          Pair with these Companion Staples
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
}
