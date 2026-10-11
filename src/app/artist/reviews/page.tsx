"use client";

import { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  Sparkles,
  User,
  CheckCircle2,
  Clock,
  Filter,
  Image as ImageIcon,
  X,
  AlertCircle,
  MessageSquareQuote,
  TrendingUp,
} from "lucide-react";
import {
  ReviewReplyModal,
  ReviewItem,
} from "@/components/artist/review-reply-modal";

interface ReviewStats {
  totalReviews: number;
  avgRating: number;
  ratingDistribution: Record<number, number>;
  repliedCount: number;
  pendingReplyCount: number;
  responseRate: number;
}

export default function ArtistReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedRating, setSelectedRating] = useState<string>("ALL");
  const [replyFilter, setReplyFilter] = useState<"ALL" | "PENDING" | "REPLIED">("ALL");

  // Modal State
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);

  // Photo Lightbox
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  async function fetchReviews() {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedRating !== "ALL") {
        params.append("rating", selectedRating);
      }
      if (replyFilter !== "ALL") {
        params.append("replyStatus", replyFilter);
      }

      const res = await fetch(`/api/artist/reviews?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load reviews.");
      }

      setReviews(data.data.reviews || []);
      setStats(data.data.stats || null);
    } catch (err: any) {
      setError(err.message || "Failed to load reviews.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, [selectedRating, replyFilter]);

  function handleOpenReply(review: ReviewItem) {
    setSelectedReview(review);
    setIsReplyModalOpen(true);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
          <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
          Client Reviews & Reputation
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Monitor authenticated client ratings, customer photo showcases, and public feedback
        </p>
      </div>

      {/* Reputation KPI & Distribution Card */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 bg-neutral-900/80 border border-neutral-800 rounded-3xl">
          {/* Big Score Block */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center text-center p-6 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
              Overall Rating
            </span>
            <div className="mt-2 text-5xl sm:text-6xl font-serif font-bold text-amber-400">
              {stats.avgRating.toFixed(1)}
            </div>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(stats.avgRating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-neutral-700"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-400 mt-2">
              Based on {stats.totalReviews} verified client reviews
            </span>

            <div className="mt-4 pt-4 border-t border-neutral-800/80 w-full flex items-center justify-around text-xs">
              <div>
                <span className="text-neutral-400 block">Response Rate</span>
                <span className="text-sm font-semibold text-white">
                  {stats.responseRate}%
                </span>
              </div>
              <div className="w-[1px] h-6 bg-neutral-800" />
              <div>
                <span className="text-neutral-400 block">Awaiting Reply</span>
                <span className="text-sm font-semibold text-amber-400">
                  {stats.pendingReplyCount}
                </span>
              </div>
            </div>
          </div>

          {/* Rating Distribution Bars */}
          <div className="lg:col-span-8 flex flex-col justify-center space-y-2.5">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1 block">
              Rating Breakdown
            </span>
            {[5, 4, 3, 2, 1].map((ratingNum) => {
              const count = stats.ratingDistribution[ratingNum] || 0;
              const percentage =
                stats.totalReviews > 0
                  ? Math.round((count / stats.totalReviews) * 100)
                  : 0;

              return (
                <div key={ratingNum} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-neutral-300 font-medium flex items-center gap-1">
                    {ratingNum} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </span>
                  <div className="flex-1 h-3 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-16 text-right text-neutral-400">
                    {count} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-neutral-800">
        {/* Reply Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setReplyFilter("ALL")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition min-h-[44px] flex items-center ${
              replyFilter === "ALL"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
            }`}
          >
            All Feedback ({stats?.totalReviews || 0})
          </button>
          <button
            onClick={() => setReplyFilter("PENDING")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition min-h-[44px] flex items-center gap-1.5 ${
              replyFilter === "PENDING"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
            }`}
          >
            Needs Reply
            {stats && stats.pendingReplyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-neutral-950 font-bold">
                {stats.pendingReplyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setReplyFilter("REPLIED")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition min-h-[44px] flex items-center ${
              replyFilter === "REPLIED"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
            }`}
          >
            Replied ({stats?.repliedCount || 0})
          </button>
        </div>

        {/* Rating Filter Dropdown / Chips */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <span className="text-xs text-neutral-500">Stars:</span>
          {["ALL", "5", "4", "3"].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(star)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition min-h-[44px] flex items-center ${
                selectedRating === star
                  ? "bg-neutral-800 text-white border border-neutral-700 font-semibold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {star === "ALL" ? "All" : `${star}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-800" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-neutral-800 rounded" />
                  <div className="h-3 w-20 bg-neutral-800/60 rounded" />
                </div>
              </div>
              <div className="h-12 bg-neutral-800/40 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 bg-red-950/20 border border-red-800/40 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm text-red-300">{error}</p>
          <button
            onClick={fetchReviews}
            className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-xs font-medium hover:bg-neutral-700 min-h-[44px]"
          >
            Retry
          </button>
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-serif font-bold text-white">
              No reviews match this filter
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Client reviews will appear here once bookings are marked complete and clients submit verified reviews.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => {
            // Photos safely casted from JSON
            const reviewPhotos = Array.isArray(rev.photos)
              ? (rev.photos as string[])
              : [];

            return (
              <div
                key={rev.id}
                className="p-5 sm:p-6 bg-neutral-900/80 border border-neutral-800 rounded-2xl transition-all duration-200 hover:border-neutral-700 space-y-4"
              >
                {/* Review Header (STRICT LEAD PRIVACY: Client name and avatar only) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {rev.user?.avatarUrl ? (
                      <img
                        src={rev.user.avatarUrl}
                        alt={rev.user.name}
                        className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-sm font-semibold text-amber-300">
                        {rev.user?.name ? (
                          rev.user.name.charAt(0).toUpperCase()
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {rev.user?.name || "GlamBook Client"}
                      </h4>
                      <p className="text-xs text-neutral-400">
                        {rev.booking?.eventType ||
                          rev.booking?.service?.category?.name ||
                          "Completed Booking"}
                        {" • "}
                        {new Date(rev.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars & Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= rev.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-neutral-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      {rev.rating}.0
                    </span>
                  </div>
                </div>

                {/* Comment Body */}
                {rev.comment && (
                  <p className="text-sm text-neutral-200 leading-relaxed font-sans">
                    {rev.comment}
                  </p>
                )}

                {/* Client Photos Showcase */}
                {reviewPhotos.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
                      Client Event Photos ({reviewPhotos.length})
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {reviewPhotos.map((photoUrl, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setPreviewPhoto(photoUrl)}
                          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-neutral-700 hover:border-amber-400 transition group cursor-pointer"
                        >
                          <img
                            src={photoUrl}
                            alt={`Photo ${pIdx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Artist Public Response Block */}
                <div className="pt-3 border-t border-neutral-800/80">
                  {rev.artistReply ? (
                    <div className="p-4 bg-neutral-950/70 border border-amber-500/20 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageSquareQuote className="w-4 h-4 text-amber-400" />
                          <span className="text-xs font-semibold text-amber-300">
                            Your Public Response
                          </span>
                          {rev.artistReplyAt && (
                            <span className="text-[11px] text-neutral-500">
                              •{" "}
                              {new Date(rev.artistReplyAt).toLocaleDateString(
                                undefined,
                                {
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleOpenReply(rev)}
                          className="text-xs text-neutral-400 hover:text-amber-400 font-medium transition min-h-[44px] flex items-center"
                        >
                          Edit Reply
                        </button>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed italic">
                        &quot;{rev.artistReply}&quot;
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400 italic">
                        No reply posted yet.
                      </span>
                      <button
                        onClick={() => handleOpenReply(rev)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-xl transition min-h-[44px]"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Reply to Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Reply Modal */}
      <ReviewReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        onSuccess={fetchReviews}
        review={selectedReview}
      />

      {/* Photo Lightbox Dialog */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative max-w-2xl w-full max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white rounded-full bg-neutral-800/80 hover:bg-neutral-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close photo preview"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewPhoto}
              alt="Client review photo preview"
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-neutral-800"
            />
          </div>
        </div>
      )}
    </div>
  );
}
