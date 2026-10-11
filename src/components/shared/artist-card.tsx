"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  Calendar,
} from "lucide-react";

export interface ArtistCardItem {
  id: string; // artistProfile.id
  userId?: string;
  slug: string;
  name: string;
  businessName: string;
  avatarUrl?: string | null;
  coverImage?: string | null;
  categoryName?: string | null;
  city?: string | null;
  startingPrice?: number | null;
  avgRating?: number;
  totalReviews?: number;
  isFeatured?: boolean;
  yearsOfExperience?: number | null;
  isFavorite?: boolean;
}

interface ArtistCardProps {
  artist: ArtistCardItem;
  onBookClick?: (artist: ArtistCardItem) => void;
  onFavoriteChange?: (artistId: string, isFav: boolean) => void;
  priority?: boolean;
}

export function ArtistCard({
  artist,
  onBookClick,
  onFavoriteChange,
}: ArtistCardProps) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(artist.isFavorite || false);
  const [favLoading, setFavLoading] = useState(false);

  const displayImage =
    artist.coverImage ||
    artist.avatarUrl ||
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop";

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (favLoading) return;
    setFavLoading(true);

    const nextState = !isFav;
    setIsFav(nextState);

    try {
      if (nextState) {
        // Add favorite
        const res = await fetch("/api/user/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ artistProfileId: artist.id }),
        });
        if (res.status === 401) {
          router.push(`/login?redirect=/artist/${artist.slug}`);
          setIsFav(false);
          return;
        }
      } else {
        // Remove favorite
        await fetch(`/api/user/favorites?artistProfileId=${artist.id}`, {
          method: "DELETE",
        });
      }

      if (onFavoriteChange) {
        onFavoriteChange(artist.id, nextState);
      }
    } catch (err) {
      console.error("Favorite toggle failed:", err);
      setIsFav(!nextState); // revert on error
    } finally {
      setFavLoading(false);
    }
  };

  const formattedPrice =
    artist.startingPrice && artist.startingPrice > 0
      ? `₹${artist.startingPrice.toLocaleString("en-IN")}`
      : "Custom Quote";

  return (
    <div className="group relative bg-white border border-black/[0.06] hover:border-[#fcdadb] rounded-[24px] sm:rounded-[28px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_rgba(235,117,131,0.16)] transition-all duration-500 ease-out flex flex-col justify-between focus-within:ring-2 focus-within:ring-[#eb7583]">
      {/* Top Image & Floating Glass Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f5f3f2]">
        <img
          src={displayImage}
          alt={artist.businessName || artist.name}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Dual Gradient Vignette */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {artist.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#eb7583] to-[#c24e5c] text-white shadow-xs font-body">
                <Sparkles className="w-3 h-3 text-white" />
                <span>Featured</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-md text-[#1e1a19] border border-white/60 shadow-xs font-body">
              <ShieldCheck className="w-3 h-3 text-[#eb7583]" />
              <span>Verified Master</span>
            </span>
          </div>

          {/* Favorite Toggle Button */}
          <button
            onClick={handleToggleFavorite}
            disabled={favLoading}
            className="pointer-events-auto w-8 h-8 rounded-full bg-white/85 backdrop-blur-md border border-white/60 text-[#5c5553] hover:text-[#eb7583] hover:bg-white flex items-center justify-center transition-all shadow-xs active:scale-90 min-h-[36px] min-w-[36px]"
            aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isFav ? "fill-[#eb7583] text-[#eb7583]" : "text-[#5c5553]"
              }`}
            />
          </button>
        </div>

        {/* Category & City Pills Over Image Bottom */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
          {artist.categoryName && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/45 backdrop-blur-md text-white border border-white/15 font-body">
              {artist.categoryName}
            </span>
          )}
          {artist.city && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-black/45 backdrop-blur-md text-white/90 border border-white/15 font-body">
              <MapPin className="w-3 h-3 text-[#fcdadb]" />
              <span>{artist.city}</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2">
          {/* Rating & Reviews + Experience */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fcf1ef] border border-[#fcdadb] text-[#eb7583] font-bold font-body">
                <Star className="w-3 h-3 fill-[#eb7583] text-[#eb7583]" />
                <span>{(artist.avgRating || 5.0).toFixed(1)}</span>
              </div>
              <span className="text-[#6e6968] text-xs font-body">
                ({artist.totalReviews || 0} reviews)
              </span>
            </div>

            {artist.yearsOfExperience && artist.yearsOfExperience > 0 && (
              <span className="text-[11px] font-medium text-[#6e6968] font-body bg-[#faf8f7] px-2 py-0.5 rounded-full border border-black/[0.04]">
                {artist.yearsOfExperience}+ yrs exp
              </span>
            )}
          </div>

          {/* Business & Artist Name */}
          <div className="space-y-0.5">
            <Link
              href={`/artist/${artist.slug}`}
              className="group/title block font-title text-[19px] sm:text-[21px] font-medium text-[#1e1a19] group-hover/title:text-[#eb7583] transition-colors line-clamp-1 leading-snug"
            >
              {artist.businessName || artist.name}
            </Link>
            <p className="text-xs text-[#6e6968] truncate font-body">by {artist.name}</p>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-black/[0.05] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#a09b9a] uppercase font-bold tracking-wider block font-body">
              Starting from
            </span>
            <span className="text-base sm:text-lg font-bold text-[#1e1a19] font-body tracking-tight">
              {formattedPrice}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onBookClick ? (
              <button
                onClick={() => onBookClick(artist)}
                className="px-4 py-2 rounded-full bg-[#eb7583] hover:bg-[#d4616f] text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 font-body min-h-[38px]"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book</span>
              </button>
            ) : (
              <Link
                href={`/artist/${artist.slug}`}
                className="px-3.5 py-2 rounded-full bg-[#fcf1ef] hover:bg-[#eb7583] text-[#eb7583] hover:text-white border border-[#fcdadb] hover:border-[#eb7583] font-semibold text-xs flex items-center gap-1 transition-all shadow-xs active:scale-95 font-body min-h-[38px] group/btn"
              >
                <span>View Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
