'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product, ProductCadence } from '../types/product';
import { CartItem, CartSummary, PurchaseType } from '../types/cart';
import { cartService, CartAddOptions, DeliveryMethodId } from '../services/cartService';

interface CartContextType {
  items: CartItem[];
  summary: CartSummary;
  isCartOpen: boolean;
  isLoading: boolean;
  error: string | null;
  promoCode: string | null;
  promoMessage: string | null;
  deliveryMethod: DeliveryMethodId;
  setDeliveryMethod: (method: DeliveryMethodId) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, options?: CartAddOptions) => void;
  addMultipleItems: (batch: Array<{ product: Product; options?: CartAddOptions }>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemPurchaseType: (itemId: string, purchaseType: PurchaseType, cadence?: ProductCadence) => void;
  updateItemCadence: (itemId: string, cadence: ProductCadence) => void;
  applyPromoCode: (code: string) => { valid: boolean; message: string };
  removePromoCode: () => void;
  clearCart: () => void;
  clearError: () => void;
  setError: (msg: string | null) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = 'rowan_hound_cart_v2';
const PROMO_STORAGE_KEY = 'rowan_hound_promo_v2';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const storedItems = window.localStorage.getItem(CART_STORAGE_KEY);
      if (storedItems) {
        const parsed = JSON.parse(storedItems);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Storage read fail-safe
    }
    return [];
  });

  const [promoCode, setPromoCode] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(PROMO_STORAGE_KEY);
    } catch {
      return null;
    }
  });

  const [promoMessage, setPromoMessage] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = window.localStorage.getItem(PROMO_STORAGE_KEY);
      if (stored) {
        return `Code ${stored} is active in your basket.`;
      }
    } catch {
      // Ignore
    }
    return null;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodId>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      if (promoCode) {
        window.localStorage.setItem(PROMO_STORAGE_KEY, promoCode);
      } else {
        window.localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch {
      // LocalStorage quota or privacy mode fail-safe
    }
  }, [items, promoCode]);

  // Calculations are executed exclusively via cartService
  const summary = useMemo(() => {
    return cartService.calculateSummary(items, promoCode || undefined, deliveryMethod);
  }, [items, promoCode, deliveryMethod]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addItem = useCallback((product: Product, options?: CartAddOptions) => {
    try {
      setItems((prevItems) => cartService.addItem(prevItems, product, options));
      setIsCartOpen(true);
      setError(null);
    } catch {
      setError('Failed to add provision to your basket. Please try again.');
    }
  }, []);

  const addMultipleItems = useCallback(
    (batch: Array<{ product: Product; options?: CartAddOptions }>) => {
      try {
        setItems((prevItems) => {
          let updated = prevItems;
          for (const entry of batch) {
            updated = cartService.addItem(updated, entry.product, entry.options);
          }
          return updated;
        });
        setIsCartOpen(true);
        setError(null);
      } catch {
        setError('Failed to add bundled provisions to your basket.');
      }
    },
    []
  );

  const removeItem = useCallback((itemId: string) => {
    setItems((prev) => cartService.removeItem(prev, itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity > 99) {
      setError('Maximum 99 units per order allowed for small-batch provisions freshness.');
      return;
    }
    setError(null);
    setItems((prev) => cartService.updateQuantity(prev, itemId, newQuantity));
  }, []);

  const updateItemPurchaseType = useCallback(
    (itemId: string, purchaseType: PurchaseType, cadence?: ProductCadence) => {
      setItems((prev) =>
        cartService.setSubscription(prev, itemId, purchaseType === 'subscription', cadence)
      );
    },
    []
  );

  const updateItemCadence = useCallback((itemId: string, cadence: ProductCadence) => {
    setItems((prev) => cartService.updateCadence(prev, itemId, cadence));
  }, []);

  const applyPromoCode = useCallback(
    (code: string) => {
      const result = cartService.validatePromoCode(code, items);
      if (result.valid) {
        setPromoCode(result.code);
        setPromoMessage(result.message);
        setError(null);
        return { valid: true, message: result.message };
      } else {
        setPromoMessage(null);
        return { valid: false, message: result.message };
      }
    },
    [items]
  );

  const removePromoCode = useCallback(() => {
    setPromoCode(null);
    setPromoMessage(null);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode(null);
    setPromoMessage(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        summary,
        isCartOpen,
        isLoading,
        error,
        promoCode,
        promoMessage,
        deliveryMethod,
        setDeliveryMethod,
        openCart,
        closeCart,
        addItem,
        addMultipleItems,
        removeItem,
        updateQuantity,
        updateItemPurchaseType,
        updateItemCadence,
        applyPromoCode,
        removePromoCode,
        clearCart,
        clearError,
        setError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
