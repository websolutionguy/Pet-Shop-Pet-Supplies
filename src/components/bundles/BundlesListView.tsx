'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BundleCardEditorial } from './BundleCardEditorial';
import { CuratedBundle } from '../../types/bundle';
import { bundleService } from '../../services/bundleService';
import { Layers } from 'lucide-react';
import {
  FeatureLoadingState,
  FeatureEmptyState,
  FeatureErrorState,
} from '../ui/StateFeedback';

export function BundlesListView() {
  const [bundles, setBundles] = useState<CuratedBundle[]>([]);
  const [selectedPetType, setSelectedPetType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleReload = () => {
    setIsLoading(true);
    setLoadError(null);
    bundleService
      .getBundles()
      .then((res) => setBundles(res))
      .catch(() => setLoadError("We couldn't load the curated bundles right now. Please try again."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    let isMounted = true;
    bundleService
      .getBundles()
      .then((res) => {
        if (isMounted) setBundles(res);
      })
      .catch(() => {
        if (isMounted) setLoadError("We couldn't load the curated bundles right now. Please try again.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filterOptions = [
    { id: 'all', label: 'All Curated Bundles', count: bundles.length },
    {
      id: 'dogs',
      label: 'Canine Bundles',
      count: bundles.filter((b) => b.petType === 'dogs' || b.petType === 'both').length,
    },
    {
      id: 'cats',
      label: 'Feline Routines',
      count: bundles.filter((b) => b.petType === 'cats' || b.petType === 'both').length,
    },
    {
      id: 'small-pets',
      label: 'Small Herbivores',
      count: bundles.filter((b) => b.petType === 'small-pets').length,
    },
  ];

  const filteredBundles = bundles.filter((b) => {
    if (selectedPetType === 'all') return true;
    if (selectedPetType === 'dogs') return b.petType === 'dogs' || b.petType === 'both';
    if (selectedPetType === 'cats') return b.petType === 'cats' || b.petType === 'both';
    if (selectedPetType === 'small-pets') return b.petType === 'small-pets';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Category Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedPetType(opt.id)}
              className={`px-3.5 py-1.5 rounded-xs text-xs font-mono transition-colors border cursor-pointer whitespace-nowrap ${
                selectedPetType === opt.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xs font-semibold'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
              }`}
            >
              <span>{opt.label}</span>{' '}
              <span className="opacity-60 text-[10px]">({opt.count})</span>
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-stone-500">
          Showing {filteredBundles.length} curated regimen{filteredBundles.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Editorial Bundles List, Loading, Error, or Empty State */}
      {isLoading ? (
        <FeatureLoadingState
          title="Loading curated provision sets..."
          message="Preparing kitchen-curated nutrition regimens, feeding directions, and bundled savings."
        />
      ) : loadError ? (
        <FeatureErrorState
          title="Bundles Unavailable"
          message={loadError}
          onRetry={handleReload}
          retryLabel="Reload Curated Bundles"
        />
      ) : filteredBundles.length > 0 ? (
        <div className="space-y-12">
          {filteredBundles.map((bundle, index) => (
            <BundleCardEditorial
              key={bundle.id}
              bundle={bundle}
              alternateLayout={index % 2 === 1}
            />
          ))}
        </div>
      ) : (
        <FeatureEmptyState
          icon={Layers}
          title="No curated bundles found"
          description={`There are currently no multi-recipe regimens matching the "${selectedPetType}" companion filter.`}
          primaryAction={{
            label: 'Show All Curated Bundles',
            onClick: () => setSelectedPetType('all'),
          }}
          secondaryAction={{
            label: 'Explore Individual Provisions',
            href: '/shop',
          }}
        />
      )}
    </div>
  );
}
