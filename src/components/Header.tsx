import React, { useState } from 'react';
import { ShoppingBag, Search, X, MessageCircle, Sparkles, FileSpreadsheet } from 'lucide-react';
import { getWhatsAppNumberClean } from '../utils/whatsapp';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSheetModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onOpenSheetModal,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleWhatsAppContact = () => {
    const phone = getWhatsAppNumberClean();
    const text = encodeURIComponent('Hi Zyle team! 👋 I have a question about your combo clothes and watches.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-[33px] z-40 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#242424] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="group flex flex-col justify-center select-none"
            aria-label="Zyle Homepage"
          >
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-white group-hover:text-[#D4AF37] transition-colors">
                ZYLE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
            </div>
            <span className="text-[10px] sm:text-xs text-[#A1A1AA] tracking-wider uppercase font-medium">
              Kota, Rajasthan
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 ml-8 text-sm font-medium text-zinc-300">
            <button
              onClick={() => scrollTo('combos-section')}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              Ready Combos
            </button>
            <button
              onClick={() => scrollTo('watches-section')}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              Luxury Watches
            </button>
            <button
              onClick={() => scrollTo('combo-builder')}
              className="flex items-center gap-1.5 text-[#D4AF37] hover:brightness-125 transition-all cursor-pointer font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Combo Builder
            </button>
            <button
              onClick={() => scrollTo('faq-section')}
              className="hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-[#141414] border border-[#242424] focus-within:border-[#D4AF37] rounded-full px-3 py-1.5 w-44 sm:w-64 transition-all">
                <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search combos, watches..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="bg-transparent text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none w-full"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    onSearchChange('');
                  }}
                  className="text-zinc-400 hover:text-white p-0.5"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#141414] border border-[#242424] hover:border-[#D4AF37]/50 text-zinc-300 hover:text-white transition-all cursor-pointer"
                aria-label="Open search"
                title="Search products"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Google Sheet Sync Button */}
          {onOpenSheetModal && (
            <button
              onClick={onOpenSheetModal}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#141414] border border-[#242424] hover:border-[#D4AF37]/60 text-zinc-300 hover:text-[#D4AF37] transition-all cursor-pointer"
              aria-label="Google Sheet CSV Sync"
              title="Sync Products with Google Sheet CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
          )}

          {/* Quick WhatsApp Support */}
          <button
            onClick={handleWhatsAppContact}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#141414] border border-[#242424] hover:border-[#25D366]/50 text-zinc-300 hover:text-emerald-400 text-xs font-medium transition-all cursor-pointer"
            title="Chat with Zyle Team on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Help</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#D4AF37] text-black font-heading font-bold text-xs sm:text-sm hover:bg-[#E5C158] transition-all duration-200 cursor-pointer shadow-lg shadow-[#D4AF37]/20 active:scale-95"
            aria-label={`Shopping Cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
            <span className="hidden sm:inline">Bag</span>
            <span className="flex items-center justify-center bg-black text-[#D4AF37] text-xs font-mono font-bold w-5 h-5 rounded-full">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
