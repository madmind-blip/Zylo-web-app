import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  MessageCircle,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
  Heart,
  Link2,
  Share2,
  ZoomIn,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Product } from '../types';
import { createProductWhatsAppUrl } from '../utils/whatsapp';
import { parseProductSizes, getProductCategoryHighlights } from '../utils/csvParser';
import { getCommonColorDot } from '../utils/colorUtils';
import { ProductImage } from './ProductImage';
import { CheckoutModal } from './CheckoutModal';
import { ImageViewerModal } from './ImageViewerModal';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, quantity: number, color?: string) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
  recentlyViewed?: Product[];
  allProducts?: Product[];
  onSelectProduct?: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted = false,
  onToggleWishlist,
  recentlyViewed = [],
  allProducts = [],
  onSelectProduct,
}) => {
  if (!product) return null;

  const parsedSizesInfo = parseProductSizes(product.sizes);
  const [selectedSize, setSelectedSize] = useState<string>(parsedSizesInfo.sizes[0] || 'Free Size');
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);
  const [scrollY, setScrollY] = useState<number>(0);
  const [isEntranceZoom, setIsEntranceZoom] = useState<boolean>(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Touch tracking for swipe left/right on main image
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchMovedRef = useRef<boolean>(false);

  // Compute the last 3 products clicked by the user (excluding active product)
  const clickedRecent = (recentlyViewed || []).filter((p) => p.id !== product.id);
  const fallbackRecent = (allProducts || []).filter((p) => p.id !== product.id).slice(0, 3);
  const carouselProducts = clickedRecent.length > 0 ? clickedRecent.slice(0, 3) : fallbackRecent;

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 220;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (product) {
      const parsed = parseProductSizes(product.sizes);
      setSelectedSize(parsed.sizes[0] || 'Free Size');
      setQuantity(1);
      setAddedToast(false);
      setScrollY(0);
      setIsEntranceZoom(true);

      const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
      setSelectedColor(defaultColor);

      const defaultColorImg = defaultColor && product.colorMap ? product.colorMap[defaultColor.toLowerCase()] : undefined;
      const gList = product.images && product.images.length > 0 ? product.images : [];
      const initialDisplay = [...gList];
      if (defaultColorImg && !initialDisplay.includes(defaultColorImg)) {
        initialDisplay.push(defaultColorImg);
      }
      if (defaultColorImg) {
        const idx = initialDisplay.indexOf(defaultColorImg);
        setActiveImageIndex(idx >= 0 ? idx : 0);
      } else {
        setActiveImageIndex(0);
      }

      if (modalContainerRef.current) {
        modalContainerRef.current.scrollTop = 0;
      }

      // Initial cinematic entrance scale relaxation
      const timer = setTimeout(() => {
        setIsEntranceZoom(false);
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [product]);

  // Gallery images from sheet IMAGE column
  const galleryImages = product.images && product.images.length > 0 ? product.images : [];
  const activeColorImage = selectedColor && product.colorMap ? product.colorMap[selectedColor.toLowerCase()] : undefined;

  // Below main image, show all gallery images (from IMAGE) plus the selected color's image
  const displayImages = useMemo(() => {
    const list = [...galleryImages];
    if (activeColorImage && !list.includes(activeColorImage)) {
      list.push(activeColorImage);
    }
    return list.length > 0 ? list : [''];
  }, [galleryImages, activeColorImage]);

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    const colorImg = product.colorMap ? product.colorMap[colorName.toLowerCase()] : undefined;
    if (colorImg) {
      // Switch main image to that color's image from COLOR IMAGES
      const list = [...galleryImages];
      if (!list.includes(colorImg)) {
        list.push(colorImg);
      }
      const idx = list.indexOf(colorImg);
      setActiveImageIndex(idx >= 0 ? idx : 0);
    }
    // If that color has no image, keep the current image
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchMovedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = Math.abs(e.touches[0].clientX - touchStartXRef.current);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartYRef.current);
    if (deltaX > 8 || deltaY > 8) {
      touchMovedRef.current = true;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= 35) {
      if (deltaX < 0) {
        nextImage();
      } else {
        prevImage();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

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
  const { sizes: availableSizes, isFreeSize } = parseProductSizes(product.sizes);
  const highlights =
    product.details &&
    product.details.length > 0 &&
    !product.details.includes('Set of premium breathable cotton clothing items')
      ? product.details
      : getProductCategoryHighlights(product.name, product.category, product.categoryGroup);
  const itemTotal = product.price * quantity;
  const isFreeDelivery = itemTotal >= 999;
  const shippingFee = isFreeDelivery ? 0 : 150;
  const grandTotal = itemTotal + shippingFee;

  const handleOrderOnWhatsApp = () => {
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, quantity, selectedColor);
    setAddedToast(true);
    setTimeout(() => {
      setAddedToast(false);
    }, 2000);
  };

  const getProductShareUrl = () => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}?product=${encodeURIComponent(product.id)}`;
  };

  const handleCopyLink = async () => {
    const url = getProductShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2200);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleShare = async () => {
    const url = getProductShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Zyle - ${product.name}`,
          text: `Check out ${product.name} on Zyle!`,
          url,
        });
      } catch (err) {
        if ((err as Error)?.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
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
        ref={modalContainerRef}
        onScroll={handleScroll}
        className="relative z-10 w-full sm:max-w-4xl max-h-[94vh] sm:max-h-[90vh] bg-white border border-neutral-200/90 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-y-auto text-[#1A1A1A]"
      >
        {/* Top-Right Action Controls: Wishlist, Copy Link, Share, Close */}
        <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1.5 sm:gap-2">
          {/* Wishlist Toggle Button */}
          {onToggleWishlist && (
            <button
              onClick={() => onToggleWishlist(product)}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer shadow-xs border border-neutral-200/80 active:scale-90"
              aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
              title={isWishlisted ? 'Saved in wishlist' : 'Save to wishlist'}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isWishlisted ? 'text-[#E11D48] fill-[#E11D48]' : 'text-neutral-700'
                }`}
              />
            </button>
          )}

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer shadow-xs border border-neutral-200/80 active:scale-90"
            aria-label="Copy link to product"
            title="Copy link"
          >
            <Link2 className="w-4 h-4" />
          </button>

          {/* Share Button (Native Sheet or Copy fallback) */}
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer shadow-xs border border-neutral-200/80 active:scale-90"
            aria-label="Share product"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer shadow-xs border border-neutral-200/80 active:scale-90"
            aria-label="Close product view"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Link Copied Floating Toast */}
        {copiedToast && (
          <div className="absolute top-13 right-3.5 z-30 px-3 py-1.5 rounded-full bg-[#1A1A1A] text-white text-xs font-semibold shadow-lg flex items-center gap-1.5 animate-fade-in pointer-events-none">
            <Check className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Link copied</span>
          </div>
        )}

        {/* Main Product Layout (2 columns on md+) */}
        <div className="flex flex-col md:flex-row">
          {/* Left Side: Image Gallery with Reduced Height & Parallax Depth */}
          <div className="w-full md:w-5/12 flex flex-col bg-[#FAFAFA] p-4 sm:p-5 border-b md:border-b-0 md:border-r border-neutral-200 shrink-0 justify-between">
          <div
            onClick={() => {
              if (!touchMovedRef.current) {
                setIsViewerOpen(true);
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative h-56 sm:h-64 md:h-72 w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200/70 cursor-zoom-in group/img select-none"
            title="Tap to zoom image (swipe left/right to change)"
          >
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
                src={displayImages[activeImageIndex] || displayImages[0]}
                alt={`${product.name} - view ${activeImageIndex + 1}`}
                productName={product.name}
                category={product.category}
                isSoldOut={isSoldOut}
                className="w-full h-full object-cover object-center"
              />
            </div>

            {/* Tap to Zoom Badge */}
            <div className="absolute bottom-2.5 right-2.5 z-10 px-2 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium flex items-center gap-1 opacity-80 group-hover/img:opacity-100 transition-opacity pointer-events-none">
              <ZoomIn className="w-3 h-3" />
              <span>Zoom</span>
            </div>

            {/* High-Contrast Discount Tag */}
            {product.discountPercent > 0 && !isSoldOut && (
              <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#DC2626] text-white shadow-sm tracking-wide">
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
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-xs border border-neutral-200 transition cursor-pointer"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-xs border border-neutral-200 transition cursor-pointer"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails of all gallery images plus the selected color's image */}
          {displayImages.length > 1 && (
            <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border transition cursor-pointer shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-[#1A1A1A] ring-2 ring-[#EA580C]/40'
                      : 'border-neutral-200 opacity-60 hover:opacity-100'
                  }`}
                  aria-label={`View thumbnail ${idx + 1}`}
                >
                  <ProductImage
                    src={img}
                    alt={`${product.name} thumbnail view ${idx + 1}`}
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
            {/* Category Breadcrumb Subtitle */}
            <div className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-1">
              <span>{product.categoryGroup === 'combos' ? 'Combos' : product.categoryGroup === 'watches' ? 'Watches' : product.category}</span>
            </div>

            {/* Title (UPPERCASE) */}
            <h2 className="font-heading font-bold text-lg sm:text-xl text-[#1A1A1A] mb-3 leading-snug uppercase tracking-tight">
              {product.name.toUpperCase()}
            </h2>

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
                <span className="text-[11px] font-semibold text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded ml-auto">
                  Save ₹{product.originalPrice - product.price}
                </span>
              )}
            </div>

            {/* Color Selector (Above size selector) */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-neutral-700">Color:</span>
                    <span className="text-[#1A1A1A] font-bold">
                      {selectedColor || product.colors[0]}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => {
                    const isSelected = (selectedColor || product.colors![0]) === color;
                    const dot = getCommonColorDot(color);
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleSelectColor(color)}
                        className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold transition-all duration-150 cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] shadow-xs scale-102 ring-2 ring-[#EA580C]/40'
                            : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400 hover:text-black'
                        }`}
                        aria-pressed={isSelected}
                      >
                        {dot && (
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
                            style={{
                              backgroundColor: dot.bg,
                              border: dot.border
                                ? `1px solid ${dot.border}`
                                : isSelected && dot.bg.toLowerCase() === '#ffffff'
                                ? '1px solid #FFFFFF'
                                : '1px solid rgba(0,0,0,0.15)',
                            }}
                          />
                        )}
                        <span>{color}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {isFreeSize ? (
              <div className="mb-4 flex items-center gap-2 text-xs">
                <span className="font-semibold text-neutral-700">Size:</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-100 text-[#1A1A1A] border border-neutral-200">
                  Free Size
                </span>
              </div>
            ) : (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-neutral-700">Select Size:</span>
                  <span className="text-[#1A1A1A] font-bold px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                    {selectedSize}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[44px] h-10 px-3.5 rounded-xl text-xs font-heading font-bold transition-all duration-150 cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] shadow-xs scale-102 ring-2 ring-[#EA580C]/40'
                            : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400 hover:text-black'
                        }`}
                        aria-pressed={isSelected}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
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

            {/* Description & Category Highlights */}
            <div className="mb-4">
              <h3 className="text-xs font-heading font-bold text-neutral-800 uppercase tracking-wider mb-1.5">
                Description
              </h3>
              <p className="text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-body mb-3">
                {product.description || `${product.name} — crafted with premium materials and fast nationwide delivery.`}
              </p>

              {highlights.length > 0 && (
                <ul className="space-y-1.5 text-xs text-neutral-600 font-body">
                  {highlights.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
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
                  className="w-full py-3 px-4 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 cursor-pointer active:scale-98"
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
                Exchange Policy
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Viewed Products Horizontal Carousel */}
      {carouselProducts.length > 0 && (
        <section
          aria-label="Recently viewed products"
          className="border-t border-neutral-200/80 bg-neutral-50/80 p-4 sm:p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#EA580C]" />
              <h3 className="font-heading font-bold text-xs sm:text-sm text-[#1A1A1A] uppercase tracking-wider">
                Recently Viewed
              </h3>
              <span className="text-[11px] text-neutral-400 font-mono">
                ({carouselProducts.length})
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-7 h-7 rounded-full bg-white border border-neutral-200 hover:border-[#EA580C]/50 hover:text-[#EA580C] text-neutral-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
                aria-label="Previous recently viewed product"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-7 h-7 rounded-full bg-white border border-neutral-200 hover:border-[#EA580C]/50 hover:text-[#EA580C] text-neutral-600 flex items-center justify-center transition cursor-pointer shadow-2xs"
                aria-label="Next recently viewed product"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Horizontal Carousel */}
          <div
            ref={carouselRef}
            className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory scrollbar-none"
          >
            {carouselProducts.map((recentItem) => (
              <div
                key={recentItem.id}
                onClick={() => {
                  if (onSelectProduct) {
                    onSelectProduct(recentItem);
                  }
                }}
                className="min-w-[170px] sm:min-w-[200px] max-w-[210px] bg-white border border-neutral-200/90 hover:border-[#EA580C] rounded-xl p-2.5 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer group snap-start shrink-0 flex flex-col justify-between"
                title={`View ${recentItem.name}`}
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-neutral-100 mb-2">
                  <ProductImage
                    src={recentItem.images[0]}
                    alt={recentItem.name}
                    productName={recentItem.name}
                    category={recentItem.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {recentItem.originalPrice > recentItem.price && (
                    <span className="absolute top-1.5 left-1.5 bg-[#EA580C] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                      {Math.round(
                        ((recentItem.originalPrice - recentItem.price) /
                          recentItem.originalPrice) *
                          100
                      )}
                      % OFF
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium truncate mb-0.5">
                      {recentItem.categoryGroup === 'combos'
                        ? 'Combo'
                        : recentItem.categoryGroup === 'watches'
                        ? 'Watch'
                        : recentItem.category}
                    </span>
                    <h4 className="font-heading font-bold text-xs text-[#1A1A1A] group-hover:text-[#EA580C] transition-colors line-clamp-1 uppercase">
                      {recentItem.name}
                    </h4>
                  </div>

                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="font-heading font-bold text-xs sm:text-sm text-[#1A1A1A]">
                      ₹{recentItem.price}
                    </span>
                    {recentItem.originalPrice > recentItem.price && (
                      <span className="text-[10px] text-neutral-400 line-through">
                        ₹{recentItem.originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {/* Navigate back CTA */}
                <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-[#EA580C] font-semibold group-hover:text-[#C2410C]">
                  <span>View Piece</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>

      {/* Instant Checkout Order Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={[
          {
            name: product.name.toUpperCase(),
            size: selectedSize,
            color: selectedColor,
            quantity,
            price: product.price,
          },
        ]}
        total={grandTotal}
        subtotal={itemTotal}
        shippingFee={shippingFee}
        title="Complete Your Order"
      />

      {/* Fullscreen Image Zoom Viewer */}
      {isViewerOpen && (
        <ImageViewerModal
          images={displayImages}
          initialIndex={Math.min(activeImageIndex, displayImages.length - 1)}
          productName={product.name}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </div>
  );
};
