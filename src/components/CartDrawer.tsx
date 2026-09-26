import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Truck, ArrowLeft, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';
import { BRAND } from '../data/content';
import { OrderItemSummary } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';
import { CheckoutOrderForm } from './CheckoutOrderForm';

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
  const [viewMode, setViewMode] = useState<'bag' | 'checkout'>('bag');

  // Reset to bag view when drawer is reopened
  useEffect(() => {
    if (isOpen) {
      setViewMode('bag');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeDelivery = subtotal >= BRAND.deliveryThreshold;
  const shippingFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : BRAND.standardShippingFee;
  const grandTotal = subtotal + shippingFee;

  const amountNeededForFreeShipping = Math.max(0, BRAND.deliveryThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / BRAND.deliveryThreshold) * 100);

  // Map cart items to OrderItemSummary format
  const orderSummaryItems: OrderItemSummary[] = items.map((item) => {
    if (item.isCustomCombo && item.comboItems) {
      return {
        name: `Custom Combo (${item.comboItems.top.name} + ${item.comboItems.bottom.name} + ${item.comboItems.watch.name})`,
        size: 'Complete Set',
        quantity: item.quantity,
        price: item.product.price,
      };
    }
    return {
      name: item.product.name,
      size: item.selectedSize,
      quantity: item.quantity,
      price: item.product.price,
    };
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between text-[#1A1A1A]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between">
            {viewMode === 'bag' ? (
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#1A1A1A]" />
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#1A1A1A]">
                  Shopping Bag ({items.reduce((acc, it) => acc + it.quantity, 0)})
                </h3>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('bag')}
                  className="flex items-center gap-1.5 px-2.5 py-1 -ml-1 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-black text-xs font-semibold transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Bag</span>
                </button>
                <span className="text-neutral-300">/</span>
                <span className="font-heading font-bold text-sm sm:text-base text-[#1A1A1A]">
                  Checkout
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* VIEW 1: BAG ITEMS LIST */}
          {viewMode === 'bag' ? (
            <>
              {/* Free Shipping Progress Meter */}
              <div className="bg-[#FAFAFA] px-4 sm:px-6 py-3 border-b border-neutral-200">
                <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                  <span className="flex items-center gap-1.5 text-neutral-700">
                    <Truck className="w-4 h-4 text-[#4A5D45]" />
                    {isFreeDelivery ? (
                      <span className="text-[#4A5D45] font-semibold">
                        Free Delivery unlocked (Orders &gt; ₹999)
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-[#1A1A1A]">₹{amountNeededForFreeShipping}</strong> more for <strong>FREE Delivery</strong>
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4A5D45] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h4 className="font-heading font-bold text-base sm:text-lg text-[#1A1A1A] mb-1">
                      Your Bag is Empty
                    </h4>
                    <p className="text-xs text-neutral-500 max-w-xs mb-6 font-body">
                      Explore our curated streetwear combos and watches dispatched directly from Kota.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onShopCombos();
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white font-heading font-semibold text-xs transition cursor-pointer"
                    >
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 bg-neutral-50/80 p-3 rounded-xl border border-neutral-200 relative group"
                    >
                      {/* Thumbnail using ProductImage */}
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/80">
                        <ProductImage
                          src={item.product.images[0]}
                          alt={item.product.name}
                          productName={item.product.name}
                          category={item.product.category}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-heading font-semibold text-xs sm:text-sm text-[#1A1A1A] line-clamp-1">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-neutral-400 hover:text-red-500 p-0.5 transition cursor-pointer"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Custom Combo breakdown if applicable */}
                          {item.isCustomCombo && item.comboItems ? (
                            <div className="text-[10px] text-neutral-500 mt-0.5 space-y-0.5">
                              <div className="text-[#4A5D45] font-semibold">Custom Bundle Selection:</div>
                              <div className="truncate">• Top: {item.comboItems.top.name} ({item.comboItems.top.size})</div>
                              <div className="truncate">• Bottom: {item.comboItems.bottom.name} ({item.comboItems.bottom.size})</div>
                              <div className="truncate">• Watch: {item.comboItems.watch.name}</div>
                            </div>
                          ) : (
                            <div className="inline-block px-2 py-0.5 rounded text-[10px] bg-white border border-neutral-200 text-neutral-600 font-medium mt-1">
                              Size: {item.selectedSize}
                            </div>
                          )}
                        </div>

                        {/* Price and Quantity Controls */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-200/60">
                          <div className="font-heading font-bold text-sm text-[#1A1A1A]">
                            ₹{item.product.price * item.quantity}
                          </div>

                          <div className="flex items-center border border-neutral-200 rounded-lg bg-white">
                            <button
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-black cursor-pointer text-xs font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-mono font-bold text-[#1A1A1A]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-black cursor-pointer text-xs font-bold"
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

              {/* Footer Checkout Trigger */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 bg-[#FAFAFA] border-t border-neutral-200 space-y-3">
                  {/* Cost Summary */}
                  <div className="space-y-1 text-xs text-neutral-600 font-body">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="text-[#1A1A1A] font-medium">₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery (Kota Dispatch):</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-[#4A5D45] font-semibold">FREE</span>
                        ) : (
                          `₹${shippingFee}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-neutral-200 text-sm sm:text-base font-heading font-bold text-[#1A1A1A]">
                      <span>Grand Total:</span>
                      <span className="text-[#1A1A1A]">₹{grandTotal}</span>
                    </div>
                  </div>

                  {/* Proceed to Form Button */}
                  <button
                    onClick={() => setViewMode('checkout')}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors active:scale-98 cursor-pointer shadow-sm"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-center text-neutral-500">
                    Next: Fill delivery address for instant WhatsApp confirmation
                  </p>
                </div>
              )}
            </>
          ) : (
            /* VIEW 2: POLISHED ORDER FORM */
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              <CheckoutOrderForm
                items={orderSummaryItems}
                total={grandTotal}
                subtotal={subtotal}
                shippingFee={shippingFee}
                onSuccess={onClose}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
