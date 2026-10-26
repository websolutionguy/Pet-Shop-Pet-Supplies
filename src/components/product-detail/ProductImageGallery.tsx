'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';
import { AppImage } from '../ui/AppImage';


interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  brand: string;
  isQuickReorderCandidate?: boolean;
}

export function ProductImageGallery({
  images,
  productName,
  brand,
  isQuickReorderCandidate,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const displayImages =
    images.length > 0
      ? images
      : ['/src/assets/images/hero_dog_natural_1790396014202.jpg'];
  const activeImage = displayImages[selectedIndex] || displayImages[0];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (index + 1) % displayImages.length;
      setSelectedIndex(nextIndex);
      const nextBtn = document.getElementById(`gallery-thumb-${nextIndex}`);
      nextBtn?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (index - 1 + displayImages.length) % displayImages.length;
      setSelectedIndex(prevIndex);
      const prevBtn = document.getElementById(`gallery-thumb-${prevIndex}`);
      prevBtn?.focus();
    }
  };

  return (
    <section className="space-y-4" aria-label={`Photo gallery for ${productName}`}>
      {/* Screen-reader live update for current image */}
      <div className="sr-only" role="status" aria-live="polite">
        Showing image {selectedIndex + 1} of {displayImages.length} for {productName}
      </div>

      {/* Primary Display Viewport with cross-fade image transition */}
      <div
        id="main-product-image"
        className="relative aspect-4/3 sm:aspect-1/1 bg-stone-100 rounded-xs overflow-hidden border border-stone-200 shadow-xs"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0.85 }}
            animate={{ opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0.85 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <AppImage
              src={activeImage}
              alt={`${productName} — view ${selectedIndex + 1} of ${displayImages.length}`}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Quiet Editorial Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start z-10 pointer-events-none">
          <span className="font-mono text-[10px] text-stone-700 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-xs border border-stone-200/80 shadow-xs">
            {brand}
          </span>
          {isQuickReorderCandidate && (
            <span className="font-mono text-[10px] text-emerald-900 bg-emerald-50/95 backdrop-blur-xs px-2 py-0.5 rounded-xs border border-emerald-200 shadow-xs font-medium">
              Pantry Essential
            </span>
          )}
        </div>
      </div>

      {/* Thumbnails list with animated selection indicator */}
      {displayImages.length > 1 && (
        <div
          className="flex items-center gap-3 overflow-x-auto pb-1"
          role="tablist"
          aria-label="Product photography thumbnails (Use left/right arrows to switch)"
        >
          {displayImages.map((img, idx) => {
            const isSelected = selectedIndex === idx;

            return (
              <button
                key={idx}
                id={`gallery-thumb-${idx}`}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls="main-product-image"
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedIndex(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={cn(
                  'relative w-16 h-16 sm:w-20 sm:h-20 rounded-xs overflow-hidden shrink-0 cursor-pointer bg-stone-100 transition-opacity focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 outline-none',
                  isSelected ? 'opacity-100' : 'opacity-65 hover:opacity-100'
                )}
                aria-label={`View photo ${idx + 1} of ${displayImages.length} for ${productName}${isSelected ? ' (currently showing)' : ''}`}
              >
                <AppImage
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  loading="lazy"
                  sizes="80px"
                  className="object-cover"
                  showSpinner={false}
                />

                {/* Active border indicator communicating selection */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-xs pointer-events-none transition-all duration-200',
                    isSelected
                      ? 'border-2 border-stone-900 ring-1 ring-stone-900'
                      : 'border border-stone-200'
                  )}
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
