'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppImage } from '../ui/AppImage';

import {
  ArrowLeft,
  Clock,
  User,
  Share2,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { BlogData } from '../../types/data';
import { Product } from '../../types/product';
import { productService } from '../../services/productService';
import { blogService } from '../../services/blogService';
import { formatHumanDate, formatCurrency } from '../../lib/utils';
import { useCart } from '../../providers/CartProvider';
import { Button } from '../ui/Button';

interface JournalArticleDetailProps {
  post: BlogData;
}

export function JournalArticleDetail({ post }: JournalArticleDetailProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogData[]>([]);
  const [copied, setCopied] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    // Resolve related products
    if (post.relatedProductIds && post.relatedProductIds.length > 0) {
      Promise.all(
        post.relatedProductIds.map((pid) => productService.getProductById(pid))
      ).then((prods) => {
        setRelatedProducts(prods.filter((p): p is Product => p !== null));
      });
    }

    // Resolve related articles
    blogService.getPosts().then((all) => {
      const others = all
        .filter((p) => p.id !== post.id)
        .slice(0, 2);
      setRelatedPosts(others);
    });
  }, [post]);

  const handleShare = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const heroImage =
    post.heroImage || '/src/assets/images/hero_dog_natural_1790396014202.jpg';

  return (
    <article className="max-w-4xl mx-auto space-y-10 sm:space-y-14">
      {/* 1. Breadcrumbs & Meta Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4 text-xs font-mono text-stone-500">
        <Link
          href="/journal"
          className="inline-flex items-center gap-1.5 text-stone-700 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Journal Archives</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="px-2.5 py-0.5 bg-stone-100 text-stone-800 rounded-xs uppercase tracking-wider font-semibold">
            {post.category}
          </span>
          <span>·</span>
          <time dateTime={post.publishedDate}>{formatHumanDate(post.publishedDate)}</time>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{post.readTimeMinutes} min read</span>
          </span>
        </div>
      </div>

      {/* 2. Article Header */}
      <header className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight leading-tight">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="text-sm sm:text-base font-mono text-emerald-900 leading-relaxed font-medium">
            {post.subtitle}
          </p>
        )}

        <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-xs font-mono text-stone-600">
          <div>
            <span className="font-semibold text-stone-900 block font-serif text-sm">
              {post.author.name}
            </span>
            <span className="text-[11px] text-stone-500">{post.author.role}</span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xs text-stone-700 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-500" />
            <span>{copied ? 'Link Copied' : 'Share Note'}</span>
          </button>
        </div>
      </header>

      {/* 3. Hero Visual */}
      <div className="relative aspect-16/9 w-full bg-stone-100 rounded-xs overflow-hidden border border-stone-200 shadow-2xs">
        <AppImage
          src={heroImage}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
      </div>

      {/* 4. Core Field Takeaways Box */}
      {post.takeaways && post.takeaways.length > 0 && (
        <aside className="p-6 sm:p-8 bg-[#FAF9F6] border-l-3 border-emerald-800 rounded-xs space-y-3 shadow-2xs">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-950 font-semibold block">
            Core Field Takeaways
          </span>
          <ul className="space-y-2.5 text-stone-700 text-xs sm:text-sm">
            {post.takeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* 5. Long-Form Editorial Content Body */}
      <div className="prose prose-stone max-w-none space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base font-sans">
        {post.content.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h2
                key={idx}
                className="font-serif text-xl sm:text-2xl font-normal text-stone-900 pt-4 border-t border-stone-100"
              >
                {paragraph.replace('### ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('#### ')) {
            return (
              <h3
                key={idx}
                className="font-serif text-lg font-medium text-stone-800 pt-2"
              >
                {paragraph.replace('#### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('- ')) {
            const items = paragraph.split('\n- ');
            return (
              <ul key={idx} className="space-y-2 pl-4 list-disc text-sm text-stone-600">
                {items.map((item, i) => (
                  <li key={i}>{item.replace(/^- /, '')}</li>
                ))}
              </ul>
            );
          }
          if (paragraph.startsWith('1. ')) {
            const items = paragraph.split(/\n\d+\.\s+/);
            return (
              <ol key={idx} className="space-y-2 pl-4 list-decimal text-sm text-stone-600">
                {items.map((item, i) => (
                  <li key={i}>{item.replace(/^\d+\.\s+/, '')}</li>
                ))}
              </ol>
            );
          }

          // Initial paragraph drop-cap style on the first text paragraph
          return (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* 6. Referenced Provisions Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-800" />
              <span>Referenced Pantry Provisions</span>
            </h2>
            <span className="text-xs font-mono text-stone-500">
              Small-batch Pacific Northwest sourcing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedProducts.map((prod) => (
              <div
                key={prod.id}
                className="p-4 bg-white border border-stone-200/90 rounded-xs flex items-center justify-between gap-4 shadow-2xs hover:border-stone-300 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200">
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
                      <Package className="w-5 h-5 m-auto text-stone-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono uppercase text-stone-400 block truncate">
                      {prod.brand}
                    </span>
                    <Link
                      href={`/products/${prod.slug}`}
                      className="font-serif text-sm font-semibold text-stone-900 hover:text-stone-700 block truncate"
                    >
                      {prod.name}
                    </Link>
                    <span className="font-mono text-xs text-stone-600 block">
                      {formatCurrency(prod.basePrice)}
                    </span>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    addItem(prod, {
                      purchaseType: 'one-time',
                      quantity: 1,
                    })
                  }
                  className="shrink-0 text-xs font-mono"
                >
                  Add to Basket
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Continued Reading Links */}
      {relatedPosts.length > 0 && (
        <section className="pt-10 border-t border-stone-200 space-y-6">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900">
            Continuing Field Notes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((related) => (
              <article
                key={related.id}
                className="p-5 bg-white border border-stone-200/90 rounded-xs space-y-3 shadow-2xs hover:border-stone-300 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                    {related.category}
                  </span>
                  <h3 className="font-serif text-base font-semibold text-stone-900 leading-snug">
                    <Link
                      href={`/journal/${related.slug}`}
                      className="hover:text-emerald-950 transition-colors"
                    >
                      {related.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {related.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-500">By {related.author.name}</span>
                  <Link
                    href={`/journal/${related.slug}`}
                    className="inline-flex items-center gap-1 text-emerald-900 font-semibold"
                  >
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
