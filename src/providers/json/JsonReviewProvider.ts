import { ReviewProvider } from '../contracts';
import { ReviewData } from '../../types/data';
import rawReviews from '../../data/reviews.json';

const reviewsList = rawReviews as ReviewData[];

export class JsonReviewProvider implements ReviewProvider {
  async getAll(): Promise<ReviewData[]> {
    return [...reviewsList];
  }

  async getByProductId(productId: string): Promise<ReviewData[]> {
    return reviewsList.filter((r) => r.productId === productId);
  }
}

export const jsonReviewProvider = new JsonReviewProvider();
