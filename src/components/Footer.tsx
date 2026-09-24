import React from 'react';
import { MessageCircle, Instagram, MapPin, Phone, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { BRAND } from '../data/content';
import { getWhatsAppNumberClean } from '../utils/whatsapp';
import { PolicyType } from './PolicyModal';

interface FooterProps {
  onOpenPolicy: (type: PolicyType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy }) => {
  const handleWhatsApp = () => {
    const phone = getWhatsAppNumberClean();
    const text = encodeURIComponent('Hi Zyle Team! 👋 I found your store online and had a question.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#242424] text-zinc-400 font-body">
      {/* Top Banner inside Footer */}
      <div className="border-b border-[#242424] py-8 bg-[#141414]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-white text-base">
                Direct WhatsApp Ordering System
              </div>
              <div className="text-xs text-zinc-400">
                No slow payment gateway forms. Immediate confirmation from Kota dispatch.
              </div>
            </div>
          </div>

          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-heading font-extrabold text-xs sm:text-sm transition-all shadow-lg shadow-[#25D366]/20 cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-black stroke-black" />
            <span>Chat +91 7073765833</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-extrabold text-3xl tracking-tight text-white">
                ZYLE
              </span>
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
            </div>

            <p className="font-heading font-bold text-sm text-[#D4AF37]">
              {BRAND.tagline}
            </p>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Democratizing high-street drip. We curate heavyweight streetwear combo clothes and luxury-finish wristwatches at honest pocket prices.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#141414] border border-[#242424] hover:border-[#D4AF37] text-zinc-300 hover:text-[#D4AF37] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Follow Zyle on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <button
                onClick={handleWhatsApp}
                className="w-10 h-10 rounded-full bg-[#141414] border border-[#242424] hover:border-[#25D366] text-zinc-300 hover:text-[#25D366] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Order on WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#combos-section" className="hover:text-[#D4AF37] transition-colors">
                  Streetwear Ready Combos
                </a>
              </li>
              <li>
                <a href="#watches-section" className="hover:text-[#D4AF37] transition-colors">
                  Luxury Pocket Watches
                </a>
              </li>
              <li>
                <a href="#combo-builder" className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 text-[#D4AF37] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Custom 3-Piece Combo Builder
                </a>
              </li>
              <li>
                <a href="#reviews-section" className="hover:text-[#D4AF37] transition-colors">
                  Customer Reviews & Ratings
                </a>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-[#D4AF37] transition-colors">
                  Ordering & Delivery FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Help & Policies
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onOpenPolicy('shipping')}
                  className="hover:text-[#D4AF37] transition-colors text-left cursor-pointer"
                >
                  Shipping & Kota Dispatch (₹999 Free)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('returns')}
                  className="hover:text-[#D4AF37] transition-colors text-left cursor-pointer"
                >
                  7-Day Size Exchange & Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('cod')}
                  className="hover:text-[#D4AF37] transition-colors text-left cursor-pointer"
                >
                  Cash on Delivery (COD) Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('sizing')}
                  className="hover:text-[#D4AF37] transition-colors text-left cursor-pointer"
                >
                  Streetwear Size & Fit Chart
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Store & Dispatch Hub
            </h4>
            
            <div className="flex items-start gap-2.5 text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>
                <strong>Kota, Rajasthan, India</strong> <br />
                {BRAND.fullAddress}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href={`tel:${BRAND.whatsappNumber}`} className="hover:text-white font-mono">
                {BRAND.whatsappDisplay}
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Instagram className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" className="hover:text-white">
                {BRAND.instagramHandle}
              </a>
            </div>

            <div className="p-3 rounded-xl bg-[#141414] border border-[#242424] text-xs">
              <span className="text-emerald-400 font-semibold">● Operating Hours:</span> 10:00 AM – 9:00 PM (Mon–Sun)
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#242424] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} Zyle Store. All rights reserved. Made for fashion enthusiasts in Kota, Rajasthan.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
            <span>in Kota, Rajasthan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
