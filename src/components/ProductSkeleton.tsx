import React from 'react';

export const ProductSkeletonGrid: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col bg-[#141414] border border-[#242424] rounded-2xl overflow-hidden animate-pulse"
        >
          {/* Shimmer Image Box */}
          <div className="relative aspect-[4/5] w-full bg-gradient-to-b from-[#1c1c1c] via-[#202020] to-[#181818] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
            <div className="absolute top-2.5 left-2.5 w-14 h-5 rounded-full bg-zinc-800" />
          </div>

          {/* Text & Button placeholders */}
          <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 gap-3">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-zinc-800 rounded-full" />
              <div className="h-4 w-full bg-zinc-800 rounded-md" />
              <div className="h-4 w-3/4 bg-zinc-800 rounded-md" />
            </div>

            <div className="pt-2 border-t border-[#242424]/60 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="h-5 w-16 bg-zinc-800 rounded-md" />
                <div className="h-3.5 w-12 bg-zinc-800/60 rounded-md" />
              </div>
              <div className="h-9 w-full bg-zinc-800/80 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
