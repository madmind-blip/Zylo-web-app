import React, { useState, useMemo } from 'react';
import { Sparkles, MessageCircle, ShoppingBag, Check, ArrowRight, RefreshCw, Shirt, Watch, Flame, Layers } from 'lucide-react';
import { Product } from '../types';
import { createCustomComboWhatsAppUrl } from '../utils/whatsapp';
import { BRAND } from '../data/content';

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
  // Filter candidates
  const tops = useMemo(
    () => products.filter((p) => p.category === 'tops' || p.comboRole === 'top'),
    [products]
  );
  const bottoms = useMemo(
    () => products.filter((p) => p.category === 'bottoms' || p.comboRole === 'bottom'),
    [products]
  );
  const watches = useMemo(
    () => products.filter((p) => p.category === 'watches' || p.comboRole === 'watch'),
    [products]
  );

  // Default selections
  const [selectedTopId, setSelectedTopId] = useState<string>(tops[0]?.id || '');
  const [selectedTopSize, setSelectedTopSize] = useState<string>(tops[0]?.sizes?.[1] || 'L');

  const [selectedBottomId, setSelectedBottomId] = useState<string>(bottoms[0]?.id || '');
  const [selectedBottomSize, setSelectedBottomSize] = useState<string>(bottoms[0]?.sizes?.[1] || '32-34 (L)');

  const [selectedWatchId, setSelectedWatchId] = useState<string>(watches[0]?.id || '');
  const [addedToast, setAddedToast] = useState(false);

  // Active items
  const selectedTop = tops.find((t) => t.id === selectedTopId) || tops[0];
  const selectedBottom = bottoms.find((b) => b.id === selectedBottomId) || bottoms[0];
  const selectedWatch = watches.find((w) => w.id === selectedWatchId) || watches[0];

  // Pricing math
  const originalCombinedPrice = useMemo(() => {
    return (selectedTop?.price || 0) + (selectedBottom?.price || 0) + (selectedWatch?.price || 0);
  }, [selectedTop, selectedBottom, selectedWatch]);

  // 10% Combo Discount
  const comboDiscount = useMemo(() => {
    return Math.round(originalCombinedPrice * 0.1);
  }, [originalCombinedPrice]);

  const finalComboPrice = originalCombinedPrice - comboDiscount;
  const isFreeDelivery = finalComboPrice >= BRAND.deliveryThreshold;

  const handleOrderWhatsApp = () => {
    if (!selectedTop || !selectedBottom || !selectedWatch) return;
    const url = createCustomComboWhatsAppUrl(
      { product: selectedTop, size: selectedTopSize },
      { product: selectedBottom, size: selectedBottomSize },
      { product: selectedWatch },
      originalCombinedPrice,
      comboDiscount,
      finalComboPrice
    );
    window.open(url, '_blank');
  };

  const handleAddToCart = () => {
    if (!selectedTop || !selectedBottom || !selectedWatch) return;
    onAddComboToCart(
      { product: selectedTop, size: selectedTopSize },
      { product: selectedBottom, size: selectedBottomSize },
      { product: selectedWatch },
      finalComboPrice
    );
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2200);
  };

  return (
    <section id="combo-builder" className="py-16 sm:py-24 bg-[#0A0A0A] border-b border-[#242424] relative overflow-hidden">
      {/* Background Glows */}
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
            Curate your own signature drip. Pick <strong className="text-white">1 Top</strong> + <strong className="text-white">1 Bottom</strong> + <strong className="text-white">1 Watch</strong> and unlock an automatic <span className="text-[#D4AF37] font-bold">10% Instant Combo Discount</span>.
          </p>
        </div>

        {/* Builder Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3 Selection Steps */}
          <div className="lg:col-span-7 space-y-6">
            {/* STEP 1: PICK TOP */}
            <div className="bg-[#141414] border border-[#242424] rounded-2xl p-4 sm:p-6 transition-all hover:border-[#D4AF37]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-heading font-extrabold text-xs flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                      Select Top Wear
                    </h3>
                    <p className="text-[11px] text-zinc-400">Tees, Cuban Shirts, Waffle Knits</p>
                  </div>
                </div>
                <Shirt className="w-5 h-5 text-[#D4AF37]" />
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-4">
                {tops.map((top) => {
                  const isSelected = selectedTop?.id === top.id;
                  return (
                    <div
                      key={top.id}
                      onClick={() => {
                        setSelectedTopId(top.id);
                        if (top.sizes && top.sizes.length > 0) {
                          setSelectedTopSize(top.sizes[0]);
                        }
                      }}
                      className={`relative rounded-xl p-2 bg-[#0A0A0A] border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15 bg-[#17150e]'
                          : 'border-[#242424] hover:border-zinc-600 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-zinc-900">
                        <img
                          src={top.images[0]}
                          alt={top.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-[11px] font-heading font-bold text-white line-clamp-1 mb-1">
                        {top.name}
                      </div>
                      <div className="text-[11px] font-heading font-bold text-[#D4AF37]">
                        ₹{top.price}
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

              {/* Size Selector for Top */}
              {selectedTop?.sizes && (
                <div className="flex items-center gap-2 pt-2 border-t border-[#242424]">
                  <span className="text-xs text-zinc-400 font-medium">Top Size:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTop.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedTopSize(s)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-heading font-semibold transition cursor-pointer ${
                          selectedTopSize === s
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

            {/* STEP 2: PICK BOTTOM */}
            <div className="bg-[#141414] border border-[#242424] rounded-2xl p-4 sm:p-6 transition-all hover:border-[#D4AF37]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-heading font-extrabold text-xs flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                      Select Bottom Wear
                    </h3>
                    <p className="text-[11px] text-zinc-400">Tactical Cargos, Tailored Chinos, Baggy Denims</p>
                  </div>
                </div>
                <Layers className="w-5 h-5 text-[#D4AF37]" />
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-4">
                {bottoms.map((bottom) => {
                  const isSelected = selectedBottom?.id === bottom.id;
                  return (
                    <div
                      key={bottom.id}
                      onClick={() => {
                        setSelectedBottomId(bottom.id);
                        if (bottom.sizes && bottom.sizes.length > 0) {
                          setSelectedBottomSize(bottom.sizes[0]);
                        }
                      }}
                      className={`relative rounded-xl p-2 bg-[#0A0A0A] border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15 bg-[#17150e]'
                          : 'border-[#242424] hover:border-zinc-600 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-zinc-900">
                        <img
                          src={bottom.images[0]}
                          alt={bottom.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-[11px] font-heading font-bold text-white line-clamp-1 mb-1">
                        {bottom.name}
                      </div>
                      <div className="text-[11px] font-heading font-bold text-[#D4AF37]">
                        ₹{bottom.price}
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

              {/* Size Selector for Bottom */}
              {selectedBottom?.sizes && (
                <div className="flex items-center gap-2 pt-2 border-t border-[#242424]">
                  <span className="text-xs text-zinc-400 font-medium">Bottom Size:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBottom.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedBottomSize(s)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-heading font-semibold transition cursor-pointer ${
                          selectedBottomSize === s
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

            {/* STEP 3: PICK WATCH */}
            <div className="bg-[#141414] border border-[#242424] rounded-2xl p-4 sm:p-6 transition-all hover:border-[#D4AF37]/30">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#D4AF37] text-black font-heading font-extrabold text-xs flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                      Select Watch Piece
                    </h3>
                    <p className="text-[11px] text-zinc-400">Sunburst Gold, Tactical Stealth, Roman Mesh</p>
                  </div>
                </div>
                <Watch className="w-5 h-5 text-[#D4AF37]" />
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-2">
                {watches.slice(0, 3).map((watch) => {
                  const isSelected = selectedWatch?.id === watch.id;
                  return (
                    <div
                      key={watch.id}
                      onClick={() => setSelectedWatchId(watch.id)}
                      className={`relative rounded-xl p-2 bg-[#0A0A0A] border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15 bg-[#17150e]'
                          : 'border-[#242424] hover:border-zinc-600 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-zinc-900">
                        <img
                          src={watch.images[0]}
                          alt={watch.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-[11px] font-heading font-bold text-white line-clamp-1 mb-1">
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
            <div className="bg-[#141414] border-2 border-[#D4AF37]/60 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden gold-glow-subtle">
              {/* Top Banner */}
              <div className="flex items-center justify-between pb-4 border-b border-[#242424] mb-5">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">
                    Outfit Preview
                  </span>
                  <h4 className="font-heading font-bold text-lg text-white">
                    Your 3-Piece Drip Set
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-black font-heading font-extrabold text-xs">
                  -10% Discount
                </span>
              </div>

              {/* 3 Pieces Visual Stack */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {/* Chosen Top */}
                <div className="flex flex-col items-center bg-[#0A0A0A] p-2 rounded-xl border border-[#242424]">
                  <div className="w-full aspect-[4/5] rounded-lg overflow-hidden mb-1.5">
                    <img
                      src={selectedTop?.images[0]}
                      alt="Selected Top"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Top ({selectedTopSize})</span>
                  <span className="text-xs font-heading font-semibold text-white truncate max-w-full text-center">
                    {selectedTop?.name}
                  </span>
                  <span className="text-[11px] text-[#D4AF37] font-bold">₹{selectedTop?.price}</span>
                </div>

                {/* Chosen Bottom */}
                <div className="flex flex-col items-center bg-[#0A0A0A] p-2 rounded-xl border border-[#242424]">
                  <div className="w-full aspect-[4/5] rounded-lg overflow-hidden mb-1.5">
                    <img
                      src={selectedBottom?.images[0]}
                      alt="Selected Bottom"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Bottom ({selectedBottomSize})</span>
                  <span className="text-xs font-heading font-semibold text-white truncate max-w-full text-center">
                    {selectedBottom?.name}
                  </span>
                  <span className="text-[11px] text-[#D4AF37] font-bold">₹{selectedBottom?.price}</span>
                </div>

                {/* Chosen Watch */}
                <div className="flex flex-col items-center bg-[#0A0A0A] p-2 rounded-xl border border-[#242424]">
                  <div className="w-full aspect-[4/5] rounded-lg overflow-hidden mb-1.5">
                    <img
                      src={selectedWatch?.images[0]}
                      alt="Selected Watch"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase">Watch</span>
                  <span className="text-xs font-heading font-semibold text-white truncate max-w-full text-center">
                    {selectedWatch?.name}
                  </span>
                  <span className="text-[11px] text-[#D4AF37] font-bold">₹{selectedWatch?.price}</span>
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
