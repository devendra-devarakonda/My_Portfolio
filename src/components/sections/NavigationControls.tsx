import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationControlsProps {
  categoryName: string;
  categoryIndex: number;
  totalCategories: number;
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  onPageSelect: (pageIdx: number) => void;
}

export default function NavigationControls({
  categoryName,
  categoryIndex,
  totalCategories,
  currentPage,
  totalPages,
  onNext,
  onPrev,
  onPageSelect
}: NavigationControlsProps) {
  // Pad index to 2 digits, e.g. 01, 02
  const formattedIndex = String(categoryIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalCategories).padStart(2, '0');

  return (
    <div className="flex flex-col items-center select-none z-30 mt-6 md:mt-10">
      {/* Category Name & Number Indicator */}
      <div className="flex flex-col items-center mb-6">
        <h3 className="category-title text-2xl md:text-3xl font-extrabold text-[#ff4d6d] uppercase tracking-wider text-center">
          {categoryName}
        </h3>
        <p className="text-xs text-gray-500 font-mono mt-1.5 tracking-widest uppercase">
          CORE DOMAIN — {formattedIndex} / {formattedTotal}
        </p>
      </div>

      {/* Control Row: Prev - Subpage Dots - Next */}
      <div className="flex items-center gap-6 md:gap-8">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          className="glass-panel w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-gray-300 hover:text-white cursor-pointer active:scale-95 transition-all"
          aria-label="Previous category page"
        >
          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Dynamic Page Indicator Dots (Only if total pages > 1) */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={`page-dot-${idx}`}
                onClick={() => onPageSelect(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentPage === idx 
                    ? 'bg-[#ff4d6d] w-6 shadow-[0_0_10px_rgba(255,77,109,0.8)]' 
                    : 'bg-gray-600 hover:bg-gray-400'
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={onNext}
          className="glass-panel w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-gray-300 hover:text-white cursor-pointer active:scale-95 transition-all"
          aria-label="Next category page"
        >
          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
}
