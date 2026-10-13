export type PetType = 'dog' | 'cat' | 'both';

export type ProductCadence = '2-weeks' | '4-weeks' | '6-weeks' | '8-weeks' | '12-weeks';

export interface ProductVariant {
  id: string;
  name: string;
  sizeOrWeight: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  inventoryCount: number;
}

export interface SubscriptionConfig {
  eligible: boolean;
  discountPercentage: number;
  defaultCadence: ProductCadence;
  cadenceOptions: ProductCadence[];
  benefitsSummary: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  petType: PetType;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  fullDescription: string;
  primaryImage: string;
  galleryImages: string[];
  basePrice: number;
  compareAtPrice?: number;
  unitMeasurement: string;
  keyBenefits: string[];
  features?: string[];
  ingredients?: string[];
  guaranteedAnalysis?: {
    crudeProtein: string;
    crudeFat: string;
    crudeFiber: string;
    moisture: string;
  };
  feedingGuidelines?: string;
  relatedProductIds?: string[];
  variants: ProductVariant[];
  subscription: SubscriptionConfig;
  inStock: boolean;
  isFeatured?: boolean;
  isQuickReorderCandidate?: boolean;
  isNew?: boolean;
  rawPetType?: string;
  productType?: string;
  sizes?: string[];
  rating: number;
  reviewCount: number;
  batchHarvestDate?: string;
  dietaryTags: string[];
}
