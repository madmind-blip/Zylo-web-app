import React from 'react';

export const ProductSkeletonGrid: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs animate-pulse"
        >
          {/* Skeleton Image Box */}
          <div className="relative aspect-[4/5] w-full bg-neutral-100 overflow-hidden" />

          {/* Skeleton Text & Button */}
          <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 gap-3">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-neutral-200 rounded-full" />
              <div className="h-4 w-full bg-neutral-200 rounded-md" />
              <div className="h-4 w-3/4 bg-neutral-200 rounded-md" />
            </div>

            <div className="pt-2 border-t border-neutral-100 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 bg-neutral-200 rounded-md" />
                <div className="h-3.5 w-12 bg-neutral-100 rounded-md" />
              </div>
              <div className="h-9 w-full bg-neutral-200 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
