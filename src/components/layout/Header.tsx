'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  Repeat,
  RotateCcw,
} from 'lucide-react';
import { TopBar } from '../navigation/TopBar';
import { SearchModal } from '../navigation/SearchModal';
import { AccountModal } from '../navigation/AccountModal';
import { MobileNavDrawer } from '../navigation/MobileNavDrawer';
import { useCart } from '../../providers/CartProvider';
import { usePetProfile } from '../../providers/PetProfileProvider';
import { Product } from '../../types/product';
import { cn, formatCurrency } from '../../lib/utils';

export interface HeaderProps {
  onOpenPetManager?: () => void;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export function Header({
  onOpenPetManager,
  activeFilter = 'all',
  onFilterChange,
  onSelectProduct,
}: HeaderProps) {
  const router = useRouter();
  const { summary, openCart } = useCart();
  const { selectedPet } = usePetProfile();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleNavClick = (filter: string, href: string, e: React.MouseEvent) => {
    if (onFilterChange) {
      e.preventDefault();
      onFilterChange(filter);
    }
  };

  const navLinks = [
    { id: 'all', label: 'Shop', href: '/shop' },
    { id: 'bundles', label: 'Bundles', href: '/bundles' },
    { id: 'journal', label: 'Journal', href: '/journal' },
    { id: 'dog', label: 'Dogs', href: '/shop?pet=dog' },
    { id: 'cat', label: 'Cats', href: '/shop?pet=cat' },
    { id: 'small-pets', label: 'Small Pets', href: '/shop?pet=small-pets' },
    { id: 'food', label: 'Food', href: '/shop?category=food' },
    { id: 'treats', label: 'Treats', href: '/shop?category=treats' },
  ];

  return (
    <>
      {/* 1. Secondary Promotional Bar (Subtle & Usability-Focused) */}
      <TopBar />

      {/* 2. Main Desktop & Mobile Header Bar */}
      <header className="sticky top-0 z-40 bg-stone-50/98 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-2 lg:gap-6">
            {/* Left: Mobile Menu Trigger + Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-700 hover:text-stone-900 rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 cursor-pointer"
                aria-label="Open mobile navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link
                href="/"
                className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded-xs py-1 px-1 -ml-1"
              >
                <span className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors whitespace-nowrap">
                  Rowan & Hound
                </span>
                <span className="hidden sm:block text-[10px] text-stone-500 uppercase tracking-widest font-mono -mt-0.5">
                  Supply Co. · Est. 2018
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links (Sensible hierarchy) */}
            <nav
              className="hidden lg:flex items-center gap-4 xl:gap-5 text-xs xl:text-sm font-medium text-stone-600"
              aria-label="Main Navigation"
            >
              {navLinks.map((link) => {
                const isActive = activeFilter === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => handleNavClick(link.id, link.href, e)}
                    className={cn(
                      'py-1.5 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded-xs',
                      isActive
                        ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                        : 'hover:text-stone-900'
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}

              <span className="h-4 w-px bg-stone-300" aria-hidden="true" />

              {/* Subscriptions Program */}
              <a
                href="/subscriptions"
                onClick={(e) => handleNavClick('subscriptions', '/subscriptions', e)}
                className={cn(
                  'py-1.5 flex items-center gap-1.5 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded-xs',
                  activeFilter === 'subscriptions'
                    ? 'text-emerald-950 font-semibold border-b-2 border-emerald-900'
                    : 'text-stone-700 hover:text-emerald-900'
                )}
              >
                <Repeat className="w-3.5 h-3.5 text-emerald-800" />
                <span>Subscriptions</span>
                <span className="font-mono text-[10px] bg-emerald-100 text-emerald-950 px-1 py-0.2 rounded-xs font-semibold">
                  -10%
                </span>
              </a>

              {/* Quick Reorder Program */}
              <a
                href="/reorder"
                onClick={(e) => handleNavClick('reorder', '/reorder', e)}
                className={cn(
                  'py-1.5 flex items-center gap-1.5 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 rounded-xs',
                  activeFilter === 'reorder'
                    ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                    : 'text-stone-700 hover:text-stone-950'
                )}
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
                <span>Reorder</span>
              </a>
            </nav>

            {/* Right: Search, Account, Cart */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 px-2.5 sm:px-3 text-stone-700 hover:text-stone-950 hover:bg-stone-100 border border-transparent hover:border-stone-200 rounded-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                aria-label="Search provisions catalog"
              >
                <Search className="w-4 h-4" />
                <span className="hidden xl:inline text-xs text-stone-500">Search</span>
              </button>

              {/* Account Trigger */}
              <button
                type="button"
                onClick={() => setIsAccountOpen(true)}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center gap-2 px-2.5 sm:px-3 text-stone-700 hover:text-stone-950 hover:bg-stone-100 border border-transparent hover:border-stone-200 rounded-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
                aria-label="Member account and pantry"
              >
                <User className="w-4 h-4" />
                <span className="hidden xl:inline text-xs text-stone-700 font-medium">
                  {selectedPet ? `Eleanor & ${selectedPet.name}` : 'Account'}
                </span>
              </button>

              {/* Cart Indicator Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="min-h-[44px] inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 active:bg-stone-950 rounded-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 shadow-xs"
                aria-label={`Shopping basket with ${summary.itemCount} ${summary.itemCount === 1 ? 'item' : 'items'}, order subtotal ${formatCurrency(summary.total)}`}
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span className="font-mono tabular-nums text-xs">
                  {summary.itemCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Interactive Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={onSelectProduct}
      />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onOpenPetManager={onOpenPetManager}
        onNavigateToSubscriptions={() => {
          if (onFilterChange) onFilterChange('subscriptions');
          const el = document.getElementById('subscriptions');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        onSelectCategory={(cat) => {
          if (onFilterChange) {
            onFilterChange(cat);
            if (cat === 'subscriptions') {
              const el = document.getElementById('subscriptions');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else if (cat === 'reorder') {
              const el = document.getElementById('reorder');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            } else {
              const el = document.getElementById('catalog');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          } else {
            if (cat === 'subscriptions') {
              router.push('/subscriptions');
            } else if (cat === 'reorder') {
              router.push('/reorder');
            } else if (cat === 'dog' || cat === 'cat' || cat === 'small-pets') {
              router.push(`/shop?pet=${cat}`);
            } else if (cat === 'food' || cat === 'treats' || cat === 'toys') {
              router.push(`/shop?category=${cat}`);
            } else {
              router.push('/shop');
            }
          }
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenPetManager={() => onOpenPetManager?.()}
        activeFilter={activeFilter}
      />
    </>
  );
}
