import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle, Truck, Sparkles, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { BRAND } from '../data/content';
import { createCartWhatsAppUrl } from '../utils/whatsapp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onShopCombos: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onShopCombos,
}) => {
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= BRAND.deliveryThreshold;
  const shippingFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : BRAND.standardShippingFee;
  const grandTotal = subtotal + shippingFee;

  const amountNeededForFreeShipping = Math.max(0, BRAND.deliveryThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / BRAND.deliveryThreshold) * 100);

  const handleCheckoutWhatsApp = () => {
    if (items.length === 0) return;
    const url = createCartWhatsAppUrl(items, subtotal, shippingFee, grandTotal);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#141414] border-l border-[#242424] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#242424] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-heading font-extrabold text-lg text-white">
                Your Shopping Bag ({items.reduce((acc, it) => acc + it.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#0A0A0A] hover:bg-black text-zinc-400 hover:text-white flex items-center justify-center border border-[#242424] transition cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-[#0A0A0A] px-4 sm:px-6 py-3 border-b border-[#242424]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                {isFreeDelivery ? (
                  <span className="text-emerald-400 font-bold">
                    🎉 Free Delivery unlocked! (Orders above ₹999)
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#D4AF37]">₹{amountNeededForFreeShipping}</strong> more for <strong>FREE Delivery</strong>
                  </span>
                )}
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#242424] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E5C158] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-3xl bg-[#0A0A0A] border border-[#242424] flex items-center justify-center text-zinc-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="font-heading font-bold text-lg text-white mb-1">
                  Your Bag is Empty
                </h4>
                <p className="text-xs text-zinc-400 max-w-xs mb-6">
                  Check out our trending streetwear combos and luxury pocket watches from Kota.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onShopCombos();
                  }}
                  className="px-6 py-2.5 rounded-full bg-[#D4AF37] text-black font-heading font-bold text-xs hover:bg-[#E5C158] transition cursor-pointer"
                >
                  Browse Combos
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 bg-[#0A0A0A] p-3 rounded-2xl border border-[#242424] relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-zinc-500 hover:text-red-400 p-0.5 transition cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Custom Combo breakdown if applicable */}
                      {item.isCustomCombo && item.comboItems ? (
                        <div className="text-[10px] text-zinc-400 mt-0.5 space-y-0.5">
                          <div className="text-[#D4AF37] font-semibold">Custom 3-Piece Drip:</div>
                          <div className="truncate">• Top: {item.comboItems.top.name} ({item.comboItems.top.size})</div>
                          <div className="truncate">• Bottom: {item.comboItems.bottom.name} ({item.comboItems.bottom.size})</div>
                          <div className="truncate">• Watch: {item.comboItems.watch.name}</div>
                        </div>
                      ) : (
                        <div className="inline-block px-2 py-0.5 rounded-md bg-[#141414] border border-[#242424] text-[10px] text-zinc-300 font-semibold mt-1">
                          Size: {item.selectedSize}
                        </div>
                      )}
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#242424]">
                      <div className="font-heading font-extrabold text-sm text-[#D4AF37]">
                        ₹{item.product.price * item.quantity}
                      </div>

                      <div className="flex items-center border border-[#242424] rounded-lg bg-[#141414]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 bg-[#0A0A0A] border-t border-[#242424] space-y-3">
              {/* Cost Summary */}
              <div className="space-y-1.5 text-xs text-zinc-400 font-body">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery (Kota Dispatch):</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#242424] text-base font-heading font-extrabold text-white">
                  <span>Grand Total:</span>
                  <span className="text-[#D4AF37]">₹{grandTotal}</span>
                </div>
              </div>

              {/* Checkout on WhatsApp Button */}
              <button
                onClick={handleCheckoutWhatsApp}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-heading font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#25D366]/20 active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-black stroke-black" />
                <span>Place Order on WhatsApp</span>
              </button>

              <p className="text-[11px] text-center text-zinc-500">
                💬 Instant chat checkout • Cash on Delivery (COD) supported • No credit card required
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
