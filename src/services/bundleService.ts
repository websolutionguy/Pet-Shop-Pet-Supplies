import { BundleData, CuratedBundle, BundlePriceCalculation } from '../types/bundle';
import { Product, ProductCadence } from '../types/product';
import { productService } from './productService';
import { BundleProvider } from '../providers/contracts';
import { ProviderFactory } from '../providers/factory';
import { jsonBundleProvider } from '../providers/json/JsonBundleProvider';

export class BundleService {
  private provider: BundleProvider;

  constructor(provider: BundleProvider = ProviderFactory.getBundleProvider()) {
    this.provider = provider;
  }

  setProvider(provider: BundleProvider) {
    this.provider = provider;
  }

  /**
   * Returns all curated bundles with their resolved products and calculated individual totals.
   */
  async getBundles(petTypeFilter?: string): Promise<CuratedBundle[]> {
    const rawBundles = await this.provider.getAll();
    const allProducts = await productService.getAll();
    const productMap = new Map<string, Product>();
    allProducts.forEach((p) => productMap.set(p.id, p));

    const results: CuratedBundle[] = [];

    for (const b of rawBundles) {
      if (
        petTypeFilter &&
        petTypeFilter !== 'all' &&
        b.petType !== 'all' &&
        b.petType !== 'both' &&
        b.petType !== petTypeFilter
      ) {
        continue;
      }

      const products: Product[] = [];
      let individualTotal = 0;

      for (const pid of b.productIds) {
        const prod = productMap.get(pid);
        if (prod) {
          products.push(prod);
          individualTotal += prod.basePrice;
        }
      }

      individualTotal = Number(individualTotal.toFixed(2));
      const bundleSavings = Number(Math.max(0, individualTotal - b.bundlePrice).toFixed(2));
      const discountPercentage =
        individualTotal > 0 ? Math.round((bundleSavings / individualTotal) * 100) : 0;

      results.push({
        id: b.id,
        slug: b.slug,
        name: b.name,
        petType: b.petType as any,
        tagline: b.tagline || '',
        shortDescription: b.shortDescription || '',
        description: b.description || '',
        editorialCuratorNotes: b.editorialCuratorNotes || '',
        bundlePrice: b.bundlePrice,
        compareAtPrice: b.compareAtPrice || individualTotal,
        subscriptionEligible: b.subscriptionEligible ?? true,
        subscriptionDiscount: b.subscriptionDiscount || 10,
        defaultCadence: (b.defaultCadence || '4-weeks') as ProductCadence,
        supportedCadences: (b.supportedCadences || [
          '2-weeks',
          '4-weeks',
          '6-weeks',
          '8-weeks',
        ]) as ProductCadence[],
        featured: !!b.featured,
        badge: b.badge,
        images: b.images || [],
        productIds: b.productIds || [],
        savingsText: `Save ${discountPercentage}% as bundled set + 10% auto-ship savings`,
        products,
        individualTotal,
        bundleSavings,
        discountPercentage,
      });
    }

    return results;
  }

  calculateBundleSavings(bundle: {
    bundlePrice: number;
    compareAtPrice?: number;
    individualTotal?: number;
  }): { savingsAmount: number; percentageSaved: number } {
    const compare = bundle.compareAtPrice || bundle.individualTotal || bundle.bundlePrice;
    const savingsAmount = Math.max(0, compare - bundle.bundlePrice);
    const percentageSaved = compare > 0 ? Math.round((savingsAmount / compare) * 100) : 0;
    return {
      savingsAmount: Number(savingsAmount.toFixed(2)),
      percentageSaved,
    };
  }

  /**
   * Retrieves a single curated bundle by its URL slug.
   */
  async getBundleBySlug(slug: string): Promise<CuratedBundle | null> {
    const all = await this.getBundles();
    const found = all.find((b) => b.slug === slug);
    return found || null;
  }

  /**
   * Retrieves a single curated bundle by its ID.
   */
  async getBundleById(id: string): Promise<CuratedBundle | null> {
    const all = await this.getBundles();
    const found = all.find((b) => b.id === id);
    return found || null;
  }

  /**
   * Computes authentic financial calculations for a bundle without manufactured savings.
   */
  calculateBundlePrice(
    bundle: CuratedBundle,
    purchaseType: 'one-time' | 'subscription' = 'one-time',
    cadence?: ProductCadence
  ): BundlePriceCalculation {
    const individualTotal = bundle.individualTotal;
    const bundlePrice = bundle.bundlePrice;
    const bundleSavings = Number(Math.max(0, individualTotal - bundlePrice).toFixed(2));
    const isSubscriptionEligible = bundle.subscriptionEligible;
    const subscriptionDiscountPercentage = bundle.subscriptionDiscount || 10;

    if (purchaseType === 'subscription' && isSubscriptionEligible) {
      const subscriptionDiscountAmount = Number(
        ((bundlePrice * subscriptionDiscountPercentage) / 100).toFixed(2)
      );
      const subscriptionPrice = Number((bundlePrice - subscriptionDiscountAmount).toFixed(2));
      const totalSavings = Number((individualTotal - subscriptionPrice).toFixed(2));

      return {
        individualTotal,
        bundlePrice,
        bundleSavings,
        isSubscriptionEligible,
        purchaseType: 'subscription',
        subscriptionDiscountPercentage,
        subscriptionPrice,
        subscriptionSavings: subscriptionDiscountAmount,
        finalPrice: subscriptionPrice,
        totalSavings,
        cadence: cadence || bundle.defaultCadence || '4-weeks',
      };
    }

    return {
      individualTotal,
      bundlePrice,
      bundleSavings,
      isSubscriptionEligible,
      purchaseType: 'one-time',
      subscriptionDiscountPercentage,
      subscriptionPrice: Number(
        (bundlePrice * (1 - subscriptionDiscountPercentage / 100)).toFixed(2)
      ),
      subscriptionSavings: Number(
        ((bundlePrice * subscriptionDiscountPercentage) / 100).toFixed(2)
      ),
      finalPrice: bundlePrice,
      totalSavings: bundleSavings,
      cadence: undefined,
    };
  }
}

export const bundleService = new BundleService();
