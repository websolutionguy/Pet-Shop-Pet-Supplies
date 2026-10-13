'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Repeat, Check, ArrowRight, PauseCircle } from 'lucide-react';
import { SubscriptionSchedule } from '../../types/subscription';
import { subscriptionService } from '../../services/subscriptionService';
import { CADENCE_OPTIONS } from '../../lib/constants';
import { formatCurrency, formatHumanDate } from '../../lib/utils';
import { ProductCadence } from '../../types/product';

export function ReorderScheduleCard() {
  const [schedule, setSchedule] = useState<SubscriptionSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    async function loadSchedule() {
      try {
        const subs = await subscriptionService.getByCustomerId('cust-eleanor-vance');
        if (subs.length > 0) {
          setSchedule(subs[0]);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadSchedule();
  }, []);

  const handleSkip = async () => {
    if (!schedule) return;
    try {
      const updated = await subscriptionService.skipNextShipment(schedule.id);
      setSchedule({ ...updated });
      setActionNotice(`Next shipment safely deferred to ${formatHumanDate(updated.nextShipmentDate)}.`);
      setTimeout(() => setActionNotice(null), 4000);
    } catch {
      setActionNotice('Unable to skip shipment.');
    }
  };

  const handleCadenceChange = async (newCadence: ProductCadence) => {
    if (!schedule) return;
    try {
      const updated = await subscriptionService.updateCadence(schedule.id, newCadence);
      setSchedule({ ...updated });
      setActionNotice(`Delivery cadence updated to ${CADENCE_OPTIONS[newCadence]?.label || newCadence}.`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch {
      setActionNotice('Unable to update cadence.');
    }
  };

  const handlePause = async () => {
    if (!schedule) return;
    const newStatus = schedule.status === 'active' ? 'paused' : 'active';
    try {
      const updated = await subscriptionService.updateStatus(schedule.id, newStatus);
      setSchedule({ ...updated });
      setActionNotice(newStatus === 'paused' ? 'Routine paused until you choose to resume.' : 'Routine successfully resumed!');
      setTimeout(() => setActionNotice(null), 3500);
    } catch {
      setActionNotice('Status update failed.');
    }
  };

  if (isLoading || !schedule) return null;

  return (
    <div id="reorder" className="bg-stone-50 border border-stone-200 rounded-xs p-6 mb-12">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold">
              Active Routine Auto-Ship
            </span>
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded-xs font-medium ${
              schedule.status === 'active' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
            }`}>
              {schedule.status === 'active' ? 'Active Routine' : 'Temporarily Paused'}
            </span>
          </div>

          <h3 className="mt-1 text-lg font-serif font-semibold text-stone-900">
            Barnaby’s Monthly Nutrition & Chews
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Next oven run scheduled for dispatch on{' '}
            <strong className="text-stone-900 font-mono">{formatHumanDate(schedule.nextShipmentDate)}</strong>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cadence dropdown */}
          <div className="flex items-center gap-1.5 text-xs bg-white border border-stone-200 px-3 py-1.5 rounded-xs">
            <Repeat className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-stone-500">Cadence:</span>
            <select
              value={schedule.cadence}
              onChange={(e) => handleCadenceChange(e.target.value as ProductCadence)}
              className="bg-transparent font-medium text-stone-900 focus:outline-none cursor-pointer"
            >
              {(Object.keys(CADENCE_OPTIONS) as ProductCadence[]).map((cad) => (
                <option key={cad} value={cad}>
                  {CADENCE_OPTIONS[cad]?.label || cad}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleSkip}
            className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-xs transition-colors cursor-pointer"
          >
            Skip Next Cycle
          </button>

          <button
            type="button"
            onClick={handlePause}
            className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 transition-colors"
          >
            <PauseCircle className="w-3.5 h-3.5" />
            <span>{schedule.status === 'active' ? 'Pause' : 'Resume'}</span>
          </button>
        </div>
      </div>

      {/* Action feedback message */}
      {actionNotice && (
        <div className="mt-3 py-2 px-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 rounded-xs flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-700" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Items in routine cycle */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedule.items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-3.5 rounded-xs border border-stone-200/90 flex items-center justify-between gap-3"
          >
            <div>
              <div className="text-xs font-semibold text-stone-900">
                {item.quantity}× {item.productName}
              </div>
              <div className="text-[11px] text-stone-500 mt-0.5">
                {item.variantName} · For {item.petName}
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="font-mono text-xs font-semibold text-stone-900 tabular-nums">
                {formatCurrency(item.discountedPrice * item.quantity)}
              </div>
              <div className="text-[10px] text-emerald-800 font-medium">
                10% routine rate
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Routine summary footer */}
      <div className="mt-4 pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-600 gap-2">
        <div className="flex items-center gap-4">
          <div>
            Cycle Total:{' '}
            <strong className="text-stone-900 font-mono tabular-nums">
              {formatCurrency(schedule.cycleTotal)}
            </strong>
          </div>
          <div className="text-emerald-800 font-medium">
            (Saves {formatCurrency(schedule.cycleDiscount)} every delivery)
          </div>
        </div>

        <div className="text-stone-500 text-[11px] flex items-center gap-1">
          <Calendar className="w-3 h-3 text-stone-400" />
          <span>Dispatches from Portland bakehouse to {schedule.shippingAddress.city}, {schedule.shippingAddress.state}</span>
        </div>
      </div>
    </div>
  );
}
