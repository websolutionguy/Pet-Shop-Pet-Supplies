import { ReviewProvider } from '../contracts';
import { ReviewData } from '../../types/data';
import { ApiClient, defaultApiClient } from './apiClient';

/**
 * REST API Review Provider
 *
 * Implements ReviewProvider connecting to future backend endpoints:
 * - GET /api/reviews
 * - GET /api/reviews?productId=:productId
 * - POST /api/reviews
 */
export class ApiReviewProvider implements ReviewProvider {
  private client: ApiClient;

  constructor(client: ApiClient = defaultApiClient) {
    this.client = client;
  }

  /**
   * GET /api/reviews
   */
  async getAll(): Promise<ReviewData[]> {
    return this.client.get<ReviewData[]>('/api/reviews');
  }

  /**
   * GET /api/reviews?productId=:productId
   */
  async getByProductId(productId: string): Promise<ReviewData[]> {
    return this.client.get<ReviewData[]>('/api/reviews', { productId });
  }

  /**
   * POST /api/reviews
   */
  async createReview(review: Partial<ReviewData>): Promise<ReviewData> {
    return this.client.post<ReviewData>('/api/reviews', review);
  }
}

export const apiReviewProvider = new ApiReviewProvider();
