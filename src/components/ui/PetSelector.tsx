'use client';

import React from 'react';
import { PawPrint, Check } from 'lucide-react';
import { PetProfile } from '../../types/pet';
import { cn } from '../../lib/utils';

export interface PetSelectorProps {
  pets: PetProfile[];
  selectedPetId: string;
  onSelectPet: (petId: string) => void;
  showAllOption?: boolean;
  className?: string;
}

export function PetSelector({
  pets,
  selectedPetId,
  onSelectPet,
  showAllOption = true,
  className,
}: PetSelectorProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {showAllOption && (
        <button
          type="button"
          onClick={() => onSelectPet('all')}
          className={cn(
            'px-2.5 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer border',
            selectedPetId === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
          )}
        >
          All Companions
        </button>
      )}

      {pets.map((pet) => {
        const isSelected = selectedPetId === pet.id;
        return (
          <button
            key={pet.id}
            type="button"
            onClick={() => onSelectPet(pet.id)}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer flex items-center gap-1.5 border',
              isSelected
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
            )}
          >
            <PawPrint
              className={cn(
                'w-3 h-3',
                isSelected ? 'text-white' : 'text-stone-400'
              )}
            />
            <span>{pet.name}</span>
            <span
              className={cn(
                'text-[10px] tabular-nums font-mono',
                isSelected ? 'text-stone-300' : 'text-stone-400'
              )}
            >
              ({pet.weightLbs} lb)
            </span>
          </button>
        );
      })}
    </div>
  );
}
