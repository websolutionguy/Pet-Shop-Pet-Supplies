import { BlogProvider } from '../contracts';
import { BlogData } from '../../types/data';
import { ApiClient, defaultApiClient } from './apiClient';

/**
 * REST API Blog Provider
 *
 * Implements BlogProvider connecting to future backend endpoints:
 * - GET /api/blog
 * - GET /api/blog/:slug
 */
export class ApiBlogProvider implements BlogProvider {
  private client: ApiClient;

  constructor(client: ApiClient = defaultApiClient) {
    this.client = client;
  }

  /**
   * GET /api/blog
   */
  async getAll(): Promise<BlogData[]> {
    return this.client.get<BlogData[]>('/api/blog');
  }

  /**
   * GET /api/blog/:slug
   */
  async getBySlug(slug: string): Promise<BlogData | null> {
    try {
      return await this.client.get<BlogData>(`/api/blog/${slug}`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  /**
   * GET /api/blog?category=:category
   */
  async getByCategory(category: string): Promise<BlogData[]> {
    return this.client.get<BlogData[]>('/api/blog', { category });
  }
}

export const apiBlogProvider = new ApiBlogProvider();
