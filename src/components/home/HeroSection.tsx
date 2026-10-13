'use client';

import React from 'react';
import Image from 'next/image';
import { ArrowRight, Repeat, ShieldCheck, Check } from 'lucide-react';
import heroDogImg from '../../assets/images/hero_dog_natural_1790396014202.jpg';
import { Button } from '../ui/Button';

interface HeroSectionProps {
  onShopEssentialsClick: () => void;
  onBuildSubscriptionClick: () => void;
}

export function HeroSection({
  onShopEssentialsClick,
  onBuildSubscriptionClick,
}: HeroSectionProps) {
  return (
    <section className="relative bg-[#FAF8F5] border-b border-stone-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-18">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Asymmetric Left Editorial Column (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Kicker badge */}
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-3">
              <span className="w-1.5 h-1.5 bg-[#1E3A2F] rounded-full" />
              <span>Independent Nutrition & Provisions</span>
              <span className="text-stone-300">·</span>
              <span className="text-stone-600 font-mono font-normal">Portland, Oregon</span>
            </div>

            {/* Asymmetric Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-normal tracking-tight text-stone-900 leading-[1.08] text-balance">
              Pet essentials, <br />
              <span className="italic font-light text-[#1E3A2F]">on repeat.</span>
            </h1>

            {/* Supporting Copy explaining subscription & reorder naturally */}
            <p className="mt-4 sm:mt-5 text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
              Freshly baked dry food, single-protein treats, and cold-pressed supplements from
              Pacific Northwest ranches. Set your household delivery cadence once, enjoy 10%
              routine savings, and pause or modify anytime with a single click.
            </p>

            {/* CTAs: Primary & Secondary */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={onShopEssentialsClick}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Shop Pet Essentials
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={onBuildSubscriptionClick}
                leftIcon={<Repeat className="w-4 h-4 text-emerald-800" />}
              >
                Build a Subscription
              </Button>
            </div>

            {/* Practical reassuring points (Unboxed, quiet typography) */}
            <div className="mt-8 pt-6 border-t border-stone-200/90 grid grid-cols-3 gap-3 text-xs text-stone-600">
              <div className="space-y-1">
                <span className="font-semibold text-stone-900 block flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-800" />
                  Save 10% Every Order
                </span>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Automatic routine pricing applied to every recurring delivery.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-stone-900 block flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-800" />
                  Oregon Kettle Batches
                </span>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Baked every 21 days for maximum lipid and probiotic viability.
                </p>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-stone-900 block flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-800" />
                  No-Trap Flexibility
                </span>
                <p className="text-[11px] text-stone-500 leading-normal">
                  Skip, reschedule, or cancel instantly with zero phone calls.
                </p>
              </div>
            </div>
          </div>

          {/* Asymmetric Right Visual Block (5 cols on lg) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-4/5 rounded-xs overflow-hidden border border-stone-200 shadow-sm bg-stone-100">
              <Image
                src={heroDogImg}
                alt="Happy trail canine enjoying outdoor exercise with wholesome nutrition"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Editorial Caption Tag */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-3 rounded-xs border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <p className="font-serif font-medium text-stone-900">
                      Jasper · 3-Year German Shorthair
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Fed 14 lb Pasture Venison on a 4-week cadence
                    </p>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-900 font-semibold bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                    Auto-Ship Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
