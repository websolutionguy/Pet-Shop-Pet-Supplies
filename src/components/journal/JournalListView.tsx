'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { JournalHeader } from './JournalHeader';
import { LeadFeatureArticle } from './LeadFeatureArticle';
import { EditorialDuo } from './EditorialDuo';
import { DispatchList } from './DispatchList';
import { blogService } from '../../services/blogService';
import { BlogData } from '../../types/data';
import { Search, Loader2 } from 'lucide-react';

export function JournalListView() {
  const [posts, setPosts] = useState<BlogData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    blogService.getPosts().then((list) => {
      if (isMounted) {
        setPosts(list);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        query === '' ||
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.author.name.toLowerCase().includes(query) ||
        p.tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Breakdown for varied editorial presentation when in "All" view with no search
  const isDefaultView = selectedCategory === 'All' && searchQuery.trim() === '';
  const leadPost = isDefaultView ? filteredPosts[0] : null;
  const duoLeft = isDefaultView && filteredPosts.length > 1 ? filteredPosts[1] : null;
  const duoRight = isDefaultView && filteredPosts.length > 2 ? filteredPosts[2] : null;
  const remainingDispatches = isDefaultView
    ? filteredPosts.slice(3)
    : filteredPosts;

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Masthead and Category Navigation */}
      <JournalHeader
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        postCount={filteredPosts.length}
      />

      {/* 2. Optional In-Archive Keyword Search */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search field notes, routines, veterinary topics..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xs text-xs font-mono placeholder:text-stone-400 focus:outline-none focus:border-stone-900"
            aria-label="Search journal field notes"
          />
        </div>

        <span className="text-xs font-mono text-stone-500 hidden sm:inline">
          {filteredPosts.length} Field Note{filteredPosts.length === 1 ? '' : 's'} Published
        </span>
      </div>

      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-3 text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin text-stone-800" />
          <p className="text-xs font-mono">Opening journal archives...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-16 text-center bg-white border border-stone-200 rounded-xs space-y-3">
          <p className="font-serif text-lg text-stone-800">
            No field notes found for this category or search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-mono text-emerald-800 underline underline-offset-4 cursor-pointer"
          >
            Reset archive filters
          </button>
        </div>
      ) : isDefaultView ? (
        /* Varied Editorial Layout (Lead Cover Story + Side-by-Side Asymmetric Duo + Numeral Dispatch List) */
        <div className="space-y-12 sm:space-y-16">
          {leadPost && <LeadFeatureArticle post={leadPost} />}

          {duoLeft && duoRight && (
            <EditorialDuo leftPost={duoLeft} rightPost={duoRight} />
          )}

          <DispatchList
            posts={remainingDispatches}
            title="Continuing Field Notes &amp; Pantry Protocols"
            startIndex={4}
          />
        </div>
      ) : (
        /* Filtered Category View (Lead card for first match + List for the rest) */
        <div className="space-y-10">
          {filteredPosts.length > 0 && (
            <LeadFeatureArticle post={filteredPosts[0]} />
          )}

          {filteredPosts.length > 1 && (
            <DispatchList
              posts={filteredPosts.slice(1)}
              title={`${selectedCategory} Field Dispatches`}
              startIndex={2}
            />
          )}
        </div>
      )}
    </div>
  );
}
