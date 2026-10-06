import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, X, MessageCircle, MoreVertical, MessageSquare, Heart } from 'lucide-react';
import { getWhatsAppNumberClean } from '../utils/whatsapp';
import { ZyleLogo } from './ZyleLogo';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectCategory?: (category: any) => void;
  onNavigateContact?: () => void;
  onNavigateHome?: () => void;
  currentPage?: 'home' | 'contact';
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  wishlistCount = 0,
  onOpenWishlist,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  onNavigateContact,
  onNavigateHome,
  currentPage = 'home',
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
    if (currentPage === 'contact' && onNavigateHome) {
      onNavigateHome();
    }
    if (target === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (onSelectCategory) onSelectCategory('all');
      return;
    }
    if (category && onSelectCategory) {
      onSelectCategory(category);
    }
    setTimeout(() => {
      scrollTo(target);
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A] border-b border-neutral-800 shadow-md transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & 3-Dot Menu Icon */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0 min-w-0">
          {/* Logo with uploaded SVG */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('home');
            }}
            className="group flex items-center select-none shrink-0 py-0.5 transition-opacity hover:opacity-90"
            aria-label="Zyle Homepage"
          >
            <ZyleLogo className="h-9 sm:h-11 md:h-12 lg:h-13 w-auto text-white group-hover:text-[#EA580C] transition-colors drop-shadow-xs" />
          </a>

          {/* 3-Dot Menu Icon */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 border transition-all cursor-pointer ${
                isMenuOpen
                  ? 'bg-[#EA580C] text-white border-[#EA580C]'
                  : 'bg-white/10 border-white/15 hover:border-white/40 text-white hover:text-[#EA580C]'
              }`}
              aria-label="Navigation Menu"
              aria-expanded={isMenuOpen}
              title="Site Navigation Menu"
            >
              <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-white" />
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
                <div className="absolute left-0 top-11 sm:top-13 z-50 w-56 sm:w-60 bg-[#141414] border border-neutral-800 rounded-2xl shadow-2xl py-2 px-1 text-xs sm:text-sm text-neutral-200 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-neutral-500 tracking-wider">
                    Menu
                  </div>

                  <button
                    onClick={() => navigateTo('home')}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-800/80 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>Home</span>
                  </button>

                  <button
                    onClick={() => navigateTo('products-section', 'all')}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-800/80 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>All Products</span>
                  </button>

                  <button
                    onClick={() => navigateTo('combos-section', 'combos')}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-800/80 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>Ready Combos</span>
                  </button>

                  <button
                    onClick={() => navigateTo('watches-section', 'watches')}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-800/80 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>Luxury Watches</span>
                  </button>

                  <button
                    onClick={() => navigateTo('combo-builder')}
                    className="w-full text-left px-3 py-2 rounded-xl text-[#FB923C] hover:bg-[#EA580C]/20 transition cursor-pointer flex items-center justify-between font-semibold"
                  >
                    <span>Combo Builder (10–15% OFF)</span>
                  </button>

                  <div className="border-t border-neutral-800/80 my-1" />

                  <button
                    onClick={() => navigateTo('about-section')}
                    className="w-full text-left px-3 py-2 rounded-xl text-neutral-200 hover:text-white hover:bg-neutral-800/80 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>About Zyle</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onNavigateContact) {
                        onNavigateContact();
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl transition cursor-pointer flex items-center justify-between font-medium ${
                      currentPage === 'contact'
                        ? 'bg-neutral-800 text-white font-semibold'
                        : 'text-neutral-200 hover:text-white hover:bg-neutral-800/80'
                    }`}
                  >
                    <span>Contact & Feedback</span>
                    <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
                  </button>

                  <div className="border-t border-neutral-800/80 my-1" />

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleWhatsAppContact();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-neutral-800/80 transition cursor-pointer flex items-center justify-between font-medium"
                  >
                    <span>Chat on WhatsApp</span>
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 ml-6 text-sm font-medium">
            <button
              onClick={() => navigateTo('products-section', 'all')}
              className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              All Pieces
            </button>
            <button
              onClick={() => navigateTo('combos-section', 'combos')}
              className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Ready Combos
            </button>
            <button
              onClick={() => navigateTo('watches-section', 'watches')}
              className="text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              Luxury Watches
            </button>
            <button
              onClick={() => navigateTo('combo-builder')}
              className="px-3 py-1 rounded-full bg-[#EA580C]/20 text-[#FB923C] border border-[#EA580C]/50 hover:bg-[#EA580C] hover:text-white transition-all font-semibold flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer shadow-2xs"
            >
              <span>Combo Builder</span>
              <span className="text-[10px] bg-[#EA580C] text-white px-1.5 py-0.5 rounded-full font-bold">
                15% OFF
              </span>
            </button>
            <button
              onClick={() => {
                if (onNavigateContact) onNavigateContact();
              }}
              className={`hover:text-white transition-colors cursor-pointer ${
                currentPage === 'contact'
                  ? 'text-[#EA580C] font-semibold underline underline-offset-4 decoration-[#EA580C]'
                  : 'text-neutral-300'
              }`}
            >
              Contact & Feedback
            </button>
          </nav>
        </div>

        {/* Right Actions: Search icon & Wishlist & Cart icon (+ WhatsApp help on desktop) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 overflow-visible">
          {/* Search Trigger */}
          <div className="relative shrink-0">
            {isSearchOpen ? (
              <div className="flex items-center bg-neutral-900 border border-[#EA580C]/60 focus-within:border-[#EA580C] rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 w-28 sm:w-56 md:w-64 max-w-[36vw] sm:max-w-none transition-all">
                <Search className="w-3.5 h-3.5 text-neutral-400 mr-1.5 shrink-0" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  autoFocus
                  className="bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none w-full min-w-0"
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    onSearchChange('');
                  }}
                  className="text-neutral-400 hover:text-white p-0.5 cursor-pointer shrink-0"
                  aria-label="Close search"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-white/10 border border-white/15 hover:border-white/40 text-white hover:text-[#EA580C] transition-all cursor-pointer"
                aria-label="Open search"
                title="Search products"
              >
                <Search className="w-4 h-4 shrink-0 text-white" />
              </button>
            )}
          </div>

          {/* Wishlist Button */}
          {onOpenWishlist && (
            <button
              onClick={onOpenWishlist}
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-white/10 border border-white/15 hover:border-white/40 text-white hover:text-[#EA580C] transition-all cursor-pointer"
              aria-label={`Wishlist with ${wishlistCount} saved items`}
              title="My Wishlist"
            >
              <Heart
                className={`w-4 h-4 shrink-0 transition-colors ${
                  wishlistCount > 0 ? 'text-[#EA580C] fill-[#EA580C]' : 'text-white'
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center shrink-0 bg-[#EA580C] text-white text-[9px] sm:text-[10px] font-mono font-bold w-4.5 h-4.5 rounded-full border-2 border-black shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* Quick WhatsApp Support (Desktop only) */}
          <button
            onClick={handleWhatsAppContact}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 hover:border-white/40 text-neutral-200 hover:text-white text-xs font-medium transition-all cursor-pointer shrink-0"
            title="Chat with Zyle Team on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
            <span>Help</span>
          </button>

          {/* Cart Button — Red-orange CTA, non-cropped, properly scaled with icon & count */}
          <button
            onClick={onOpenCart}
            className="relative shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 h-9 sm:h-10 px-3 sm:px-4 rounded-full bg-[#EA580C] hover:bg-[#C2410C] text-white font-heading font-semibold text-xs sm:text-sm shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-all duration-200 cursor-pointer active:scale-95 select-none"
            aria-label={`Shopping Cart with ${cartCount} items`}
            title="View Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 stroke-[2.2]" />
            <span className="font-heading font-semibold">Bag</span>
            <span className="flex items-center justify-center shrink-0 bg-white text-[#EA580C] text-[10px] sm:text-[11px] font-mono font-bold min-w-[18px] h-[18px] px-1 rounded-full shadow-2xs">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
