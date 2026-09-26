import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopCombos: () => void;
  onExploreBuilder?: () => void;
  featuredImageUrl?: string;
  isIntroActive?: boolean;
}

const HERO_VIDEO_URL =
  'https://res.cloudinary.com/zanwhxs5/video/upload/v1790406821/Firefly_Slow_motion_stop-motion_style_video_of_a_folded_shirt_jacket_and_wristwatch_flying_in_from_1.mp4';

export const Hero: React.FC<HeroProps> = ({
  onShopCombos,
  isIntroActive = false,
}) => {
  const [hasTriggered, setHasTriggered] = useState(!isIntroActive);
  const [isVideoFailed, setIsVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isIntroActive) {
      const timer = setTimeout(() => {
        setHasTriggered(true);
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isIntroActive]);

  // Ensure autoplay works reliably across mobile browsers (muted + playsInline + defaultMuted)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback handled smoothly if browser restricts autoplay
        });
      }
    }
  }, []);

  return (
    <section className="relative min-h-[440px] sm:min-h-[500px] flex items-center justify-center bg-[#FAFAFA] border-b border-neutral-200/80 overflow-hidden">
      {/* Looping Background Video */}
      {!isVideoFailed && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0"
          onError={() => setIsVideoFailed(true)}
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
      )}

      {/* Semi-transparent Light Overlay (65% opacity white for crisp text readability) */}
      <div
        className="absolute inset-0 bg-white/65 pointer-events-none z-1"
        aria-hidden="true"
      />

      {/* Hero Content positioned cleanly on top */}
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
        <p className="font-body text-neutral-700 text-sm sm:text-base md:text-lg max-w-xl mx-auto font-normal leading-relaxed mb-8">
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
