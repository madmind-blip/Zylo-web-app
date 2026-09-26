import React from 'react';
import { MessageCircle, Instagram, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';
import { BRAND } from '../data/content';
import { getWhatsAppNumberClean } from '../utils/whatsapp';
import { PolicyType } from './PolicyModal';

interface FooterProps {
  onOpenPolicy: (type: PolicyType) => void;
  onNavigateContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy, onNavigateContact }) => {
  const handleWhatsApp = () => {
    const phone = getWhatsAppNumberClean();
    const text = encodeURIComponent('Hi Zyle Team! 👋 I found your store online and had a question.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <footer id="about-section" className="bg-white border-t border-neutral-200 text-neutral-600 font-body">
      {/* Top Banner inside Footer */}
      <div className="border-b border-neutral-200 py-8 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[#1A1A1A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-semibold text-[#1A1A1A] text-sm sm:text-base">
                Direct WhatsApp Ordering System
              </div>
              <div className="text-xs text-neutral-500">
                Direct confirmation and instant dispatch tracking from our Kota hub.
              </div>
            </div>
          </div>

          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white font-heading font-semibold text-xs sm:text-sm transition-colors cursor-pointer active:scale-98 shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat +91 7073765833</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-extrabold text-2xl tracking-tight text-[#1A1A1A]">
                ZYLE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]"></span>
            </div>

            <p className="font-heading font-medium text-xs sm:text-sm text-neutral-700">
              {BRAND.tagline}
            </p>

            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
              Curated streetwear combo clothes and high-finish wristwatches at accessible prices. Dispatched directly from Kota, Rajasthan.
            </p>

            {/* Social Icons & Handle */}
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              <a
                href="https://instagram.com/zyle.store_"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-400 text-neutral-700 hover:text-black transition cursor-pointer text-xs font-medium"
                aria-label="Follow Zyle on Instagram @zyle.store_"
              >
                <Instagram className="w-4 h-4 text-[#1A1A1A]" />
                <span>@zyle.store_</span>
              </a>

              <button
                onClick={handleWhatsApp}
                className="w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-black flex items-center justify-center transition cursor-pointer"
                aria-label="Order on WhatsApp"
                title="WhatsApp Chat"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="font-heading font-semibold text-[#1A1A1A] text-xs uppercase tracking-wider mb-4">
              Collections
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#combos-section" className="hover:text-[#1A1A1A] transition-colors">
                  Streetwear Ready Combos
                </a>
              </li>
              <li>
                <a href="#watches-section" className="hover:text-[#1A1A1A] transition-colors">
                  Luxury Pocket Watches
                </a>
              </li>
              <li>
                <a href="#combo-builder" className="hover:text-[#4A5D45] transition-colors font-medium">
                  Custom Bundle Builder
                </a>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-[#1A1A1A] transition-colors">
                  Ordering & Delivery FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div>
            <h4 className="font-heading font-semibold text-[#1A1A1A] text-xs uppercase tracking-wider mb-4">
              Help & Policies
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onOpenPolicy('shipping')}
                  className="hover:text-[#1A1A1A] transition-colors text-left cursor-pointer"
                >
                  Shipping & Kota Dispatch (₹999 Free)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('returns')}
                  className="hover:text-[#1A1A1A] transition-colors text-left cursor-pointer"
                >
                  7-Day Size Exchange & Returns
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('cod')}
                  className="hover:text-[#1A1A1A] transition-colors text-left cursor-pointer"
                >
                  Cash on Delivery (COD) Terms
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('sizing')}
                  className="hover:text-[#1A1A1A] transition-colors text-left cursor-pointer"
                >
                  Streetwear Size & Fit Chart
                </button>
              </li>
              {onNavigateContact && (
                <li>
                  <button
                    onClick={onNavigateContact}
                    className="hover:text-[#1A1A1A] transition-colors text-left cursor-pointer font-medium"
                  >
                    Contact & Feedback (Developer)
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Location & Contact */}
          <div className="space-y-3">
            <h4 className="font-heading font-semibold text-[#1A1A1A] text-xs uppercase tracking-wider mb-4">
              Store & Dispatch Hub
            </h4>
            
            <div className="flex items-start gap-2.5 text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#1A1A1A]">Kota, Rajasthan, India</strong> <br />
                {BRAND.fullAddress}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
              <a href={`tel:${BRAND.whatsappNumber}`} className="hover:text-black font-mono">
                {BRAND.whatsappDisplay}
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Instagram className="w-4 h-4 text-neutral-500 shrink-0" />
              <a
                href="https://instagram.com/zyle.store_"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black font-medium"
              >
                @zyle.store_
              </a>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
              <span className="text-[#4A5D45] font-semibold">● Operating Hours:</span> 10:00 AM – 9:00 PM (Mon–Sun)
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} Zyle Store. All rights reserved. Kota, Rajasthan.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted for streetwear enthusiasts in Kota, Rajasthan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
