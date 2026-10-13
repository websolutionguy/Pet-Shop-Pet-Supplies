import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { BlogData } from '../../types/data';
import { formatHumanDate } from '../../lib/utils';

interface EditorialDuoProps {
  leftPost: BlogData;
  rightPost: BlogData;
}

export function EditorialDuo({ leftPost, rightPost }: EditorialDuoProps) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      {/* Left Article: Visual Narrative Style */}
      <article className="bg-white border border-stone-200/90 rounded-xs p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs hover:border-stone-300 transition-colors">
        <div className="space-y-4">
          <div className="relative aspect-16/9 w-full bg-stone-100 rounded-xs overflow-hidden border border-stone-200">
            {leftPost.heroImage && (
              <Image
                src={leftPost.heroImage}
                alt={leftPost.title}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
              />
            )}
            <span className="absolute top-3 left-3 px-2 py-0.5 bg-stone-900/90 text-white text-[10px] font-mono uppercase tracking-wider rounded-xs">
              {leftPost.category}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <time dateTime={leftPost.publishedDate}>
              {formatHumanDate(leftPost.publishedDate)}
            </time>
            <span>·</span>
            <span>{leftPost.readTimeMinutes} min read</span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 leading-snug">
            <Link
              href={`/journal/${leftPost.slug}`}
              className="hover:text-emerald-950 transition-colors"
            >
              {leftPost.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {leftPost.excerpt}
          </p>
        </div>

        <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono">
          <span className="text-stone-700">By {leftPost.author.name}</span>
          <Link
            href={`/journal/${leftPost.slug}`}
            className="inline-flex items-center gap-1 text-emerald-900 font-semibold hover:underline underline-offset-4"
          >
            <span>Read dispatch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>

      {/* Right Article: Clean Typographic Essay Style with Takeaways */}
      <article className="bg-[#FAF9F6] border border-stone-200/90 rounded-xs p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs hover:border-stone-300 transition-colors">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-950 text-[10px] font-mono uppercase tracking-wider rounded-xs font-semibold border border-emerald-300/80">
              {rightPost.category}
            </span>
            <span className="text-xs font-mono text-stone-500">
              {rightPost.readTimeMinutes} min read
            </span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 leading-snug">
            <Link
              href={`/journal/${rightPost.slug}`}
              className="hover:text-emerald-950 transition-colors"
            >
              {rightPost.title}
            </Link>
          </h3>

          {rightPost.subtitle && (
            <p className="text-xs font-mono text-stone-500 leading-snug">
              {rightPost.subtitle}
            </p>
          )}

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {rightPost.excerpt}
          </p>

          {/* Key Checklist Box */}
          {rightPost.takeaways && rightPost.takeaways.length > 0 && (
            <div className="p-3 bg-white border border-stone-200 rounded-xs space-y-1.5 text-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold block">
                Field Guide Highlights:
              </span>
              <ul className="space-y-1 text-stone-700">
                {rightPost.takeaways.slice(0, 2).map((item, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs font-mono">
          <span className="text-stone-700">By {rightPost.author.name}</span>
          <Link
            href={`/journal/${rightPost.slug}`}
            className="inline-flex items-center gap-1 text-stone-900 font-semibold hover:underline underline-offset-4"
          >
            <span>Read guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </section>
  );
}
