import React from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../types';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
}) => {
  const isSoldOut = product.stock === 0;
  // Urgency badge only when genuinely below 5
  const isLowStock = product.stock > 0 && product.stock < 5;
  const hasDiscount = product.discountPercent > 0;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-white border border-neutral-200/90 rounded-2xl overflow-hidden hover:border-neutral-400 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F5F5]">
        <ProductImage
          src={product.images[0]}
          alt={`${product.name} — ${product.category}`}
          productName={product.name}
          category={product.category}
          isSoldOut={isSoldOut}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
        />

        {/* Wishlist Heart Button (Top-Right with soft background) */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-md border border-black/5 shadow-xs flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
            title={isWishlisted ? 'Saved in wishlist' : 'Save to wishlist'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isWishlisted
                  ? 'text-[#E11D48] fill-[#E11D48]'
                  : 'text-neutral-700 hover:text-black'
              }`}
            />
          </button>
        )}

        {/* Single High-Contrast Discount Tag */}
        {hasDiscount && !isSoldOut && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#DC2626] text-white shadow-sm tracking-wide">
              -{product.discountPercent}%
            </span>
          </div>
        )}

        {/* Low Stock Badge (Only if genuinely below 5, positioned bottom-left) */}
        {isLowStock && !isSoldOut && (
          <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1A1A1A]/85 text-white shadow-2xs">
              Only {product.stock} left
            </span>
          </div>
        )}

        {/* Sold Out Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75 backdrop-blur-[1px]">
            <span className="px-3 py-1 rounded bg-[#1A1A1A] text-white font-heading font-semibold text-xs tracking-wider uppercase">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Category */}
          <div
            className="text-[11px] uppercase tracking-wider font-medium text-neutral-400 mb-1 truncate"
            title={product.category}
          >
            {product.category}
          </div>

          {/* Product Name in Syne (UPPERCASE) */}
          <h3
            className="font-heading font-bold text-xs sm:text-[13px] text-[#1A1A1A] group-hover:text-[#4A5D45] transition-colors line-clamp-2 leading-tight sm:leading-snug mb-2 uppercase tracking-tight min-h-[2.1rem] sm:min-h-[2.4rem]"
            title={product.name.toUpperCase()}
          >
            {product.name.toUpperCase()}
          </h3>
        </div>

        <div className="pt-2 border-t border-neutral-100">
          {/* Price Row: Selling Price & Cut-off Price */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-heading font-bold text-base sm:text-lg text-[#1A1A1A]">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="font-heading text-xs text-neutral-400 line-through font-normal">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Add to Bag Button */}
          {isSoldOut ? (
            <button
              disabled
              className="w-full py-2.5 px-3 rounded-xl bg-neutral-100 text-neutral-400 font-heading font-medium text-xs cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={(e) => onAddToCart(product, e)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white font-heading font-semibold text-xs sm:text-sm transition-colors duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 shadow-sm"
              aria-label={`Add ${product.name} to Cart`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
