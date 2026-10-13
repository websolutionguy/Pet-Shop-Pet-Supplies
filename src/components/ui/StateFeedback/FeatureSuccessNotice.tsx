'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, X } from 'lucide-react';

interface FeatureSuccessNoticeProps {
  title?: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  onDismiss?: () => void;
  compact?: boolean;
  className?: string;
}

export function FeatureSuccessNotice({
  title = 'Success',
  message,
  actionHref,
  actionLabel,
  onActionClick,
  onDismiss,
  compact = false,
  className = '',
}: FeatureSuccessNoticeProps) {
  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`p-3 bg-emerald-50/90 border border-emerald-300/80 rounded-xs text-xs text-emerald-950 flex items-start justify-between gap-3 ${className}`}
      >
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <span className="font-semibold block font-mono text-[11px] uppercase tracking-wider text-emerald-900">
              {title}
            </span>
            <p className="mt-0.5 text-emerald-800 leading-relaxed font-sans">{message}</p>
            {(actionHref || onActionClick) && (
              <div className="mt-1.5">
                {actionHref ? (
                  <Link
                    href={actionHref}
                    className="font-mono text-[11px] font-semibold text-emerald-950 underline underline-offset-4 hover:text-emerald-700 inline-flex items-center gap-1"
                  >
                    <span>{actionLabel || 'View details'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={onActionClick}
                    className="font-mono text-[11px] font-semibold text-emerald-950 underline underline-offset-4 hover:text-emerald-700 cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>{actionLabel || 'View details'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-emerald-600 hover:text-emerald-900 p-1 rounded-xs transition-colors cursor-pointer shrink-0"
            aria-label="Dismiss notice"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`p-6 sm:p-8 bg-emerald-50/60 border border-emerald-200/90 rounded-xs text-center flex flex-col items-center justify-center space-y-3 max-w-xl mx-auto my-6 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-2xs">
        <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
      </div>

      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100/90 border border-emerald-300 px-2.5 py-0.5 rounded-xs">
        {title}
      </span>

      <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-900 tracking-tight">
        Completed Successfully
      </h3>

      <p className="text-xs sm:text-sm text-stone-700 max-w-md mx-auto leading-relaxed">
        {message}
      </p>

      {(actionHref || onActionClick) && (
        <div className="pt-2">
          {actionHref ? (
            <Link
              href={actionHref}
              className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xs text-xs font-mono font-semibold transition-colors inline-flex items-center gap-1.5"
            >
              <span>{actionLabel || 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onActionClick}
              className="px-4 py-2 bg-emerald-900 hover:bg-emerald-800 text-white rounded-xs text-xs font-mono font-semibold transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>{actionLabel || 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
