'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppImage } from '../ui/AppImage';

import { ArrowRight, BookOpen, Clock, CheckCircle2 } from 'lucide-react';
import { blogService } from '../../services/blogService';
import { BlogData } from '../../types/data';
import { formatHumanDate } from '../../lib/utils';

interface JournalSectionProps {
  initialArticles?: BlogData[];
}

export function JournalSection({ initialArticles }: JournalSectionProps) {
  const [articles, setArticles] = useState<BlogData[]>(initialArticles || []);

  useEffect(() => {
    if (initialArticles && initialArticles.length > 0) return;
    let isMounted = true;
    blogService.getPosts().then((res) => {
      if (isMounted) setArticles(res);
    });
    return () => {
      isMounted = false;
    };
  }, [initialArticles]);

  const leadArticle = articles[0];
  const sideArticles = articles.slice(1, 3);

  return (
    <section className="bg-[#FAF8F5] border-b border-stone-200 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Masthead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 pb-4 border-b border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#1E3A2F] font-bold mb-1.5 font-sans">
              <BookOpen className="w-3.5 h-3.5" />
              <span>The Rowan &amp; Hound Journal</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-normal text-stone-900 tracking-tight">
              Field notes on veterinary nutrition &amp; companion routines.
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-600 max-w-xl">
              Grounded, practical research on raw proteins, feline hydration biology, and low-waste pantry rhythms from our Portland team.
            </p>
          </div>

          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-800 hover:text-stone-950 underline underline-offset-4 shrink-0"
          >
            <span>Explore Complete Journal</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-800" />
          </Link>
        </div>

        {/* Asymmetric Art-Directed Layout (Lead Feature + Sidebar Dispatches) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Lead Feature (7 cols) */}
          {leadArticle && (
            <article className="lg:col-span-7 bg-white border border-stone-200/90 rounded-xs overflow-hidden flex flex-col justify-between shadow-2xs hover:border-stone-400 transition-colors">
              <div>
                <div className="relative aspect-16/9 w-full bg-stone-100 overflow-hidden">
                  <AppImage
                    src={leadArticle.heroImage || '/src/assets/images/hero_dog_natural_1790396014202.jpg'}
                    alt={leadArticle.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-stone-900/90 text-white text-[10px] font-mono uppercase tracking-wider rounded-xs font-semibold">
                    Cover Feature · {leadArticle.category}
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                    <time dateTime={leadArticle.publishedDate}>
                      {formatHumanDate(leadArticle.publishedDate)}
                    </time>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{leadArticle.readTimeMinutes} min deep read</span>
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900 leading-snug">
                    <Link
                      href={`/journal/${leadArticle.slug}`}
                      className="hover:text-emerald-950 transition-colors"
                    >
                      {leadArticle.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {leadArticle.excerpt}
                  </p>

                  {leadArticle.takeaways && leadArticle.takeaways.length > 0 && (
                    <div className="pt-2">
                      <ul className="space-y-1 text-xs text-stone-700">
                        {leadArticle.takeaways.slice(0, 2).map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                            <span className="text-[11px] leading-snug">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="font-semibold text-stone-900 block font-serif">
                    {leadArticle.author.name}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {leadArticle.author.role}
                  </span>
                </div>

                <Link
                  href={`/journal/${leadArticle.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xs text-xs font-mono font-semibold transition-colors"
                >
                  <span>Read Field Note</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          )}

          {/* Right Column: Stacked Dispatches & Archive Navigation (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              {sideArticles.map((art, idx) => (
                <article
                  key={art.id}
                  className="bg-white border border-stone-200/90 rounded-xs p-6 space-y-3 shadow-2xs hover:border-stone-400 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-stone-400">
                      0{idx + 2}
                    </span>
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-mono uppercase tracking-wider rounded-xs font-medium">
                      {art.category}
                    </span>
                    <span className="text-xs font-mono text-stone-500 ml-auto">
                      {art.readTimeMinutes} min
                    </span>
                  </div>

                  <h4 className="font-serif text-lg font-normal text-stone-900 leading-snug">
                    <Link
                      href={`/journal/${art.slug}`}
                      className="hover:text-emerald-950 transition-colors"
                    >
                      {art.title}
                    </Link>
                  </h4>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-stone-500">By {art.author.name}</span>
                    <Link
                      href={`/journal/${art.slug}`}
                      className="text-emerald-900 font-semibold inline-flex items-center gap-1 hover:underline underline-offset-4"
                    >
                      <span>Read Note</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Archive Callout Box */}
            <div className="p-6 bg-[#FAF9F6] border border-stone-200 rounded-xs space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 font-semibold block">
                Field Research Index
              </span>
              <p className="text-xs text-stone-700 leading-relaxed font-serif">
                Browse our complete editorial archives across 8 categories including Dog Care, Cat Care, Nutrition, Grooming, and Pet Routines.
              </p>
              <Link
                href="/journal"
                className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-950 pt-1 hover:underline underline-offset-4"
              >
                <span>View All 8 Published Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
