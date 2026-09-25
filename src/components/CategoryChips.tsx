import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export type CategoryFilter = 'all' | 'combos' | 'watches' | 'under-1500' | 'under-2000' | 'under-2500';

interface CategoryChipsProps {
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalCount: number;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  activeCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  totalCount,
}) => {
  const chips: { id: CategoryFilter; label: string; badge?: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'combos', label: 'Combos', badge: 'Combo Sets' },
    { id: 'watches', label: 'Watches', badge: 'Hot' },
    { id: 'under-1500', label: 'Under ₹1500' },
    { id: 'under-2000', label: 'Under ₹2000' },
    { id: 'under-2500', label: 'Under ₹2500' },
  ];

  return (
    <div className="py-4 border-b border-[#242424] bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Scrollable Chips: All, Combos, Watches, Under ₹1500, Under ₹2000, Under ₹2500 */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {chips.map((chip) => {
              const isActive = activeCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => onSelectCategory(chip.id)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-heading font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-black shadow-md shadow-[#D4AF37]/20 scale-105'
                      : 'bg-[#141414] text-zinc-300 hover:text-white border border-[#242424] hover:border-zinc-700'
                  }`}
                >
                  <span>{chip.label}</span>
                  {chip.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full uppercase font-bold tracking-wider ${
                        isActive
                          ? 'bg-black text-[#D4AF37]'
                          : 'bg-[#D4AF37]/20 text-[#D4AF37]'
                      }`}
                    >
                      {chip.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Count and Sort */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-zinc-400">
            <span className="font-medium">
              Showing <strong className="text-white">{totalCount}</strong> styles
            </span>

            <div className="flex items-center gap-1.5 bg-[#141414] border border-[#242424] rounded-xl px-2.5 py-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-xs text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-[#141414] text-white">Featured</option>
                <option value="price-low" className="bg-[#141414] text-white">Price: Low to High</option>
                <option value="price-high" className="bg-[#141414] text-white">Price: High to Low</option>
                <option value="discount" className="bg-[#141414] text-white">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
