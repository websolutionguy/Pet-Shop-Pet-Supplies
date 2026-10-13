'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderConfirmationHeader } from './OrderConfirmationHeader';
import { OrderConfirmationItems } from './OrderConfirmationItems';
import { OrderConfirmationSubscriptions } from './OrderConfirmationSubscriptions';
import { OrderConfirmationDispatch } from './OrderConfirmationDispatch';
import { OrderConfirmationFinancials } from './OrderConfirmationFinancials';
import { OrderConfirmationActions } from './OrderConfirmationActions';
import { orderService } from '../../services/orderService';
import { cartService } from '../../services/cartService';
import { CartItem, CartSummary } from '../../types/cart';
import { ShippingAddressFormData } from '../../types/checkout';
import { Loader2 } from 'lucide-react';

export function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const queryOrderNumber = searchParams.get('orderNumber');
  const queryOrderId = searchParams.get('orderId');

  const [isLoading, setIsLoading] = useState(true);
  const [orderNumber, setOrderNumber] = useState<string>('RH-84920');
  const [placedAt, setPlacedAt] = useState<string>(new Date().toISOString());
  const [customerEmail, setCustomerEmail] = useState<string>('eleanor.vance@pacifictrail.org');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressFormData>({
    fullName: 'Eleanor Vance',
    streetLine1: '2841 NW Cumberland Rd',
    streetLine2: 'Apt 4B',
    city: 'Portland',
    state: 'OR',
    postalCode: '97210',
    country: 'United States',
    phone: '(503) 555-0192',
    deliveryInstructions: 'Leave under covered front porch behind flower planter',
  });
  const [deliveryMethodId, setDeliveryMethodId] = useState<string>('standard');
  const [items, setItems] = useState<CartItem[]>([]);
  const [summary, setSummary] = useState<CartSummary | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadConfirmationData() {
      // 1. Try reading from sessionStorage (just placed order from /checkout)
      if (typeof window !== 'undefined') {
        try {
          const stored = window.sessionStorage.getItem('last_placed_order');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (
              !queryOrderNumber ||
              parsed.orderNumber === queryOrderNumber ||
              queryOrderNumber === 'latest'
            ) {
              if (isMounted) {
                setOrderNumber(parsed.orderNumber || 'RH-84920');
                setPlacedAt(parsed.placedAt || new Date().toISOString());
                setCustomerEmail(parsed.customer?.email || 'eleanor.vance@pacifictrail.org');
                if (parsed.shippingAddress) {
                  setShippingAddress(parsed.shippingAddress);
                }
                setDeliveryMethodId(parsed.deliveryMethod || 'standard');
                setItems(parsed.items || []);
                setSummary(parsed.summary || null);
                setIsLoading(false);
                return;
              }
            }
          }
        } catch {
          // Ignore
        }
      }

      // 2. Try fetching from orderService / mock order database
      try {
        const targetId = queryOrderId || queryOrderNumber || 'ord-10948';
        let foundOrder = await orderService.getById(targetId);

        if (!foundOrder) {
          const recent = await orderService.getRecentOrders('cust-eleanor-vance', 1);
          if (recent.length > 0) {
            foundOrder = recent[0];
          }
        }

        if (foundOrder && isMounted) {
          setOrderNumber(foundOrder.orderNumber);
          setPlacedAt(foundOrder.placedAt);
          setCustomerEmail('eleanor.vance@pacifictrail.org');
          setShippingAddress({
            fullName: foundOrder.shippingAddress.fullName,
            streetLine1: foundOrder.shippingAddress.streetLine1,
            streetLine2: foundOrder.shippingAddress.streetLine2 || '',
            city: foundOrder.shippingAddress.city,
            state: foundOrder.shippingAddress.state,
            postalCode: foundOrder.shippingAddress.postalCode,
            country: foundOrder.shippingAddress.country,
            phone: foundOrder.shippingAddress.phone || '(503) 555-0192',
            deliveryInstructions: 'Leave in dry vestibule.',
          });

          // Map order items to CartItem format for display
          const mappedItems: CartItem[] = foundOrder.items.map((lineItem) => ({
            id: lineItem.id,
            productId: lineItem.productId,
            product: {
              id: lineItem.productId,
              slug: lineItem.productId,
              name: lineItem.productName,
              brand: 'Rowan & Hound Reserve',
              petType: 'both',
              categoryId: 'kibble',
              categoryName: 'Artisan Kibble',
              shortDescription: 'Small-batch whole-protein companion recipe.',
              fullDescription: 'Crafted in the Pacific Northwest with single-origin proteins.',
              primaryImage: lineItem.productId.includes('yak')
                ? 'https://picsum.photos/seed/yakchews/600/600'
                : 'https://picsum.photos/seed/venisonkibble/600/600',
              galleryImages: [],
              basePrice: lineItem.unitPrice,
              unitMeasurement: '14 lb bag',
              keyBenefits: ['Single-source novel protein', 'Digestive vitality'],
              features: ['Cold-pressed grains', 'Omega-3 enriched'],
              ingredients: ['Venison', 'Ancient Spelt', 'Flaxseed'],
              inStock: true,
              rating: 4.9,
              reviewCount: 48,
              dietaryTags: ['Grain-Free', 'High-Protein'],
              variants: [
                {
                  id: 'var-1',
                  name: lineItem.variantName || 'Standard Package',
                  sizeOrWeight: '14 lb',
                  sku: 'RH-SKU-1',
                  price: lineItem.unitPrice,
                  inStock: true,
                  inventoryCount: 40,
                },
              ],
              subscription: {
                eligible: lineItem.isSubscription,
                discountPercentage: 10,
                defaultCadence: lineItem.cadence || '4-weeks',
                cadenceOptions: ['2-weeks', '4-weeks', '6-weeks', '8-weeks'],
                benefitsSummary: ['10% auto-ship savings', 'Flexible pause or reschedule'],
              },
            },
            variant: lineItem.variantName
              ? {
                  id: 'var-1',
                  name: lineItem.variantName,
                  sizeOrWeight: '14 lb',
                  sku: 'RH-SKU-1',
                  price: lineItem.unitPrice,
                  inStock: true,
                  inventoryCount: 40,
                }
              : undefined,
            quantity: lineItem.quantity,
            purchaseType: lineItem.isSubscription ? 'subscription' : 'one-time',
            subscriptionCadence: lineItem.cadence,
            unitPrice: lineItem.unitPrice,
            discountedUnitPrice: lineItem.isSubscription
              ? Number((lineItem.unitPrice * 0.9).toFixed(2))
              : lineItem.unitPrice,
            discountAmount: lineItem.isSubscription
              ? Number((lineItem.unitPrice * 0.1).toFixed(2))
              : 0,
            totalDiscount: lineItem.isSubscription
              ? Number((lineItem.unitPrice * 0.1 * lineItem.quantity).toFixed(2))
              : 0,
            lineTotal: lineItem.totalPrice || lineItem.unitPrice * lineItem.quantity,
            targetPetName: lineItem.targetPetName || 'Barnaby',
          }));

          setItems(mappedItems);
          const computedSummary = cartService.calculateSummary(mappedItems, undefined, 'standard');
          setSummary(computedSummary);
        }
      } catch {
        // Fallback demo order
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadConfirmationData();

    return () => {
      isMounted = false;
    };
  }, [queryOrderId, queryOrderNumber]);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3 text-stone-500">
        <Loader2 className="w-8 h-8 animate-spin text-stone-800" />
        <p className="text-xs font-mono">Retrieving order confirmation manifest...</p>
      </div>
    );
  }

  const subscriptionItems = items.filter((i) => i.purchaseType === 'subscription');
  const hasSubscription = subscriptionItems.length > 0;
  const activeSummary = summary || cartService.calculateSummary(items, undefined, deliveryMethodId as any);

  return (
    <div className="space-y-8">
      {/* 1. Header & Confirmation Reference */}
      <OrderConfirmationHeader
        orderNumber={orderNumber}
        placedAt={placedAt}
        customerEmail={customerEmail}
        hasSubscription={hasSubscription}
      />

      {/* 2-Column Responsive Layout: Left (Items, Subscriptions, Dispatch), Right (Financials & Next Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Order Items */}
          <OrderConfirmationItems items={items} />

          {/* Subscription Routine Details (if any) */}
          {hasSubscription && (
            <OrderConfirmationSubscriptions
              subscriptionItems={subscriptionItems}
              placedAt={placedAt}
            />
          )}

          {/* Dispatch & Delivery Information */}
          <OrderConfirmationDispatch
            shippingAddress={shippingAddress}
            deliveryMethodId={deliveryMethodId}
            placedAt={placedAt}
          />
        </div>

        {/* Right Column: Financial Breakdown & Useful Next Actions */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6 sticky top-20">
          <OrderConfirmationFinancials summary={activeSummary} />
          <OrderConfirmationActions
            orderNumber={orderNumber}
            hasSubscription={hasSubscription}
          />
        </div>
      </div>
    </div>
  );
}
