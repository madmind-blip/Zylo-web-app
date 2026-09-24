import React, { useState, useEffect } from 'react';
import { Flame, Clock, Sparkles } from 'lucide-react';

export const OfferStrip: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{ hours: string; minutes: string; seconds: string }>({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Target midnight of current day
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);

      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        return { hours: '00', minutes: '00', seconds: '00' };
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      return {
        hours: String(h).padStart(2, '0'),
        minutes: String(m).padStart(2, '0'),
        seconds: String(s).padStart(2, '0'),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-[#141414] via-[#1a1710] to-[#141414] border-b border-[#242424] text-xs py-2 px-3 text-center sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold">
          <Flame className="w-3.5 h-3.5 fill-[#D4AF37] animate-pulse" />
          <span className="tracking-wide uppercase text-[11px] font-heading">Flash Drop Deals</span>
        </div>

        <span className="text-[#A1A1AA] hidden sm:inline">•</span>

        <p className="text-zinc-200 font-medium text-[11px] sm:text-xs">
          Free Delivery over ₹999 & COD Available across India
        </p>

        <span className="text-[#A1A1AA] hidden md:inline">•</span>

        <div className="flex items-center gap-1.5 bg-[#0A0A0A]/90 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-[11px] font-bold">
          <Clock className="w-3 h-3 text-[#D4AF37]" />
          <span>
            Deal ends in {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
          </span>
        </div>
      </div>
    </div>
  );
};
