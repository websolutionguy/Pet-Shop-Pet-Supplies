import { SubscriptionProvider } from '../contracts';
import {
  SubscriptionPlanData,
  SubscriptionFrequencyData,
  SubscriptionConfigData,
  ReorderConfigData,
} from '../../types/data';
import { SubscriptionSchedule, SubscriptionStatus } from '../../types/subscription';
import { ProductCadence } from '../../types/product';
import { ApiClient, defaultApiClient } from './apiClient';

/**
 * REST API Subscription Provider
 *
 * Implements SubscriptionProvider connecting to future backend endpoints:
 * - GET /api/subscriptions
 * - POST /api/subscriptions
 * - PATCH /api/subscriptions/:id
 * - POST /api/subscriptions/:id/skip
 * - POST /api/subscriptions/:id/pause
 * - DELETE /api/subscriptions/:id
 */
export class ApiSubscriptionProvider implements SubscriptionProvider {
  private client: ApiClient;

  constructor(client: ApiClient = defaultApiClient) {
    this.client = client;
  }

  /**
   * GET /api/subscriptions
   */
  async getAll(): Promise<SubscriptionSchedule[]> {
    return this.client.get<SubscriptionSchedule[]>('/api/subscriptions');
  }

  /**
   * GET /api/subscriptions?customerId=:customerId
   */
  async getCustomerSubscriptions(customerId: string): Promise<SubscriptionSchedule[]> {
    return this.client.get<SubscriptionSchedule[]>('/api/subscriptions', { customerId });
  }

  /**
   * GET /api/subscriptions/:id
   */
  async getSubscriptionById(id: string): Promise<SubscriptionSchedule | null> {
    try {
      return await this.client.get<SubscriptionSchedule>(`/api/subscriptions/${id}`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  /**
   * POST /api/subscriptions
   */
  async createSubscription(
    subscription: Partial<SubscriptionSchedule>
  ): Promise<SubscriptionSchedule> {
    return this.client.post<SubscriptionSchedule>('/api/subscriptions', subscription);
  }

  /**
   * PATCH /api/subscriptions/:id
   */
  async updateSubscription(
    id: string,
    updates: Partial<SubscriptionSchedule>
  ): Promise<SubscriptionSchedule> {
    return this.client.patch<SubscriptionSchedule>(`/api/subscriptions/${id}`, updates);
  }

  /**
   * POST /api/subscriptions/:id/skip
   */
  async skipNextShipment(id: string): Promise<SubscriptionSchedule> {
    return this.client.post<SubscriptionSchedule>(`/api/subscriptions/${id}/skip`);
  }

  /**
   * POST /api/subscriptions/:id/pause
   */
  async pauseSubscription(id: string): Promise<SubscriptionSchedule> {
    return this.client.post<SubscriptionSchedule>(`/api/subscriptions/${id}/pause`);
  }

  /**
   * DELETE /api/subscriptions/:id
   */
  async cancelSubscription(id: string): Promise<SubscriptionSchedule | boolean> {
    return this.client.delete<SubscriptionSchedule>(`/api/subscriptions/${id}`);
  }

  /**
   * PATCH /api/subscriptions/:id with status
   */
  async updateStatus(id: string, status: SubscriptionStatus): Promise<SubscriptionSchedule> {
    return this.updateSubscription(id, { status });
  }

  /**
   * PATCH /api/subscriptions/:id with cadence
   */
  async updateCadence(id: string, cadence: ProductCadence): Promise<SubscriptionSchedule> {
    return this.updateSubscription(id, { cadence });
  }

  /**
   * GET /api/subscriptions/plans
   */
  async getPlans(): Promise<SubscriptionPlanData[]> {
    return this.client.get<SubscriptionPlanData[]>('/api/subscriptions/plans');
  }

  /**
   * GET /api/subscriptions/plans?productId=:productId
   */
  async getPlansByProductId(productId: string): Promise<SubscriptionPlanData[]> {
    return this.client.get<SubscriptionPlanData[]>('/api/subscriptions/plans', { productId });
  }

  /**
   * GET /api/subscriptions/frequencies
   */
  async getFrequencies(): Promise<SubscriptionFrequencyData[]> {
    return this.client.get<SubscriptionFrequencyData[]>('/api/subscriptions/frequencies');
  }

  /**
   * GET /api/subscriptions/config
   */
  async getConfig(): Promise<SubscriptionConfigData> {
    return this.client.get<SubscriptionConfigData>('/api/subscriptions/config');
  }

  /**
   * GET /api/subscriptions/reorder-config
   */
  async getReorderConfig(): Promise<ReorderConfigData> {
    return this.client.get<ReorderConfigData>('/api/subscriptions/reorder-config');
  }
}

export const apiSubscriptionProvider = new ApiSubscriptionProvider();
