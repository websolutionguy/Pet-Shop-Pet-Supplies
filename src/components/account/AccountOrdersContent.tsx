'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Truck,
  Calendar,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  MapPin,
  Package,
} from 'lucide-react';
import { AccountNav } from './AccountNav';
import { customerService } from '../../services/customerService';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { CustomerProfile } from '../../types/customer';
import { Order, OrderLineItem } from '../../types/order';
import { useCart } from '../../providers/CartProvider';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';
import { BoundaryTransparencyBanner } from '../boundary';
import {
  FeatureLoadingState,
  FeatureEmptyState,
  FeatureErrorState,
} from '../ui/StateFeedback';

export function AccountOrdersContent() {
  const { addItem } = useCart();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reorderNotification, setReorderNotification] = useState<string | null>(null);

  const loadOrdersData = () => {
    setIsLoading(true);
    setLoadError(null);
    Promise.all([
      customerService.getCurrentCustomer(),
      orderService.getByCustomerId('cust-eleanor-vance'),
    ])
      .then(([cust, orderList]) => {
        setCustomer(cust);
        const sorted = [...orderList].sort(
          (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
        );
        setOrders(sorted);
      })
      .catch(() => {
        setLoadError(
          "We couldn't retrieve your previous orders right now. Please try again or check back shortly."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      customerService.getCurrentCustomer(),
      orderService.getByCustomerId('cust-eleanor-vance'),
    ])
      .then(([cust, orderList]) => {
        if (!isMounted) return;
        setCustomer(cust);
        const sorted = [...orderList].sort(
          (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
        );
        setOrders(sorted);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadError(
          "We couldn't retrieve your previous orders right now. Please try again or check back shortly."
        );
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Reorder all items from an order
  const handleReorderOrder = async (order: Order) => {
    try {
      for (const item of order.items) {
        const prod = await productService.getById(item.productId);
        if (prod) {
          addItem(prod, {
            purchaseType: item.isSubscription ? 'subscription' : 'one-time',
            cadence: item.cadence || '4-weeks',
            quantity: item.quantity,
            variantId: prod.variants?.[0]?.id,
            targetPetName: item.targetPetName,
          });
        }
      }
      setReorderNotification(`All items from Order #${order.orderNumber} have been added to your basket.`);
      setTimeout(() => setReorderNotification(null), 5000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Account Navigation */}
      <AccountNav customer={customer} />

      {/* Reorder Success Banner */}
      {reorderNotification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xs text-xs text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
            <span>{reorderNotification}</span>
          </div>
          <Link
            href="/cart"
            className="font-mono text-emerald-950 font-semibold underline underline-offset-4"
          >
            Review Basket &amp; Checkout →
          </Link>
        </div>
      )}

      {/* Architecture Boundary Banner */}
      <BoundaryTransparencyBanner
        endpoint="GET /api/orders"
        operation="Authoritative order history, payment settlement manifests, and courier tracking"
      />

      {/* 2. Orders List Section */}
      <div className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900">
              Order History &amp; Receipts
            </h2>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Review prior small-batch provisions, courier dispatch statuses, and invoices.
            </p>
          </div>

          <span className="text-xs font-mono text-stone-500 bg-stone-100 px-3 py-1 rounded-xs">
            {orders.length} {orders.length === 1 ? 'Recorded Order' : 'Recorded Orders'}
          </span>
        </div>

        {isLoading ? (
          <FeatureLoadingState
            title="Loading order history..."
            message="Retrieving prior dispatch manifests, tracking codes, and batch item receipts."
          />
        ) : loadError ? (
          <FeatureErrorState
            title="Order History Sync Issue"
            message={loadError}
            onRetry={loadOrdersData}
            retryLabel="Reload Orders"
          />
        ) : orders.length === 0 ? (
          <FeatureEmptyState
            icon={Package}
            badge="No Previous Orders"
            title="No previous orders"
            description="You haven't placed any orders with Rowan & Hound yet. Once you complete your first purchase, delivery tracking, itemized receipts, and 1-click reorder will appear here."
            primaryAction={{
              label: 'Start Your First Order',
              href: '/shop',
            }}
            secondaryAction={{
              label: 'Explore Curated Bundles',
              href: '/bundles',
            }}
          />
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const placedDate = new Date(order.placedAt).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={order.id}
                  className="border border-stone-200 rounded-xs overflow-hidden shadow-2xs"
                >
                  {/* Order Card Header */}
                  <div className="p-4 sm:p-5 bg-stone-50 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                          Order Reference
                        </span>
                        <span className="font-mono font-bold text-stone-900 text-sm">
                          {order.orderNumber}
                        </span>
                      </div>

                      <div className="h-6 w-px bg-stone-300 hidden sm:block" />

                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                          Date Placed
                        </span>
                        <span className="font-mono text-stone-700">
                          {placedDate}
                        </span>
                      </div>

                      <div className="h-6 w-px bg-stone-300 hidden sm:block" />

                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                          Fulfillment Status
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono font-semibold uppercase tracking-wider text-[10px] text-emerald-900 bg-emerald-100/70 px-2 py-0.5 rounded-xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                          <span>{order.status}</span>
                        </span>
                      </div>
                    </div>

                    {/* Order Total & Quick Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-stone-200">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                          Order Total
                        </span>
                        <span className="font-mono font-bold text-stone-900 text-sm tabular-nums">
                          {formatCurrency(order.total)}
                        </span>
                      </div>

                      <Link
                        href={`/order-confirmation?orderNumber=${order.orderNumber}`}
                        className="px-3 py-1.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-medium rounded-xs transition-colors shadow-2xs"
                      >
                        View Receipt
                      </Link>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="p-4 sm:p-5 divide-y divide-stone-100">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-start justify-between gap-4 text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-medium text-stone-900 text-sm">
                              {item.productName}
                            </span>
                            {item.isSubscription && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xs text-[10px] font-mono">
                                Auto-Ship
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-stone-500 font-mono">
                            {item.variantName && <span>Format: {item.variantName}</span>}
                            {item.targetPetName && (
                              <span>· Companion: <strong className="text-emerald-800">{item.targetPetName}</strong></span>
                            )}
                            <span>· Qty: {item.quantity}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-mono font-semibold text-stone-900 tabular-nums">
                            {formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Card Footer */}
                  <div className="p-3.5 bg-stone-50/70 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-stone-600 text-[11px] font-mono">
                      <Truck className="w-3.5 h-3.5 text-stone-500" />
                      <span>
                        Carrier: {order.carrier || 'USPS Overland Regional Courier'} · {order.shippingAddress.city}, {order.shippingAddress.state}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReorderOrder(order)}
                      className="inline-flex items-center gap-1.5 text-emerald-900 hover:text-emerald-950 font-mono font-semibold text-xs cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder All Items</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
