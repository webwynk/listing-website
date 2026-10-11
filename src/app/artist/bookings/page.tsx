"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Inbox,
  Search,
  RotateCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookingCard, BookingLeadItem } from "@/components/artist/booking-card";
import { BookingRejectModal } from "@/components/artist/booking-reject-modal";
import { cn } from "@/lib/utils";

interface Counts {
  all: number;
  pending: number;
  accepted: number;
  completed: number;
  rejected: number;
  cancelled: number;
}

export default function ArtistBookingsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState<BookingLeadItem[]>([]);
  const [counts, setCounts] = useState<Counts>({
    all: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0,
  });

  const [statusTab, setStatusTab] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [rejectModalTarget, setRejectModalTarget] = useState<BookingLeadItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    try {
      setRefreshing(true);
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (statusTab !== "ALL") params.set("status", statusTab);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/artist/bookings?${params.toString()}`);
      const json = await res.json();

      if (json.success && json.data) {
        setBookings(json.data.bookings || []);
        setCounts(json.data.counts || counts);
        setTotalPages(json.data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to load artist bookings:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, statusTab, search]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Handle Tab Change
  function handleTabChange(tab: string) {
    setStatusTab(tab);
    setPage(1);
  }

  // Handle Accept
  async function handleAccept(id: string) {
    try {
      const res = await fetch(`/api/artist/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" }),
      });
      const json = await res.json();
      if (json.success) {
        setToastMessage("Inquiry accepted! The client has been notified.");
        loadBookings();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error("Accept failed:", err);
    }
  }

  // Handle Complete
  async function handleComplete(id: string) {
    try {
      const res = await fetch(`/api/artist/bookings/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });
      const json = await res.json();
      if (json.success) {
        setToastMessage("Booking marked completed! Client review link unlocked.");
        loadBookings();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error("Complete failed:", err);
    }
  }

  // Handle Reject Confirmation
  async function handleRejectConfirm(reason: string) {
    if (!rejectModalTarget) return;

    const res = await fetch(`/api/artist/bookings/${rejectModalTarget.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "REJECTED", rejectionReason: reason }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to decline booking.");
    }

    setToastMessage("Inquiry declined.");
    loadBookings();
    setTimeout(() => setToastMessage(null), 4000);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900">
            Booking Inquiries & Leads
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Review event requirements, accept appointments, and coordinate client timelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 py-1 px-3 text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Lead Protection Active</span>
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={loadBookings}
            disabled={refreshing}
            className="text-xs min-h-[38px] flex items-center gap-1.5"
            title="Refresh bookings"
          >
            <RotateCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Toast Notification Bar */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/60">
        {[
          { id: "ALL", label: "All Inquiries", count: counts.all },
          { id: "PENDING", label: "Pending Requests", count: counts.pending },
          { id: "ACCEPTED", label: "Accepted / Upcoming", count: counts.accepted },
          { id: "COMPLETED", label: "Completed", count: counts.completed },
          { id: "REJECTED", label: "Declined", count: counts.rejected },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[40px] flex items-center gap-2",
              statusTab === tab.id
                ? "bg-[#1e1a19] text-white shadow-xs"
                : "bg-white text-neutral-600 hover:text-neutral-900 border border-border"
            )}
          >
            <span>{tab.label}</span>
            <span
              className={cn(
                "px-1.5 py-0.5 rounded-full text-[10px]",
                statusTab === tab.id
                  ? "bg-white/20 text-white"
                  : "bg-neutral-100 text-neutral-600"
              )}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by client name, booking #, or city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 text-base md:text-sm h-10"
          />
        </div>
      </div>

      {/* Bookings Feed or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-2xl animate-pulse bg-neutral-200/70" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-border p-12 text-center max-w-lg mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center mx-auto">
            <Inbox className="w-7 h-7" />
          </div>
          <h2 className="text-base font-semibold text-neutral-900">
            {statusTab === "ALL"
              ? "No Booking Inquiries Yet"
              : `No ${statusTab.toLowerCase()} inquiries found`}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {statusTab === "PENDING"
              ? "Great job! You have responded to all incoming client leads."
              : "As clients discover your profile in your service area, their booking inquiries will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onAccept={handleAccept}
              onOpenReject={(target) => setRejectModalTarget(target)}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="min-h-[38px] text-xs flex items-center gap-1.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </Button>

          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="min-h-[38px] text-xs flex items-center gap-1.5"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Decline Feedback Modal */}
      {rejectModalTarget && (
        <BookingRejectModal
          isOpen={Boolean(rejectModalTarget)}
          onClose={() => setRejectModalTarget(null)}
          bookingNumber={rejectModalTarget.bookingNumber}
          onConfirm={handleRejectConfirm}
        />
      )}
    </div>
  );
}
