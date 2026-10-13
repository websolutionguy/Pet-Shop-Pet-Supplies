'use client';

import React from 'react';
import { PawPrint, Scale, AlertCircle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { usePetProfile } from '../../providers/PetProfileProvider';
import { petService } from '../../services/petService';
import { BoundaryTransparencyBanner } from '../boundary';
import { FeatureEmptyState } from '../ui/StateFeedback';

interface PetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PetManagerModal({ isOpen, onClose }: PetManagerModalProps) {
  const { pets, selectedPetId, selectPet } = usePetProfile();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Household Companions & Diet Rosters"
      description="Personalizing for your animals ensures routine auto-ship cadences replenish kibble right before the scoop hits bottom."
      maxWidth="xl"
    >
      <div className="space-y-4">
        {pets.length === 0 ? (
          <FeatureEmptyState
            compact={true}
            title="Household companion roster is empty"
            description="No companion animal profiles are registered for this account. Create a profile for your dog or cat to calculate personalized auto-ship cadences based on body weight and feeding guidelines."
            primaryAction={{
              label: 'Explore Provisions Catalog',
              onClick: onClose,
            }}
          />
        ) : (
          pets.map((pet) => (
            <div
              key={pet.id}
              className={`p-4 rounded-xs border transition-colors ${
                selectedPetId === pet.id
                  ? 'border-stone-900 bg-stone-50/60 ring-1 ring-stone-900'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                  <span>{pet.name}</span>
                  <span className="text-xs font-normal text-stone-500">
                    ({pet.breed} · {pet.ageYears} yrs)
                  </span>
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  selectPet(pet.id);
                  onClose();
                }}
                aria-label={`Select ${pet.name} as active companion focus`}
                className={`text-xs px-3 py-2 min-h-[36px] rounded-xs font-medium transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-900 outline-none ${
                  selectedPetId === pet.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                }`}
              >
                {selectedPetId === pet.id ? 'Active Focus' : 'Shop For ' + pet.name}
              </button>
            </div>

            {/* Details */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-stone-600">
              <div className="flex items-center gap-1.5 bg-stone-100/60 p-2 rounded-xs">
                <Scale className="w-3.5 h-3.5 text-stone-500" aria-hidden="true" />
                <span>Weight: <strong className="text-stone-800 font-mono tabular-nums">{pet.weightLbs} lbs</strong></span>
              </div>

              <div className="flex items-center gap-1.5 bg-stone-100/60 p-2 rounded-xs">
                <span className="text-stone-500">Cadence:</span>
                <span>Every <strong className="text-stone-800 font-mono tabular-nums">{pet.calculatedBagCadenceWeeks || petService.calculatePetCadence(pet.weightLbs || 30).recommendedWeeks} weeks</strong></span>
              </div>
            </div>

            {/* Restrictions */}
            {pet.dietaryRestrictions && pet.dietaryRestrictions.length > 0 && (
              <div className="mt-2.5 flex items-start gap-1.5 text-xs text-stone-600">
                <AlertCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Dietary notes: {pet.dietaryRestrictions.join(', ')}</span>
              </div>
            )}

            {pet.notes && (
              <p className="mt-2 text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-xs border border-stone-200/60">
                &ldquo;{pet.notes}&rdquo;
              </p>
            )}
          </div>
        )))}

        <BoundaryTransparencyBanner
          compact={true}
          endpoint="GET /api/pets"
          operation="Household companion animal records & profiles"
        />

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 min-h-[44px] text-xs font-semibold text-stone-800 hover:text-stone-950 uppercase tracking-wider transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-900 outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
