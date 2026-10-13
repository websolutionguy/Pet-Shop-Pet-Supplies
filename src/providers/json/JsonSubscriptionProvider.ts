import { SubscriptionProvider } from '../contracts';
import {
  SubscriptionPlanData,
  SubscriptionFrequencyData,
  SubscriptionConfigData,
  ReorderConfigData,
} from '../../types/data';
import { SubscriptionSchedule, SubscriptionStatus } from '../../types/subscription';
import { ProductCadence } from '../../types/product';
import rawPlans from '../../data/subscription-plans.json';
import rawFrequencies from '../../data/subscription-frequencies.json';
import rawConfig from '../../data/subscription-config.json';
import rawReorderConfig from '../../data/reorder-config.json';
import rawSubscriptions from '../../data/subscriptions.json';
import { CADENCE_OPTIONS } from '../../lib/constants';

let memorySubscriptions = JSON.parse(JSON.stringify(rawSubscriptions)) as SubscriptionSchedule[];

export class JsonSubscriptionProvider implements SubscriptionProvider {
  async getPlans(): Promise<SubscriptionPlanData[]> {
    return [...(rawPlans as SubscriptionPlanData[])];
  }

  async getPlansByProductId(productId: string): Promise<SubscriptionPlanData[]> {
    return (rawPlans as SubscriptionPlanData[]).filter((p) => p.productId === productId);
  }

  async getFrequencies(): Promise<SubscriptionFrequencyData[]> {
    return [...(rawFrequencies as SubscriptionFrequencyData[])];
  }

  async getConfig(): Promise<SubscriptionConfigData> {
    return { ...(rawConfig as SubscriptionConfigData) };
  }

  async getReorderConfig(): Promise<ReorderConfigData> {
    return { ...(rawReorderConfig as ReorderConfigData) };
  }

  async getCustomerSubscriptions(customerId: string): Promise<SubscriptionSchedule[]> {
    return memorySubscriptions.filter((s) => s.customerId === customerId);
  }

  async getSubscriptionById(id: string): Promise<SubscriptionSchedule | null> {
    const found = memorySubscriptions.find((s) => s.id === id);
    return found ? { ...found } : null;
  }

  async updateStatus(id: string, status: SubscriptionStatus): Promise<SubscriptionSchedule> {
    const idx = memorySubscriptions.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Subscription ${id} not found in provider`);
    }
    memorySubscriptions[idx] = {
      ...memorySubscriptions[idx],
      status,
    };
    return { ...memorySubscriptions[idx] };
  }

  async updateCadence(id: string, cadence: ProductCadence): Promise<SubscriptionSchedule> {
    const idx = memorySubscriptions.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Subscription ${id} not found in provider`);
    }

    const intervalDays = CADENCE_OPTIONS[cadence]?.intervalDays || 28;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + intervalDays);

    memorySubscriptions[idx] = {
      ...memorySubscriptions[idx],
      cadence,
      nextShipmentDate: nextDate.toISOString().split('T')[0],
    };

    return { ...memorySubscriptions[idx] };
  }

  async skipNextShipment(id: string): Promise<SubscriptionSchedule> {
    const idx = memorySubscriptions.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Subscription ${id} not found in provider`);
    }

    const currentSub = memorySubscriptions[idx];
    const currentNextDate = new Date(currentSub.nextShipmentDate);
    const intervalDays = CADENCE_OPTIONS[currentSub.cadence]?.intervalDays || 28;
    currentNextDate.setDate(currentNextDate.getDate() + intervalDays);

    memorySubscriptions[idx] = {
      ...currentSub,
      nextShipmentDate: currentNextDate.toISOString().split('T')[0],
      status: 'active', // remains active with skipped date
    };

    return { ...memorySubscriptions[idx] };
  }

  async updateQuantity(id: string, itemId: string, quantity: number): Promise<SubscriptionSchedule> {
    const idx = memorySubscriptions.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Subscription ${id} not found in provider`);
    }

    const sub = memorySubscriptions[idx];
    const updatedItems = sub.items.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });

    const cycleSubtotal = Number(
      updatedItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0).toFixed(2)
    );
    const cycleTotal = Number(
      updatedItems.reduce((acc, i) => acc + i.discountedPrice * i.quantity, 0).toFixed(2)
    );
    const cycleDiscount = Number((cycleSubtotal - cycleTotal).toFixed(2));

    memorySubscriptions[idx] = {
      ...sub,
      items: updatedItems,
      cycleSubtotal,
      cycleDiscount,
      cycleTotal,
    };

    return { ...memorySubscriptions[idx] };
  }

  async updateItems(id: string, items: any[]): Promise<SubscriptionSchedule> {
    const idx = memorySubscriptions.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Subscription ${id} not found in provider`);
    }

    const sub = memorySubscriptions[idx];
    const cycleSubtotal = Number(
      items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0).toFixed(2)
    );
    const cycleTotal = Number(
      items.reduce((acc, i) => acc + (i.discountedPrice || i.unitPrice * 0.9) * i.quantity, 0).toFixed(2)
    );
    const cycleDiscount = Number((cycleSubtotal - cycleTotal).toFixed(2));

    memorySubscriptions[idx] = {
      ...sub,
      items,
      cycleSubtotal,
      cycleDiscount,
      cycleTotal,
    };

    return { ...memorySubscriptions[idx] };
  }

  async getAll(): Promise<SubscriptionSchedule[]> {
    return [...memorySubscriptions];
  }

  async createSubscription(
    subscriptionData: Partial<SubscriptionSchedule>
  ): Promise<SubscriptionSchedule> {
    const newSub: SubscriptionSchedule = {
      id: subscriptionData.id || `sub-${Date.now()}`,
      customerId: subscriptionData.customerId || 'cust-eleanor-vance',
      status: subscriptionData.status || 'active',
      cadence: subscriptionData.cadence || '4-weeks',
      nextShipmentDate:
        subscriptionData.nextShipmentDate ||
        new Date(Date.now() + 28 * 86400000).toISOString().split('T')[0],
      createdDate: subscriptionData.createdDate || new Date().toISOString().split('T')[0],
      items: subscriptionData.items || [],
      shippingAddress: subscriptionData.shippingAddress || {
        fullName: 'Eleanor Vance',
        streetLine1: '2841 NW Cumberland Rd',
        city: 'Portland',
        state: 'OR',
        postalCode: '97210',
        country: 'United States',
      },
      paymentMethodLast4: subscriptionData.paymentMethodLast4 || '4821',
      cycleSubtotal: subscriptionData.cycleSubtotal || 0,
      cycleDiscount: subscriptionData.cycleDiscount || 0,
      cycleTotal: subscriptionData.cycleTotal || 0,
      canSkipNext: subscriptionData.canSkipNext ?? true,
      canChangeCadence: subscriptionData.canChangeCadence ?? true,
    };

    memorySubscriptions.unshift(newSub);
    return { ...newSub };
  }

  async updateSubscription(
    id: string,
    updates: Partial<SubscriptionSchedule>
  ): Promise<SubscriptionSchedule> {
    const idx = memorySubscriptions.findIndex((s) => s.id === id);
    if (idx === -1) {
      throw new Error(`Subscription ${id} not found in provider`);
    }

    memorySubscriptions[idx] = {
      ...memorySubscriptions[idx],
      ...updates,
    };

    return { ...memorySubscriptions[idx] };
  }

  async pauseSubscription(id: string): Promise<SubscriptionSchedule> {
    return this.updateStatus(id, 'paused');
  }

  async cancelSubscription(id: string): Promise<SubscriptionSchedule> {
    return this.updateStatus(id, 'cancelled');
  }
}

export const jsonSubscriptionProvider = new JsonSubscriptionProvider();
