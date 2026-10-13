'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { BlogData } from '../../types/data';
import { formatHumanDate } from '../../lib/utils';

interface DispatchListProps {
  posts: BlogData[];
  title?: string;
  startIndex?: number;
}

export function DispatchList({
  posts,
  title = 'Archive Dispatches & Practical Guides',
  startIndex = 1,
}: DispatchListProps) {
  if (posts.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900">
          {title}
        </h2>
        <span className="text-xs font-mono text-stone-500">
          {posts.length} Documented Entry{posts.length === 1 ? '' : 'ies'}
        </span>
      </div>

      <div className="divide-y divide-stone-200">
        {posts.map((post, idx) => {
          const entryNumber = String(startIndex + idx).padStart(2, '0');

          return (
            <article
              key={post.id}
              className="py-6 sm:py-8 group transition-colors flex flex-col md:flex-row md:items-baseline justify-between gap-4 md:gap-8"
            >
              {/* Left Column: Number & Category */}
              <div className="flex items-center md:items-baseline gap-4 shrink-0 md:w-48">
                <span className="font-mono text-2xl sm:text-3xl font-light text-stone-300 group-hover:text-emerald-800 transition-colors">
                  {entryNumber}
                </span>
                <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px] font-mono uppercase tracking-wider rounded-xs">
                  {post.category}
                </span>
              </div>

              {/* Middle Column: Title, Subtitle, Excerpt */}
              <div className="flex-1 space-y-2">
                <h3 className="font-serif text-lg sm:text-xl font-normal text-stone-900 group-hover:text-emerald-950 transition-colors">
                  <Link href={`/journal/${post.slug}`} className="block">
                    {post.title}
                  </Link>
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-2xl">
                  {post.excerpt}
                </p>

                <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px] font-mono text-stone-400">
                  <span>By {post.author.name}</span>
                  <span>·</span>
                  <time dateTime={post.publishedDate}>
                    {formatHumanDate(post.publishedDate)}
                  </time>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTimeMinutes} min</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Arrow Action */}
              <div className="shrink-0 self-start md:self-center pt-2 md:pt-0">
                <Link
                  href={`/journal/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-700 group-hover:text-stone-950 font-semibold group-hover:translate-x-0.5 transition-transform"
                >
                  <span className="hidden sm:inline">Read Note</span>
                  <ArrowRight className="w-4 h-4 text-emerald-800" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
