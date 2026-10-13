import React from 'react';
import Link from 'next/link';
import { STORE_NAME, STORE_LOCATION, STORE_HOURS } from '../../lib/constants';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & Storehouse */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-lg font-semibold text-white tracking-tight">
              {STORE_NAME}
            </h3>
            <p className="mt-3 text-xs text-stone-400 leading-relaxed">
              Independent pet food provisions, clean proteins, and steady routine auto-ship subscriptions. Never bulk-warehoused under heat lamps.
            </p>
            <div className="mt-4 text-xs text-stone-400 space-y-1">
              <p>{STORE_LOCATION}</p>
              <p>{STORE_HOURS}</p>
            </div>
          </div>

          {/* Provisions & Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-stone-200 font-semibold mb-3">
              Provisions
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/shop" className="hover:text-stone-100 transition-colors">
                  All Provisions &amp; Batches
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-stone-100 transition-colors">
                  Category Foundations
                </Link>
              </li>
              <li>
                <Link href="/bundles" className="hover:text-stone-100 transition-colors text-emerald-400 font-medium">
                  Curated Care Bundles
                </Link>
              </li>
              <li>
                <Link href="/shop?pet=dog" className="hover:text-stone-100 transition-colors">
                  Canine Sprouted Kibble &amp; Chews
                </Link>
              </li>
              <li>
                <Link href="/shop?pet=cat" className="hover:text-stone-100 transition-colors">
                  Feline Broth Entrees &amp; Hydration
                </Link>
              </li>
            </ul>
          </div>

          {/* Routine & Subscriptions */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-stone-200 font-semibold mb-3">
              About &amp; Auto-Ship
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <Link href="/about" className="hover:text-stone-100 transition-colors">
                  About Our Standards
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-stone-100 transition-colors">
                  Contact &amp; Storefront
                </Link>
              </li>
              <li>
                <Link href="/subscriptions/save" className="hover:text-stone-100 transition-colors">
                  How Subscribe &amp; Save Works
                </Link>
              </li>
              <li>
                <Link href="/subscriptions" className="hover:text-stone-100 transition-colors">
                  Routine Builder
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-stone-100 transition-colors">
                  The Journal · Field Notes
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-stone-100 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-stone-100 transition-colors">
                  Customer Notes &amp; Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Support */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-stone-200 font-semibold mb-3">
              Independent Shop Care
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Questions regarding protein allergies or bag cadence for your pet&apos;s weight? Speak directly with our shop team.
            </p>
            <div className="mt-4 text-xs text-stone-300">
              <p className="font-mono">care@rowanandhound.com</p>
              <p className="font-mono mt-1">(503) 555-0188</p>
            </div>
          </div>
        </div>

        {/* Quiet baseline bottom bar */}
        <div className="mt-14 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Rowan &amp; Hound Supply Co. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/journal" className="hover:text-stone-400">Journal</Link>
            <Link href="/faq" className="hover:text-stone-400">Pantry FAQ</Link>
            <Link href="/reviews" className="hover:text-stone-400">Reviews</Link>
            <Link href="/subscriptions/save" className="hover:text-stone-400">Auto-Ship Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
