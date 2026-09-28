import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ImageViewerModalProps {
  images: string[];
  initialIndex?: number;
  productName: string;
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  images,
  initialIndex = 0,
  productName,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState<boolean>(true);

  // Touch tracking for pinch and pan
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startDragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialDistanceRef = useRef<number | null>(null);
  const initialScaleRef = useRef<number>(1);
  const lastTapRef = useRef<number>(0);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Auto-hide hint after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation & escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length]);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const goToPrev = useCallback(() => {
    resetZoom();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length, resetZoom]);

  const goToNext = useCallback(() => {
    resetZoom();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length, resetZoom]);

  // Double tap handler
  const handleDoubleTap = (clientX: number, clientY: number) => {
    setShowHint(false);
    if (scale > 1.2) {
      resetZoom();
    } else {
      setScale(2.5);
      // Center zoom towards tap point if container is available
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const offsetX = (rect.width / 2 - clientX) * 0.7;
        const offsetY = (rect.height / 2 - clientY) * 0.7;
        setPosition({ x: offsetX, y: offsetY });
      }
    }
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setShowHint(false);
    const zoomFactor = e.deltaY < 0 ? 1.2 : 0.85;
    setScale((prevScale) => {
      const nextScale = Math.min(Math.max(prevScale * zoomFactor, 1), 4);
      if (nextScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return nextScale;
    });
  };

  // Mouse Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      isDraggingRef.current = true;
      startDragRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current && scale > 1) {
      setPosition({
        x: e.clientX - startDragRef.current.x,
        y: e.clientY - startDragRef.current.y,
      });
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Touch handlers (pinch, double-tap, pan, swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    const now = Date.now();
    const touches = e.touches;

    if (touches.length === 1) {
      touchStartPosRef.current = { x: touches[0].clientX, y: touches[0].clientY };

      // Double tap detection
      if (now - lastTapRef.current < 300) {
        handleDoubleTap(touches[0].clientX, touches[0].clientY);
        lastTapRef.current = 0;
        return;
      }
      lastTapRef.current = now;

      if (scale > 1) {
        isDraggingRef.current = true;
        startDragRef.current = {
          x: touches[0].clientX - position.x,
          y: touches[0].clientY - position.y,
        };
      }
    } else if (touches.length === 2) {
      // Pinch start
      setShowHint(false);
      isDraggingRef.current = false;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      initialDistanceRef.current = Math.hypot(dx, dy);
      initialScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touches = e.touches;

    if (touches.length === 2 && initialDistanceRef.current !== null) {
      // Pinch to zoom
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      const currentDistance = Math.hypot(dx, dy);
      const ratio = currentDistance / initialDistanceRef.current;
      const newScale = Math.min(Math.max(initialScaleRef.current * ratio, 1), 4);
      setScale(newScale);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
    } else if (touches.length === 1 && isDraggingRef.current && scale > 1) {
      // Drag to pan when zoomed
      setPosition({
        x: touches[0].clientX - startDragRef.current.x,
        y: touches[0].clientY - startDragRef.current.y,
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      initialDistanceRef.current = null;
    }
    if (e.touches.length === 0) {
      isDraggingRef.current = false;

      // If at scale 1, detect horizontal swipe for next/prev
      if (scale === 1 && touchStartPosRef.current) {
        const touchEnd = e.changedTouches[0];
        const diffX = touchEnd.clientX - touchStartPosRef.current.x;
        const diffY = touchEnd.clientY - touchStartPosRef.current.y;

        if (Math.abs(diffX) > 50 && Math.abs(diffY) < 60) {
          if (diffX < 0) {
            goToNext();
          } else {
            goToPrev();
          }
        }
      }
    }
  };

  const currentImage = images[currentIndex] || '';

  return (
    <div
      className="fixed inset-0 z-60 bg-black/95 flex flex-col justify-between select-none touch-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="font-heading font-bold text-white text-sm sm:text-base tracking-wide truncate max-w-[200px] sm:max-w-md">
            {productName}
          </span>
          {images.length > 1 && (
            <span className="text-xs font-mono text-neutral-400 bg-white/10 px-2 py-0.5 rounded-full">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls for desktop/tablet */}
          <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-full p-1 mr-2">
            <button
              onClick={() => {
                setShowHint(false);
                setScale((s) => Math.min(s + 0.5, 4));
              }}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setShowHint(false);
                setScale((s) => {
                  const next = Math.max(s - 0.5, 1);
                  if (next === 1) setPosition({ x: 0, y: 0 });
                  return next;
                });
              }}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            {scale > 1 && (
              <button
                onClick={resetZoom}
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Reset Zoom"
                aria-label="Reset zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            aria-label="Close image viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Canvas Area */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative flex-1 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            transition: isDraggingRef.current ? 'none' : 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          className="max-w-full max-h-full flex items-center justify-center pointer-events-none will-change-transform"
        >
          <img
            src={currentImage}
            alt={`${productName} - enlarged view ${currentIndex + 1}`}
            className="max-h-[82vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-lg shadow-2xl"
            draggable={false}
          />
        </div>

        {/* Zoom Hint Toast on First Open */}
        {showHint && (
          <div className="absolute bottom-6 z-30 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-xs sm:text-sm font-medium tracking-wide shadow-lg border border-white/10 pointer-events-none animate-fade-in">
            Pinch or double-tap to zoom
          </div>
        )}

        {/* Left & Right Chevron Controls (Desktop / when images > 1) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm border border-white/10 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-sm border border-white/10 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Strip (if multiple images) */}
      {images.length > 1 && (
        <div className="relative z-20 py-4 px-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => {
                resetZoom();
                setCurrentIndex(idx);
              }}
              className={`w-12 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                currentIndex === idx
                  ? 'border-white scale-105 shadow-md'
                  : 'border-white/30 opacity-50 hover:opacity-90'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
