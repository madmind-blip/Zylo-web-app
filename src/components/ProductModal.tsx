import React, { useState, useEffect } from 'react';
import { X, MessageCircle, ShoppingBag, ShieldCheck, Truck, RefreshCw, ChevronLeft, ChevronRight, MapPin, Check } from 'lucide-react';
import { Product } from '../types';
import { createProductWhatsAppUrl } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size';
  const [selectedSize, setSelectedSize] = useState<string>(defaultSize);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize('Free Size');
    }
    setQuantity(1);
    setActiveImageIndex(0);
    setAddedToast(false);
  }, [product]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const isSoldOut = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const showSizeSelector = !product.isFreeSize && product.sizes && product.sizes.length > 1;

  const handleOrderOnWhatsApp = () => {
    const url = createProductWhatsAppUrl(product, selectedSize, quantity);
    window.open(url, '_blank');
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2000);
  };

  const imageList = product.images.length > 0 ? product.images : [''];

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[88vh] bg-[#141414] border border-[#242424] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center border border-[#242424] transition-all cursor-pointer"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Image Gallery */}
        <div className="w-full md:w-1/2 flex flex-col bg-[#0A0A0A] p-4 sm:p-6 justify-between">
          <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-2xl overflow-hidden bg-zinc-950 border border-[#242424]">
            <ProductImage
              src={imageList[activeImageIndex]}
              alt={`${product.name} - view ${activeImageIndex + 1}`}
              productName={product.name}
              category={product.category}
              isSoldOut={isSoldOut}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
              {product.discountPercent > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-[#D4AF37] text-black font-heading font-extrabold text-xs shadow-md">
                  {product.discountPercent}% OFF
                </span>
              )}
              {isSoldOut ? (
                <span className="px-2.5 py-1 rounded-full bg-red-950/90 border border-red-700 text-red-300 font-heading font-bold text-xs uppercase tracking-wider">
                  Sold Out
                </span>
              ) : isLowStock ? (
                <span className="px-2.5 py-1 rounded-full bg-amber-950/90 border border-amber-600/80 text-amber-300 font-heading font-bold text-xs">
                  🔥 Only {product.stock} left in Kota!
                </span>
              ) : null}
            </div>

            {/* Image Nav Arrows (if more than 1 image) */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-zinc-700 transition cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-zinc-700 transition cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails (only if multiple images) */}
          {imageList.length > 1 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                    activeImageIndex === idx ? 'border-[#D4AF37] scale-105' : 'border-[#242424] opacity-60 hover:opacity-100'
                  }`}
                >
                  <ProductImage
                    src={img}
                    alt="thumb"
                    productName={product.name}
                    category={product.category}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Order Actions */}
        <div className="w-full md:w-1/2 p-5 sm:p-7 overflow-y-auto max-h-[60vh] sm:max-h-none flex flex-col justify-between">
          <div>
            {/* Tagline / Category */}
            <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider mb-1.5">
              <span>{product.categoryGroup === 'combos' ? 'Combos' : product.categoryGroup === 'watches' ? 'Watches' : product.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-zinc-400">
                <MapPin className="w-3 h-3 text-[#D4AF37]" />
                Kota, Rajasthan
              </span>
            </div>

            {/* Title */}
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white mb-1.5 leading-tight">
              {product.name}
            </h2>

            {/* Tag Badges */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {product.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-heading font-semibold"
                  >
                    ★ {t}
                  </span>
                ))}
              </div>
            )}

            {product.subtitle && (
              <p className="text-xs sm:text-sm text-zinc-400 mb-3">{product.subtitle}</p>
            )}

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 p-3 rounded-2xl bg-[#0A0A0A] border border-[#242424] mb-5">
              <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#D4AF37]">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="font-heading text-base text-zinc-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              {product.originalPrice > product.price && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full ml-auto">
                  Save ₹{product.originalPrice - product.price}
                </span>
              )}
            </div>

            {/* Size Selector: "Free size" means a single option, no size selector needed */}
            {showSizeSelector ? (
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-heading font-bold text-zinc-300">
                    Select Size:
                  </span>
                  <span className="text-[#D4AF37] font-semibold">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 scale-105'
                          : 'bg-[#0A0A0A] text-zinc-300 border border-[#242424] hover:border-zinc-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0A0A0A] border border-[#242424] text-xs text-zinc-300">
                <span className="text-zinc-500">Size:</span>
                <span className="text-[#D4AF37] font-bold">
                  {product.sizes?.[0] || 'Free Size (Standard)'}
                </span>
              </div>
            )}

            {/* Quantity Selector */}
            {!isSoldOut && (
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-heading font-bold text-zinc-300">Quantity:</span>
                <div className="flex items-center border border-[#242424] rounded-xl bg-[#0A0A0A]">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-sm font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-zinc-400">
                  Total: <strong className="text-white">₹{product.price * quantity}</strong>
                </span>
              </div>
            )}

            {/* Description */}
            <div className="mb-5">
              <h4 className="text-xs font-heading font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                Product Description
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-body mb-3">
                {product.description}
              </p>
              {product.details && product.details.length > 0 && (
                <ul className="space-y-1">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-3 border-t border-[#242424]">
            {isSoldOut ? (
              <div className="p-3 bg-red-950/40 border border-red-800 rounded-2xl text-center text-red-300 text-sm font-heading font-bold">
                Currently Out of Stock at Kota Hub. Please check back soon!
              </div>
            ) : (
              <>
                {/* Primary: Order on WhatsApp Button */}
                <button
                  onClick={handleOrderOnWhatsApp}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-black font-heading font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#25D366]/20 active:scale-[0.98] cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-black stroke-black" />
                  <span>Order on WhatsApp (Instant)</span>
                </button>

                {/* Secondary: Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 rounded-2xl bg-[#242424] hover:bg-[#2e2e2e] text-white border border-[#333] font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                  <span>{addedToast ? 'Added to Bag! ✓' : 'Add to Bag'}</span>
                </button>
              </>
            )}

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] sm:text-xs text-zinc-400 text-center">
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#0A0A0A] border border-[#242424]">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Free Above ₹999</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#0A0A0A] border border-[#242424]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>COD Available</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-[#0A0A0A] border border-[#242424]">
                <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>7-Day Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
