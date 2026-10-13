import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { categoryService } from '../../../services/categoryService';
import { productService } from '../../../services/productService';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { CartDrawer } from '../../../components/layout/CartDrawer';
import { ProductCard } from '../../../components/ui/ProductCard';
import {
  generatePageMetadata,
  buildBreadcrumbSchema,
  SITE_URL,
} from '../../../lib/seo';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await categoryService.getAll();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await categoryService.getRawBySlug(slug);

  if (!category) {
    return {
      title: 'Category Not Found | Rowan & Hound Supply Co.',
    };
  }

  // Natural SEO keywords tailored to the specific category
  const categoryKeywords: string[] = ['pet supplies'];
  if (category.slug.includes('dog')) categoryKeywords.push('dog food', 'dog food delivery', 'pet food subscription');
  if (category.slug.includes('cat')) categoryKeywords.push('cat food', 'cat litter subscription');
  if (category.slug.includes('treat')) categoryKeywords.push('pet treats', 'single protein treats');

  return generatePageMetadata({
    title: `${category.name} | Rowan & Hound Pet Supply Co.`,
    description: `${category.description} Small-batch formulations available for one-time orders or recurring 10% auto-ship subscriptions.`,
    path: `/categories/${category.slug}`,
    keywords: categoryKeywords,
  });
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await categoryService.getRawBySlug(slug);

  if (!category) {
    notFound();
  }

  // Filter products belonging to this category
  const allProducts = await productService.getAll();
  const products = allProducts.filter(
    (p) => p.categoryId === category.id || p.categoryId === category.slug
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Categories', path: '/categories' },
    { name: category.name, path: `/categories/${category.slug}` },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 outline-none">
        {/* Breadcrumb Navigation UI */}
        <nav aria-label="Breadcrumbs" className="mb-6">
          <ol className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <li>
              <Link href="/" className="hover:text-stone-900 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/categories" className="hover:text-stone-900 transition-colors">
                Categories
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-stone-900 font-medium" aria-current="page">
              {category.name}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <header className="max-w-3xl mb-10 pb-6 border-b border-stone-200">
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#1E3A2F] font-bold block mb-2">
            Category Provisions · {category.petTypes.join(' & ')}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 tracking-tight leading-tight">
            {category.name}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            {category.description}
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs font-mono text-stone-500">
            <span>{products.length} small-batch items</span>
            <span>·</span>
            <span className="text-emerald-900 font-semibold">10% auto-ship savings available</span>
          </div>
        </header>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="p-12 text-center bg-white border border-stone-200 rounded-xs">
            <p className="font-serif text-stone-600 text-sm">
              Current batch is resting in the roaster. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
