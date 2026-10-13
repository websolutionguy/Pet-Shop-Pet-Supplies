'use client';

import React from 'react';
import { PawPrint, SlidersHorizontal } from 'lucide-react';
import { usePetProfile } from '../../providers/PetProfileProvider';

interface PetSwitcherBarProps {
  onOpenManagePets: () => void;
}

export function PetSwitcherBar({ onOpenManagePets }: PetSwitcherBarProps) {
  const { pets, selectedPetId, selectPet } = usePetProfile();

  return (
    <div className="bg-stone-100 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <PawPrint className="w-4 h-4 text-stone-600" />
          <span className="font-medium text-stone-700">Household Profiles:</span>

          <div className="flex items-center gap-1.5 ml-1">
            <button
              type="button"
              onClick={() => selectPet('all')}
              className={`px-2.5 py-1 rounded-xs transition-colors font-medium ${
                selectedPetId === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
              }`}
            >
              All Provisions
            </button>

            {pets.map((pet) => (
              <button
                key={pet.id}
                type="button"
                onClick={() => selectPet(pet.id)}
                className={`px-2.5 py-1 rounded-xs transition-colors flex items-center gap-1.5 font-medium ${
                  selectedPetId === pet.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300'
                }`}
              >
                <span>{pet.name}</span>
                <span
                  className={`text-[10px] ${
                    selectedPetId === pet.id ? 'text-stone-300' : 'text-stone-400'
                  }`}
                >
                  ({pet.species === 'dog' ? 'Canine' : 'Feline'})
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/account/pets"
            className="text-stone-600 hover:text-stone-900 flex items-center gap-1 text-[11px] font-medium transition-colors underline-offset-2 hover:underline"
          >
            <span>Manage Companions</span>
          </a>
          <span className="text-stone-300" aria-hidden="true">·</span>
          <button
            type="button"
            onClick={onOpenManagePets}
            className="text-stone-600 hover:text-stone-900 flex items-center gap-1 text-[11px] font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3 h-3" />
            <span>Dietary Notes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
