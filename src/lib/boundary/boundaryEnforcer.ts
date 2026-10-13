import { BoundaryStatus, AuthoritativeBoundaryResult } from './types';
import { CURRENT_DATA_SOURCE } from '../../providers/factory';

/**
 * Boundary Enforcer
 *
 * Ensures that the frontend never fakes backend operations. When running in
 * client prototype mode, operations return transparent boundary status metadata
 * detailing the exact responsibilities delegated to the future REST backend.
 */
export class BoundaryEnforcer {
  /**
   * Enforces the boundary for Order Creation.
   * Frontend: Form validation, UI state, item summary, price display.
   * Backend: Order creation, payment processing, tax authority, inventory decrement, transactional email.
   */
  static enforceOrderCreation<T>(orderPayload: T): AuthoritativeBoundaryResult<T> {
    const isApiConnected = CURRENT_DATA_SOURCE === 'api';

    const boundary: BoundaryStatus = {
      isAuthoritative: isApiConnected,
      environment: isApiConnected ? 'api_connected' : 'client_prototype',
      delegatedEndpoint: 'POST /api/orders',
      frontendFulfilled: [
        'UI',
        'Forms',
        'Cart interface',
        'Price display',
        'Validation feedback',
        'Responsive behavior',
      ],
      backendDelegated: [
        'Order creation',
        'Payment processing',
        'Product inventory',
        'Tax',
        'Shipping',
        'Notifications',
        'Email',
        'Order history',
      ],
      transparencyNotice: isApiConnected
        ? 'Order processed authoritatively via REST API gateway.'
        : 'Prototype order assembled on client. Live credit card charging, warehouse inventory deduction, and transactional email dispatch are delegated to the backend API via POST /api/orders.',
    };

    return {
      data: orderPayload,
      boundary,
    };
  }

  /**
   * Enforces the boundary for Subscription Lifecycle (Creation, Pause, Skip, Cancel).
   * Frontend: Frequency selection UI, cadence formatting, discount calculation preview.
   * Backend: Subscription creation, recurring billing cron, payment token vaults, renewals, dunning.
   */
  static enforceSubscriptionLifecycle<T>(
    operation: 'create' | 'pause' | 'skip' | 'cancel' | 'update',
    payload: T
  ): AuthoritativeBoundaryResult<T> {
    const isApiConnected = CURRENT_DATA_SOURCE === 'api';

    const endpointMap = {
      create: 'POST /api/subscriptions',
      pause: 'POST /api/subscriptions/:id/pause',
      skip: 'POST /api/subscriptions/:id/skip',
      cancel: 'DELETE /api/subscriptions/:id',
      update: 'PATCH /api/subscriptions/:id',
    };

    const boundary: BoundaryStatus = {
      isAuthoritative: isApiConnected,
      environment: isApiConnected ? 'api_connected' : 'client_prototype',
      delegatedEndpoint: endpointMap[operation],
      frontendFulfilled: [
        'UI',
        'Subscription configuration interface',
        'Price display',
        'Validation feedback',
        'Animations',
      ],
      backendDelegated: [
        'Subscription creation',
        'Recurring billing',
        'Payment processing',
        'Subscription renewals',
        'Failed payments',
        'Pause',
        'Skip',
        'Cancel',
        'Subscription status',
        'Notifications',
      ],
      transparencyNotice: isApiConnected
        ? `Subscription ${operation} committed to authoritative database.`
        : `Subscription schedule configured on frontend. Recurring midnight rebilling schedules, payment token mandates, and renewal order generators are delegated to backend workers via ${endpointMap[operation]}.`,
    };

    return {
      data: payload,
      boundary,
    };
  }

  /**
   * Enforces the boundary for Transactional Notifications (Email / SMS).
   * Never fake that an email was sent to a customer's inbox.
   */
  static enforceNotificationBoundary(
    notificationType: 'order_receipt' | 'subscription_reminder' | 'shipment_tracking',
    recipientEmail: string
  ): { sentLocally: boolean; delegatedService: string; notice: string } {
    return {
      sentLocally: false,
      delegatedService: 'SendGrid / AWS SES / Postmark via Backend Worker Queue',
      notice: `Frontend does not dispatch transactional emails directly. ${notificationType} for ${recipientEmail} is delegated to the backend message bus.`,
    };
  }

  /**
   * Enforces the boundary for Inventory and Real-Time Availability.
   */
  static enforceInventoryCheck(productId: string): {
    authoritativeLock: boolean;
    notice: string;
  } {
    return {
      authoritativeLock: false,
      notice: `Stock status for product ${productId} is a client preview. Authoritative reservation locks occur during backend order creation transaction.`,
    };
  }
}
