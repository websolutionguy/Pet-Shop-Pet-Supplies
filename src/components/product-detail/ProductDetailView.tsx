'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Product } from '../../types/product';
import { ProductImageGallery } from './ProductImageGallery';
import { ProductPurchaseForm } from './ProductPurchaseForm';
import { ProductSpecifications } from './ProductSpecifications';
import { ProductReviews } from './ProductReviews';
import { RelatedProducts } from './RelatedProducts';
import { ProductStickyBar } from './ProductStickyBar';
import { ProductQuickModal } from '../products/ProductQuickModal';
import { useCart } from '../../providers/CartProvider';
import { subscriptionService } from '../../services/subscriptionService';

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { addItem, openCart } = useCart();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [stickyAddedNotice, setStickyAddedNotice] = useState(false);

  // Fallback calculation for sticky bar
  const defaultSubPrice = subscriptionService.calculateSubscriptionPriceSync(
    product.basePrice,
    product.subscription.discountPercentage || 10
  );

  const handleStickyAddToCart = () => {
    addItem(product, {
      quantity: 1,
      purchaseType: product.subscription.eligible ? 'subscription' : 'one-time',
      cadence: product.subscription.defaultCadence || '4-weeks',
    });
    setStickyAddedNotice(true);
    setTimeout(() => setStickyAddedNotice(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-24 lg:pb-12 space-y-12 sm:space-y-16">
      {/* Editorial Breadcrumb trail */}
      <nav aria-label="Breadcrumbs" className="text-xs text-stone-500 font-mono">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-stone-900 transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="w-3 h-3 text-stone-400" />
          </li>
          <li>
            <Link href="/shop" className="hover:text-stone-900 transition-colors">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="w-3 h-3 text-stone-400" />
          </li>
          <li>
            <Link
              href={`/shop?category=${encodeURIComponent(product.categoryId)}`}
              className="hover:text-stone-900 transition-colors"
            >
              {product.categoryName}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="w-3 h-3 text-stone-400" />
          </li>
          <li className="text-stone-900 font-medium truncate max-w-xs sm:max-w-none">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Product Showcase: Left Gallery, Right Purchase Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left Column: Image Gallery (6 cols on lg) */}
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <ProductImageGallery
            images={product.galleryImages}
            productName={product.name}
            brand={product.brand}
            isQuickReorderCandidate={product.isQuickReorderCandidate}
          />
        </div>

        {/* Right Column: Purchasing Clarity & Subscription Controls (6 cols on lg) */}
        <div className="lg:col-span-6">
          <ProductPurchaseForm product={product} />
        </div>
      </div>

      {/* Below Section 1: Detailed Specifications, Ingredients, Nutrition, Usage, Shipping */}
      <ProductSpecifications product={product} />

      {/* Below Section 2: Authentic Customer Reviews */}
      <ProductReviews productId={product.id} productName={product.name} />

      {/* Below Section 3: Complementary Related Products */}
      <RelatedProducts
        currentProductId={product.id}
        relatedIds={product.relatedProductIds}
        petType={product.petType}
        categorySlug={product.categoryId}
        onQuickView={(p) => setQuickViewProduct(p)}
      />

      {/* Mobile Sticky Purchase Bar (Only visible when scrolled down on mobile) */}
      <ProductStickyBar
        product={product}
        onAddToCart={handleStickyAddToCart}
        price={product.subscription.eligible ? defaultSubPrice : product.basePrice}
        isSubscription={product.subscription.eligible}
        addedNotice={stickyAddedNotice}
      />

      {/* Quick View Modal for Related Products */}
      <ProductQuickModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
}
