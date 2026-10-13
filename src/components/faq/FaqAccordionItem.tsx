'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { FaqData } from '../../types/data';

interface FaqAccordionItemProps {
  faq: FaqData;
  isOpen: boolean;
  onToggle: () => void;
}

export function FaqAccordionItem({ faq, isOpen, onToggle }: FaqAccordionItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const contentId = `faq-answer-${faq.id}`;
  const headerId = `faq-header-${faq.id}`;

  return (
    <div className="border-b border-stone-200 transition-colors">
      <h3 className="text-base">
        <button
          type="button"
          id={headerId}
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={onToggle}
          className="w-full py-4 sm:py-5 flex items-start justify-between gap-4 text-left transition-colors group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800 rounded-xs"
        >
          <span className="space-y-1">
            <span className="font-serif text-base sm:text-lg font-medium text-stone-900 group-hover:text-emerald-900 transition-colors block">
              {faq.question}
            </span>
            <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-stone-400">
              {faq.category}
            </span>
          </span>

          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.2, ease: 'easeInOut' }}
            className={`p-1 rounded-full text-stone-400 group-hover:text-stone-700 shrink-0 mt-1 ${
              isOpen ? 'text-emerald-800' : ''
            }`}
            aria-hidden="true"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={headerId}
            initial={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { height: { duration: 0.24, ease: [0.04, 0.62, 0.23, 0.98] }, opacity: { duration: 0.18 } }
            }
            className="overflow-hidden"
          >
            <div className="pb-5">
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-3xl pl-0 sm:pl-2 border-l-2 border-emerald-800/40">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
