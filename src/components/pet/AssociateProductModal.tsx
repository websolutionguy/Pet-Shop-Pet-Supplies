'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { X, Search, Check, Star, Sparkles, Plus, Trash2 } from 'lucide-react';
import { Product } from '../../types/product';
import { PetProfile } from '../../types/pet';
import { productService } from '../../services/productService';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import { AppImage } from '../ui/AppImage';


interface AssociateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: PetProfile;
  onToggleFavorite: (petId: string, productId: string) => void;
}

export function AssociateProductModal({
  isOpen,
  onClose,
  pet,
  onToggleFavorite,
}: AssociateProductModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    productService
      .getAll()
      .then((prods) => {
        if (isMounted) setProducts(prods);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products by pet species and search
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Match pet species if possible
    if (pet.species === 'dog') {
      list = list.filter((p) => p.petType === 'dog' || p.petType === 'both');
    } else if (pet.species === 'cat') {
      list = list.filter((p) => p.petType === 'cat' || p.petType === 'both');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [products, pet.species, searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-xs border border-stone-200 shadow-2xl z-10 overflow-hidden my-8 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="font-serif font-semibold text-stone-900 text-base">
              Associate Favorite Provisions for {pet.name}
            </h3>
            <span className="text-[11px] text-stone-500 font-mono">
              Mark recipes and staples {pet.name} loves for fast reordering and curated discovery
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-stone-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search recipes for ${pet.name} (e.g. kibble, venison, oil)...`}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xs text-xs text-stone-900 focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>

        {/* Product List */}
        <div className="p-4 overflow-y-auto divide-y divide-stone-100 flex-1 space-y-3">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-stone-500">
              Loading provisions catalog...
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((prod) => {
              const isFav = pet.favoriteProductIds?.includes(prod.id);

              return (
                <div
                  key={prod.id}
                  className="pt-3 first:pt-0 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-xs overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                      {prod.primaryImage ? (
                        <AppImage
                          src={prod.primaryImage}
                          alt={prod.name}
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

                    <div className="min-w-0">
                      <span className="text-[10px] text-stone-500 font-mono block">
                        {prod.brand} · {prod.categoryName}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm font-medium text-stone-900 truncate">
                        {prod.name}
                      </h4>
                      <span className="font-mono text-xs text-stone-700 tabular-nums">
                        {formatCurrency(prod.basePrice)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleFavorite(pet.id, prod.id)}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-xs font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1.5',
                      isFav
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-300 hover:bg-red-50 hover:text-red-800 hover:border-red-300'
                        : 'bg-stone-50 text-stone-700 border border-stone-300 hover:bg-stone-100'
                    )}
                  >
                    {isFav ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-800" />
                        <span>Favorite</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Associate</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-stone-500">
              No matching recipes found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500 font-mono">
            {pet.favoriteProductIds?.length || 0} provision(s) marked for {pet.name}
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
