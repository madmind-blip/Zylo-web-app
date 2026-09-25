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
    setHasError(true);
  };

  const isWatch =
    category?.toLowerCase().includes('watch') ||
    productName.toLowerCase().includes('watch');

  if (hasError || !currentSrc) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 bg-neutral-100 border border-neutral-200 text-center select-none relative overflow-hidden ${
          isSoldOut ? 'opacity-60 grayscale' : ''
        }`}
      >
        <div className="relative z-10 flex flex-col items-center justify-center max-w-[90%]">
          {/* Neutral minimal icon */}
          <div className="w-11 h-11 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 mb-2 shadow-2xs">
            {isWatch ? (
              <Watch className="w-5 h-5 stroke-[1.5]" />
            ) : (
              <Shirt className="w-5 h-5 stroke-[1.5]" />
            )}
          </div>

          {/* Product Name in Syne */}
          <span className="font-heading font-semibold text-xs sm:text-sm text-neutral-800 line-clamp-2 leading-snug">
            {productName}
          </span>

          {/* Discreet brand watermark */}
          <span className="mt-1 text-[9px] uppercase tracking-widest font-heading font-medium text-neutral-400">
            Zyle Kota
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-neutral-100">
      {/* Loading placeholder before image arrives */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
          <Package className="w-5 h-5 text-neutral-400 animate-pulse" />
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
