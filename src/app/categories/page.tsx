import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Package, Sparkles } from 'lucide-react';
import { categoryService } from '../../services/categoryService';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/layout/CartDrawer';
import { generatePageMetadata, buildBreadcrumbSchema } from '../../lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Pet Supply Categories & Dietary Foundations | Rowan & Hound',
  description:
    'Explore curated pet supply categories including small-batch roasted dog food, feline hydration meals, single-ingredient pet treats, and non-toxic timber cat litter.',
  path: '/categories',
  keywords: [
    'pet supplies',
    'dog food',
    'cat food',
    'pet treats',
    'cat litter subscription',
    'pet supply categories',
  ],
});

export default async function CategoriesPage() {
  const categories = await categoryService.getRawCategories();
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 outline-none">
        {/* Editorial Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-[#1E3A2F] font-bold mb-2">
            Pantry Organization
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 tracking-tight leading-tight">
            Curated by Biological Need & Discipline
          </h1>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            Every category represents a strict standard: whole proteins, transparent origins, zero rawhide, and kettle-roasted freshness paced for routine delivery.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group bg-white border border-stone-200/90 rounded-xs p-6 sm:p-8 flex flex-col justify-between hover:border-stone-400 transition-colors shadow-2xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-400 uppercase tracking-wider">
                    {category.petTypes.join(' & ')}
                  </span>
                  <span className="text-emerald-900 font-semibold bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                    {category.productCount} recipes
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-normal text-stone-900 group-hover:text-emerald-950 transition-colors">
                  {category.name}
                </h2>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {category.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono font-semibold text-stone-900">
                <span>View provisions</span>
                <ArrowRight className="w-4 h-4 text-emerald-800 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
