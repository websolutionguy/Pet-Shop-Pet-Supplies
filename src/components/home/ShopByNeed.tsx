'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight, Sparkles, Package } from 'lucide-react';
import { cn } from '../../lib/utils';
import kibbleImg from '../../assets/images/product_venison_kibble_1790396027749.jpg';

export interface ShopByNeedProps {
  onSelectNeed: (needSlug: string) => void;
  className?: string;
}

const SECONDARY_NEEDS = [
  {
    id: 'treats',
    title: 'Treat Time & Chews',
    subtitle: '100% grass-fed yak cheese bars, single-ingredient duck liver, and recall morsels.',
    highlight: 'Zero Rawhide',
    slug: 'treats',
    num: '02',
  },
  {
    id: 'fresh-litter',
    title: 'Natural Timber Litter',
    subtitle: 'Reclaimed fir and cedar wood fibers with non-toxic ammonia neutralization.',
    highlight: '99% Dust-Free',
    slug: 'litter',
    num: '03',
  },
  {
    id: 'grooming',
    title: 'Grooming & Skin Barrier',
    subtitle: 'Micro-milled colloidal oatmeal, wild salmon oil, and boar bristle grooming tools.',
    highlight: 'Cold-Pressed',
    slug: 'grooming',
    num: '04',
  },
  {
    id: 'walks-travel',
    title: 'Leashes & Travel Gear',
    subtitle: 'English bridle leather leads, beeswaxed canvas bowls, and solid brass hardware.',
    highlight: 'Solid Brass',
    slug: 'gear',
    num: '05',
  },
];

export function ShopByNeed({ onSelectNeed, className }: ShopByNeedProps) {
  return (
    <section className={cn('bg-[#FAF8F5] border-b border-stone-200 py-12 sm:py-16 lg:py-20', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-1.5 font-sans">
              Care By Category
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-stone-900 tracking-tight">
              Curated by Biological Need
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-xl">
              From dawn feedings to evening dental chews, select provisions formulated for every stage of your companion’s day.
            </p>
          </div>

          <span className="text-xs text-stone-500 font-mono hidden md:inline">
            5 Core Disciplines
          </span>
        </div>

        {/* Asymmetric Category Composition (Featured Lead Discipline + 4-Item Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Primary Lead Feature: Daily Nutrition Foundation (5 cols) */}
          <div
            onClick={() => onSelectNeed('food')}
            className="lg:col-span-5 bg-white border border-stone-200/90 rounded-xs p-6 sm:p-8 flex flex-col justify-between shadow-2xs hover:border-stone-400 transition-colors cursor-pointer group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200 font-semibold uppercase tracking-wider">
                  Cornerstone Discipline · 21-Day Roasts
                </span>
                <span className="font-mono text-stone-400 font-bold">01</span>
              </div>

              <div className="relative aspect-4/3 w-full bg-stone-100 rounded-xs overflow-hidden border border-stone-200">
                <Image
                  src={kibbleImg}
                  alt="Small-batch pasture venison kibble with ancient grains"
                  fill
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 42vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h3 className="font-serif text-2xl font-normal text-stone-900 group-hover:text-emerald-950 transition-colors">
                  Daily Food &amp; Ancient Grains
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Small-batch kettle-roasted kibble, novel red meats, and biological broths formulated without industrial poultry commodity fillers or degraded fats.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono font-semibold text-stone-900">
              <span>Explore 21-Day Roasts</span>
              <ArrowRight className="w-4 h-4 text-emerald-800 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Secondary Disciplines: 2x2 Grid (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SECONDARY_NEEDS.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNeed(item.slug)}
                className="group bg-white border border-stone-200/90 rounded-xs p-5 hover:border-stone-400 transition-colors cursor-pointer flex flex-col justify-between shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                    <span className="font-mono text-[10px] text-stone-700 bg-stone-100 px-2 py-0.5 rounded-xs border border-stone-200 font-medium">
                      {item.highlight}
                    </span>
                    <span className="font-mono text-stone-400">{item.num}</span>
                  </div>

                  <h3 className="font-serif text-lg font-normal text-stone-900 group-hover:text-emerald-950 transition-colors">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-stone-700 group-hover:text-stone-950">
                  <span>Browse Provisions</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
