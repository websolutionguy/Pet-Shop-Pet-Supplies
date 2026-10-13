'use client';

import React from 'react';
import { CreditCard, Lock, ShieldCheck, Info } from 'lucide-react';
import { PaymentFormData, CheckoutFormErrors } from '../../types/checkout';
import { cn } from '../../lib/utils';

interface CheckoutPaymentSectionProps {
  data: PaymentFormData;
  onChange: (field: keyof PaymentFormData, value: any) => void;
  errors: CheckoutFormErrors;
}

export function CheckoutPaymentSection({
  data,
  onChange,
  errors,
}: CheckoutPaymentSectionProps) {
  // Format card number with spaces as user types
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').substring(0, 16);
    const parts = raw.match(/.{1,4}/g) || [];
    onChange('cardNumber', parts.join(' '));
  };

  // Format MM/YY
  const handleExpiryChange = (val: string) => {
    let clean = val.replace(/\D/g, '').substring(0, 4);
    if (clean.length > 2) {
      clean = `${clean.substring(0, 2)}/${clean.substring(2, 4)}`;
    }
    onChange('expiryDate', clean);
  };

  // Format CVC
  const handleCvcChange = (val: string) => {
    const clean = val.replace(/\D/g, '').substring(0, 4);
    onChange('cvc', clean);
  };

  return (
    <section
      aria-labelledby="section-payment-heading"
      className="p-5 sm:p-6 bg-white border border-stone-200/90 rounded-xs shadow-xs"
    >
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-mono font-semibold">
            6
          </span>
          <h2 id="section-payment-heading" className="font-serif text-lg font-semibold text-stone-900">
            Payment Method
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-mono">
          <Lock className="w-3.5 h-3.5 text-emerald-800" />
          <span>256-Bit Encrypted</span>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {/* Prototype Disclosure Banner */}
        <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xs flex items-start gap-2.5 text-xs text-stone-700">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold block font-mono text-[11px] uppercase tracking-wider text-stone-900">
              Frontend Architecture Template
            </span>
            <p className="leading-relaxed text-stone-600">
              Payment gateway endpoints are wired to <code>POST /api/payments</code>. For testing, you may enter any realistic 16-digit card number (e.g. <code>4242 4242 4242 4242</code>, exp: <code>12/28</code>, cvc: <code>123</code>). No actual charges will occur.
            </p>
          </div>
        </div>

        {/* Name on Card */}
        <div>
          <label
            htmlFor="payment-cardholder-name"
            className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
          >
            Name on Card <span className="text-red-700">*</span>
          </label>
          <input
            id="payment-cardholder-name"
            type="text"
            autoComplete="cc-name"
            value={data.cardholderName}
            onChange={(e) => onChange('cardholderName', e.target.value)}
            placeholder="Eleanor Vance"
            aria-required="true"
            aria-invalid={Boolean(errors.cardholderName)}
            aria-describedby={errors.cardholderName ? 'payment-cardholder-error' : undefined}
            className={cn(
              'w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none transition-colors',
              errors.cardholderName
                ? 'border-red-500 focus-visible:ring-red-600 bg-red-50/30'
                : 'border-stone-300 focus-visible:border-stone-900'
            )}
          />
          {errors.cardholderName && (
            <p id="payment-cardholder-error" className="mt-1 text-xs text-red-700 font-medium" role="alert">
              {errors.cardholderName}
            </p>
          )}
        </div>

        {/* Card Number */}
        <div>
          <label
            htmlFor="payment-card-number"
            className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
          >
            Card Number <span className="text-red-700">*</span>
          </label>
          <div className="relative">
            <input
              id="payment-card-number"
              type="text"
              autoComplete="cc-number"
              value={data.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              placeholder="4242 •••• •••• 4242"
              aria-required="true"
              aria-invalid={Boolean(errors.cardNumber)}
              aria-describedby={errors.cardNumber ? 'payment-card-number-error' : undefined}
              className={cn(
                'w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none transition-colors font-mono tracking-wider',
                errors.cardNumber
                  ? 'border-red-500 focus-visible:ring-red-600 bg-red-50/30'
                  : 'border-stone-300 focus-visible:border-stone-900'
              )}
            />
            <CreditCard className="w-4 h-4 text-stone-400 absolute right-3 top-3.5 pointer-events-none" aria-hidden="true" />
          </div>
          {errors.cardNumber && (
            <p id="payment-card-number-error" className="mt-1 text-xs text-red-700 font-medium" role="alert">
              {errors.cardNumber}
            </p>
          )}
        </div>

        {/* Expiry & CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="payment-expiry"
              className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
            >
              Expiration (MM/YY) <span className="text-red-700">*</span>
            </label>
            <input
              id="payment-expiry"
              type="text"
              autoComplete="cc-exp"
              value={data.expiryDate}
              onChange={(e) => handleExpiryChange(e.target.value)}
              placeholder="MM/YY"
              maxLength={5}
              aria-required="true"
              aria-invalid={Boolean(errors.expiryDate)}
              aria-describedby={errors.expiryDate ? 'payment-expiry-error' : undefined}
              className={cn(
                'w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none transition-colors font-mono',
                errors.expiryDate
                  ? 'border-red-500 focus-visible:ring-red-600 bg-red-50/30'
                  : 'border-stone-300 focus-visible:border-stone-900'
              )}
            />
            {errors.expiryDate && (
              <p id="payment-expiry-error" className="mt-1 text-xs text-red-700 font-medium" role="alert">
                {errors.expiryDate}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="payment-cvc"
              className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
            >
              Security Code (CVC) <span className="text-red-700">*</span>
            </label>
            <input
              id="payment-cvc"
              type="password"
              autoComplete="cc-csc"
              value={data.cvc}
              onChange={(e) => handleCvcChange(e.target.value)}
              placeholder="3 or 4 digits"
              maxLength={4}
              aria-required="true"
              aria-invalid={Boolean(errors.cvc)}
              aria-describedby={errors.cvc ? 'payment-cvc-error' : undefined}
              className={cn(
                'w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none transition-colors font-mono',
                errors.cvc
                  ? 'border-red-500 focus-visible:ring-red-600 bg-red-50/30'
                  : 'border-stone-300 focus-visible:border-stone-900'
              )}
            />
            {errors.cvc && (
              <p id="payment-cvc-error" className="mt-1 text-xs text-red-700 font-medium" role="alert">
                {errors.cvc}
              </p>
            )}
          </div>
        </div>

        {/* Billing Address Toggle */}
        <div className="pt-2 border-t border-stone-100">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
            <input
              type="checkbox"
              checked={data.billingSameAsShipping}
              onChange={(e) => onChange('billingSameAsShipping', e.target.checked)}
              className="rounded-xs border-stone-300 accent-stone-900 cursor-pointer"
            />
            <span className="font-medium">
              Billing address matches shipping address
            </span>
          </label>

          {/* Conditional separate billing fields */}
          {!data.billingSameAsShipping && (
            <div className="mt-3 p-3 bg-stone-50 border border-stone-200 rounded-xs space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-600 block">
                Billing Address
              </span>
              <div>
                <input
                  type="text"
                  value={data.billingStreet || ''}
                  onChange={(e) => onChange('billingStreet', e.target.value)}
                  placeholder="Billing Street Address"
                  className={cn(
                    'w-full px-3 py-2 bg-white border rounded-xs text-xs text-stone-900 focus:outline-none',
                    errors.billingStreet ? 'border-red-400' : 'border-stone-300 focus:border-stone-900'
                  )}
                />
                {errors.billingStreet && (
                  <p className="mt-1 text-xs text-red-700">{errors.billingStreet}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="text"
                    value={data.billingCity || ''}
                    onChange={(e) => onChange('billingCity', e.target.value)}
                    placeholder="City"
                    className={cn(
                      'w-full px-3 py-2 bg-white border rounded-xs text-xs text-stone-900 focus:outline-none',
                      errors.billingCity ? 'border-red-400' : 'border-stone-300 focus:border-stone-900'
                    )}
                  />
                  {errors.billingCity && (
                    <p className="mt-1 text-xs text-red-700">{errors.billingCity}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    value={data.billingPostalCode || ''}
                    onChange={(e) => onChange('billingPostalCode', e.target.value)}
                    placeholder="Postal Code"
                    className={cn(
                      'w-full px-3 py-2 bg-white border rounded-xs text-xs text-stone-900 focus:outline-none font-mono',
                      errors.billingPostalCode ? 'border-red-400' : 'border-stone-300 focus:border-stone-900'
                    )}
                  />
                  {errors.billingPostalCode && (
                    <p className="mt-1 text-xs text-red-700">{errors.billingPostalCode}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Reassurance */}
        <div className="pt-2 flex items-center gap-2 text-[11px] text-stone-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
          <span>PCI-DSS Level 1 Compliant Architecture · End-to-End SSL</span>
        </div>
      </div>
    </section>
  );
}
