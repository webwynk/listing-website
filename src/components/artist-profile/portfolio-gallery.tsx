"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Image as ImageIcon,
  Video,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
} from "lucide-react";

export interface PortfolioGalleryItem {
  id: string;
  mediaUrl: string;
  thumbnailUrl?: string | null;
  title?: string | null;
  description?: string | null;
  mediaType: "IMAGE" | "VIDEO";
  categoryId?: string | null;
}

interface PortfolioGalleryProps {
  items: PortfolioGalleryItem[];
  artistName: string;
}

export function PortfolioGallery({ items, artistName }: PortfolioGalleryProps) {
  const [filterType, setFilterType] = useState<"ALL" | "IMAGE" | "VIDEO">("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = items ? items.filter((item) => {
    if (filterType === "ALL") return true;
    return item.mediaType === filterType;
  }) : [];

  const currentLightboxItem =
    lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  const handlePrev = useCallback(() => {
    if (lightboxIndex !== null && filteredItems.length > 0) {
      setLightboxIndex(
        lightboxIndex === 0 ? filteredItems.length - 1 : lightboxIndex - 1
      );
    }
  }, [lightboxIndex, filteredItems.length]);

  const handleNext = useCallback(() => {
    if (lightboxIndex !== null && filteredItems.length > 0) {
      setLightboxIndex(
        lightboxIndex === filteredItems.length - 1 ? 0 : lightboxIndex + 1
      );
    }
  }, [lightboxIndex, filteredItems.length]);

  // Keyboard accessibility for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [lightboxIndex, handlePrev, handleNext]);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div id="portfolio" className="space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-black/[0.06]">
        <div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#eb7583] font-body mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#eb7583]" />
            <span>Visual Showcase</span>
          </div>
          <h2 className="font-title text-2xl sm:text-3xl font-medium text-[#1e1a19] tracking-tight">
            Portfolio Gallery
          </h2>
          <p className="text-xs sm:text-[13px] text-[#6e6968] font-body mt-0.5">
            Real brides, milestone events, and signature editorial craftsmanship
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-white border border-black/[0.08] shadow-xs self-start sm:self-auto shrink-0">
          {[
            { id: "ALL", label: `All (${items.length})` },
            { id: "IMAGE", label: "Photos" },
            { id: "VIDEO", label: "Videos" },
          ].map((tab) => {
            const isActive = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all font-body min-h-[36px] ${
                  isActive
                    ? "bg-[#eb7583] text-white shadow-xs"
                    : "text-[#6e6968] hover:text-[#1e1a19] hover:bg-black/[0.03]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4.5">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setLightboxIndex(idx)}
            className="group relative rounded-[22px] overflow-hidden bg-[#faf8f7] aspect-square cursor-pointer border border-black/[0.06] hover:border-[#fcdadb] shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(235,117,131,0.16)] transition-all duration-500"
          >
            <img
              src={item.thumbnailUrl || item.mediaUrl}
              alt={item.title || `${artistName} portfolio piece`}
              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              loading="lazy"
            />

            {/* Hover Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 sm:p-4">
              <div className="flex justify-end">
                <div className="p-2 rounded-full bg-white/90 text-[#1e1a19] backdrop-blur-md shadow-xs group-hover:scale-105 transition-transform">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              {item.title && (
                <p className="font-title text-sm sm:text-base font-medium text-white line-clamp-1 tracking-wide">
                  {item.title}
                </p>
              )}
            </div>

            {/* Video Badge */}
            {item.mediaType === "VIDEO" && (
              <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#fcdadb] border border-white/20 text-[11px] font-semibold flex items-center gap-1 font-body">
                <Video className="w-3 h-3" />
                <span>Video</span>
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {currentLightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#181515]/95 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 p-2.5 rounded-full bg-white/10 border border-white/15 text-white hover:bg-white/20 hover:scale-105 transition-all z-50 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
            aria-label="Close fullscreen preview"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 border border-white/15 text-white hover:bg-[#eb7583] hover:scale-105 transition-all z-50 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 border border-white/15 text-white hover:bg-[#eb7583] hover:scale-105 transition-all z-50 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-lg"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content Container */}
          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center space-y-3.5"
            onClick={(e) => e.stopPropagation()}
          >
            {currentLightboxItem.mediaType === "VIDEO" ? (
              <video
                src={currentLightboxItem.mediaUrl}
                controls
                autoPlay
                className="max-h-[75vh] max-w-full rounded-[24px] shadow-2xl object-contain"
              />
            ) : (
              <img
                src={currentLightboxItem.mediaUrl}
                alt={currentLightboxItem.title || "Portfolio preview"}
                className="max-h-[75vh] max-w-full rounded-[24px] shadow-2xl object-contain border border-white/10"
              />
            )}

            {currentLightboxItem.title && (
              <div className="text-center pt-1">
                <h4 className="font-title text-xl sm:text-2xl font-medium text-white tracking-wide">
                  {currentLightboxItem.title}
                </h4>
                {currentLightboxItem.description && (
                  <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto font-body mt-1">
                    {currentLightboxItem.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
