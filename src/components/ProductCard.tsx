import React from 'react';
import { ShoppingBag, Eye, Zap, Flame } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
}) => {
  const discountPercent = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const isSoldOut = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-[#141414] hover:bg-[#181818] border border-[#242424] hover:border-[#D4AF37]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/60 cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
            isSoldOut ? 'filter grayscale contrast-75 opacity-60' : ''
          }`}
        />

        {/* Gradient Shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20 opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1 z-10 pointer-events-none">
          {/* Discount Badge */}
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#D4AF37] text-black font-heading font-extrabold text-[10px] sm:text-xs shadow-md">
            {discountPercent}% OFF
          </span>

          {/* Stock Badges */}
          {isSoldOut ? (
            <span className="px-2 py-0.5 rounded-full bg-red-950/90 border border-red-700 text-red-300 font-heading font-bold text-[10px] sm:text-xs uppercase tracking-wider">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/90 border border-amber-600/70 text-amber-300 font-heading font-bold text-[10px] sm:text-xs animate-pulse shadow-sm">
              <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
              Only {product.stock} left
            </span>
          ) : product.isNewArrival ? (
            <span className="px-2 py-0.5 rounded-full bg-zinc-900/90 border border-zinc-700 text-[#D4AF37] font-heading font-semibold text-[10px] sm:text-xs">
              New
            </span>
          ) : null}
        </div>

        {/* Sold Out Full Overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
            <div className="px-4 py-1.5 rounded-full bg-red-900/90 border border-red-500 text-white font-heading font-extrabold text-xs sm:text-sm tracking-widest uppercase">
              Sold Out
            </div>
          </div>
        )}

        {/* Quick View hint on hover */}
        {!isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[1px] pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0A0A0A]/90 text-white text-xs font-heading font-semibold border border-[#D4AF37]/50 shadow-lg">
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              Quick View
            </span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Subtitle / Category Label */}
          <div className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-[#D4AF37] mb-1 truncate">
            {product.category === 'combos'
              ? 'Complete Drip Combo'
              : product.category === 'watches'
              ? 'Affordable Luxury Watch'
              : product.category}
          </div>

          {/* Product Name in Syne */}
          <h3 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug mb-2">
            {product.name}
          </h3>
        </div>

        <div className="pt-2 border-t border-[#242424]/60">
          {/* Price Row */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-heading font-extrabold text-base sm:text-xl text-[#D4AF37]">
              ₹{product.price}
            </span>
            <span className="font-heading text-xs sm:text-sm text-zinc-500 line-through">
              ₹{product.originalPrice}
            </span>
          </div>

          {/* Add to Cart / Action Button */}
          {isSoldOut ? (
            <button
              disabled
              className="w-full py-2 px-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 font-heading font-semibold text-xs cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={(e) => onAddToCart(product, e)}
              className="w-full py-2 px-3 rounded-xl bg-[#242424] hover:bg-[#D4AF37] text-white hover:text-black font-heading font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
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
