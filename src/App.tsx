/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { OfferStrip } from './components/OfferStrip';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryChips, CategoryFilter } from './components/CategoryChips';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { ProductSkeletonGrid } from './components/ProductSkeleton';
import { ComboBuilder } from './components/ComboBuilder';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { PolicyModal, PolicyType } from './components/PolicyModal';
import { CinematicIntro } from './components/CinematicIntro';
import { SheetSettingsModal } from './components/SheetSettingsModal';
import { PRODUCTS } from './data/products';
import { BRAND } from './data/content';
import { Product, CartItem } from './types';
import { MessageCircle, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { getWhatsAppNumberClean } from './utils/whatsapp';
import { fetchProductsFromSheetUrl, PUBLISHED_SHEET_CSV_URL } from './utils/csvParser';

export default function App() {
  // First-visit cinematic entry screen (React state only, not localStorage)
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Products loaded dynamically from the published Google Sheet CSV
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeSheetUrl, setActiveSheetUrl] = useState<string>(PUBLISHED_SHEET_CSV_URL);
  const [isSheetModalOpen, setIsSheetModalOpen] = useState<boolean>(false);

  // Live fetch function
  const loadProducts = useCallback(async (targetUrl: string = activeSheetUrl) => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const fetched = await fetchProductsFromSheetUrl(targetUrl);
      setProducts(fetched);
    } catch (err: any) {
      console.error('Failed to load products from Google Sheet:', err);
      setFetchError(
        err.message ||
          'Unable to load live catalog from Google Sheets. Please check your internet connection or sheet permissions.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeSheetUrl]);

  // Load products on mount
  useEffect(() => {
    loadProducts(PUBLISHED_SHEET_CSV_URL);
  }, []);

  // Navigation & Filter State
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart State (clean, empty by default)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Filter & Sort Logic
  // Filter chips: All, Combos, Watches, Under ₹1500, Under ₹2000, Under ₹2500
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category / Tag Chip Filter: All, Combos, Watches, Under ₹1500, Under ₹2000, Under ₹2500
    if (selectedCategory === 'combos') {
      list = list.filter(
        (p) =>
          p.categoryGroup === 'combos' ||
          p.category.toLowerCase().includes('combo')
      );
    } else if (selectedCategory === 'watches') {
      list = list.filter(
        (p) =>
          p.categoryGroup === 'watches' ||
          p.category.toLowerCase().includes('watch')
      );
    } else if (selectedCategory === 'under-1500') {
      list = list.filter(
        (p) =>
          p.price <= 1500 ||
          p.tags.some((t) => t.toLowerCase().includes('1500') || t.toLowerCase().includes('1200'))
      );
    } else if (selectedCategory === 'under-2000') {
      list = list.filter(
        (p) =>
          p.price <= 2000 ||
          p.tags.some((t) => t.toLowerCase().includes('2000') || t.toLowerCase().includes('1500') || t.toLowerCase().includes('1200'))
      );
    } else if (selectedCategory === 'under-2500') {
      list = list.filter(
        (p) =>
          p.price <= 2500 ||
          p.tags.some((t) => t.toLowerCase().includes('2500') || t.toLowerCase().includes('2000'))
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => b.discountPercent - a.discountPercent);
    } else {
      // featured default
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // Cart operations
  const handleAddToCart = (product: Product, size?: string, quantity: number = 1) => {
    const itemSize = size || (product.sizes?.[0] || 'Free Size');
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === itemSize && !item.isCustomCombo
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            product,
            selectedSize: itemSize,
            quantity,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" (${itemSize}) to your bag`);
  };

  const handleAddCustomComboToCart = (
    top: { product: Product; size: string },
    bottom: { product: Product; size: string },
    watch: { product: Product },
    finalPrice: number
  ) => {
    const originalPrice = Math.round(finalPrice / 0.9);
    const comboProduct: Product = {
      id: `custom-combo-${Date.now()}`,
      name: `Custom Drip Set (${top.product.name} + ${bottom.product.name} + ${watch.product.name})`,
      category: 'Combo Custom',
      categoryGroup: 'combos',
      price: finalPrice,
      originalPrice,
      discountPercent: 10,
      stock: 10,
      images: [top.product.images[0] || '', bottom.product.images[0] || '', watch.product.images[0] || ''],
      sizes: ['Complete Set'],
      isFreeSize: true,
      description: 'Handcrafted custom drip combo with 10% instant bundle discount.',
      details: [
        `Piece 1: ${top.product.name} [${top.size}]`,
        `Piece 2: ${bottom.product.name} [${bottom.size}]`,
        `Piece 3: ${watch.product.name}`,
        '10% Instant Combo Discount applied',
      ],
      tags: ['Combo', 'Custom', 'Bundle'],
    };

    setCartItems((prev) => [
      ...prev,
      {
        id: `combo-${Date.now()}`,
        product: comboProduct,
        selectedSize: 'Complete Set',
        quantity: 1,
        isCustomCombo: true,
        comboItems: {
          top: { name: top.product.name, size: top.size },
          bottom: { name: bottom.product.name, size: bottom.size },
          watch: { name: watch.product.name },
        },
      },
    ]);

    showToast('Custom Combo added to your bag!');
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item removed from bag');
  };

  const scrollToCombos = () => {
    setSelectedCategory('combos');
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToWatches = () => {
    setSelectedCategory('watches');
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBuilder = () => {
    const el = document.getElementById('combo-builder');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  const handleFloatingWhatsApp = () => {
    const phone = getWhatsAppNumberClean();
    const text = encodeURIComponent('Hi Zyle Team! 👋 I am browsing your store from Kota. I have a question about an order.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3F4F6] selection:bg-[#D4AF37] selection:text-black">
      {/* Cinematic entry / loading screen (plays once per session, skip on tap) */}
      {showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}

      {/* 7. Offer strip with countdown timer that resets daily */}
      <OfferStrip />

      {/* 1. Sticky header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSheetModal={() => setIsSheetModalOpen(true)}
      />

      <main>
        {/* 2. Cinematic Hero */}
        <Hero
          onShopCombos={scrollToCombos}
          onExploreBuilder={scrollToBuilder}
          featuredImageUrl={products[1]?.images?.[0] || 'https://i.ibb.co/zK5ZGtF/IMG-20260924-171902-630.jpg'}
        />

        {/* 3. Category & Filter Chips: All, Combos, Watches, Under ₹1500, Under ₹2000, Under ₹2500 */}
        <div id="products-section">
          <CategoryChips
            activeCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalCount={isLoading ? 0 : filteredProducts.length}
          />
        </div>

        {/* 4. Product Grid (2 columns on mobile, 4 on desktop) */}
        <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-[10px] sm:text-xs uppercase font-bold tracking-widest text-[#D4AF37] mb-1">
                Pocket Price Luxury • Kota Hub
              </div>
              <h2 className="font-heading font-extrabold text-2xl sm:text-4xl text-white">
                {selectedCategory === 'combos'
                  ? 'Clothing Combos'
                  : selectedCategory === 'watches'
                  ? 'Luxury Watches Under Pocket Price'
                  : selectedCategory === 'under-1500'
                  ? 'Best Sellers Under ₹1500'
                  : selectedCategory === 'under-2000'
                  ? 'Best Sellers Under ₹2000'
                  : selectedCategory === 'under-2500'
                  ? 'Best Sellers Under ₹2500'
                  : 'All Trending Drops'}
              </h2>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
              >
                Clear search
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-body tracking-wider uppercase mb-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
                Loading live catalog from Google Sheets...
              </div>
              <ProductSkeletonGrid count={8} />
            </div>
          ) : fetchError ? (
            <div className="py-14 px-6 max-w-lg mx-auto text-center bg-[#141414] border border-amber-500/30 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-[#D4AF37] shadow-inner">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-white mb-2">
                Unable to Load Live Catalog
              </h3>
              <p className="font-body text-xs sm:text-sm text-zinc-400 mb-6 max-w-md mx-auto leading-relaxed">
                {fetchError}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => loadProducts(activeSheetUrl)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#D4AF37] text-black font-heading font-bold text-xs uppercase tracking-wider hover:bg-[#E5C158] transition-all cursor-pointer shadow-lg shadow-[#D4AF37]/20"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button
                  onClick={() => {
                    setProducts(PRODUCTS);
                    setFetchError(null);
                    showToast('Loaded offline catalog');
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[#1c1c1c] text-zinc-300 hover:text-white border border-[#2e2e2e] font-heading font-semibold text-xs tracking-wider transition-all cursor-pointer hover:border-zinc-700"
                >
                  Load Offline Catalog
                </button>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-[#141414] border border-[#242424] rounded-3xl p-8 max-w-xl mx-auto">
              <h3 className="font-heading font-bold text-lg text-white mb-2">
                No products found
              </h3>
              <p className="text-xs text-zinc-400 mb-6 font-body">
                {searchQuery
                  ? `No items matched "${searchQuery}".`
                  : 'No items in this category filter.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-5 py-2 rounded-full bg-[#D4AF37] text-black font-heading font-bold text-xs hover:bg-[#E5C158] transition cursor-pointer"
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setActiveProduct(p)}
                  onAddToCart={(p, e) => {
                    e.stopPropagation();
                    handleAddToCart(p);
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* 6. COMBO BUILDER: 1 top + 1 bottom + 1 watch, live price + 10% discount */}
        <ComboBuilder
          products={products}
          onAddComboToCart={handleAddCustomComboToCart}
        />

        {/* Dedicated section anchors for nav */}
        <div id="combos-section" />
        <div id="watches-section" />

        {/* 8. FAQ Section */}
        <FAQSection />
      </main>

      {/* 10. Footer */}
      <Footer onOpenPolicy={(type) => setActivePolicy(type)} />

      {/* 5. Product Detail Popup Modal */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={(product, size, qty) => {
          handleAddToCart(product, size, qty);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onShopCombos={scrollToCombos}
      />

      {/* Policy Modal */}
      <PolicyModal
        type={activePolicy}
        onClose={() => setActivePolicy(null)}
      />

      {/* Google Sheet Sync Modal */}
      <SheetSettingsModal
        isOpen={isSheetModalOpen}
        onClose={() => setIsSheetModalOpen(false)}
        currentUrl={activeSheetUrl}
        onSaveUrl={async (newUrl) => {
          setActiveSheetUrl(newUrl);
          await loadProducts(newUrl);
          showToast('Synced with Google Sheet!');
        }}
        onLoadCustomProducts={(custom) => {
          setProducts(custom);
          showToast(`Loaded ${custom.length} products`);
        }}
        onResetDefault={() => {
          setActiveSheetUrl(PUBLISHED_SHEET_CSV_URL);
          loadProducts(PUBLISHED_SHEET_CSV_URL);
          showToast('Reset to default sheet');
        }}
        isLoading={isLoading}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#141414] border border-[#D4AF37] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-heading font-bold animate-bounce">
          <Check className="w-4 h-4 text-[#D4AF37]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating WhatsApp Action on Mobile & Desktop */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={handleFloatingWhatsApp}
          className="group relative flex items-center gap-2 px-3.5 sm:px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-black font-heading font-extrabold text-xs sm:text-sm shadow-2xl shadow-[#25D366]/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Order or Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-black stroke-black shrink-0" />
          <span className="hidden sm:inline font-bold">Order on WhatsApp</span>
          <span className="sm:hidden font-bold">WhatsApp</span>
          <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping absolute top-1 right-1" />
        </button>
      </div>
    </div>
  );
}
