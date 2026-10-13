'use client';

import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import { CURRENT_DATA_SOURCE } from '../../providers/factory';

interface BoundaryTransparencyBannerProps {
  endpoint?: string;
  operation?: string;
  className?: string;
  compact?: boolean;
}

export function BoundaryTransparencyBanner({
  endpoint = 'POST /api/orders',
  operation = 'Order Processing & Payment',
  className = '',
  compact = false,
}: BoundaryTransparencyBannerProps) {
  const isApi = CURRENT_DATA_SOURCE === 'api';

  if (isApi) {
    return (
      <div
        className={`p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xs text-emerald-950 flex items-center gap-2.5 text-xs font-mono ${className}`}
      >
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>Connected to Authoritative REST API ({endpoint})</span>
      </div>
    );
  }

  if (compact) {
    return (
      <div
        className={`px-3 py-1.5 bg-stone-100/90 border border-stone-200 rounded-xs text-stone-600 flex items-center gap-2 text-[11px] font-mono ${className}`}
      >
        <Info className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        <span>
          Frontend Demonstration Mode · Real card processing &amp; recurring billing delegate to backend API ({endpoint}).
        </span>
      </div>
    );
  }

  return (
    <div
      className={`p-4 bg-stone-50 border border-stone-200 rounded-xs text-stone-700 space-y-1.5 ${className}`}
    >
      <div className="flex items-center gap-2 text-stone-900 text-xs font-mono font-semibold uppercase tracking-wider">
        <Info className="w-4 h-4 text-[#1E3A2F]" />
        <span>Frontend Architecture Boundary Notice</span>
      </div>
      <p className="text-xs text-stone-600 leading-relaxed font-sans">
        This is a frontend prototype demonstration. In accordance with system boundary rules,
        client interfaces do not fake payment processing, recurring cron rebilling, or email delivery.
        In production, {operation} is authoritatively handled by the backend REST endpoint:{' '}
        <code className="font-mono text-[11px] bg-stone-200/70 px-1 py-0.5 rounded-xs text-stone-900 font-bold">
          {endpoint}
        </code>.
      </p>
    </div>
  );
}
