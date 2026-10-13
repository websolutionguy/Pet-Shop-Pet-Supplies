import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { productService } from '../../../services/productService';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { CartDrawer } from '../../../components/layout/CartDrawer';
import { ProductDetailView } from '../../../components/product-detail/ProductDetailView';
import {
  generatePageMetadata,
  buildProductSchema,
  buildBreadcrumbSchema,
  SITE_URL,
} from '../../../lib/seo';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await productService.getAll();
  return products.map((prod) => ({
    slug: prod.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Rowan & Hound Pet Supply Co.',
    };
  }

  const keywords = ['pet supplies'];
  if (product.petType === 'dog' || product.petType === 'both') {
    keywords.push('dog food', 'dog food delivery', 'pet food subscription');
  }
  if (product.petType === 'cat' || product.petType === 'both') {
    keywords.push('cat food', 'cat litter subscription');
  }
  if (product.categoryId === 'treats') {
    keywords.push('pet treats', 'single ingredient treats');
  }

  return generatePageMetadata({
    title: `${product.name} | Rowan & Hound Pet Supply Co.`,
    description: `${product.shortDescription} Kettle-roasted small-batch pet provisions with 10% auto-ship subscription savings.`,
    path: `/products/${product.slug}`,
    image: product.primaryImage || '/src/assets/images/product_venison_kibble_1790396027749.jpg',
    keywords,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productService.getBySlug(slug);

  if (!product) {
    notFound();
  }

  const productSchema = buildProductSchema(product);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: product.categoryName, path: `/categories/${product.categoryId}` },
    { name: product.name, path: `/products/${product.slug}` },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 1. Header */}
      <Header />

      {/* 2. Main Product Showcase */}
      <main id="main-content" tabIndex={-1} className="flex-1 pb-16 outline-none">
        <ProductDetailView product={product} />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
