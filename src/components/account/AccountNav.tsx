'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  ShoppingBag,
  Repeat,
  Heart,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import { CustomerProfile } from '../../types/customer';
import { cn, formatCurrency } from '../../lib/utils';

interface AccountNavProps {
  customer?: CustomerProfile | null;
}

export function AccountNav({ customer }: AccountNavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Account Overview',
      href: '/account',
      icon: User,
      active: pathname === '/account',
    },
    {
      label: 'Order History',
      href: '/account/orders',
      icon: ShoppingBag,
      active: pathname === '/account/orders',
    },
    {
      label: 'Auto-Ship Subscriptions',
      href: '/account/subscriptions',
      icon: Repeat,
      active: pathname === '/account/subscriptions',
    },
    {
      label: 'Companion Pets',
      href: '/account/pets',
      icon: Heart,
      active: pathname === '/account/pets',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Consumer Welcome Card */}
      <div className="bg-stone-900 text-stone-100 rounded-xs p-6 sm:p-7 border border-stone-800 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-900/80 border border-emerald-700/80 text-emerald-300 flex items-center justify-center font-serif text-lg font-semibold shrink-0">
              {customer?.firstName ? customer.firstName.charAt(0) : 'E'}
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pantry Member</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-normal text-white tracking-tight">
                Welcome back, {customer?.firstName || 'Eleanor'}
              </h1>
              <p className="text-xs text-stone-400 font-mono">
                {customer?.email || 'eleanor.vance@pacifictrail.org'} · Member since April 2023
              </p>
            </div>
          </div>

          {/* Member Benefits Snapshot */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-stone-800 text-xs font-mono">
            <div className="p-3 bg-stone-800/80 rounded-xs border border-stone-700/80 space-y-0.5">
              <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                Auto-Ship Savings
              </span>
              <span className="text-emerald-400 font-bold text-sm tabular-nums">
                {formatCurrency(customer?.totalSavedWithSubscriptions || 142.8)}
              </span>
            </div>

            <div className="p-3 bg-stone-800/80 rounded-xs border border-stone-700/80 space-y-0.5">
              <span className="text-[10px] text-stone-400 block uppercase tracking-wider">
                Companion Roster
              </span>
              <span className="text-white font-bold text-sm">
                {customer?.pets?.length || 2} Companions
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Pills */}
      <nav
        aria-label="Account Navigation"
        className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-200 scrollbar-none"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-xs text-xs font-medium whitespace-nowrap transition-colors border',
                item.active
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 border-stone-200/90'
              )}
            >
              <Icon className={cn('w-3.5 h-3.5', item.active ? 'text-emerald-400' : 'text-stone-500')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
