import { SubscriptionProvider } from '../providers/contracts';
import { ProviderFactory } from '../providers/factory';
import { jsonSubscriptionProvider } from '../providers/json/JsonSubscriptionProvider';
import {
  SubscriptionPlanData,
  SubscriptionFrequencyData,
  SubscriptionConfigData,
  ReorderConfigData,
} from '../types/data';
import {
  SubscriptionSchedule,
  SubscriptionStatus,
  SubscriptionState,
  SUBSCRIPTION_STATES,
  CalculatePriceInput,
  SubscriptionPriceCalculation,
} from '../types/subscription';
import { ProductCadence, Product, ProductVariant } from '../types/product';
import { CADENCE_OPTIONS, SUBSCRIPTION_DISCOUNT_PERCENT } from '../lib/constants';
import { productService } from './productService';
import { SubscriptionValidator, SubscriptionValidationResult } from './subscriptionValidator';
import defaultSubscriptionConfig from '../data/subscription-config.json';

export class SubscriptionService {
  private provider: SubscriptionProvider;
  private cachedConfig: SubscriptionConfigData | null = null;

  constructor(provider: SubscriptionProvider = ProviderFactory.getSubscriptionProvider()) {
    this.provider = provider;
  }

  setProvider(provider: SubscriptionProvider) {
    this.provider = provider;
    this.cachedConfig = null;
  }

  async getPlans(): Promise<SubscriptionPlanData[]> {
    return this.provider.getPlans();
  }

  async getPlansByProductId(productId: string): Promise<SubscriptionPlanData[]> {
    return this.provider.getPlansByProductId(productId);
  }

  async getEligiblePlans(productId: string): Promise<SubscriptionPlanData[]> {
    return this.getPlansByProductId(productId);
  }

  async getFrequencies(): Promise<SubscriptionFrequencyData[]> {
    return this.provider.getFrequencies();
  }

  async getConfig(): Promise<SubscriptionConfigData> {
    if (!this.cachedConfig) {
      this.cachedConfig = await this.provider.getConfig();
    }
    return this.cachedConfig;
  }

  async getReorderConfig(): Promise<ReorderConfigData> {
    return this.provider.getReorderConfig();
  }

  async getDefaultDiscountPercentage(): Promise<number> {
    const config = await this.getConfig();
    return config.defaultDiscountPercentage || SUBSCRIPTION_DISCOUNT_PERCENT;
  }

  async calculateSubscriptionPrice(
    basePrice: number,
    customDiscountPercentage?: number
  ): Promise<number> {
    const discount =
      customDiscountPercentage !== undefined
        ? customDiscountPercentage
        : await this.getDefaultDiscountPercentage();

    const discounted = basePrice - (basePrice * discount) / 100;
    return Number(discounted.toFixed(2));
  }

  // Synchronous convenience method for UI fast renders
  calculateSubscriptionPriceSync(
    basePrice: number,
    discountPercentage = SUBSCRIPTION_DISCOUNT_PERCENT
  ): number {
    const discounted = basePrice - (basePrice * discountPercentage) / 100;
    return Number(discounted.toFixed(2));
  }

  /**
   * Phase 8 Core Subscription Price & Rules Calculator
   * Validates product, variant, quantity, and cadence against subscription-config.json
   */
  async calculatePrice(input: CalculatePriceInput): Promise<SubscriptionPriceCalculation> {
    const { productId, quantity, frequency, variant } = input;
    const config = await this.getConfig();
    const product = await productService.getProductById(productId);

    return this.evaluateSubscriptionRules({
      product,
      config,
      quantity,
      frequency,
      variant,
    });
  }

  /**
   * Synchronous rules evaluation when product or default config is already in memory
   */
  calculatePriceSync(
    input: CalculatePriceInput,
    product: Product
  ): SubscriptionPriceCalculation {
    const config = this.cachedConfig || (defaultSubscriptionConfig as SubscriptionConfigData);
    return this.evaluateSubscriptionRules({
      product,
      config,
      quantity: input.quantity,
      frequency: input.frequency,
      variant: input.variant,
    });
  }

  private evaluateSubscriptionRules(params: {
    product: Product | null;
    config: SubscriptionConfigData;
    quantity: number;
    frequency: string;
    variant?: ProductVariant | { id: string; price: number; name?: string; inStock?: boolean };
  }): SubscriptionPriceCalculation {
    const { product, config, quantity, frequency, variant } = params;

    const matchedVariant = product && variant
      ? product.variants.find((v) => v.id === variant.id) || variant
      : product?.variants?.[0];

    const unitPrice = matchedVariant?.price ?? product?.basePrice ?? 0;
    const basePrice = Number((unitPrice * quantity).toFixed(2));
    const cadenceDays = CADENCE_OPTIONS[frequency as ProductCadence]?.intervalDays || 28;

    // Delegate to SubscriptionValidator for comprehensive rule enforcement
    const validation = SubscriptionValidator.validate({
      product,
      variant: matchedVariant,
      quantity,
      frequency,
      config,
    });

    if (!validation.isValid) {
      return {
        status: validation.status,
        statusReason: validation.shopperMessage,
        isEligible: false,
        basePrice,
        unitPrice,
        quantity,
        frequency,
        discountPercentage: 0,
        discountAmount: 0,
        subscriptionPrice: basePrice,
        unitSubscriptionPrice: unitPrice,
        savings: 0,
        estimatedNextDelivery: 'Not Available',
        cadenceDays,
        annualSavings: 0,
      };
    }

    // Dynamic discount from product override or config
    const discountPercentage =
      product?.subscription?.discountPercentage ||
      config.discount ||
      config.defaultDiscountPercentage ||
      10;
    const unitDiscountAmount = Number(((unitPrice * discountPercentage) / 100).toFixed(2));
    const unitSubscriptionPrice = Number((unitPrice - unitDiscountAmount).toFixed(2));
    const discountAmount = Number((unitDiscountAmount * quantity).toFixed(2));
    const subscriptionPrice = Number((unitSubscriptionPrice * quantity).toFixed(2));
    const savings = discountAmount;

    // Next delivery date calculation based on intervalDays
    const nextDeliveryTimestamp = Date.now() + cadenceDays * 24 * 60 * 60 * 1000;
    const nextDeliveryDate = new Date(nextDeliveryTimestamp);
    const estimatedNextDelivery = nextDeliveryDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const annualSavings = this.calculateAnnualSavings(savings, frequency as ProductCadence);

    return {
      status: SUBSCRIPTION_STATES.SUBSCRIPTION_AVAILABLE,
      isEligible: true,
      basePrice,
      unitPrice,
      quantity,
      frequency,
      discountPercentage,
      discountAmount,
      subscriptionPrice,
      unitSubscriptionPrice,
      savings,
      estimatedNextDelivery,
      cadenceDays,
      annualSavings,
    };
  }

  async validateSubscription(input: {
    productId: string;
    quantity: number;
    frequency: string;
    variantId?: string;
    orderTotal?: number;
  }): Promise<SubscriptionValidationResult> {
    const config = await this.getConfig();
    const product = await productService.getProductById(input.productId);
    const variant = product?.variants.find((v) => v.id === input.variantId);
    return SubscriptionValidator.validate({
      product,
      variant,
      quantity: input.quantity,
      frequency: input.frequency,
      config,
      orderTotal: input.orderTotal,
    });
  }

  async validateOneTimePurchase(productId: string): Promise<SubscriptionValidationResult> {
    const config = await this.getConfig();
    const product = await productService.getProductById(productId);
    if (!product) {
      return {
        isValid: false,
        status: SUBSCRIPTION_STATES.PRODUCT_UNAVAILABLE,
        errorCode: 'PRODUCT_UNAVAILABLE',
        shopperMessage: 'The requested provision could not be found in our catalog.',
      };
    }
    return SubscriptionValidator.validateOneTime(product, config);
  }

  async isSubscriptionOnly(productId: string): Promise<boolean> {
    const config = await this.getConfig();
    return Boolean(config.subscriptionOnlyProducts?.includes(productId));
  }

  async isOneTimeOnly(productId: string): Promise<boolean> {
    const config = await this.getConfig();
    return Boolean(config.oneTimeOnlyProducts?.includes(productId));
  }

  async isProductEligible(productId: string): Promise<boolean> {
    const config = await this.getConfig();
    if (config.oneTimeOnlyProducts?.includes(productId)) return false;
    if (
      config.eligibleProducts &&
      config.eligibleProducts.length > 0 &&
      !config.eligibleProducts.includes('*')
    ) {
      return config.eligibleProducts.includes(productId);
    }
    const product = await productService.getProductById(productId);
    return product ? (product.subscription?.eligible ?? true) : false;
  }

  calculateAnnualSavings(cycleDiscount: number, cadence: ProductCadence): number {
    const intervalDays = CADENCE_OPTIONS[cadence]?.intervalDays || 28;
    const cyclesPerYear = Math.floor(365 / intervalDays);
    return Math.round(cycleDiscount * cyclesPerYear * 100) / 100;
  }

  async getByCustomerId(customerId: string): Promise<SubscriptionSchedule[]> {
    return this.provider.getCustomerSubscriptions(customerId);
  }

  async getAll(): Promise<SubscriptionSchedule[]> {
    return this.provider.getAll();
  }

  async createSubscription(
    subscriptionData: Partial<SubscriptionSchedule>
  ): Promise<SubscriptionSchedule> {
    return this.provider.createSubscription(subscriptionData);
  }

  async updateSubscription(
    id: string,
    updates: Partial<SubscriptionSchedule>
  ): Promise<SubscriptionSchedule> {
    return this.provider.updateSubscription(id, updates);
  }

  async getSubscriptions(customerId = 'cust-eleanor-vance'): Promise<SubscriptionSchedule[]> {
    return this.getByCustomerId(customerId);
  }

  async getCustomerSubscriptions(customerId: string): Promise<SubscriptionSchedule[]> {
    return this.getByCustomerId(customerId);
  }

  async getById(id: string): Promise<SubscriptionSchedule | null> {
    return this.provider.getSubscriptionById(id);
  }

  async getSubscriptionById(id: string): Promise<SubscriptionSchedule | null> {
    return this.getById(id);
  }

  async updateStatus(id: string, status: SubscriptionStatus): Promise<SubscriptionSchedule> {
    return this.provider.updateStatus(id, status);
  }

  async updateCadence(id: string, cadence: ProductCadence): Promise<SubscriptionSchedule> {
    return this.provider.updateCadence(id, cadence);
  }

  async updateFrequency(id: string, cadence: ProductCadence): Promise<SubscriptionSchedule> {
    return this.updateCadence(id, cadence);
  }

  async skipNextShipment(id: string): Promise<SubscriptionSchedule> {
    return this.provider.skipNextShipment(id);
  }

  async skipNextDelivery(id: string): Promise<SubscriptionSchedule> {
    return this.skipNextShipment(id);
  }

  async pauseSubscription(id: string): Promise<SubscriptionSchedule> {
    return this.updateStatus(id, 'paused');
  }

  async resumeSubscription(id: string): Promise<SubscriptionSchedule> {
    return this.updateStatus(id, 'active');
  }

  async cancelSubscription(id: string, reason?: string): Promise<SubscriptionSchedule> {
    return this.updateStatus(id, 'cancelled');
  }

  async updateQuantity(id: string, itemId: string, quantity: number): Promise<SubscriptionSchedule> {
    if (this.provider.updateQuantity) {
      return this.provider.updateQuantity(id, itemId, quantity);
    }
    const current = await this.getById(id);
    if (!current) throw new Error(`Subscription ${id} not found`);
    return current;
  }

  async updateItems(id: string, items: any[]): Promise<SubscriptionSchedule> {
    if (this.provider.updateItems) {
      return this.provider.updateItems(id, items);
    }
    const current = await this.getById(id);
    if (!current) throw new Error(`Subscription ${id} not found`);
    return current;
  }
}

export const subscriptionService = new SubscriptionService();
