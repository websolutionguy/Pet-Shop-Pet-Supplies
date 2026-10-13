'use client';

import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/layout/CartDrawer';
import { HeroSection } from '../components/home/HeroSection';
import { QuickPetSelection } from '../components/home/QuickPetSelection';
import { ShopByNeed } from '../components/home/ShopByNeed';
import { SubscriptionFeature } from '../components/home/SubscriptionFeature';
import { BestsellingShelf } from '../components/home/BestsellingShelf';
import { ReorderSection } from '../components/home/ReorderSection';
import { PetCareEditorial } from '../components/home/PetCareEditorial';
import { SubscriptionBundles } from '../components/home/SubscriptionBundles';
import { BrandStory } from '../components/home/BrandStory';
import { ReviewsSection } from '../components/home/ReviewsSection';
import { JournalSection } from '../components/home/JournalSection';
import { ProductCatalog } from '../components/products/ProductCatalog';
import { ProductQuickModal } from '../components/products/ProductQuickModal';
import { PetManagerModal } from '../components/pet/PetManagerModal';
import { Product } from '../types/product';

export default function HomePage() {
  const [activeNavFilter, setActiveNavFilter] = useState<string>('all');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isPetManagerOpen, setIsPetManagerOpen] = useState(false);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAutoShip = () => {
    const el = document.getElementById('subscriptions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectNeed = (needSlug: string) => {
    setActiveNavFilter(needSlug);
    scrollToCatalog();
  };

  const handleSelectSpecies = (speciesId: string) => {
    setActiveNavFilter(speciesId);
    scrollToCatalog();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* 1. Header (Desktop, Mobile, Top Announcement, Search, Account, Cart) */}
      <Header
        onOpenPetManager={() => setIsPetManagerOpen(true)}
        activeFilter={activeNavFilter}
        onSelectProduct={(product) => setQuickViewProduct(product)}
        onFilterChange={(filter) => {
          setActiveNavFilter(filter);
          if (filter === 'subscriptions') {
            scrollToAutoShip();
          } else if (filter === 'reorder') {
            const el = document.getElementById('reorder');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          } else {
            scrollToCatalog();
          }
        }}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {/* 2. Asymmetric Image-Led Hero Section */}
        <HeroSection
          onShopEssentialsClick={scrollToCatalog}
          onBuildSubscriptionClick={scrollToAutoShip}
        />

        {/* 3. Quick Pet Selection (Useful shopping shortcut) */}
        <QuickPetSelection
          selectedSpecies={activeNavFilter}
          onSelectSpecies={handleSelectSpecies}
        />

        {/* 4. Shop by Need (Distinct Category Tiles) */}
        <ShopByNeed onSelectNeed={handleSelectNeed} />

        {/* 5. Editorial Subscription Feature Explainer + Comparison */}
        <SubscriptionFeature onExploreAutoShip={scrollToAutoShip} />

        {/* 6. Bestselling Products Shelf */}
        <BestsellingShelf
          onQuickView={(p) => setQuickViewProduct(p)}
          onViewAllCatalog={scrollToCatalog}
        />

        {/* 7. Reorder Section ("Running Low?" Practical Pantry Workflow) */}
        <ReorderSection />

        {/* 8. Full Product Catalog with Multi-Filters & Sort */}
        <ProductCatalog
          onQuickView={(p) => setQuickViewProduct(p)}
          externalPetFilter={activeNavFilter}
        />

        {/* 9. Pet Care Editorial (Replenishment Math, Cat Litter, Daily Care) */}
        <PetCareEditorial />

        {/* 10. Curated Subscription Bundles */}
        <SubscriptionBundles />

        {/* 11. Brand Story & Pacific Northwest Standards */}
        <BrandStory />

        {/* 12. Authentic Customer Reviews from JSON */}
        <ReviewsSection />

        {/* 13. Editorial Journal & Interactive Reader */}
        <JournalSection />
      </main>

      {/* 14. Merchant Footer */}
      <Footer />

      {/* Slide-out Cart Drawer */}
      <CartDrawer />

      {/* Modals for Quick View & Household Pet Manager */}
      <ProductQuickModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <PetManagerModal
        isOpen={isPetManagerOpen}
        onClose={() => setIsPetManagerOpen(false)}
      />
    </div>
  );
}
