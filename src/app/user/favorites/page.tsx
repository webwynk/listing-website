"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Star,
  MapPin,
  Sparkles,
  Loader2,
  AlertCircle,
  Calendar,
  Search,
} from "lucide-react";
import { BookingModal, BookingArtist } from "@/components/booking/booking-modal";

interface FavoriteItem {
  id: string;
  artistId: string;
  createdAt: string;
  artist: {
    id: string;
    avgRating: number;
    totalReviews: number;
    businessName: string | null;
    user: {
      id: string;
      name: string;
      avatarUrl: string | null;
      locationCity: string | null;
      locationState: string | null;
    };
    services?: Array<{
      id: string;
      priceFrom: number;
      priceTo: number | null;
      priceType: string;
      durationMinutes: number | null;
      category?: {
        name: string;
      };
    }>;
  };
}

export default function UserFavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Modal State
  const [bookingArtist, setBookingArtist] = useState<BookingArtist | null>(null);

  async function fetchFavorites() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/favorites");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load favorites.");
      setFavorites(json.data.favorites || []);
    } catch (err: any) {
      setError(err.message || "Failed to load favorites.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function handleRemoveFavorite(artistId: string) {
    try {
      // Optimistic update
      setFavorites((prev) => prev.filter((f) => f.artistId !== artistId));

      const res = await fetch(`/api/user/favorites?artistId=${artistId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        // Rollback if failed
        fetchFavorites();
      }
    } catch {
      fetchFavorites();
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <Heart className="w-7 h-7 text-rose-400 fill-rose-400" />
            Saved Artists & Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Quickly compare your shortlisted bridal artists and check date availability
          </p>
        </div>

        <Link
          href="/artists"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 min-h-[44px]"
        >
          <Search className="w-4 h-4" />
          Find More Artists
        </Link>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-3xl animate-pulse h-64"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 bg-red-950/20 border border-red-800/40 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-xs text-red-300">{error}</p>
          <button
            onClick={fetchFavorites}
            className="px-4 py-2 bg-neutral-800 text-white rounded-xl text-xs font-semibold hover:bg-neutral-700 min-h-[44px]"
          >
            Retry
          </button>
        </div>
      ) : favorites.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-serif font-bold text-white">
              No saved artists yet
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Save your favorite makeup artists and studios to easily request quotes and compare styles.
            </p>
          </div>
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold rounded-xl text-xs transition min-h-[44px]"
          >
            <Sparkles className="w-4 h-4" />
            Discover Verified Artists
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((fav) => {
            const { artist } = fav;
            const services = artist.services || [];
            const lowestPrice =
              services.length > 0
                ? Math.min(...services.map((s) => s.priceFrom))
                : null;

            return (
              <div
                key={fav.id}
                className="p-5 sm:p-6 bg-neutral-900/80 border border-neutral-800 rounded-3xl hover:border-amber-500/40 transition shadow-xl flex flex-col justify-between space-y-4 group"
              >
                <div>
                  {/* Top Bar: Avatar & Heart Toggle */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {artist.user?.avatarUrl ? (
                        <img
                          src={artist.user.avatarUrl}
                          alt={artist.user.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-amber-500/30"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-amber-500/20 text-amber-300 flex items-center justify-center text-lg font-bold">
                          {artist.user?.name ? artist.user.name.charAt(0) : "A"}
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition">
                          {artist.user?.name}
                        </h3>
                        {artist.businessName && (
                          <span className="text-xs text-neutral-400 block">
                            {artist.businessName}
                          </span>
                        )}
                        {artist.user?.locationCity && (
                          <span className="text-[11px] text-neutral-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {artist.user.locationCity}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveFavorite(fav.artistId)}
                      className="p-2 text-rose-400 hover:text-neutral-500 rounded-xl hover:bg-neutral-800/80 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Remove from favorites"
                    >
                      <Heart className="w-5 h-5 fill-rose-400" />
                    </button>
                  </div>

                  {/* Rating & Pricing Pills */}
                  <div className="mt-4 flex items-center justify-between text-xs pt-3 border-t border-neutral-800/70">
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span className="font-bold">
                        {artist.avgRating > 0 ? artist.avgRating.toFixed(1) : "New"}
                      </span>
                      <span className="text-neutral-500">
                        ({artist.totalReviews} reviews)
                      </span>
                    </div>

                    {lowestPrice != null && (
                      <span className="text-neutral-300 font-medium">
                        Starts <span className="text-amber-400 font-bold">₹{lowestPrice.toLocaleString()}</span>
                      </span>
                    )}
                  </div>

                  {/* Service tags */}
                  {services.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {services.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-neutral-950 border border-neutral-800 text-[10px] text-neutral-400"
                        >
                          {s.category?.name || "Service"}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-neutral-800/70 flex items-center gap-2">
                  <button
                    onClick={() =>
                      setBookingArtist({
                        id: artist.id,
                        name: artist.user.name,
                        avatarUrl: artist.user.avatarUrl,
                        businessName: artist.businessName,
                        city: artist.user.locationCity,
                        services: artist.services,
                      })
                    }
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-xs transition shadow-md shadow-amber-500/10 min-h-[44px]"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book Appointment
                  </button>

                  <Link
                    href={`/artists/${artist.id}`}
                    className="px-3.5 py-2.5 bg-neutral-800/80 hover:bg-neutral-800 text-white rounded-xl text-xs font-medium transition min-h-[44px] flex items-center justify-center"
                  >
                    Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {bookingArtist && (
        <BookingModal
          isOpen={!!bookingArtist}
          onClose={() => setBookingArtist(null)}
          artist={bookingArtist}
        />
      )}
    </div>
  );
}
