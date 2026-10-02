import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface HeroProps {
  onShopCombos: () => void;
  onExploreBuilder?: () => void;
  onSelectProduct?: (product: Product) => void;
  products?: Product[];
  isIntroActive?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onShopCombos,
  onSelectProduct,
  products = [],
  isIntroActive = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Filter 2 to 3 real watch products from live data, with fallback to PRODUCTS
  const watchProducts = useMemo(() => {
    const source = products && products.length > 0 ? products : PRODUCTS;
    const filtered = source.filter(
      (p) => p.categoryGroup === 'watches' || p.category.toLowerCase().includes('watch')
    );
    return filtered.slice(0, 3);
  }, [products]);

  // Filter 2 to 3 real combo products from live data, with fallback to PRODUCTS
  const comboProducts = useMemo(() => {
    const source = products && products.length > 0 ? products : PRODUCTS;
    const filtered = source.filter(
      (p) => p.categoryGroup === 'combos' || p.category.toLowerCase().includes('combo')
    );
    return filtered.slice(0, 3);
  }, [products]);

  // Scroll listener for sticky 3-stage progression
  useEffect(() => {
    if (prefersReducedMotion) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }

          const rect = containerRef.current.getBoundingClientRect();
          const headerOffset = window.innerWidth >= 640 ? 80 : 64;
          const totalDistance = rect.height - (window.innerHeight - headerOffset);

          if (totalDistance <= 0) {
            ticking = false;
            return;
          }

          const scrolled = headerOffset - rect.top;
          const p = Math.min(Math.max(scrolled / totalDistance, 0), 1);
          setProgress(p);

          // 3 Stages:
          // Stage 1: 0.00 -> 0.32
          // Stage 2: 0.32 -> 0.66
          // Stage 3: 0.66 -> 1.00
          if (p < 0.32) {
            setStage(1);
          } else if (p < 0.66) {
            setStage(2);
          } else {
            setStage(3);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [prefersReducedMotion]);

  // Scroll to a specific stage when clicking stage pill
  const scrollToStage = (targetStage: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const headerOffset = window.innerWidth >= 640 ? 80 : 64;
    const totalDistance = rect.height - (window.innerHeight - headerOffset);
    const targetProgress = targetStage === 1 ? 0.05 : targetStage === 2 ? 0.45 : 0.82;
    const targetScrollY = window.scrollY + rect.top - headerOffset + targetProgress * totalDistance;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  // Static fallback if user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <section className="relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center bg-[#FAFAFA] border-b border-neutral-200/80 px-4 sm:px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[1.1] mb-4 text-[#1A1A1A]">
            UPGRADE YOUR DRIP GAME
          </h1>
          <p className="font-body text-neutral-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed mb-8">
            Curated streetwear combo clothes and high-finish watches engineered for effortless style. Fast dispatch with Cash on Delivery, nationwide.
          </p>
          <button
            onClick={onShopCombos}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white font-heading font-semibold text-sm transition-colors shadow-xs cursor-pointer"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    );
  }

  // Words for staggered blur-to-sharp reveal
  const stage1Words = ['UPGRADE', 'YOUR', 'DRIP', 'GAME'];
  const stage2Words = ['WATCHES', 'THAT', 'TURN', 'HEADS'];
  const stage3Words = ['COMBOS', 'THAT', 'SAVE', 'MORE'];

  return (
    <div
      ref={containerRef}
      className="relative h-[270vh] sm:h-[280vh] bg-[#FAFAFA]"
    >
      {/* Pinned Sticky Hero Viewport */}
      <section className="sticky top-16 sm:top-20 h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)] w-full overflow-hidden bg-[#FAFAFA] border-b border-neutral-200/80 flex flex-col justify-between items-center px-4 sm:px-6 py-4 sm:py-6 select-none">
        
        {/* Top: Minimal Stage Progress Indicator */}
        <div className="w-full max-w-md mx-auto flex items-center justify-center gap-2 pt-1 z-20">
          {[
            { num: 1, label: '01 / DRIP' },
            { num: 2, label: '02 / WATCHES' },
            { num: 3, label: '03 / COMBOS' },
          ].map((item) => {
            const isCurrent = stage === item.num;
            return (
              <button
                key={item.num}
                onClick={() => scrollToStage(item.num)}
                className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-mono font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-[#1A1A1A] text-white shadow-2xs scale-102'
                    : 'bg-white/80 text-neutral-500 hover:text-black border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Center: Stage Layers (smooth crossfade with GPU transforms) */}
        <div className="relative w-full max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center my-auto min-h-0">
          
          {/* ================= STAGE 1: DRIP GAME ================= */}
          <div
            className={`w-full flex flex-col items-center justify-center text-center transition-all duration-600 ease-out ${
              stage === 1
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-95 pointer-events-none absolute inset-0'
            }`}
          >
            {/* Staggered Word Reveal Headline */}
            <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[1.1] mb-3 sm:mb-4 text-[#1A1A1A] flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-4">
              {stage1Words.map((word, idx) => (
                <span
                  key={word}
                  className={`inline-block transition-all duration-600 ease-out will-change-transform ${
                    stage === 1
                      ? 'opacity-100 translate-y-0 filter-none'
                      : 'opacity-0 translate-y-5 blur-[6px]'
                  }`}
                  style={{
                    transitionDelay: stage === 1 ? `${idx * 80}ms` : '0ms',
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            {/* Subtitle */}
            <p className="font-body text-neutral-600 text-xs sm:text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed mb-4 sm:mb-6 px-4">
              Curated streetwear combo clothes and high-finish watches engineered for effortless style. Fast dispatch with Cash on Delivery, nationwide.
            </p>

            {/* Value Trust Micro-Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-neutral-600 font-medium">
              <span className="px-2.5 py-1 rounded-full bg-white border border-neutral-200/90 shadow-2xs">
                ✨ Cash on Delivery
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-neutral-200/90 shadow-2xs">
                ⚡ Express Dispatch
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white border border-neutral-200/90 shadow-2xs">
                💎 Premium Materials
              </span>
            </div>
          </div>

          {/* ================= STAGE 2: WATCHES ================= */}
          <div
            className={`w-full flex flex-col items-center justify-center text-center transition-all duration-600 ease-out ${
              stage === 2
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-95 pointer-events-none absolute inset-0'
            }`}
          >
            {/* Staggered Word Reveal Headline */}
            <h1 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase leading-[1.1] mb-2 sm:mb-3 text-[#1A1A1A] flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3.5">
              {stage2Words.map((word, idx) => (
                <span
                  key={word}
                  className={`inline-block transition-all duration-600 ease-out will-change-transform ${
                    stage === 2
                      ? 'opacity-100 translate-y-0 filter-none'
                      : 'opacity-0 translate-y-5 blur-[6px]'
                  }`}
                  style={{
                    transitionDelay: stage === 2 ? `${idx * 80}ms` : '0ms',
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p className="font-body text-neutral-600 text-xs sm:text-sm md:text-base max-w-lg mx-auto font-normal leading-relaxed mb-4 sm:mb-6 px-4">
              Precision chronographs and automatic skeleton timepieces designed to elevate any fit.
            </p>

            {/* Floating Live Watch Images (2 to 3) */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 pt-1 max-w-full overflow-hidden">
              {watchProducts.map((product, idx) => {
                const rotation =
                  idx === 0
                    ? '-rotate-3 sm:-rotate-4 -translate-y-1'
                    : idx === 1
                    ? 'rotate-0 scale-105 z-10'
                    : 'rotate-3 sm:rotate-4 translate-y-1';

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                    className={`transition-all duration-700 ease-out will-change-transform cursor-pointer ${rotation} ${
                      stage === 2
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                    style={{
                      transitionDelay: stage === 2 ? `${150 + idx * 100}ms` : '0ms',
                    }}
                  >
                    <div className="w-24 sm:w-32 md:w-40 bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-neutral-200/90 shadow-md hover:shadow-xl hover:scale-105 transition-all">
                      <div className="relative w-full h-24 sm:h-32 md:h-40 rounded-lg sm:rounded-xl overflow-hidden bg-neutral-100">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                        {product.discountPercent > 0 && (
                          <span className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-bold bg-[#1A1A1A] text-white">
                            {product.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <div className="mt-1 sm:mt-1.5 text-center px-0.5">
                        <p className="font-heading font-bold text-[10px] sm:text-xs text-[#1A1A1A] truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-0.5">
                          <span className="font-heading font-bold text-[10px] sm:text-xs text-[#1A1A1A]">
                            ₹{product.price}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-[9px] sm:text-[10px] text-neutral-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= STAGE 3: COMBOS ================= */}
          <div
            className={`w-full flex flex-col items-center justify-center text-center transition-all duration-600 ease-out ${
              stage === 3
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-95 pointer-events-none absolute inset-0'
            }`}
          >
            {/* Staggered Word Reveal Headline */}
            <h1 className="font-heading font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight uppercase leading-[1.1] mb-2 sm:mb-3 text-[#1A1A1A] flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3.5">
              {stage3Words.map((word, idx) => (
                <span
                  key={word}
                  className={`inline-block transition-all duration-600 ease-out will-change-transform ${
                    stage === 3
                      ? 'opacity-100 translate-y-0 filter-none'
                      : 'opacity-0 translate-y-5 blur-[6px]'
                  }`}
                  style={{
                    transitionDelay: stage === 3 ? `${idx * 80}ms` : '0ms',
                  }}
                >
                  {word}
                </span>
              ))}
            </h1>

            <p className="font-body text-neutral-600 text-xs sm:text-sm md:text-base max-w-lg mx-auto font-normal leading-relaxed mb-4 sm:mb-6 px-4">
              Hand-picked matching sets with bundle savings up to 40% OFF. Ready to wear.
            </p>

            {/* Floating Live Combo Images (2 to 3) */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 pt-1 max-w-full overflow-hidden">
              {comboProducts.map((product, idx) => {
                const rotation =
                  idx === 0
                    ? '-rotate-3 sm:-rotate-4 -translate-y-1'
                    : idx === 1
                    ? 'rotate-0 scale-105 z-10'
                    : 'rotate-3 sm:rotate-4 translate-y-1';

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct && onSelectProduct(product)}
                    className={`transition-all duration-700 ease-out will-change-transform cursor-pointer ${rotation} ${
                      stage === 3
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                    style={{
                      transitionDelay: stage === 3 ? `${150 + idx * 100}ms` : '0ms',
                    }}
                  >
                    <div className="w-24 sm:w-32 md:w-40 bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 border border-neutral-200/90 shadow-md hover:shadow-xl hover:scale-105 transition-all">
                      <div className="relative w-full h-24 sm:h-32 md:h-40 rounded-lg sm:rounded-xl overflow-hidden bg-neutral-100">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          loading="eager"
                        />
                        {product.discountPercent > 0 && (
                          <span className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 px-1 sm:px-1.5 py-0.5 rounded text-[8px] sm:text-[10px] font-bold bg-[#1A1A1A] text-white">
                            {product.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                      <div className="mt-1 sm:mt-1.5 text-center px-0.5">
                        <p className="font-heading font-bold text-[10px] sm:text-xs text-[#1A1A1A] truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center justify-center gap-1 mt-0.5">
                          <span className="font-heading font-bold text-[10px] sm:text-xs text-[#1A1A1A]">
                            ₹{product.price}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="text-[9px] sm:text-[10px] text-neutral-400 line-through">
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Bottom Area: Explore Collection CTA & Stage 1 Scroll Indicator */}
        <div className="w-full flex flex-col items-center justify-center gap-3 pb-1 sm:pb-2 z-20">
          {/* Explore Collection Button (Visible & Tappable Throughout All 3 Stages) */}
          <button
            onClick={onShopCombos}
            className="inline-flex items-center justify-center gap-2 px-7 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white font-heading font-semibold text-xs sm:text-sm transition-all duration-200 shadow-sm cursor-pointer active:scale-98"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Thin Animated Scroll Indicator (Fades out after Stage 1) */}
          <div
            className={`transition-all duration-500 flex flex-col items-center gap-1 ${
              stage === 1 && progress < 0.2
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
              Scroll
            </span>
            <div className="w-px h-5 sm:h-6 bg-gradient-to-b from-neutral-400 to-transparent animate-pulse" />
          </div>
        </div>

      </section>
    </div>
  );
};
