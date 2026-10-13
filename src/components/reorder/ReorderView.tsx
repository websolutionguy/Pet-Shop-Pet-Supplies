'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  Repeat,
  Package,
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle,
  ShoppingBag,
  SlidersHorizontal,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types/product';
import { Order, FrequentlyPurchasedItem } from '../../types/order';
import { orderService } from '../../services/orderService';
import { reorderService } from '../../services/reorderService';
import { productService } from '../../services/productService';
import { ReorderCard } from './ReorderCard';
import { RecentOrder } from './RecentOrder';
import { ReorderSummary } from './ReorderSummary';
import { useCart } from '../../providers/CartProvider';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import {
  FeatureLoadingState,
  FeatureEmptyState,
  FeatureErrorState,
} from '../ui/StateFeedback';

export function ReorderView() {
  const { openCart } = useCart();

  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [frequentItems, setFrequentItems] = useState<FrequentlyPurchasedItem[]>([]);
  const [reorderableProducts, setReorderableProducts] = useState<Product[]>([]);
  const [productLookup, setProductLookup] = useState<Record<string, Product>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Tab & Filter states
  const [activeTab, setActiveTab] = useState<'frequent' | 'orders' | 'all'>('frequent');
  const [petFilter, setPetFilter] = useState<'all' | 'Barnaby' | 'Milo'>('all');

  // Confirmation state
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);

  // Load orders and reorderable products
  const loadData = React.useCallback(() => {
    setIsLoading(true);
    setLoadError(null);
    Promise.all([
      orderService.getByCustomerId('cust-eleanor-vance'),
      reorderService.getFrequentlyPurchasedItems('cust-eleanor-vance'),
      reorderService.getReorderableProducts(),
      productService.getAll(),
    ])
      .then(([loadedOrders, loadedFrequent, loadedReorderable, allProds]) => {
        setOrders(loadedOrders);
        setFrequentItems(loadedFrequent);
        setReorderableProducts(loadedReorderable);

        const lookup: Record<string, Product> = {};
        allProds.forEach((p) => {
          lookup[p.id] = p;
        });
        setProductLookup(lookup);
      })
      .catch(() => {
        setLoadError("We couldn't retrieve your previous reorderable items. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      orderService.getByCustomerId('cust-eleanor-vance'),
      reorderService.getFrequentlyPurchasedItems('cust-eleanor-vance'),
      reorderService.getReorderableProducts(),
      productService.getAll(),
    ])
      .then(([loadedOrders, loadedFrequent, loadedReorderable, allProds]) => {
        if (!isMounted) return;
        setOrders(loadedOrders);
        setFrequentItems(loadedFrequent);
        setReorderableProducts(loadedReorderable);

        const lookup: Record<string, Product> = {};
        allProds.forEach((p) => {
          lookup[p.id] = p;
        });
        setProductLookup(lookup);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadError("We couldn't retrieve your previous reorderable items. Please try again.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle confirmation feedback
  const handleItemAdded = (prod: Product, quantity: number, isSub: boolean) => {
    setConfirmationMessage(
      `Added ${quantity}× ${prod.name} ${isSub ? '(Auto-Ship Subscription)' : ''} to your basket.`
    );
    setTimeout(() => {
      setConfirmationMessage(null);
    }, 3500);
  };

  const handleOrderReordered = (order: Order) => {
    setConfirmationMessage(
      `Entire order ${order.orderNumber} (${order.items.length} items) added to your basket.`
    );
    setTimeout(() => {
      setConfirmationMessage(null);
    }, 4000);
  };

  // Filtered frequent items
  const filteredFrequent = useMemo(() => {
    if (petFilter === 'all') return frequentItems;
    return frequentItems.filter(
      (item) => item.targetPetName?.toLowerCase() === petFilter.toLowerCase()
    );
  }, [frequentItems, petFilter]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (petFilter === 'all') return orders;
    return orders.filter((order) =>
      order.items.some(
        (it) => it.targetPetName?.toLowerCase().includes(petFilter.toLowerCase())
      )
    );
  }, [orders, petFilter]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Fast Consumer Hero */}
      <header className="bg-stone-900 text-stone-100 py-10 sm:py-12 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Instant Pantry Replenishment</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white">
              Buy What You Already Buy, Fast.
            </h1>
            <p className="mt-3 text-stone-300 text-xs sm:text-sm leading-relaxed">
              No searching through hundreds of recipes. Replenish your companion&apos;s oven-roasted
              kibble, freeze-dried treats, and cold-pressed supplements with a single click.
            </p>

            {/* Honest Demo Profile Indicator */}
            <div className="mt-4 inline-flex items-center gap-2 p-2 bg-stone-800/80 rounded-xs text-[11px] text-stone-300 font-mono border border-stone-700">
              <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Demonstration Profile: <strong>Eleanor Vance</strong> (Companions: Barnaby &amp; Milo) · Sample Order Records
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Confirmation Banner */}
      <AnimatePresence>
        {confirmationMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sticky top-16 z-30 bg-emerald-900 text-white px-4 py-3 shadow-md border-b border-emerald-800"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{confirmationMessage}</span>
              </div>
              <button
                type="button"
                onClick={openCart}
                className="font-mono text-xs font-bold underline underline-offset-4 hover:text-emerald-200 cursor-pointer shrink-0"
              >
                View Basket →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation & Companion Filter Bar */}
        <div className="bg-white border border-stone-200/90 rounded-xs p-3.5 sm:p-4 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Main Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none touch-pan-x">
            <button
              type="button"
              onClick={() => setActiveTab('frequent')}
              className={cn(
                'px-4 py-2.5 text-xs rounded-xs font-medium transition-colors cursor-pointer whitespace-nowrap min-h-[44px] flex items-center touch-manipulation',
                activeTab === 'frequent'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
              )}
            >
              Frequently Purchased ({frequentItems.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={cn(
                'px-4 py-2.5 text-xs rounded-xs font-medium transition-colors cursor-pointer whitespace-nowrap min-h-[44px] flex items-center touch-manipulation',
                activeTab === 'orders'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
              )}
            >
              Past Orders ({orders.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={cn(
                'px-4 py-2.5 text-xs rounded-xs font-medium transition-colors cursor-pointer whitespace-nowrap min-h-[44px] flex items-center touch-manipulation',
                activeTab === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
              )}
            >
              All Reorderable ({reorderableProducts.length})
            </button>
          </div>

          {/* Filter by Companion */}
          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="text-stone-500">Filter Companion:</span>
            <div className="flex items-center gap-1">
              {(['all', 'Barnaby', 'Milo'] as const).map((pet) => (
                <button
                  key={pet}
                  type="button"
                  onClick={() => setPetFilter(pet)}
                  className={cn(
                    'px-3 py-2 rounded-xs border text-[11px] transition-colors cursor-pointer min-h-[44px] flex items-center touch-manipulation',
                    petFilter === pet
                      ? 'border-emerald-800 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  )}
                >
                  {pet === 'all' ? 'All' : pet}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Grid: Left Main List (8 cols), Right Reorder Summary (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            {/* Tab 1: Frequently Purchased Staples */}
            {activeTab === 'frequent' && (
              <section aria-label="Frequently Purchased Pantry Staples" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-lg sm:text-xl font-normal text-stone-900">
                      Pantry Staples &amp; Reorder Candidates
                    </h2>
                    <p className="text-xs text-stone-500">
                      Provisions you order consistently, with quick quantity adjustments and subscription conversion.
                    </p>
                  </div>
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    <FeatureLoadingState
                      title="Loading pantry staples..."
                      message="Retrieving frequently purchased provisions, bag remaining estimates, and auto-ship conversion options."
                    />
                  </div>
                ) : loadError ? (
                  <FeatureErrorState
                    title="Pantry Replenishment Notice"
                    message={loadError}
                    onRetry={loadData}
                    retryLabel="Reload Reorder List"
                  />
                ) : filteredFrequent.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredFrequent.map((item) => {
                      const prod = productLookup[item.productId];
                      if (!prod) return null;

                      return (
                        <ReorderCard
                          key={item.productId}
                          product={prod}
                          lastPurchasedAt={item.lastPurchasedAt}
                          targetPetName={item.targetPetName}
                          timesOrdered={item.timesOrdered}
                          pantryStatus={item.pantryStatus}
                          estimatedDaysRemaining={item.estimatedDaysRemaining}
                          onAdded={handleItemAdded}
                        />
                      );
                    })}
                  </div>
                ) : frequentItems.length === 0 ? (
                  <FeatureEmptyState
                    icon={RotateCcw}
                    badge="No Reorderable Products"
                    title="Your reorder list is empty"
                    description="Your reorder list is empty because you don't have any eligible previous purchases. Once you complete an order, your recurring favorites will appear here for 1-click restocking."
                    primaryAction={{
                      label: 'Explore Provisions Catalog',
                      href: '/shop',
                    }}
                    secondaryAction={{
                      label: 'View All Reorderable Recipes',
                      onClick: () => setActiveTab('all'),
                    }}
                  />
                ) : (
                  <FeatureEmptyState
                    icon={RotateCcw}
                    title={`No staples found for ${petFilter}`}
                    description={`None of your frequently purchased provisions are designated for ${petFilter}. Reset your companion filter to see all replenishment options.`}
                    primaryAction={{
                      label: 'Show All Companions',
                      onClick: () => setPetFilter('all'),
                    }}
                    secondaryAction={{
                      label: 'Browse Catalog',
                      href: '/shop',
                    }}
                    compact={true}
                  />
                )}
              </section>
            )}

            {/* Tab 2: Past Orders History */}
            {activeTab === 'orders' && (
              <section aria-label="Order History & 1-Click Reorder" className="space-y-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-normal text-stone-900">
                    Past Order Deliveries
                  </h2>
                  <p className="text-xs text-stone-500">
                    Reorder an entire past order with a single click, or pick individual recipes.
                  </p>
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    <FeatureLoadingState
                      title="Loading order deliveries..."
                      message="Retrieving order history, line items, and fulfillment receipts."
                    />
                  </div>
                ) : loadError ? (
                  <FeatureErrorState
                    title="Order History Notice"
                    message={loadError}
                    onRetry={loadData}
                    retryLabel="Reload Orders"
                  />
                ) : filteredOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <RecentOrder
                        key={order.id}
                        order={order}
                        productLookup={productLookup}
                        onOrderReordered={handleOrderReordered}
                      />
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <FeatureEmptyState
                    icon={Package}
                    badge="No Previous Orders"
                    title="No previous orders found"
                    description="You haven't placed any orders with Rowan & Hound yet. Once you complete your first order, delivery tracking, line items, and 1-click reorder will appear here."
                    primaryAction={{
                      label: 'Start Your First Order',
                      href: '/shop',
                    }}
                    secondaryAction={{
                      label: 'Curated Bundles',
                      href: '/bundles',
                    }}
                  />
                ) : (
                  <FeatureEmptyState
                    icon={Package}
                    title={`No orders found for ${petFilter}`}
                    description={`None of your previous orders contained recipes designated for ${petFilter}.`}
                    primaryAction={{
                      label: 'Show All Past Orders',
                      onClick: () => setPetFilter('all'),
                    }}
                    compact={true}
                  />
                )}
              </section>
            )}

            {/* Tab 3: All Reorderable Provisions */}
            {activeTab === 'all' && (
              <section aria-label="All Reorder-Eligible Catalog Provisions" className="space-y-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-normal text-stone-900">
                    All Reorder-Eligible Provisions
                  </h2>
                  <p className="text-xs text-stone-500">
                    Catalog items with quick replenishment packaging and verified inventory.
                  </p>
                </div>

                {reorderableProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {reorderableProducts.map((prod) => (
                      <ReorderCard
                        key={prod.id}
                        product={prod}
                        timesOrdered={1}
                        pantryStatus="stocked"
                        onAdded={handleItemAdded}
                      />
                    ))}
                  </div>
                ) : (
                  <FeatureEmptyState
                    icon={RotateCcw}
                    title="No reorderable products available"
                    description="There are currently no provisions marked as recurring staples in the catalog. Explore our whole-nutrition recipes and treats to find new favorites."
                    primaryAction={{
                      label: 'Browse Full Catalog',
                      href: '/shop',
                    }}
                  />
                )}
              </section>
            )}
          </div>

          {/* Right Column: Live Reorder Basket Summary (4 cols) */}
          <div className="lg:col-span-4 sticky top-20">
            <ReorderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
