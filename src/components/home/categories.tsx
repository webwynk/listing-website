"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { CategoryCardData, DEFAULT_CATEGORIES } from "@/lib/categories";

interface HomeCategoriesProps {
  categories?: CategoryCardData[];
}

const FILTER_TABS = [
  { id: "all", label: "All Specializations" },
  { id: "makeup", label: "Bridal Makeup" },
  { id: "photography", label: "Photography & Shoots" },
  { id: "mehendi", label: "Mehndi Artistry" },
  { id: "hair-nails", label: "Hair & Nails" },
];

export function HomeCategories({ categories }: HomeCategoriesProps) {
  const items = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter((cat) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "makeup") return cat.group === "makeup";
    if (activeFilter === "photography") return cat.group === "photography";
    if (activeFilter === "mehendi") return cat.group === "mehendi";
    if (activeFilter === "hair-nails") return cat.group === "hair-nails";
    return true;
  });

  return (
    <section className="bg-[#faf8f7] py-10 sm:py-16 border-b border-black/[0.05] relative overflow-hidden select-none">
      {/* Background ambient blush glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#fcdadb]/25 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fcf1ef] rounded-full blur-3xl pointer-events-none -ml-32 -mb-32" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6 relative z-10">
        {/* Compact Section Header: Unified single-row alignment on mobile & desktop */}
        <div className="flex items-end justify-between gap-3 pb-2 border-b border-black/[0.04]">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#eb7583] font-body">
              <span className="w-1.5 h-1.5 rounded-full bg-[#eb7583]" />
              <span>Curated Specializations</span>
            </div>

            <h2 className="font-title text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1e1a19] tracking-tight leading-tight">
              Explore by{" "}
              <span className="italic font-normal text-[#eb7583] tracking-normal">
                Specialization
              </span>
            </h2>
          </div>

          {/* Header Action: Sleek pill aligned on same row */}
          <Link
            href="/artists"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-[#eb7583] hover:text-[#d4616f] transition group font-body shrink-0 pb-0.5"
          >
            <span className="hidden sm:inline">Browse All Artists</span>
            <span className="sm:hidden">Browse All</span>
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#fcf1ef] border border-[#fcdadb] flex items-center justify-center group-hover:bg-[#eb7583] group-hover:text-white transition-all shadow-xs">
              <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </Link>
        </div>

        {/* Curated Discipline Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#1e1a19] text-white shadow-md font-bold scale-[1.02]"
                    : "bg-white text-[#5c5553] hover:text-[#1e1a19] border border-black/[0.06] hover:bg-[#fcf1ef]/50"
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

        {/* Categories Cards Layout:
            - Mobile: Smooth horizontal snap swipe with peek preview
            - Desktop: 4-column balanced haute couture grid */}
        <div
          ref={scrollContainerRef}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {filteredItems.map((cat, idx) => (
            <Link
              key={cat.id || cat.slug || idx}
              href={`/artists?category=${encodeURIComponent(cat.slug)}`}
              className="group relative rounded-[28px] overflow-hidden bg-[#1e1a19] border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_24px_50px_rgba(235,117,131,0.22)] hover:border-[#eb7583]/40 transition-all duration-500 ease-out flex flex-col justify-between aspect-[3/4] p-4 sm:p-5 focus:outline-none focus:ring-2 focus:ring-[#eb7583] focus:ring-offset-2 shrink-0 w-[285px] sm:w-[320px] md:w-auto snap-center"
            >
              {/* Luminous Portrait Photo with Smooth Luxury Zoom */}
              <div className="absolute inset-0 z-0 overflow-hidden bg-[#1e1a19]">
                <Image
                  src={cat.imageUrl || "/images/hero-bride.jpg"}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 285px, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                  unoptimized
                />

                {/* Multi-stop Editorial Scrim: Preserves upper subject radiance while creating contrast at base */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 via-45% to-transparent pointer-events-none" />
                {/* Subtle top vignette for badge contrast */}
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/35 to-transparent pointer-events-none" />
              </div>

              {/* Card Top: Frosted Glass Artist Count Badge */}
              <div className="relative z-10 w-full flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold tracking-wide shadow-sm font-body">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#eb7583] animate-pulse" />
                  {cat.artistCount}
                </span>
              </div>

              {/* Card Bottom: Full-Bleed Editorial Presentation */}
              <div className="relative z-10 w-full space-y-2">
                <div className="flex items-end justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-title text-[22px] sm:text-[24px] font-medium text-white group-hover:text-[#fcdadb] transition-colors duration-200 tracking-tight leading-[1.2] line-clamp-2">
                      {cat.name}
                    </h3>
                  </div>

                  <div
                    className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shrink-0 group-hover:bg-[#eb7583] group-hover:border-[#eb7583] group-hover:text-white group-hover:rotate-45 transition-all duration-300 shadow-sm"
                    aria-hidden="true"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Section Bottom Dynamic Island Concierge Capsule */}
        <div className="relative overflow-hidden rounded-full bg-white/95 backdrop-blur-md border border-black/[0.06] shadow-[0_4px_20px_rgba(235,117,131,0.08)] hover:shadow-[0_8px_24px_rgba(235,117,131,0.16)] hover:border-[#fcdadb] p-2 pl-2.5 sm:py-2 sm:px-5 transition-all duration-300">
          <div className="flex items-center justify-between gap-3">
            {/* Left: Luxury Gradient Emblem + 2-Tier Micro Copy */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#eb7583] to-[#c24e5c] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-[#1e1a19] truncate leading-tight font-body">
                  Wedding Concierge
                </p>
                <p className="text-[10px] sm:text-xs text-[#6e6968] truncate leading-tight font-body">
                  <span className="sm:hidden">Destination &amp; Entourage Teams</span>
                  <span className="hidden sm:inline">Private advisory for verified teams across 25+ cities</span>
                </p>
              </div>
            </div>

            {/* Right: Sleek Mini Pill CTA */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-full bg-[#1e1a19] text-white hover:bg-[#eb7583] text-xs font-semibold font-body shrink-0 transition-all shadow-xs active:scale-95 group min-h-[36px]"
            >
              <span>Connect</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
