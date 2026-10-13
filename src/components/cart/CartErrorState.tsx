'use client';

import React from 'react';
import { AlertCircle, RotateCcw, X } from 'lucide-react';
import { useCart } from '../../providers/CartProvider';

interface CartErrorStateProps {
  message?: string;
  onDismiss?: () => void;
  compact?: boolean;
}

export function CartErrorState({
  message,
  onDismiss,
  compact = false,
}: CartErrorStateProps) {
  const { clearError } = useCart();

  const handleDismiss = () => {
    clearError();
    onDismiss?.();
  };

  return (
    <div
      role="alert"
      className={`p-3.5 bg-red-50 border border-red-200 rounded-xs text-xs text-red-900 flex items-start justify-between gap-3 ${
        compact ? 'mb-3' : 'mb-6 shadow-xs'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block font-mono text-[11px] uppercase tracking-wider">
            Basket Notice
          </span>
          <p className="mt-0.5 text-red-800 leading-relaxed">
            {message || "We couldn't calculate regional delivery or tax estimates for your provisions basket. Please verify your internet connection and try again."}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDismiss}
        className="text-red-500 hover:text-red-800 p-1 rounded-xs transition-colors cursor-pointer shrink-0"
        aria-label="Dismiss error notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
