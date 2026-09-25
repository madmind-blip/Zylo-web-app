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
  const chips: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Pieces' },
    { id: 'combos', label: 'Combos' },
    { id: 'watches', label: 'Watches' },
    { id: 'under-1500', label: 'Under ₹1,500' },
    { id: 'under-2000', label: 'Under ₹2,000' },
    { id: 'under-2500', label: 'Under ₹2,500' },
  ];

  return (
    <div className="py-4 border-b border-neutral-200/80 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Scrollable Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
            {chips.map((chip) => {
              const isActive = activeCategory === chip.id;
              return (
                <button
                  key={chip.id}
                  onClick={() => onSelectCategory(chip.id)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#1A1A1A] text-white font-semibold shadow-xs'
                      : 'bg-white text-neutral-600 hover:text-black border border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          {/* Right: Count and Sort */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-neutral-500">
            <span>
              Showing <strong className="text-[#1A1A1A] font-semibold">{totalCount}</strong> pieces
            </span>

            <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="bg-transparent text-xs text-[#1A1A1A] focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
