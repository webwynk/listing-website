"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CalendarCheck,
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  Loader2,
  Sparkles,
  MessageSquare,
  XCircle,
  ArrowRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { CancelBookingModal } from "@/components/booking/cancel-booking-modal";
import { ClientReviewModal } from "@/components/booking/client-review-modal";

interface BookingItem {
  id: string;
  bookingNumber: string;
  bookingDate: string;
  bookingTime: string | null;
  eventType: string | null;
  eventLocation: string | null;
  numberOfPeople: number;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  artist: {
    id: string;
    user: {
      name: string;
      avatarUrl: string | null;
      locationCity: string | null;
      phone?: string | null;
      email?: string | null;
    };
  };
  service?: {
    category?: {
      name: string;
    };
  } | null;
  review?: {
    id: string;
    rating: number;
    comment: string | null;
    artistReply: string | null;
    artistReplyAt: string | null;
  } | null;
}

function UserBookingsContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "ALL";

  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({
    ALL: 0,
    PENDING: 0,
    ACCEPTED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    REJECTED: 0,
  });
  const [activeStatus, setActiveStatus] = useState<string>(initialStatus);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [cancellingBooking, setCancellingBooking] = useState<BookingItem | null>(null);
  const [reviewingBooking, setReviewingBooking] = useState<BookingItem | null>(null);

  async function fetchBookings() {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeStatus !== "ALL") params.append("status", activeStatus);
      if (searchQuery.trim()) params.append("search", searchQuery.trim());

      const res = await fetch(`/api/user/bookings?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Failed to load bookings.");

      setBookings(json.data.bookings || []);
      if (json.data.counts) setCounts(json.data.counts);
    } catch (err: any) {
      setError(err.message || "Failed to load bookings.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, [activeStatus, searchQuery]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <CalendarCheck className="w-7 h-7 text-amber-400" />
            My Bookings & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Track appointment requests, coordinate directly with artists, and share reviews
          </p>
        </div>

        <Link
          href="/artists"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 min-h-[44px]"
        >
          <Sparkles className="w-4 h-4" />
          Book Another Artist
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-neutral-800">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { key: "ALL", label: "All Inquiries", count: counts.ALL },
            { key: "PENDING", label: "Pending", count: counts.PENDING },
            { key: "ACCEPTED", label: "Confirmed", count: counts.ACCEPTED },
            { key: "COMPLETED", label: "Completed", count: counts.COMPLETED },
            { key: "CANCELLED", label: "Cancelled", count: counts.CANCELLED },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveStatus(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition min-h-[44px] flex items-center gap-1.5 whitespace-nowrap ${
                activeStatus === tab.key
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeStatus === tab.key
                      ? "bg-amber-500 text-neutral-950"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artist, booking ref..."
            className="w-full pl-10 pr-3.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-xs focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-3xl animate-pulse h-36"
            />
          ))}
        </div>
      ) : error ? (
        <div className="p-8 bg-red-950/20 border border-red-800/40 rounded-3xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-xs text-red-300">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-neutral-800 text-white rounded-xl text-xs font-semibold hover:bg-neutral-700 min-h-[44px]"
          >
            Retry
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <CalendarCheck className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-serif font-bold text-white">
              No bookings found
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              You haven&apos;t made any booking inquiries matching this filter.
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
        <div className="space-y-4">
          {bookings.map((b) => {
            const formattedDate = new Date(b.bookingDate).toLocaleDateString(
              undefined,
              {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );

            return (
              <div
                key={b.id}
                className="p-5 sm:p-6 bg-neutral-900/80 border border-neutral-800 rounded-3xl hover:border-neutral-700 transition flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg"
              >
                {/* Left: Artist & Service Details */}
                <div className="flex items-start sm:items-center gap-4">
                  {b.artist?.user?.avatarUrl ? (
                    <img
                      src={b.artist.user.avatarUrl}
                      alt={b.artist.user.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-amber-500/30 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-amber-500/20 text-amber-300 flex items-center justify-center text-lg font-bold shrink-0">
                      {b.artist?.user?.name ? b.artist.user.name.charAt(0) : "A"}
                    </div>
                  )}

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : b.status === "ACCEPTED"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : b.status === "REJECTED"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : b.status === "CANCELLED"
                            ? "bg-neutral-800 text-neutral-400 border border-neutral-700"
                            : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {b.status === "ACCEPTED" ? "CONFIRMED" : b.status}
                      </span>
                      <span className="text-xs text-neutral-500">
                        Ref: {b.bookingNumber}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                      {b.artist?.user?.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                      <span className="flex items-center gap-1 text-amber-300 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {formattedDate}
                      </span>
                      {b.bookingTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-neutral-500" />
                          {b.bookingTime}
                        </span>
                      )}
                      <span className="flex items-center gap-1 truncate max-w-[200px]">
                        <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        {b.eventLocation || "Venue"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-neutral-500" />
                        {b.numberOfPeople} Person(s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-end gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-800">
                  {/* Write Review Action (If Completed and not yet reviewed) */}
                  {b.status === "COMPLETED" && !b.review && (
                    <button
                      onClick={() => setReviewingBooking(b)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-xs transition shadow-md shadow-amber-500/10 min-h-[44px]"
                    >
                      <Star className="w-3.5 h-3.5 fill-neutral-950" />
                      Write a Review
                    </button>
                  )}

                  {/* Review Submitted Badge */}
                  {b.review && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-amber-300 min-h-[44px]">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{b.review.rating}.0 Rated</span>
                      {b.review.artistReply && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-medium">
                          Replied
                        </span>
                      )}
                    </div>
                  )}

                  {/* Cancel Request Action (If Pending or Accepted) */}
                  {(b.status === "PENDING" || b.status === "ACCEPTED") && (
                    <button
                      onClick={() => setCancellingBooking(b)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800/80 rounded-xl text-xs font-medium transition min-h-[44px]"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  )}

                  {/* View Full Dossier */}
                  <Link
                    href={`/user/bookings/${b.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-800/80 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition min-h-[44px]"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Modal */}
      <CancelBookingModal
        isOpen={!!cancellingBooking}
        onClose={() => setCancellingBooking(null)}
        onSuccess={fetchBookings}
        booking={cancellingBooking}
      />

      {/* Review Modal */}
      <ClientReviewModal
        isOpen={!!reviewingBooking}
        onClose={() => setReviewingBooking(null)}
        onSuccess={fetchBookings}
        booking={reviewingBooking}
      />
    </div>
  );
}

export default function UserBookingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
        </div>
      }
    >
      <UserBookingsContent />
    </Suspense>
  );
}
