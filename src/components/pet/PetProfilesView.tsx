'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppImage } from '../ui/AppImage';

import {
  PawPrint,
  Heart,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Info,
  Scale,
  Calendar,
  CheckCircle2,
  BookmarkCheck,
} from 'lucide-react';
import { PetProfile } from '../../types/pet';
import { Product } from '../../types/product';
import { usePetProfile } from '../../providers/PetProfileProvider';
import { useCart } from '../../providers/CartProvider';
import { productService } from '../../services/productService';
import { PetProfileFormModal } from './PetProfileFormModal';
import { AssociateProductModal } from './AssociateProductModal';
import { AccountNav } from '../account/AccountNav';
import { customerService } from '../../services/customerService';
import { CustomerProfile } from '../../types/customer';
import { formatCurrency, cn } from '../../lib/utils';
import { Button } from '../ui/Button';
import {
  FeatureLoadingState,
  FeatureEmptyState,
} from '../ui/StateFeedback';

export function PetProfilesView() {
  const router = useRouter();
  const {
    pets,
    selectedPetId,
    selectPet,
    addPet,
    updatePet,
    deletePet,
    toggleFavoriteProduct,
    isLoading,
  } = usePetProfile();
  const { addItem } = useCart();

  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productMap, setProductMap] = useState<Record<string, Product>>({});

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<PetProfile | null>(null);
  const [associatingPet, setAssociatingPet] = useState<PetProfile | null>(null);

  // Load products & customer for lookup
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      productService.getAll(),
      customerService.getCurrentCustomer(),
    ]).then(([prods, cust]) => {
      if (!isMounted) return;
      setAllProducts(prods);
      setCustomer(cust);
      const map: Record<string, Product> = {};
      prods.forEach((p) => {
        map[p.id] = p;
      });
      setProductMap(map);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenAdd = () => {
    setEditingPet(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (pet: PetProfile) => {
    setEditingPet(pet);
    setIsFormModalOpen(true);
  };

  const handleSavePet = (data: Omit<PetProfile, 'id' | 'customerId'>) => {
    if (editingPet) {
      updatePet(editingPet.id, data);
    } else {
      addPet(data);
    }
  };

  const handleShopForPet = (pet: PetProfile) => {
    selectPet(pet.id);
    const petQuery = pet.species === 'dog' ? 'dogs' : pet.species === 'cat' ? 'cats' : 'small-pets';
    router.push(`/shop?pet=${petQuery}&petName=${encodeURIComponent(pet.name)}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24">
      {/* Editorial Header */}
      <header className="bg-stone-900 text-stone-100 py-10 sm:py-12 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
              <PawPrint className="w-3.5 h-3.5" />
              <span>Companion Profiles &amp; Diet Rosters</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white">
              Your Household Companions
            </h1>
            <p className="mt-3 text-stone-300 text-xs sm:text-sm leading-relaxed">
              Save species, sizes, diet preferences, and favorite recipes for each animal in your
              care. Use these profiles to discover tailored provisions with zero guesswork.
            </p>

            {/* Clear Demonstration State Notice (Requirement: Do not claim persistent backend storage) */}
            <div className="mt-4 inline-flex items-center gap-2 p-2 bg-stone-800/80 rounded-xs text-[11px] text-stone-300 font-mono border border-stone-700">
              <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>
                Demonstration Mode: Companion profiles are saved in local browser storage for this session.
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Shared Consumer Account Nav */}
        <AccountNav customer={customer} />

        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900">
              Active Companions ({pets.length})
            </h2>
            <p className="text-xs text-stone-500 font-sans">
              Personalized sourcing recommendations are calibrated against these profiles.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAdd}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add a Companion
          </Button>
        </div>

        {/* Pet Profiles Cards Grid */}
        {isLoading ? (
          <div className="space-y-4">
            <FeatureLoadingState
              title="Loading companion profiles..."
              message="Retrieving pet age, weight calibration, and favorite small-batch provisions."
            />
          </div>
        ) : pets.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pets.map((pet) => {
              const isSelected = selectedPetId === pet.id;
              const favProducts = (pet.favoriteProductIds || [])
                .map((id) => productMap[id])
                .filter((p): p is Product => Boolean(p));

              return (
                <article
                  key={pet.id}
                  className={cn(
                    'bg-white border rounded-xs p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all space-y-5',
                    isSelected
                      ? 'border-emerald-800 ring-1 ring-emerald-800/80 bg-emerald-50/10'
                      : 'border-stone-200 hover:border-stone-300'
                  )}
                >
                  <div>
                    {/* Header: Name, Breed, Species, Actions */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-950 text-white flex items-center justify-center font-serif text-lg font-bold shrink-0">
                          {pet.name.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-900">
                              {pet.name}
                            </h3>
                            <span className="font-mono text-[10px] uppercase font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-xs border border-stone-200">
                              {pet.species === 'dog' ? 'Canine' : pet.species === 'cat' ? 'Feline' : 'Small Pet'}
                            </span>
                          </div>
                          <span className="text-xs text-stone-500 font-mono">
                            {pet.breed} · {pet.ageYears} yr{pet.ageYears !== 1 ? 's' : ''} old · {pet.size || 'Medium'} Size
                            {pet.weightLbs ? ` (${pet.weightLbs} lbs)` : ''}
                          </span>
                        </div>
                      </div>

                      {/* Edit & Delete Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(pet)}
                          className="p-1.5 text-stone-400 hover:text-stone-700 rounded-xs transition-colors cursor-pointer"
                          title={`Edit ${pet.name}'s profile`}
                          aria-label={`Edit ${pet.name}'s profile`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {pets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Remove ${pet.name}'s profile from your account?`)) {
                                deletePet(pet.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-red-700 rounded-xs transition-colors cursor-pointer"
                            title={`Delete ${pet.name}'s profile`}
                            aria-label={`Delete ${pet.name}'s profile`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Diet Preferences Tags */}
                    <div className="pt-3">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-1.5">
                        Dietary Preferences & Sourcing:
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {(pet.dietPreferences || pet.dietaryRestrictions || []).length > 0 ? (
                          (pet.dietPreferences || pet.dietaryRestrictions || []).map((pref) => (
                            <span
                              key={pref}
                              className="font-mono text-[11px] text-emerald-950 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200"
                            >
                              {pref}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-stone-400 italic">
                            No specific restrictions recorded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notes if present */}
                    {pet.notes && (
                      <div className="mt-3 p-3 bg-stone-50/80 border border-stone-200/80 rounded-xs text-xs text-stone-700 leading-relaxed font-sans">
                        <span className="font-semibold text-stone-900 block text-[11px] font-mono uppercase mb-0.5">
                          Notes & Quirks:
                        </span>
                        {pet.notes}
                      </div>
                    )}

                    {/* Favorite / Associated Products */}
                    <div className="mt-4 pt-3 border-t border-stone-100">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-stone-600 font-semibold block">
                          Associated Favorite Recipes ({favProducts.length}):
                        </label>
                        <button
                          type="button"
                          onClick={() => setAssociatingPet(pet)}
                          className="text-[11px] font-mono text-emerald-900 hover:text-emerald-700 underline underline-offset-2 cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Associate Recipes</span>
                        </button>
                      </div>

                      {favProducts.length > 0 ? (
                        <div className="space-y-2">
                          {favProducts.map((prod) => (
                            <div
                              key={prod.id}
                              className="flex items-center justify-between p-2 bg-stone-50 rounded-xs border border-stone-200/70 text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                <div className="relative w-8 h-8 rounded-xs overflow-hidden bg-white shrink-0 border border-stone-200">
                                  {prod.primaryImage ? (
                                    <AppImage
                                      src={prod.primaryImage}
                                      alt={prod.name}
                                      fill
                                      loading="lazy"
                                      sizes="32px"
                                      className="object-cover"
                                      showSpinner={false}
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-stone-200" />
                                  )}
                                </div>
                                <div className="truncate">
                                  <Link
                                    href={`/products/${prod.slug}`}
                                    className="font-medium text-stone-900 hover:underline truncate block"
                                  >
                                    {prod.name}
                                  </Link>
                                  <span className="font-mono text-[10px] text-stone-500">
                                    {formatCurrency(prod.basePrice)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => addItem(prod, { quantity: 1, targetPetName: pet.name })}
                                  className="px-2 py-1 bg-stone-900 text-white rounded-xs text-[10px] font-medium hover:bg-stone-800 transition-colors cursor-pointer"
                                  title="Add to Basket"
                                >
                                  + Basket
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleFavoriteProduct(pet.id, prod.id)}
                                  className="p-1 text-stone-400 hover:text-red-700 cursor-pointer"
                                  title="Remove from favorites"
                                  aria-label="Remove"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 bg-stone-50/50 border border-dashed border-stone-200 rounded-xs text-center text-xs text-stone-500">
                          <span>No favorite recipes associated yet. </span>
                          <button
                            type="button"
                            onClick={() => setAssociatingPet(pet)}
                            className="text-emerald-900 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
                          >
                            Browse catalog to associate
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary Feature CTA: "Shop for {pet.name}" */}
                  <div className="pt-4 border-t border-stone-200">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={() => handleShopForPet(pet)}
                      className="w-full text-xs font-medium"
                      leftIcon={<PawPrint className="w-3.5 h-3.5 text-emerald-300" />}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Shop for {pet.name}
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <FeatureEmptyState
            icon={PawPrint}
            badge="Pet Profile Empty"
            title="Your companion profile list is empty"
            description="You haven't added any companion profiles yet. Add your dog, cat, or small pet to calibrate daily feeding portions, calculate bag replenishment cadences, and associate personalized recipes."
            primaryAction={{
              label: 'Add Companion Profile',
              onClick: handleOpenAdd,
              icon: <Plus className="w-3.5 h-3.5" />,
            }}
            secondaryAction={{
              label: 'Browse Provisions Catalog',
              href: '/shop',
            }}
          />
        )}
      </div>

      {/* Pet Form Modal */}
      <PetProfileFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSavePet}
        initialPet={editingPet}
      />

      {/* Associate Product Modal */}
      {associatingPet && (
        <AssociateProductModal
          isOpen={Boolean(associatingPet)}
          onClose={() => setAssociatingPet(null)}
          pet={associatingPet}
          onToggleFavorite={toggleFavoriteProduct}
        />
      )}
    </div>
  );
}
