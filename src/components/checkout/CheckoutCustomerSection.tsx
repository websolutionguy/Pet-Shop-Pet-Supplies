'use client';

import React from 'react';
import { User, Mail, Phone, Check } from 'lucide-react';
import { CustomerFormData, CheckoutFormErrors } from '../../types/checkout';
import { cn } from '../../lib/utils';

interface CheckoutCustomerSectionProps {
  data: CustomerFormData;
  onChange: (field: keyof CustomerFormData, value: any) => void;
  errors: CheckoutFormErrors;
}

export function CheckoutCustomerSection({
  data,
  onChange,
  errors,
}: CheckoutCustomerSectionProps) {
  return (
    <section
      aria-labelledby="section-customer-heading"
      className="p-5 sm:p-6 bg-white border border-stone-200/90 rounded-xs shadow-xs"
    >
      <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
        <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-mono font-semibold">
          1
        </span>
        <h2 id="section-customer-heading" className="font-serif text-lg font-semibold text-stone-900">
          Customer Information
        </h2>
      </div>

      <div className="mt-5 space-y-4">
        {/* Email Address */}
        <div>
          <label
            htmlFor="customer-email"
            className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
          >
            Email Address <span className="text-red-700">*</span>
          </label>
          <div className="relative">
            <input
              id="customer-email"
              type="email"
              autoComplete="email"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="e.g. eleanor.vance@pacifictrail.org"
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'customer-email-error' : 'customer-email-hint'}
              className={cn(
                'w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 transition-colors focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none',
                errors.email
                  ? 'border-red-500 focus-visible:ring-red-600 bg-red-50/30'
                  : 'border-stone-300 focus-visible:border-stone-900'
              )}
            />
            <Mail className="w-4 h-4 text-stone-400 absolute right-3 top-3.5 pointer-events-none" aria-hidden="true" />
          </div>
          {errors.email ? (
            <p id="customer-email-error" className="mt-1 text-xs text-red-700 font-medium" role="alert">
              {errors.email}
            </p>
          ) : (
            <p id="customer-email-hint" className="mt-1 text-[11px] text-stone-600 font-mono">
              Dispatch notifications and batch lab reports will be sent here.
            </p>
          )}
        </div>

        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="customer-first-name"
              className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
            >
              First Name <span className="text-red-700">*</span>
            </label>
            <input
              id="customer-first-name"
              type="text"
              autoComplete="given-name"
              value={data.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              placeholder="Eleanor"
              aria-required="true"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? 'customer-first-name-error' : undefined}
              className={cn(
                'w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 transition-colors focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none',
                errors.firstName
                  ? 'border-red-500 focus-visible:ring-red-600 bg-red-50/30'
                  : 'border-stone-300 focus-visible:border-stone-900'
              )}
            />
            {errors.firstName && (
              <p id="customer-first-name-error" className="mt-1 text-xs text-red-700 font-medium" role="alert">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="customer-last-name"
              className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
            >
              Last Name <span className="text-red-700">*</span>
            </label>
            <input
              id="customer-last-name"
              type="text"
              autoComplete="family-name"
              value={data.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              placeholder="Vance"
              aria-required="true"
              aria-invalid={Boolean(errors.lastName)}
              aria-describedby={errors.lastName ? 'customer-last-name-error' : undefined}
              className={cn(
                'w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 transition-colors focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none',
                errors.lastName
                  ? 'border-red-500 focus-visible:ring-red-600 bg-red-50/30'
                  : 'border-stone-300 focus-visible:border-stone-900'
              )}
            />
            {errors.lastName && (
              <p id="customer-last-name-error" className="mt-1 text-xs text-red-700 font-medium" role="alert">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="customer-phone"
            className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
          >
            Contact Phone <span className="text-red-700">*</span>
          </label>
          <div className="relative">
            <input
              id="customer-phone"
              type="tel"
              autoComplete="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="(503) 555-0192"
              aria-required="true"
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? 'customer-phone-error' : 'customer-phone-hint'}
              className={cn(
                'w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 transition-colors focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none',
                errors.phone
                  ? 'border-red-500 focus-visible:ring-red-600 bg-red-50/30'
                  : 'border-stone-300 focus-visible:border-stone-900'
              )}
            />
            <Phone className="w-4 h-4 text-stone-400 absolute right-3 top-3.5 pointer-events-none" aria-hidden="true" />
          </div>
          {errors.phone ? (
            <p id="customer-phone-error" className="mt-1 text-xs text-red-700 font-medium" role="alert">
              {errors.phone}
            </p>
          ) : (
            <p id="customer-phone-hint" className="mt-1 text-[11px] text-stone-600 font-mono">
              Used strictly for courier gate access or delivery updates.
            </p>
          )}
        </div>

        {/* Newsletter Opt-in */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-700 focus-within:ring-2 focus-within:ring-stone-900 rounded-xs">
            <input
              type="checkbox"
              checked={data.subscribeNewsletter}
              onChange={(e) => onChange('subscribeNewsletter', e.target.checked)}
              className="mt-0.5 rounded-xs border-stone-300 accent-stone-900 cursor-pointer"
            />
            <span>
              Notify me of seasonal small-batch harvests and companion nutrition guides.
            </span>
          </label>
        </div>
      </div>
    </section>
  );
}
