import { ProductCadence, ProductVariant } from './product';
import { Address } from './common';

export type SubscriptionStatus = 'active' | 'paused' | 'skipped' | 'cancelled';

export type SubscriptionState =
  | 'SUBSCRIPTION_AVAILABLE'
  | 'SUBSCRIPTION_NOT_AVAILABLE'
  | 'INVALID_FREQUENCY'
  | 'INVALID_QUANTITY'
  | 'PRODUCT_UNAVAILABLE'
  | 'SUBSCRIPTION_DISABLED'
  | 'INVALID_CONFIGURATION'
  | 'INVALID_ORDER_VALUE'
  | 'SUBSCRIPTION_ONLY';

export const SUBSCRIPTION_STATES = {
  SUBSCRIPTION_AVAILABLE: 'SUBSCRIPTION_AVAILABLE',
  SUBSCRIPTION_NOT_AVAILABLE: 'SUBSCRIPTION_NOT_AVAILABLE',
  INVALID_FREQUENCY: 'INVALID_FREQUENCY',
  INVALID_QUANTITY: 'INVALID_QUANTITY',
  PRODUCT_UNAVAILABLE: 'PRODUCT_UNAVAILABLE',
  SUBSCRIPTION_DISABLED: 'SUBSCRIPTION_DISABLED',
  INVALID_CONFIGURATION: 'INVALID_CONFIGURATION',
  INVALID_ORDER_VALUE: 'INVALID_ORDER_VALUE',
  SUBSCRIPTION_ONLY: 'SUBSCRIPTION_ONLY',
} as const;

export interface CalculatePriceInput {
  productId: string;
  quantity: number;
  frequency: string;
  variant?: ProductVariant | { id: string; price: number; name?: string; inStock?: boolean };
}

export interface SubscriptionPriceCalculation {
  status: SubscriptionState;
  statusReason?: string;
  isEligible: boolean;
  basePrice: number;
  unitPrice: number;
  quantity: number;
  frequency: string;
  discountPercentage: number;
  discountAmount: number;
  subscriptionPrice: number;
  unitSubscriptionPrice: number;
  savings: number;
  estimatedNextDelivery: string;
  cadenceDays: number;
  annualSavings: number;
}

export interface SubscriptionItem {
  id: string;
  subscriptionId: string;
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  quantity: number;
  unitPrice: number;
  discountedPrice: number;
  petName?: string;
}

export interface SubscriptionSchedule {
  id: string;
  customerId: string;
  status: SubscriptionStatus;
  cadence: ProductCadence;
  nextShipmentDate: string;
  lastShipmentDate?: string;
  items: SubscriptionItem[];
  shippingAddress: Address;
  paymentMethodLast4: string;
  cycleSubtotal: number;
  cycleDiscount: number;
  cycleTotal: number;
  canSkipNext: boolean;
  canChangeCadence: boolean;
  createdDate: string;
}
