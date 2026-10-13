import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Sparkles, MapPin, CheckCircle, ArrowRight, Heart } from 'lucide-react';
import { siteService } from '../../services/siteService';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';
import { CartDrawer } from '../../components/layout/CartDrawer';
import {
  generatePageMetadata,
  buildBreadcrumbSchema,
  buildOrganizationSchema,
  SITE_URL,
} from '../../lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'About Our Pacific Northwest Pet Pantry | Rowan & Hound Supply Co.',
  description:
    'Founded in 2018 in Portland, Oregon. Learn about our 21-day kettle roasted dog food, feline hydration broths, transparent rancher partnerships, and zero-rawhide commitment.',
  path: '/about',
  keywords: [
    'pet shop',
    'pet supplies',
    'dog food',
    'cat food',
    'pet treats',
    'pet food subscription',
    'Pacific Northwest pet provisions',
  ],
});

export default async function AboutPage() {
  const companyData = await siteService.getCompany();
  const organizationSchema = buildOrganizationSchema();
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
  ]);

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Rowan & Hound Supply Co.',
    description: companyData.mission,
    url: `${SITE_URL}/about`,
    mainEntity: {
      '@id': `${SITE_URL}/#organization`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Header />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {/* Hero Section */}
        <section className="border-b border-stone-200 bg-[#FAF8F5] py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav aria-label="Breadcrumbs" className="mb-6">
              <ol className="flex items-center gap-2 text-xs font-mono text-stone-500">
                <li>
                  <Link href="/" className="hover:text-stone-900 transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-stone-900 font-medium" aria-current="page">
                  About
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <p className="text-xs font-mono uppercase tracking-widest text-[#1E3A2F] font-bold mb-3">
                Pacific Northwest Craft · Est. {companyData.foundedYear}
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-stone-900 tracking-tight leading-tight">
                Nourishing companion animals with biological integrity.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-stone-700 leading-relaxed font-serif">
                {companyData.mission}
              </p>
            </div>
          </div>
        </section>

        {/* Founder Story & Ethics */}
        <section className="py-12 sm:py-16 border-b border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold block">
                The Origins of Rowan & Hound
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-stone-900 leading-snug">
                Frustrated by industrial bulk pet food warehousing.
              </h2>
              <div className="prose prose-stone text-sm sm:text-base text-stone-600 space-y-4 leading-relaxed">
                <p>{companyData.founderStory}</p>
                <p>
                  Industrial kibble often sits in warm multi-month transit hubs, allowing heat and ambient oxygen to oxidize fragile Omega-3 fatty acids and destabilize delicate active probiotics. Our model solves this: we roast in small 800-lb kettle batches every 21 days and deliver straight to companion doors.
                </p>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="px-5 py-3 bg-[#1E3A2F] hover:bg-[#162B23] text-white rounded-xs text-xs font-mono font-semibold transition-colors flex items-center gap-2"
                >
                  <span>Explore Kitchen Provisions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/subscriptions"
                  className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xs text-xs font-mono font-semibold transition-colors border border-stone-300"
                >
                  Learn About Auto-Ship
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-4/5 rounded-xs overflow-hidden border border-stone-200 bg-stone-100 shadow-sm">
              <Image
                src="/src/assets/images/hero_dog_natural_1790396014202.jpg"
                alt="Rowan & Hound Pacific Northwest pantry ethos and companion care"
                fill
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        {/* 4 Core Pillars */}
        <section className="py-12 sm:py-16 border-b border-stone-200 bg-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-10">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#1E3A2F] font-bold block mb-2">
                Uncompromising Standards
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-normal text-stone-900 leading-snug">
                How our standards differ from pet supermarket aisles.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {companyData.values.map((val, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-white border border-stone-200/90 rounded-xs space-y-3 shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-[#1E3A2F]">
                    <CheckCircle className="w-4 h-4 text-[#1E3A2F]" />
                    <h3 className="font-serif text-lg font-medium text-stone-900">
                      {val.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Facilities & Community */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mb-8">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#1E3A2F] font-bold block mb-2">
                Regional Presence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-900">
                Pacific Northwest Facilities
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {companyData.facilities.map((fac, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-[#FAF8F5] border border-stone-200 rounded-xs space-y-2 flex items-start gap-4"
                >
                  <MapPin className="w-5 h-5 text-[#1E3A2F] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-serif text-base font-semibold text-stone-900">
                      {fac.name}
                    </h3>
                    <p className="font-mono text-xs text-stone-600 mt-1">
                      {fac.address}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
