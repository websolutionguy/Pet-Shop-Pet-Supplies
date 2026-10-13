import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, CheckCircle, Package } from 'lucide-react';
import { ReviewData } from '../../types/data';
import { Product } from '../../types/product';
import { formatHumanDate } from '../../lib/utils';

interface ReviewCardProps {
  review: ReviewData;
  product?: Product;
}

export function ReviewCard({ review, product }: ReviewCardProps) {
  const customerName = review.customerName || review.author;
  const reviewDate = review.date || review.createdAt;
  const isVerified = review.verified === true || review.verifiedPurchase === true;

  return (
    <article className="p-6 bg-white border border-stone-200/90 rounded-xs shadow-2xs space-y-4 flex flex-col justify-between hover:border-stone-300 transition-colors">
      <div className="space-y-3">
        {/* Top Meta: Stars + Verified Badge + Date */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Star Rating */}
          <div className="flex items-center gap-1" aria-label={`Rating: ${review.rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= review.rating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-stone-200 text-stone-200'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
            {/* Only display "Verified" when explicitly provided by the data */}
            {isVerified && (
              <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200 font-medium">
                <CheckCircle className="w-3 h-3 text-emerald-700" />
                <span>Verified</span>
              </span>
            )}

            <time dateTime={reviewDate} className="text-stone-500">
              {formatHumanDate(reviewDate)}
            </time>
          </div>
        </div>

        {/* Optional Review Title */}
        {review.title && (
          <h3 className="font-serif text-base font-semibold text-stone-900 leading-snug">
            {review.title}
          </h3>
        )}

        {/* Comment Text */}
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>

      {/* Footer: Customer Name & Associated Product */}
      <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-semibold text-stone-900 block font-serif">
            {customerName}
          </span>
          {review.location && (
            <span className="text-[11px] text-stone-500 font-mono">
              {review.location}
            </span>
          )}
        </div>

        {/* Associated Product Link */}
        {product && (
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 p-1.5 bg-stone-50 hover:bg-stone-100 rounded-xs border border-stone-200 transition-colors text-stone-700 max-w-xs truncate"
            title={`View ${product.name}`}
          >
            <div className="relative w-7 h-7 rounded-xs bg-stone-200 overflow-hidden shrink-0">
              {product.primaryImage ? (
                <Image
                  src={product.primaryImage}
                  alt={product.name}
                  fill
                  loading="lazy"
                  sizes="28px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Package className="w-4 h-4 m-auto text-stone-400" />
              )}
            </div>
            <span className="font-mono text-[11px] truncate font-medium">
              {product.name}
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}
