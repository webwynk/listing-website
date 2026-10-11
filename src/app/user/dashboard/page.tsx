"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Heart,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  AlertCircle,
  Camera,
  Layers,
  Search,
} from "lucide-react";

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    locationCity: string | null;
    avatarUrl: string | null;
    createdAt: string;
  };
  stats: {
    totalBookings: number;
    activeBookings: number;
    completedBookings: number;
    favoritesCount: number;
    reviewsCount: number;
  };
  nextBooking: any | null;
  recentBookings: any[];
}

export default function UserDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchDashboard() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/profile");
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to load dashboard.");
      }
      setData(json.data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse max-w-6xl mx-auto">
        <div className="h-40 bg-neutral-900 rounded-3xl border border-neutral-800" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-neutral-900 rounded-2xl border border-neutral-800" />
          ))}
        </div>
        <div className="h-64 bg-neutral-900 rounded-3xl border border-neutral-800" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 bg-red-950/20 border border-red-800/40 rounded-3xl text-center space-y-4 max-w-xl mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-lg font-serif font-bold text-white">Dashboard Unavailable</h2>
        <p className="text-xs text-red-300">{error || "Could not retrieve your profile."}</p>
        <button
          onClick={fetchDashboard}
          className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition min-h-[44px]"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { user, stats, nextBooking, recentBookings } = data;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/40 border border-neutral-800 p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                Client Member
              </span>
              {user.locationCity && (
                <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  {user.locationCity}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-wide">
              Hello, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Explore India&apos;s finest bridal artists, monitor your inquiries, and schedule unforgettable looks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 min-h-[44px]"
            >
              <Search className="w-4 h-4" />
              Discover Artists
            </Link>
          </div>
        </div>

        {/* Ambient subtle glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Bookings */}
        <Link
          href="/user/bookings"
          className="p-5 bg-neutral-900/70 border border-neutral-800 rounded-2xl hover:border-amber-500/40 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Active Inquiries
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-white">
            {stats.activeBookings}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Pending & confirmed bookings
          </span>
        </Link>

        {/* Completed Bookings */}
        <Link
          href="/user/bookings?status=COMPLETED"
          className="p-5 bg-neutral-900/70 border border-neutral-800 rounded-2xl hover:border-amber-500/40 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Completed Events
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-white">
            {stats.completedBookings}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Past successful looks
          </span>
        </Link>

        {/* Saved Favorites */}
        <Link
          href="/user/favorites"
          className="p-5 bg-neutral-900/70 border border-neutral-800 rounded-2xl hover:border-amber-500/40 transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Saved Artists
            </span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-white">
            {stats.favoritesCount}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Artists on your wishlist
          </span>
        </Link>

        {/* Reviews Shared */}
        <div className="p-5 bg-neutral-900/70 border border-neutral-800 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Reviews Shared
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-serif font-bold text-white">
            {stats.reviewsCount}
          </div>
          <span className="text-[11px] text-neutral-500 mt-1 block">
            Helpful feedback left
          </span>
        </div>
      </div>

      {/* Spotlight: Next Upcoming Booking */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-bold text-white tracking-wide flex items-center gap-2">
          <Calendar className="w-5 h-5 text-amber-400" />
          Next Scheduled Appointment
        </h2>

        {nextBooking ? (
          <div className="p-6 bg-neutral-900/80 border border-neutral-800 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-amber-500/30 transition shadow-xl">
            <div className="flex items-start sm:items-center gap-4">
              {nextBooking.artist?.user?.avatarUrl ? (
                <img
                  src={nextBooking.artist.user.avatarUrl}
                  alt={nextBooking.artist.user.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-amber-500/30 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-amber-500/20 text-amber-300 flex items-center justify-center text-lg font-bold shrink-0">
                  {nextBooking.artist?.user?.name ? nextBooking.artist.user.name.charAt(0) : "A"}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      nextBooking.status === "ACCEPTED"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {nextBooking.status === "ACCEPTED" ? "CONFIRMED" : "PENDING ARTIST REVIEW"}
                  </span>
                  <span className="text-xs text-neutral-500">
                    Ref: {nextBooking.bookingNumber}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-white">
                  {nextBooking.artist?.user?.name}
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 pt-0.5">
                  <span className="flex items-center gap-1 text-amber-300 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(nextBooking.bookingDate).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {nextBooking.bookingTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-500" />
                      {nextBooking.bookingTime}
                    </span>
                  )}
                  {nextBooking.service?.category?.name && (
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-neutral-500" />
                      {nextBooking.service.category.name}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/user/bookings"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition min-h-[44px] shrink-0"
            >
              View Booking Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base font-serif font-bold text-white">
                No Upcoming Appointments
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                You don&apos;t have any active appointments scheduled. Browse verified artists and lock in your preferred date early.
              </p>
            </div>
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold rounded-xl text-xs transition min-h-[44px]"
            >
              <Search className="w-3.5 h-3.5" />
              Explore Verified Artists
            </Link>
          </div>
        )}
      </div>

      {/* Quick Category Discovery Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-white tracking-wide">
            Explore by Specialization
          </h2>
          <Link
            href="/categories"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition"
          >
            All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/artists?category=bridal-makeup"
            className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl hover:border-amber-500/40 transition group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Bridal Makeup</h3>
              <p className="text-xs text-neutral-400 mt-0.5">HD, Airbrush, & Traditional</p>
            </div>
          </Link>

          <Link
            href="/artists?category=hair-styling"
            className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl hover:border-amber-500/40 transition group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Hair Styling</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Extensions, Updos, & Draping</p>
            </div>
          </Link>

          <Link
            href="/artists?category=wedding-photography"
            className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl hover:border-amber-500/40 transition group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Wedding Photography</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Candid, Cinematic, & Traditional</p>
            </div>
          </Link>

          <Link
            href="/artists?category=party-makeup"
            className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl hover:border-amber-500/40 transition group space-y-3"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Party & Occasions</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Sangeet, Cocktail, & Receptions</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity List */}
      {recentBookings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-serif font-bold text-white tracking-wide">
              Recent Booking Requests
            </h2>
            <Link
              href="/user/bookings"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold transition"
            >
              View All ({stats.totalBookings}) →
            </Link>
          </div>

          <div className="bg-neutral-900/70 border border-neutral-800 rounded-2xl divide-y divide-neutral-800/80 overflow-hidden">
            {recentBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-900/90 transition"
              >
                <div className="flex items-center gap-3">
                  {b.artist?.user?.avatarUrl ? (
                    <img
                      src={b.artist.user.avatarUrl}
                      alt={b.artist.user.name}
                      className="w-10 h-10 rounded-xl object-cover border border-neutral-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 text-amber-300 flex items-center justify-center text-xs font-semibold">
                      {b.artist?.user?.name ? b.artist.user.name.charAt(0) : "A"}
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-white">
                      {b.artist?.user?.name || "Artist"}
                    </h4>
                    <p className="text-xs text-neutral-400">
                      {b.service?.category?.name || b.eventType || "Service"} •{" "}
                      {new Date(b.bookingDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      b.status === "COMPLETED"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : b.status === "ACCEPTED"
                        ? "bg-amber-500/20 text-amber-300"
                        : b.status === "REJECTED"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {b.status}
                  </span>

                  <Link
                    href="/user/bookings"
                    className="text-xs text-neutral-400 hover:text-white transition font-medium min-h-[44px] flex items-center"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
