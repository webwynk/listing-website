"use client";

import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, AlertCircle, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BlockDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string | null;
  onSuccess: () => void;
}

export function BlockDateModal({
  isOpen,
  onClose,
  initialDate,
  onSuccess,
}: BlockDateModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isRange, setIsRange] = useState(false);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setStartDate(initialDate || today);
      setEndDate(initialDate || today);
      setIsRange(false);
      setNote("");
      setError(null);
    }
  }, [isOpen, initialDate]);

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
    if (!startDate) {
      setError("Please select a date to block.");
      return;
    }

    if (isRange && endDate && endDate < startDate) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/artist/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate,
          endDate: isRange && endDate ? endDate : null,
          note: note.trim() || null,
        }),
      });

      const json = await res.json();

      if (json.success) {
        onSuccess();
        onClose();
      } else {
        setError(json.message || "Failed to block selected dates.");
      }
    } catch {
      setError("A network error occurred. Please try again.");
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
            <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900 leading-tight">
                Block Dates
              </h2>
              <p className="text-xs text-muted-foreground">
                Mark dates as unavailable for client inquiries
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

          {/* Toggle Single Date vs Range */}
          <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl">
            <button
              type="button"
              onClick={() => setIsRange(false)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                !isRange ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Single Date
            </button>
            <button
              type="button"
              onClick={() => setIsRange(true)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all min-h-[36px] ${
                isRange ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              Date Range (Vacation)
            </button>
          </div>

          {/* Date Picker(s) */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
                {isRange ? "Start Date *" : "Date to Block *"}
              </label>
              <Input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-base md:text-sm"
              />
            </div>

            {isRange && (
              <div>
                <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
                  End Date *
                </label>
                <Input
                  type="date"
                  required
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-base md:text-sm"
                />
              </div>
            )}
          </div>

          {/* Note / Reason */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              Reason / Internal Note (Optional)
            </label>
            <Input
              type="text"
              placeholder="e.g. Booked offline, Out of town, Personal holiday"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              className="text-base md:text-sm"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Only you see this note. Clients will simply see the date as unavailable.
            </p>
          </div>

          {/* Actions */}
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
              disabled={submitting}
              className="bg-neutral-900 hover:bg-neutral-800 text-white min-h-[44px] shadow-xs flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Blocking...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Block {isRange ? "Dates" : "Date"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
