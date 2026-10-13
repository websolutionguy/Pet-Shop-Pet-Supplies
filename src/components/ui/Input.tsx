'use client';

import React, { forwardRef, useId } from 'react';
import { cn } from '../../lib/utils';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : generatedId);
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = errorId || helperId;

    return (
      <div className="w-full space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-[11px] uppercase tracking-wider font-semibold text-stone-700 font-mono"
          >
            {label}
            {props.required && <span className="text-red-700 ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-stone-400 pointer-events-none" aria-hidden="true">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={cn(
              'w-full bg-white text-stone-900 border border-stone-300 rounded-xs py-2 px-3 text-xs sm:text-sm placeholder:text-stone-400 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-1 transition-colors disabled:bg-stone-50 disabled:text-stone-400',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error && 'border-red-600 focus-visible:ring-red-600 bg-red-50/20',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-stone-400 pointer-events-none" aria-hidden="true">
              {rightIcon}
            </span>
          )}
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

Input.displayName = 'Input';
