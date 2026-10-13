/**
 * Architecture Boundary Definitions
 * Rowan & Hound Pet Supply Co.
 *
 * Enforces the strict division of responsibility between the Frontend UI layer
 * and the Future Authoritative Backend.
 */

export type FrontendResponsibility =
  | 'UI'
  | 'Product presentation'
  | 'Filtering'
  | 'Forms'
  | 'Cart interface'
  | 'Subscription configuration interface'
  | 'Price display'
  | 'Validation feedback'
  | 'Animations'
  | 'Responsive behavior';

export type BackendResponsibility =
  | 'Authentication'
  | 'Customer accounts'
  | 'Pets'
  | 'Product inventory'
  | 'Real product availability'
  | 'Pricing'
  | 'Subscription creation'
  | 'Recurring billing'
  | 'Payment processing'
  | 'Subscription renewals'
  | 'Failed payments'
  | 'Pause'
  | 'Skip'
  | 'Cancel'
  | 'Order creation'
  | 'Order history'
  | 'Reorder eligibility'
  | 'Coupons'
  | 'Promotions'
  | 'Shipping'
  | 'Tax'
  | 'Inventory'
  | 'Notifications'
  | 'Email'
  | 'Subscription status'
  | 'Product replacement'
  | 'Out-of-stock handling';

export interface BoundaryStatus {
  /** Indicates whether the result was finalized by an authoritative backend */
  isAuthoritative: boolean;
  /** Current execution environment: client prototype or real API backend */
  environment: 'client_prototype' | 'api_connected';
  /** The REST endpoint responsible for authoritative execution in production */
  delegatedEndpoint: string;
  /** Summary of responsibilities fulfilled by the frontend */
  frontendFulfilled: FrontendResponsibility[];
  /** Summary of responsibilities delegated to the future backend */
  backendDelegated: BackendResponsibility[];
  /** Transparent explanation for developers and users */
  transparencyNotice: string;
}

export interface AuthoritativeBoundaryResult<T> {
  data: T;
  boundary: BoundaryStatus;
}
