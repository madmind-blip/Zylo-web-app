import React, { useState, useMemo } from 'react';
import { Sparkles, MessageCircle, ShoppingBag, Check, Plus, X, Search, Filter } from 'lucide-react';
import { Product } from '../types';
import { createFlexibleBundleWhatsAppUrl } from '../utils/whatsapp';
import { BRAND } from '../data/content';
import { ProductImage } from './ProductImage';

export interface SelectedBundleItem {
  product: Product;
  size: string;
}

interface ComboBuilderProps {
  products: Product[];
  onAddComboToCart?: (
    items: Array<{ product: Product; size: string }>,
    finalPrice: number,
    discountPercent: number
  ) => void;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'combos', label: 'Combos' },
  { id: 'watches', label: 'Watches' },
  { id: 'wallets', label: 'Wallets' },
  { id: 'glasses', label: 'Glasses' },
  { id: 'jackets', label: 'Jackets' },
  { id: 'socks', label: 'Socks' },
];

function productMatchesCategory(product: Product, categoryId: string): boolean {
  if (categoryId === 'all') return true;
  const cat = (product.category || '').toLowerCase();
  const catGroup = (product.categoryGroup || '').toLowerCase();
  const name = (product.name || '').toLowerCase();
  const tags = (product.tags || []).map((t) => t.toLowerCase());

  const hasTerm = (term: string) =>
    cat.includes(term) || catGroup.includes(term) || name.includes(term) || tags.some((t) => t.includes(term));

  switch (categoryId) {
    case 'combos':
      return catGroup === 'combos' || hasTerm('combo') || hasTerm('tracksuit') || hasTerm('set');
    case 'watches':
      return catGroup === 'watches' || hasTerm('watch');
    case 'wallets':
      return hasTerm('wallet');
    case 'glasses':
      return hasTerm('glass') || hasTerm('sunglass') || hasTerm('shades') || hasTerm('rayban');
    case 'jackets':
      return (
        hasTerm('jacket') ||
        hasTerm('hoodie') ||
        hasTerm('windshitter') ||
        hasTerm('windcheater') ||
        hasTerm('sweatshirt') ||
        hasTerm('coat')
      );
    case 'socks':
      return hasTerm('sock');
    default:
      return hasTerm(categoryId);
  }
}

export const ComboBuilder: React.FC<ComboBuilderProps> = ({ products, onAddComboToCart }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedToast, setAddedToast] = useState(false);

  // Initialize with 3 items from products if available so customer immediately sees the 10% discount in action
  const [selectedItems, setSelectedItems] = useState<SelectedBundleItem[]>(() => {
    if (!products || products.length === 0) return [];
    const initial: SelectedBundleItem[] = [];
    const usedIds = new Set<string>();

    for (const p of products) {
      if (initial.length >= 3) break;
      if (!usedIds.has(p.id)) {
        usedIds.add(p.id);
        const defaultSize = p.sizes && p.sizes.length > 0 ? p.sizes[0] : 'Free Size';
        initial.push({ product: p, size: defaultSize });
      }
    }
    return initial;
  });

  // Calculate product counts per category tab
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tab of CATEGORY_TABS) {
      if (tab.id === 'all') {
        counts[tab.id] = products.length;
      } else {
        counts[tab.id] = products.filter((p) => productMatchesCategory(p, tab.id)).length;
      }
    }
    return counts;
  }, [products]);

  // Filtered products for browsing grid
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = productMatchesCategory(p, activeCategory);
      if (!matchesCat) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesTags = p.tags.some((t) => t.toLowerCase().includes(query));
        return matchesName || matchesCategory || matchesTags;
      }
      return true;
    });
  }, [products, activeCategory, searchQuery]);

  // Pricing & Discount Calculations:
  // - 1-2 items: 0% discount
  // - 3 items: 10% discount
  // - 4+ items: 15% discount
  const itemCount = selectedItems.length;
  const regularTotal = useMemo(() => {
    return selectedItems.reduce((acc, it) => acc + (it.product.price || 0), 0);
  }, [selectedItems]);

  const discountPercent = useMemo(() => {
    if (itemCount >= 4) return 15;
    if (itemCount === 3) return 10;
    return 0;
  }, [itemCount]);

  const discountAmount = useMemo(() => {
    if (discountPercent === 0) return 0;
    return Math.round(regularTotal * (discountPercent / 100));
  }, [regularTotal, discountPercent]);

  const finalPrice = regularTotal - discountAmount;
  const isFreeDelivery = finalPrice >= BRAND.deliveryThreshold && itemCount > 0;

  // Toggle selection
  const handleToggleProduct = (product: Product) => {
    const existingIndex = selectedItems.findIndex((it) => it.product.id === product.id);
    if (existingIndex >= 0) {
      // Remove item
      setSelectedItems((prev) => prev.filter((_, idx) => idx !== existingIndex));
    } else {
      // Add item
      const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size';
      setSelectedItems((prev) => [...prev, { product, size: defaultSize }]);
    }
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems((prev) => prev.filter((it) => it.product.id !== productId));
  };

  const handleUpdateSize = (productId: string, newSize: string) => {
    setSelectedItems((prev) =>
      prev.map((it) => (it.product.id === productId ? { ...it, size: newSize } : it))
    );
  };

  // WhatsApp Order
  const handleOrderWhatsApp = () => {
    if (selectedItems.length === 0) return;
    const url = createFlexibleBundleWhatsAppUrl(
      selectedItems,
      regularTotal,
      discountPercent,
      discountAmount,
      finalPrice
    );
    window.open(url, '_blank');
  };

  // Add Bundle to Cart
  const handleAddToCart = () => {
    if (selectedItems.length === 0 || !onAddComboToCart) return;
    onAddComboToCart(selectedItems, finalPrice, discountPercent);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  if (!products || products.length === 0) return null;

  return (
    <section
      id="combo-builder"
      className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-[#242424] relative overflow-hidden"
    >
      {/* Ambient gold glow mesh */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Bundle Studio</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight mb-3">
            ZYLE BUNDLE BUILDER
          </h2>

          <p className="font-body text-zinc-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Pick <strong className="text-white">ANY 3 items</strong> across our entire catalog to unlock{' '}
            <span className="text-[#D4AF37] font-bold">10% OFF</span>. Add 4 or more items to upgrade to{' '}
            <span className="text-[#D4AF37] font-bold">15% Mega Bundle Savings</span>!
          </p>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Browsable Catalog with Search & Filter Tabs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#141414] border border-[#242424] rounded-2xl p-4 sm:p-5">
              {/* Search Bar & Status */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any item to add..."
                    className="w-full pl-9 pr-8 py-2 bg-[#0A0A0A] border border-[#242424] focus:border-[#D4AF37] rounded-xl text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs p-1 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-zinc-400 flex items-center justify-between sm:justify-end gap-2 shrink-0">
                  <span>
                    Selected: <strong className="text-[#D4AF37]">{itemCount}</strong> items
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span>{filteredProducts.length} available</span>
                </div>
              </div>

              {/* Category Filter Tabs: All, Combos, Watches, Wallets, Glasses, Jackets, Socks */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-[#242424] mb-4">
                {CATEGORY_TABS.map((tab) => {
                  const count = categoryCounts[tab.id] ?? 0;
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 font-bold'
                          : 'bg-[#0A0A0A] text-zinc-400 hover:text-white border border-[#242424] hover:border-zinc-700'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-black/20 text-black font-extrabold' : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Products Browsable Grid */}
              {filteredProducts.length === 0 ? (
                <div className="py-12 text-center text-zinc-400 text-xs">
                  <p className="mb-2 font-medium">No items found matching your filter.</p>
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                    }}
                    className="text-[#D4AF37] underline hover:text-[#E5C158] cursor-pointer"
                  >
                    View All Items
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[640px] overflow-y-auto pr-1">
                  {filteredProducts.map((product) => {
                    const selectedIdx = selectedItems.findIndex((it) => it.product.id === product.id);
                    const isSelected = selectedIdx >= 0;
                    const selectedItem = isSelected ? selectedItems[selectedIdx] : null;

                    return (
                      <div
                        key={product.id}
                        onClick={() => handleToggleProduct(product)}
                        className={`relative rounded-xl p-2.5 bg-[#0A0A0A] border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                          isSelected
                            ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 bg-[#17150e]'
                            : 'border-[#242424] hover:border-zinc-600 opacity-85 hover:opacity-100'
                        }`}
                      >
                        {/* Thumbnail with selection badge */}
                        <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-zinc-900 relative">
                          <ProductImage
                            src={product.images[0]}
                            alt={product.name}
                            productName={product.name}
                            category={product.category}
                          />

                          {/* Selected Check Badge */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#D4AF37] text-black font-heading font-extrabold text-[10px] flex items-center justify-center shadow-md">
                              #{selectedIdx + 1}
                            </div>
                          )}
                        </div>

                        {/* Product Title (Normal name, no hardcoded brand lists) */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-zinc-500 uppercase font-medium truncate mb-0.5">
                            {product.category}
                          </div>
                          <div className="text-xs font-heading font-bold text-white line-clamp-1 mb-1 group-hover:text-[#D4AF37] transition-colors">
                            {product.name}
                          </div>
                        </div>

                        {/* Price and Action */}
                        <div className="pt-1.5 border-t border-[#242424]/60 flex items-center justify-between mt-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs font-heading font-bold text-[#D4AF37]">
                              ₹{product.price}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-[10px] text-zinc-500 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>

                          <span
                            className={`text-[10px] font-heading font-bold px-2 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-[#D4AF37] text-black'
                                : 'bg-[#1a1a1a] text-zinc-300 border border-[#2d2d2d]'
                            }`}
                          >
                            {isSelected ? 'Added ✓' : '+ Add'}
                          </span>
                        </div>

                        {/* Size picker if selected & has multiple sizes */}
                        {isSelected && product.sizes && product.sizes.length > 1 && (
                          <div
                            className="mt-2 pt-2 border-t border-[#242424] flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-[10px] text-zinc-400">Size:</span>
                            <div className="flex flex-wrap gap-1">
                              {product.sizes.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => handleUpdateSize(product.id, s)}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                                    selectedItem?.size === s
                                      ? 'bg-[#D4AF37] text-black font-bold'
                                      : 'bg-zinc-800 text-zinc-300 hover:text-white'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Running Summary Panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="bg-[#141414] border-2 border-[#D4AF37]/60 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
              {/* Top Banner */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#242424] mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                    Live Bundle Studio
                  </span>
                  <h4 className="font-heading font-bold text-lg text-white">Your Curated Set</h4>
                </div>
                <div
                  className={`px-3 py-1 rounded-full font-heading font-extrabold text-xs transition-colors ${
                    discountPercent > 0
                      ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 animate-pulse'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {discountPercent > 0
                    ? `-${discountPercent}% Discount`
                    : `Pick ${Math.max(0, 3 - itemCount)} more`}
                </div>
              </div>

              {/* Discount Milestone Bar */}
              <div className="mb-4 bg-[#0A0A0A] p-2.5 rounded-xl border border-[#242424]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-zinc-400 font-medium">Bundle Progress:</span>
                  <span className="font-heading font-bold text-white">
                    {itemCount === 0 && '0 / 3 items'}
                    {itemCount === 1 && '1 / 3 items (Add 2 for 10% OFF)'}
                    {itemCount === 2 && '2 / 3 items (Add 1 for 10% OFF!)'}
                    {itemCount === 3 && '🎉 3 items (10% OFF Unlocked! Add 1 for 15%)'}
                    {itemCount >= 4 && `🔥 ${itemCount} items (15% Mega Discount Unlocked!)`}
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 ${
                      itemCount >= 4
                        ? 'bg-gradient-to-r from-[#D4AF37] to-amber-300 w-full'
                        : itemCount === 3
                        ? 'bg-[#D4AF37] w-3/4'
                        : itemCount === 2
                        ? 'bg-[#D4AF37]/70 w-1/2'
                        : itemCount === 1
                        ? 'bg-[#D4AF37]/50 w-1/4'
                        : 'w-0'
                    }`}
                  />
                </div>
              </div>

              {/* Selected Items Stack */}
              <div className="space-y-2 mb-5 max-h-56 overflow-y-auto pr-1">
                {selectedItems.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${idx}`}
                    className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-[#0A0A0A] border border-[#242424] hover:border-zinc-700 transition"
                  >
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-zinc-900 shrink-0">
                      <ProductImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        productName={item.product.name}
                        category={item.product.category}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-heading font-bold text-white truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center gap-1.5">
                        <span className="text-[#D4AF37] font-semibold">₹{item.product.price}</span>
                        {item.size && item.size !== 'Free Size' && (
                          <span className="text-zinc-500">• Size: {item.size}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-zinc-500 hover:text-red-400 p-1 rounded-lg transition cursor-pointer"
                      aria-label="Remove item"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Empty placeholder slots up to 3 */}
                {Array.from({ length: Math.max(0, 3 - itemCount) }).map((_, i) => {
                  const slotNumber = itemCount + i + 1;
                  return (
                    <div
                      key={`placeholder-${i}`}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-zinc-800 text-zinc-500 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center text-[10px]">
                          {slotNumber}
                        </span>
                        <span>Pick any item from catalog</span>
                      </div>
                      <Plus className="w-3.5 h-3.5 text-zinc-600" />
                    </div>
                  );
                })}
              </div>

              {/* Running Pricing Breakdown */}
              <div className="space-y-2 py-3.5 border-y border-[#242424] text-xs sm:text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Regular Total ({itemCount} item{itemCount === 1 ? '' : 's'}):</span>
                  <span className={discountPercent > 0 ? 'line-through text-zinc-500' : 'text-white'}>
                    ₹{regularTotal}
                  </span>
                </div>

                <div
                  className={`flex justify-between font-semibold ${
                    discountPercent > 0 ? 'text-emerald-400' : 'text-zinc-500'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Bundle Savings ({discountPercent}% OFF):
                  </span>
                  <span>{discountPercent > 0 ? `-₹${discountAmount}` : '₹0'}</span>
                </div>

                <div className="flex justify-between text-zinc-300">
                  <span>Shipping:</span>
                  <span className={isFreeDelivery ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                    {itemCount === 0
                      ? 'Calculated on order'
                      : isFreeDelivery
                      ? 'FREE Delivery'
                      : `+₹${BRAND.standardShippingFee}`}
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-baseline border-t border-[#242424]/60">
                  <div>
                    <span className="font-heading font-bold text-base text-white">Bundle Deal Price:</span>
                    {discountAmount > 0 && (
                      <div className="text-[11px] text-emerald-400 font-semibold">
                        You save ₹{discountAmount}!
                      </div>
                    )}
                  </div>
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#D4AF37]">
                    ₹{finalPrice}
                  </span>
                </div>
              </div>

              {/* Delivery dispatch info */}
              <div className="my-4 p-2.5 rounded-xl bg-[#0A0A0A] border border-[#242424] text-center text-xs text-zinc-300">
                🚀 <strong className="text-white">Same-Day Dispatch</strong> from Kota, Rajasthan • COD Available
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleOrderWhatsApp}
                  disabled={itemCount === 0}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-50 disabled:cursor-not-allowed text-black font-heading font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#25D366]/20 active:scale-[0.98] cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-black stroke-black" />
                  <span>Order Combo on WhatsApp</span>
                </button>

                {onAddComboToCart && (
                  <button
                    onClick={handleAddToCart}
                    disabled={itemCount === 0}
                    className="w-full py-3 px-4 rounded-2xl bg-[#242424] hover:bg-[#2d2d2d] disabled:opacity-50 disabled:cursor-not-allowed text-white border border-zinc-700 font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                    <span>{addedToast ? 'Bundle Added to Bag! ✓' : 'Add Combo to Bag'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
