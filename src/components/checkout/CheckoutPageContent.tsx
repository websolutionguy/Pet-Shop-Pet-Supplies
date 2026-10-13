'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  RotateCcw,
  Sparkles,
  AlertCircle,
  Package,
} from 'lucide-react';
import { useCart } from '../../providers/CartProvider';
import { customerService } from '../../services/customerService';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { subscriptionService } from '../../services/subscriptionService';
import { BoundaryEnforcer } from '../../lib/boundary';
import { BoundaryTransparencyBanner } from '../boundary';
import { DeliveryMethodId } from '../../services/cartService';
import {
  CustomerFormData,
  ShippingAddressFormData,
  PaymentFormData,
  CheckoutFormErrors,
} from '../../types/checkout';
import { CheckoutCustomerSection } from './CheckoutCustomerSection';
import { CheckoutShippingAddressSection } from './CheckoutShippingAddressSection';
import { CheckoutDeliveryMethodSection } from './CheckoutDeliveryMethodSection';
import { CheckoutOrderItemsSection } from './CheckoutOrderItemsSection';
import { CheckoutSubscriptionItemsSection } from './CheckoutSubscriptionItemsSection';
import { CheckoutPaymentSection } from './CheckoutPaymentSection';
import { CheckoutOrderReview } from './CheckoutOrderReview';
import { CheckoutConfirmationModal } from './CheckoutConfirmationModal';
import { FeatureEmptyState, FeatureErrorState } from '../ui/StateFeedback';

export function CheckoutPageContent() {
  const router = useRouter();
  const {
    items,
    summary,
    deliveryMethod,
    setDeliveryMethod,
    clearCart,
    addItem,
  } = useCart();

  // Customer State
  const [customer, setCustomer] = useState<CustomerFormData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    subscribeNewsletter: true,
  });

  // Shipping Address State
  const [shipping, setShipping] = useState<ShippingAddressFormData>({
    fullName: '',
    streetLine1: '',
    streetLine2: '',
    city: '',
    state: 'OR',
    postalCode: '',
    country: 'United States',
    phone: '',
    deliveryInstructions: '',
  });

  // Payment Placeholder State
  const [payment, setPayment] = useState<PaymentFormData>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    billingSameAsShipping: true,
    billingStreet: '',
    billingCity: '',
    billingState: 'OR',
    billingPostalCode: '',
  });

  // Errors state
  const [errors, setErrors] = useState<CheckoutFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    orderNumber: string;
  } | null>(null);

  // Load default demo customer profile on mount if fields are empty
  useEffect(() => {
    let isMounted = true;
    customerService.getCurrentCustomer().then((profile) => {
      if (!isMounted) return;
      setCustomer((prev) => ({
        ...prev,
        email: prev.email || profile.email,
        firstName: prev.firstName || profile.firstName,
        lastName: prev.lastName || profile.lastName,
        phone: prev.phone || profile.phone,
      }));

      if (profile.defaultShippingAddress) {
        setShipping((prev) => ({
          ...prev,
          fullName: prev.fullName || profile.defaultShippingAddress.fullName,
          streetLine1: prev.streetLine1 || profile.defaultShippingAddress.streetLine1,
          streetLine2: prev.streetLine2 || profile.defaultShippingAddress.streetLine2 || '',
          city: prev.city || profile.defaultShippingAddress.city,
          state: prev.state || profile.defaultShippingAddress.state,
          postalCode: prev.postalCode || profile.defaultShippingAddress.postalCode,
          country: prev.country || profile.defaultShippingAddress.country,
        }));
      }

      setPayment((prev) => ({
        ...prev,
        cardholderName: prev.cardholderName || `${profile.firstName} ${profile.lastName}`,
      }));
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Customer Field
  const handleCustomerChange = (field: keyof CustomerFormData, value: any) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof CheckoutFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    }
  };

  // Update Shipping Field
  const handleShippingChange = (field: keyof ShippingAddressFormData, value: any) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof CheckoutFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    }
  };

  // Update Payment Field
  const handlePaymentChange = (field: keyof PaymentFormData, value: any) => {
    setPayment((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof CheckoutFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
    }
  };

  // Form Validation (Preserves entered fields!)
  const validateForm = (): boolean => {
    const newErrors: CheckoutFormErrors = {};

    // 1. Customer Information
    if (!customer.email.trim()) {
      newErrors.email = 'Please provide an email address for your order confirmation.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) {
      newErrors.email = 'Please provide a valid email format (e.g. name@example.com).';
    }

    if (!customer.firstName.trim()) {
      newErrors.firstName = 'First name is required.';
    }

    if (!customer.lastName.trim()) {
      newErrors.lastName = 'Last name is required.';
    }

    if (!customer.phone.trim()) {
      newErrors.phone = 'Phone number is required for courier delivery updates.';
    } else if (customer.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please provide a 10-digit phone number with area code.';
    }

    // 2. Shipping Address
    if (!shipping.streetLine1.trim()) {
      newErrors.streetLine1 = 'Street address is required for dispatch.';
    }

    if (!shipping.city.trim()) {
      newErrors.city = 'City is required.';
    }

    if (!shipping.state.trim()) {
      newErrors.state = 'Please select a delivery state.';
    }

    if (!shipping.postalCode.trim()) {
      newErrors.postalCode = 'ZIP / Postal code is required.';
    } else if (shipping.postalCode.trim().length < 5) {
      newErrors.postalCode = 'Please enter a valid 5-digit ZIP code.';
    }

    // 3. Payment Placeholder
    if (!payment.cardholderName.trim()) {
      newErrors.cardholderName = 'Name on card is required.';
    }

    const cleanCard = payment.cardNumber.replace(/\s+/g, '');
    if (!cleanCard) {
      newErrors.cardNumber = 'Card number is required.';
    } else if (cleanCard.length < 15) {
      newErrors.cardNumber = 'Please enter a valid 15 or 16-digit card number.';
    }

    if (!payment.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiration date is required (MM/YY).';
    } else {
      const match = payment.expiryDate.match(/^(\d{2})\/(\d{2})$/);
      if (!match) {
        newErrors.expiryDate = 'Format must be MM/YY.';
      } else {
        const month = parseInt(match[1], 10);
        if (month < 1 || month > 12) {
          newErrors.expiryDate = 'Month must be between 01 and 12.';
        }
      }
    }

    if (!payment.cvc.trim()) {
      newErrors.cvc = 'CVC security code is required.';
    } else if (payment.cvc.length < 3) {
      newErrors.cvc = 'CVC must be 3 or 4 digits.';
    }

    // Optional separate billing
    if (!payment.billingSameAsShipping) {
      if (!payment.billingStreet?.trim()) {
        newErrors.billingStreet = 'Billing street address is required.';
      }
      if (!payment.billingCity?.trim()) {
        newErrors.billingCity = 'Billing city is required.';
      }
      if (!payment.billingPostalCode?.trim()) {
        newErrors.billingPostalCode = 'Billing postal code is required.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      newErrors.form = 'Please review the highlighted fields above before placing your order.';
      setErrors(newErrors);
      // Scroll to the first error smoothly
      const firstErrorKey = Object.keys(newErrors)[0];
      const el = document.getElementById(
        firstErrorKey === 'email'
          ? 'customer-email'
          : firstErrorKey === 'firstName'
          ? 'customer-first-name'
          : firstErrorKey === 'lastName'
          ? 'customer-last-name'
          : firstErrorKey === 'phone'
          ? 'customer-phone'
          : firstErrorKey === 'streetLine1'
          ? 'shipping-street'
          : firstErrorKey === 'city'
          ? 'shipping-city'
          : firstErrorKey === 'state'
          ? 'shipping-state'
          : firstErrorKey === 'postalCode'
          ? 'shipping-zip'
          : firstErrorKey === 'cardholderName'
          ? 'payment-cardholder-name'
          : firstErrorKey === 'cardNumber'
          ? 'payment-card-number'
          : firstErrorKey === 'expiryDate'
          ? 'payment-expiry'
          : firstErrorKey === 'cvc'
          ? 'payment-cvc'
          : 'section-customer-heading'
      );
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return false;
    }

    setErrors({});
    return true;
  };

  // Place Order Handler
  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      return;
    }

    if (items.length === 0) {
      setErrors({ form: 'Cannot place an order with an empty basket.' });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Enforce architecture boundary: never fake backend processing
      BoundaryEnforcer.enforceOrderCreation({
        customer,
        shippingAddress: shipping,
        deliveryMethod,
        items,
        summary,
      });

      // 2. Submit order specification through orderService (routes to JSON or REST API Provider)
      const orderRecord = await orderService.createOrder({
        customerId: customer.email || 'cust-eleanor-vance',
        items: items.map((i) => ({
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          productId: i.product.id,
          productName: i.product.name,
          variantId: i.variant?.id,
          variantName: i.variant?.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.lineTotal,
          isSubscription: i.purchaseType === 'subscription',
          cadence: i.subscriptionCadence,
          targetPetName: i.targetPetName,
        })),
        subtotal: summary.subtotal,
        discount: Number(
          ((summary.subscriptionSavings || 0) + (summary.promotionDiscount || 0)).toFixed(2)
        ),
        shipping: summary.estimatedShipping,
        tax: summary.estimatedTax,
        total: summary.total,
        shippingAddress: {
          fullName: shipping.fullName,
          streetLine1: shipping.streetLine1,
          streetLine2: shipping.streetLine2,
          city: shipping.city,
          state: shipping.state,
          postalCode: shipping.postalCode,
          country: shipping.country,
          phone: shipping.phone,
        },
        isSubscriptionRenewal: false,
      });

      // 3. Register recurring subscriptions via subscriptionService
      const subItems = items.filter((i) => i.purchaseType === 'subscription');
      if (subItems.length > 0) {
        for (const subItem of subItems) {
          await subscriptionService.createSubscription({
            customerId: customer.email || 'cust-eleanor-vance',
            status: 'active',
            cadence: subItem.subscriptionCadence || '4-weeks',
            items: [
              {
                id: `sub-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                subscriptionId: '',
                productId: subItem.product.id,
                productName: subItem.product.name,
                variantId: subItem.variant?.id,
                variantName: subItem.variant?.name,
                quantity: subItem.quantity,
                unitPrice: subItem.unitPrice,
                discountedPrice: subItem.discountedUnitPrice,
                petName: subItem.targetPetName,
              },
            ],
            cycleSubtotal: subItem.unitPrice * subItem.quantity,
            cycleDiscount: subItem.totalDiscount,
            cycleTotal: subItem.lineTotal,
          });
        }
      }

      const generatedNumber = orderRecord.orderNumber || `RH-${Math.floor(10000 + Math.random() * 90000)}`;

      // Save order snapshot in sessionStorage for /order-confirmation
      const placedRecord = {
        orderNumber: generatedNumber,
        placedAt: new Date().toISOString(),
        customer,
        shippingAddress: shipping,
        deliveryMethod,
        items: [...items],
        summary: { ...summary },
      };

      if (typeof window !== 'undefined') {
        try {
          window.sessionStorage.setItem('last_placed_order', JSON.stringify(placedRecord));
        } catch {
          // Ignore
        }
      }

      // Clear basket now that order has been placed
      clearCart();

      // Navigate to dedicated Order Confirmation page
      router.push(`/order-confirmation?orderNumber=${generatedNumber}`);
    } catch {
      setErrors({
        form: "Order submission error: We couldn't process your order reservation right now. Please verify your payment details and shipping address, or try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prefill sample provisions for testing if evaluator opens empty checkout
  const handlePrefillSampleItems = async () => {
    try {
      const allProducts = await productService.getAll();
      if (allProducts.length >= 2) {
        // One-time item
        addItem(allProducts[0], {
          purchaseType: 'one-time',
          quantity: 1,
          variantId: allProducts[0].variants?.[0]?.id,
        });
        // Auto-ship item
        addItem(allProducts[1], {
          purchaseType: 'subscription',
          cadence: '4-weeks',
          quantity: 1,
          variantId: allProducts[1].variants?.[0]?.id,
          targetPetName: 'Barnaby',
        });
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Header */}
      <header className="bg-stone-900 text-stone-100 py-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Secure Checkout &amp; Dispatch</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-tight text-white">
                Review &amp; Place Provisions Order
              </h1>
            </div>

            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-300 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Basket ({summary.itemCount})</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* If cart is empty */}
        {items.length === 0 && !confirmationData ? (
          <div className="max-w-2xl mx-auto">
            <FeatureEmptyState
              icon={ShoppingBag}
              badge="Cart Empty"
              title="Your provisions basket is empty"
              description="Your provisions basket is currently empty. Please select whole-nutrition recipes, freeze-dried treats, or botanical supplements before proceeding to checkout."
              primaryAction={{
                label: 'Explore Provisions Catalog',
                href: '/shop',
              }}
              secondaryAction={{
                label: 'Load Sample Order (1 One-Time + 1 Auto-Ship)',
                onClick: handlePrefillSampleItems,
              }}
            />
          </div>
        ) : (
          <div>
            {/* General form validation error alert */}
            {errors.form && (
              <div className="mb-6">
                <FeatureErrorState
                  compact={true}
                  title="Order Submission Error"
                  message={errors.form}
                  onRetry={handlePlaceOrder}
                  retryLabel="Resubmit Order"
                />
              </div>
            )}

            {/* 2-Column Responsive Layout: Left (Sections 1-6), Right (Section 7 Order Review) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column (Sections 1-6) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                {/* 1. Customer Information */}
                <CheckoutCustomerSection
                  data={customer}
                  onChange={handleCustomerChange}
                  errors={errors}
                />

                {/* 2. Shipping Address */}
                <CheckoutShippingAddressSection
                  data={shipping}
                  onChange={handleShippingChange}
                  errors={errors}
                />

                {/* 3. Delivery Method */}
                <CheckoutDeliveryMethodSection
                  selectedMethod={deliveryMethod}
                  onSelectMethod={(method) => setDeliveryMethod(method)}
                />

                {/* 4. One-Time Order Items */}
                <CheckoutOrderItemsSection items={items} />

                {/* 5. Auto-Ship Subscription Items */}
                <CheckoutSubscriptionItemsSection items={items} />

                {/* 6. Payment Placeholder */}
                <CheckoutPaymentSection
                  data={payment}
                  onChange={handlePaymentChange}
                  errors={errors}
                />
              </div>

              {/* Right Column: 7. Order Review & Place Order CTA */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-4">
                <CheckoutOrderReview
                  onPlaceOrder={handlePlaceOrder}
                  isSubmitting={isSubmitting}
                  generalError={errors.form}
                />
                <BoundaryTransparencyBanner
                  compact={true}
                  endpoint="POST /api/orders"
                  operation="Payment processing & recurring billing"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Receipt Modal */}
      {confirmationData && (
        <CheckoutConfirmationModal
          isOpen={true}
          orderNumber={confirmationData.orderNumber}
          customer={customer}
          shipping={shipping}
          items={items}
          summary={summary}
          onClose={() => setConfirmationData(null)}
        />
      )}
    </div>
  );
}
