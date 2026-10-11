"use client";

import { LayoutGrid, List, ChevronDown } from "lucide-react";

interface SortControlsProps {
  totalCount: number;
  currentCount: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
}

const SORT_OPTIONS = [
  { label: "Featured & Popular", value: "relevance" },
  { label: "Highest Rated (5.0 ★)", value: "rating_desc" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Most Experienced", value: "experience_desc" },
  { label: "Recently Joined", value: "newest" },
];

export function SortControls({
  totalCount,
  currentCount,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: SortControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 py-3 border-b border-black/[0.06]">
      {/* Result Count */}
      <div className="text-xs text-[#5c5553] font-body flex items-center gap-1.5">
        <span>Showing</span>
        <span className="font-bold text-[#1e1a19]">{currentCount}</span>
        <span>of</span>
        <span className="font-bold text-[#eb7583]">{totalCount}</span>
        <span>verified artists</span>
      </div>

      {/* Right Controls: Sort Dropdown & View Mode Switcher */}
      <div className="flex items-center gap-2.5">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="pl-3.5 pr-8 py-2 bg-white border border-black/[0.08] hover:border-[#fcdadb] rounded-xl text-[#1e1a19] text-xs font-medium focus:outline-none focus:border-[#eb7583] focus:ring-2 focus:ring-[#eb7583]/10 appearance-none min-h-[44px] cursor-pointer transition-all shadow-xs"
            aria-label="Sort artists by"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-white text-[#1e1a19]">
                Sort: {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#76706e] pointer-events-none" />
        </div>

        {/* View Mode Toggle */}
        <div className="hidden sm:flex items-center p-1 rounded-xl bg-white border border-black/[0.08] shadow-xs">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`p-1.5 rounded-lg transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-[#eb7583] to-[#d4616f] text-white font-semibold shadow-xs"
                : "text-[#76706e] hover:text-[#1e1a19] hover:bg-[#faf8f7]"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`p-1.5 rounded-lg transition-all min-h-[36px] min-w-[36px] flex items-center justify-center ${
              viewMode === "list"
                ? "bg-gradient-to-r from-[#eb7583] to-[#d4616f] text-white font-semibold shadow-xs"
                : "text-[#76706e] hover:text-[#1e1a19] hover:bg-[#faf8f7]"
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
