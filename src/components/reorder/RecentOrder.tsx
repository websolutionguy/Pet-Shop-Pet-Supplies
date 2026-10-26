'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppImage } from '../ui/AppImage';

import {
  Package,
  Calendar,
  CheckCircle2,
  RotateCcw,
  Truck,
  Repeat,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderLineItem } from '../../types/order';
import { Product } from '../../types/product';
import { useCart } from '../../providers/CartProvider';
import { QuickReorderButton } from './QuickReorderButton';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface RecentOrderProps {
  order: Order;
  productLookup?: Record<string, Product>;
  onOrderReordered?: (order: Order) => void;
}

export function RecentOrder({
  order,
  productLookup = {},
  onOrderReordered,
}: RecentOrderProps) {
  const { addMultipleItems, addItem } = useCart();
  const [isReorderingAll, setIsReorderingAll] = useState(false);
  const [reorderedAllNotice, setReorderedAllNotice] = useState(false);

  const formattedDate = new Date(order.placedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Reorder entire order at once
  const handleReorderAll = () => {
    setIsReorderingAll(true);

    const batch = order.items
      .map((item) => {
        const prod = productLookup[item.productId];
        if (!prod) return null;
        return {
          product: prod,
          options: {
            quantity: item.quantity,
            purchaseType: item.isSubscription ? ('subscription' as const) : ('one-time' as const),
            cadence: item.cadence,
            targetPetName: item.targetPetName,
          },
        };
      })
      .filter((entry): entry is { product: Product; options: any } => entry !== null);

    if (batch.length > 0) {
      addMultipleItems(batch);
      setReorderedAllNotice(true);
      onOrderReordered?.(order);
      setTimeout(() => {
        setReorderedAllNotice(false);
        setIsReorderingAll(false);
      }, 1800);
    } else {
      setIsReorderingAll(false);
    }
  };

  // Reorder individual line item
  const handleReorderSingleItem = (item: OrderLineItem, convertToSub = false) => {
    const prod = productLookup[item.productId];
    if (prod) {
      addItem(prod, {
        quantity: item.quantity,
        purchaseType: convertToSub && prod.subscription.eligible ? 'subscription' : 'one-time',
        cadence: convertToSub ? '4-weeks' : item.cadence,
        targetPetName: item.targetPetName,
      });
    }
  };

  return (
    <article className="bg-white border border-stone-200/90 rounded-xs overflow-hidden shadow-xs">
      {/* Order Top Bar */}
      <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Order Number
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-stone-900">
              {order.orderNumber}
            </span>
          </div>

          <div className="hidden sm:block h-6 w-px bg-stone-200" aria-hidden="true" />

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Date Placed
            </span>
            <span className="text-xs sm:text-sm text-stone-700 font-mono">
              {formattedDate}
            </span>
          </div>

          <div className="hidden sm:block h-6 w-px bg-stone-200" aria-hidden="true" />

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block">
              Order Total
            </span>
            <span className="font-mono text-xs sm:text-sm font-semibold text-stone-900 tabular-nums">
              {formatCurrency(order.total)}
            </span>
          </div>
        </div>

        {/* Status & Carrier Tracking */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-emerald-950 bg-emerald-100/90 px-2 py-0.5 rounded-xs border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
            <span className="capitalize">{order.status}</span>
          </span>

          {order.trackingNumber && (
            <span className="text-[11px] font-mono text-stone-500 hidden md:inline">
              Track: {order.trackingNumber}
            </span>
          )}
        </div>
      </div>

      {/* Line Items List */}
      <div className="p-4 sm:p-5 divide-y divide-stone-100 space-y-3">
        {order.items.map((item) => {
          const prod = productLookup[item.productId];
          return (
            <div
              key={item.id}
              className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 bg-stone-100 rounded-xs overflow-hidden shrink-0 border border-stone-200">
                  {prod?.primaryImage ? (
                    <AppImage
                      src={prod.primaryImage}
                      alt={item.productName}
                      fill
                      loading="lazy"
                      sizes="48px"
                      className="object-cover"
                      showSpinner={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-400">
                      <Package className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="font-serif text-xs sm:text-sm font-medium text-stone-900 leading-snug">
                    {item.productName}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 font-mono mt-0.5">
                    {item.variantName && <span>{item.variantName}</span>}
                    <span>Qty: {item.quantity}</span>
                    {item.targetPetName && (
                      <span className="text-stone-700 bg-stone-100 px-1 rounded-xs">
                        For {item.targetPetName}
                      </span>
                    )}
                    {item.isSubscription && (
                      <span className="text-emerald-800 font-semibold">
                        Auto-Ship ({item.cadence || '4-wk'})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price & Single Item Reorder */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <span className="font-mono text-xs sm:text-sm font-semibold text-stone-900 tabular-nums">
                  {formatCurrency((item.totalPrice || item.unitPrice * item.quantity))}
                </span>

                <div className="flex items-center gap-1.5">
                  <QuickReorderButton
                    onReorder={() => handleReorderSingleItem(item, false)}
                    label="Reorder"
                    size="sm"
                    variant="outline"
                  />

                  {prod?.subscription.eligible && !item.isSubscription && (
                    <button
                      type="button"
                      onClick={() => handleReorderSingleItem(item, true)}
                      className="px-2 py-1 text-[11px] font-mono text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-xs border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                      title="Convert this staple to auto-ship for 10% savings"
                    >
                      <Repeat className="w-3 h-3 text-emerald-800" />
                      <span>Auto-Ship (-10%)</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: Reorder Entire Box Action */}
      <div className="p-4 sm:p-5 bg-stone-50/50 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-stone-600 font-mono">
          <span>Ship to: {order.shippingAddress.fullName}, {order.shippingAddress.city}, {order.shippingAddress.state}</span>
        </div>

        <Button
          variant="primary"
          size="sm"
          disabled={isReorderingAll}
          onClick={handleReorderAll}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          {reorderedAllNotice ? 'Entire Box Added to Basket!' : 'Reorder Entire Order'}
        </Button>
      </div>
    </article>
  );
}
