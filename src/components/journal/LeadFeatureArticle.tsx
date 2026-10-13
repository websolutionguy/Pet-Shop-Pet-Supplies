import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, User, CheckCircle2, Bookmark } from 'lucide-react';
import { BlogData } from '../../types/data';
import { formatHumanDate } from '../../lib/utils';

interface LeadFeatureArticleProps {
  post: BlogData;
}

export function LeadFeatureArticle({ post }: LeadFeatureArticleProps) {
  const heroImage =
    post.heroImage || '/src/assets/images/hero_dog_natural_1790396014202.jpg';

  return (
    <article className="bg-white border border-stone-200/90 rounded-xs shadow-xs overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Visual Column */}
        <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[420px] lg:min-h-full bg-stone-100 overflow-hidden">
          <Image
            src={heroImage}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            priority
            className="object-cover transition-transform duration-500 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent lg:hidden" />

          {/* Badge Overlay */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="px-2.5 py-1 bg-stone-900/90 backdrop-blur-xs text-white text-[10px] font-mono uppercase tracking-widest rounded-xs border border-white/10 font-semibold">
              Cover Story · {post.category}
            </span>
          </div>
        </div>

        {/* Right Editorial Story Column */}
        <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6 bg-[#FAF9F6] border-t lg:border-t-0 lg:border-l border-stone-200">
          <div className="space-y-4">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-stone-500">
              <time dateTime={post.publishedDate}>
                {formatHumanDate(post.publishedDate)}
              </time>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>{post.readTimeMinutes} min deep read</span>
              </span>
            </div>

            {/* Display Headline */}
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-stone-900 tracking-tight leading-snug">
              <Link
                href={`/journal/${post.slug}`}
                className="hover:text-emerald-950 transition-colors"
              >
                {post.title}
              </Link>
            </h2>

            {post.subtitle && (
              <p className="text-xs sm:text-sm font-mono text-emerald-900 leading-relaxed font-medium">
                {post.subtitle}
              </p>
            )}

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Key Field Takeaways Preview */}
            {post.takeaways && post.takeaways.length > 0 && (
              <div className="p-3.5 bg-white border border-stone-200/80 rounded-xs space-y-2 text-xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold block">
                  Core Practices:
                </span>
                <ul className="space-y-1.5 text-stone-700">
                  {post.takeaways.slice(0, 2).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer: Author & CTA */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-stone-900 block font-serif">
                {post.author.name}
              </span>
              <span className="text-[10px] text-stone-500 font-mono">
                {post.author.role}
              </span>
            </div>

            <Link
              href={`/journal/${post.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xs text-xs font-mono font-semibold transition-colors shrink-0"
            >
              <span>Read Note</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
