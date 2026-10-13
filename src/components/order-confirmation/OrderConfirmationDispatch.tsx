'use client';

import React from 'react';
import { MapPin, Truck, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { ShippingAddressFormData } from '../../types/checkout';
import { Address } from '../../types/common';
import { DeliveryMethodId, DELIVERY_METHODS } from '../../services/cartService';

interface OrderConfirmationDispatchProps {
  shippingAddress: ShippingAddressFormData | Address;
  deliveryMethodId?: DeliveryMethodId | string;
  placedAt: string;
}

export function OrderConfirmationDispatch({
  shippingAddress,
  deliveryMethodId = 'standard',
  placedAt,
}: OrderConfirmationDispatchProps) {
  const method =
    DELIVERY_METHODS.find((m) => m.id === deliveryMethodId) || DELIVERY_METHODS[0];

  // Calculate estimated dispatch and delivery dates
  const placedDate = new Date(placedAt);
  const dispatchDate = new Date(placedDate.getTime() + 1 * 24 * 60 * 60 * 1000); // +1 day
  const arrivalStart = new Date(
    placedDate.getTime() + (deliveryMethodId === 'express' ? 2 : 3) * 24 * 60 * 60 * 1000
  );
  const arrivalEnd = new Date(
    placedDate.getTime() + (deliveryMethodId === 'express' ? 3 : 5) * 24 * 60 * 60 * 1000
  );

  const formatShort = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const estimatedDeliveryWindow = `${formatShort(arrivalStart)} – ${formatShort(arrivalEnd)}, ${arrivalEnd.getFullYear()}`;

  const address = shippingAddress as any;

  return (
    <div className="bg-white border border-stone-200/90 rounded-xs p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
        <Truck className="w-4 h-4 text-stone-700" />
        <h2 className="font-serif text-lg font-semibold text-stone-900">
          Dispatch &amp; Delivery Information
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-stone-400" />
            <span>Shipping Address</span>
          </div>

          <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-xs text-xs space-y-1 text-stone-700">
            <p className="font-semibold text-stone-900 text-sm">
              {address.fullName || 'Eleanor Vance'}
            </p>
            <p>{address.streetLine1}</p>
            {address.streetLine2 && <p>{address.streetLine2}</p>}
            <p>
              {address.city}, {address.state} {address.postalCode}
            </p>
            <p className="text-stone-500 font-mono text-[11px] pt-1">
              {address.country || 'United States'} {address.phone ? `· ${address.phone}` : ''}
            </p>

            {address.deliveryInstructions && (
              <div className="mt-2 pt-2 border-t border-stone-200 text-[11px] text-stone-600">
                <span className="font-semibold block text-stone-700">Courier Note:</span>
                <p className="italic">&ldquo;{address.deliveryInstructions}&rdquo;</p>
              </div>
            )}
          </div>
        </div>

        {/* Estimated Delivery Information */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>Estimated Delivery Schedule</span>
          </div>

          <div className="p-3.5 bg-stone-50 border border-stone-200/80 rounded-xs text-xs space-y-3">
            <div>
              <span className="text-[11px] text-stone-500 font-mono block">Selected Courier:</span>
              <p className="font-semibold text-stone-900">
                {method.name} ({method.timeframe})
              </p>
            </div>

            <div className="flex items-start gap-2 text-stone-700">
              <Clock className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-stone-500 font-mono block">Estimated Arrival Window:</span>
                <p className="font-semibold text-stone-900">
                  {estimatedDeliveryWindow}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-mono">
              <span className="flex items-center gap-1 text-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Small-batch cold packing prepared</span>
              </span>
              <span>Portland Depot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
