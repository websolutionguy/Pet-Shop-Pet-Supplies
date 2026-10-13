'use client';

import React, { useState } from 'react';
import { X, PawPrint, Check } from 'lucide-react';
import { PetProfile, PetSpecies, PetSize } from '../../types/pet';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface PetProfileFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (petData: Omit<PetProfile, 'id' | 'customerId'>) => void;
  initialPet?: PetProfile | null;
}

const COMMON_DIET_TAGS = [
  'Poultry-Free',
  'Grain-Free',
  'Ancient Grains',
  'Sensitive Digestion',
  'Seafood & Omega Rich',
  'High-Protein Active',
  'Weight Care',
  'Joint & Mobility Support',
  'Raw / Dehydrated Lover',
  'Single Protein Source',
];

interface FormInnerProps {
  initialPet?: PetProfile | null;
  onClose: () => void;
  onSave: (petData: Omit<PetProfile, 'id' | 'customerId'>) => void;
}

function PetProfileFormInner({ initialPet, onClose, onSave }: FormInnerProps) {
  const [name, setName] = useState(initialPet?.name || '');
  const [species, setSpecies] = useState<PetSpecies>(initialPet?.species || 'dog');
  const [breed, setBreed] = useState(initialPet?.breed || '');
  const [ageYears, setAgeYears] = useState(initialPet?.ageYears ?? 3);
  const [size, setSize] = useState<PetSize>(initialPet?.size || 'medium');
  const [weightLbs, setWeightLbs] = useState<number>(initialPet?.weightLbs || 30);
  const [dietPreferences, setDietPreferences] = useState<string[]>(
    initialPet?.dietPreferences || initialPet?.dietaryRestrictions || ['Poultry-Free']
  );
  const [customTag, setCustomTag] = useState('');
  const [notes, setNotes] = useState(initialPet?.notes || '');
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (tag: string) => {
    setDietPreferences((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTag.trim()) return;
    if (!dietPreferences.includes(customTag.trim())) {
      setDietPreferences((prev) => [...prev, customTag.trim()]);
    }
    setCustomTag('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name for your companion.');
      return;
    }

    onSave({
      name: name.trim(),
      species,
      breed: breed.trim() || (species === 'dog' ? 'Mixed Breed' : 'Domestic Shorthair'),
      ageYears: Number(ageYears) || 1,
      size,
      weightLbs: Number(weightLbs) || (size === 'small' ? 15 : size === 'large' ? 65 : 35),
      dietaryRestrictions: dietPreferences,
      dietPreferences,
      favoriteProductIds: initialPet?.favoriteProductIds || [],
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="relative bg-white w-full max-w-xl rounded-xs border border-stone-200 shadow-2xl z-10 overflow-hidden my-8">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
        <div className="flex items-center gap-2">
          <PawPrint className="w-5 h-5 text-emerald-900" />
          <h3 className="font-serif font-semibold text-stone-900 text-base">
            {initialPet ? `Edit ${initialPet.name}'s Profile` : 'Add a New Companion'}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
          aria-label="Close form"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xs text-xs text-red-800">
            {error}
          </div>
        )}

        {/* Row 1: Name & Species */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 block mb-1 font-mono">
              Companion Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Max, Barnaby, Luna"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xs text-xs text-stone-900 focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 block mb-1 font-mono">
              Companion Species
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['dog', 'cat', 'small-pets'] as PetSpecies[]).map((sp) => (
                <button
                  key={sp}
                  type="button"
                  onClick={() => setSpecies(sp)}
                  className={cn(
                    'py-2 px-2 text-center text-xs rounded-xs border transition-colors cursor-pointer capitalize font-medium',
                    species === sp
                      ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                  )}
                >
                  {sp === 'small-pets' ? 'Small Pet' : sp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Breed & Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 block mb-1 font-mono">
              Breed / Heritage
            </label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="e.g. Golden Retriever, Tabby, Lop"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xs text-xs text-stone-900 focus:outline-none focus:border-stone-900"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 block mb-1 font-mono">
              Age: {ageYears} yr{ageYears !== 1 ? 's' : ''}
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={ageYears}
              onChange={(e) => setAgeYears(Number(e.target.value))}
              className="w-full accent-stone-900 cursor-pointer"
            />
          </div>
        </div>

        {/* Row 3: Size Category */}
        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 block mb-1 font-mono">
            Size Category
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'small', label: 'Small', desc: '< 25 lbs' },
              { id: 'medium', label: 'Medium', desc: '25–55 lbs' },
              { id: 'large', label: 'Large', desc: '55–90 lbs' },
              { id: 'giant', label: 'Giant', desc: '90+ lbs' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSize(s.id as PetSize)}
                className={cn(
                  'p-2 text-center rounded-xs border transition-colors cursor-pointer',
                  size === s.id
                    ? 'border-emerald-900 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-900'
                    : 'border-stone-200 bg-stone-50/70 text-stone-700 hover:border-stone-300'
                )}
              >
                <span className="text-xs block leading-tight">{s.label}</span>
                <span className="text-[10px] text-stone-500 font-mono block leading-tight">
                  {s.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 4: Diet Preferences */}
        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 block mb-1 font-mono">
            Diet Preferences & Sourcing Needs
          </label>
          <p className="text-[11px] text-stone-500 mb-2">
            Select key requirements so we can curate tailored recipes for your companion.
          </p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {COMMON_DIET_TAGS.map((tag) => {
              const isSelected = dietPreferences.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'text-[11px] px-2.5 py-1 rounded-xs border transition-colors cursor-pointer flex items-center gap-1',
                    isSelected
                      ? 'border-emerald-800 bg-emerald-800 text-white font-medium shadow-xs'
                      : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-3" />}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Tag Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              placeholder="Add custom preference (e.g. No Corn, Duck Only)..."
              className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xs text-xs text-stone-900 focus:outline-none focus:border-stone-900"
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-xs text-xs font-medium cursor-pointer"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* Row 5: Notes */}
        <div>
          <label className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 block mb-1 font-mono">
            Personal Notes & Habits
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Loves salmon treats after morning walks; sensitive to turkey and chicken meal."
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xs text-xs text-stone-900 focus:outline-none focus:border-stone-900"
          />
        </div>

        {/* Form Actions */}
        <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit">
            {initialPet ? 'Save Profile Changes' : 'Create Pet Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export function PetProfileFormModal({
  isOpen,
  onClose,
  onSave,
  initialPet,
}: PetProfileFormModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer" onClick={onClose} />
      <PetProfileFormInner
        key={initialPet ? initialPet.id : 'new-companion'}
        initialPet={initialPet}
        onClose={onClose}
        onSave={onSave}
      />
    </div>
  );
}
