import React, { useState, useMemo } from 'react';
import { MessageCircle, ShoppingBag, Plus, X, Search } from 'lucide-react';
import { Product } from '../types';
import { createFlexibleBundleWhatsAppUrl, OrderItemSummary } from '../utils/whatsapp';
import { BRAND } from '../data/content';
import { ProductImage } from './ProductImage';
import { CheckoutModal } from './CheckoutModal';

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
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

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

  // WhatsApp Order Flow with Order Form
  const handleOrderWhatsApp = () => {
    if (selectedItems.length === 0) return;
    setIsCheckoutModalOpen(true);
  };

  // Add Bundle to Cart
  const handleAddToCart = () => {
    if (selectedItems.length === 0 || !onAddComboToCart) return;
    onAddComboToCart(selectedItems, finalPrice, discountPercent);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  // Summary items for CheckoutModal
  const bundleSummaryItems: OrderItemSummary[] = useMemo(() => {
    return selectedItems.map((it) => ({
      name: it.product.name,
      size: it.size,
      quantity: 1,
      price: it.product.price,
    }));
  }, [selectedItems]);

  if (!products || products.length === 0) return null;

  return (
    <section
      id="combo-builder"
      className="py-16 sm:py-24 bg-[#FAFAFA] border-b border-neutral-200/80 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="text-[11px] sm:text-xs uppercase font-medium tracking-widest text-neutral-500 mb-2">
            Bundle Studio • Kota Hub
          </div>

          <h2 className="font-heading font-bold text-2xl sm:text-4xl text-[#1A1A1A] tracking-tight mb-2">
            BUILD YOUR BUNDLE
          </h2>

          <p className="font-body text-neutral-600 text-sm sm:text-base leading-relaxed">
            Select <strong className="text-[#1A1A1A]">any 3 pieces</strong> across our entire catalog for{' '}
            <span className="text-[#4A5D45] font-semibold">10% OFF</span>. Select 4 or more pieces for{' '}
            <span className="text-[#4A5D45] font-semibold">15% OFF</span>.
          </p>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Browsable Catalog with Search & Filter Tabs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
              {/* Search Bar & Status */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any item to add..."
                    className="w-full pl-9 pr-8 py-2 bg-neutral-50 border border-neutral-200 focus:border-[#1A1A1A] rounded-xl text-xs sm:text-sm text-[#1A1A1A] placeholder-neutral-400 focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black text-xs p-1 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-neutral-500 flex items-center justify-between sm:justify-end gap-2 shrink-0">
                  <span>
                    Selected: <strong className="text-[#1A1A1A] font-semibold">{itemCount}</strong> items
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span>{filteredProducts.length} available</span>
                </div>
              </div>

              {/* Category Filter Tabs: All, Combos, Watches, Wallets, Glasses, Jackets, Socks */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-100 mb-4">
                {CATEGORY_TABS.map((tab) => {
                  const count = categoryCounts[tab.id] ?? 0;
                  const isActive = activeCategory === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#1A1A1A] text-white font-semibold'
                          : 'bg-neutral-100 text-neutral-600 hover:text-black'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'
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
                <div className="py-12 text-center text-neutral-500 text-xs">
                  <p className="mb-2">No items found matching your filter.</p>
                  <button
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                    }}
                    className="text-[#1A1A1A] underline font-medium hover:text-[#4A5D45] cursor-pointer"
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
                        className={`relative rounded-xl p-2.5 bg-white border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                          isSelected
                            ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A] bg-neutral-50/60'
                            : 'border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {/* Thumbnail with selection badge */}
                        <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-[#F5F5F5] relative">
                          <ProductImage
                            src={product.images[0]}
                            alt={product.name}
                            productName={product.name}
                            category={product.category}
                          />

                          {/* Selected Check Badge */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#1A1A1A] text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-xs">
                              #{selectedIdx + 1}
                            </div>
                          )}
                        </div>

                        {/* Product Title */}
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-neutral-400 uppercase font-medium truncate mb-0.5">
                            {product.category}
                          </div>
                          <div className="text-xs font-heading font-semibold text-[#1A1A1A] line-clamp-1 mb-1 group-hover:text-[#4A5D45] transition-colors">
                            {product.name}
                          </div>
                        </div>

                        {/* Price and Action */}
                        <div className="pt-1.5 border-t border-neutral-100 flex items-center justify-between mt-1">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs font-heading font-bold text-[#1A1A1A]">
                              ₹{product.price}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-[10px] text-neutral-400 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>

                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                              isSelected
                                ? 'bg-[#1A1A1A] text-white font-semibold'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {isSelected ? 'Added ✓' : '+ Add'}
                          </span>
                        </div>

                        {/* Size picker if selected & has multiple sizes */}
                        {isSelected && product.sizes && product.sizes.length > 1 && (
                          <div
                            className="mt-2 pt-2 border-t border-neutral-200 flex items-center gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="text-[10px] text-neutral-500">Size:</span>
                            <div className="flex flex-wrap gap-1">
                              {product.sizes.map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => handleUpdateSize(product.id, s)}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                                    selectedItem?.size === s
                                      ? 'bg-[#1A1A1A] text-white font-semibold'
                                      : 'bg-neutral-100 text-neutral-700 hover:text-black'
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
            <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden text-[#1A1A1A]">
              {/* Top Banner */}
              <div className="flex items-center justify-between pb-3.5 border-b border-neutral-100 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-medium tracking-widest text-neutral-500">
                    Live Bundle Studio
                  </span>
                  <h4 className="font-heading font-bold text-base sm:text-lg text-[#1A1A1A]">
                    Your Curated Set
                  </h4>
                </div>
                <div
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    discountPercent > 0
                      ? 'bg-[#4A5D45]/10 text-[#4A5D45]'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {discountPercent > 0
                    ? `-${discountPercent}% Discount`
                    : `Pick ${Math.max(0, 3 - itemCount)} more`}
                </div>
              </div>

              {/* Discount Milestone Bar */}
              <div className="mb-4 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-neutral-500 font-medium">Bundle Progress:</span>
                  <span className="font-medium text-[#1A1A1A]">
                    {itemCount === 0 && '0 / 3 items'}
                    {itemCount === 1 && '1 / 3 items (Add 2 for 10% OFF)'}
                    {itemCount === 2 && '2 / 3 items (Add 1 for 10% OFF)'}
                    {itemCount === 3 && '3 items (10% OFF Unlocked! Add 1 for 15%)'}
                    {itemCount >= 4 && `${itemCount} items (15% OFF Unlocked!)`}
                  </span>
                </div>
                <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden flex">
                  <div
                    className={`h-full transition-all duration-300 bg-[#4A5D45] ${
                      itemCount >= 4
                        ? 'w-full'
                        : itemCount === 3
                        ? 'w-3/4'
                        : itemCount === 2
                        ? 'w-1/2'
                        : itemCount === 1
                        ? 'w-1/4'
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
                    className="flex items-center justify-between gap-2.5 p-2 rounded-xl bg-neutral-50 border border-neutral-200/70 hover:border-neutral-300 transition"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                      <ProductImage
                        src={item.product.images[0]}
                        alt={item.product.name}
                        productName={item.product.name}
                        category={item.product.category}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#1A1A1A] truncate">
                        {item.product.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                        <span className="text-[#1A1A1A] font-medium">₹{item.product.price}</span>
                        {item.size && item.size !== 'Free Size' && (
                          <span>• Size: {item.size}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="text-neutral-400 hover:text-black p-1 rounded-lg transition cursor-pointer"
                      aria-label="Remove item"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Empty placeholder slots up to 3 */}
                {Array.from({ length: Math.max(0, 3 - itemCount) }).map((_, i) => {
                  const slotNumber = itemCount + i + 1;
                  return (
                    <div
                      key={`placeholder-${i}`}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-neutral-200 text-neutral-400 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full border border-neutral-300 flex items-center justify-center text-[10px]">
                          {slotNumber}
                        </span>
                        <span>Pick any piece from catalog</span>
                      </div>
                      <Plus className="w-3 h-3 text-neutral-400" />
                    </div>
                  );
                })}
              </div>

              {/* Running Pricing Breakdown */}
              <div className="space-y-2 py-3 border-y border-neutral-100 text-xs sm:text-sm">
                <div className="flex justify-between text-neutral-600">
                  <span>Regular Total ({itemCount} item{itemCount === 1 ? '' : 's'}):</span>
                  <span className={discountPercent > 0 ? 'line-through text-neutral-400' : 'text-[#1A1A1A] font-medium'}>
                    ₹{regularTotal}
                  </span>
                </div>

                <div
                  className={`flex justify-between font-medium ${
                    discountPercent > 0 ? 'text-[#4A5D45]' : 'text-neutral-400'
                  }`}
                >
                  <span>Bundle Discount ({discountPercent}% OFF):</span>
                  <span>{discountPercent > 0 ? `-₹${discountAmount}` : '₹0'}</span>
                </div>

                <div className="flex justify-between text-neutral-600">
                  <span>Shipping:</span>
                  <span className={isFreeDelivery ? 'text-[#4A5D45] font-semibold' : 'text-neutral-600'}>
                    {itemCount === 0
                      ? 'Calculated on order'
                      : isFreeDelivery
                      ? 'FREE Delivery'
                      : `+₹${BRAND.standardShippingFee}`}
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-baseline border-t border-neutral-100">
                  <div>
                    <span className="font-heading font-bold text-sm sm:text-base text-[#1A1A1A]">Bundle Price:</span>
                    {discountAmount > 0 && (
                      <div className="text-[11px] text-[#4A5D45] font-medium">
                        You save ₹{discountAmount}
                      </div>
                    )}
                  </div>
                  <span className="font-heading font-bold text-xl sm:text-2xl text-[#1A1A1A]">
                    ₹{finalPrice}
                  </span>
                </div>
              </div>

              {/* Delivery dispatch info */}
              <div className="my-3 text-center text-xs text-neutral-500">
                Same-Day Dispatch from Kota, Rajasthan • Cash on Delivery
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleOrderWhatsApp}
                  disabled={itemCount === 0}
                  className="w-full py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] disabled:opacity-40 disabled:cursor-not-allowed text-white font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs active:scale-98 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Combo on WhatsApp</span>
                </button>

                {onAddComboToCart && (
                  <button
                    onClick={handleAddToCart}
                    disabled={itemCount === 0}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed text-[#1A1A1A] border border-neutral-300 font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-neutral-700" />
                    <span>{addedToast ? 'Bundle Added to Bag! ✓' : 'Add Combo to Bag'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Order Form Modal for Direct Bundle Order */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        items={bundleSummaryItems}
        total={finalPrice}
        subtotal={regularTotal}
        shippingFee={isFreeDelivery ? 0 : BRAND.standardShippingFee}
        title="Checkout Custom Bundle"
      />
    </section>
  );
};
