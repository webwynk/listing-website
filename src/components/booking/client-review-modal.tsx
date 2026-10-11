"use client";

import { useState } from "react";
import { X, Star, Sparkles, Loader2, Plus, Image as ImageIcon } from "lucide-react";

interface ClientReviewModalProps {
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

const RATING_LABELS: Record<number, string> = {
  5: "Exceptional / Flawless Look! 🌟",
  4: "Very Good / Highly Recommended 👍",
  3: "Good / Satisfactory 😊",
  2: "Needs Improvement 😐",
  1: "Disappointing 😞",
};

export function ClientReviewModal({
  isOpen,
  onClose,
  onSuccess,
  booking,
}: ClientReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !booking) return null;

  function handleAddPhoto() {
    const trimmed = newPhotoUrl.trim();
    if (!trimmed) return;
    if (photos.includes(trimmed)) {
      setNewPhotoUrl("");
      return;
    }
    setPhotos((prev) => [...prev, trimmed]);
    setNewPhotoUrl("");
  }

  function handleRemovePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (rating < 1 || rating > 5) {
      setError("Please select a star rating between 1 and 5.");
      return;
    }

    if (comment.trim().length < 5) {
      setError("Please write at least a short 5-character comment about your experience.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking?.id,
          rating,
          comment: comment.trim(),
          photos: photos.length > 0 ? photos : undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit review.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  const activeRating = hoverRating || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                Review Your Experience
              </h3>
              <p className="text-xs text-neutral-400">
                Styling with {booking.artist?.user?.name || "the artist"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close review dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="space-y-5">
          {/* Interactive Star Rating */}
          <div className="text-center py-2 space-y-2 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-4">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              Tap to Rate
            </span>

            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none transition-transform hover:scale-125 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label={`${star} Stars`}
                >
                  <Star
                    className={`w-7 h-7 sm:w-8 sm:h-8 transition ${
                      star <= activeRating
                        ? "text-amber-400 fill-amber-400"
                        : "text-neutral-700"
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-amber-300 h-4">
              {RATING_LABELS[activeRating] || ""}
            </p>
          </div>

          {/* Comment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Detailed Feedback *
              </label>
              <span className="text-[11px] text-neutral-500">
                {comment.length}/1500
              </span>
            </div>
            <textarea
              required
              rows={4}
              maxLength={1500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the styling? Was the artist punctual, attentive, and gentle? What did you love about your look?"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition"
            />
          </div>

          {/* Optional Event Look Photos */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Event Look Photos (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... or image link"
                className="flex-1 px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium transition flex items-center gap-1.5 min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Photos preview chips */}
            {photos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2.5">
                {photos.map((pUrl, idx) => (
                  <div
                    key={idx}
                    className="relative w-14 h-14 rounded-xl overflow-hidden border border-neutral-700 group"
                  >
                    <img
                      src={pUrl}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      aria-label="Remove photo"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 rounded-xl text-xs font-medium transition min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || comment.trim().length < 5}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2 min-h-[44px]"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Publish Verified Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
