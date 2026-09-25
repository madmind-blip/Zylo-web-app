import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, X, MessageCircle, MoreVertical } from 'lucide-react';
import { getWhatsAppNumberClean } from '../utils/whatsapp';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory?: (category: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onSelectCategory,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    if (isMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isMenuOpen]);

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

  const navigateTo = (target: string, category?: string) => {
    setIsMenuOpen(false);
    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (onSelectCategory) onSelectCategory('all');
      return;
    }
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    scrollTo(target);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo & 3-Dot Menu Icon */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className="group flex items-baseline gap-1 select-none mr-0.5 sm:mr-1"
            aria-label="Zyle Homepage"
          >
            <span className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-[#1A1A1A] group-hover:text-[#4A5D45] transition-colors">
              ZYLE
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]"></span>
          </a>

          {/* 3-Dot Menu Icon positioned to the right of the ZYLE. logo in open space */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                isMenuOpen
                  ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                  : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-700 hover:text-black'
              }`}
              aria-label="Navigation Menu"
              aria-expanded={isMenuOpen}
              title="Site Navigation Menu"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <>
                {/* Backdrop for outside click */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />

                {/* Dropdown Card */}
                <div className="absolute left-0 top-11 sm:top-13 z-50 w-56 sm:w-60 bg-white border border-neutral-200/90 rounded-2xl shadow-xl py-2 px-1 text-xs sm:text-sm text-[#1A1A1A] animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-neutral-400 tracking-wider">
                    Menu
                  </div>

                  <button
                    onClick={() => navigateTo('home')}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-50 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>Home</span>
                  </button>

                  <button
                    onClick={() => navigateTo('products-section', 'all')}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-50 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>All Products</span>
                  </button>

                  <button
                    onClick={() => navigateTo('combos-section', 'combos')}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-50 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>Ready Combos</span>
                  </button>

                  <button
                    onClick={() => navigateTo('watches-section', 'watches')}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-50 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>Luxury Watches</span>
                  </button>

                  <button
                    onClick={() => navigateTo('combo-builder')}
                    className="w-full text-left px-3 py-2 rounded-xl text-[#4A5D45] hover:bg-[#4A5D45]/5 transition cursor-pointer flex items-center justify-between font-semibold"
                  >
                    <span>Combo Builder (10–15% OFF)</span>
                  </button>

                  <div className="border-t border-neutral-100 my-1" />

                  <button
                    onClick={() => navigateTo('faq-section')}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-50 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>FAQ & Delivery</span>
                  </button>

                  <button
                    onClick={() => navigateTo('about-section')}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-700 hover:text-black hover:bg-neutral-50 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>About Zyle & Kota Hub</span>
                  </button>

                  <div className="border-t border-neutral-100 my-1" />

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleWhatsAppContact();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-[#1A1A1A] hover:bg-neutral-50 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>Chat on WhatsApp</span>
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 ml-6 text-sm font-medium text-neutral-600">
            <button
              onClick={() => navigateTo('products-section', 'all')}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              All Pieces
            </button>
            <button
              onClick={() => navigateTo('combos-section', 'combos')}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              Ready Combos
            </button>
            <button
              onClick={() => navigateTo('watches-section', 'watches')}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              Luxury Watches
            </button>
            <button
              onClick={() => navigateTo('combo-builder')}
              className="text-[#1A1A1A] hover:text-[#4A5D45] transition-colors cursor-pointer font-semibold flex items-center gap-1.5"
            >
              <span>Combo Builder</span>
            </button>
            <button
              onClick={() => navigateTo('faq-section')}
              className="hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              FAQ
            </button>
          </nav>
        </div>

        {/* Right Actions: Search icon & Cart icon (+ WhatsApp help on desktop) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-neutral-50 border border-neutral-200 focus-within:border-[#1A1A1A] rounded-full px-3 py-1.5 w-40 sm:w-64 transition-all">
                <Search className="w-4 h-4 text-neutral-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search catalog..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="bg-transparent text-xs sm:text-sm text-[#1A1A1A] placeholder-neutral-400 focus:outline-none w-full"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    onSearchChange('');
                  }}
                  className="text-neutral-400 hover:text-black p-0.5 cursor-pointer"
                  aria-label="Close search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-600 hover:text-black transition-all cursor-pointer"
                aria-label="Open search"
                title="Search products"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick WhatsApp Support (Desktop only) */}
          <button
            onClick={handleWhatsAppContact}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-700 hover:text-black text-xs font-medium transition-all cursor-pointer"
            title="Chat with Zyle Team on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
            <span>Help</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#1A1A1A] text-white font-heading font-semibold text-xs sm:text-sm hover:bg-[#4A5D45] transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
            aria-label={`Shopping Cart with ${cartCount} items`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            <span className="flex items-center justify-center bg-white text-[#1A1A1A] text-[11px] font-mono font-bold w-4.5 h-4.5 rounded-full">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
