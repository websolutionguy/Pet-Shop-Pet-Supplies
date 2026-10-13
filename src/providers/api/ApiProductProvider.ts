import { ProductProvider, ProductFilterOptions } from '../contracts';
import { ProductData } from '../../types/data';
import { ApiClient, defaultApiClient } from './apiClient';

/**
 * REST API Product Provider
 *
 * Implements ProductProvider interface connecting to future backend endpoints:
 * - GET /api/products
 * - GET /api/products/:slug
 * - GET /api/products/:id
 */
export class ApiProductProvider implements ProductProvider {
  private client: ApiClient;

  constructor(client: ApiClient = defaultApiClient) {
    this.client = client;
  }

  /**
   * GET /api/products
   */
  async getAll(filters?: ProductFilterOptions): Promise<ProductData[]> {
    return this.client.get<ProductData[]>('/api/products', {
      petType: filters?.petType,
      category: filters?.category,
      subscriptionOnly: filters?.subscriptionOnly,
      query: filters?.query,
      sortBy: filters?.sortBy,
    });
  }

  /**
   * GET /api/products/:slug
   */
  async getBySlug(slug: string): Promise<ProductData | null> {
    try {
      return await this.client.get<ProductData>(`/api/products/${slug}`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  /**
   * GET /api/products/:id
   */
  async getById(id: string): Promise<ProductData | null> {
    try {
      return await this.client.get<ProductData>(`/api/products/${id}`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  /**
   * GET /api/products?featured=true
   */
  async getFeatured(): Promise<ProductData[]> {
    return this.client.get<ProductData[]>('/api/products', { featured: true });
  }

  /**
   * GET /api/products?reorder=true
   */
  async getReorderCandidates(): Promise<ProductData[]> {
    return this.client.get<ProductData[]>('/api/products', { reorder: true });
  }

  /**
   * GET /api/products?query=:query
   */
  async search(query: string): Promise<ProductData[]> {
    return this.client.get<ProductData[]>('/api/products', { query });
  }
}

export const apiProductProvider = new ApiProductProvider();
