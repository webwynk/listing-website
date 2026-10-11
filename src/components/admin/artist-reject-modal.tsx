"use client";

import { useEffect, useState } from "react";
import { AlertCircle, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtistRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  artistName: string;
  businessName?: string | null;
}

export function ArtistRejectModal({
  isOpen,
  onClose,
  onConfirm,
  artistName,
  businessName,
}: ArtistRejectModalProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setReason("");
    setError(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (reason.trim().length < 5) {
      setError("Please provide a clear explanation (at least 5 characters).");
      return;
    }

    setLoading(true);
    try {
      await onConfirm(reason.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to submit rejection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 z-10 animate-in zoom-in-95 fade-in-0 duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-title text-xl font-bold text-gray-900 mb-1">
          Reject Artist Application
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Rejecting{" "}
          <span className="font-semibold text-gray-800">
            {businessName || artistName}
          </span>
          . Please explain what requirements were not met so they can update their application.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Reason for Rejection *
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. Portfolio images do not meet resolution standards. Please re-upload at least 5 high-resolution bridal photos."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
            />
            <span className="text-[11px] text-gray-400 mt-1 block">
              This reason will be automatically emailed to the artist.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl text-xs font-semibold px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl text-xs font-semibold px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-xs"
            >
              <span>{loading ? "Sending..." : "Reject & Send Email"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
