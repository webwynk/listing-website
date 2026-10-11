"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Sparkles, Search, ChevronDown, X, Star, Users, Building2 } from "lucide-react";
import { PageHeroConfig, HeroSlide, DEFAULT_PAGE_HEROES } from "@/lib/heroes-types";

interface HomeHeroProps {
  initialConfig?: PageHeroConfig;
}

const POPULAR_CITIES = [
  "Kolkata",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
];

const POPULAR_SERVICES = [
  { label: "Bridal Makeup", slug: "bridal-makeup" },
  { label: "Party Makeup", slug: "party-makeup" },
  { label: "Hairstyling", slug: "hairstyling" },
  { label: "HD & Airbrush", slug: "airbrush-makeup" },
  { label: "Wedding Photography", slug: "wedding-photography" },
  { label: "Pre-Wedding Shoot", slug: "pre-wedding" },
  { label: "Bridal Mehendi", slug: "mehendi" },
];

// Trust signals — hero social proof strip
const TRUST_BADGES = [
  { icon: Star, label: "4.9/5 Rating", value: "4.9" },
  { icon: Users, label: "500+ Artists", value: "500+" },
  { icon: Building2, label: "25+ Cities", value: "25+" },
];

function formatDateDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function HomeHero({ initialConfig }: HomeHeroProps) {
  const router = useRouter();
  const config = initialConfig || DEFAULT_PAGE_HEROES.home;

  const slides: HeroSlide[] =
    config.slides && config.slides.length > 0
      ? config.slides
      : [
          {
            id: "default-slide",
            category: "makeup",
            categoryLabel: "Bridal Makeup",
            eyebrow: config.eyebrow || "PROFESSIONAL MAKEUP ARTISTS",
            title: config.title || "Look Beautiful For Every Moment",
            subheading:
              config.subheading ||
              "Find and book verified bridal makeup artists and celebrity hair stylists across 25+ cities in India.",
            imageUrl: config.imageUrl || "/images/hero-bride.jpg",
          },
        ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Search filter states
  const [location, setLocation] = useState("Kolkata");
  const [selectedDate, setSelectedDate] = useState("");
  const [service, setService] = useState("");
  const [activeSegment, setActiveSegment] = useState<"location" | "date" | "service" | null>(null);

  // Dropdown open states
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showMobileCityDropdown, setShowMobileCityDropdown] = useState(false);
  const [showMobileServiceDropdown, setShowMobileServiceDropdown] = useState(false);

  const dateInputRef = useRef<HTMLInputElement>(null);
  const mobileDateInputRef = useRef<HTMLInputElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const mobileCityRef = useRef<HTMLDivElement>(null);
  const mobileServiceRef = useRef<HTMLDivElement>(null);

  const activeSlide = slides[currentSlideIndex] || slides[0];
  const selectedServiceLabel = POPULAR_SERVICES.find((s) => s.slug === service)?.label ?? "";

  // Mount animation trigger
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(e.target as Node)) {
        setShowServiceDropdown(false);
      }
      if (mobileCityRef.current && !mobileCityRef.current.contains(e.target as Node)) {
        setShowMobileCityDropdown(false);
      }
      if (mobileServiceRef.current && !mobileServiceRef.current.contains(e.target as Node)) {
        setShowMobileServiceDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location && location !== "All Cities") params.set("city", location.toLowerCase());
    if (service) params.set("category", service);
    if (selectedDate) params.set("date", selectedDate);
    router.push(`/artists?${params.toString()}`);
  };

  // ─── Shared dropdown panel styles ────────────────────────────────
  const dropdownPanelCls = "absolute top-[calc(100%+8px)] left-0 z-50 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-black/[0.06] py-2 min-w-[180px] overflow-hidden";
  const dropdownItemCls = (active: boolean) =>
    `w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-150 hover:bg-[#fcf1ef] ${
      active ? "text-[#eb7583] font-semibold bg-[#fcf1ef]/50" : "text-[#1e1a19]"
    }`;

  // ─── Trust badge strip ────────────────────────────────────────────
  const TrustStrip = ({ dark = false }: { dark?: boolean }) => (
    <div className="flex items-center gap-4 flex-wrap">
      {TRUST_BADGES.map((badge) => (
        <div key={badge.value} className="flex items-center gap-1.5">
          <badge.icon
            className={`w-3.5 h-3.5 shrink-0 ${dark ? "text-[#fcdadb]" : "text-[#eb7583]"}`}
            aria-hidden="true"
          />
          <span
            className={`text-xs font-semibold tracking-wide ${
              dark ? "text-white/90" : "text-[#5c5553]"
            }`}
          >
            {badge.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* ============================================================ */}
      {/* DESKTOP / TABLET (md+): Full-bleed cinematic hero            */}
      {/* Soft UI Evolution × Glassmorphism — ui-ux-pro-max            */}
      {/* ============================================================ */}
      <section
        className="relative hidden md:flex w-full overflow-hidden bg-[#faf8f7] items-center select-none"
        style={{ minHeight: "min(90dvh, 820px)", minBlockSize: "600px" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* ─── Background slider ───────────────────────────────────── */}
        <div className="absolute inset-0 z-0">
          {slides.map((slide, idx) => {
            const isActive = idx === currentSlideIndex;
            return (
              <div
                key={slide.id || idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Image
                  src={slide.imageUrl || "/images/hero-bride.jpg"}
                  alt={slide.title}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover object-[78%_center] lg:object-[82%_center]"
                  style={{
                    transform: isActive ? "scale(1)" : "scale(1.04)",
                    transition: "transform 7s ease-out",
                  }}
                />
              </div>
            );
          })}

          {/* Deeper left gradient — reveals more of the image on right */}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-[#faf8f7] via-[#faf8f7]/85 via-35% to-[#faf8f7]/5 to-75% pointer-events-none" />
          {/* Subtle bottom vignette */}
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#faf8f7]/30 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* ─── Slide category pill (top right of image) ────────────── */}
        {activeSlide.categoryLabel && (
          <div className="absolute top-6 right-6 z-30">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-white/60 text-[10px] font-bold uppercase tracking-[0.18em] text-[#eb7583] shadow-sm">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              {activeSlide.categoryLabel}
            </span>
          </div>
        )}

        {/* ─── Content block ───────────────────────────────────────── */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <div className="max-w-[560px] text-left">

            {/* Eyebrow — staggered fade-up */}
            <div
              className="mb-4 motion-safe:transition-all motion-safe:duration-500"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(14px)",
                transitionDelay: "0ms",
              }}
            >
              <span className="inline-flex items-center gap-2 text-[#eb7583] text-xs font-bold tracking-[0.26em] uppercase font-body">
                <span className="w-5 h-px bg-[#eb7583] shrink-0" aria-hidden="true" />
                {activeSlide.eyebrow}
              </span>
            </div>

            {/* H1 — 64px, tighter leading */}
            <div
              className="motion-safe:transition-all motion-safe:duration-600"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(18px)",
                transitionDelay: "80ms",
              }}
            >
              <h1 className="font-title text-[48px] lg:text-[64px] font-medium tracking-tight text-[#1e1a19] leading-[1.06] mb-5 transition-all duration-500">
                {activeSlide.title}
              </h1>
            </div>

            {/* Subheading */}
            <div
              className="mb-6 motion-safe:transition-all motion-safe:duration-600"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transitionDelay: "160ms",
              }}
            >
              <p className="font-body text-[#5c5553] text-base lg:text-[17px] leading-relaxed font-normal max-w-md transition-all duration-500">
                {activeSlide.subheading}
              </p>
            </div>

            {/* ─── GLASSMORPHIC SEARCH BAR ─────────────────────────── */}
            <div
              className="mb-6 motion-safe:transition-all motion-safe:duration-600"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(14px)",
                transitionDelay: "240ms",
              }}
            >
              {/* Wrap in relative so the blur sibling sits behind the form without creating a stacking context on the form itself */}
              <div className="relative inline-flex">
              {/* Glassmorphic blur background — sibling layer, not parent of dropdowns */}
              <div className="absolute inset-0 rounded-full bg-white/85 backdrop-blur-2xl border border-white/80 shadow-[0_16px_56px_rgba(235,117,131,0.14),0_4px_16px_rgba(0,0,0,0.06)] pointer-events-none transition-shadow duration-300" aria-hidden="true" />
              <form
                onSubmit={handleSearch}
                className="relative inline-flex items-stretch rounded-full transition-shadow duration-300 hover:[&+div]:shadow-[0_20px_64px_rgba(235,117,131,0.20),0_6px_20px_rgba(0,0,0,0.08)]"
              >
                {/* Segment 1: Location */}
                <div className="relative" ref={cityDropdownRef}>
                  <button
                    type="button"
                    onClick={() => { setShowCityDropdown((v) => !v); setShowServiceDropdown(false); setActiveSegment("location"); }}
                    onBlur={() => setTimeout(() => setActiveSegment(null), 150)}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-full transition-all duration-200 min-h-[56px] ${
                      activeSegment === "location" || showCityDropdown ? "bg-[#fcf1ef]/70" : "hover:bg-black/[0.02]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#fcf1ef] flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin className="w-4 h-4 text-[#eb7583]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] uppercase tracking-widest text-[#9a9492] font-bold">Location</span>
                      <span className="text-sm font-semibold text-[#1e1a19] whitespace-nowrap">{location || "Select city"}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#9a9492] ml-1 transition-transform duration-200 ${showCityDropdown ? "rotate-180" : ""}`} />
                  </button>
                  {showCityDropdown && (
                    <div className={dropdownPanelCls}>
                      {POPULAR_CITIES.map((city) => (
                        <button key={city} type="button" onClick={() => { setLocation(city); setShowCityDropdown(false); }}
                          className={dropdownItemCls(location === city)}>
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px self-stretch bg-black/[0.07] my-3" />

                {/* Segment 2: Date */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => { dateInputRef.current?.showPicker?.(); setActiveSegment("date"); }}
                    onBlur={() => setTimeout(() => setActiveSegment(null), 150)}
                    className={`relative flex items-center gap-3 px-5 py-3.5 rounded-full transition-all duration-200 min-h-[56px] ${
                      activeSegment === "date" ? "bg-[#fcf1ef]/70" : "hover:bg-black/[0.02]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#fcf1ef] flex items-center justify-center shrink-0 shadow-sm">
                      <Calendar className="w-4 h-4 text-[#eb7583]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] uppercase tracking-widest text-[#9a9492] font-bold">Date</span>
                      <span className="text-sm font-semibold text-[#1e1a19] whitespace-nowrap">
                        {selectedDate ? formatDateDisplay(selectedDate) : "Select date"}
                      </span>
                    </div>
                    {selectedDate ? (
                      <span role="button" tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setSelectedDate(""); }}
                        onKeyDown={(e) => e.key === "Enter" && setSelectedDate("")}
                        className="ml-1 text-[#9a9492] hover:text-[#eb7583] transition-colors cursor-pointer" aria-label="Clear date">
                        <X className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#9a9492] ml-1" />
                    )}
                  </button>
                  <input ref={dateInputRef} type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" tabIndex={-1} aria-hidden="true" />
                </div>

                <div className="w-px self-stretch bg-black/[0.07] my-3" />

                {/* Segment 3: Service */}
                <div className="relative" ref={serviceDropdownRef}>
                  <button
                    type="button"
                    onClick={() => { setShowServiceDropdown((v) => !v); setShowCityDropdown(false); setActiveSegment("service"); }}
                    onBlur={() => setTimeout(() => setActiveSegment(null), 150)}
                    className={`flex items-center gap-3 px-5 py-3.5 rounded-full transition-all duration-200 min-h-[56px] ${
                      activeSegment === "service" || showServiceDropdown ? "bg-[#fcf1ef]/70" : "hover:bg-black/[0.02]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#fcf1ef] flex items-center justify-center shrink-0 shadow-sm">
                      <Sparkles className="w-4 h-4 text-[#eb7583]" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] uppercase tracking-widest text-[#9a9492] font-bold">Service</span>
                      <span className="text-sm font-semibold text-[#1e1a19] whitespace-nowrap">{selectedServiceLabel || "Any service"}</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#9a9492] ml-1 transition-transform duration-200 ${showServiceDropdown ? "rotate-180" : ""}`} />
                  </button>
                  {showServiceDropdown && (
                    <div className={`${dropdownPanelCls} min-w-[200px]`}>
                      <button type="button" onClick={() => { setService(""); setShowServiceDropdown(false); }}
                        className={dropdownItemCls(!service)}>Any service</button>
                      {POPULAR_SERVICES.map((s) => (
                        <button key={s.slug} type="button" onClick={() => { setService(s.slug); setShowServiceDropdown(false); }}
                          className={dropdownItemCls(service === s.slug)}>
                          {s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search CTA */}
                <div className="flex items-center px-2 py-2">
                  <button type="submit"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#eb7583] hover:bg-[#d4616f] text-white text-sm font-semibold transition-all duration-200 shadow-[0_4px_16px_rgba(235,117,131,0.35)] hover:shadow-[0_6px_24px_rgba(235,117,131,0.45)] active:scale-[0.97] min-h-[44px] shrink-0">
                    <Search className="w-4 h-4" />
                    <span>{config.buttonText || "Search"}</span>
                  </button>
                </div>
              </form>
              </div>
            </div>

            {/* ─── Trust badge strip ───────────────────────────────── */}
            <div
              className="motion-safe:transition-all motion-safe:duration-600"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(10px)",
                transitionDelay: "340ms",
              }}
            >
              <TrustStrip />
            </div>
          </div>
        </div>

        {/* ─── Progress dots ───────────────────────────────────────── */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-white/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 shadow-sm">
            {slides.map((_, idx) => (
              <button key={idx} type="button" onClick={() => setCurrentSlideIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  display: "block",
                  width: idx === currentSlideIndex ? "24px" : "6px",
                  minWidth: idx === currentSlideIndex ? "24px" : "6px",
                  maxWidth: idx === currentSlideIndex ? "24px" : "6px",
                  height: "6px", minHeight: "6px", maxHeight: "6px",
                  borderRadius: "999px", flexShrink: 0, padding: 0, border: "none",
                  cursor: "pointer",
                  background: idx === currentSlideIndex ? "#eb7583" : "rgba(0,0,0,0.20)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* ============================================================ */}
      {/* MOBILE ONLY: Clean vertical stack                            */}
      {/* Eyebrow → Title → Description → Mobile PNG Image → Search    */}
      {/* ============================================================ */}
      <div className="md:hidden flex flex-col w-full bg-[#fcf1ef] select-none">
        {/* ─── Eyebrow + Title + Description ───────────────────────── */}
        <div className="pt-8 pb-3 px-5 text-center">
          {/* Eyebrow Pill */}
          <div className="mb-3.5 inline-block">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#eb7583]/10 border border-[#eb7583]/20 text-[#eb7583] text-[10px] font-bold tracking-[0.16em] uppercase font-body">
              <Sparkles className="w-3 h-3" aria-hidden="true" />
              {config.eyebrow || activeSlide.eyebrow || "PROFESSIONAL MAKEUP ARTISTS"}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-title text-[32px] sm:text-[36px] font-semibold tracking-tight text-[#1e1a19] leading-[1.12] mb-3">
            {config.title || activeSlide.title || "Look Beautiful For Every Moment"}
          </h1>

          {/* Description */}
          <p className="font-body text-[#5c5553] text-sm leading-relaxed max-w-sm mx-auto">
            {config.subheading || activeSlide.subheading || "Find and book the best makeup artists for weddings, parties, photoshoots and more."}
          </p>
        </div>

        {/* ─── Mobile Hero Image (PNG/WebP) ─────────────────────────── */}
        <div className="px-4 py-2 flex justify-center items-center">
          <div className="relative w-full max-w-sm h-[260px] sm:h-[300px] flex items-center justify-center">
            <Image
              src={config.mobileImageUrl || config.imageUrl || "/images/hero-bride.jpg"}
              alt={config.title || "Mobile Hero Image"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain pointer-events-none drop-shadow-sm"
              unoptimized
            />
          </div>
        </div>

        {/* ─── Search Filter Card ──────────────────────────────────── */}
        <div className="px-4 pt-2 pb-8">
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-3xl border border-[#fcdadb]/40 shadow-[0_12px_40px_rgba(235,117,131,0.10),0_4px_12px_rgba(0,0,0,0.04)] p-4 space-y-3"
          >
            {/* Row 1: Location */}
            <div className="relative" ref={mobileCityRef}>
              <button
                type="button"
                id="mobile-location-btn"
                onClick={() => { setShowMobileCityDropdown((v) => !v); setShowMobileServiceDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#faf8f7] border border-black/[0.05] text-left min-h-[52px] active:bg-[#fcf1ef] active:scale-[0.99] transition-all duration-150"
              >
                <div className="w-8 h-8 rounded-full bg-[#fcf1ef] flex items-center justify-center shrink-0 shadow-sm">
                  <MapPin className="w-4 h-4 text-[#eb7583]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] uppercase tracking-widest text-[#9a9492] font-bold leading-none mb-0.5">Location</span>
                  <span className="block text-[15px] font-semibold text-[#1e1a19] leading-tight">{location || "Select city"}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#9a9492] shrink-0 transition-transform duration-200 ${showMobileCityDropdown ? "rotate-180" : ""}`} />
              </button>
              {showMobileCityDropdown && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/[0.06] py-2 overflow-hidden">
                  {POPULAR_CITIES.map((city) => (
                    <button key={city} type="button" onClick={() => { setLocation(city); setShowMobileCityDropdown(false); }}
                      className={`w-full text-left px-4 py-3 text-[15px] font-medium transition-colors active:bg-[#fcf1ef] ${
                        location === city ? "text-[#eb7583] font-semibold bg-[#faf8f7]" : "text-[#1e1a19] hover:bg-[#faf8f7]"
                      }`}>
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Row 2: Service */}
            <div className="relative" ref={mobileServiceRef}>
              <button
                type="button"
                id="mobile-service-btn"
                onClick={() => { setShowMobileServiceDropdown((v) => !v); setShowMobileCityDropdown(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#faf8f7] border border-black/[0.05] text-left min-h-[52px] active:bg-[#fcf1ef] active:scale-[0.99] transition-all duration-150"
              >
                <div className="w-8 h-8 rounded-full bg-[#fcf1ef] flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#eb7583]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] uppercase tracking-widest text-[#9a9492] font-bold leading-none mb-0.5">Service</span>
                  <span className="block text-[15px] font-semibold text-[#1e1a19] leading-tight">{selectedServiceLabel || "Any service"}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#9a9492] shrink-0 transition-transform duration-200 ${showMobileServiceDropdown ? "rotate-180" : ""}`} />
              </button>
              {showMobileServiceDropdown && (
                <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-black/[0.06] py-2 overflow-hidden" style={{ maxHeight: "220px", overflowY: "auto" }}>
                  <button type="button" onClick={() => { setService(""); setShowMobileServiceDropdown(false); }}
                    className={`w-full text-left px-4 py-3 text-[15px] font-medium transition-colors ${
                      !service ? "text-[#eb7583] font-semibold bg-[#faf8f7]" : "text-[#9a9492] hover:bg-[#faf8f7]"
                    }`}>Any service</button>
                  {POPULAR_SERVICES.map((s) => (
                    <button key={s.slug} type="button" onClick={() => { setService(s.slug); setShowMobileServiceDropdown(false); }}
                      className={`w-full text-left px-4 py-3 text-[15px] font-medium transition-colors ${
                        service === s.slug ? "text-[#eb7583] font-semibold bg-[#faf8f7]" : "text-[#1e1a19] hover:bg-[#faf8f7]"
                      }`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Row 3: Date */}
            <div className="relative">
              <button
                type="button"
                id="mobile-date-btn"
                onClick={() => mobileDateInputRef.current?.showPicker?.()}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-[#faf8f7] border border-black/[0.05] text-left min-h-[52px] active:bg-[#fcf1ef] active:scale-[0.99] transition-all duration-150"
              >
                <div className="w-8 h-8 rounded-full bg-[#fcf1ef] flex items-center justify-center shrink-0 shadow-sm">
                  <Calendar className="w-4 h-4 text-[#eb7583]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[10px] uppercase tracking-widest text-[#9a9492] font-bold leading-none mb-0.5">Date</span>
                  <span className="block text-[15px] font-semibold text-[#1e1a19] leading-tight">
                    {selectedDate ? formatDateDisplay(selectedDate) : "Select date"}
                  </span>
                </div>
                {selectedDate ? (
                  <span role="button" tabIndex={0}
                    onClick={(e) => { e.stopPropagation(); setSelectedDate(""); }}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedDate("")}
                    className="text-[#9a9492] active:text-[#eb7583] transition-colors cursor-pointer shrink-0 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
                    aria-label="Clear date">
                    <X className="w-4 h-4" />
                  </span>
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#9a9492] shrink-0" />
                )}
              </button>
              <input ref={mobileDateInputRef} type="date" value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" tabIndex={-1} aria-hidden="true" />
            </div>

            {/* Search CTA */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-[#eb7583] hover:bg-[#d4616f] active:bg-[#c25669] text-white text-base font-semibold flex items-center justify-center gap-2.5 shadow-[0_4px_20px_rgba(235,117,131,0.35)] active:scale-[0.98] transition-all duration-150 min-h-[52px]"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              <span>Find Artists</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
