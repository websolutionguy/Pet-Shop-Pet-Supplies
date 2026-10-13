'use client';

import React from 'react';
import Link from 'next/link';
import { PauseCircle, Wrench, ArrowRight } from 'lucide-react';

interface FeatureDisabledNoticeProps {
  title?: string;
  message: string;
  oneTimeAlternativeHref?: string;
  className?: string;
}

export function FeatureDisabledNotice({
  title = 'Program Maintenance',
  message,
  oneTimeAlternativeHref,
  className = '',
}: FeatureDisabledNoticeProps) {
  return (
    <div
      role="status"
      className={`p-4 bg-stone-100 border border-stone-300/80 rounded-xs text-xs text-stone-800 space-y-2 ${className}`}
    >
      <div className="flex items-center gap-2">
        <Wrench className="w-4 h-4 text-stone-600 shrink-0" aria-hidden="true" />
        <span className="font-semibold font-mono text-[11px] uppercase tracking-wider text-stone-900">
          {title}
        </span>
      </div>

      <p className="text-stone-600 text-xs leading-relaxed font-sans">{message}</p>

      {oneTimeAlternativeHref && (
        <div className="pt-1">
          <Link
            href={oneTimeAlternativeHref}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-stone-900 underline underline-offset-4 hover:text-stone-700"
          >
            <span>Order as a standard one-time purchase</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
