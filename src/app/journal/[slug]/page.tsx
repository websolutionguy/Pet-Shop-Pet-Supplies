import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '../../../components/layout/Header';
import { Footer } from '../../../components/layout/Footer';
import { CartDrawer } from '../../../components/layout/CartDrawer';
import { JournalArticleDetail } from '../../../components/journal';
import { blogService } from '../../../services/blogService';
import {
  generatePageMetadata,
  buildArticleSchema,
  buildBreadcrumbSchema,
} from '../../../lib/seo';

interface JournalDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await blogService.getAll();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: JournalDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogService.getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Rowan & Hound Pet Supply Co.',
    };
  }

  return generatePageMetadata({
    title: `${post.title} | The Journal · Rowan & Hound`,
    description: post.excerpt,
    path: `/journal/${post.slug}`,
    image: post.heroImage,
    type: 'article',
    publishedTime: post.publishedDate,
    authors: [post.author.name],
    keywords: [
      'pet nutrition',
      'pet supplies',
      'dog food',
      'cat food',
      post.category.toLowerCase(),
    ],
  });
}

export default async function JournalDetailPage({ params }: JournalDetailPageProps) {
  const { slug } = await params;
  const post = await blogService.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const articleSchema = buildArticleSchema(post);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'The Journal', path: '/journal' },
    { name: post.title, path: `/journal/${post.slug}` },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* 1. Global Header */}
      <Header />

      {/* 2. Main Article Body */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 outline-none">
        <JournalArticleDetail post={post} />
      </main>

      {/* 3. Global Footer */}
      <Footer />

      {/* 4. Global Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
