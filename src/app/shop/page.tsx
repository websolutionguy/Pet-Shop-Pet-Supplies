import React from 'react';
import { Metadata } from 'next';
import { generatePageMetadata, buildBreadcrumbSchema } from '../../lib/seo';
import { ShopPageClient } from '../../components/shop/ShopPageClient';

export const metadata: Metadata = generatePageMetadata({
  title: 'Pet Supplies & Small-Batch Nutrition Catalog | Rowan & Hound',
  description:
    'Browse independent pet supplies, small-batch kettle-roasted dog food, feline hydration entrees, raw single-protein treats, and non-toxic provisions.',
  path: '/shop',
  keywords: [
    'pet shop',
    'pet supplies',
    'dog food',
    'cat food',
    'pet treats',
    'pet food delivery',
    'cat litter subscription',
    'small batch pet provisions',
  ],
});

export default function ShopPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Shop Provisions', path: '/shop' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ShopPageClient />
    </>
  );
}
