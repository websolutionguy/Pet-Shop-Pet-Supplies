import React from 'react';
import { Metadata } from 'next';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { CartDrawer } from '../../../components/layout/CartDrawer';
import { PetProfilesView } from '../../../components/pet/PetProfilesView';

export const metadata: Metadata = {
  title: 'Companion Pet Profiles & Nutrition Rosters | Rowan & Hound Supply Co.',
  description:
    'Manage companion profiles for your dogs, cats, and small animals. Save dietary preferences, size, and favorite recipes to discover tailored provisions with zero guesswork.',
  openGraph: {
    title: 'Companion Pet Profiles — Rowan & Hound Supply Co.',
    description:
      'Manage companion profiles for your dogs, cats, and small animals. Save dietary preferences, size, and favorite recipes.',
  },
};

export default function AccountPetsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* 1. Header */}
      <Header />

      {/* 2. Pet Profiles Workspace */}
      <main className="flex-1">
        <PetProfilesView />
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* 4. Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
