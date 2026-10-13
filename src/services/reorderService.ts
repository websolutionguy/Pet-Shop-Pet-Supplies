import { ProductProvider, SubscriptionProvider, OrderProvider } from '../providers/contracts';
import { jsonProductProvider } from '../providers/json/JsonProductProvider';
import { jsonSubscriptionProvider } from '../providers/json/JsonSubscriptionProvider';
import { jsonOrderProvider } from '../providers/json/JsonOrderProvider';
import { Product } from '../types/product';
import { ReorderConfigData } from '../types/data';
import { mapProductDataToProduct } from './productService';
import { Order, FrequentlyPurchasedItem } from '../types/order';

export interface ReorderRequestPayload {
  customerId: string;
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  shippingAddress?: Order['shippingAddress'];
}

export class ReorderService {
  private productProvider: ProductProvider;
  private subscriptionProvider: SubscriptionProvider;
  private orderProvider: OrderProvider;
  private cachedConfig: ReorderConfigData | null = null;

  constructor(
    productProvider: ProductProvider = jsonProductProvider,
    subscriptionProvider: SubscriptionProvider = jsonSubscriptionProvider,
    orderProvider: OrderProvider = jsonOrderProvider
  ) {
    this.productProvider = productProvider;
    this.subscriptionProvider = subscriptionProvider;
    this.orderProvider = orderProvider;
  }

  async getReorderConfig(): Promise<ReorderConfigData> {
    if (!this.cachedConfig) {
      this.cachedConfig = await this.subscriptionProvider.getReorderConfig();
    }
    return this.cachedConfig;
  }

  async getReorderableProducts(): Promise<Product[]> {
    const rawList = await this.productProvider.getReorderCandidates();
    return rawList.map(mapProductDataToProduct);
  }

  async getFrequentlyPurchasedItems(customerId = 'cust-eleanor-vance'): Promise<FrequentlyPurchasedItem[]> {
    const orders = await this.orderProvider.getByCustomerId(customerId);
    const candidateProducts = await this.getReorderableProducts();
    const itemMap = new Map<string, FrequentlyPurchasedItem>();

    // Analyze past orders
    for (const order of orders) {
      for (const lineItem of order.items) {
        const prod = candidateProducts.find((p) => p.id === lineItem.productId);
        const existing = itemMap.get(lineItem.productId);

        if (existing) {
          existing.timesOrdered += lineItem.quantity;
          if (new Date(order.placedAt) > new Date(existing.lastPurchasedAt)) {
            existing.lastPurchasedAt = order.placedAt;
          }
        } else {
          itemMap.set(lineItem.productId, {
            productId: lineItem.productId,
            productName: lineItem.productName,
            brand: prod?.brand || 'Rowan & Hound Reserve',
            category: prod?.categoryName || 'Pantry Staple',
            imageUrl: prod?.primaryImage,
            lastPurchasedAt: order.placedAt,
            timesOrdered: lineItem.quantity,
            preferredVariantName: lineItem.variantName || prod?.variants[0]?.name,
            preferredVariantPrice: lineItem.unitPrice || prod?.basePrice || 34.0,
            isSubscriptionEligible: prod?.subscription.eligible ?? true,
            subscriptionDiscount: prod?.subscription.discountPercentage ?? 10,
            targetPetName: lineItem.targetPetName || 'Barnaby',
            estimatedDaysRemaining: 7,
            pantryStatus: 'low',
          });
        }
      }
    }

    // Ensure our key catalog staples are included if orders are small
    for (const prod of candidateProducts.slice(0, 4)) {
      if (!itemMap.has(prod.id)) {
        itemMap.set(prod.id, {
          productId: prod.id,
          productName: prod.name,
          brand: prod.brand,
          category: prod.categoryName,
          imageUrl: prod.primaryImage,
          lastPurchasedAt: '2026-08-25T11:00:00Z',
          timesOrdered: 2,
          preferredVariantName: prod.variants[0]?.name,
          preferredVariantPrice: prod.basePrice,
          isSubscriptionEligible: prod.subscription.eligible,
          subscriptionDiscount: prod.subscription.discountPercentage || 10,
          targetPetName: 'Barnaby',
          estimatedDaysRemaining: 12,
          pantryStatus: 'stocked',
        });
      }
    }

    return Array.from(itemMap.values());
  }

  async calculateReorderPrice(basePrice: number, discountPercentage?: number): Promise<number> {
    const config = await this.getReorderConfig();
    const discount =
      discountPercentage !== undefined
        ? discountPercentage
        : config.reorderDiscountPercentage || 5;

    const finalPrice = basePrice - (basePrice * discount) / 100;
    return Number(finalPrice.toFixed(2));
  }

  calculateReorderPriceSync(basePrice: number, discountPercentage = 5): number {
    const finalPrice = basePrice - (basePrice * discountPercentage) / 100;
    return Number(finalPrice.toFixed(2));
  }

  async estimateDepletionDate(
    lastOrderDate: string,
    packageWeightLbs: number,
    petWeightLbs: number
  ): Promise<{ estimatedDepletionDate: string; daysRemaining: number }> {
    // Average canine dry food intake ~0.5 lb per 20 lbs body weight per day
    const dailyIntakeLbs = Math.max(0.2, (petWeightLbs / 25) * 0.5);
    const totalDaysDuration = Math.round(packageWeightLbs / dailyIntakeLbs);

    const orderTime = new Date(lastOrderDate).getTime();
    const depletionTime = orderTime + totalDaysDuration * 24 * 60 * 60 * 1000;
    const nowTime = Date.now();

    const daysRemaining = Math.max(0, Math.round((depletionTime - nowTime) / (24 * 60 * 60 * 1000)));

    return {
      estimatedDepletionDate: new Date(depletionTime).toISOString().split('T')[0],
      daysRemaining,
    };
  }

  async createReorderRequest(payload: ReorderRequestPayload): Promise<Order> {
    const lineItems: Order['items'] = [];
    let subtotal = 0;

    for (const item of payload.items) {
      const productData = await this.productProvider.getById(item.productId);
      if (productData) {
        const unitPrice = productData.price;
        const discountPrice = await this.calculateReorderPrice(unitPrice);
        const lineTotal = discountPrice * item.quantity;
        subtotal += lineTotal;

        lineItems.push({
          id: `item-${Date.now()}-${item.productId}`,
          productId: productData.id,
          productName: productData.name,
          quantity: item.quantity,
          unitPrice,
          totalPrice: lineTotal,
          isSubscription: false,
        });
      }
    }

    const shipping = subtotal >= 49 ? 0 : 5.95;
    const total = Number((subtotal + shipping).toFixed(2));

    return this.orderProvider.createOrder({
      customerId: payload.customerId,
      items: lineItems,
      subtotal,
      discount: 0,
      shipping,
      tax: 0,
      total,
      shippingAddress: payload.shippingAddress,
      isSubscriptionRenewal: false,
    });
  }
}

export const reorderService = new ReorderService();
