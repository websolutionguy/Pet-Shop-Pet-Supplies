'use client';

import React from 'react';
import Link from 'next/link';
import { Ban, Info, ArrowRight } from 'lucide-react';
import { Button } from '../Button';

interface FeatureUnavailableNoticeProps {
  title?: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  compact?: boolean;
  className?: string;
}

export function FeatureUnavailableNotice({
  title = 'Unavailable for Recurring Delivery',
  message,
  actionHref,
  actionLabel,
  onActionClick,
  compact = false,
  className = '',
}: FeatureUnavailableNoticeProps) {
  if (compact) {
    return (
      <div
        role="status"
        className={`p-3 bg-stone-100/90 border border-stone-200/90 rounded-xs text-xs text-stone-700 flex items-start gap-2.5 ${className}`}
      >
        <Ban className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold block font-mono text-[10px] uppercase tracking-wider text-stone-800">
            {title}
          </span>
          <p className="mt-0.5 text-stone-600 leading-relaxed font-sans">{message}</p>
          {(actionHref || onActionClick) && (
            <div className="mt-1.5">
              {actionHref ? (
                <Link
                  href={actionHref}
                  className="font-mono text-[11px] font-semibold text-stone-900 underline underline-offset-4 hover:text-stone-700"
                >
                  {actionLabel || 'Learn more →'}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={onActionClick}
                  className="font-mono text-[11px] font-semibold text-stone-900 underline underline-offset-4 hover:text-stone-700 cursor-pointer"
                >
                  {actionLabel || 'View options'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      role="status"
      className={`p-5 bg-stone-50 border border-stone-200 rounded-xs text-center flex flex-col items-center justify-center space-y-2.5 max-w-md mx-auto ${className}`}
    >
      <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
        <Ban className="w-5 h-5 text-stone-600" aria-hidden="true" />
      </div>

      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-stone-500">
        {title}
      </span>

      <p className="text-xs text-stone-600 max-w-sm leading-relaxed">
        {message}
      </p>

      {(actionHref || onActionClick) && (
        <div className="pt-1">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xs transition-colors"
            >
              <span>{actionLabel || 'Explore Alternatives'}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <Button variant="primary" size="sm" onClick={onActionClick}>
              {actionLabel || 'Explore Alternatives'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
