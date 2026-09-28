import React, { useEffect } from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { ProductImage } from './ProductImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onSelectProduct,
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-[#E11D48]">
                <Heart className="w-4 h-4 fill-[#E11D48]" />
              </div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-[#1A1A1A]">
                My Wishlist
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                {wishlist.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors cursor-pointer"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Session Notice */}
          <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200/80 flex items-center gap-2 text-[11px] sm:text-xs text-neutral-500">
            <AlertCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>Wishlist resets when you close or refresh the page</span>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[#E11D48] mb-1">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-lg text-[#1A1A1A]">
                    Your wishlist is empty
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs leading-relaxed font-body">
                    Tap the heart icon on any product to save your favorite street combos and watches here.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white text-xs font-semibold font-heading transition-colors cursor-pointer shadow-sm"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {wishlist.map((product) => {
                  const isSoldOut = product.stock === 0;
                  return (
                    <div
                      key={product.id}
                      className="p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all flex gap-3.5 items-center relative group"
                    >
                      {/* Product Image Thumbnail */}
                      <button
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                        className="w-18 h-22 sm:w-20 sm:h-24 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/80 cursor-pointer"
                        title="View details"
                      >
                        <ProductImage
                          src={product.images[0]}
                          alt={`${product.name} — wishlist item`}
                          productName={product.name}
                          category={product.category}
                          className="w-full h-full object-cover"
                        />
                      </button>

                      {/* Info & Actions */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <button
                              onClick={() => {
                                onSelectProduct(product);
                                onClose();
                              }}
                              className="text-left font-heading font-bold text-xs sm:text-sm text-[#1A1A1A] hover:text-[#4A5D45] truncate transition-colors cursor-pointer"
                            >
                              {product.name}
                            </button>

                            {/* Remove button */}
                            <button
                              onClick={() => onRemoveFromWishlist(product)}
                              className="text-neutral-400 hover:text-[#DC2626] p-1 rounded-md transition-colors cursor-pointer shrink-0"
                              title="Remove from wishlist"
                              aria-label={`Remove ${product.name} from wishlist`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-[11px] text-neutral-500 uppercase tracking-wider mb-2">
                            {product.categoryGroup === 'combos'
                              ? 'Combo'
                              : product.categoryGroup === 'watches'
                              ? 'Watch'
                              : product.category}
                          </div>

                          {/* Price */}
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="font-heading font-bold text-sm sm:text-base text-[#1A1A1A]">
                              ₹{product.price}
                            </span>
                            {product.originalPrice > product.price && (
                              <span className="text-[11px] text-neutral-400 line-through">
                                ₹{product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Add to Bag CTA */}
                        <div>
                          {isSoldOut ? (
                            <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-md">
                              Sold Out
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                onAddToCart(product);
                              }}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#4A5D45] text-white text-xs font-semibold font-heading transition-colors cursor-pointer active:scale-95 shadow-xs"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Bag</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlist.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 font-heading font-semibold text-xs transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
