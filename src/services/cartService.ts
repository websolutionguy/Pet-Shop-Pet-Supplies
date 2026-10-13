import { CartItem, CartSummary, PurchaseType } from '../types/cart';
import { Product, ProductVariant, ProductCadence } from '../types/product';
import { ICartCalculator } from './contracts';
import {
  FREE_SHIPPING_THRESHOLD,
  FLAT_SHIPPING_FEE,
  ESTIMATED_TAX_RATE,
  SUBSCRIPTION_DISCOUNT_PERCENT,
} from '../lib/constants';

export interface CartAddOptions {
  variantId?: string;
  quantity?: number;
  purchaseType?: PurchaseType;
  cadence?: ProductCadence;
  targetPetName?: string;
}

export interface PromoValidationResult {
  valid: boolean;
  code: string;
  discount: number;
  freeShipping: boolean;
  message: string;
}

export type DeliveryMethodId = 'standard' | 'express' | 'carbon-neutral';

export interface DeliveryMethodOption {
  id: DeliveryMethodId;
  name: string;
  timeframe: string;
  priceDescription: string;
  baseCost: number;
  freeOverThreshold: boolean;
  description: string;
}

export const DELIVERY_METHODS: DeliveryMethodOption[] = [
  {
    id: 'standard',
    name: 'Standard Regional Courier',
    timeframe: '3–5 business days',
    priceDescription: 'Free over $49 ($5.95 otherwise)',
    baseCost: 5.95,
    freeOverThreshold: true,
    description: 'Tracked overland courier dispatch from our Portland, OR fulfillment depot.',
  },
  {
    id: 'express',
    name: 'Express Pantry Expedited',
    timeframe: '1–2 business days',
    priceDescription: '$12.50 flat rate',
    baseCost: 12.50,
    freeOverThreshold: false,
    description: 'Priority handling with morning batch dispatch for urgent pantry replenishments.',
  },
  {
    id: 'carbon-neutral',
    name: 'Carbon-Neutral Regional Overland',
    timeframe: '2–4 business days',
    priceDescription: 'Free over $49 ($7.50 otherwise)',
    baseCost: 7.50,
    freeOverThreshold: true,
    description: '100% offset electric van routing across the Pacific Northwest corridor.',
  },
];

export class CartService implements ICartCalculator {
  calculateSubtotal(items: CartItem[]): number {
    const raw = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    return Number(raw.toFixed(2));
  }

  calculateDiscount(
    items: CartItem[],
    promoDiscount = 0
  ): {
    subscriptionSavings: number;
    promotionalDiscount: number;
    totalSavings: number;
  } {
    let subscriptionSavings = 0;
    items.forEach((item) => {
      if (item.purchaseType === 'subscription') {
        const itemDiscount =
          (item.unitPrice * (SUBSCRIPTION_DISCOUNT_PERCENT / 100)) * item.quantity;
        subscriptionSavings += itemDiscount;
      }
    });

    const subTotalSavings = Number(subscriptionSavings.toFixed(2));
    const totalSavings = Number((subTotalSavings + promoDiscount).toFixed(2));

    return {
      subscriptionSavings: subTotalSavings,
      promotionalDiscount: Number(promoDiscount.toFixed(2)),
      totalSavings,
    };
  }

  validatePromoCode(code: string, items: CartItem[]): PromoValidationResult {
    const cleanCode = code.trim().toUpperCase();
    const rawSubtotal = this.calculateSubtotal(items);

    if (!cleanCode) {
      return {
        valid: false,
        code: '',
        discount: 0,
        freeShipping: false,
        message: 'Please enter a valid promotion code.',
      };
    }

    if (cleanCode === 'AUTOSHIP10') {
      const hasSub = items.some((i) => i.purchaseType === 'subscription');
      return {
        valid: true,
        code: cleanCode,
        discount: 0, // Auto-ship 10% is already applied to subscription items
        freeShipping: false,
        message: hasSub
          ? 'Continuous 10% auto-ship savings applied to recurring provisions.'
          : 'Code saved: Converts recurring provisions to 10% off automatically.',
      };
    }

    if (cleanCode === 'FREESHIP49') {
      return {
        valid: true,
        code: cleanCode,
        discount: 0,
        freeShipping: rawSubtotal >= 49,
        message:
          rawSubtotal >= 49
            ? 'Complimentary regional courier delivery active.'
            : 'Complimentary shipping applies to baskets of $49 or more.',
      };
    }

    if (cleanCode === 'BUNDLE12') {
      if (rawSubtotal >= 75 || items.length >= 2) {
        const discountVal = Number((rawSubtotal * 0.12).toFixed(2));
        return {
          valid: true,
          code: cleanCode,
          discount: discountVal,
          freeShipping: false,
          message: 'Bundle & Save: 12% off applied across your provisions basket.',
        };
      }
      return {
        valid: false,
        code: cleanCode,
        discount: 0,
        freeShipping: false,
        message: 'BUNDLE12 requires at least 2 items or a $75+ basket.',
      };
    }

    if (cleanCode === 'WELCOME10') {
      if (rawSubtotal >= 50) {
        return {
          valid: true,
          code: cleanCode,
          discount: 10.0,
          freeShipping: false,
          message: '$10.00 introductory discount applied.',
        };
      }
      return {
        valid: false,
        code: cleanCode,
        discount: 0,
        freeShipping: false,
        message: 'WELCOME10 requires a minimum order of $50.',
      };
    }

    return {
      valid: false,
      code: cleanCode,
      discount: 0,
      freeShipping: false,
      message: `Promotion code "${cleanCode}" is not recognized.`,
    };
  }

  calculateShipping(
    netSubtotal: number,
    itemCount: number,
    forceFreeShipping = false,
    deliveryMethodId: DeliveryMethodId = 'standard',
    threshold = FREE_SHIPPING_THRESHOLD
  ): {
    shippingFee: number;
    qualifiesForFreeShipping: boolean;
    amountNeededForFreeShipping: number;
  } {
    if (itemCount === 0) {
      return {
        shippingFee: 0,
        qualifiesForFreeShipping: true,
        amountNeededForFreeShipping: threshold,
      };
    }

    const method = DELIVERY_METHODS.find((m) => m.id === deliveryMethodId) || DELIVERY_METHODS[0];
    const qualifiesForFreeShipping = forceFreeShipping || (method.freeOverThreshold && netSubtotal >= threshold);

    const amountNeededForFreeShipping = qualifiesForFreeShipping || !method.freeOverThreshold
      ? 0
      : Number(Math.max(0, threshold - netSubtotal).toFixed(2));

    const shippingFee = qualifiesForFreeShipping ? 0 : method.baseCost;

    return {
      shippingFee,
      qualifiesForFreeShipping,
      amountNeededForFreeShipping,
    };
  }

  calculateTax(taxableAmount: number, taxRate = ESTIMATED_TAX_RATE): number {
    return Number((Math.max(0, taxableAmount) * taxRate).toFixed(2));
  }

  calculateTotal(
    netSubtotal: number,
    shippingFee: number,
    taxAmount: number
  ): number {
    return Number((netSubtotal + shippingFee + taxAmount).toFixed(2));
  }

  calculateNextDeliveryDate(cadence: ProductCadence = '4-weeks', fromDate = new Date()): string {
    const daysMap: Record<ProductCadence, number> = {
      '2-weeks': 14,
      '4-weeks': 28,
      '6-weeks': 42,
      '8-weeks': 56,
      '12-weeks': 84,
    };
    const days = daysMap[cadence] || 28;
    const targetDate = new Date(fromDate.getTime() + days * 24 * 60 * 60 * 1000);
    return targetDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  calculateSummary(
    items: CartItem[],
    promoCode?: string,
    deliveryMethodId: DeliveryMethodId = 'standard'
  ): CartSummary {
    const rawSubtotal = this.calculateSubtotal(items);
    let promoDiscount = 0;
    let forceFreeShipping = false;
    let appliedCode: string | undefined = undefined;

    if (promoCode) {
      const promoResult = this.validatePromoCode(promoCode, items);
      if (promoResult.valid) {
        promoDiscount = promoResult.discount;
        forceFreeShipping = promoResult.freeShipping;
        appliedCode = promoResult.code;
      }
    }

    const { subscriptionSavings, totalSavings } = this.calculateDiscount(items, promoDiscount);
    const netSubtotal = Math.max(0, Number((rawSubtotal - totalSavings).toFixed(2)));

    const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
    const { shippingFee, qualifiesForFreeShipping, amountNeededForFreeShipping } =
      this.calculateShipping(netSubtotal, itemCount, forceFreeShipping, deliveryMethodId);

    const estimatedTax = this.calculateTax(netSubtotal);
    const total = this.calculateTotal(netSubtotal, shippingFee, estimatedTax);

    const hasSubscriptionItems = items.some((i) => i.purchaseType === 'subscription');
    const hasOneTimeItems = items.some((i) => i.purchaseType === 'one-time');
    const isMixedCart = hasSubscriptionItems && hasOneTimeItems;

    // Calculate recurring cycle total for recurring provisions
    const recurringItems = items.filter((i) => i.purchaseType === 'subscription');
    let recurringCycleTotal: number | undefined = undefined;
    if (recurringItems.length > 0) {
      const recNetSubtotal = recurringItems.reduce((acc, i) => acc + i.lineTotal, 0);
      const recShipping = recNetSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 5.95;
      const recTax = this.calculateTax(recNetSubtotal);
      recurringCycleTotal = this.calculateTotal(recNetSubtotal, recShipping, recTax);
    }

    return {
      items,
      itemCount,
      subtotal: rawSubtotal,
      productSubtotal: rawSubtotal,
      subscriptionSavings,
      promotionDiscount: promoDiscount,
      appliedPromoCode: appliedCode,
      estimatedShipping: shippingFee,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      amountNeededForFreeShipping,
      qualifiesForFreeShipping,
      estimatedTax,
      total,
      deliveryMethodId,
      hasSubscriptionItems,
      hasOneTimeItems,
      isMixedCart,
      recurringCycleTotal,
    };
  }

  addItem(currentItems: CartItem[], product: Product, options?: CartAddOptions): CartItem[] {
    const quantity = options?.quantity ?? 1;
    const purchaseType: PurchaseType =
      options?.purchaseType ?? (product.subscription.eligible ? 'subscription' : 'one-time');
    const cadence: ProductCadence = options?.cadence ?? product.subscription.defaultCadence;

    let variant: ProductVariant | undefined = undefined;
    let unitPrice = product.basePrice;

    if (options?.variantId && product.variants?.length) {
      variant = product.variants.find((v) => v.id === options.variantId) || product.variants[0];
      if (variant) unitPrice = variant.price;
    } else if (product.variants?.length > 0) {
      variant = product.variants[0];
      unitPrice = variant.price;
    }

    const isSub = purchaseType === 'subscription' && product.subscription.eligible;
    const discountAmount = isSub
      ? Number(((unitPrice * SUBSCRIPTION_DISCOUNT_PERCENT) / 100).toFixed(2))
      : 0;
    const discountedUnitPrice = Number((unitPrice - discountAmount).toFixed(2));

    const existingIdx = currentItems.findIndex(
      (i) =>
        i.productId === product.id &&
        i.variantId === variant?.id &&
        i.purchaseType === purchaseType &&
        (purchaseType === 'one-time' || i.subscriptionCadence === cadence)
    );

    if (existingIdx > -1) {
      const updated = [...currentItems];
      const current = updated[existingIdx];
      const newQty = current.quantity + quantity;
      updated[existingIdx] = {
        ...current,
        quantity: newQty,
        discountAmount,
        totalDiscount: Number((discountAmount * newQty).toFixed(2)),
        lineTotal: Number((current.discountedUnitPrice * newQty).toFixed(2)),
      };
      return updated;
    }

    const newItem: CartItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      product,
      variantId: variant?.id,
      variant,
      quantity,
      purchaseType,
      subscriptionCadence: isSub ? cadence : undefined,
      unitPrice,
      discountedUnitPrice,
      discountAmount,
      totalDiscount: Number((discountAmount * quantity).toFixed(2)),
      lineTotal: Number((discountedUnitPrice * quantity).toFixed(2)),
      targetPetName: options?.targetPetName,
    };

    return [...currentItems, newItem];
  }

  removeItem(currentItems: CartItem[], itemId: string): CartItem[] {
    return currentItems.filter((i) => i.id !== itemId);
  }

  updateQuantity(currentItems: CartItem[], itemId: string, quantity: number): CartItem[] {
    if (quantity <= 0) {
      return this.removeItem(currentItems, itemId);
    }
    return currentItems.map((i) => {
      if (i.id !== itemId) return i;
      const totalDiscount = Number((i.discountAmount * quantity).toFixed(2));
      const lineTotal = Number((i.discountedUnitPrice * quantity).toFixed(2));
      return {
        ...i,
        quantity,
        totalDiscount,
        lineTotal,
      };
    });
  }

  setSubscription(
    currentItems: CartItem[],
    itemId: string,
    isSubscription: boolean,
    cadence?: ProductCadence
  ): CartItem[] {
    return currentItems.map((item) => {
      if (item.id !== itemId) return item;
      const eligible = item.product.subscription.eligible;
      const purchaseType: PurchaseType = isSubscription && eligible ? 'subscription' : 'one-time';

      const discountAmount =
        purchaseType === 'subscription'
          ? Number(((item.unitPrice * SUBSCRIPTION_DISCOUNT_PERCENT) / 100).toFixed(2))
          : 0;

      const discountedUnitPrice = Number((item.unitPrice - discountAmount).toFixed(2));

      const resolvedCadence =
        cadence || item.subscriptionCadence || item.product.subscription.defaultCadence;

      return {
        ...item,
        purchaseType,
        subscriptionCadence: purchaseType === 'subscription' ? resolvedCadence : undefined,
        unitPrice: item.unitPrice,
        discountAmount,
        discountedUnitPrice,
        totalDiscount: Number((discountAmount * item.quantity).toFixed(2)),
        lineTotal: Number((discountedUnitPrice * item.quantity).toFixed(2)),
      };
    });
  }

  updateCadence(currentItems: CartItem[], itemId: string, cadence: ProductCadence): CartItem[] {
    return currentItems.map((item) => {
      if (item.id !== itemId) return item;
      return {
        ...item,
        subscriptionCadence: cadence,
      };
    });
  }
}

export const cartService = new CartService();
