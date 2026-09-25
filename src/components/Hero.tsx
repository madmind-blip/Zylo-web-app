import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopCombos: () => void;
  onExploreBuilder?: () => void;
  featuredImageUrl?: string;
  isIntroActive?: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onShopCombos,
  isIntroActive = false,
}) => {
  const [hasTriggered, setHasTriggered] = useState(!isIntroActive);

  useEffect(() => {
    if (!isIntroActive) {
      const timer = setTimeout(() => {
        setHasTriggered(true);
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isIntroActive]);

  return (
    <section className="relative min-h-[440px] sm:min-h-[500px] flex items-center justify-center bg-[#FAFAFA] border-b border-neutral-200/80 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
        {/* Single Refined Syne Headline with Apple-Style Text Reveal */}
        <h1 className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[1.1] mb-4 text-[#1A1A1A]">
          <span
            className={`inline-block text-[#1A1A1A] ${hasTriggered ? 'animate-apple-reveal' : 'opacity-0'}`}
            style={{ animationDelay: '0ms' }}
          >
            UPGRADE
          </span>{' '}
          <span
            className={`inline-block text-[#1A1A1A] ${hasTriggered ? 'animate-apple-reveal' : 'opacity-0'}`}
            style={{ animationDelay: '180ms' }}
          >
            YOUR
          </span>{' '}
          <br className="hidden sm:inline" />
          <span
            className={`inline-block text-[#1A1A1A] ${hasTriggered ? 'animate-apple-reveal' : 'opacity-0'}`}
            style={{ animationDelay: '360ms' }}
          >
            DRIP
          </span>{' '}
          <span
            className={`inline-block text-[#1A1A1A] ${hasTriggered ? 'animate-apple-reveal' : 'opacity-0'}`}
            style={{ animationDelay: '540ms' }}
          >
            GAME
          </span>
        </h1>

        {/* Single Refined Subheadline */}
        <p className="font-body text-neutral-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed mb-8">
          Curated streetwear combo clothes and high-finish watches engineered for effortless style. Direct Kota dispatch with Cash on Delivery nationwide.
        </p>

        {/* Single Clean CTA Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={onShopCombos}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white font-heading font-semibold text-sm transition-all duration-200 shadow-xs cursor-pointer active:scale-98"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
