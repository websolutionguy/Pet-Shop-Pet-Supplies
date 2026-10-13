import { Product, ProductVariant, ProductCadence } from './product';

export type PurchaseType = 'one-time' | 'subscription';

export interface CartItem {
  id: string; // unique item instance id in cart
  productId: string;
  product: Product;
  variantId?: string;
  variant?: ProductVariant;
  quantity: number;
  purchaseType: PurchaseType;
  subscriptionCadence?: ProductCadence;
  unitPrice: number;
  discountedUnitPrice: number;
  discountAmount: number; // discount per unit
  totalDiscount: number; // total discount for line
  lineTotal: number;
  targetPetName?: string;
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  productSubtotal: number;
  subscriptionSavings: number;
  promotionDiscount: number;
  appliedPromoCode?: string;
  estimatedShipping: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  qualifiesForFreeShipping: boolean;
  estimatedTax: number;
  total: number;
  deliveryMethodId?: string;
  hasSubscriptionItems: boolean;
  hasOneTimeItems: boolean;
  isMixedCart: boolean;
  recurringCycleTotal?: number;
}
