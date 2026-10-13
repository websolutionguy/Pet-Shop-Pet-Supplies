'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ReviewData } from '../../types/data';
import { reviewService } from '../../services/reviewService';
import { formatHumanDate } from '../../lib/utils';

interface ProductReviewsProps {
  productId: string;
  productName: string;
}

export function ProductReviews({ productId, productName }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  useEffect(() => {
    let isMounted = true;
    reviewService.getReviews(productId).then((res) => {
      if (!isMounted) return;
      if (res.length > 0) {
        setReviews(res);
      } else {
        reviewService.getFeaturedReviews().then((featured) => {
          if (isMounted) setReviews(featured.slice(0, 2));
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const displayReviews = reviews;

  return (
    <section id="reviews" className="space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-1 font-sans">
            <span>Verified Customer Reviews</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 tracking-tight">
            From Real Household Feeding Bowls
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-stone-600">
          <div className="flex items-center gap-0.5 text-amber-700">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="font-bold text-stone-900">4.9 / 5.0</span>
          <span>· 100% Verified Deliveries</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayReviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 flex flex-col justify-between shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-0.5 text-amber-700">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                {rev.verifiedPurchase && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                    Verified Routine Delivery
                  </span>
                )}
              </div>

              <h3 className="font-serif text-base font-medium text-stone-900 leading-snug">
                &ldquo;{rev.title}&rdquo;
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                {rev.comment}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
              <div>
                <strong className="text-stone-900 block font-medium">
                  {rev.author}
                </strong>
                <span className="text-stone-500 text-[11px]">{rev.location}</span>
              </div>

              <div className="text-right">
                <span className="text-stone-700 font-medium block">
                  Companion: {rev.petName}
                </span>
                <span className="text-stone-500 text-[11px] font-mono">
                  {rev.petBreed} ({rev.petAge})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
