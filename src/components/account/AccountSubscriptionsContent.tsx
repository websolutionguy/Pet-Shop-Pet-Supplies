'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Repeat,
  Calendar,
  Pause,
  Play,
  FastForward,
  Trash2,
  Edit2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Package,
  Plus,
  Minus,
  X,
  Info,
} from 'lucide-react';
import { AccountNav } from './AccountNav';
import { customerService } from '../../services/customerService';
import { subscriptionService } from '../../services/subscriptionService';
import { productService } from '../../services/productService';
import { CustomerProfile } from '../../types/customer';
import { SubscriptionSchedule, SubscriptionItem } from '../../types/subscription';
import { ProductCadence, Product } from '../../types/product';
import { CADENCE_OPTIONS } from '../../lib/constants';
import { formatCurrency, formatCadenceLabel } from '../../lib/utils';
import { Button } from '../ui/Button';
import { QuantityStepper } from '../ui/QuantityStepper';
import { BoundaryTransparencyBanner } from '../boundary';
import { BoundaryEnforcer } from '../../lib/boundary';
import {
  FeatureLoadingState,
  FeatureEmptyState,
  FeatureErrorState,
} from '../ui/StateFeedback';

export function AccountSubscriptionsContent() {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionSchedule[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Modals state
  const [editingCadenceSub, setEditingCadenceSub] = useState<SubscriptionSchedule | null>(null);
  const [newCadence, setNewCadence] = useState<ProductCadence>('4-weeks');

  const [swappingProductSub, setSwappingProductSub] = useState<{
    sub: SubscriptionSchedule;
    item: SubscriptionItem;
  } | null>(null);
  const [selectedSwapProductId, setSelectedSwapProductId] = useState<string>('');

  const [cancellingSub, setCancellingSub] = useState<SubscriptionSchedule | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Pantry is fully stocked');

  // Load subscriptions & catalog
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setLoadError(null);
      try {
        const [cust, subs, products] = await Promise.all([
          customerService.getCurrentCustomer(),
          subscriptionService.getSubscriptions('cust-eleanor-vance'),
          productService.getAll(),
        ]);

        if (isMounted) {
          setCustomer(cust);
          setSubscriptions(subs);
          setAllProducts(products);
        }
      } catch {
        if (isMounted) {
          setLoadError(
            "We couldn't load your subscription details right now. Please try refreshing, or check your internet connection."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const refreshSubscriptions = async () => {
    const subs = await subscriptionService.getSubscriptions('cust-eleanor-vance');
    setSubscriptions(subs);
  };

  const showNotification = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // 1. Pause or Resume Subscription
  const handleTogglePause = async (sub: SubscriptionSchedule) => {
    try {
      if (sub.status === 'paused') {
        await subscriptionService.resumeSubscription(sub.id);
        showNotification(`Auto-ship routine #${sub.id} has been resumed to active.`);
      } else {
        await subscriptionService.pauseSubscription(sub.id);
        showNotification(`Auto-ship routine #${sub.id} is now paused. No upcoming dispatches will ship until resumed.`);
      }
      await refreshSubscriptions();
    } catch {
      showNotification('Failed to update subscription status.');
    }
  };

  // 2. Skip Next Delivery
  const handleSkipNext = async (sub: SubscriptionSchedule) => {
    try {
      await subscriptionService.skipNextDelivery(sub.id);
      showNotification(`Next shipment skipped. Delivery pushed back by one cadence cycle.`);
      await refreshSubscriptions();
    } catch {
      showNotification(
        "We couldn't skip your upcoming shipment due to a schedule sync issue. Please try again or reach out to pantry care."
      );
    }
  };

  // 3. Change Frequency
  const handleSaveCadence = async () => {
    if (!editingCadenceSub) return;
    try {
      await subscriptionService.updateFrequency(editingCadenceSub.id, newCadence);
      showNotification(`Delivery cadence updated to ${formatCadenceLabel(newCadence)}.`);
      setEditingCadenceSub(null);
      await refreshSubscriptions();
    } catch {
      showNotification(
        "We couldn't update your delivery frequency. Please verify that your chosen cadence is available for all items in this routine."
      );
    }
  };

  // 4. Change Quantity
  const handleUpdateQuantity = async (subId: string, itemId: string, newQty: number) => {
    if (newQty < 1 || newQty > 10) return;
    try {
      await subscriptionService.updateQuantity(subId, itemId, newQty);
      showNotification(`Quantity updated to ${newQty} unit${newQty > 1 ? 's' : ''}.`);
      await refreshSubscriptions();
    } catch {
      showNotification(
        "Quantity could not be modified. Small-batch freshness limits allow between 1 and 10 units per recurring delivery cycle."
      );
    }
  };

  // 5. Change Products / Swap Recipe
  const handleSwapProduct = async () => {
    if (!swappingProductSub || !selectedSwapProductId) return;
    try {
      const newProd = allProducts.find((p) => p.id === selectedSwapProductId);
      if (!newProd) return;

      const sub = swappingProductSub.sub;
      const targetItem = swappingProductSub.item;

      const updatedItems = sub.items.map((i) => {
        if (i.id === targetItem.id) {
          const unitPrice = newProd.basePrice;
          const discountedPrice = Number((unitPrice * 0.9).toFixed(2));
          return {
            ...i,
            productId: newProd.id,
            productName: newProd.name,
            unitPrice,
            discountedPrice,
            variantName: newProd.variants?.[0]?.name || 'Standard Package',
          };
        }
        return i;
      });

      await subscriptionService.updateItems(sub.id, updatedItems);
      showNotification(`Recipe successfully changed to "${newProd.name}".`);
      setSwappingProductSub(null);
      setSelectedSwapProductId('');
      await refreshSubscriptions();
    } catch {
      showNotification(
        "Subscription update unavailable: the chosen replacement is temporarily out of stock or ineligible for auto-ship."
      );
    }
  };

  // 6. Cancel Subscription
  const handleConfirmCancel = async () => {
    if (!cancellingSub) return;
    try {
      await subscriptionService.cancelSubscription(cancellingSub.id, cancelReason);
      showNotification(`Auto-ship routine #${cancellingSub.id} has been cancelled.`);
      setCancellingSub(null);
      await refreshSubscriptions();
    } catch {
      showNotification(
        "We couldn't process your subscription cancellation request right now. Please try again or contact pantry care."
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Account Navigation */}
      <AccountNav customer={customer} />

      {/* Action Feedback Banner */}
      {actionFeedback && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xs text-xs text-emerald-900 flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* Architecture Boundary Banner */}
      <BoundaryTransparencyBanner
        endpoint="PATCH /api/subscriptions/:id"
        operation="Recurring billing schedules, renewal dates, and payment mandate updates"
      />

      {/* 2. Subscriptions List */}
      <div className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900">
              Active &amp; Scheduled Auto-Ship Routines
            </h2>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Modify replenishment frequency, skip upcoming dispatches, adjust quantities, or swap artisan recipes.
            </p>
          </div>

          <Link
            href="/subscriptions"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Routine</span>
          </Link>
        </div>

        {isLoading ? (
          <FeatureLoadingState
            title="Loading your auto-ship routines..."
            message="Retrieving active replenishment schedules, next dispatch dates, and pantry manifests."
          />
        ) : loadError ? (
          <FeatureErrorState
            title="Subscription Sync Notice"
            message={loadError}
            onRetry={refreshSubscriptions}
            retryLabel="Reload Subscriptions"
          />
        ) : subscriptions.length === 0 ? (
          <FeatureEmptyState
            title="No subscription routines registered"
            description="You don't have any active or scheduled recurring deliveries yet. Enroll any small-batch kibble, feline broth, or dental chew in auto-ship for a guaranteed 10% discount and flexible dispatch."
            primaryAction={{
              label: 'Build an Auto-Ship Routine',
              href: '/subscriptions',
            }}
            secondaryAction={{
              label: 'Explore Catalog',
              href: '/shop',
            }}
          />
        ) : (
          <div className="space-y-6">
            {subscriptions.map((sub) => {
              const isPaused = sub.status === 'paused';
              const isCancelled = sub.status === 'cancelled';

              return (
                <div
                  key={sub.id}
                  className={`border rounded-xs overflow-hidden shadow-2xs transition-colors ${
                    isCancelled
                      ? 'border-stone-200 opacity-60 bg-stone-50'
                      : isPaused
                      ? 'border-amber-200 bg-amber-50/20'
                      : 'border-emerald-200/90 bg-emerald-50/30'
                  }`}
                >
                  {/* Card Header: Routine Status & Reference */}
                  <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    {/* Screen reader complete subscription summary */}
                    <div className="sr-only">
                      Subscription routine #{sub.id}: Status is {isCancelled ? 'Subscription Inactive (Cancelled)' : isPaused ? 'Subscription Paused' : 'Subscription Active (Scheduled)'}. Delivery frequency: every {formatCadenceLabel(sub.cadence)}. Next delivery date: {sub.nextShipmentDate}. Recurring cycle price: {formatCurrency(sub.cycleTotal)}, saving {formatCurrency(sub.cycleDiscount)} (10 percent discount).
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="font-mono font-bold text-stone-900 text-sm">
                        Routine #{sub.id}
                      </span>

                      <span className="text-stone-300" aria-hidden="true">|</span>

                      {/* Status Badge with explicit text and supporting icon - never relying solely on color */}
                      <span
                        className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-xs ${
                          isCancelled
                            ? 'bg-stone-200 text-stone-700 border border-stone-300'
                            : isPaused
                            ? 'bg-amber-100 text-amber-950 border border-amber-400'
                            : 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        }`}
                      >
                        {isCancelled ? (
                          <X className="w-3 h-3 text-stone-600" aria-hidden="true" />
                        ) : isPaused ? (
                          <Pause className="w-3 h-3 text-amber-800" aria-hidden="true" />
                        ) : (
                          <Repeat className="w-3 h-3 text-emerald-800" aria-hidden="true" />
                        )}
                        <span>
                          {isCancelled
                            ? 'Subscription Cancelled'
                            : isPaused
                            ? 'Subscription Paused'
                            : 'Subscription Active'}
                        </span>
                      </span>

                      <span className="text-stone-300" aria-hidden="true">|</span>

                      {/* Frequency */}
                      <div className="flex items-center gap-1.5 text-stone-700 font-mono">
                        <span>Frequency:</span>
                        <strong className="text-stone-900">{formatCadenceLabel(sub.cadence)}</strong>
                      </div>

                      <span className="text-stone-300" aria-hidden="true">|</span>

                      {/* Next Delivery Date */}
                      <div className="flex items-center gap-1.5 text-stone-700 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                        <span>Next Delivery:</span>
                        <strong className="text-stone-900">{sub.nextShipmentDate}</strong>
                      </div>
                    </div>

                    {/* Recurring Total */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                      <div className="text-left sm:text-right font-mono">
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                          Recurring Total
                        </span>
                        <span className="font-bold text-stone-900 text-sm tabular-nums">
                          {formatCurrency(sub.cycleTotal)} / cycle
                        </span>
                        <span className="block text-[10px] text-emerald-800">
                          Save {formatCurrency(sub.cycleDiscount)} (10%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body: Products in this Subscription */}
                  <div className="p-4 sm:p-5 bg-white divide-y divide-stone-100">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
                      Enclosed Provisions ({sub.items.length})
                    </span>

                    {sub.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <h4 className="font-serif font-semibold text-stone-900 text-sm">
                            {item.productName}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-stone-500 font-mono">
                            {item.variantName && <span>Format: {item.variantName}</span>}
                            {item.petName && (
                              <span>· Companion: <strong className="text-emerald-800">{item.petName}</strong></span>
                            )}
                            <span>· {formatCurrency(item.discountedPrice)} / unit</span>
                          </div>
                        </div>

                        {/* Quantity Stepper & Recipe Swap CTA */}
                        {!isCancelled && (
                          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                            {/* Quantity Stepper with 44px touch target */}
                            <QuantityStepper
                              quantity={item.quantity}
                              onDecrease={() => handleUpdateQuantity(sub.id, item.id, item.quantity - 1)}
                              onIncrease={() => handleUpdateQuantity(sub.id, item.id, item.quantity + 1)}
                              min={1}
                              max={10}
                              size="sm"
                            />

                            {/* Recipe Swap with 44px touch target */}
                            <button
                              type="button"
                              onClick={() => {
                                setSwappingProductSub({ sub, item });
                                setSelectedSwapProductId(item.productId);
                              }}
                              className="px-3 py-2 min-h-[44px] bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-mono rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer touch-manipulation"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>Swap Recipe</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Card Action Controls Footer */}
                  {!isCancelled && (
                    <div className="p-3.5 sm:p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                      {/* Left Actions: Change frequency & Skip delivery */}
                      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCadenceSub(sub);
                            setNewCadence(sub.cadence);
                          }}
                          className="px-3.5 py-2 min-h-[44px] bg-white hover:bg-stone-100 border border-stone-300 rounded-xs text-stone-800 font-mono font-medium transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer touch-manipulation flex-1 sm:flex-none justify-center"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-stone-500" />
                          <span>Change Frequency</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSkipNext(sub)}
                          className="px-3.5 py-2 min-h-[44px] bg-white hover:bg-stone-100 border border-stone-300 rounded-xs text-stone-800 font-mono font-medium transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer touch-manipulation flex-1 sm:flex-none justify-center"
                        >
                          <FastForward className="w-3.5 h-3.5 text-stone-500" />
                          <span>Skip Next Delivery</span>
                        </button>
                      </div>

                      {/* Right Actions: Pause / Resume & Cancel */}
                      <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto justify-between sm:justify-end">
                        <button
                          type="button"
                          onClick={() => handleTogglePause(sub)}
                          className="px-3.5 py-2 min-h-[44px] bg-white hover:bg-stone-100 border border-stone-300 rounded-xs text-stone-800 font-mono font-medium transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer touch-manipulation flex-1 sm:flex-none justify-center"
                        >
                          {isPaused ? (
                            <>
                              <Play className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Resume Auto-Ship</span>
                            </>
                          ) : (
                            <>
                              <Pause className="w-3.5 h-3.5 text-amber-700" />
                              <span>Pause Routine</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setCancellingSub(sub)}
                          className="px-3 py-2 min-h-[44px] flex items-center justify-center text-stone-500 hover:text-red-700 font-mono text-xs transition-colors cursor-pointer touch-manipulation"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. Modal Dialog: Change Frequency */}
      {editingCadenceSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-xs shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Change Delivery Frequency
              </h3>
              <button
                type="button"
                onClick={() => setEditingCadenceSub(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Select how often you would like this replenishment dispatch to arrive. Your 10% auto-ship savings remain active.
            </p>

            <div className="space-y-2">
              {(['2-weeks', '4-weeks', '6-weeks', '8-weeks', '12-weeks'] as ProductCadence[]).map((cad) => (
                <label
                  key={cad}
                  className={`flex items-center justify-between p-3 border rounded-xs cursor-pointer text-xs transition-colors ${
                    newCadence === cad
                      ? 'border-emerald-800 bg-emerald-50/60 font-semibold text-emerald-950'
                      : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="subscription-cadence"
                      value={cad}
                      checked={newCadence === cad}
                      onChange={() => setNewCadence(cad)}
                      className="accent-emerald-900"
                    />
                    <span>{formatCadenceLabel(cad)}</span>
                  </div>
                  <span className="font-mono text-[11px] text-stone-500">
                    {cad === '4-weeks' ? 'Most Popular' : ''}
                  </span>
                </label>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingCadenceSub(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveCadence}
              >
                Save Frequency
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Dialog: Swap Recipe / Change Product */}
      {swappingProductSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-xs shadow-xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Swap Recipe in Auto-Ship Routine
              </h3>
              <button
                type="button"
                onClick={() => setSwappingProductSub(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Replacing <strong>{swappingProductSub.item.productName}</strong>. Choose another artisan recipe from our small-batch pantry:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {allProducts.map((p) => {
                const isSelected = selectedSwapProductId === p.id;
                return (
                  <label
                    key={p.id}
                    className={`flex items-start justify-between p-3 border rounded-xs cursor-pointer text-xs transition-colors ${
                      isSelected
                        ? 'border-emerald-800 bg-emerald-50/60 font-medium text-emerald-950'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="swap-product"
                        value={p.id}
                        checked={isSelected}
                        onChange={() => setSelectedSwapProductId(p.id)}
                        className="mt-0.5 accent-emerald-900"
                      />
                      <div>
                        <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                          {p.brand}
                        </span>
                        <span className="font-serif text-stone-900 block">
                          {p.name}
                        </span>
                        <span className="text-[11px] text-stone-500 font-mono">
                          {p.categoryName} · {p.unitMeasurement}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 font-mono">
                      <span className="font-semibold text-stone-900">
                        {formatCurrency(p.basePrice * 0.9)}
                      </span>
                      <span className="block text-[10px] text-stone-400 line-through">
                        {formatCurrency(p.basePrice)}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSwappingProductSub(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!selectedSwapProductId}
                onClick={handleSwapProduct}
              >
                Confirm Recipe Swap
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal Dialog: Cancel Subscription */}
      {cancellingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white border border-stone-200 rounded-xs shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif text-lg font-semibold text-stone-900">
                Cancel Auto-Ship Routine?
              </h3>
              <button
                type="button"
                onClick={() => setCancellingSub(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to cancel routine #{cancellingSub.id}? You can pause or skip upcoming shipments instead with zero penalties.
            </p>

            <div>
              <label
                htmlFor="cancel-reason"
                className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-1"
              >
                Reason for Cancellation <span className="text-stone-400">(Optional)</span>
              </label>
              <select
                id="cancel-reason"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xs text-xs text-stone-900 focus:outline-none"
              >
                <option value="Pantry is fully stocked">Pantry is currently fully stocked</option>
                <option value="Companion diet has changed">Companion diet or nutrition changed</option>
                <option value="Financial pause">Temporary budget pause</option>
                <option value="Trying other recipes">Exploring other food varieties</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancellingSub(null)}
              >
                Keep Routine
              </Button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
