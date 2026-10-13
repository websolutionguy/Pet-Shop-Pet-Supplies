'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export type BuilderStep = 1 | 2 | 3;

interface SubscriptionStepProgressProps {
  currentStep: BuilderStep;
  onSelectStep: (step: BuilderStep) => void;
  selectedItemCount: number;
}

export function SubscriptionStepProgress({
  currentStep,
  onSelectStep,
  selectedItemCount,
}: SubscriptionStepProgressProps) {
  const steps = [
    {
      step: 1 as BuilderStep,
      title: 'Companion & Needs',
      subtitle: 'Species & pantry categories',
    },
    {
      step: 2 as BuilderStep,
      title: 'Select Provisions',
      subtitle: `${selectedItemCount} recipe${selectedItemCount !== 1 ? 's' : ''} in routine`,
    },
    {
      step: 3 as BuilderStep,
      title: 'Rhythm & Review',
      subtitle: 'Cadence & auto-ship savings',
    },
  ];

  return (
    <div className="bg-white border-b border-stone-200 py-3.5 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between sm:justify-center gap-3 sm:gap-10">
        {steps.map((s, idx) => {
          const isActive = currentStep === s.step;
          const isDone = currentStep > s.step;
          const isAccessible = s.step === 1 || (s.step === 2 && true) || (s.step === 3 && selectedItemCount > 0);

          return (
            <React.Fragment key={s.step}>
              {idx > 0 && (
                <div
                  className={cn(
                    'hidden sm:block h-px w-10 sm:w-16 transition-colors',
                    isDone ? 'bg-emerald-800' : 'bg-stone-200'
                  )}
                  aria-hidden="true"
                />
              )}

              <button
                type="button"
                disabled={!isAccessible}
                onClick={() => onSelectStep(s.step)}
                className={cn(
                  'flex items-center gap-2.5 text-left transition-all cursor-pointer group disabled:cursor-not-allowed disabled:opacity-50',
                  isActive && 'text-stone-900',
                  !isActive && isDone && 'text-stone-700 hover:text-stone-900',
                  !isActive && !isDone && 'text-stone-400'
                )}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all shrink-0',
                    isDone
                      ? 'bg-emerald-800 text-white'
                      : isActive
                      ? 'bg-stone-900 text-white ring-2 ring-stone-900 ring-offset-2'
                      : 'bg-stone-100 text-stone-500 border border-stone-300'
                  )}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-3" /> : s.step}
                </div>

                <div className="hidden md:block">
                  <span
                    className={cn(
                      'text-xs font-semibold block leading-tight font-serif',
                      isActive ? 'text-stone-900' : isDone ? 'text-stone-800' : 'text-stone-500'
                    )}
                  >
                    {s.title}
                  </span>
                  <span className="text-[10px] text-stone-500 block font-mono leading-tight">
                    {s.subtitle}
                  </span>
                </div>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
