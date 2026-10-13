import { SiteProvider } from '../providers/contracts';
import { jsonSiteProvider } from '../providers/json/JsonSiteProvider';
import { PromotionData } from '../types/data';

export interface PromotionValidationResult {
  isValid: boolean;
  promotion?: PromotionData;
  discountAmount: number;
  message: string;
}

export class PromotionService {
  private provider: SiteProvider;

  constructor(provider: SiteProvider = jsonSiteProvider) {
    this.provider = provider;
  }

  setProvider(provider: SiteProvider) {
    this.provider = provider;
  }

  async getPromotions(): Promise<PromotionData[]> {
    return this.provider.getPromotions();
  }

  async getAutoShipPromotion(): Promise<PromotionData | null> {
    const list = await this.provider.getPromotions();
    const found = list.find((p) => p.code === 'AUTOSHIP10' && p.active);
    return found || null;
  }

  async validatePromoCode(
    code: string,
    cartTotal: number,
    hasSubscriptions = false
  ): Promise<PromotionValidationResult> {
    const cleanCode = code.trim().toUpperCase();
    const promotions = await this.provider.getPromotions();
    const promo = promotions.find((p) => p.code.toUpperCase() === cleanCode && p.active);

    if (!promo) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'Invalid or expired promotional code.',
      };
    }

    if (promo.minimumOrderAmount && cartTotal < promo.minimumOrderAmount) {
      return {
        isValid: false,
        discountAmount: 0,
        message: `Order must be at least $${promo.minimumOrderAmount.toFixed(2)} to use this code.`,
      };
    }

    if (promo.appliesTo === 'subscriptions' && !hasSubscriptions) {
      return {
        isValid: false,
        discountAmount: 0,
        message: 'This promotion is only applicable to routine auto-ship orders.',
      };
    }

    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = Number(((cartTotal * promo.discountValue) / 100).toFixed(2));
    } else if (promo.discountType === 'fixed') {
      discountAmount = Math.min(cartTotal, promo.discountValue);
    } else if (promo.discountType === 'free-shipping') {
      discountAmount = 5.95;
    }

    return {
      isValid: true,
      promotion: promo,
      discountAmount,
      message: `${promo.title} applied successfully!`,
    };
  }

  async applyPromotion(code: string, cartTotal: number): Promise<number> {
    const result = await this.validatePromoCode(code, cartTotal);
    return result.discountAmount;
  }
}

export const promotionService = new PromotionService();
