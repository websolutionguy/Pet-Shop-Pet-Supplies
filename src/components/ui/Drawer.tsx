'use client';

import React, { useEffect, useCallback, useRef, useId } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  position?: 'right' | 'left';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Drawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  position = 'right',
  maxWidth = 'md',
}: DrawerProps) {
  const shouldReduceMotion = useReducedMotion();
  const idPrefix = useId();
  const titleId = title ? `drawer-title-${idPrefix}` : undefined;
  const descId = description ? `drawer-desc-${idPrefix}` : undefined;

  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);

      const timer = setTimeout(() => {
        if (drawerRef.current) {
          const focusable = drawerRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable) {
            focusable.focus();
          } else {
            drawerRef.current.focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        if (previousActiveElementRef.current) {
          previousActiveElementRef.current.focus();
        }
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen, handleKeyDown]);

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const slideInitial = position === 'right' ? { x: '100%' } : { x: '-100%' };
  const slideExit = position === 'right' ? { x: '100%' } : { x: '-100%' };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2 }}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div
            className={cn(
              'fixed inset-y-0 flex max-w-full',
              position === 'right' ? 'right-0 pl-10' : 'left-0 pr-10'
            )}
          >
            <motion.div
              ref={drawerRef}
              tabIndex={-1}
              initial={shouldReduceMotion ? { opacity: 0 } : slideInitial}
              animate={shouldReduceMotion ? { opacity: 1 } : { x: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : slideExit}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', damping: 28, stiffness: 280 }
              }
              className={cn(
                'w-screen bg-white shadow-2xl flex flex-col h-full border-stone-200 outline-none',
                position === 'right' ? 'border-l' : 'border-r',
                maxWidthClasses[maxWidth]
              )}
            >
              {/* Header */}
              <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
                <div>
                  {title && (
                    <h2 id={titleId} className="font-serif text-lg font-medium text-stone-900">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id={descId} className="text-xs text-stone-600 mt-0.5">{description}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 touch-manipulation"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-5">{children}</div>

              {/* Optional footer */}
              {footer && (
                <div className="p-5 border-t border-stone-200 bg-stone-50/80">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
