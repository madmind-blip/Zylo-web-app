import React, { useState, useEffect, useRef } from 'react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'phrase' | 'wordmark'>('phrase');
  const [isExiting, setIsExiting] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    // 0.82s: Switch from phrase to wordmark animation
    const phraseTimer = setTimeout(() => {
      setPhase('wordmark');
    }, 820);

    // At ~2.1s total, start smooth exit transition
    const exitTimer = setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        setIsExiting(true);
      }
    }, 2100);

    // At ~2.45s total, fully finish and unmount
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2450);

    return () => {
      clearTimeout(phraseTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const letters = ['Z', 'Y', 'L', 'E'];

  return (
    <div
      onClick={() => {
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete();
        }
      }}
      className={`fixed inset-0 z-[9999] w-screen h-screen min-h-[100dvh] flex flex-col items-center justify-center bg-[#FAFAFA] select-none overflow-hidden transition-all duration-300 ease-out cursor-pointer ${
        isExiting ? 'opacity-0 scale-102 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-hidden="true"
    >
      {/* Base background */}
      <div className="absolute inset-0 bg-[#FAFAFA]" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 min-h-[220px]">
        {/* Phase 1: "Style has an entrance." (Urbanist, neutral-500, ~0.8s) */}
        {phase === 'phrase' && (
          <div className="animate-intro-phrase text-center">
            <p className="font-body text-neutral-500 text-sm sm:text-base md:text-lg tracking-widest uppercase font-normal">
              Style has an entrance.
            </p>
          </div>
        )}

        {/* Phase 2: "ZYLE" + Line + Tagline */}
        {phase === 'wordmark' && (
          <div className="flex flex-col items-center justify-center">
            {/* Wordmark: ZYLE in Syne bold, staggered rise */}
            <h1 className="relative font-heading font-extrabold text-6xl sm:text-8xl md:text-9xl text-[#1A1A1A] tracking-widest uppercase flex items-center justify-center gap-1 sm:gap-2 leading-none">
              {letters.map((char, index) => (
                <span
                  key={index}
                  className="animate-letter-in inline-block"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >
                  {char}
                </span>
              ))}
            </h1>

            {/* Thin Divider under the wordmark */}
            <div
              className="animate-underline-draw w-20 sm:w-32 h-[2px] bg-[#1A1A1A] my-3 sm:my-4 rounded-full"
              style={{
                animationDelay: '340ms',
              }}
            />

            {/* Tagline: "Premium look, pocket price" */}
            <p
              className="animate-tagline-fade font-body text-neutral-500 text-xs sm:text-sm md:text-base tracking-wider uppercase font-medium text-center"
              style={{
                animationDelay: '440ms',
              }}
            >
              Premium look, pocket price
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
