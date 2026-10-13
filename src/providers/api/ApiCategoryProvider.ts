import { CategoryProvider } from '../contracts';
import { CategoryData } from '../../types/data';
import { ApiClient, defaultApiClient } from './apiClient';

/**
 * REST API Category Provider
 *
 * Implements CategoryProvider connecting to future backend endpoints:
 * - GET /api/categories
 * - GET /api/categories/:slug
 */
export class ApiCategoryProvider implements CategoryProvider {
  private client: ApiClient;

  constructor(client: ApiClient = defaultApiClient) {
    this.client = client;
  }

  /**
   * GET /api/categories
   */
  async getAll(): Promise<CategoryData[]> {
    return this.client.get<CategoryData[]>('/api/categories');
  }

  /**
   * GET /api/categories/:slug
   */
  async getBySlug(slug: string): Promise<CategoryData | null> {
    try {
      return await this.client.get<CategoryData>(`/api/categories/${slug}`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  }
}

export const apiCategoryProvider = new ApiCategoryProvider();
