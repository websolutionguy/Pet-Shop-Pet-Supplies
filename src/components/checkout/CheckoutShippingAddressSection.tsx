'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { ShippingAddressFormData, CheckoutFormErrors } from '../../types/checkout';
import { cn } from '../../lib/utils';

interface CheckoutShippingAddressSectionProps {
  data: ShippingAddressFormData;
  onChange: (field: keyof ShippingAddressFormData, value: any) => void;
  errors: CheckoutFormErrors;
}

const US_STATES = [
  { code: 'OR', name: 'Oregon' },
  { code: 'WA', name: 'Washington' },
  { code: 'CA', name: 'California' },
  { code: 'ID', name: 'Idaho' },
  { code: 'MT', name: 'Montana' },
  { code: 'CO', name: 'Colorado' },
  { code: 'NV', name: 'Nevada' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'UT', name: 'Utah' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'TX', name: 'Texas' },
  { code: 'NY', name: 'New York' },
  { code: 'IL', name: 'Illinois' },
];

export function CheckoutShippingAddressSection({
  data,
  onChange,
  errors,
}: CheckoutShippingAddressSectionProps) {
  return (
    <section
      aria-labelledby="section-shipping-heading"
      className="p-5 sm:p-6 bg-white border border-stone-200/90 rounded-xs shadow-xs"
    >
      <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
        <span className="w-6 h-6 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-mono font-semibold">
          2
        </span>
        <h2 id="section-shipping-heading" className="font-serif text-lg font-semibold text-stone-900">
          Shipping Address
        </h2>
      </div>

      <div className="mt-5 space-y-4">
        {/* Recipient Full Name */}
        <div>
          <label
            htmlFor="shipping-full-name"
            className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
          >
            Recipient Name <span className="text-stone-400 font-normal">(Optional if same as customer)</span>
          </label>
          <input
            id="shipping-full-name"
            type="text"
            value={data.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="Eleanor Vance"
            className="w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border border-stone-300 rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 focus:bg-white transition-colors"
          />
        </div>

        {/* Street Line 1 */}
        <div>
          <label
            htmlFor="shipping-street"
            className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
          >
            Street Address <span className="text-red-700">*</span>
          </label>
          <div className="relative">
            <input
              id="shipping-street"
              type="text"
              autoComplete="street-address"
              value={data.streetLine1}
              onChange={(e) => onChange('streetLine1', e.target.value)}
              placeholder="e.g. 2841 NW Cumberland Rd"
              aria-required="true"
              aria-invalid={Boolean(errors.streetLine1)}
              aria-describedby={errors.streetLine1 ? 'shipping-street-error' : undefined}
              className={cn(
                'w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 transition-colors focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none',
                errors.streetLine1
                  ? 'border-red-500 focus-visible:ring-red-600 bg-red-50/30'
                  : 'border-stone-300 focus-visible:border-stone-900'
              )}
            />
            <MapPin className="w-4 h-4 text-stone-400 absolute right-3 top-3.5 pointer-events-none" aria-hidden="true" />
          </div>
          {errors.streetLine1 && (
            <p id="shipping-street-error" className="mt-1 text-xs text-red-700 font-medium" role="alert">
              {errors.streetLine1}
            </p>
          )}
        </div>

        {/* Street Line 2 (Apt / Suite / Unit) */}
        <div>
          <label
            htmlFor="shipping-street-2"
            className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
          >
            Apartment, Suite, Unit <span className="text-stone-500 font-normal">(Optional)</span>
          </label>
          <input
            id="shipping-street-2"
            type="text"
            value={data.streetLine2}
            onChange={(e) => onChange('streetLine2', e.target.value)}
            placeholder="e.g. Apt 4B, Building 2"
            className="w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border border-stone-300 rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none transition-colors"
          />
        </div>

        {/* City, State, ZIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="shipping-city"
              className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
            >
              City <span className="text-red-700">*</span>
            </label>
            <input
              id="shipping-city"
              type="text"
              autoComplete="address-level2"
              value={data.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="Portland"
              aria-required="true"
              aria-invalid={Boolean(errors.city)}
              aria-describedby={errors.city ? 'shipping-city-error' : undefined}
              className={cn(
                'w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 transition-colors focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none',
                errors.city
                  ? 'border-red-500 focus-visible:ring-red-600 bg-red-50/30'
                  : 'border-stone-300 focus-visible:border-stone-900'
              )}
            />
            {errors.city && (
              <p id="shipping-city-error" className="mt-1 text-xs text-red-700 font-medium" role="alert">
                {errors.city}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="shipping-state"
              className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
            >
              State <span className="text-red-700">*</span>
            </label>
            <select
              id="shipping-state"
              autoComplete="address-level1"
              value={data.state}
              onChange={(e) => onChange('state', e.target.value)}
              aria-required="true"
              aria-invalid={Boolean(errors.state)}
              aria-describedby={errors.state ? 'shipping-state-error' : undefined}
              className={cn(
                'w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border rounded-xs text-base sm:text-xs text-stone-900 transition-colors cursor-pointer focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none',
                errors.state
                  ? 'border-red-500 focus-visible:ring-red-600 bg-red-50/30'
                  : 'border-stone-300 focus-visible:border-stone-900'
              )}
            >
              <option value="">Select State</option>
              {US_STATES.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
            {errors.state && (
              <p id="shipping-state-error" className="mt-1 text-xs text-red-700 font-medium" role="alert">
                {errors.state}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="shipping-zip"
              className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
            >
              ZIP Code <span className="text-red-700">*</span>
            </label>
            <input
              id="shipping-zip"
              type="text"
              autoComplete="postal-code"
              value={data.postalCode}
              onChange={(e) => onChange('postalCode', e.target.value)}
              placeholder="97210"
              aria-required="true"
              aria-invalid={Boolean(errors.postalCode)}
              aria-describedby={errors.postalCode ? 'shipping-zip-error' : undefined}
              className={cn(
                'w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 transition-colors font-mono focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none',
                errors.postalCode
                  ? 'border-red-500 focus-visible:ring-red-600 bg-red-50/30'
                  : 'border-stone-300 focus-visible:border-stone-900'
              )}
            />
            {errors.postalCode && (
              <p id="shipping-zip-error" className="mt-1 text-xs text-red-700 font-medium" role="alert">
                {errors.postalCode}
              </p>
            )}
          </div>
        </div>

        {/* Courier Instructions */}
        <div>
          <label
            htmlFor="shipping-instructions"
            className="block text-xs font-mono uppercase tracking-wider font-semibold text-stone-700 mb-1"
          >
            Delivery Notes for Courier <span className="text-stone-500 font-normal">(Optional)</span>
          </label>
          <input
            id="shipping-instructions"
            type="text"
            value={data.deliveryInstructions}
            onChange={(e) => onChange('deliveryInstructions', e.target.value)}
            placeholder="e.g. Leave under covered front porch behind flower planter"
            className="w-full px-3.5 py-2.5 min-h-[44px] bg-stone-50 border border-stone-300 rounded-xs text-base sm:text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 outline-none transition-colors"
          />
        </div>
      </div>
    </section>
  );
}
