import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
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
  title: 'Contact Care Team & Portland Storefront | Rowan & Hound Supply Co.',
  description:
    'Reach our Portland pet care team for nutrition advice, pantry inquiries, or subscription adjustments. Phone: (503) 555-0188, Email: care@rowanandhound.com.',
  path: '/contact',
  keywords: [
    'pet shop',
    'pet supplies',
    'dog food delivery',
    'pet food subscription',
    'Portland pet shop',
  ],
});

export default async function ContactPage() {
  const siteData = await siteService.getSite();
  const organizationSchema = buildOrganizationSchema();
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ]);

  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Rowan & Hound Pet Supply Co.',
    description: 'Direct care desk and storefront hours for companion nutrition advice and auto-ship management.',
    url: `${SITE_URL}/contact`,
    mainEntity: {
      '@id': `${SITE_URL}/#organization`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-[#1E3A2F] selection:text-white">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
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

      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 outline-none">
        {/* Breadcrumb Navigation UI */}
        <nav aria-label="Breadcrumbs" className="mb-6">
          <ol className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <li>
              <Link href="/" className="hover:text-stone-900 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-stone-900 font-medium" aria-current="page">
              Contact
            </li>
          </ol>
        </nav>

        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-mono uppercase tracking-widest text-[#1E3A2F] font-bold mb-2">
            Pantry Care & Storefront Desk
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 tracking-tight leading-tight">
            How can we assist your companion today?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            Our veterinary technicians and pantry associates are available 7 days a week for dietary questions, transition guidance, and subscription schedule adjustments.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Phone */}
          <div className="p-6 bg-white border border-stone-200/90 rounded-xs shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-lg font-semibold text-stone-900">
              Direct Telephone
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Speak with our local care desk during regular shop hours for immediate assistance.
            </p>
            <a
              href={`tel:${siteData.supportPhone}`}
              className="inline-block font-mono text-sm font-bold text-stone-900 hover:text-emerald-900 underline underline-offset-4"
            >
              {siteData.supportPhone}
            </a>
          </div>

          {/* Card 2: Email */}
          <div className="p-6 bg-white border border-stone-200/90 rounded-xs shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-lg font-semibold text-stone-900">
              Care Desk Email
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Send us inquiries about batch dates, ingredient sourcing, or account customizations.
            </p>
            <a
              href={`mailto:${siteData.contactEmail}`}
              className="inline-block font-mono text-sm font-bold text-stone-900 hover:text-emerald-900 underline underline-offset-4"
            >
              {siteData.contactEmail}
            </a>
          </div>

          {/* Card 3: Location */}
          <div className="p-6 bg-white border border-stone-200/90 rounded-xs shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-900 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-lg font-semibold text-stone-900">
              Portland Storefront
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed">
              Visit our Market Street pantry for batch consultations, weighing, and in-person refills.
            </p>
            <span className="block font-mono text-xs text-stone-900 font-medium">
              {siteData.address.street}, {siteData.address.city}, {siteData.address.state} {siteData.address.postalCode}
            </span>
          </div>
        </div>

        {/* Hours & Kitchen Details */}
        <div className="bg-white border border-stone-200 rounded-xs p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-stone-900 font-serif text-xl font-normal mb-4">
              <Clock className="w-5 h-5 text-[#1E3A2F]" />
              <span>Operating Hours (Pacific Time)</span>
            </div>
            <dl className="space-y-2.5 text-xs sm:text-sm font-mono">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <dt className="text-stone-500">Monday – Friday:</dt>
                <dd className="font-semibold text-stone-900">{siteData.hours.monday_friday}</dd>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <dt className="text-stone-500">Saturday:</dt>
                <dd className="font-semibold text-stone-900">{siteData.hours.saturday}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="text-stone-500">Sunday:</dt>
                <dd className="font-semibold text-stone-900">{siteData.hours.sunday}</dd>
              </div>
            </dl>
          </div>

          <div className="p-5 bg-stone-50 border border-stone-200/80 rounded-xs space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 font-semibold block">
              Direct Kitchen Inquiries
            </span>
            <p className="text-xs text-stone-600 leading-relaxed">
              Looking for our batch kitchen facilities in Yamhill County or wholesale small-batch inquiries? Contact our apothecary manager directly at <strong className="text-stone-900">{siteData.contactEmail}</strong>.
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-900 hover:text-emerald-900 underline underline-offset-4"
            >
              <span>Read frequently asked questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <CartDrawer />
    </div>
  );
}
