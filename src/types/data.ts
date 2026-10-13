export interface AddressData {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface SiteData {
  name: string;
  tagline: string;
  domain: string;
  contactEmail: string;
  supportPhone: string;
  address: AddressData;
  hours: {
    monday_friday: string;
    saturday: string;
    sunday: string;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
  };
  meta: {
    title: string;
    description: string;
  };
  features: {
    autoShipDiscountPercentage: number;
    freeShippingThreshold: number;
    flatShippingFee: number;
    localDeliveryEnabled: boolean;
    localDeliveryRadiusMiles: number;
  };
}

export interface CompanyValue {
  title: string;
  description: string;
}

export interface CompanyFacility {
  name: string;
  address: string;
}

export interface CompanyData {
  name: string;
  legalName: string;
  foundedYear: number;
  headquarters: string;
  founderStory: string;
  mission: string;
  values: CompanyValue[];
  facilities: CompanyFacility[];
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  petType?: string;
  badge?: string;
}

export interface NavigationData {
  mainMenu: NavItem[];
  footerMenu: {
    provisions: { label: string; href: string }[];
    autoShipProgram: { label: string; href: string }[];
    company: { label: string; href: string }[];
    support: { label: string; href: string }[];
  };
}

export interface PetTypeData {
  id: string;
  slug: string;
  name: string;
  description: string;
  popularCategories: string[];
}

export interface BrandData {
  id: string;
  slug: string;
  name: string;
  origin: string;
  description: string;
}

export interface ProductTypeData {
  id: string;
  name: string;
  description: string;
}

export interface SizeData {
  id: string;
  label: string;
  weight: string;
  unit: string;
}

export interface FlavorData {
  id: string;
  name: string;
  protein: string;
}

export interface SubscriptionFrequencyData {
  id: string;
  name: string;
  frequencyLabel: string;
  shortLabel: string;
  intervalDays: number;
  description: string;
  popular: boolean;
}

export interface InventoryAvailabilityConfig {
  requireInStock: boolean;
  minStockThreshold: number;
}

export interface SubscriptionConfigData {
  enabled: boolean;
  programName: string;
  defaultFrequency: string;
  allowedFrequencies: string[];
  supportedFrequencies: string[];
  discount?: number;
  defaultDiscountPercentage: number;
  minimumQuantity: number;
  maximumQuantity: number;
  minimumOrderValue: number;
  maximumOrderValue: number;
  eligibleProducts?: string[];
  eligibleVariants?: string[];
  subscriptionOnlyProducts?: string[];
  oneTimeOnlyProducts?: string[];
  inventoryAvailability?: InventoryAvailabilityConfig;
  outOfStockBehavior?: 'skip-cycle' | 'backorder' | 'notify-swap' | 'pause';
  messages?: Record<string, string>;
  freeShippingThreshold: number;
  guarantees: string[];
  minimumCyclesBeforeCancellation: number;
  allowCadenceModification: boolean;
  allowImmediateSkip: boolean;
  reminderNoticeDaysBeforeDispatch: number;
  smsRemindersEnabled: boolean;
}

export interface ReorderConfigData {
  oneClickReorderEnabled: boolean;
  reorderWindowDays: number;
  defaultCadenceSuggestion: string;
  reorderDiscountPercentage: number;
  pantryDepletionAlertDays: number;
  autoSuggestBasedOnPetWeight: boolean;
  allowDirectCartInjection: boolean;
}

export interface SubscriptionPlanData {
  id: string;
  productId: string;
  frequency: string;
  frequencyLabel: string;
  discountPercentage: number;
  active: boolean;
  minimumQuantity: number;
  maximumQuantity: number;
}

export interface NutritionData {
  crudeProtein: string;
  crudeFat: string;
  crudeFiber: string;
  moisture: string;
}

export interface ProductData {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  petType: string;
  productType: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  thumbnail: string;
  gallery: string[];
  sizes: string[];
  flavors: string[];
  weight: string;
  ingredients: string[];
  nutrition: NutritionData;
  features: string[];
  benefits: string[];
  tags: string[];
  featured: boolean;
  popular: boolean;
  new: boolean;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  stockStatus: string;
  subscriptionEligible: boolean;
  reorderEligible: boolean;
  subscriptionDiscount: number;
  reorderDiscount: number;
  frequencyOptions: string[];
  minimumQuantity: number;
  maximumQuantity: number;
  relatedProducts: string[];
}

export interface CategoryData {
  id: string;
  slug: string;
  name: string;
  petTypes: string[];
  description: string;
  productCount: number;
}

export interface BundleData {
  id: string;
  slug: string;
  name: string;
  petType: string;
  shortDescription: string;
  description: string;
  productIds: string[];
  bundlePrice: number;
  compareAtPrice?: number;
  subscriptionDiscount?: number;
  subscriptionEligible?: boolean;
  featured?: boolean;
  images: string[];
  savingsText?: string;
  tagline?: string;
  editorialCuratorNotes?: string;
  badge?: string;
  defaultCadence?: string;
  supportedCadences?: string[];
}

export interface AddonData {
  id: string;
  name: string;
  price: number;
  category: string;
  petType: string;
  description: string;
}

export interface PromotionData {
  id: string;
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'free-shipping';
  discountValue: number;
  appliesTo: string;
  minimumOrderAmount: number;
  active: boolean;
}

export interface ReviewData {
  id: string;
  productId: string;
  customerName?: string;
  author: string;
  location?: string;
  petName?: string;
  petBreed?: string;
  petAge?: string;
  rating: number;
  title?: string;
  comment: string;
  verified?: boolean;
  verifiedPurchase: boolean;
  date?: string;
  createdAt: string;
}

export interface FaqData {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export interface BlogAuthor {
  name: string;
  role: string;
}

export interface BlogData {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  excerpt: string;
  author: BlogAuthor;
  publishedDate: string;
  readTimeMinutes: number;
  tags: string[];
  content: string;
  featured?: boolean;
  heroImage?: string;
  relatedProductIds?: string[];
  takeaways?: string[];
}

export interface ShippingCarrierData {
  id: string;
  name: string;
  serviceArea: string;
  estimatedDays: string;
  cost: number;
  freeThreshold: number;
}

export interface ShippingData {
  carriers: ShippingCarrierData[];
  defaultCourierFee: number;
  freeShippingThreshold: number;
  packagingMaterials: string;
  sameDayCutoffHourPST: number;
}

export interface TaxRateData {
  rate: number;
  name: string;
}

export interface TaxData {
  storeOriginState: string;
  defaultTaxRate: number;
  stateRates: Record<string, TaxRateData>;
  exemptCategories: string[];
}

export interface OrderConfigData {
  orderNumberPrefix: string;
  orderNumberMin: number;
  orderNumberMax: number;
  currency: string;
  allowedPaymentMethods: string[];
  guestCheckoutAllowed: boolean;
  defaultProcessingTimeHours: number;
  cancellationGracePeriodHours: number;
  dispatchNotificationMethods: string[];
  returnPolicyDays: number;
}
