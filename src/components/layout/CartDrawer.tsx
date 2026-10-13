'use client';

import React, { useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  X,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../../providers/CartProvider';
import { CartItemRow } from '../cart/CartItemRow';
import { CartOrderSummary } from '../cart/CartOrderSummary';
import { EmptyCart } from '../cart/EmptyCart';
import { CartLoadingState } from '../cart/CartLoadingState';
import { CartErrorState } from '../cart/CartErrorState';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../ui/Button';

export function CartDrawer() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const {
    items,
    summary,
    isCartOpen,
    closeCart,
    isLoading,
    error,
    clearCart,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeCart();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [closeCart]
  );

  useEffect(() => {
    if (isCartOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      const timer = setTimeout(() => {
        if (drawerRef.current) {
          const focusable = drawerRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable) {
            focusable.focus();
          } else {
            drawerRef.current.focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isCartOpen, handleKeyDown]);

  const handleGoToFullCart = () => {
    closeCart();
    router.push('/cart');
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          aria-modal="true"
          role="dialog"
          aria-labelledby="cart-drawer-heading"
        >
          {/* Live region for screen reader basket announcements */}
          <div className="sr-only" role="status" aria-live="polite">
            Provisions basket open. Contains {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'}. Grand total is {formatCurrency(summary.total)}.
          </div>

          {/* Restrained Backdrop transition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Slide-over panel transition */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              ref={drawerRef}
              tabIndex={-1}
              initial={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
              animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { x: '100%' }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', damping: 28, stiffness: 260 }
              }
              className="w-screen max-w-md bg-stone-50 shadow-2xl flex flex-col border-l border-stone-200 outline-none"
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-900" aria-hidden="true" />
                  <h2 id="cart-drawer-heading" className="text-base font-semibold text-stone-900 tracking-tight font-serif">
                    Provisions Basket
                  </h2>
                  <span className="text-xs text-stone-500 font-mono tabular-nums">
                    ({summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'})
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleGoToFullCart}
                    className="px-2.5 py-1.5 min-h-[44px] text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xs transition-colors text-xs font-mono flex items-center gap-1 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                    title="Open full basket page"
                  >
                    <span>Full Page</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={closeCart}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xs transition-colors cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                    aria-label="Close basket drawer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Error Notice */}
              {error && (
                <div className="px-5 pt-3" role="alert">
                  <CartErrorState message={error} compact />
                </div>
              )}

              {/* Basket Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-stone-200">
                {isLoading ? (
                  <CartLoadingState compact />
                ) : items.length === 0 ? (
                  <EmptyCart onCloseDrawer={closeCart} compact />
                ) : (
                  <div>
                    {/* Basket Type Badge */}
                    <div className="mb-3 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                        Queued Items
                      </span>
                      {summary.isMixedCart ? (
                        <span className="font-mono text-[10px] font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-xs border border-emerald-300">
                          Mixed: One-Time &amp; Auto-Ship
                        </span>
                      ) : summary.hasSubscriptionItems ? (
                        <span className="font-mono text-[10px] font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-xs border border-emerald-300">
                          Continuous Auto-Ship Routine
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] font-medium text-stone-600 bg-stone-200 px-2 py-0.5 rounded-xs">
                          One-Time Delivery
                        </span>
                      )}
                    </div>

                    {/* Item Rows */}
                    <div className="divide-y divide-stone-200">
                      {items.map((item) => (
                        <CartItemRow key={item.id} item={item} compact />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Checkout & Order Summary Drawer Section */}
              {items.length > 0 && (
                <div className="shrink-0 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))] bg-white border-t border-stone-200 space-y-3">
                  {/* Financial breakdown */}
                  <div className="space-y-1.5 text-xs text-stone-600">
                    {/* Screen reader financial summary */}
                    <div className="sr-only">
                      Order breakdown: Subtotal {formatCurrency(summary.productSubtotal)}, {summary.subscriptionSavings > 0 ? `Subscription discount ${formatCurrency(summary.subscriptionSavings)}, ` : ''}{summary.promotionDiscount > 0 ? `Promotion discount ${formatCurrency(summary.promotionDiscount)}, ` : ''}Courier delivery {summary.qualifiesForFreeShipping ? 'free' : formatCurrency(summary.estimatedShipping)}, Estimated sales tax {formatCurrency(summary.estimatedTax)}, Estimated total {formatCurrency(summary.total)}.
                    </div>

                    <div className="flex justify-between" aria-hidden="true">
                      <span>Product Subtotal</span>
                      <span className="font-mono tabular-nums text-stone-900">
                        {formatCurrency(summary.productSubtotal)}
                      </span>
                    </div>

                    {summary.subscriptionSavings > 0 && (
                      <div className="flex justify-between text-emerald-800 font-medium" aria-hidden="true">
                        <span>Subscribe &amp; Save (10%)</span>
                        <span className="font-mono tabular-nums">
                          -{formatCurrency(summary.subscriptionSavings)}
                        </span>
                      </div>
                    )}

                    {summary.promotionDiscount > 0 && (
                      <div className="flex justify-between text-emerald-800 font-medium" aria-hidden="true">
                        <span>Promotion ({summary.appliedPromoCode})</span>
                        <span className="font-mono tabular-nums">
                          -{formatCurrency(summary.promotionDiscount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between" aria-hidden="true">
                      <span>Courier Delivery</span>
                      <span className="font-mono tabular-nums text-stone-900">
                        {summary.qualifiesForFreeShipping ? (
                          <span className="text-emerald-800 font-semibold">FREE</span>
                        ) : (
                          formatCurrency(summary.estimatedShipping)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between" aria-hidden="true">
                      <span>Estimated Sales Tax</span>
                      <span className="font-mono tabular-nums text-stone-900">
                        {formatCurrency(summary.estimatedTax)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-semibold text-stone-900" aria-hidden="true">
                      <div>
                        <span className="font-serif block">Due Today</span>
                        {summary.hasSubscriptionItems && (
                          <span className="text-[10px] text-stone-500 font-mono font-normal">
                            Recurring cycle: {formatCurrency(summary.recurringCycleTotal || summary.total)}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-base font-bold tabular-nums">
                        {formatCurrency(summary.total)}
                      </span>
                    </div>
                  </div>

                  {summary.hasSubscriptionItems && (
                    <p className="text-[11px] text-emerald-950 bg-emerald-50/80 p-2 border border-emerald-200/80 rounded-xs leading-relaxed">
                      ✓ Auto-ship items renew automatically on your chosen rhythm. Modify or cancel anytime.
                    </p>
                  )}

                  {/* Actions */}
                  <div className="space-y-2 pt-1">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleCheckout}
                      className="w-full text-xs uppercase tracking-wider font-semibold min-h-[48px] touch-manipulation focus-visible:ring-2 focus-visible:ring-stone-900"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Proceed to Checkout ({summary.itemCount})
                    </Button>

                    <button
                      type="button"
                      onClick={handleGoToFullCart}
                      className="w-full py-2.5 min-h-[44px] flex items-center justify-center text-center text-xs font-mono text-stone-700 hover:text-stone-950 underline underline-offset-4 cursor-pointer touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded-xs"
                    >
                      View Full Basket &amp; Apply Promo Codes →
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
