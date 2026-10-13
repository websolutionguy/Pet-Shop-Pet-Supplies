import { ReviewProvider } from '../providers/contracts';
import { ProviderFactory } from '../providers/factory';
import { jsonReviewProvider } from '../providers/json/JsonReviewProvider';
import { ReviewData } from '../types/data';

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export class ReviewService {
  private provider: ReviewProvider;

  constructor(provider: ReviewProvider = ProviderFactory.getReviewProvider()) {
    this.provider = provider;
  }

  setProvider(provider: ReviewProvider) {
    this.provider = provider;
  }

  async getAll(): Promise<ReviewData[]> {
    return this.provider.getAll();
  }

  async getReviews(productId?: string): Promise<ReviewData[]> {
    if (productId) {
      return this.provider.getByProductId(productId);
    }
    return this.provider.getAll();
  }

  async getByProductId(productId: string): Promise<ReviewData[]> {
    return this.provider.getByProductId(productId);
  }

  async getFeaturedReviews(): Promise<ReviewData[]> {
    const all = await this.provider.getAll();
    return all.filter((r) => r.rating === 5).slice(0, 4);
  }

  async getProductRatingSummary(productId: string): Promise<RatingSummary> {
    const reviews = await this.provider.getByProductId(productId);
    if (reviews.length === 0) {
      return {
        averageRating: 5.0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    reviews.forEach((r) => {
      sum += r.rating;
      dist[r.rating] = (dist[r.rating] || 0) + 1;
    });

    const averageRating = Number((sum / reviews.length).toFixed(1));

    return {
      averageRating,
      totalReviews: reviews.length,
      ratingDistribution: dist,
    };
  }
}

export const reviewService = new ReviewService();
