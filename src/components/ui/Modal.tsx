'use client';

import React, { useEffect, useCallback, useRef, useId } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
}: ModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const idPrefix = useId();
  const titleId = title ? `modal-title-${idPrefix}` : undefined;
  const descId = description ? `modal-desc-${idPrefix}` : undefined;

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
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

      // Focus first focusable element or modal container
      const timer = setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusable) {
            focusable.focus();
          } else {
            modalRef.current.focus();
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
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
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
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.15 }}
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Dialog Container */}
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative bg-white w-full rounded-xs border border-stone-200 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] outline-none',
              maxWidthClasses[maxWidth]
            )}
          >
            {/* Header if title exists */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-200">
                <div>
                  {title && (
                    <h2 id={titleId} className="font-serif text-lg sm:text-xl text-stone-900 font-medium">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p id={descId} className="text-xs text-stone-600 mt-0.5">{description}</p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 touch-manipulation"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Content Body */}
            <div className="overflow-y-auto p-4 sm:p-6 flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
