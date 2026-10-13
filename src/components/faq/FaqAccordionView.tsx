'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, HelpCircle, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import { FaqAccordionItem } from './FaqAccordionItem';
import { faqService } from '../../services/faqService';
import { FaqData } from '../../types/data';

const CATEGORIES = [
  'All',
  'Subscriptions',
  'Orders',
  'Reorders',
  'Shipping',
  'Returns',
  'Products',
  'Pet supplies',
  'Payments',
] as const;

export function FaqAccordionView() {
  const [faqs, setFaqs] = useState<FaqData[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    // Open the first subscription question by default for immediacy
    return new Set(['faq-sub-1']);
  });

  useEffect(() => {
    let isMounted = true;
    faqService.getFaqs().then((data) => {
      if (isMounted) setFaqs(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = (items: FaqData[]) => {
    setOpenIds(new Set(items.map((i) => i.id)));
  };

  const collapseAll = () => {
    setOpenIds(new Set());
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === 'All' ||
        faq.category.toLowerCase() === activeCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        query === '' ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [faqs, activeCategory, searchQuery]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Editorial Masthead */}
      <div className="bg-stone-900 text-stone-100 rounded-xs p-6 sm:p-10 border border-stone-800 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold block">
            Pantry Assistance &amp; Knowledge Base
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Direct, practical answers regarding our small-batch roasting, subscription rules, shipping speeds, and household return guarantees.
          </p>
        </div>
      </div>

      {/* Category Navigation Bar (Pills, not a huge card grid) */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 border-b border-stone-200">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? faqs.length
                : faqs.filter((f) => f.category.toLowerCase() === cat.toLowerCase()).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xs text-xs font-mono transition-colors border cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-stone-900 text-white border-stone-900 shadow-2xs font-semibold'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
                }`}
              >
                <span>{cat}</span>{' '}
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar + Expand/Collapse controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g., skip, cancel, shipping)..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xs text-xs font-mono placeholder:text-stone-400 focus:outline-none focus:border-stone-900"
              aria-label="Search frequently asked questions"
            />
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-stone-500 shrink-0">
            <button
              type="button"
              onClick={() => expandAll(filteredFaqs)}
              className="hover:text-stone-900 underline underline-offset-4 cursor-pointer"
            >
              Expand all
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={collapseAll}
              className="hover:text-stone-900 underline underline-offset-4 cursor-pointer"
            >
              Collapse all
            </button>
          </div>
        </div>
      </div>

      {/* Accordion List Container (Linear editorial flow, avoiding card grids) */}
      <div className="bg-white border border-stone-200/90 rounded-xs px-6 sm:px-8 py-2 shadow-2xs">
        {filteredFaqs.length === 0 ? (
          <div className="py-12 text-center text-stone-500 space-y-2">
            <HelpCircle className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="font-serif text-base text-stone-800">
              No questions matched your search criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-mono text-emerald-800 underline underline-offset-4 cursor-pointer"
            >
              Reset search and filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-stone-200">
            {filteredFaqs.map((faq) => (
              <FaqAccordionItem
                key={faq.id}
                faq={faq}
                isOpen={openIds.has(faq.id)}
                onToggle={() => toggleFaq(faq.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dedicated Subscription Help Banner */}
      <div className="p-5 sm:p-6 bg-emerald-50/60 border border-emerald-200 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <span className="font-semibold text-emerald-950 font-serif text-base block">
            Looking for complete auto-ship subscription rules?
          </span>
          <p className="text-emerald-900/80 leading-relaxed max-w-xl">
            Read our dedicated educational guide explaining cadence arithmetic, guaranteed 10% member savings, batch allocations, and 0 minimum cycles.
          </p>
        </div>

        <Link
          href="/subscriptions/save"
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold rounded-xs transition-colors shrink-0 text-center inline-flex items-center gap-1.5"
        >
          <span>Subscribe &amp; Save Guide</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
