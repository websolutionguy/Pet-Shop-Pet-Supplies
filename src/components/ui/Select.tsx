'use client';

import React, { forwardRef, useId } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, children, id, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : generatedId);
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText ? `${selectId}-helper` : undefined;
    const describedBy = errorId || helperId;

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 font-mono"
          >
            {label}
            {props.required && <span className="text-red-700 ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              'w-full appearance-none bg-white text-stone-900 border border-stone-300 rounded-xs py-2 pl-3 pr-8 text-xs sm:text-sm min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 transition-colors cursor-pointer disabled:bg-stone-50 disabled:text-stone-400',
              error && 'border-red-600 focus-visible:ring-red-600 bg-red-50/20',
              className
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown className="w-4 h-4 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
        </div>
        {error ? (
          <p id={errorId} role="alert" className="text-[11px] text-red-700 font-medium flex items-center gap-1 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={helperId} className="text-[11px] text-stone-600 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
