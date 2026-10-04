import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface HeroProps {
  onShopCombos: () => void;
  onExploreBuilder?: () => void;
  onSelectProduct?: (product: Product) => void;
  products?: Product[];
  isIntroActive?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onShopCombos,
  isIntroActive = false,
}) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(!isIntroActive);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Trigger Apple-style reveal once intro completes (or immediately if no intro)
  useEffect(() => {
    if (!isIntroActive) {
      const timer = setTimeout(() => {
        setHasStarted(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isIntroActive]);

  // Headline words for word-by-word fade/slide/blur-in reveal
  const headlineWords = ['Everything.', 'Elevated.'];

  return (
    <section className="relative overflow-hidden bg-[#FAFAFA] border-b border-neutral-200/80 py-20 sm:py-28 md:py-36 px-4 sm:px-6 flex flex-col items-center justify-center text-center select-none">
      {/* Calm looping background amber-orange shimmer animation */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] md:w-[950px] h-[320px] sm:h-[420px] rounded-full bg-gradient-to-tr from-[#EA580C]/18 via-[#F97316]/12 to-[#FB923C]/10 blur-3xl pointer-events-none animate-amber-ambient"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center justify-center">
        {/* Apple-style Word-by-Word Reveal Headline */}
        <h1 className="font-heading font-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.015em] leading-[1.08] mb-5 sm:mb-6 text-[#1A1A1A] flex flex-wrap items-center justify-center gap-x-3.5 sm:gap-x-5">
          {headlineWords.map((word, idx) => (
            <span
              key={word}
              className={`inline-block will-change-transform ${
                prefersReducedMotion
                  ? 'opacity-100 translate-y-0 filter-none'
                  : `transition-all duration-700 ease-out ${
                      hasStarted
                        ? 'opacity-100 translate-y-0 filter-none'
                        : 'opacity-0 translate-y-6 blur-[8px]'
                    }`
              }`}
              style={{
                transitionDelay: !prefersReducedMotion && hasStarted ? `${idx * 160}ms` : '0ms',
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Subtext: Unisex, Premium Copy */}
        <p className="font-body text-neutral-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-6 sm:mb-8 px-4">
          Fashion, footwear, cosmetics, and electronics — curated for effortless everyday luxury. Fast dispatch with Cash on Delivery nationwide.
        </p>

        {/* Single set of feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-[13px] text-neutral-700 font-medium mb-8 sm:mb-10 px-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
            Unisex Fashion &amp; Shoes
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
            Cosmetics &amp; Electronics
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
            Cash on Delivery
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C]" />
            24hr Dispatch
          </span>
        </div>

        {/* Explore Collection Button */}
        <button
          onClick={onShopCombos}
          className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-heading font-semibold text-sm sm:text-base transition-all duration-200 shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 cursor-pointer active:scale-98"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
