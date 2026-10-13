import { SiteProvider } from '../providers/contracts';
import { jsonSiteProvider } from '../providers/json/JsonSiteProvider';
import { FaqData } from '../types/data';

export class FaqService {
  private provider: SiteProvider;

  constructor(provider: SiteProvider = jsonSiteProvider) {
    this.provider = provider;
  }

  setProvider(provider: SiteProvider) {
    this.provider = provider;
  }

  async getFaqs(category?: string): Promise<FaqData[]> {
    return this.provider.getFaqs(category);
  }

  async getSubscriptionFaqs(): Promise<FaqData[]> {
    return this.provider.getFaqs('subscriptions');
  }

  async searchFaqs(query: string): Promise<FaqData[]> {
    const q = query.trim().toLowerCase();
    const all = await this.provider.getFaqs();
    if (!q) return all;

    return all.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
  }
}

export const faqService = new FaqService();
