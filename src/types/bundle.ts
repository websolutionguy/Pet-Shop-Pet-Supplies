import { Product, ProductCadence } from './product';

export interface BundleItemConfig {
  productId: string;
  quantity?: number;
  variantId?: string;
  variantName?: string;
}

export interface BundleData {
  id: string;
  slug: string;
  name: string;
  petType: 'dogs' | 'cats' | 'small-pets' | 'both' | 'all';
  tagline: string;
  shortDescription: string;
  description: string;
  editorialCuratorNotes: string;
  productIds: string[];
  items?: BundleItemConfig[];
  bundlePrice: number;
  compareAtPrice?: number;
  subscriptionEligible: boolean;
  subscriptionDiscount: number;
  defaultCadence?: ProductCadence;
  supportedCadences?: ProductCadence[];
  featured: boolean;
  badge?: string;
  images: string[];
}

export interface CuratedBundle extends BundleData {
  products: Product[];
  individualTotal: number;
  bundleSavings: number;
  discountPercentage: number;
  savingsText?: string;
}

export interface BundlePriceCalculation {
  individualTotal: number;
  bundlePrice: number;
  bundleSavings: number;
  isSubscriptionEligible: boolean;
  purchaseType: 'one-time' | 'subscription';
  subscriptionDiscountPercentage: number;
  subscriptionPrice: number;
  subscriptionSavings: number;
  finalPrice: number;
  totalSavings: number;
  cadence?: ProductCadence;
}
