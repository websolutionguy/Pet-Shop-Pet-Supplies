import { Product, ProductVariant, ProductCadence } from '../../types/product';

export interface SelectedSubscriptionBundleItem {
  id: string; // key `${productId}_${variantId}`
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

export interface SubscriptionBuilderCategory {
  id: string;
  name: string;
  description: string;
  iconName?: string;
}

export const BUILDER_CATEGORIES: SubscriptionBuilderCategory[] = [
  { id: 'all', name: 'All Provisions', description: 'Everything eligible for routine delivery' },
  { id: 'food', name: 'Whole Nutrition & Food', description: 'Oven-roasted kibble, raw dehydrated & slow stews' },
  { id: 'treats', name: 'Treats & Chews', description: 'Single-ingredient liver bites & dental skins' },
  { id: 'supplements', name: 'Veterinary Supplements', description: 'Wild salmon oils, joint botanicals & digestive probiotics' },
  { id: 'litter', name: 'Natural Litter', description: 'Biodegradable cedar & pine wood fiber' },
  { id: 'grooming', name: 'Grooming Essentials', description: 'Botanical fir shampoos, paw balms & ear washes' },
];

export const BUILDER_PET_TYPES = [
  { id: 'all', label: 'All Companions' },
  { id: 'dog', label: 'Dogs' },
  { id: 'cat', label: 'Cats' },
  { id: 'small-pets', label: 'Small Pets' },
];
