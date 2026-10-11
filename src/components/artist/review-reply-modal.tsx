"use client";

import { useState, useEffect } from "react";
import { X, Star, MessageSquareQuote, Loader2, Sparkles, User } from "lucide-react";

export interface ReviewItem {
  id: string;
  rating: number;
  comment: string | null;
  photos: any;
  isApproved: boolean;
  artistReply: string | null;
  artistReplyAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  booking?: {
    id: string;
    bookingNumber: string;
    eventType: string | null;
    bookingDate: string;
    service?: {
      category?: {
        name: string;
      };
    };
  } | null;
}

interface ReviewReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  review: ReviewItem | null;
}

export function ReviewReplyModal({
  isOpen,
  onClose,
  onSuccess,
  review,
}: ReviewReplyModalProps) {
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (review) {
      setReply(review.artistReply || "");
    } else {
      setReply("");
    }
    setError(null);
  }, [review, isOpen]);

  if (!isOpen || !review) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmed = reply.trim();
    if (trimmed.length < 2) {
      setError("Reply must be at least 2 characters.");
      return;
    }
    if (trimmed.length > 1000) {
      setError("Reply cannot exceed 1000 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`/api/artist/reviews/${review?.id}/reply`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to post reply.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white tracking-wide">
                {review.artistReply ? "Edit Review Reply" : "Reply to Review"}
              </h2>
              <p className="text-xs text-neutral-400">
                Your response will be visible on your public portfolio page
              </p>
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
          <div className="mt-4 p-3 bg-red-950/40 border border-red-800/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Client Review Summary Card */}
        <div className="mt-5 p-4 bg-neutral-950/80 border border-neutral-800/80 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {review.user?.avatarUrl ? (
                <img
                  src={review.user.avatarUrl}
                  alt={review.user.name}
                  className="w-8 h-8 rounded-full object-cover border border-neutral-700"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-semibold text-amber-300">
                  {review.user?.name ? review.user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
              )}
              <div>
                <span className="text-sm font-semibold text-white block">
                  {review.user?.name || "Client"}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {review.booking?.eventType || review.booking?.service?.category?.name || "Service"} •{" "}
                  {new Date(review.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= review.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-neutral-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {review.comment && (
            <p className="text-xs text-neutral-300 italic border-l-2 border-amber-500/40 pl-3 py-1">
              &quot;{review.comment}&quot;
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Your Public Reply *
              </label>
              <span className="text-[11px] text-neutral-500">
                {reply.length}/1000
              </span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={1000}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Thank you so much! It was an absolute delight being part of your special event..."
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition"
            />
          </div>

          {/* Quick tips */}
          <div className="p-3 bg-neutral-950/40 border border-neutral-800/60 rounded-xl flex items-start gap-2.5 text-xs text-neutral-400">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Pro Tip: Courteous, professional responses build high trust with new prospective clients browsing your profile.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 rounded-xl text-sm font-medium transition min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || reply.trim().length < 2}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2 min-h-[44px]"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {review.artistReply ? "Update Reply" : "Post Reply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
