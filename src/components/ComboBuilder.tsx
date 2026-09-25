import React, { useState, useMemo } from 'react';
import { Sparkles, MessageCircle, ShoppingBag, Check, Shirt, Watch } from 'lucide-react';
import { Product } from '../types';
import { createCustomComboWhatsAppUrl } from '../utils/whatsapp';
import { BRAND } from '../data/content';
import { ProductImage } from './ProductImage';

interface ComboBuilderProps {
  products: Product[];
  onAddComboToCart: (
    top: { product: Product; size: string },
    bottom: { product: Product; size: string },
    watch: { product: Product },
    finalPrice: number
  ) => void;
}

export const ComboBuilder: React.FC<ComboBuilderProps> = ({
  products,
  onAddComboToCart,
}) => {
  // Clothing Combos (e.g. Levi's shirts combo)
  const clothingCombos = useMemo(() => {
    const list = products.filter(
      (p) =>
        p.categoryGroup === 'combos' ||
        p.category.toLowerCase().includes('combo') ||
        p.comboRole === 'top'
    );
    return list.length > 0 ? list : products.slice(0, 1);
  }, [products]);

  // Luxury Watches
  const luxuryWatches = useMemo(() => {
    const list = products.filter(
      (p) =>
        p.categoryGroup === 'watches' ||
        p.category.toLowerCase().includes('watch') ||
        p.comboRole === 'watch'
    );
    return list.length > 0 ? list : products;
  }, [products]);

  // Selections
  const [selectedClothingId, setSelectedClothingId] = useState<string>(clothingCombos[0]?.id || '');
  const [selectedClothingSize, setSelectedClothingSize] = useState<string>(
    clothingCombos[0]?.sizes?.[1] || clothingCombos[0]?.sizes?.[0] || 'L'
  );

  const [selectedWatch1Id, setSelectedWatch1Id] = useState<string>(luxuryWatches[0]?.id || '');
  const [selectedWatch2Id, setSelectedWatch2Id] = useState<string>(luxuryWatches[1]?.id || luxuryWatches[0]?.id || '');
  const [addedToast, setAddedToast] = useState(false);

  const selectedClothing = clothingCombos.find((c) => c.id === selectedClothingId) || clothingCombos[0];
  const selectedWatch1 = luxuryWatches.find((w) => w.id === selectedWatch1Id) || luxuryWatches[0];
  const selectedWatch2 = luxuryWatches.find((w) => w.id === selectedWatch2Id) || luxuryWatches[1] || luxuryWatches[0];

  // Pricing math: 10% Combo discount
  const originalCombinedPrice = useMemo(() => {
    return (selectedClothing?.price || 0) + (selectedWatch1?.price || 0) + (selectedWatch2?.price || 0);
  }, [selectedClothing, selectedWatch1, selectedWatch2]);

  const comboDiscount = useMemo(() => {
    return Math.round(originalCombinedPrice * 0.1);
  }, [originalCombinedPrice]);

  const finalComboPrice = originalCombinedPrice - comboDiscount;
  const isFreeDelivery = finalComboPrice >= BRAND.deliveryThreshold;

  const handleOrderWhatsApp = () => {
    if (!selectedClothing || !selectedWatch1 || !selectedWatch2) return;
    const url = createCustomComboWhatsAppUrl(
      { product: selectedClothing, size: selectedClothingSize },
      { product: selectedWatch2, size: 'Free Size' },
      { product: selectedWatch1 },
      originalCombinedPrice,
      comboDiscount,
      finalComboPrice
    );
    window.open(url, '_blank');
  };

  const handleAddToCart = () => {
    if (!selectedClothing || !selectedWatch1 || !selectedWatch2) return;
    onAddComboToCart(
      { product: selectedClothing, size: selectedClothingSize },
      { product: selectedWatch2, size: 'Free Size' },
      { product: selectedWatch1 },
      finalComboPrice
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  if (!products || products.length === 0) return null;

  return (
    <section id="combo-builder" className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-[#242424] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141414] border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Outfit Studio</span>
          </div>

          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl text-white uppercase tracking-tight mb-3">
            ZYLE COMBO BUILDER
          </h2>

          <p className="font-body text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
            Curate your own signature look. Pick <strong className="text-white">1 Clothing Combo</strong> + <strong className="text-white">2 Luxury Watches</strong> and unlock an automatic <span className="text-[#D4AF37] font-bold">10% Instant Combo Discount</span>.
          </p>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Selection Steps */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: PICK CLOTHING COMBO */}
            <div className="bg-[#141414] border border-[#242424] rounded-2xl p-4 sm:p-6 transition-all hover:border-[#D4AF37]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-heading font-extrabold text-xs flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                      Select Clothing Set
                    </h3>
                    <p className="text-[11px] text-zinc-400">Combo packs with your selected fit</p>
                  </div>
                </div>
                <Shirt className="w-5 h-5 text-[#D4AF37]" />
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {clothingCombos.map((item) => {
                  const isSelected = selectedClothing?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedClothingId(item.id);
                        if (item.sizes && item.sizes.length > 0) {
                          setSelectedClothingSize(item.sizes[0]);
                        }
                      }}
                      className={`relative rounded-xl p-2.5 bg-[#0A0A0A] border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15 bg-[#17150e]'
                          : 'border-[#242424] hover:border-zinc-600 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2 bg-zinc-900">
                        <ProductImage
                          src={item.images[0]}
                          alt={item.name}
                          productName={item.name}
                          category={item.category}
                        />
                      </div>
                      <div className="text-xs font-heading font-bold text-white line-clamp-1 mb-1">
                        {item.name}
                      </div>
                      <div className="text-xs font-heading font-bold text-[#D4AF37]">
                        ₹{item.price}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#D4AF37] text-black flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Size Selector for Clothing */}
              {selectedClothing?.sizes && selectedClothing.sizes.length > 1 && (
                <div className="flex items-center gap-2 pt-2 border-t border-[#242424]">
                  <span className="text-xs text-zinc-400 font-medium">Select Size:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedClothing.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedClothingSize(s)}
                        className={`px-3 py-1 rounded-lg text-xs font-heading font-semibold transition cursor-pointer ${
                          selectedClothingSize === s
                            ? 'bg-[#D4AF37] text-black font-bold'
                            : 'bg-[#0A0A0A] text-zinc-300 border border-[#242424] hover:border-zinc-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* STEP 2: PICK LUXURY WATCH 1 */}
            <div className="bg-[#141414] border border-[#242424] rounded-2xl p-4 sm:p-6 transition-all hover:border-[#D4AF37]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-heading font-extrabold text-xs flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                      Select Primary Luxury Watch
                    </h3>
                    <p className="text-[11px] text-zinc-400">Edifice Casio, Rolex, Tissot, Armani</p>
                  </div>
                </div>
                <Watch className="w-5 h-5 text-[#D4AF37]" />
              </div>

              {/* Watches Grid */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-2 max-h-64 overflow-y-auto pr-1">
                {luxuryWatches.slice(0, 6).map((watch) => {
                  const isSelected = selectedWatch1?.id === watch.id;
                  return (
                    <div
                      key={watch.id}
                      onClick={() => setSelectedWatch1Id(watch.id)}
                      className={`relative rounded-xl p-2 bg-[#0A0A0A] border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15 bg-[#17150e]'
                          : 'border-[#242424] hover:border-zinc-600 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-1.5 bg-zinc-900">
                        <ProductImage
                          src={watch.images[0]}
                          alt={watch.name}
                          productName={watch.name}
                          category={watch.category}
                        />
                      </div>
                      <div className="text-[11px] font-heading font-bold text-white line-clamp-1 mb-0.5">
                        {watch.name}
                      </div>
                      <div className="text-[11px] font-heading font-bold text-[#D4AF37]">
                        ₹{watch.price}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-black flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: PICK SECOND LUXURY WATCH / GIFT PIECE */}
            <div className="bg-[#141414] border border-[#242424] rounded-2xl p-4 sm:p-6 transition-all hover:border-[#D4AF37]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-heading font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                      Select Matching Watch / Second Piece
                    </h3>
                    <p className="text-[11px] text-zinc-400">Tommy Hilfiger, Seiko, Fossil, Patek Philippe</p>
                  </div>
                </div>
                <Watch className="w-5 h-5 text-[#D4AF37]" />
              </div>

              {/* Watches Grid */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-2 max-h-64 overflow-y-auto pr-1">
                {luxuryWatches.slice(6).map((watch) => {
                  const isSelected = selectedWatch2?.id === watch.id;
                  return (
                    <div
                      key={watch.id}
                      onClick={() => setSelectedWatch2Id(watch.id)}
                      className={`relative rounded-xl p-2 bg-[#0A0A0A] border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15 bg-[#17150e]'
                          : 'border-[#242424] hover:border-zinc-600 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-1.5 bg-zinc-900">
                        <ProductImage
                          src={watch.images[0]}
                          alt={watch.name}
                          productName={watch.name}
                          category={watch.category}
                        />
                      </div>
                      <div className="text-[11px] font-heading font-bold text-white line-clamp-1 mb-0.5">
                        {watch.name}
                      </div>
                      <div className="text-[11px] font-heading font-bold text-[#D4AF37]">
                        ₹{watch.price}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-black flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live Outfit Board & Pricing Summary */}
          <div className="lg:col-span-5 sticky top-28 space-y-4">
            <div className="bg-[#141414] border-2 border-[#D4AF37]/60 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
              {/* Top Banner */}
              <div className="flex items-center justify-between pb-4 border-b border-[#242424] mb-5">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                    Live Outfit Bundle
                  </span>
                  <h4 className="font-heading font-bold text-lg text-white">
                    Your Curated Set
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-black font-heading font-extrabold text-xs">
                  -10% Discount
                </span>
              </div>

              {/* 3 Pieces Visual Stack */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {/* Chosen Clothing */}
                <div className="flex flex-col items-center bg-[#0A0A0A] p-2 rounded-xl border border-[#242424]">
                  <div className="w-full aspect-[4/5] rounded-lg overflow-hidden mb-1.5">
                    <ProductImage
                      src={selectedClothing?.images[0]}
                      alt="Clothing"
                      productName={selectedClothing?.name || 'Clothing'}
                      category={selectedClothing?.category}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase truncate max-w-full">
                    {selectedClothingSize}
                  </span>
                  <span className="text-xs font-heading font-semibold text-white truncate max-w-full text-center">
                    {selectedClothing?.name}
                  </span>
                  <span className="text-[11px] text-[#D4AF37] font-bold">₹{selectedClothing?.price}</span>
                </div>

                {/* Chosen Watch 1 */}
                <div className="flex flex-col items-center bg-[#0A0A0A] p-2 rounded-xl border border-[#242424]">
                  <div className="w-full aspect-[4/5] rounded-lg overflow-hidden mb-1.5">
                    <ProductImage
                      src={selectedWatch1?.images[0]}
                      alt="Watch 1"
                      productName={selectedWatch1?.name || 'Watch 1'}
                      category="watches"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Watch 1</span>
                  <span className="text-xs font-heading font-semibold text-white truncate max-w-full text-center">
                    {selectedWatch1?.name}
                  </span>
                  <span className="text-[11px] text-[#D4AF37] font-bold">₹{selectedWatch1?.price}</span>
                </div>

                {/* Chosen Watch 2 */}
                <div className="flex flex-col items-center bg-[#0A0A0A] p-2 rounded-xl border border-[#242424]">
                  <div className="w-full aspect-[4/5] rounded-lg overflow-hidden mb-1.5">
                    <ProductImage
                      src={selectedWatch2?.images[0]}
                      alt="Watch 2"
                      productName={selectedWatch2?.name || 'Watch 2'}
                      category="watches"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Watch 2</span>
                  <span className="text-xs font-heading font-semibold text-white truncate max-w-full text-center">
                    {selectedWatch2?.name}
                  </span>
                  <span className="text-[11px] text-[#D4AF37] font-bold">₹{selectedWatch2?.price}</span>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-2 py-4 border-y border-[#242424] text-xs sm:text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Regular Total (3 items):</span>
                  <span className="line-through text-zinc-500">₹{originalCombinedPrice}</span>
                </div>

                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Combo Savings (10% OFF):
                  </span>
                  <span>-₹{comboDiscount}</span>
                </div>

                <div className="flex justify-between text-zinc-300">
                  <span>Shipping:</span>
                  <span className={isFreeDelivery ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                    {isFreeDelivery ? 'FREE Delivery' : `+₹${BRAND.standardShippingFee}`}
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-baseline border-t border-[#242424]/60">
                  <div>
                    <span className="font-heading font-bold text-base sm:text-lg text-white">
                      Combo Deal Price:
                    </span>
                    <div className="text-[11px] text-emerald-400 font-semibold">
                      You save ₹{comboDiscount}!
                    </div>
                  </div>
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#D4AF37]">
                    ₹{finalComboPrice}
                  </span>
                </div>
              </div>

              {/* Delivery info */}
              <div className="my-4 p-3 rounded-2xl bg-[#0A0A0A] border border-[#242424] text-center text-xs text-zinc-300">
                🚀 <strong className="text-white">Same-Day Dispatch</strong> from Kota, Rajasthan • Cash on Delivery Available
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleOrderWhatsApp}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-heading font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#25D366]/20 active:scale-[0.98] cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-black stroke-black" />
                  <span>Order Combo on WhatsApp</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 rounded-2xl bg-[#242424] hover:bg-[#2d2d2d] text-white border border-zinc-700 font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>{addedToast ? 'Combo Added to Bag! ✓' : 'Add Combo to Bag'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
