/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import { ContactFeedbackPage } from './components/ContactFeedbackPage';
import { PRODUCTS } from './data/products';
import { BRAND } from './data/content';
import { Product, CartItem } from './types';
import { MessageCircle, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { getWhatsAppNumberClean } from './utils/whatsapp';
import { fetchProductsFromSheetUrl, PUBLISHED_SHEET_CSV_URL, parseProductSizes } from './utils/csvParser';

export default function App() {
  // First-visit cinematic entry screen (React state only, not localStorage)
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Products loaded dynamically from the published Google Sheet CSV (permanent data source)
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Live fetch function permanently wired to published Google Sheet CSV
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const fetched = await fetchProductsFromSheetUrl(PUBLISHED_SHEET_CSV_URL);
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
  }, []);

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
    const parsedSizes = parseProductSizes(product.sizes);
    const itemSize = size || (parsedSizes.sizes[0] || 'Free Size');
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
    items: Array<{ product: Product; size: string }>,
    finalPrice: number,
    discountPercent: number
  ) => {
    const originalPrice = items.reduce((acc, it) => acc + (it.product.price || 0), 0);
    const itemNames = items.map((it) => it.product.name).join(' + ');
    const comboProduct: Product = {
      id: `custom-bundle-${Date.now()}`,
      name: `Custom Bundle (${items.length} Items: ${itemNames.length > 40 ? itemNames.slice(0, 40) + '...' : itemNames})`,
      category: 'Custom Bundle',
      categoryGroup: 'combos',
      price: finalPrice,
      originalPrice,
      discountPercent,
      stock: 10,
      images: items.map((it) => it.product.images[0] || '').filter(Boolean).slice(0, 4),
      sizes: ['Complete Set'],
      isFreeSize: true,
      description: `Handcrafted custom bundle with ${discountPercent}% discount.`,
      details: [
        ...items.map((it, idx) => `Item ${idx + 1}: ${it.product.name}${it.size && it.size !== 'Free Size' ? ` [${it.size}]` : ''}`),
        ...(discountPercent > 0 ? [`${discountPercent}% Instant Bundle Discount applied`] : []),
      ],
      tags: ['Combo', 'Custom', 'Bundle'],
    };

    setCartItems((prev) => [
      ...prev,
      {
        id: `bundle-${Date.now()}`,
        product: comboProduct,
        selectedSize: 'Complete Set',
        quantity: 1,
        isCustomCombo: true,
        comboItems: items.length >= 3 ? {
          top: { name: items[0].product.name, size: items[0].size || 'Free Size' },
          bottom: { name: items[1].product.name, size: items[1].size || 'Free Size' },
          watch: { name: items[2].product.name },
        } : undefined,
      },
    ]);

    showToast(`Custom Bundle (${items.length} items) added to your bag!`);
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

  // Accessible page routing for Contact & Feedback
  const [currentPage, setCurrentPage] = useState<'home' | 'contact'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (
        hash === '#contact' ||
        hash === '#feedback' ||
        hash === '#contact-feedback' ||
        window.location.pathname === '/contact'
      ) {
        return 'contact';
      }
    }
    return 'home';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (
        hash === '#contact' ||
        hash === '#feedback' ||
        hash === '#contact-feedback'
      ) {
        setCurrentPage('contact');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '' || hash === '#home') {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  const navigateToContact = () => {
    setCurrentPage('contact');
    window.location.hash = 'contact';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setCurrentPage('home');
    if (
      window.location.hash === '#contact' ||
      window.location.hash === '#feedback' ||
      window.location.hash === '#contact-feedback'
    ) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFloatingWhatsApp = () => {
    const phone = getWhatsAppNumberClean();
    const text = encodeURIComponent('Hi Zyle Team! 👋 I am browsing your store from Kota. I have a question about an order.');
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-white">
      {/* Cinematic entry / loading screen (plays once per session, skip on tap) */}
      {showIntro && <CinematicIntro onComplete={() => setShowIntro(false)} />}

      {/* 1. Sticky header */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={setSelectedCategory}
        onNavigateContact={navigateToContact}
        onNavigateHome={navigateToHome}
        currentPage={currentPage}
      />

      <main>
        {currentPage === 'contact' ? (
          <ContactFeedbackPage onBackToHome={navigateToHome} />
        ) : (
          <>
            {/* 2. Minimal Hero */}
            <Hero
              onShopCombos={scrollToCombos}
              onExploreBuilder={scrollToBuilder}
              featuredImageUrl={products[1]?.images?.[0] || 'https://i.ibb.co/zK5ZGtF/IMG-20260924-171902-630.jpg'}
              isIntroActive={showIntro}
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
            <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-[11px] sm:text-xs uppercase font-medium tracking-widest text-neutral-500 mb-1">
                    Curated Collection • Kota Hub
                  </div>
                  <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1A1A1A]">
                    {selectedCategory === 'combos'
                      ? 'Clothing Combos'
                      : selectedCategory === 'watches'
                      ? 'Luxury Watches'
                      : selectedCategory === 'under-1500'
                      ? 'Curated Under ₹1,500'
                      : selectedCategory === 'under-2000'
                      ? 'Curated Under ₹2,000'
                      : selectedCategory === 'under-2500'
                      ? 'Curated Under ₹2,500'
                      : 'All Pieces'}
                  </h2>
                </div>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-neutral-500 hover:text-black underline cursor-pointer"
                  >
                    Clear search
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium tracking-wider uppercase mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#1A1A1A] animate-ping" />
                    Loading live catalog from Google Sheets...
                  </div>
                  <ProductSkeletonGrid count={8} />
                </div>
              ) : fetchError ? (
                <div className="py-14 px-6 max-w-lg mx-auto text-center bg-white border border-neutral-200 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center mx-auto mb-4 text-[#1A1A1A]">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-[#1A1A1A] mb-2">
                    Unable to Load Live Catalog
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-neutral-500 mb-6 max-w-md mx-auto leading-relaxed">
                    {fetchError}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => loadProducts()}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>
                    <button
                      onClick={() => {
                        setProducts(PRODUCTS);
                        setFetchError(null);
                        showToast('Loaded offline catalog');
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-neutral-100 text-neutral-700 hover:text-black border border-neutral-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Load Offline Catalog
                    </button>
                  </div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-white border border-neutral-200 rounded-2xl p-8 max-w-xl mx-auto">
                  <h3 className="font-heading font-bold text-base sm:text-lg text-[#1A1A1A] mb-2">
                    No products found
                  </h3>
                  <p className="text-xs text-neutral-500 mb-6 font-body">
                    {searchQuery
                      ? `No items matched "${searchQuery}".`
                      : 'No items in this category filter.'}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    View All Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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

            {/* 6. COMBO BUILDER */}
            <ComboBuilder
              products={products}
              onAddComboToCart={handleAddCustomComboToCart}
            />

            {/* Dedicated section anchors for nav */}
            <div id="combos-section" />
            <div id="watches-section" />

            {/* 8. FAQ Section */}
            <FAQSection />
          </>
        )}
      </main>

      {/* 10. Footer */}
      <Footer
        onOpenPolicy={(type) => setActivePolicy(type)}
        onNavigateContact={navigateToContact}
      />

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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] border border-neutral-700 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium">
          <Check className="w-3.5 h-3.5 text-[#4A5D45]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating WhatsApp Action on Mobile & Desktop */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={handleFloatingWhatsApp}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-semibold shadow-xl transition-all duration-200 cursor-pointer active:scale-95"
          aria-label="Order or Chat on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-white shrink-0" />
          <span className="hidden sm:inline">WhatsApp Order</span>
          <span className="sm:hidden">WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
