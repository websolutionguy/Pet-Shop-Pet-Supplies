'use client';

import React, { useState } from 'react';
import { X, Check, Repeat, Plus, ShieldCheck } from 'lucide-react';
import { Product, ProductVariant, ProductCadence } from '../../types/product';
import { AppImage } from '../ui/AppImage';

import { useCart } from '../../providers/CartProvider';
import { formatCurrency } from '../../lib/utils';
import { CADENCE_OPTIONS } from '../../lib/constants';
import { subscriptionService } from '../../services/subscriptionService';

interface ProductQuickModalProps {
  product: Product | null;
  onClose: () => void;
}

function ProductQuickModalContent({ product, onClose }: { product: Product; onClose: () => void }) {
  const { addItem } = useCart();
  const modalRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElementRef = React.useRef<HTMLElement | null>(null);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );
  const [purchaseType, setPurchaseType] = useState<'one-time' | 'subscription'>(
    product.subscription.eligible ? 'subscription' : 'one-time'
  );
  const [cadence, setCadence] = useState<ProductCadence>(
    product.subscription.defaultCadence || '4-weeks'
  );
  const [added, setAdded] = useState(false);

  const calculation = subscriptionService.calculatePriceSync(
    {
      productId: product.id,
      quantity: 1,
      frequency: cadence,
      variant: selectedVariant || undefined,
    },
    product
  );

  const discountPercent = calculation.discountPercentage;
  const currentPrice = selectedVariant?.price ?? product.basePrice;
  const subPrice = calculation.subscriptionPrice;

  React.useEffect(() => {
    previousActiveElementRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const timer = setTimeout(() => {
      const firstBtn = modalRef.current?.querySelector<HTMLElement>('button');
      firstBtn?.focus();
    }, 50);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [onClose]);

  const handleAddToCart = () => {
    addItem(product, {
      variantId: selectedVariant?.id,
      quantity: 1,
      purchaseType,
      cadence: purchaseType === 'subscription' ? cadence : undefined,
    });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  const titleId = `quick-modal-title-${product.id}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs cursor-pointer" onClick={onClose} aria-hidden="true" />

      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xs border border-stone-200 shadow-2xl z-10 flex flex-col md:flex-row outline-none"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center bg-white/90 hover:bg-white text-stone-700 rounded-full border border-stone-200 shadow-xs cursor-pointer touch-manipulation focus-visible:ring-2 focus-visible:ring-stone-900 outline-none"
          aria-label="Close product preview"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Media Column */}
        <div className="md:w-1/2 relative min-h-[260px] md:min-h-full bg-stone-100">
          {product.primaryImage ? (
            <AppImage
              src={product.primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              Product Image
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="p-6 md:w-1/2 flex flex-col justify-between">
          <div>
            <div className="text-xs text-stone-500 uppercase tracking-wider font-medium font-mono">
              <span>{product.brand}</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>{product.categoryName}</span>
            </div>

            <h2 id={titleId} className="mt-1 text-xl font-serif font-semibold text-stone-900 leading-snug">
              {product.name}
            </h2>

            <p className="mt-2 text-xs text-stone-600 leading-relaxed">
              {product.fullDescription}
            </p>

            {/* Key benefits list */}
            {product.keyBenefits && product.keyBenefits.length > 0 && (
              <div className="mt-4 pt-3 border-t border-stone-100">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1.5 font-mono">
                  Small-Batch Formulation
                </h3>
                <ul className="space-y-1 text-xs text-stone-600">
                  {product.keyBenefits.slice(0, 3).map((b, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-stone-400 select-none" aria-hidden="true">―</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Guaranteed Analysis */}
            {product.guaranteedAnalysis && (
              <div className="mt-3 bg-stone-50 p-2.5 rounded-xs border border-stone-200 text-[11px]">
                <span className="font-semibold text-stone-700 block mb-1 font-mono">Guaranteed Analysis:</span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-stone-600 font-mono tabular-nums">
                  <div>Protein: {product.guaranteedAnalysis.crudeProtein}</div>
                  <div>Fat: {product.guaranteedAnalysis.crudeFat}</div>
                  <div>Fiber: {product.guaranteedAnalysis.crudeFiber}</div>
                  <div>Moisture: {product.guaranteedAnalysis.moisture}</div>
                </div>
              </div>
            )}

            {/* Variants */}
            {product.variants && product.variants.length > 1 && (
              <div className="mt-4">
                <label id={`variant-label-${product.id}`} className="text-xs font-semibold text-stone-700 block mb-1.5 font-mono">
                  Package Size / Spec:
                </label>
                <div
                  className="flex flex-wrap gap-2"
                  role="radiogroup"
                  aria-labelledby={`variant-label-${product.id}`}
                >
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelectedVariant(v)}
                        className={`text-xs px-3 py-1.5 min-h-[36px] rounded-xs border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-900 outline-none ${
                          isSelected
                            ? 'border-stone-900 bg-stone-900 text-white font-medium'
                            : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                        }`}
                        aria-label={`${v.name}, price ${formatCurrency(v.price)}`}
                      >
                        {v.name} ({formatCurrency(v.price)})
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & Cart Action */}
          <div className="mt-6 pt-4 border-t border-stone-200 space-y-3">
            {product.subscription.eligible && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-stone-600 font-semibold uppercase">Purchase Type:</span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded-xs border border-emerald-300">
                    <Repeat className="w-3 h-3 text-emerald-800" aria-hidden="true" />
                    <span>Subscription available · Save {discountPercent}%</span>
                  </span>
                </div>

                <div
                  className="grid grid-cols-2 gap-2"
                  role="radiogroup"
                  aria-label={`Purchase options for ${product.name}`}
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={purchaseType === 'subscription'}
                    onClick={() => setPurchaseType('subscription')}
                    className={`p-2.5 border text-left rounded-xs transition-colors cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-emerald-900 outline-none ${
                      purchaseType === 'subscription'
                        ? 'border-emerald-800 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-800'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                    aria-label={`Auto-Ship recurring subscription: ${formatCurrency(subPrice)}, saving ${discountPercent}% off regular price ${formatCurrency(currentPrice)}`}
                  >
                    <span className="sr-only">
                      Subscription available. Recurring price: {formatCurrency(subPrice)}. Save {discountPercent}% off {formatCurrency(currentPrice)}.
                    </span>
                    <div className="flex items-center justify-between text-xs font-semibold" aria-hidden="true">
                      <span>Auto-Ship &amp; Save</span>
                      <span className="text-emerald-900 font-bold bg-emerald-100 px-1 py-0.2 rounded-xs border border-emerald-200">{discountPercent}% Off</span>
                    </div>
                    <div className="font-mono text-sm font-semibold tabular-nums mt-0.5 text-stone-900" aria-hidden="true">
                      {formatCurrency(subPrice)}
                    </div>
                  </button>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={purchaseType === 'one-time'}
                    onClick={() => setPurchaseType('one-time')}
                    className={`p-2.5 border text-left rounded-xs transition-colors cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-stone-900 outline-none ${
                      purchaseType === 'one-time'
                        ? 'border-stone-900 bg-stone-100/80 text-stone-950 ring-1 ring-stone-900'
                        : 'border-stone-200 hover:border-stone-300 text-stone-700'
                    }`}
                    aria-label={`One-Time delivery: ${formatCurrency(currentPrice)}`}
                  >
                    <span className="sr-only">One-time purchase price: {formatCurrency(currentPrice)}.</span>
                    <div className="text-xs font-semibold text-stone-900" aria-hidden="true">One-Time Order</div>
                    <div className="font-mono text-sm font-semibold tabular-nums mt-0.5 text-stone-900" aria-hidden="true">
                      {formatCurrency(currentPrice)}
                    </div>
                  </button>
                </div>
              </div>
            )}

            {purchaseType === 'subscription' && product.subscription.eligible && (
              <div className="flex items-center justify-between text-xs bg-stone-50 p-2.5 border border-stone-200 rounded-xs">
                <label htmlFor={`cadence-quick-${product.id}`} className="text-stone-700 font-mono text-[11px] font-medium">
                  Shipment Frequency:
                </label>
                <select
                  id={`cadence-quick-${product.id}`}
                  value={cadence}
                  onChange={(e) => setCadence(e.target.value as ProductCadence)}
                  className="bg-white border border-stone-300 text-stone-800 rounded-xs px-2.5 py-1 text-xs min-h-[36px] focus-visible:ring-2 focus-visible:ring-stone-900 outline-none cursor-pointer"
                  aria-label={`Delivery frequency for ${product.name}`}
                >
                  {product.subscription.cadenceOptions.map((c) => (
                    <option key={c} value={c}>
                      {CADENCE_OPTIONS[c]?.label || c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3 px-4 min-h-[44px] bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 outline-none"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span>Added to Basket</span>
                </>
              ) : purchaseType === 'subscription' ? (
                <>
                  <Repeat className="w-4 h-4 text-emerald-300" aria-hidden="true" />
                  <span>Start Routine Auto-Ship ({formatCurrency(subPrice)})</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add to Basket ({formatCurrency(currentPrice)})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
              <span>Free delivery on orders over $49 · Cancel or reschedule anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductQuickModal({ product, onClose }: ProductQuickModalProps) {
  if (!product) return null;
  return <ProductQuickModalContent key={product.id} product={product} onClose={onClose} />;
}
