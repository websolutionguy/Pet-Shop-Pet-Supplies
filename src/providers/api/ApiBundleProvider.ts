import { BundleProvider } from '../contracts';
import { BundleData } from '../../types/data';
import { ApiClient, defaultApiClient } from './apiClient';

/**
 * REST API Bundle Provider
 *
 * Implements BundleProvider connecting to future backend endpoints:
 * - GET /api/bundles
 * - GET /api/bundles/:slug
 */
export class ApiBundleProvider implements BundleProvider {
  private client: ApiClient;

  constructor(client: ApiClient = defaultApiClient) {
    this.client = client;
  }

  /**
   * GET /api/bundles
   */
  async getAll(): Promise<BundleData[]> {
    return this.client.get<BundleData[]>('/api/bundles');
  }

  /**
   * GET /api/bundles/:slug
   */
  async getBySlug(slug: string): Promise<BundleData | null> {
    try {
      return await this.client.get<BundleData>(`/api/bundles/${slug}`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  }
}

export const apiBundleProvider = new ApiBundleProvider();
