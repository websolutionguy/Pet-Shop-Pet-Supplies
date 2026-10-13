import { OrderProvider } from '../contracts';
import { OrderConfigData } from '../../types/data';
import { Order } from '../../types/order';
import { ApiClient, defaultApiClient } from './apiClient';

/**
 * REST API Order Provider
 *
 * Implements OrderProvider connecting to future backend endpoints:
 * - GET /api/orders
 * - POST /api/orders
 * - POST /api/orders/:id/reorder
 * - GET /api/orders/:id
 */
export class ApiOrderProvider implements OrderProvider {
  private client: ApiClient;

  constructor(client: ApiClient = defaultApiClient) {
    this.client = client;
  }

  /**
   * GET /api/orders
   */
  async getAll(): Promise<Order[]> {
    return this.client.get<Order[]>('/api/orders');
  }

  /**
   * GET /api/orders?customerId=:customerId
   */
  async getByCustomerId(customerId: string): Promise<Order[]> {
    return this.client.get<Order[]>('/api/orders', { customerId });
  }

  /**
   * GET /api/orders/:id
   */
  async getById(id: string): Promise<Order | null> {
    try {
      return await this.client.get<Order>(`/api/orders/${id}`);
    } catch (err: any) {
      if (err.status === 404) return null;
      throw err;
    }
  }

  /**
   * POST /api/orders
   */
  async createOrder(order: Partial<Order>): Promise<Order> {
    return this.client.post<Order>('/api/orders', order);
  }

  /**
   * POST /api/orders/:id/reorder
   */
  async reorder(id: string): Promise<Order> {
    return this.client.post<Order>(`/api/orders/${id}/reorder`);
  }

  /**
   * GET /api/orders/config
   */
  async getConfig(): Promise<OrderConfigData> {
    return this.client.get<OrderConfigData>('/api/orders/config');
  }
}

export const apiOrderProvider = new ApiOrderProvider();
