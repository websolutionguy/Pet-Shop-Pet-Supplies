'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { reviewService } from '../../services/reviewService';
import { ReviewData } from '../../types/data';

interface ReviewsSectionProps {
  initialReviews?: ReviewData[];
}

export function ReviewsSection({ initialReviews }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewData[]>(initialReviews || []);

  useEffect(() => {
    if (initialReviews && initialReviews.length > 0) return;
    let isMounted = true;
    reviewService.getFeaturedReviews().then((featured) => {
      if (isMounted) setReviews(featured.slice(0, 3));
    });
    return () => {
      isMounted = false;
    };
  }, [initialReviews]);

  const leadReview = reviews[0];
  const secondaryReviews = reviews.slice(1, 3);

  return (
    <section className="bg-white border-b border-stone-200 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-1.5 font-sans">
              Companion Field Reports
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-stone-900 tracking-tight">
              Observed in feeding bowls across the Pacific Northwest.
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-xl">
              Authentic feedback from veterinary technicians, working canine handlers, and companion guardians in Oregon and Washington.
            </p>
          </div>

          <div className="text-xs text-stone-500 font-mono">
            <span>Independent Regional Household Notes</span>
          </div>
        </div>

        {/* Asymmetric Editorial Reviews Composition (Lead Pulled Quote + Secondary Field Reports) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Lead Pulled Quote (5 cols on lg) */}
          {leadReview && (
            <div className="lg:col-span-5 bg-[#FAF9F6] border border-stone-200/90 rounded-xs p-6 sm:p-8 flex flex-col justify-between shadow-2xs">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-0.5 text-stone-800">
                    {Array.from({ length: leadReview.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <span className="font-mono text-[10px] text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded-xs border border-emerald-300 font-semibold">
                    Verified Auto-Ship Routine
                  </span>
                </div>

                <blockquote className="font-serif text-xl sm:text-2xl font-normal text-stone-900 leading-snug">
                  &ldquo;{leadReview.comment}&rdquo;
                </blockquote>
              </div>

              <div className="pt-6 border-t border-stone-200 mt-6">
                <p className="font-serif text-sm font-semibold text-stone-900">
                  {leadReview.author || leadReview.customerName || 'Companion Guardian'}
                </p>
                <p className="text-[11px] font-mono text-stone-500">
                  {leadReview.petBreed ? `${leadReview.petName ? leadReview.petName + ' · ' : ''}${leadReview.petBreed}` : 'Verified Guardian'} · {leadReview.location || 'Portland, OR'}
                </p>
                <p className="text-[10px] font-mono text-emerald-900 mt-0.5">
                  Small-batch verified provision
                </p>
              </div>
            </div>
          )}

          {/* Right Column: Secondary Field Reports (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {secondaryReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white border border-stone-200/90 rounded-xs p-6 flex flex-col justify-between shadow-2xs space-y-4 hover:border-stone-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-0.5 text-stone-700">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>

                    <span className="text-[10px] font-mono text-stone-400">
                      {rev.date || 'Recent Delivery'}
                    </span>
                  </div>

                  <h3 className="font-serif text-base sm:text-lg font-medium text-stone-900">
                    &ldquo;{rev.title}&rdquo;
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-stone-900">
                    {rev.author || rev.customerName || 'Guardian'}
                    <span className="text-stone-400 font-normal ml-1">
                      ({rev.location || 'Oregon'})
                    </span>
                  </span>

                  <span className="text-[11px] text-emerald-950 font-medium">
                    {rev.petBreed ? `${rev.petBreed} Diet` : 'Verified Delivery'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
