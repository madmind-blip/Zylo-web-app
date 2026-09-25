import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, ShoppingBag, ShieldCheck, Truck, RefreshCw, ChevronLeft, ChevronRight, Check } from 'lucide-react';
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
  const [scrollY, setScrollY] = useState<number>(0);
  const [isEntranceZoom, setIsEntranceZoom] = useState<boolean>(true);

  useEffect(() => {
    if (product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    } else {
      setSelectedSize('Free Size');
    }
    setQuantity(1);
    setActiveImageIndex(0);
    setAddedToast(false);
    setScrollY(0);
    setIsEntranceZoom(true);

    // Initial cinematic entrance scale relaxation
    const timer = setTimeout(() => {
      setIsEntranceZoom(false);
    }, 60);
    return () => clearTimeout(timer);
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
  const isLowStock = product.stock > 0 && product.stock < 5;
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

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      {/* Modal Backdrop click */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div
        onScroll={handleScroll}
        className="relative z-10 w-full sm:max-w-3xl max-h-[92vh] sm:max-h-[85vh] bg-white border border-neutral-200/90 rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden text-[#1A1A1A]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-neutral-100/90 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          aria-label="Close product view"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Side: Image Gallery with Reduced Height & Parallax Depth */}
        <div className="w-full md:w-5/12 flex flex-col bg-[#FAFAFA] p-4 sm:p-5 border-b md:border-b-0 md:border-r border-neutral-200 shrink-0 justify-between">
          <div className="relative h-56 sm:h-64 md:h-72 w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/70">
            {/* Scroll-based parallax depth & entrance zoom */}
            <div
              className={`w-full h-full transition-transform ${
                isEntranceZoom
                  ? 'scale-106 duration-700 ease-out'
                  : 'duration-150 ease-out'
              }`}
              style={{
                transform: `translateY(${Math.min(28, scrollY * 0.18)}px) scale(${
                  isEntranceZoom ? 1.06 : 1
                })`,
              }}
            >
              <ProductImage
                src={imageList[activeImageIndex]}
                alt={`${product.name} - view ${activeImageIndex + 1}`}
                productName={product.name}
                category={product.category}
                isSoldOut={isSoldOut}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* High-Contrast Discount Tag */}
            {product.discountPercent > 0 && !isSoldOut && (
              <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#16A34A] text-white shadow-sm tracking-wide">
                  -{product.discountPercent}%
                </span>
              </div>
            )}

            {/* Genuine Scarcity Badge (Only if stock < 5) */}
            {isLowStock && !isSoldOut && (
              <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1A1A1A]/85 text-white">
                  Only {product.stock} left
                </span>
              </div>
            )}

            {/* Sold Out Overlay */}
            {isSoldOut && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-2xs">
                <span className="px-3 py-1 rounded bg-[#1A1A1A] text-white font-heading font-semibold text-xs tracking-wider uppercase">
                  Sold Out
                </span>
              </div>
            )}

            {/* Image Nav Arrows (if more than 1 image) */}
            {imageList.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-xs border border-neutral-200 transition cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-xs border border-neutral-200 transition cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
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
                  className={`w-12 h-12 rounded-lg overflow-hidden border transition cursor-pointer shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A]'
                      : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <ProductImage
                    src={img}
                    alt="thumbnail"
                    productName={product.name}
                    category={product.category}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Immediate Buy Options */}
        <div
          onScroll={handleScroll}
          className="w-full md:w-7/12 p-5 sm:p-6 overflow-y-auto max-h-[60vh] md:max-h-none flex flex-col justify-between"
        >
          <div>
            {/* Category */}
            <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1">
              <span>{product.categoryGroup === 'combos' ? 'Combos' : product.categoryGroup === 'watches' ? 'Watches' : product.category}</span>
              <span className="mx-1.5">·</span>
              <span>Kota Hub</span>
            </div>

            {/* Title */}
            <h2 className="font-heading font-bold text-lg sm:text-xl text-[#1A1A1A] mb-1.5 leading-snug">
              {product.name}
            </h2>

            {product.subtitle && (
              <p className="text-xs text-neutral-500 mb-3">{product.subtitle}</p>
            )}

            {/* Pricing Section */}
            <div className="flex items-baseline gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-200/80 mb-4">
              <span className="font-heading font-bold text-xl sm:text-2xl text-[#1A1A1A]">
                ₹{product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              {product.originalPrice > product.price && (
                <span className="text-[11px] font-semibold text-[#4A5D45] bg-[#4A5D45]/10 px-2 py-0.5 rounded ml-auto">
                  Save ₹{product.originalPrice - product.price}
                </span>
              )}
            </div>

            {/* Size Selector */}
            {showSizeSelector ? (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-neutral-700">Size:</span>
                  <span className="text-[#1A1A1A] font-semibold">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#1A1A1A] text-white'
                          : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-3 text-xs text-neutral-500">
                Size: <span className="text-[#1A1A1A] font-medium">{product.sizes?.[0] || 'Free Size'}</span>
              </div>
            )}

            {/* Quantity Selector */}
            {!isSoldOut && (
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-neutral-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black disabled:opacity-30 cursor-pointer text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="w-7 text-center text-xs font-mono font-bold text-[#1A1A1A]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-black cursor-pointer text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-4 text-xs text-neutral-600 leading-relaxed font-body">
              <p className="mb-2">{product.description}</p>
              {product.details && product.details.length > 0 && (
                <ul className="space-y-1 text-neutral-600">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#4A5D45] shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-3 border-t border-neutral-100">
            {isSoldOut ? (
              <div className="p-3 bg-neutral-100 rounded-xl text-center text-neutral-600 text-xs font-semibold">
                Currently Out of Stock.
              </div>
            ) : (
              <>
                <button
                  onClick={handleOrderOnWhatsApp}
                  className="w-full py-3 px-4 rounded-xl bg-[#1A1A1A] hover:bg-[#4A5D45] text-white font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-98 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order on WhatsApp (Instant)</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-neutral-50 text-[#1A1A1A] border border-neutral-300 font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedToast ? 'Added to Bag! ✓' : 'Add to Bag'}</span>
                </button>
              </>
            )}

            {/* Trust Assurances */}
            <div className="flex items-center justify-between pt-2 text-[11px] text-neutral-500 border-t border-neutral-100">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-neutral-700" />
                Free &gt; ₹999
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                COD Available
              </span>
              <span className="flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 text-neutral-700" />
                7-Day Exchange
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
