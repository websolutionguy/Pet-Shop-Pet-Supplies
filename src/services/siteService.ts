import { SiteProvider } from '../providers/contracts';
import { jsonSiteProvider } from '../providers/json/JsonSiteProvider';
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
} from '../types/data';

export class SiteService {
  private provider: SiteProvider;

  constructor(provider: SiteProvider = jsonSiteProvider) {
    this.provider = provider;
  }

  setProvider(provider: SiteProvider) {
    this.provider = provider;
  }

  async getSite(): Promise<SiteData> {
    return this.provider.getSite();
  }

  async getCompany(): Promise<CompanyData> {
    return this.provider.getCompany();
  }

  async getNavigation(): Promise<NavigationData> {
    return this.provider.getNavigation();
  }

  async getFaqs(category?: string): Promise<FaqData[]> {
    return this.provider.getFaqs(category);
  }

  async getShipping(): Promise<ShippingData> {
    return this.provider.getShipping();
  }

  async getTax(): Promise<TaxData> {
    return this.provider.getTax();
  }

  async getPromotions(): Promise<PromotionData[]> {
    return this.provider.getPromotions();
  }

  async getBundles(): Promise<BundleData[]> {
    return this.provider.getBundles();
  }

  async getAddons(): Promise<AddonData[]> {
    return this.provider.getAddons();
  }
}

export const siteService = new SiteService();
