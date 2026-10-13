'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  subtitle?: string;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  className,
}: AccordionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn('divide-y divide-stone-200 border-y border-stone-200', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `accordion-header-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div key={item.id} className="py-1">
            <h3 className="text-base font-normal">
              <button
                type="button"
                id={headerId}
                aria-controls={panelId}
                aria-expanded={isOpen}
                onClick={() => toggle(item.id)}
                className="w-full flex items-center justify-between text-left py-3.5 px-1 group cursor-pointer min-h-[44px] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 transition-colors"
              >
                <div>
                  <span className="font-serif text-base sm:text-lg text-stone-900 group-hover:text-stone-700 transition-colors block">
                    {item.title}
                  </span>
                  {item.subtitle && (
                    <p className="text-xs text-stone-600 mt-0.5">{item.subtitle}</p>
                  )}
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-stone-500 group-hover:text-stone-800 transition-transform duration-200 shrink-0 ml-4',
                    isOpen && 'rotate-180 text-stone-900'
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={headerId}
                  initial={shouldReduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={shouldReduceMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                  exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { height: { duration: 0.22, ease: 'easeOut' }, opacity: { duration: 0.16 } }
                  }
                  className="overflow-hidden"
                >
                  <div className="pt-1 pb-4 px-1 text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
