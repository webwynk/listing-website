"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Eye,
  ExternalLink,
  Loader2,
  Plus,
  Trash2,
  Layers,
  Camera,
  HeartHandshake,
  Smartphone,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_PAGE_HEROES, PageHeroConfig, HeroSlide } from "@/lib/heroes-types";

const PAGES = [
  { id: "home", label: "Home Page", path: "/" },
  { id: "artists", label: "Find Artists", path: "/artists" },
  { id: "packages", label: "Packages", path: "/packages" },
  { id: "how-it-works", label: "How It Works", path: "/how-it-works" },
  { id: "about", label: "About Us", path: "/about" },
  { id: "contact", label: "Contact Us", path: "/contact" },
  { id: "blog", label: "Blog Journal", path: "/blog" },
];

export default function AdminHeroesPage() {
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [heroes, setHeroes] = useState<Record<string, PageHeroConfig>>(DEFAULT_PAGE_HEROES);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Active slide index for home page multi-slider
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const slideFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  // Active page hero config
  const currentHero: PageHeroConfig =
    heroes[selectedPage] || DEFAULT_PAGE_HEROES[selectedPage] || DEFAULT_PAGE_HEROES.home;

  const currentSlides: HeroSlide[] =
    currentHero.slides && currentHero.slides.length > 0
      ? currentHero.slides
      : DEFAULT_PAGE_HEROES.home.slides || [];

  const activeSlide: HeroSlide = currentSlides[activeSlideIdx] || currentSlides[0] || {
    id: "default-slide",
    category: "makeup",
    categoryLabel: "Bridal Makeup",
    eyebrow: currentHero.eyebrow,
    title: currentHero.title,
    subheading: currentHero.subheading,
    imageUrl: currentHero.imageUrl,
  };

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/heroes");
      const data = await res.json();
      if (data.success && data.data) {
        setHeroes(data.data);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to load hero configurations." });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof PageHeroConfig, value: any) => {
    setHeroes((prev) => ({
      ...prev,
      [selectedPage]: {
        ...currentHero,
        [field]: value,
      },
    }));
  };

  // Slide-specific change handler
  const handleSlideChange = (slideIndex: number, field: keyof HeroSlide, value: string) => {
    const updatedSlides = [...currentSlides];
    if (updatedSlides[slideIndex]) {
      updatedSlides[slideIndex] = {
        ...updatedSlides[slideIndex],
        [field]: value,
      };

      // Also sync top-level if editing slide 0
      const updatedHero = {
        ...currentHero,
        slides: updatedSlides,
      };

      if (slideIndex === 0) {
        if (field === "eyebrow") updatedHero.eyebrow = value;
        if (field === "title") updatedHero.title = value;
        if (field === "subheading") updatedHero.subheading = value;
        if (field === "imageUrl") updatedHero.imageUrl = value;
      }

      setHeroes((prev) => ({
        ...prev,
        [selectedPage]: updatedHero,
      }));
    }
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      category: "custom",
      categoryLabel: "New Service",
      eyebrow: "EXCLUSIVE SERVICE",
      title: "Luxury Bridal Artistry",
      subheading: "Connect with elite beauty masters tailored to your milestone celebrations.",
      imageUrl: "/images/hero-bride.jpg",
    };

    const updatedSlides = [...currentSlides, newSlide];
    handleFieldChange("slides", updatedSlides);
    setActiveSlideIdx(updatedSlides.length - 1);
  };

  const handleDeleteSlide = (indexToDelete: number) => {
    if (currentSlides.length <= 1) {
      setMessage({ type: "error", text: "At least one hero slide is required." });
      return;
    }

    const updatedSlides = currentSlides.filter((_, i) => i !== indexToDelete);
    handleFieldChange("slides", updatedSlides);
    setActiveSlideIdx(Math.max(0, indexToDelete - 1));
  };

  // Direct Cloudinary Upload for Page Hero Cover
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `heroes/${selectedPage}`);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Image upload failed.");
      }

      handleFieldChange("imageUrl", data.data.url);
      setMessage({
        type: "success",
        text: `Hero image uploaded to Cloudinary successfully!`,
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to upload image. Please try again.",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Direct Cloudinary Upload for Specific Slide
  const handleSlideFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `heroes/slides`);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Slide image upload failed.");
      }

      handleSlideChange(activeSlideIdx, "imageUrl", data.data.url);
      setMessage({
        type: "success",
        text: `Slide image uploaded to Cloudinary successfully!`,
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to upload image. Please try again.",
      });
    } finally {
      setUploading(false);
      if (slideFileInputRef.current) slideFileInputRef.current.value = "";
    }
  };

  // Direct Cloudinary Upload for Mobile PNG Hero Image
  const handleMobileFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setMessage(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "heroes/mobile");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Mobile hero image upload failed.");
      }

      handleFieldChange("mobileImageUrl", data.data.url);
      setMessage({
        type: "success",
        text: "Mobile hero image uploaded to Cloudinary successfully!",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to upload mobile image. Please try again.",
      });
    } finally {
      setUploading(false);
      if (mobileFileInputRef.current) mobileFileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const payload = {
        ...currentHero,
        page: selectedPage,
        slides: selectedPage === "home" ? currentSlides : undefined,
      };

      const res = await fetch("/api/admin/heroes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update hero.");
      }

      setMessage({
        type: "success",
        text: `Hero content for ${PAGES.find((p) => p.id === selectedPage)?.label} saved successfully!`,
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to save hero." });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    const defaultHero = DEFAULT_PAGE_HEROES[selectedPage];
    if (defaultHero) {
      setHeroes((prev) => ({
        ...prev,
        [selectedPage]: defaultHero,
      }));
      setActiveSlideIdx(0);
      setMessage({
        type: "success",
        text: "Form reset to reference design values. Remember to click Save Changes.",
      });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fcdadb] text-[#eb7583] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visual Content Architecture</span>
          </div>
          <h1 className="font-title text-3xl font-bold text-[#1e1a19]">
            Page Heroes &amp; Sliders
          </h1>
          <p className="text-sm text-gray-500 mt-1 font-body">
            Upload custom hero imagery to Cloudinary, edit typography, and manage multiple hero slides (Makeup, Photography, Mehendi).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleResetToDefault}
            className="min-h-[44px] text-xs font-semibold gap-2 border-gray-300"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Reference
          </Button>

          <Button
            onClick={handleSave}
            disabled={saving || uploading}
            className="min-h-[44px] bg-[#eb7583] hover:bg-[#d4616f] text-white text-xs font-bold gap-2 px-6 shadow-md"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Alert Notification */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-start gap-3 animate-in fade-in-0 duration-200 ${
            message.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-200">
        {PAGES.map((page) => (
          <button
            key={page.id}
            onClick={() => {
              setSelectedPage(page.id);
              setMessage(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap min-h-[44px] flex items-center gap-2 ${
              selectedPage === page.id
                ? "bg-[#1e1a19] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>{page.label}</span>
            <span className="text-[10px] opacity-60">({page.path})</span>
          </button>
        ))}
      </div>

      {/* 2-Column Editor + Live Visual Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Editor (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-title text-xl font-bold text-[#1e1a19]">
                {PAGES.find((p) => p.id === selectedPage)?.label} Hero Editor
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedPage === "home"
                  ? "Manage multi-slides for Makeup, Photography, Mehendi"
                  : "Edit single page hero visual and copy"}
              </p>
            </div>
            <a
              href={PAGES.find((p) => p.id === selectedPage)?.path}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#eb7583] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View Live</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* If Home Page: Multi-Slide Tab Bar */}
          {selectedPage === "home" && (
            <div className="p-4 rounded-2xl bg-[#faf8f7] border border-gray-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1e1a19] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#eb7583]" />
                  <span>Homepage Slider Slides ({currentSlides.length})</span>
                </span>

                <button
                  type="button"
                  onClick={handleAddSlide}
                  className="text-xs font-semibold text-[#eb7583] hover:text-[#d4616f] flex items-center gap-1 p-1 hover:bg-[#fcdadb]/40 rounded-lg transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Slide</span>
                </button>
              </div>

              {/* Slide Selector Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {currentSlides.map((slide, idx) => {
                  const isCurrent = idx === activeSlideIdx;
                  return (
                    <button
                      key={slide.id || idx}
                      type="button"
                      onClick={() => setActiveSlideIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 shrink-0 ${
                        isCurrent
                          ? "bg-[#eb7583] text-white shadow-xs font-semibold"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <span>Slide {idx + 1}: {slide.categoryLabel || slide.category}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form Fields for Active Slide or Page Hero */}
          {selectedPage === "home" ? (
            /* Home Slide Editor */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase">
                  Editing Slide {activeSlideIdx + 1}: {activeSlide.categoryLabel}
                </span>

                {currentSlides.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(activeSlideIdx)}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 p-1 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Slide</span>
                  </button>
                )}
              </div>

              {/* Category & Label Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Category Tag
                  </label>
                  <Input
                    value={activeSlide.category}
                    onChange={(e) => handleSlideChange(activeSlideIdx, "category", e.target.value)}
                    placeholder="e.g. makeup, photography, mehendi"
                    className="text-xs min-h-[44px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Category Label
                  </label>
                  <Input
                    value={activeSlide.categoryLabel}
                    onChange={(e) => handleSlideChange(activeSlideIdx, "categoryLabel", e.target.value)}
                    placeholder="e.g. Bridal Makeup"
                    className="text-xs min-h-[44px]"
                  />
                </div>
              </div>

              {/* Eyebrow */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Slide Eyebrow
                </label>
                <Input
                  value={activeSlide.eyebrow}
                  onChange={(e) => handleSlideChange(activeSlideIdx, "eyebrow", e.target.value)}
                  placeholder="e.g. PROFESSIONAL MAKEUP ARTISTS"
                  className="text-xs min-h-[44px]"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Slide Headline (H1)
                </label>
                <Input
                  value={activeSlide.title}
                  onChange={(e) => handleSlideChange(activeSlideIdx, "title", e.target.value)}
                  placeholder="e.g. Look Beautiful For Every Moment"
                  className="text-sm font-title font-bold min-h-[44px]"
                />
              </div>

              {/* Subheading */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Slide Description
                </label>
                <Textarea
                  rows={3}
                  value={activeSlide.subheading}
                  onChange={(e) => handleSlideChange(activeSlideIdx, "subheading", e.target.value)}
                  placeholder="Enter slide description..."
                  className="text-xs"
                />
              </div>

              {/* Slide Image Uploader */}
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Slide Background Image
                </label>

                <div
                  onClick={() => slideFileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#fcdadb] hover:border-[#eb7583] bg-[#fcf1ef]/50 rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                >
                  <input
                    type="file"
                    ref={slideFileInputRef}
                    onChange={handleSlideFileUpload}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#eb7583]">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  </div>
                  <p className="text-xs font-bold text-[#1e1a19]">
                    {uploading ? "Uploading..." : `Upload Image for Slide ${activeSlideIdx + 1}`}
                  </p>
                </div>

                <Input
                  value={activeSlide.imageUrl}
                  onChange={(e) => handleSlideChange(activeSlideIdx, "imageUrl", e.target.value)}
                  placeholder="Image path or Cloudinary URL"
                  className="text-xs font-mono min-h-[40px]"
                />
              </div>

              {/* ─── Dedicated Mobile Hero PNG Image Card ─── */}
              <div className="pt-5 border-t border-gray-200 space-y-3 bg-[#fcf1ef]/40 -mx-4 -mb-4 p-4 rounded-b-2xl border-dashed">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#eb7583]" />
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-800">
                      Mobile Hero Image (PNG)
                    </label>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#eb7583]/15 text-[#eb7583]">
                    Mobile Only (&lt; 768px)
                  </span>
                </div>

                <p className="text-xs text-gray-600 font-body leading-relaxed">
                  On mobile phones, this image is rendered in the clean vertical stack: 
                  <strong> Eyebrow &rarr; Title &rarr; Description &rarr; Mobile PNG &rarr; Search Filter</strong>.
                  Transparent PNG or WebP recommended.
                </p>

                <div
                  onClick={() => mobileFileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#fcdadb] hover:border-[#eb7583] bg-white rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group shadow-xs"
                >
                  <input
                    type="file"
                    ref={mobileFileInputRef}
                    onChange={handleMobileFileUpload}
                    accept="image/png,image/webp,image/jpeg"
                    className="hidden"
                  />
                  <div className="w-9 h-9 rounded-full bg-[#fcf1ef] shadow-xs flex items-center justify-center text-[#eb7583] group-hover:scale-105 transition-transform">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </div>
                  <p className="text-xs font-bold text-[#1e1a19]">
                    {uploading ? "Uploading..." : "Click to Upload Mobile PNG Image"}
                  </p>
                  <span className="text-[10px] text-gray-400">Direct Cloudinary upload (PNG / WebP)</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600">Mobile Image URL</label>
                  <Input
                    value={currentHero.mobileImageUrl || ""}
                    onChange={(e) => handleFieldChange("mobileImageUrl", e.target.value)}
                    placeholder="https://res.cloudinary.com/... or /images/..."
                    className="text-xs font-mono min-h-[40px] bg-white"
                  />
                </div>

                {currentHero.mobileImageUrl && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#fcdadb]/80 shadow-xs">
                    <div className="relative w-12 h-12 rounded-lg bg-[#fcf1ef] border border-[#fcdadb] overflow-hidden shrink-0 flex items-center justify-center">
                      <Image
                        src={currentHero.mobileImageUrl}
                        alt="Mobile preview"
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1e1a19] truncate">Active Mobile Hero Image</p>
                      <p className="text-[10px] text-gray-500 font-mono truncate">{currentHero.mobileImageUrl}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleFieldChange("mobileImageUrl", "")}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 font-semibold hover:bg-red-50 rounded"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Standard Single Hero Editor for other pages */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Eyebrow Tagline
                </label>
                <Input
                  value={currentHero.eyebrow}
                  onChange={(e) => handleFieldChange("eyebrow", e.target.value)}
                  placeholder="e.g. CURATED TALENT"
                  className="min-h-[44px] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Main Headline (H1)
                </label>
                <Input
                  value={currentHero.title}
                  onChange={(e) => handleFieldChange("title", e.target.value)}
                  placeholder="e.g. Discover Elite Makeup Artists"
                  className="min-h-[44px] text-sm font-title font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Subheading
                </label>
                <Textarea
                  rows={3}
                  value={currentHero.subheading}
                  onChange={(e) => handleFieldChange("subheading", e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Hero Cover Image
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#fcdadb] hover:border-[#eb7583] bg-[#fcf1ef]/50 rounded-2xl p-5 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center text-[#eb7583]">
                    {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                  </div>
                  <p className="text-xs font-bold text-[#1e1a19]">
                    {uploading ? "Uploading to Cloudinary..." : "Click to Upload New Hero Image"}
                  </p>
                </div>

                <Input
                  value={currentHero.imageUrl}
                  onChange={(e) => handleFieldChange("imageUrl", e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="text-xs font-mono min-h-[40px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Visual Simulation (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <Eye className="w-4 h-4 text-[#eb7583]" />
              <span>Live Visual Simulation</span>
            </div>
            {selectedPage === "home" && (
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    previewMode === "desktop"
                      ? "bg-white text-[#1e1a19] shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    previewMode === "mobile"
                      ? "bg-[#eb7583] text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-gray-200 overflow-hidden shadow-lg bg-white relative">
            {/* Mock browser header */}
            <div className="bg-gray-100 px-4 py-2.5 border-b border-gray-200 flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="bg-white rounded-md px-3 py-0.5 text-[10px] text-gray-500 font-mono flex-1 text-center truncate">
                glambook.in{PAGES.find((p) => p.id === selectedPage)?.path}
              </div>
            </div>

            {/* Visual Hero Mockup */}
            {selectedPage === "home" && previewMode === "mobile" ? (
              /* Mobile Preview Simulator */
              <div className="bg-[#fcf1ef] p-6 flex flex-col items-center text-center select-none">
                <div className="w-full max-w-[340px] space-y-3">
                  {/* Eyebrow */}
                  <div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#eb7583]/10 border border-[#eb7583]/20 text-[#eb7583] text-[9px] font-bold tracking-widest uppercase">
                      <Sparkles className="w-2.5 h-2.5" />
                      {currentHero.eyebrow || activeSlide.eyebrow}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-title text-xl font-bold text-[#1e1a19] leading-tight">
                    {currentHero.title || activeSlide.title}
                  </h4>

                  {/* Description */}
                  <p className="text-[11px] text-[#5c5553] leading-relaxed">
                    {currentHero.subheading || activeSlide.subheading}
                  </p>

                  {/* Mobile PNG Image Container */}
                  <div className="relative w-full h-[180px] my-2 flex items-center justify-center">
                    <Image
                      src={currentHero.mobileImageUrl || currentHero.imageUrl || "/images/hero-bride.jpg"}
                      alt="Mobile Hero Mockup"
                      fill
                      className="object-contain drop-shadow-sm"
                      unoptimized
                    />
                  </div>

                  {/* Search Card Mini Simulation */}
                  <div className="bg-white rounded-2xl p-3 shadow-md border border-[#fcdadb]/50 space-y-2 text-left">
                    <div className="p-2 rounded-xl bg-[#faf8f7] border border-black/[0.04] text-[10px] text-gray-600 font-semibold flex items-center justify-between">
                      <span>Location</span>
                      <span className="text-[#1e1a19]">All Cities</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#faf8f7] border border-black/[0.04] text-[10px] text-gray-600 font-semibold flex items-center justify-between">
                      <span>Service</span>
                      <span className="text-[#1e1a19]">Bridal Makeup</span>
                    </div>
                    <div className="w-full py-2 bg-[#eb7583] text-white text-[11px] font-bold rounded-xl text-center shadow-xs">
                      Find Artists
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div className="relative min-h-[400px] w-full flex items-center overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={
                    selectedPage === "home"
                      ? activeSlide.imageUrl || "/images/hero-bride.jpg"
                      : currentHero.imageUrl || DEFAULT_PAGE_HEROES.home.imageUrl
                  }
                  alt="Hero Preview"
                  fill
                  className="object-cover object-center"
                  unoptimized
                />
                {/* Left side desktop overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Text Content Overlay: 50% left container simulation */}
              <div className="relative z-10 p-6 sm:p-8 max-w-[65%] space-y-3">
                {selectedPage === "home" && (
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#eb7583] text-white text-[10px] font-bold">
                    {activeSlide.categoryLabel}
                  </span>
                )}

                <span className="block text-[#fcdadb] font-bold text-xs tracking-wider uppercase">
                  {selectedPage === "home" ? activeSlide.eyebrow : currentHero.eyebrow}
                </span>

                <h3 className="font-title text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {selectedPage === "home" ? activeSlide.title : currentHero.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-body">
                  {selectedPage === "home" ? activeSlide.subheading : currentHero.subheading}
                </p>

                {selectedPage === "home" && (
                  <div className="pt-2">
                    {/* Simulated 70% width search bar */}
                    <div className="bg-white/95 backdrop-blur-md rounded-full p-2 shadow-md flex items-center justify-between gap-2 border border-white/40">
                      <span className="text-[10px] text-gray-600 font-semibold px-2">
                        Location | Date | Service
                      </span>
                      <div className="bg-[#eb7583] text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                        Search &rarr;
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
          </div>

          <div className="bg-[#fcf1ef] border border-[#fcdadb] rounded-2xl p-4 text-[#1e1a19] text-xs flex items-start gap-3 font-body">
            <Sparkles className="w-4 h-4 text-[#eb7583] shrink-0 mt-0.5" />
            <p>
              <strong>Multi-Slider Sync:</strong> All slides (Makeup, Photography, Mehendi) save directly to your database and auto-rotate smoothly on the live homepage hero while keeping the search filter fixed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
