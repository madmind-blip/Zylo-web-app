import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, MapPin } from 'lucide-react';
import { BRAND } from '../data/content';

interface HeroProps {
  onShopCombos: () => void;
  onExploreBuilder: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopCombos, onExploreBuilder }) => {
  return (
    <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden border-b border-[#242424]">
      {/* Cinematic Dark Background with Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1800&q=80"
          alt="Zyle Streetwear and Watch Showcase"
          className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-125 scale-105 transform motion-safe:animate-pulse duration-[10000ms]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-[#0A0A0A]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        {/* Origin / Trust Chip */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414]/90 border border-[#242424] text-xs font-medium text-zinc-300 mb-6 backdrop-blur-md shadow-inner">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
          </span>
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Direct Warehouse in <strong className="text-white">Kota, Rajasthan</strong></span>
          <span className="text-zinc-600">•</span>
          <span className="text-[#D4AF37] font-semibold">COD Available</span>
        </div>

        {/* Big Syne Headline */}
        <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-white uppercase leading-[1.05] sm:leading-[1] mb-4">
          UPGRADE YOUR <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F5E6BE] to-[#D4AF37]">
            DRIP GAME
          </span>
        </h1>

        {/* Tagline */}
        <p className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-[#D4AF37] tracking-normal mb-4">
          {BRAND.tagline}
        </p>

        {/* Short Offer / Description Text */}
        <p className="font-body text-zinc-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed mb-8">
          Curated streetwear combo clothes and high-finish watches engineered for maximum style without burning a hole in your pocket. Fast 24-hr Kota dispatch with instant WhatsApp checkout.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto">
          <button
            onClick={onShopCombos}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#D4AF37] text-black font-heading font-bold text-base hover:bg-[#E5C158] transition-all duration-300 shadow-xl shadow-[#D4AF37]/25 hover:shadow-[#D4AF37]/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>Shop Combos</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>

          <button
            onClick={onExploreBuilder}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#141414] hover:bg-[#1A1A1A] text-white border border-[#242424] hover:border-[#D4AF37]/50 font-heading font-semibold text-base transition-all duration-300 cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
            <span>Combo Builder (-10%)</span>
          </button>
        </div>

        {/* 3 Pillar Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-12 max-w-4xl mx-auto text-left">
          <div className="bg-[#141414]/70 border border-[#242424] rounded-2xl p-3 backdrop-blur-sm">
            <Truck className="w-4 h-4 text-[#D4AF37] mb-1" />
            <div className="font-heading font-bold text-xs text-white">Free Delivery</div>
            <div className="text-[11px] text-zinc-400">On all orders &gt; ₹999</div>
          </div>

          <div className="bg-[#141414]/70 border border-[#242424] rounded-2xl p-3 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] mb-1" />
            <div className="font-heading font-bold text-xs text-white">COD Available</div>
            <div className="text-[11px] text-zinc-400">Pay on doorstep delivery</div>
          </div>

          <div className="bg-[#141414]/70 border border-[#242424] rounded-2xl p-3 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-[#D4AF37] mb-1" />
            <div className="font-heading font-bold text-xs text-white">Combo Builder</div>
            <div className="text-[11px] text-zinc-400">1 Top + 1 Pant + 1 Watch</div>
          </div>

          <div className="bg-[#141414]/70 border border-[#242424] rounded-2xl p-3 backdrop-blur-sm">
            <MapPin className="w-4 h-4 text-[#D4AF37] mb-1" />
            <div className="font-heading font-bold text-xs text-white">Kota Warehouse</div>
            <div className="text-[11px] text-zinc-400">Same-day dispatch hub</div>
          </div>
        </div>
      </div>
    </section>
  );
};
