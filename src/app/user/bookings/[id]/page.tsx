"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Star,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ShieldCheck,
  MessageSquareQuote,
  Phone,
  Mail,
  Loader2,
  Sparkles,
} from "lucide-react";
import { CancelBookingModal } from "@/components/booking/cancel-booking-modal";
import { ClientReviewModal } from "@/components/booking/client-review-modal";

export default function UserBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [booking, setBooking] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  async function fetchBookingDetails() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/user/bookings/${id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load booking details.");
      setBooking(json.data.booking);
    } catch (err: any) {
      setError(err.message || "Failed to load booking details.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-12 text-center space-y-4 max-w-4xl mx-auto">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
        <p className="text-xs text-neutral-400">Loading booking dossier...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-8 bg-red-950/20 border border-red-800/40 rounded-3xl text-center space-y-4 max-w-xl mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-lg font-serif font-bold text-white">Booking Not Found</h2>
        <p className="text-xs text-red-300">{error || "Unable to locate this appointment."}</p>
        <Link
          href="/user/bookings"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(booking.bookingDate).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Back Navigation & Reference */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/user/bookings"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Bookings
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Booking Reference:</span>
          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
            {booking.bookingNumber}
          </span>
        </div>
      </div>

      {/* Booking Header Banner */}
      <div className="p-6 sm:p-8 bg-neutral-900/80 border border-neutral-800 rounded-3xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              Appointment Status
            </span>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  booking.status === "COMPLETED"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : booking.status === "ACCEPTED"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : booking.status === "REJECTED"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : booking.status === "CANCELLED"
                    ? "bg-neutral-800 text-neutral-400 border border-neutral-700"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                }`}
              >
                {booking.status === "ACCEPTED" ? "CONFIRMED" : booking.status}
              </span>
              <span className="text-xs text-neutral-400">
                Created on {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Quick Action (Review or Cancel) */}
          <div className="flex items-center gap-2">
            {booking.status === "COMPLETED" && !booking.review && (
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-xs transition shadow-md shadow-amber-500/10 min-h-[44px]"
              >
                <Star className="w-4 h-4 fill-neutral-950" />
                Write a Review
              </button>
            )}

            {(booking.status === "PENDING" || booking.status === "ACCEPTED") && (
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-800/80 hover:bg-red-950/30 hover:text-red-400 text-neutral-300 rounded-xl text-xs font-medium transition min-h-[44px]"
              >
                <XCircle className="w-4 h-4" />
                Cancel Inquiry
              </button>
            )}
          </div>
        </div>

        {/* Rejection / Cancellation Alert Banner */}
        {booking.rejectionReason && (
          <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-2xl space-y-1">
            <span className="text-xs font-semibold text-red-300 uppercase tracking-wider block">
              {booking.status === "CANCELLED" ? "Cancellation Reason" : "Decline Reason"}
            </span>
            <p className="text-xs text-red-200">{booking.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* Two Column Layout: Event Details & Artist Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Event Specifications (8 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 bg-neutral-900/70 border border-neutral-800 rounded-3xl space-y-4">
            <h2 className="text-base font-serif font-bold text-white tracking-wide">
              Event Details & Schedule
            </h2>

            <div className="space-y-3.5 text-xs divide-y divide-neutral-800/70">
              <div className="flex items-center justify-between pt-1">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  Scheduled Date:
                </span>
                <span className="text-white font-medium text-right">
                  {formattedDate}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Preferred Slot:
                </span>
                <span className="text-white font-medium text-right">
                  {booking.bookingTime || "To be coordinated"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Occasion Type:
                </span>
                <span className="text-white font-medium text-right">
                  {booking.eventType || "Special Event"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-amber-400" />
                  Party Size:
                </span>
                <span className="text-white font-medium text-right">
                  {booking.numberOfPeople} Person(s)
                </span>
              </div>

              <div className="flex items-start justify-between pt-3">
                <span className="text-neutral-400 flex items-center gap-1.5 shrink-0">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  Venue / Location:
                </span>
                <span className="text-white font-medium text-right max-w-[220px]">
                  {booking.eventLocation || "Not specified"}
                </span>
              </div>
            </div>

            {/* Special Requirements */}
            {booking.requirements && (
              <div className="pt-4 border-t border-neutral-800 space-y-1">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                  Styling Notes & Preferences
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800/80">
                  {booking.requirements}
                </p>
              </div>
            )}
          </div>

          {/* Review Showcase Section (If Submitted) */}
          {booking.review && (
            <div className="p-6 bg-neutral-900/70 border border-neutral-800 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-serif font-bold text-white tracking-wide">
                  Your Verified Review
                </h2>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= booking.review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-neutral-700"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-amber-400 ml-1">
                    {booking.review.rating}.0
                  </span>
                </div>
              </div>

              {booking.review.comment && (
                <p className="text-xs text-neutral-200 leading-relaxed italic bg-neutral-950/60 p-3.5 rounded-2xl border border-neutral-800/80">
                  &quot;{booking.review.comment}&quot;
                </p>
              )}

              {/* Artist Reply */}
              {booking.review.artistReply && (
                <div className="p-4 bg-neutral-950/80 border border-amber-500/20 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2">
                    <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-semibold text-amber-300">
                      Response from {booking.artist?.user?.name}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300 italic pl-6">
                    &quot;{booking.review.artistReply}&quot;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Artist Dossier & Direct Coordination (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 bg-neutral-900/70 border border-neutral-800 rounded-3xl space-y-5">
            <h2 className="text-base font-serif font-bold text-white tracking-wide">
              Artist Dossier
            </h2>

            <div className="flex items-center gap-3.5 pb-4 border-b border-neutral-800/80">
              {booking.artist?.user?.avatarUrl ? (
                <img
                  src={booking.artist.user.avatarUrl}
                  alt={booking.artist.user.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-amber-500/30 shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-amber-500/20 text-amber-300 flex items-center justify-center text-lg font-bold shrink-0">
                  {booking.artist?.user?.name ? booking.artist.user.name.charAt(0) : "A"}
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-white">
                  {booking.artist?.user?.name}
                </h3>
                {booking.artist?.user?.locationCity && (
                  <span className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-neutral-500" />
                    {booking.artist.user.locationCity}
                  </span>
                )}
              </div>
            </div>

            {/* Direct Model Pill */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Zero Commission Booking</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-normal">
                GlamBook guarantees zero booking fees or platform commissions. All quotes, scheduling, and trials are coordinated directly with the artist.
              </p>
            </div>

            {/* Artist Direct Contact Details (When Confirmed) */}
            {booking.status === "ACCEPTED" && (
              <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-2xl space-y-2 text-xs">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  Artist Direct Contact
                </span>
                {booking.artist?.user?.phone && (
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{booking.artist.user.phone}</span>
                  </div>
                )}
                {booking.artist?.user?.email && (
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{booking.artist.user.email}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onSuccess={fetchBookingDetails}
        booking={booking}
      />

      <ClientReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={fetchBookingDetails}
        booking={booking}
      />
    </div>
  );
}
