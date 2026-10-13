'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Repeat,
  Heart,
  RotateCcw,
  ArrowRight,
  Package,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
} from 'lucide-react';
import { AccountNav } from './AccountNav';
import { customerService } from '../../services/customerService';
import { orderService } from '../../services/orderService';
import { subscriptionService } from '../../services/subscriptionService';
import { reorderService } from '../../services/reorderService';
import { productService } from '../../services/productService';
import { CustomerProfile } from '../../types/customer';
import { Order, FrequentlyPurchasedItem } from '../../types/order';
import { SubscriptionSchedule } from '../../types/subscription';
import { useCart } from '../../providers/CartProvider';
import { formatCurrency, formatCadenceLabel } from '../../lib/utils';
import { Button } from '../ui/Button';

export function AccountOverviewContent() {
  const { addItem } = useCart();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionSchedule[]>([]);
  const [frequentItems, setFrequentItems] = useState<FrequentlyPurchasedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addedItemMessage, setAddedItemMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadOverviewData() {
      try {
        const [cust, orders, subs, favorites] = await Promise.all([
          customerService.getCurrentCustomer(),
          orderService.getRecentOrders('cust-eleanor-vance', 2),
          subscriptionService.getSubscriptions('cust-eleanor-vance'),
          reorderService.getFrequentlyPurchasedItems('cust-eleanor-vance'),
        ]);

        if (isMounted) {
          setCustomer(cust);
          setRecentOrders(orders);
          setSubscriptions(subs);
          setFrequentItems(favorites.slice(0, 3));
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadOverviewData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Quick reorder handler
  const handleQuickReorder = async (item: FrequentlyPurchasedItem) => {
    try {
      const prod = await productService.getById(item.productId);
      if (prod) {
        addItem(prod, {
          purchaseType: item.isSubscriptionEligible ? 'subscription' : 'one-time',
          cadence: '4-weeks',
          quantity: 1,
          variantId: prod.variants?.[0]?.id,
          targetPetName: item.targetPetName,
        });
        setAddedItemMessage(`Added "${item.productName}" to your basket.`);
        setTimeout(() => setAddedItemMessage(null), 4000);
      }
    } catch {
      // Ignore
    }
  };

  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');

  return (
    <div className="space-y-8">
      {/* 1. Account Nav & Profile Header */}
      <AccountNav customer={customer} />

      {/* Temporary Toast for Quick Reorder */}
      {addedItemMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xs text-xs text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-800" />
            <span>{addedItemMessage}</span>
          </div>
          <Link
            href="/cart"
            className="font-mono text-emerald-950 font-semibold underline underline-offset-4"
          >
            View Basket →
          </Link>
        </div>
      )}

      {/* 2. Main 4 Pillars: Subscriptions, Orders, Pets, Reorder Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Subscriptions & Recent Orders */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* Pillar 1: Active Subscriptions */}
          <section
            aria-labelledby="subscriptions-summary-heading"
            className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100/80 flex items-center justify-center text-emerald-800">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="subscriptions-summary-heading" className="font-serif text-lg font-semibold text-stone-900">
                    Active Auto-Ship Routines
                  </h2>
                  <p className="text-[11px] text-stone-500 font-mono">
                    Continuous replenishment with 10% member savings
                  </p>
                </div>
              </div>

              <Link
                href="/account/subscriptions"
                className="text-xs font-mono font-medium text-stone-700 hover:text-stone-900 underline underline-offset-4 flex items-center gap-1"
              >
                <span>Manage Subscriptions ({subscriptions.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {activeSubscriptions.length === 0 ? (
              <div className="p-6 bg-stone-50 border border-stone-200/80 rounded-xs text-center space-y-2">
                <p className="text-xs text-stone-600">
                  You currently have no active auto-ship routines.
                </p>
                <Link
                  href="/subscriptions"
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-medium underline underline-offset-4 inline-block"
                >
                  Explore auto-ship eligible provisions →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeSubscriptions.slice(0, 2).map((sub) => {
                  const firstItem = sub.items[0];
                  return (
                    <div
                      key={sub.id}
                      className="p-4 bg-emerald-50/40 border border-emerald-200/80 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-semibold text-stone-900">
                            {firstItem?.productName || 'Rowan & Hound Provision'}
                          </span>
                          {sub.items.length > 1 && (
                            <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-xs">
                              +{sub.items.length - 1} more
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600 font-mono">
                          <span>Rhythm: <strong>{formatCadenceLabel(sub.cadence)}</strong></span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-emerald-800" />
                            <span>Next Delivery: <strong>{sub.nextShipmentDate}</strong></span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-200/60">
                        <div className="text-left sm:text-right">
                          <span className="font-mono text-sm font-bold text-stone-900 tabular-nums">
                            {formatCurrency(sub.cycleTotal)}
                          </span>
                          <span className="block text-[10px] text-emerald-800 font-mono">
                            Save {formatCurrency(sub.cycleDiscount)}
                          </span>
                        </div>

                        <Link
                          href={`/account/subscriptions`}
                          className="px-3 py-1.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-medium rounded-xs transition-colors shrink-0 shadow-2xs"
                        >
                          Modify
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Pillar 2: Recent Orders */}
          <section
            aria-labelledby="recent-orders-heading"
            className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-700">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 id="recent-orders-heading" className="font-serif text-lg font-semibold text-stone-900">
                    Recent Orders &amp; Dispatches
                  </h2>
                  <p className="text-[11px] text-stone-500 font-mono">
                    Tracking records and delivery receipts
                  </p>
                </div>
              </div>

              <Link
                href="/account/orders"
                className="text-xs font-mono font-medium text-stone-700 hover:text-stone-900 underline underline-offset-4 flex items-center gap-1"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="p-6 bg-stone-50 border border-stone-200/80 rounded-xs text-center">
                <p className="text-xs text-stone-600">No past orders on record yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {recentOrders.map((order) => {
                  const placedDate = new Date(order.placedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <div key={order.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-stone-900">
                            {order.orderNumber}
                          </span>
                          <span className="text-xs text-stone-400">·</span>
                          <span className="text-xs text-stone-500 font-mono">{placedDate}</span>
                          <span className="text-xs text-stone-400">·</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-mono uppercase tracking-wider font-semibold bg-emerald-100/70 text-emerald-900">
                            <CheckCircle2 className="w-3 h-3 text-emerald-800" />
                            <span>{order.status}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono text-sm font-bold text-stone-900 tabular-nums">
                            {formatCurrency(order.total)}
                          </span>
                          <Link
                            href={`/order-confirmation?orderNumber=${order.orderNumber}`}
                            className="text-xs font-mono text-stone-600 hover:text-stone-900 underline underline-offset-4"
                          >
                            Receipt →
                          </Link>
                        </div>
                      </div>

                      {/* Items list preview */}
                      <div className="flex flex-wrap gap-2 text-xs text-stone-600">
                        {order.items.map((item) => (
                          <span
                            key={item.id}
                            className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-xs text-[11px] font-mono"
                          >
                            {item.quantity}× {item.productName}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Saved Pets & Reorder Shortcuts */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-8">
          {/* Pillar 3: Saved Pets */}
          <section
            aria-labelledby="saved-pets-heading"
            className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-800" />
                <h2 id="saved-pets-heading" className="font-serif text-lg font-semibold text-stone-900">
                  Saved Companions
                </h2>
              </div>

              <Link
                href="/account/pets"
                className="text-xs font-mono font-medium text-stone-700 hover:text-stone-900 underline underline-offset-4 flex items-center gap-1"
              >
                <span>Manage Roster</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {(customer?.pets || []).map((pet) => (
                <div
                  key={pet.id}
                  className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-sm font-semibold text-stone-900">
                        {pet.name}
                      </h3>
                      <p className="text-[11px] text-stone-500 font-mono">
                        {pet.breed} · {pet.ageYears} yrs · {pet.weightLbs} lbs
                      </p>
                    </div>

                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 bg-stone-200 text-stone-700 rounded-xs">
                      {pet.species}
                    </span>
                  </div>

                  {/* Dietary notes */}
                  {pet.dietaryRestrictions && pet.dietaryRestrictions.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {pet.dietaryRestrictions.map((diet, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-white border border-stone-200 text-stone-700 rounded-xs text-[10px] font-mono"
                        >
                          {diet}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <Link
                href="/account/pets"
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-medium rounded-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Companion Profile</span>
              </Link>
            </div>
          </section>

          {/* Pillar 4: Reorder Shortcuts */}
          <section
            aria-labelledby="reorder-shortcuts-heading"
            className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-emerald-800" />
                <h2 id="reorder-shortcuts-heading" className="font-serif text-lg font-semibold text-stone-900">
                  Quick Reorder
                </h2>
              </div>

              <Link
                href="/reorder"
                className="text-xs font-mono font-medium text-stone-700 hover:text-stone-900 underline underline-offset-4 flex items-center gap-1"
              >
                <span>Pantry Replenish</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed">
              One-click replenishments from your frequent Pacific Northwest pantry recipes.
            </p>

            <div className="space-y-3">
              {frequentItems.map((item) => (
                <div
                  key={item.productId}
                  className="p-3 bg-stone-50 border border-stone-200/80 rounded-xs flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block truncate">
                      {item.brand}
                    </span>
                    <h4 className="font-serif text-xs font-medium text-stone-900 truncate">
                      {item.productName}
                    </h4>
                    <span className="font-mono text-xs font-semibold text-stone-800 tabular-nums">
                      {formatCurrency(item.preferredVariantPrice)}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReorder(item)}
                    className="text-xs font-mono shrink-0 cursor-pointer"
                  >
                    + Add
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
