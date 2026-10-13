import { OrderProvider } from '../contracts';
import { OrderConfigData } from '../../types/data';
import { Order } from '../../types/order';
import rawOrders from '../../data/orders.json';
import rawConfig from '../../data/order-config.json';

const ordersMemory = [...(rawOrders as Order[])];

export class JsonOrderProvider implements OrderProvider {
  async getByCustomerId(customerId: string): Promise<Order[]> {
    return ordersMemory.filter((o) => o.customerId === customerId);
  }

  async getAll(): Promise<Order[]> {
    return [...ordersMemory];
  }

  async reorder(id: string): Promise<Order> {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error(`Order ${id} not found to reorder`);
    }

    return this.createOrder({
      customerId: existing.customerId,
      items: existing.items.map((i) => ({ ...i, id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}` })),
      subtotal: existing.subtotal,
      discount: existing.discount,
      shipping: existing.shipping,
      tax: existing.tax,
      total: existing.total,
      shippingAddress: existing.shippingAddress,
      isSubscriptionRenewal: false,
    });
  }

  async getById(id: string): Promise<Order | null> {
    const item = ordersMemory.find((o) => o.id === id);
    return item ? { ...item } : null;
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const config = rawConfig as OrderConfigData;
    const randomSuffix = Math.floor(
      config.orderNumberMin + Math.random() * (config.orderNumberMax - config.orderNumberMin)
    );

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `${config.orderNumberPrefix}${randomSuffix}`,
      customerId: orderData.customerId || 'cust-eleanor-vance',
      placedAt: new Date().toISOString(),
      status: 'processing',
      items: orderData.items || [],
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      shipping: orderData.shipping || 0,
      tax: orderData.tax || 0,
      total: orderData.total || 0,
      shippingAddress: orderData.shippingAddress || {
        fullName: 'Eleanor Vance',
        streetLine1: '2841 NW Cumberland Rd',
        city: 'Portland',
        state: 'OR',
        postalCode: '97210',
        country: 'United States',
      },
      isSubscriptionRenewal: !!orderData.isSubscriptionRenewal,
      parentSubscriptionId: orderData.parentSubscriptionId,
    };

    ordersMemory.unshift(newOrder);
    return { ...newOrder };
  }

  async getConfig(): Promise<OrderConfigData> {
    return { ...(rawConfig as OrderConfigData) };
  }
}

export const jsonOrderProvider = new JsonOrderProvider();
