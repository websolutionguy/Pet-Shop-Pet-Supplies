'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Calendar, Repeat, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { CartItem, CartSummary } from '../../types/cart';
import { CustomerFormData, ShippingAddressFormData } from '../../types/checkout';
import { formatCurrency, formatCadenceLabel } from '../../lib/utils';
import { cartService } from '../../services/cartService';

interface CheckoutConfirmationModalProps {
  isOpen: boolean;
  orderNumber: string;
  customer: CustomerFormData;
  shipping: ShippingAddressFormData;
  items: CartItem[];
  summary: CartSummary;
  onClose: () => void;
}

export function CheckoutConfirmationModal({
  isOpen,
  orderNumber,
  customer,
  shipping,
  items,
  summary,
  onClose,
}: CheckoutConfirmationModalProps) {
  const shouldReduceMotion = useReducedMotion();

  const subscriptionItems = items.filter((i) => i.purchaseType === 'subscription');
  const oneTimeItems = items.filter((i) => i.purchaseType === 'one-time');

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirmation-modal-title"
        >
          {/* Backdrop transition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
          />

          {/* Modal Card with subtle scale and fade */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: 'spring', damping: 26, stiffness: 300 }
            }
            className="relative bg-white w-full max-w-2xl rounded-xs border border-stone-200 shadow-2xl z-10 overflow-hidden my-8 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-stone-900 text-stone-100 flex items-start gap-4 shrink-0">
              <motion.div
                initial={shouldReduceMotion ? { scale: 1 } : { scale: 0.7 }}
                animate={{ scale: 1 }}
                transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.1, duration: 0.25 }}
                className="w-10 h-10 rounded-full bg-emerald-700/80 text-white flex items-center justify-center shrink-0"
              >
                <CheckCircle className="w-6 h-6 text-emerald-300" />
              </motion.div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-emerald-400 mb-1">
                  <span>Status: Order Placed</span>
                </div>
                <h2 id="confirmation-modal-title" className="font-serif text-2xl font-normal text-white">
                  Order {orderNumber} Placed
                </h2>
                <p className="mt-1 text-xs text-stone-300">
                  Receipt confirmation dispatched to <strong className="text-white">{customer.email}</strong>
                </p>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
              {/* Delivery info */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xs space-y-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-stone-400 block font-semibold">
                  Delivery Destination:
                </span>
                <p className="font-serif text-sm font-semibold text-stone-900">
                  {shipping.fullName}
                </p>
                <p className="text-stone-600 font-mono text-[11px]">
                  {shipping.streetLine1}
                  {shipping.streetLine2 ? `, ${shipping.streetLine2}` : ''}
                </p>
                <p className="text-stone-600 font-mono text-[11px]">
                  {shipping.city}, {shipping.state} {shipping.postalCode}
                </p>
              </div>

              {/* Subscriptions */}
              {subscriptionItems.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-emerald-950 font-serif text-sm font-semibold">
                    <Repeat className="w-4 h-4 text-emerald-800" />
                    <span>Active Auto-Ship Subscriptions Created:</span>
                  </div>
                  <div className="divide-y divide-stone-100 border border-emerald-200 rounded-xs bg-emerald-50/30 p-3 space-y-2">
                    {subscriptionItems.map((sub, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs py-1">
                        <div>
                          <span className="font-medium text-stone-900 block">{sub.product.name}</span>
                          <span className="text-[10px] font-mono text-emerald-800">
                            Cadence: {formatCadenceLabel(sub.subscriptionCadence)} · Qty: {sub.quantity}
                          </span>
                        </div>
                        <span className="font-mono font-semibold text-emerald-950">
                          {formatCurrency(sub.product.basePrice * 0.9 * sub.quantity)} / cycle
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order total */}
              <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-xs font-mono">
                <span className="text-stone-500">Total Billed Today:</span>
                <span className="text-sm font-bold text-stone-900">
                  {formatCurrency(summary.total)}
                </span>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <Link
                href="/shop"
                onClick={onClose}
                className="text-xs font-mono text-stone-600 hover:text-stone-900 underline underline-offset-4"
              >
                Return to Shop Catalog
              </Link>
              <Link
                href={`/orders/${orderNumber}`}
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xs text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>View Order Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
