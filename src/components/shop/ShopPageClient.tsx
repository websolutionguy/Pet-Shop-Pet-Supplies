'use client';

import React, { Suspense, useState } from 'react';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { CartDrawer } from '../layout/CartDrawer';
import { PetManagerModal } from '../pet/PetManagerModal';
import { ShopCatalogContent } from './ShopCatalogContent';
import { Loader2 } from 'lucide-react';

function CatalogLoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <Loader2 className="w-8 h-8 text-stone-400 animate-spin mx-auto mb-3" />
      <p className="font-serif text-stone-600 text-sm">
        Loading kitchen provisions...
      </p>
    </div>
  );
}

export function ShopPageClient() {
  const [isPetManagerOpen, setIsPetManagerOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* 1. Header (Desktop, Mobile, Top Announcement, Search, Account, Cart) */}
      <Header
        onOpenPetManager={() => setIsPetManagerOpen(true)}
        activeFilter="all"
      />

      {/* 2. Main Catalog Body with Suspense for useSearchParams */}
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={<CatalogLoadingFallback />}>
          <ShopCatalogContent />
        </Suspense>
      </main>

      {/* 3. Footer */}
      <Footer />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Pet Manager Modal */}
      <PetManagerModal
        isOpen={isPetManagerOpen}
        onClose={() => setIsPetManagerOpen(false)}
      />
    </div>
  );
}
