'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, FileText, Repeat, ArrowRight, Home } from 'lucide-react';

interface OrderConfirmationActionsProps {
  orderNumber: string;
  hasSubscription: boolean;
}

export function OrderConfirmationActions({
  orderNumber,
  hasSubscription,
}: OrderConfirmationActionsProps) {
  return (
    <div className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 shadow-xs space-y-4">
      <h2 className="font-serif text-lg font-semibold text-stone-900 pb-2 border-b border-stone-100">
        Next Actions &amp; Pantry Management
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {/* 1. Continue Shopping */}
        <Link
          href="/shop"
          className="flex flex-col items-center justify-center p-4 rounded-xs border border-stone-200 hover:border-stone-900 bg-stone-50 hover:bg-white text-stone-900 text-center transition-all group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center mb-2 group-hover:bg-stone-900 group-hover:text-white transition-colors">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="font-semibold text-xs text-stone-900 block">
            Continue Shopping
          </span>
          <span className="text-[11px] text-stone-500 mt-0.5">
            Discover more whole-protein recipes &amp; treats
          </span>
        </Link>

        {/* 2. View Order */}
        <Link
          href="/account"
          className="flex flex-col items-center justify-center p-4 rounded-xs border border-stone-200 hover:border-stone-900 bg-stone-50 hover:bg-white text-stone-900 text-center transition-all group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center mb-2 group-hover:bg-stone-900 group-hover:text-white transition-colors">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-semibold text-xs text-stone-900 block">
            View Order &amp; Invoices
          </span>
          <span className="text-[11px] text-stone-500 mt-0.5">
            Track order #{orderNumber} in your member pantry
          </span>
        </Link>

        {/* 3. Manage Subscription */}
        <Link
          href="/subscriptions"
          className="flex flex-col items-center justify-center p-4 rounded-xs border border-emerald-300 hover:border-emerald-800 bg-emerald-50/60 hover:bg-emerald-50 text-emerald-950 text-center transition-all group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-200/80 flex items-center justify-center mb-2 group-hover:bg-emerald-900 group-hover:text-white transition-colors">
            <Repeat className="w-4 h-4 text-emerald-900 group-hover:text-white" />
          </div>
          <span className="font-semibold text-xs text-emerald-950 block">
            Manage Subscription
          </span>
          <span className="text-[11px] text-emerald-800/80 mt-0.5">
            {hasSubscription
              ? 'Adjust rhythm, skip, or swap recurring recipes'
              : 'Explore 10% auto-ship replenishment plans'}
          </span>
        </Link>
      </div>
    </div>
  );
}
