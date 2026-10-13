'use client';

import React from 'react';
import { PawPrint, Sparkles, Check, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { usePetProfile } from '../../providers/PetProfileProvider';

export interface QuickPetSelectionProps {
  selectedSpecies: string;
  onSelectSpecies: (species: string) => void;
  className?: string;
}

const PET_SHORTCUTS = [
  { id: 'all', label: 'All Companions', subtitle: 'Full pantry collection', count: 32 },
  { id: 'dog', label: 'Dog', subtitle: 'Kibbles, chews & joint care', count: 18 },
  { id: 'cat', label: 'Cat', subtitle: 'Hydration broths & pate', count: 14 },
  { id: 'small-pets', label: 'Small Pet', subtitle: 'Rabbits, guinea pigs & forage', count: 8 },
  { id: 'bird', label: 'Bird', subtitle: 'Seeds, perches & supplements', count: 6 },
  { id: 'fish', label: 'Fish', subtitle: 'Clean flakes & water conditioning', count: 4 },
];

export function QuickPetSelection({
  selectedSpecies,
  onSelectSpecies,
  className,
}: QuickPetSelectionProps) {
  const { selectedPet, pets } = usePetProfile();

  return (
    <section className={cn('bg-white border-b border-stone-200 py-6', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500 font-sans">
              Shopping Shortcut:
            </span>
            <span className="text-xs text-stone-700">
              Filter essential nutrition and care by companion
            </span>
          </div>

          {selectedPet && (
            <div className="text-xs text-stone-600 flex items-center gap-1.5">
              <PawPrint className="w-3.5 h-3.5 text-emerald-800" />
              <span>
                Household Focus: <strong>{selectedPet.name}</strong> ({selectedPet.breed})
              </span>
            </div>
          )}
        </div>

        {/* Shortcut Buttons: Practical shopping tool, not decorative fluffy cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PET_SHORTCUTS.map((item) => {
            const isSelected = selectedSpecies === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectSpecies(item.id)}
                className={cn(
                  'text-left p-3 rounded-xs border transition-all cursor-pointer flex flex-col justify-between min-h-[72px]',
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-stone-50/70 hover:bg-stone-100 hover:border-stone-300 text-stone-800'
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      'font-serif text-sm font-medium',
                      isSelected ? 'text-white' : 'text-stone-900'
                    )}
                  >
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      'font-mono text-[10px] tabular-nums',
                      isSelected ? 'text-stone-300' : 'text-stone-400'
                    )}
                  >
                    {item.count}
                  </span>
                </div>

                <p
                  className={cn(
                    'text-[10px] truncate mt-1',
                    isSelected ? 'text-stone-300' : 'text-stone-500'
                  )}
                >
                  {item.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
