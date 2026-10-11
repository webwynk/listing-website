"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Star,
  FileText,
  Loader2,
  Check,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";

export interface BookingLeadItem {
  id: string;
  bookingNumber: string;
  userName: string;
  bookingDate: string;
  bookingTime: string | null;
  eventType: string | null;
  eventLocation: string | null;
  requirements: string | null;
  numberOfPeople: number;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "REJECTED" | "CANCELLED";
  rejectionReason: string | null;
  createdAt: string;
  user?: {
    avatarUrl: string | null;
  } | null;
  service?: {
    id: string;
    priceType: string;
    priceFrom: number;
    priceTo: number | null;
    category?: { id: string; name: string } | null;
    subCategory?: { id: string; name: string } | null;
  } | null;
  review?: {
    id: string;
    rating: number;
    comment: string | null;
  } | null;
}

interface BookingCardProps {
  booking: BookingLeadItem;
  onAccept: (id: string) => Promise<void>;
  onOpenReject: (booking: BookingLeadItem) => void;
  onComplete: (id: string) => Promise<void>;
}

export function BookingCard({
  booking,
  onAccept,
  onOpenReject,
  onComplete,
}: BookingCardProps) {
  const [acting, setActing] = useState(false);

  async function handleAcceptClick() {
    try {
      setActing(true);
      await onAccept(booking.id);
    } finally {
      setActing(false);
    }
  }

  async function handleCompleteClick() {
    try {
      setActing(true);
      await onComplete(booking.id);
    } finally {
      setActing(false);
    }
  }

  const serviceTitle =
    booking.service?.subCategory?.name ||
    booking.service?.category?.name ||
    "Beauty Package";

  return (
    <div
      className={cn(
        "bg-white rounded-2xl border p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between relative",
        booking.status === "PENDING" && "border-amber-300/80 bg-amber-50/10",
        booking.status === "ACCEPTED" && "border-emerald-200/80",
        booking.status === "COMPLETED" && "border-border/80",
        booking.status === "REJECTED" && "border-neutral-200 bg-neutral-50/50 opacity-80",
        booking.status === "CANCELLED" && "border-neutral-200 bg-neutral-50/50 opacity-70"
      )}
    >
      <div>
        {/* Top Header: Client & Booking number & Status Badge */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/60">
          <div className="flex items-center gap-3">
            {booking.user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={booking.user.avatarUrl}
                alt={booking.userName}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center font-bold text-sm shrink-0 border border-[#eb7583]/20">
                {booking.userName[0]?.toUpperCase() || "C"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-neutral-900">
                  {booking.userName}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">
                  #{booking.bookingNumber}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Requested on {formatDate(booking.createdAt)}
              </p>
            </div>
          </div>

          <Badge
            className={cn(
              "text-xs px-2.5 py-0.5 capitalize",
              booking.status === "PENDING" && "bg-amber-50 text-amber-800 border-amber-200 font-semibold",
              booking.status === "ACCEPTED" && "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold",
              booking.status === "COMPLETED" && "bg-blue-50 text-blue-800 border-blue-200 font-semibold",
              booking.status === "REJECTED" && "bg-rose-50 text-rose-800 border-rose-200",
              booking.status === "CANCELLED" && "bg-neutral-100 text-neutral-700 border-neutral-200"
            )}
          >
            {booking.status.toLowerCase()}
          </Badge>
        </div>

        {/* Middle: Service & Event Details */}
        <div className="py-3.5 space-y-2.5 text-xs text-neutral-700">
          {/* Requested Service */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 font-medium text-neutral-900">
              <Sparkles className="w-4 h-4 text-[#eb7583] shrink-0" />
              <span>{serviceTitle}</span>
            </div>
            {booking.service && (
              <span className="font-bold text-neutral-900">
                ₹{booking.service.priceFrom.toLocaleString("en-IN")}
                {booking.service.priceType === "RANGE" && booking.service.priceTo
                  ? ` – ₹${booking.service.priceTo.toLocaleString("en-IN")}`
                  : booking.service.priceType === "STARTING_FROM"
                  ? " (Starting)"
                  : ""}
              </span>
            )}
          </div>

          {/* Event Specs Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span>
                {formatDate(booking.bookingDate)}
                {booking.bookingTime ? ` at ${booking.bookingTime}` : ""}
              </span>
            </div>

            {booking.eventType && (
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>{booking.eventType}</span>
              </div>
            )}

            {booking.eventLocation && (
              <div className="flex items-center gap-1.5 sm:col-span-2">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span className="truncate">{booking.eventLocation}</span>
              </div>
            )}

            {booking.numberOfPeople > 1 && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>{booking.numberOfPeople} People</span>
              </div>
            )}
          </div>

          {/* Client Requirements / Notes */}
          {booking.requirements && (
            <div className="p-2.5 bg-neutral-50 border border-border/80 rounded-xl text-neutral-800 text-[11px] leading-relaxed">
              <span className="font-semibold text-neutral-900 block mb-0.5">
                Client Notes:
              </span>
              &ldquo;{booking.requirements}&rdquo;
            </div>
          )}

          {/* Rejection Feedback Note if rejected */}
          {booking.status === "REJECTED" && booking.rejectionReason && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-950 text-[11px] leading-relaxed">
              <span className="font-semibold text-rose-900 block mb-0.5">
                Decline Reason:
              </span>
              &ldquo;{booking.rejectionReason}&rdquo;
            </div>
          )}

          {/* Review Quote if completed & reviewed */}
          {booking.review && (
            <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950 text-[11px] space-y-1">
              <div className="flex items-center gap-1 font-bold text-amber-900">
                <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                <span>{booking.review.rating} / 5.0 Verified Review</span>
              </div>
              {booking.review.comment && (
                <p className="italic text-amber-900/90">&ldquo;{booking.review.comment}&rdquo;</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2.5">
        {booking.status === "PENDING" && (
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={acting}
              onClick={() => onOpenReject(booking)}
              className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50 min-h-[38px] flex items-center gap-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Decline</span>
            </Button>

            <Button
              size="sm"
              disabled={acting}
              onClick={handleAcceptClick}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs min-h-[38px] shadow-xs flex items-center gap-1.5"
            >
              {acting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Accept Inquiry</span>
            </Button>
          </>
        )}

        {booking.status === "ACCEPTED" && (
          <Button
            size="sm"
            disabled={acting}
            onClick={handleCompleteClick}
            className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs min-h-[38px] shadow-xs flex items-center gap-1.5"
          >
            {acting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Mark Completed</span>
          </Button>
        )}

        {booking.status === "COMPLETED" && !booking.review && (
          <span className="text-[11px] text-muted-foreground italic">
            Completed • Awaiting Client Review
          </span>
        )}
      </div>
    </div>
  );
}
