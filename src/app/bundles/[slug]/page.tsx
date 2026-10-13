import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { CartDrawer } from '../../../components/layout/CartDrawer';
import { BundleDetailView } from '../../../components/bundles';
import { bundleService } from '../../../services/bundleService';
import {
  generatePageMetadata,
  buildBreadcrumbSchema,
  SITE_URL,
} from '../../../lib/seo';

interface BundleDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const bundles = await bundleService.getBundles();
  return bundles.map((bundle) => ({
    slug: bundle.slug,
  }));
}

export async function generateMetadata({
  params,
}: BundleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await bundleService.getBundleBySlug(slug);

  if (!bundle) {
    return {
      title: 'Bundle Not Found | Rowan & Hound Pet Supply Co.',
    };
  }

  const keywords = ['pet supply subscription', 'pet supplies'];
  if (bundle.petType === 'dogs' || bundle.petType === 'both' || bundle.petType === 'all') {
    keywords.push('dog food', 'dog food delivery');
  }
  if (bundle.petType === 'cats' || bundle.petType === 'both' || bundle.petType === 'all') {
    keywords.push('cat food', 'cat litter subscription');
  }

  return generatePageMetadata({
    title: `${bundle.name} — Curated Pet Provision Kit | Rowan & Hound`,
    description: `${bundle.description} Curated with ${bundle.productIds.length} complementary provisions. Save ${bundle.discountPercentage}% as a bundle with flexible routine delivery.`,
    path: `/bundles/${bundle.slug}`,
    keywords,
  });
}

export default async function BundleDetailPage({ params }: BundleDetailPageProps) {
  const { slug } = await params;
  const bundle = await bundleService.getBundleBySlug(slug);

  if (!bundle) {
    notFound();
  }

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Curated Bundles', path: '/bundles' },
    { name: bundle.name, path: `/bundles/${bundle.slug}` },
  ]);

  // Product structured data for the curated bundle
  const bundleProductSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: bundle.name,
    description: bundle.description,
    sku: `BUNDLE-${bundle.id}`,
    brand: {
      '@type': 'Brand',
      name: 'Rowan & Hound Supply Co.',
    },
    category: 'Pet Supplies',
    offers: {
      '@type': 'Offer',
      price: bundle.bundlePrice,
      priceCurrency: 'USD',
      priceValidUntil: '2027-12-31',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      url: `${SITE_URL}/bundles/${bundle.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Rowan & Hound Supply Co.',
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bundleProductSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* 1. Header */}
      <Header activeFilter="bundles" />

      {/* 2. Main Bundle Story Workspace */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 outline-none">
        <BundleDetailView bundle={bundle} />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
