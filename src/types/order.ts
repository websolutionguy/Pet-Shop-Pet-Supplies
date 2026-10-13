import { Address } from './common';
import { ProductCadence } from './product';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderLineItem {
  id: string;
  productId: string;
  productName: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  isSubscription: boolean;
  cadence?: ProductCadence;
  targetPetName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  placedAt: string;
  status: OrderStatus;
  items: OrderLineItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  carrier?: string;
  trackingNumber?: string;
  isSubscriptionRenewal: boolean;
  parentSubscriptionId?: string;
}

export interface FrequentlyPurchasedItem {
  productId: string;
  productName: string;
  brand: string;
  category: string;
  imageUrl?: string;
  lastPurchasedAt: string;
  timesOrdered: number;
  preferredVariantName?: string;
  preferredVariantPrice: number;
  isSubscriptionEligible: boolean;
  subscriptionDiscount: number;
  targetPetName?: string;
  estimatedDaysRemaining?: number;
  pantryStatus?: 'depleted' | 'low' | 'stocked';
}

