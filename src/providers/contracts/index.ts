import {
  ProductData,
  CategoryData,
  PetTypeData,
  SubscriptionPlanData,
  SubscriptionFrequencyData,
  SubscriptionConfigData,
  ReorderConfigData,
  OrderConfigData,
  ReviewData,
  BlogData,
  SiteData,
  CompanyData,
  NavigationData,
  FaqData,
  ShippingData,
  TaxData,
  PromotionData,
  BundleData,
  AddonData,
  BrandData,
  ProductTypeData,
} from '../../types/data';

import { SubscriptionSchedule, SubscriptionStatus } from '../../types/subscription';
import { ProductCadence } from '../../types/product';
import { Order } from '../../types/order';
import { PetProfile } from '../../types/pet';
import { CustomerProfile } from '../../types/customer';

// ==========================================
// 1. Product Provider Contract
// Future: GET /api/products, GET /api/products/:slug
// ==========================================
export interface ProductFilterOptions {
  petType?: string;
  category?: string;
  subscriptionOnly?: boolean;
  query?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}

export interface ProductProvider {
  /** GET /api/products */
  getAll(filters?: ProductFilterOptions): Promise<ProductData[]>;
  /** GET /api/products/:slug */
  getBySlug(slug: string): Promise<ProductData | null>;
  /** GET /api/products/:id */
  getById(id: string): Promise<ProductData | null>;
  getFeatured(): Promise<ProductData[]>;
  getReorderCandidates(): Promise<ProductData[]>;
  search(query: string): Promise<ProductData[]>;
  getBrands?(): Promise<BrandData[]>;
  getProductTypes?(): Promise<ProductTypeData[]>;
}

// ==========================================
// 2. Category Provider Contract
// Future: GET /api/categories
// ==========================================
export interface CategoryProvider {
  /** GET /api/categories */
  getAll(): Promise<CategoryData[]>;
  getBySlug(slug: string): Promise<CategoryData | null>;
}

// ==========================================
// 3. Pet Provider Contract
// Future: GET /api/pets
// ==========================================
export interface PetProvider {
  /** GET /api/pets */
  getAll(): Promise<PetProfile[]>;
  getCustomerPets(customerId: string): Promise<PetProfile[]>;
  getById(id: string): Promise<PetProfile | null>;
  savePet(pet: Partial<PetProfile>): Promise<PetProfile>;
  deletePet?(id: string): Promise<boolean>;
  getPetTypes(): Promise<PetTypeData[]>;
}

// ==========================================
// 4. Subscription Provider Contract
// Future:
// GET /api/subscriptions
// POST /api/subscriptions
// PATCH /api/subscriptions/:id
// POST /api/subscriptions/:id/skip
// POST /api/subscriptions/:id/pause
// DELETE /api/subscriptions/:id
// ==========================================
export interface SubscriptionProvider {
  /** GET /api/subscriptions */
  getAll(): Promise<SubscriptionSchedule[]>;
  getCustomerSubscriptions(customerId: string): Promise<SubscriptionSchedule[]>;
  getSubscriptionById(id: string): Promise<SubscriptionSchedule | null>;
  /** POST /api/subscriptions */
  createSubscription(subscription: Partial<SubscriptionSchedule>): Promise<SubscriptionSchedule>;
  /** PATCH /api/subscriptions/:id */
  updateSubscription(id: string, updates: Partial<SubscriptionSchedule>): Promise<SubscriptionSchedule>;
  /** POST /api/subscriptions/:id/skip */
  skipNextShipment(id: string): Promise<SubscriptionSchedule>;
  /** POST /api/subscriptions/:id/pause */
  pauseSubscription(id: string): Promise<SubscriptionSchedule>;
  /** DELETE /api/subscriptions/:id */
  cancelSubscription(id: string): Promise<SubscriptionSchedule | boolean>;
  
  // Configurations & Plan metadata
  getPlans(): Promise<SubscriptionPlanData[]>;
  getPlansByProductId(productId: string): Promise<SubscriptionPlanData[]>;
  getFrequencies(): Promise<SubscriptionFrequencyData[]>;
  getConfig(): Promise<SubscriptionConfigData>;
  getReorderConfig(): Promise<ReorderConfigData>;
  updateStatus(id: string, status: SubscriptionStatus): Promise<SubscriptionSchedule>;
  updateCadence(id: string, cadence: ProductCadence): Promise<SubscriptionSchedule>;
  updateQuantity?(id: string, itemId: string, quantity: number): Promise<SubscriptionSchedule>;
  updateItems?(id: string, items: any[]): Promise<SubscriptionSchedule>;
}

// ==========================================
// 5. Order Provider Contract
// Future:
// GET /api/orders
// POST /api/orders
// POST /api/orders/:id/reorder
// ==========================================
export interface OrderProvider {
  /** GET /api/orders */
  getAll(): Promise<Order[]>;
  getByCustomerId(customerId: string): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  /** POST /api/orders */
  createOrder(order: Partial<Order>): Promise<Order>;
  /** POST /api/orders/:id/reorder */
  reorder(id: string): Promise<Order>;
  getConfig(): Promise<OrderConfigData>;
}

// ==========================================
// 6. Bundle Provider Contract
// Future: GET /api/bundles
// ==========================================
export interface BundleProvider {
  /** GET /api/bundles */
  getAll(): Promise<BundleData[]>;
  getBySlug(slug: string): Promise<BundleData | null>;
}

// ==========================================
// 7. Review Provider Contract
// Future: GET /api/reviews
// ==========================================
export interface ReviewProvider {
  /** GET /api/reviews */
  getAll(): Promise<ReviewData[]>;
  getByProductId(productId: string): Promise<ReviewData[]>;
  createReview?(review: Partial<ReviewData>): Promise<ReviewData>;
}

// ==========================================
// 8. Blog Provider Contract
// Future: GET /api/blog
// ==========================================
export interface BlogProvider {
  /** GET /api/blog */
  getAll(): Promise<BlogData[]>;
  getBySlug(slug: string): Promise<BlogData | null>;
  getByCategory?(category: string): Promise<BlogData[]>;
}

// ==========================================
// Additional Auxiliary Provider Contracts
// ==========================================
export interface CustomerProvider {
  getCurrentCustomer(): Promise<CustomerProfile>;
  updateCustomer(profile: Partial<CustomerProfile>): Promise<CustomerProfile>;
}

export interface SiteProvider {
  getSite(): Promise<SiteData>;
  getCompany(): Promise<CompanyData>;
  getNavigation(): Promise<NavigationData>;
  getFaqs(category?: string): Promise<FaqData[]>;
  getShipping(): Promise<ShippingData>;
  getTax(): Promise<TaxData>;
  getPromotions(): Promise<PromotionData[]>;
  getBundles(): Promise<BundleData[]>;
  getAddons(): Promise<AddonData[]>;
}
