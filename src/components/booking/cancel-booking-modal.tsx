"use client";

import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  booking: {
    id: string;
    bookingNumber: string;
    artist?: {
      user?: {
        name?: string;
      };
    };
  } | null;
}

const COMMON_REASONS = [
  "Event rescheduled / date changed",
  "Event cancelled",
  "Budget constraints",
  "Found an alternative artist",
  "Other reason",
];

export function CancelBookingModal({
  isOpen,
  onClose,
  onSuccess,
  booking,
}: CancelBookingModalProps) {
  const [selectedReason, setSelectedReason] = useState(COMMON_REASONS[0]);
  const [customNotes, setCustomNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  async function handleConfirmCancel() {
    setIsLoading(true);
    setError(null);

    const fullReason =
      selectedReason === "Other reason" && customNotes.trim()
        ? customNotes.trim()
        : selectedReason;

    try {
      const res = await fetch(`/api/user/bookings/${booking?.id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: fullReason }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to cancel booking.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to cancel booking.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Cancel Booking Request
              </h3>
              <span className="text-xs text-neutral-400">
                Ref: {booking.bookingNumber}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-xs text-neutral-300 leading-relaxed">
            Are you sure you want to cancel your booking inquiry with{" "}
            <span className="text-white font-semibold">
              {booking.artist?.user?.name || "the artist"}
            </span>
            ? The artist will be informed immediately.
          </p>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Reason for Cancellation
            </label>
            <div className="space-y-2">
              {COMMON_REASONS.map((r) => (
                <label
                  key={r}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition min-h-[44px] ${
                    selectedReason === r
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-300 font-medium"
                      : "bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    checked={selectedReason === r}
                    onChange={() => setSelectedReason(r)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedReason === r
                        ? "border-amber-400 bg-amber-400/20"
                        : "border-neutral-700"
                    }`}
                  >
                    {selectedReason === r && (
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    )}
                  </div>
                  <span>{r}</span>
                </label>
              ))}
            </div>
          </div>

          {selectedReason === "Other reason" && (
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                Please specify
              </label>
              <textarea
                rows={2}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Share brief context for the cancellation..."
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition"
              />
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 rounded-xl transition min-h-[44px]"
          >
            Keep Booking
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleConfirmCancel}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 flex items-center gap-1.5 min-h-[44px]"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  );
}
