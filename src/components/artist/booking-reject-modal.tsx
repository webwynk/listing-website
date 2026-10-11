"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle, Loader2, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingNumber: string;
  onConfirm: (reason: string) => Promise<void>;
}

const COMMON_REASONS = [
  "Already booked for this time slot",
  "Location is outside my service coverage radius",
  "Unavailable due to personal leave",
  "Advance booking notice period was too short",
];

export function BookingRejectModal({
  isOpen,
  onClose,
  bookingNumber,
  onConfirm,
}: BookingRejectModalProps) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !submitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason so the client is informed.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onConfirm(reason.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to decline booking.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!submitting) onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Ban className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900 leading-tight">
                Decline Booking #{bookingNumber}
              </h2>
              <p className="text-xs text-muted-foreground">
                Provide a reason for the client
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Reasons Chips */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              Common Explanations (Click to select)
            </label>
            <div className="space-y-1.5">
              {COMMON_REASONS.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full text-left text-xs p-2 rounded-lg border transition-all ${
                    reason === r
                      ? "border-[#eb7583] bg-[#fcf1ef] text-[#eb7583] font-medium"
                      : "border-border bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Reason Textarea */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              Custom Feedback / Reason *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Explain politely why you are unable to take this booking..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              className="flex min-h-[80px] w-full rounded-xl border border-[#e8e5e4] bg-white px-3.5 py-2.5 text-base md:text-sm text-[#1e1a19] placeholder:text-[#a09b9a] focus-visible:outline-none focus-visible:border-[#eb7583] focus-visible:ring-2 focus-visible:ring-[#fcdadb] disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-2xs leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !reason.trim()}
              className="bg-rose-600 hover:bg-rose-700 text-white min-h-[44px] shadow-xs flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Declining...</span>
                </>
              ) : (
                <span>Decline Inquiry</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
