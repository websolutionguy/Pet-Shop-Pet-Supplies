import { Product, ProductCadence } from '../types/product';
import { Category } from '../types/category';
import { PetProfile } from '../types/pet';
import { SubscriptionSchedule, SubscriptionStatus } from '../types/subscription';
import { Order } from '../types/order';
import { CustomerProfile } from '../types/customer';
import { CartItem, CartSummary } from '../types/cart';

export interface ProductFilterParams {
  categorySlug?: string;
  petType?: 'dog' | 'cat' | 'both' | 'all' | string;
  subscriptionOnly?: boolean;
  searchQuery?: string;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}

export interface IProductRepository {
  getAll(filters?: ProductFilterParams): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  getBySlug(slug: string): Promise<Product | null>;
  getFeatured(): Promise<Product[]>;
  getReorderCandidates(): Promise<Product[]>;
  search(query: string): Promise<Product[]>;
}

export interface ICategoryRepository {
  getAll(): Promise<Category[]>;
  getBySlug(slug: string): Promise<Category | null>;
}

export interface ISubscriptionRepository {
  getByCustomerId(customerId: string): Promise<SubscriptionSchedule[]>;
  getById(id: string): Promise<SubscriptionSchedule | null>;
  updateStatus(id: string, status: SubscriptionStatus): Promise<SubscriptionSchedule>;
  updateCadence(id: string, cadence: ProductCadence): Promise<SubscriptionSchedule>;
  skipNextShipment(id: string): Promise<SubscriptionSchedule>;
}

export interface IOrderRepository {
  getByCustomerId(customerId: string): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  createOrder(orderData: Partial<Order>): Promise<Order>;
}

export interface IPetRepository {
  getByCustomerId(customerId: string): Promise<PetProfile[]>;
  getById(id: string): Promise<PetProfile | null>;
  savePet(pet: Partial<PetProfile>): Promise<PetProfile>;
}

export interface ICustomerRepository {
  getCurrentCustomer(): Promise<CustomerProfile>;
  updateCustomer(profile: Partial<CustomerProfile>): Promise<CustomerProfile>;
}

export interface ICartCalculator {
  calculateSummary(items: CartItem[]): CartSummary;
}
