import { OrderProvider } from '../providers/contracts';
import { ProviderFactory } from '../providers/factory';
import { Order } from '../types/order';
import { OrderConfigData } from '../types/data';

export class OrderService {
  private provider: OrderProvider;

  constructor(provider: OrderProvider = ProviderFactory.getOrderProvider()) {
    this.provider = provider;
  }

  setProvider(provider: OrderProvider) {
    this.provider = provider;
  }

  async getAll(): Promise<Order[]> {
    return this.provider.getAll();
  }

  async getByCustomerId(customerId: string): Promise<Order[]> {
    return this.provider.getByCustomerId(customerId);
  }

  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    return this.getByCustomerId(customerId);
  }

  async getById(id: string): Promise<Order | null> {
    return this.provider.getById(id);
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.getById(id);
  }

  async getRecentOrders(customerId = 'cust-eleanor-vance', limit = 5): Promise<Order[]> {
    const orders = await this.getByCustomerId(customerId);
    return orders
      .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
      .slice(0, limit);
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    return this.provider.createOrder(orderData);
  }

  async reorder(id: string): Promise<Order> {
    return this.provider.reorder(id);
  }

  async getConfig(): Promise<OrderConfigData> {
    return this.provider.getConfig();
  }
}

export const orderService = new OrderService();
