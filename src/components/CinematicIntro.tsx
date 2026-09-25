import React, { useState, useEffect, useRef } from 'react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  // Phase 1: 'phrase' ("Style has an entrance.")
  // Phase 2: 'wordmark' ("ZYLE" staggered + gold line + tagline + ambient glow)
  const [phase, setPhase] = useState<'phrase' | 'wordmark'>('phrase');
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);

  const handleSkipOrFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsExiting(true);
    // Smooth fast exit
    setTimeout(() => {
      onComplete();
    }, 280);
  };

  useEffect(() => {
    // 0.82s: Switch from phrase to wordmark animation
    const phraseTimer = setTimeout(() => {
      setPhase('wordmark');
    }, 820);

    // At ~2.3s total, start smooth dramatic exit transition
    const exitTimer = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        setIsExiting(true);
      }
    }, 2300);

    // At ~2.65s total, fully finish and unmount (well under 3.0s limit)
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2650);

    return () => {
      clearTimeout(phraseTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const letters = ['Z', 'Y', 'L', 'E'];

  return (
    <div
      onClick={handleSkipOrFinish}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
          handleSkipOrFinish();
        }
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0A0A] select-none cursor-pointer overflow-hidden transition-all duration-300 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Skip introduction"
    >
      {/* Subtle background ambient pulse */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 min-h-[220px]">
        {/* Phase 1: "Style has an entrance." (Urbanist, light gray, ~0.8s) */}
        {phase === 'phrase' && (
          <div className="animate-intro-phrase text-center">
            <p className="font-body text-zinc-400 text-sm sm:text-base md:text-lg tracking-widest uppercase font-light">
              Style has an entrance.
            </p>
          </div>
        )}

        {/* Phase 2: "ZYLE" + Gold Underline + Tagline */}
        {phase === 'wordmark' && (
          <div className="flex flex-col items-center justify-center">
            {/* Ambient Gold Glow behind letters */}
            <div className="absolute w-44 sm:w-64 h-24 sm:h-32 bg-[#D4AF37]/25 blur-3xl rounded-full animate-gold-pulse pointer-events-none" />

            {/* Wordmark: ZYLE in Syne bold, large, staggered rise */}
            <h1 className="relative font-heading font-extrabold text-6xl sm:text-8xl md:text-9xl text-white tracking-widest uppercase flex items-center justify-center gap-1 sm:gap-2 leading-none">
              {letters.map((char, index) => (
                <span
                  key={index}
                  className="animate-letter-in inline-block"
                  style={{
                    animationDelay: `${index * 85}ms`,
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>

            {/* Thin Gold Underline / Divider animating under the wordmark */}
            <div
              className="animate-underline-draw w-28 sm:w-44 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-3 sm:my-4 rounded-full"
              style={{
                animationDelay: '360ms',
              }}
            />

            {/* Tagline: "Premium look, pocket price" in Urbanist */}
            <p
              className="animate-tagline-fade font-body text-zinc-300 text-xs sm:text-sm md:text-base tracking-wider uppercase font-medium text-center"
              style={{
                animationDelay: '460ms',
              }}
            >
              Premium look, pocket price
            </p>
          </div>
        )}
      </div>

      {/* Discreet Tap to skip hint at bottom */}
      <div className="absolute bottom-6 sm:bottom-8 z-10 text-[10px] sm:text-xs text-zinc-600 font-body tracking-wider uppercase opacity-75 hover:opacity-100 transition-opacity">
        Tap anywhere to skip
      </div>
    </div>
  );
};
