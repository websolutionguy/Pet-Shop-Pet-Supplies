'use client';

import React, { useState, useEffect } from 'react';
import { ReviewCard } from './ReviewCard';
import { reviewService } from '../../services/reviewService';
import { ReviewData } from '../../types/data';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { Filter, Star, CheckCircle, Package } from 'lucide-react';
import { FeatureEmptyState, FeatureLoadingState } from '../ui/StateFeedback';

export function ReviewsListView() {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('all');

  useEffect(() => {
    let isMounted = true;
    Promise.all([reviewService.getAll(), productService.getAll()])
      .then(([revs, list]) => {
        if (!isMounted) return;
        setReviews(revs);
        const map: Record<string, Product> = {};
        list.forEach((p) => {
          map[p.id] = p;
        });
        setProducts(map);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter strictly according to JSON data without manufactured metrics
  const filteredReviews = reviews.filter((r) => {
    if (ratingFilter !== 'all' && r.rating !== ratingFilter) {
      return false;
    }
    if (verifiedFilter && !(r.verified === true || r.verifiedPurchase === true)) {
      return false;
    }
    if (selectedProductId !== 'all' && r.productId !== selectedProductId) {
      return false;
    }
    return true;
  });

  // Extract unique products that actually have reviews in the JSON
  const reviewedProductIds = Array.from(new Set(reviews.map((r) => r.productId)));

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="bg-stone-900 text-stone-100 rounded-xs p-6 sm:p-10 border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold block">
            Independent Customer Notes
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
            Direct Pantry Feedback &amp; Experiences
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Unfiltered notes and observations shared by households feeding Rowan &amp; Hound small-batch provisions across the Pacific Northwest.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white border border-stone-200/90 rounded-xs shadow-2xs flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          {/* Rating Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) =>
                setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-xs text-xs font-mono text-stone-800 focus:outline-none"
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
            </select>
          </div>

          {/* Product Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500">Provision:</span>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-xs text-xs font-mono text-stone-800 focus:outline-none max-w-xs"
            >
              <option value="all">All Provisions</option>
              {reviewedProductIds.map((pid) => (
                <option key={pid} value={pid}>
                  {products[pid]?.name || pid}
                </option>
              ))}
            </select>
          </div>

          {/* Verified Toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none pl-1">
            <input
              type="checkbox"
              checked={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.checked)}
              className="rounded-xs accent-stone-900"
            />
            <span className="text-stone-700">Verified buyers only</span>
          </label>
        </div>

        <div className="text-stone-500">
          Showing {filteredReviews.length} record{filteredReviews.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Reviews Stream */}
      {isLoading ? (
        <FeatureLoadingState
          title="Loading customer feeding notes..."
          message="Retrieving verified reviews and pet companion feedback from Oregon and Washington."
        />
      ) : filteredReviews.length === 0 ? (
        <FeatureEmptyState
          icon={Star}
          title="No customer notes match this filter"
          description="None of the verified pantry customer notes match your selected star rating or product filter. Reset your filters to read feedback across all recipes."
          primaryAction={{
            label: 'Clear Review Filters',
            onClick: () => {
              setRatingFilter('all');
              setVerifiedFilter(false);
              setSelectedProductId('all');
            },
          }}
          compact={true}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              product={products[review.productId]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
