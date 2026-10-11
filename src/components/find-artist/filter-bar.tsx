"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  Star,
  ChevronDown,
} from "lucide-react";
import { TOP_CITIES } from "@/components/layout/city-selector";

export interface FilterState {
  search: string;
  city: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  experience: string;
  date: string;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  totalCount: number;
}

export const CATEGORY_OPTIONS = [
  { label: "All Specializations", value: "" },
  { label: "Bridal Makeup", value: "bridal-makeup" },
  { label: "HD & Airbrush", value: "airbrush-makeup" },
  { label: "Wedding Photography", value: "wedding-photography" },
  { label: "Haute Hair Styling", value: "hair-styling" },
  { label: "Pre-Wedding Shoots", value: "pre-wedding" },
  { label: "Party & Cocktail Glam", value: "party-makeup" },
];

export const PRICE_PRESETS = [
  { label: "Any Price", min: "", max: "" },
  { label: "Under ₹25k", min: "", max: "25000" },
  { label: "₹25k - ₹50k", min: "25000", max: "50000" },
  { label: "₹50k - ₹1 Lakh", min: "50000", max: "100000" },
  { label: "₹1 Lakh+", min: "100000", max: "" },
];

export const EXPERIENCE_OPTIONS = [
  { label: "Any Experience", value: "" },
  { label: "1-3 Years", value: "1-3" },
  { label: "3-5 Years", value: "3-5" },
  { label: "5-10 Years", value: "5-10" },
  { label: "10+ Years", value: "10+" },
];

export const RATING_OPTIONS = [
  { label: "Any Rating", value: "" },
  { label: "4.8★ & Above", value: "4.8" },
  { label: "4.5★ & Above", value: "4.5" },
  { label: "4.0★ & Above", value: "4.0" },
];

export function FilterBar({
  filters,
  onChange,
  onReset,
  totalCount,
}: FilterBarProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const activeFilterCount = [
    filters.city,
    filters.category,
    filters.minPrice || filters.maxPrice,
    filters.minRating,
    filters.experience,
    filters.date,
  ].filter(Boolean).length;

  const handleUpdate = (field: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const handlePricePreset = (min: string, max: string) => {
    onChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Search & Primary Filter Capsule */}
      <div className="p-2.5 sm:p-3 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-xl border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 sm:gap-3 transition-all">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#eb7583]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleUpdate("search", e.target.value)}
            placeholder="Search by artist name, studio, or signature look..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#faf8f7] border border-black/[0.06] rounded-xl sm:rounded-2xl text-[#1e1a19] placeholder-[#a09b9a] text-sm md:text-xs font-medium focus:outline-none focus:border-[#eb7583] focus:ring-2 focus:ring-[#eb7583]/10 transition-all min-h-[44px]"
          />
          {filters.search && (
            <button
              onClick={() => handleUpdate("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#76706e] hover:text-[#eb7583] p-1 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* City Filter (Desktop / Tablet) */}
        <div className="hidden sm:block min-w-[155px]">
          <div className="relative">
            <select
              value={filters.city}
              onChange={(e) => handleUpdate("city", e.target.value)}
              className="w-full pl-3.5 pr-8 py-2.5 bg-[#faf8f7] border border-black/[0.06] hover:border-[#fcdadb] rounded-xl sm:rounded-2xl text-[#1e1a19] text-xs font-medium focus:outline-none focus:border-[#eb7583] focus:ring-2 focus:ring-[#eb7583]/10 appearance-none min-h-[44px] cursor-pointer transition-all"
            >
              <option value="">All Locations</option>
              {TOP_CITIES.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#76706e] pointer-events-none" />
          </div>
        </div>

        {/* Category Filter (Desktop) */}
        <div className="hidden md:block min-w-[175px]">
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => handleUpdate("category", e.target.value)}
              className="w-full pl-3.5 pr-8 py-2.5 bg-[#faf8f7] border border-black/[0.06] hover:border-[#fcdadb] rounded-xl sm:rounded-2xl text-[#1e1a19] text-xs font-medium focus:outline-none focus:border-[#eb7583] focus:ring-2 focus:ring-[#eb7583]/10 appearance-none min-h-[44px] cursor-pointer transition-all"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#76706e] pointer-events-none" />
          </div>
        </div>

        {/* Event Date (Desktop XL) */}
        <div className="hidden xl:block min-w-[145px]">
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleUpdate("date", e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-3 py-2.5 bg-[#faf8f7] border border-black/[0.06] hover:border-[#fcdadb] rounded-xl sm:rounded-2xl text-[#1e1a19] text-xs font-medium focus:outline-none focus:border-[#eb7583] focus:ring-2 focus:ring-[#eb7583]/10 min-h-[44px] cursor-pointer transition-all"
            aria-label="Filter by date"
          />
        </div>

        {/* Filter Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl sm:rounded-2xl bg-[#faf8f7] hover:bg-[#fcf1ef] border border-black/[0.06] hover:border-[#fcdadb] text-[#1e1a19] text-xs font-semibold transition-all shadow-xs min-h-[44px] active:scale-98"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#eb7583]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-gradient-to-r from-[#eb7583] to-[#d4616f] text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="p-2.5 rounded-xl sm:rounded-2xl bg-[#faf8f7] hover:bg-[#fcf1ef] border border-black/[0.06] hover:border-[#fcdadb] text-[#76706e] hover:text-[#eb7583] transition-all min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
              title="Reset all filters"
              aria-label="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Category Chips Strip */}
      <div className="w-full flex items-center gap-2 sm:gap-2.5 overflow-x-auto scrollbar-none py-1 px-0.5 touch-pan-x scroll-smooth overscroll-x-contain">
        {CATEGORY_OPTIONS.map((c) => {
          const isSelected = filters.category === c.value;
          return (
            <button
              key={c.value}
              onClick={() => handleUpdate("category", isSelected ? "" : c.value)}
              className={`shrink-0 min-w-max px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 min-h-[40px] flex items-center justify-center font-body select-none active:scale-95 ${
                isSelected
                  ? "bg-gradient-to-r from-[#eb7583] to-[#d4616f] text-white font-semibold shadow-[0_4px_14px_rgba(235,117,131,0.25)] border border-transparent"
                  : "bg-white hover:bg-[#fcf1ef] border border-black/[0.08] hover:border-[#fcdadb] text-[#5c5553] hover:text-[#1e1a19] shadow-xs"
              }`}
            >
              <span>{c.label}</span>
            </button>
          );
        })}
      </div>

      {/* Expanded Filters Drawer (Desktop Modal & Mobile Slide-over) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-md bg-white border-l border-black/[0.08] p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#fcf1ef] border border-[#fcdadb] flex items-center justify-center text-[#eb7583]">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#1e1a19]">Filter Artists</h3>
                    <p className="text-[11px] text-[#76706e] font-body">Refine by location, price, and artistry</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-2 text-[#76706e] hover:text-[#1e1a19] rounded-full hover:bg-[#faf8f7] transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* City Filter */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1e1a19] uppercase tracking-[0.16em] block font-body">
                  Location / City
                </label>
                <div className="relative">
                  <select
                    value={filters.city}
                    onChange={(e) => handleUpdate("city", e.target.value)}
                    className="w-full pl-3.5 pr-8 py-2.5 bg-[#faf8f7] border border-black/[0.08] focus:border-[#eb7583] focus:ring-2 focus:ring-[#eb7583]/10 rounded-xl text-[#1e1a19] text-xs font-medium focus:outline-none min-h-[44px] appearance-none"
                  >
                    <option value="">All Locations</option>
                    {TOP_CITIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} ({c.state})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76706e] pointer-events-none" />
                </div>
              </div>

              {/* Service Category */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1e1a19] uppercase tracking-[0.16em] block font-body">
                  Service Category
                </label>
                <div className="relative">
                  <select
                    value={filters.category}
                    onChange={(e) => handleUpdate("category", e.target.value)}
                    className="w-full pl-3.5 pr-8 py-2.5 bg-[#faf8f7] border border-black/[0.08] focus:border-[#eb7583] focus:ring-2 focus:ring-[#eb7583]/10 rounded-xl text-[#1e1a19] text-xs font-medium focus:outline-none min-h-[44px] appearance-none"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76706e] pointer-events-none" />
                </div>
              </div>

              {/* Event Date */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1e1a19] uppercase tracking-[0.16em] block font-body">
                  Ceremony / Event Date
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleUpdate("date", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3.5 py-2.5 bg-[#faf8f7] border border-black/[0.08] focus:border-[#eb7583] focus:ring-2 focus:ring-[#eb7583]/10 rounded-xl text-[#1e1a19] text-xs font-medium focus:outline-none min-h-[44px]"
                />
              </div>

              {/* Price Range Presets */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1e1a19] uppercase tracking-[0.16em] block font-body">
                  Starting Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRICE_PRESETS.map((p) => {
                    const isSelected =
                      filters.minPrice === p.min && filters.maxPrice === p.max;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => handlePricePreset(p.min, p.max)}
                        className={`p-2.5 rounded-xl text-xs font-medium text-center transition min-h-[44px] font-body ${
                          isSelected
                            ? "bg-[#eb7583] text-white font-semibold shadow-xs"
                            : "bg-[#faf8f7] hover:bg-[#fcf1ef] border border-black/[0.06] text-[#5c5553] hover:text-[#1e1a19]"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minimum Rating */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1e1a19] uppercase tracking-[0.16em] block font-body">
                  Minimum Client Rating
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {RATING_OPTIONS.map((r) => {
                    const isSelected = filters.minRating === r.value;
                    return (
                      <button
                        key={r.label}
                        type="button"
                        onClick={() => handleUpdate("minRating", isSelected ? "" : r.value)}
                        className={`p-2.5 rounded-xl text-xs font-medium text-center transition min-h-[44px] font-body ${
                          isSelected
                            ? "bg-[#eb7583] text-white font-semibold shadow-xs"
                            : "bg-[#faf8f7] hover:bg-[#fcf1ef] border border-black/[0.06] text-[#5c5553] hover:text-[#1e1a19]"
                        }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-[#1e1a19] uppercase tracking-[0.16em] block font-body">
                  Years of Experience
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {EXPERIENCE_OPTIONS.map((exp) => {
                    const isSelected = filters.experience === exp.value;
                    return (
                      <button
                        key={exp.label}
                        type="button"
                        onClick={() => handleUpdate("experience", isSelected ? "" : exp.value)}
                        className={`p-2.5 rounded-xl text-xs font-medium text-center transition min-h-[44px] font-body ${
                          isSelected
                            ? "bg-[#eb7583] text-white font-semibold shadow-xs"
                            : "bg-[#faf8f7] hover:bg-[#fcf1ef] border border-black/[0.06] text-[#5c5553] hover:text-[#1e1a19]"
                        }`}
                      >
                        {exp.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-black/[0.06] flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setMobileDrawerOpen(false);
                }}
                className="flex-1 py-3 rounded-xl bg-[#faf8f7] hover:bg-[#f5f3f2] border border-black/[0.08] text-[#5c5553] text-xs font-semibold transition min-h-[44px]"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#eb7583] to-[#d4616f] hover:brightness-105 text-white text-xs font-bold transition shadow-[0_4px_14px_rgba(235,117,131,0.25)] min-h-[44px]"
              >
                Show {totalCount} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
