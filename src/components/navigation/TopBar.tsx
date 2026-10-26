import React from 'react';
import { Truck, Clock, Repeat } from 'lucide-react';
import { STORE_HOURS } from '../../lib/constants';

export function TopBar() {
  return (
    <div className="bg-[#1E3A2F] text-stone-200 text-xs py-2 border-b border-[#142720] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

        {/* Usability & Value Message (Non-aggressive, subtle) */}
        <div className="flex items-center gap-2 truncate">
          <Repeat className="w-3.5 h-3.5 text-emerald-300 shrink-0" aria-hidden="true" />
          <span className="font-medium text-white truncate">
            Save time with recurring pet essentials.
          </span>
          <span className="hidden md:inline text-stone-300">
            · Free regional courier on orders over $49
          </span>
        </div>

        {/* Flagship hours & service info */}
        <div className="hidden sm:flex items-center gap-4 text-[11px] text-stone-300 shrink-0">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-stone-400" aria-hidden="true" />
            <span>Portland Flagship: Mon–Sat 9am–7pm</span>
          </div>
          <span className="text-stone-500" aria-hidden="true">|</span>
          <div className="flex items-center gap-1.5">
            <Truck className="w-3 h-3 text-stone-400" aria-hidden="true" />
            <span>Carbon-Neutral Dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
}
