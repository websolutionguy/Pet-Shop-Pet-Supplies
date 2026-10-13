import { SiteProvider } from '../contracts';
import {
  SiteData,
  CompanyData,
  NavigationData,
  FaqData,
  ShippingData,
  TaxData,
  PromotionData,
  BundleData,
  AddonData,
} from '../../types/data';

import rawSite from '../../data/site.json';
import rawCompany from '../../data/company.json';
import rawNavigation from '../../data/navigation.json';
import rawFaqs from '../../data/faqs.json';
import rawShipping from '../../data/shipping.json';
import rawTax from '../../data/tax.json';
import rawPromotions from '../../data/promotions.json';
import rawBundles from '../../data/bundles.json';
import rawAddons from '../../data/addons.json';

export class JsonSiteProvider implements SiteProvider {
  async getSite(): Promise<SiteData> {
    return { ...(rawSite as SiteData) };
  }

  async getCompany(): Promise<CompanyData> {
    return { ...(rawCompany as CompanyData) };
  }

  async getNavigation(): Promise<NavigationData> {
    return { ...(rawNavigation as NavigationData) };
  }

  async getFaqs(category?: string): Promise<FaqData[]> {
    const list = rawFaqs as FaqData[];
    if (category) {
      return list.filter((f) => f.category === category);
    }
    return [...list];
  }

  async getShipping(): Promise<ShippingData> {
    return { ...(rawShipping as ShippingData) };
  }

  async getTax(): Promise<TaxData> {
    return { ...(rawTax as TaxData) };
  }

  async getPromotions(): Promise<PromotionData[]> {
    return [...(rawPromotions as PromotionData[])];
  }

  async getBundles(): Promise<BundleData[]> {
    return [...(rawBundles as BundleData[])];
  }

  async getAddons(): Promise<AddonData[]> {
    return [...(rawAddons as AddonData[])];
  }
}

export const jsonSiteProvider = new JsonSiteProvider();
