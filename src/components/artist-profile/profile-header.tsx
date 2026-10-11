"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Heart,
  ShieldCheck,
  Sparkles,
  Calendar,
  Share2,
  Check,
  Clock,
  Award,
} from "lucide-react";

export interface ArtistProfileHeaderData {
  id: string;
  name: string;
  businessName: string;
  avatarUrl?: string | null;
  coverImage?: string | null;
  categoryName: string;
  city: string;
  state?: string;
  experienceYears?: number;
  avgRating: number;
  totalReviews: number;
  isFeatured?: boolean;
  startingPrice?: number;
  bio?: string | null;
  isFavorite?: boolean;
}

interface ProfileHeaderProps {
  artist: ArtistProfileHeaderData;
  onBookClick: () => void;
}

export function ProfileHeader({ artist, onBookClick }: ProfileHeaderProps) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(artist.isFavorite || false);
  const [favLoading, setFavLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayCover =
    artist.coverImage ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop";

  const displayAvatar =
    artist.avatarUrl ||
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=400&auto=format&fit=crop";

  const handleToggleFavorite = async () => {
    if (favLoading) return;
    setFavLoading(true);

    const nextState = !isFav;
    setIsFav(nextState);

    try {
      if (nextState) {
        const res = await fetch("/api/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ artistProfileId: artist.id }),
        });
        if (res.status === 401) {
          router.push(`/login?redirect=/artist/${artist.id}`);
          setIsFav(false);
          return;
        }
      } else {
        await fetch(`/api/user/favorites?artistProfileId=${artist.id}`, {
          method: "DELETE",
        });
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
      setIsFav(!nextState);
    } finally {
      setFavLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative w-full bg-[#faf8f7]">
      {/* 1. Cinematic Cover Photo Banner */}
      <div className="relative h-64 sm:h-80 md:h-[380px] w-full overflow-hidden bg-[#181515]">
        <img
          src={displayCover}
          alt={artist.businessName || artist.name}
          className="w-full h-full object-cover object-center scale-102 transition-transform duration-1000"
        />
        {/* Luxury Vignettes & Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#faf8f7] via-[#faf8f7]/40 to-transparent pointer-events-none" />

        {/* Floating Top Hallmark Pill */}
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 lg:left-8 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10.5px] font-semibold tracking-wider uppercase font-body shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#eb7583]" />
            <span>GlamBook Haute Master</span>
          </div>
        </div>
      </div>

      {/* 2. Overlapping Elevated Profile Details Card */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-28 pb-8">
        <div className="rounded-[28px] sm:rounded-[36px] bg-white/95 backdrop-blur-xl border border-black/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.06)] p-6 sm:p-8 lg:p-10 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
            {/* Left: Avatar & Details */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 sm:gap-7 text-center sm:text-left">
              {/* Avatar with Rose-Gold Gradient Frame */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-[26px] sm:rounded-[30px] p-[2.5px] bg-gradient-to-tr from-[#eb7583] via-[#fcdadb] to-white shadow-[0_12px_32px_rgba(235,117,131,0.22)] shrink-0 -mt-16 sm:-mt-20">
                <div className="w-full h-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#faf8f7]">
                  <img
                    src={displayAvatar}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Badges, Titles & Meta */}
              <div className="space-y-2.5">
                {/* Badges Row */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {artist.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#eb7583] to-[#c24e5c] text-white shadow-xs font-body">
                      <Sparkles className="w-3 h-3" />
                      <span>Featured Studio</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-[#fcf1ef] text-[#1e1a19] border border-[#fcdadb] font-body">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#eb7583]" />
                    <span>Verified Master</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-medium bg-[#faf8f7] text-[#5c5553] border border-black/[0.06] font-body">
                    {artist.categoryName}
                  </span>
                </div>

                {/* Main Heading (Cormorant Garamond) */}
                <h1 className="font-title text-3xl sm:text-4xl lg:text-[44px] font-medium text-[#1e1a19] tracking-tight leading-tight">
                  {artist.businessName || artist.name}
                </h1>

                {/* Subtitle & Meta Info Row */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-[13px] text-[#5c5553] font-body">
                  <span className="text-[#6e6968]">by {artist.name}</span>
                  <span className="text-[#d8d3d0]">•</span>
                  <span className="flex items-center gap-1.5 text-[#1e1a19] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#eb7583]" />
                    <span>{artist.city}{artist.state ? `, ${artist.state}` : ""}</span>
                  </span>
                  <span className="text-[#d8d3d0]">•</span>
                  <a
                    href="#reviews"
                    className="flex items-center gap-1.5 text-[#eb7583] font-semibold hover:underline group"
                  >
                    <Star className="w-3.5 h-3.5 fill-[#eb7583] text-[#eb7583]" />
                    <span>{(artist.avgRating || 5.0).toFixed(1)}</span>
                    <span className="text-[#6e6968] font-normal group-hover:text-[#eb7583]">
                      ({artist.totalReviews} reviews)
                    </span>
                  </a>
                  {artist.experienceYears && artist.experienceYears > 0 && (
                    <>
                      <span className="text-[#d8d3d0]">•</span>
                      <span className="flex items-center gap-1.5 text-[#6e6968]">
                        <Clock className="w-3.5 h-3.5 text-[#eb7583]" />
                        <span>{artist.experienceYears}+ Yrs Exp</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Actions & Primary CTA */}
            <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 pt-2 lg:pt-0">
              {/* Share Button with Confirmation */}
              <button
                onClick={handleShare}
                className="p-3 rounded-full bg-[#faf8f7] hover:bg-[#fcf1ef] border border-black/[0.08] hover:border-[#fcdadb] text-[#5c5553] hover:text-[#1e1a19] transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs active:scale-95"
                title="Share profile"
                aria-label="Share profile"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>

              {/* Favorite Heart Button */}
              <button
                onClick={handleToggleFavorite}
                disabled={favLoading}
                className="p-3 rounded-full bg-[#faf8f7] hover:bg-[#fcf1ef] border border-black/[0.08] hover:border-[#fcdadb] text-[#5c5553] hover:text-[#eb7583] transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs active:scale-95"
                title={isFav ? "Remove from favorites" : "Save to favorites"}
                aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFav ? "fill-[#eb7583] text-[#eb7583]" : "text-[#5c5553]"
                  }`}
                />
              </button>

              {/* Primary Booking Request CTA */}
              <button
                onClick={onBookClick}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-full bg-[#eb7583] hover:bg-[#d4616f] active:bg-[#c24e5c] text-white font-semibold text-xs sm:text-sm shadow-[0_6px_22px_rgba(235,117,131,0.32)] transition-all min-h-[44px] font-body active:scale-95 group"
              >
                <Calendar className="w-4 h-4" />
                <span>Send Booking Request</span>
              </button>
            </div>
          </div>

          {/* About the Artist Bio Section */}
          {artist.bio && (
            <div className="mt-8 pt-7 border-t border-black/[0.06] max-w-4xl">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#eb7583]" />
                <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#eb7583] font-body">
                  About the Artist &amp; Studio
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#5c5553] leading-relaxed font-body whitespace-pre-line">
                {artist.bio}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
