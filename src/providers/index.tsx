'use client';

import React from 'react';
import { CartProvider } from './CartProvider';
import { PetProfileProvider } from './PetProfileProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <PetProfileProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </PetProfileProvider>
  );
}

export * from './CartProvider';
export * from './PetProfileProvider';
