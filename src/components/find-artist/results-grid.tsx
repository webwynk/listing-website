"use client";

import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { ArtistCard, ArtistCardItem } from "@/components/shared/artist-card";
import { PaginationMeta } from "@/lib/pagination";

interface ResultsGridProps {
  artists: ArtistCardItem[];
  loading: boolean;
  viewMode: "grid" | "list";
  onResetFilters: () => void;
  pagination?: PaginationMeta | null;
  onPageChange: (page: number) => void;
  onBookClick?: (artist: ArtistCardItem) => void;
}

export function ResultsGrid({
  artists,
  loading,
  viewMode,
  onResetFilters,
  pagination,
  onPageChange,
  onBookClick,
}: ResultsGridProps) {
  // Loading Shimmer Skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-[24px] sm:rounded-[28px] bg-white border border-black/[0.06] overflow-hidden flex flex-col justify-between shadow-xs"
          >
            <div className="aspect-[4/3] bg-[#f5f3f2] w-full" />
            <div className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-4 w-20 bg-[#f0eded] rounded-md" />
                <div className="h-4 w-12 bg-[#f0eded] rounded-md" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-[#f0eded] rounded-md" />
                <div className="h-3 w-1/2 bg-[#f0eded] rounded-md" />
              </div>
              <div className="pt-3 border-t border-black/[0.04] flex justify-between items-center">
                <div className="h-4 w-24 bg-[#f0eded] rounded-md" />
                <div className="h-8 w-20 bg-[#f0eded] rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (artists.length === 0) {
    return (
      <div className="rounded-[28px] bg-white border border-black/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-10 sm:p-14 text-center space-y-5 max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-2xl bg-[#fcf1ef] border border-[#fcdadb] text-[#eb7583] flex items-center justify-center mx-auto shadow-xs">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-bold text-[#1e1a19]">
            No Matching Artists Found
          </h3>
          <p className="text-xs sm:text-sm text-[#76706e] leading-relaxed font-body">
            We couldn&apos;t find verified artists matching all your current filters. Try relaxing your location, date, or price constraints.
          </p>
        </div>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#eb7583] to-[#d4616f] hover:brightness-105 text-white font-semibold text-xs sm:text-sm transition-all shadow-[0_4px_16px_rgba(235,117,131,0.25)] min-h-[44px] active:scale-95"
        >
          <span>Reset All Filters</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // List View Rendering
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="group rounded-[24px] bg-white hover:border-[#fcdadb] border border-black/[0.06] p-4 sm:p-5 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(235,117,131,0.12)]"
          >
            {/* Left: Thumbnail & Details */}
            <div className="flex items-center gap-4 sm:gap-5 flex-1 min-w-0">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-[#f5f3f2] shrink-0">
                <img
                  src={
                    artist.coverImage ||
                    artist.avatarUrl ||
                    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={artist.businessName || artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  {artist.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#eb7583] to-[#c24e5c] text-white font-body shadow-xs">
                      Featured
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fcf1ef] text-[#1e1a19] border border-[#fcdadb] font-body">
                    <ShieldCheck className="w-3 h-3 text-[#eb7583]" />
                    <span>Verified Master</span>
                  </span>
                  {artist.categoryName && (
                    <span className="text-[11px] text-[#76706e] font-medium font-body truncate">
                      • {artist.categoryName}
                    </span>
                  )}
                </div>

                <Link
                  href={`/artist/${artist.slug}`}
                  className="font-serif text-lg sm:text-xl font-bold text-[#1e1a19] hover:text-[#eb7583] transition-colors block truncate"
                >
                  {artist.businessName || artist.name}
                </Link>

                <div className="flex flex-wrap items-center gap-3.5 text-xs text-[#76706e] font-body">
                  {artist.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#eb7583]" />
                      <span>{artist.city}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fcf1ef] border border-[#fcdadb] text-[#eb7583] font-bold">
                    <Star className="w-3 h-3 fill-[#eb7583] text-[#eb7583]" />
                    {(artist.avgRating || 5.0).toFixed(1)} ({artist.totalReviews || 0})
                  </span>
                  {artist.yearsOfExperience && (
                    <span>{artist.yearsOfExperience}+ yrs exp</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Price & CTA */}
            <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-black/[0.04] shrink-0">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-[#a09b9a] uppercase tracking-wider block font-body">
                  Starting Price
                </span>
                <span className="font-sans text-base sm:text-lg font-bold text-[#1e1a19]">
                  {artist.startingPrice && artist.startingPrice > 0
                    ? `₹${artist.startingPrice.toLocaleString("en-IN")}`
                    : "Custom Quote"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onBookClick ? (
                  <button
                    onClick={() => onBookClick(artist)}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#eb7583] to-[#d4616f] hover:brightness-105 text-white font-semibold text-xs transition shadow-xs min-h-[44px] active:scale-95"
                  >
                    Inquire
                  </button>
                ) : null}
                <Link
                  href={`/artist/${artist.slug}`}
                  className="px-4 py-2 rounded-full bg-[#faf8f7] hover:bg-[#f5f3f2] border border-black/[0.08] hover:border-[#fcdadb] text-[#1e1a19] font-medium text-xs transition min-h-[44px] flex items-center"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Pagination */}
        {renderPagination(pagination, onPageChange)}
      </div>
    );
  }

  // Grid View Rendering
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} onBookClick={onBookClick} />
        ))}
      </div>

      {/* Pagination */}
      {renderPagination(pagination, onPageChange)}
    </div>
  );
}

function renderPagination(
  pagination?: PaginationMeta | null,
  onPageChange?: (page: number) => void
) {
  if (!pagination || pagination.totalPages <= 1 || !onPageChange) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <button
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page <= 1}
        className="p-2.5 rounded-xl bg-white border border-black/[0.08] hover:border-[#fcdadb] text-[#76706e] hover:text-[#1e1a19] disabled:opacity-40 disabled:hover:text-[#76706e] transition min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {Array.from({ length: pagination.totalPages }).map((_, i) => {
        const pageNum = i + 1;
        const isCurrent = pageNum === pagination.page;

        // Only show first, last, and window around current page
        if (
          pageNum === 1 ||
          pageNum === pagination.totalPages ||
          Math.abs(pageNum - pagination.page) <= 1
        ) {
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-xl text-xs font-semibold transition min-h-[44px] min-w-[44px] flex items-center justify-center font-body ${
                isCurrent
                  ? "bg-gradient-to-r from-[#eb7583] to-[#d4616f] text-white font-bold shadow-[0_4px_14px_rgba(235,117,131,0.25)] border-transparent"
                  : "bg-white border border-black/[0.08] hover:border-[#fcdadb] text-[#5c5553] hover:text-[#1e1a19] shadow-xs"
              }`}
            >
              {pageNum}
            </button>
          );
        }

        if (
          (pageNum === 2 && pagination.page > 3) ||
          (pageNum === pagination.totalPages - 1 && pagination.page < pagination.totalPages - 2)
        ) {
          return (
            <span key={pageNum} className="text-[#a09b9a] px-1 font-body">
              ...
            </span>
          );
        }

        return null;
      })}

      <button
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page >= pagination.totalPages}
        className="p-2.5 rounded-xl bg-white border border-black/[0.08] hover:border-[#fcdadb] text-[#76706e] hover:text-[#1e1a19] disabled:opacity-40 disabled:hover:text-[#76706e] transition min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
