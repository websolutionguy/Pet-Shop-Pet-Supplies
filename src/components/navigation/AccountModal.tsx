'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  PawPrint,
  Repeat,
  Package,
  MapPin,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { usePetProfile } from '../../providers/PetProfileProvider';
import { subscriptionService } from '../../services/subscriptionService';
import { SubscriptionSchedule } from '../../types/subscription';
import { formatHumanDate } from '../../lib/utils';
import { CADENCE_OPTIONS } from '../../lib/constants';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPetManager?: () => void;
  onNavigateToSubscriptions?: () => void;
}

export function AccountModal({
  isOpen,
  onClose,
  onOpenPetManager,
  onNavigateToSubscriptions,
}: AccountModalProps) {
  const { pets, selectedPet, selectPet } = usePetProfile();
  const [activeSubscription, setActiveSubscription] = useState<SubscriptionSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isOpen) {
      subscriptionService
        .getByCustomerId('cust-eleanor-vance')
        .then((subs) => {
          if (isMounted && subs.length > 0) setActiveSubscription(subs[0]);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Member Account & Pantry"
      description="Eleanor Vance · Portland, OR"
      maxWidth="md"
    >
      <div className="space-y-6">
        {/* Customer Badge & Membership status */}
        <div className="bg-stone-50 border border-stone-200/90 rounded-xs p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs bg-[#1E3A2F] text-stone-100 flex items-center justify-center font-serif text-base font-medium">
              EV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif text-sm font-medium text-stone-900">
                  Eleanor Vance
                </h4>
                <Badge variant="forest" size="sm">
                  Active Member
                </Badge>
              </div>
              <p className="text-[11px] text-stone-500 font-mono">
                Member ID: CUST-74892 · Since 2022
              </p>
            </div>
          </div>
        </div>

        {/* Household Companions Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-600 flex items-center gap-1.5">
              <PawPrint className="w-3.5 h-3.5 text-stone-400" />
              Registered Companions ({pets.length})
            </span>
            <a
              href="/account/pets"
              onClick={onClose}
              className="text-xs text-emerald-900 hover:text-emerald-700 font-medium underline underline-offset-4 cursor-pointer"
            >
              Manage Profiles →
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {pets.map((pet) => {
              const isSelected = selectedPet?.id === pet.id;
              return (
                <button
                  key={pet.id}
                  type="button"
                  onClick={() => selectPet(pet.id)}
                  className={`p-3 text-left border rounded-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-stone-900 bg-stone-100/80 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-900">
                    <span>{pet.name}</span>
                    {isSelected && (
                      <span className="text-[10px] font-mono text-emerald-800">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {pet.breed} · {pet.weightLbs} lbs
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1 font-mono">
                    Cadence: {pet.calculatedBagCadenceWeeks} wks
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Routine Auto-Ship Status */}
        {activeSubscription && (
          <div className="border border-stone-200 rounded-xs p-4 bg-emerald-50/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat className="w-4 h-4 text-emerald-900" />
                <span className="font-serif text-sm font-medium text-stone-900">
                  Recurring Auto-Ship Routine
                </span>
              </div>
              <Badge variant="forest" size="sm">
                {activeSubscription.status === 'active' ? 'Active' : 'Paused'}
              </Badge>
            </div>

            <div className="text-xs text-stone-600 space-y-1">
              <div className="flex items-center justify-between">
                <span>Next Oven Dispatch:</span>
                <strong className="font-mono text-stone-900">
                  {formatHumanDate(activeSubscription.nextShipmentDate)}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Replenishment Frequency:</span>
                <span className="font-medium text-stone-900">
                  {CADENCE_OPTIONS[activeSubscription.cadence]?.label || activeSubscription.cadence}
                </span>
              </div>
            </div>

            {onNavigateToSubscriptions && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  onClose();
                  onNavigateToSubscriptions();
                }}
              >
                View Auto-Ship Schedule & Controls
              </Button>
            )}
          </div>
        )}

        {/* Quick Menu Options */}
        <div className="border-t border-stone-200 pt-4 space-y-1 text-xs">
          <div className="flex items-center justify-between py-2 text-stone-700 hover:text-stone-950 cursor-pointer">
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4 text-stone-400" />
              Order History & Fresh Invoices
            </span>
            <span className="text-stone-400">3 Orders</span>
          </div>

          <div className="flex items-center justify-between py-2 text-stone-700 hover:text-stone-950 cursor-pointer">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-400" />
              Shipping Addresses (Portland, OR)
            </span>
            <span className="text-stone-400 font-mono text-[11px]">Primary Default</span>
          </div>

          <div className="flex items-center justify-between py-2 text-stone-700 hover:text-stone-950 cursor-pointer">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-stone-400" />
              Batch Authenticity & Guarantee
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </div>
        </div>

        {/* Bottom service banner */}
        <div className="bg-stone-100/70 p-3 rounded-xs text-[11px] text-stone-600 flex items-start gap-2">
          <Clock className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <div>
            <strong>Independent Pet Concierge:</strong> Call us at (503) 555-0198
            during shop hours for nutrition guidance or custom batch orders.
          </div>
        </div>
      </div>
    </Drawer>
  );
}
