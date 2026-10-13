'use client';

import React, { useRef } from 'react';
import { Calendar, Check } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { ProductCadence } from '../../types/product';
import { CADENCE_OPTIONS } from '../../lib/constants';
import { cn } from '../../lib/utils';

interface FrequencySelectorProps {
  selectedCadence: string;
  cadenceOptions: string[];
  onSelectCadence: (cadence: ProductCadence) => void;
  estimatedDelivery?: string;
  disabled?: boolean;
  className?: string;
}

export function FrequencySelector({
  selectedCadence,
  cadenceOptions,
  onSelectCadence,
  estimatedDelivery,
  disabled = false,
  className,
}: FrequencySelectorProps) {
  const shouldReduceMotion = useReducedMotion();
  const optionsToRender =
    cadenceOptions && cadenceOptions.length > 0
      ? cadenceOptions
      : ['2-weeks', '4-weeks', '6-weeks', '8-weeks'];

  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % optionsToRender.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + optionsToRender.length) % optionsToRender.length;
    } else {
      return;
    }

    const nextCadence = optionsToRender[nextIndex] as ProductCadence;
    onSelectCadence(nextCadence);
    const nextBtn = document.getElementById(`cadence-opt-${nextCadence}`);
    nextBtn?.focus();
  };

  return (
    <div className={cn('space-y-3', className)}>
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <label id="frequency-selector-label" className="text-xs font-semibold uppercase tracking-wider text-stone-900 font-mono">
            Delivery Frequency:
          </label>
          {estimatedDelivery && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-300">
              <Calendar className="w-3 h-3 text-emerald-800" aria-hidden="true" />
              <span>Next delivery: {estimatedDelivery}</span>
            </span>
          )}
        </div>

        {/* Guidance text */}
        <p className="text-xs text-stone-600 italic leading-relaxed">
          &ldquo;Choose a delivery rhythm that matches your pet&apos;s routine.&rdquo;
        </p>
      </div>

      {/* Cadence Selection Grid with smooth animated selection pill */}
      <div
        ref={containerRef}
        className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        role="radiogroup"
        aria-labelledby="frequency-selector-label"
      >
        {optionsToRender.map((cadenceKey, index) => {
          const opt = CADENCE_OPTIONS[cadenceKey as ProductCadence];
          const isSelected = selectedCadence === cadenceKey;

          return (
            <button
              key={cadenceKey}
              id={`cadence-opt-${cadenceKey}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              disabled={disabled}
              onClick={() => onSelectCadence(cadenceKey as ProductCadence)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                'relative p-3 rounded-xs text-left transition-colors cursor-pointer border min-h-[64px] flex flex-col justify-between overflow-hidden focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 outline-none',
                disabled && 'opacity-50 cursor-not-allowed',
                isSelected
                  ? 'border-stone-900 text-stone-900 shadow-2xs font-medium'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
              )}
              aria-label={`Deliver every ${opt ? opt.label : cadenceKey}, ${opt ? opt.description : 'Standard replenishment'}${estimatedDelivery ? `. Next delivery: ${estimatedDelivery}` : ''}${isSelected ? ' (Selected)' : ''}`}
            >
              {/* Animated active backdrop indicator communicating frequency change */}
              {isSelected && (
                <motion.div
                  layoutId="activeCadencePill"
                  className="absolute inset-0 bg-stone-100/90 pointer-events-none -z-0"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 380, damping: 32 }
                  }
                />
              )}

              <div className="relative z-10 flex items-center justify-between w-full" aria-hidden="true">
                <span className="font-mono text-xs font-semibold">
                  {opt ? opt.label : cadenceKey}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                )}
              </div>

              <span className="relative z-10 text-[10px] text-stone-600 font-mono" aria-hidden="true">
                {opt ? opt.description : 'Standard replenishment'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
