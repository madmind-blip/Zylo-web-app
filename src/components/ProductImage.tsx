import React, { useState, useEffect } from 'react';
import { Watch, Shirt, Package } from 'lucide-react';

interface ProductImageProps {
  src?: string;
  alt: string;
  productName: string;
  category?: string;
  className?: string;
  isSoldOut?: boolean;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  productName,
  category,
  className = 'w-full h-full object-cover',
  isSoldOut = false,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!src || !src.trim()) {
      setHasError(true);
      return;
    }
    setCurrentSrc(src.trim());
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    // If it fails to load, show a neutral dark placeholder with the product name, never a broken image icon.
    setHasError(true);
  };

  const isWatch =
    category?.toLowerCase().includes('watch') ||
    productName.toLowerCase().includes('watch');

  if (hasError || !currentSrc) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#181818] to-[#101010] border border-[#242424] text-center select-none relative overflow-hidden ${
          isSoldOut ? 'opacity-60 grayscale' : ''
        }`}
      >
        {/* Subtle background ambient ring */}
        <div className="absolute w-32 h-32 rounded-full bg-[#D4AF37]/5 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center max-w-[90%]">
          {/* Neutral luxury icon */}
          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] border border-[#242424] flex items-center justify-center text-[#D4AF37] mb-2.5 shadow-inner">
            {isWatch ? (
              <Watch className="w-6 h-6 stroke-[1.5]" />
            ) : (
              <Shirt className="w-6 h-6 stroke-[1.5]" />
            )}
          </div>

          {/* Product Name in Syne */}
          <span className="font-heading font-bold text-xs sm:text-sm text-zinc-300 line-clamp-2 leading-snug">
            {productName}
          </span>

          {/* Discreet brand watermark */}
          <span className="mt-1 text-[9px] uppercase tracking-widest font-heading font-semibold text-[#D4AF37]/60">
            Zyle Kota
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-950">
      {/* Loading shimmer before image arrives */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#161616] animate-pulse flex items-center justify-center">
          <Package className="w-6 h-6 text-zinc-700 animate-pulse" />
        </div>
      )}

      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${isSoldOut ? 'filter grayscale contrast-75 opacity-60' : ''}`}
      />
    </div>
  );
};
