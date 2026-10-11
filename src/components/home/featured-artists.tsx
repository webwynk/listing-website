"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Star } from "lucide-react";
import { ArtistCard, ArtistCardItem } from "@/components/shared/artist-card";
import { CURATED_FEATURED_ARTISTS } from "@/lib/data/curated-artists";

export { CURATED_FEATURED_ARTISTS };

interface HomeFeaturedArtistsProps {
  initialArtists?: ArtistCardItem[];
}

export function HomeFeaturedArtists({
  initialArtists,
}: HomeFeaturedArtistsProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const artists =
    initialArtists && initialArtists.length > 0
      ? initialArtists
      : CURATED_FEATURED_ARTISTS;

  const filteredArtists = artists.filter((a) => {
    if (activeTab === "all") return true;
    if (activeTab === "makeup")
      return (
        a.categoryName?.toLowerCase().includes("makeup") ||
        a.categoryName?.toLowerCase().includes("airbrush")
      );
    if (activeTab === "photo")
      return (
        a.categoryName?.toLowerCase().includes("photo") ||
        a.categoryName?.toLowerCase().includes("cinemat")
      );
    if (activeTab === "hair")
      return a.categoryName?.toLowerCase().includes("hair");
    return true;
  });

  return (
    <section className="bg-white py-12 sm:py-20 border-b border-black/[0.05] relative overflow-hidden select-none">
      {/* Background ambient blush glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#fcf1ef]/40 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fcdadb]/20 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 relative z-10">
        {/* Section Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-2 border-b border-black/[0.04]">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#eb7583] font-body">
              <span className="w-1.5 h-1.5 rounded-full bg-[#eb7583]" />
              <span>Elite Artist Spotlight</span>
            </div>

            <h2 className="font-title text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1e1a19] tracking-tight leading-tight">
              Featured{" "}
              <span className="italic font-normal text-[#eb7583] tracking-normal">
                Verified Masters
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-[#5c5553] font-body leading-relaxed">
              Curated by our beauty advisory for signature craftsmanship, sterile hygiene standards, and proven 5-star bride experiences.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0">
            {[
              { id: "all", label: "All Artists" },
              { id: "makeup", label: "Bridal & HD" },
              { id: "photo", label: "Photography" },
              { id: "hair", label: "Hair Couture" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#1e1a19] text-white shadow-xs font-bold"
                      : "bg-[#faf8f7] text-[#5c5553] hover:text-[#1e1a19] border border-black/[0.06] hover:bg-[#fcf1ef]/50"
                  }`}
                >
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#eb7583]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Artists Grid / Mobile Snap Carousel */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {filteredArtists.slice(0, 6).map((artist) => (
            <div
              key={artist.id}
              className="shrink-0 w-[295px] sm:w-[330px] md:w-auto snap-center flex"
            >
              <ArtistCard artist={artist} />
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center pt-2">
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1e1a19] hover:bg-[#eb7583] text-white font-semibold text-xs sm:text-sm font-body transition-all shadow-md hover:shadow-[0_8px_24px_rgba(235,117,131,0.35)] active:scale-95 group"
          >
            <span>Explore All 500+ Verified Artists</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
