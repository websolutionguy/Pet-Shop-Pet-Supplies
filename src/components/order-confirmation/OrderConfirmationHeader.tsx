'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck, Calendar, Hash, Mail, Clock } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { BoundaryTransparencyBanner } from '../boundary';

interface OrderConfirmationHeaderProps {
  orderNumber: string;
  placedAt: string;
  customerEmail: string;
  hasSubscription: boolean;
}

export function OrderConfirmationHeader({
  orderNumber,
  placedAt,
  customerEmail,
  hasSubscription,
}: OrderConfirmationHeaderProps) {
  const shouldReduceMotion = useReducedMotion();

  const formattedDate = new Date(placedAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(placedAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-xs p-6 sm:p-8 border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-3">
            {/* Animated status badge communicating order placement feedback */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-900/60 text-emerald-300 rounded-xs text-[11px] font-mono uppercase tracking-wider border border-emerald-700/60"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Order Specification Assembled</span>
            </motion.div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight">
              Order {orderNumber}
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Provisions payload assembled for account recipient{' '}
              <strong className="text-white font-mono">{customerEmail}</strong>.
            </p>
          </div>

          {/* Reference Stamp */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { delay: 0.1, duration: 0.2 }}
            className="sm:text-right shrink-0 p-4 bg-stone-800/80 rounded-xs border border-stone-700/80 space-y-1 font-mono text-xs"
          >
            <div className="text-stone-400 text-[10px] uppercase tracking-wider">
              Order Reference
            </div>
            <div className="text-white text-base font-bold tracking-wider">
              {orderNumber}
            </div>
            <div className="text-stone-400 text-[11px] flex items-center gap-1 sm:justify-end">
              <Clock className="w-3 h-3 text-stone-500" />
              <span>{formattedDate}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Clear Architecture Boundary Banner: Never fake backend execution */}
      <BoundaryTransparencyBanner
        endpoint="POST /api/orders"
        operation="Live card charging, warehouse stock deduction, and email receipt dispatch"
      />
    </div>
  );
}
