"use client";

import { Star, CheckCircle2, MessageSquare, Calendar, Image as ImageIcon } from "lucide-react";

export interface ReviewItem {
  id: string;
  rating: number;
  comment?: string | null;
  photos?: any;
  artistReply?: string | null;
  artistReplyAt?: string | Date | null;
  createdAt: string | Date;
  user: {
    id: string;
    name: string;
    avatarUrl?: string | null;
  };
  booking?: {
    eventType?: string | null;
    bookingDate?: string | Date | null;
  } | null;
}

interface ReviewsSectionProps {
  reviews: ReviewItem[];
  avgRating: number;
  totalReviews: number;
  ratingsBreakdown: Record<number, number>;
  artistName: string;
}

export function ReviewsSection({
  reviews,
  avgRating,
  totalReviews,
  ratingsBreakdown,
  artistName,
}: ReviewsSectionProps) {
  return (
    <div id="reviews" className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#eb7583] font-body mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#eb7583]" />
          <span>Client Voices</span>
        </div>
        <h2 className="font-title text-2xl sm:text-3xl font-medium text-[#1e1a19] tracking-tight">
          Client Reviews &amp; Experiences
        </h2>
        <p className="text-xs sm:text-[13px] text-[#6e6968] font-body mt-0.5">
          Verified testimonials from milestone brides, grooms, and celebratory hosts
        </p>
      </div>

      {/* Ratings Overview Card */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)] grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
        {/* Left: Overall Score */}
        <div className="flex flex-col items-center justify-center text-center space-y-2 md:border-r md:border-black/[0.06] md:pr-8">
          <div className="font-title text-5xl sm:text-6xl font-medium text-[#1e1a19] tracking-tight">
            {avgRating.toFixed(1)}
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(avgRating)
                    ? "fill-[#eb7583] text-[#eb7583]"
                    : "fill-[#f0edea] text-[#f0edea]"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-[#6e6968] font-body">
            Based on {totalReviews} verified reviews
          </p>
        </div>

        {/* Right: Star Distribution Bars (Spans 2 cols) */}
        <div className="md:col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingsBreakdown[star] || 0;
            const percentage =
              totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={star} className="flex items-center gap-3 text-xs font-body">
                <span className="w-8 text-[#5c5553] font-medium">
                  {star} ★
                </span>
                <div className="flex-1 h-2 rounded-full bg-[#f5f3f2] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#eb7583] to-[#c24e5c] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-[#8c8583] text-[11px]">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 rounded-[24px] bg-white border border-black/[0.06] text-[#8c8583] text-xs font-body">
            No client reviews posted yet. Be the first to leave a review after your booking!
          </div>
        ) : (
          reviews.map((review) => {
            const reviewPhotos = Array.isArray(review.photos)
              ? review.photos
              : [];

            return (
              <div
                key={review.id}
                className="p-6 sm:p-7 rounded-[26px] bg-white border border-black/[0.06] space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-[#fcf1ef] border border-[#fcdadb] overflow-hidden flex items-center justify-center text-xs font-bold text-[#eb7583] shrink-0 font-body">
                      {review.user.avatarUrl ? (
                        <img
                          src={review.user.avatarUrl}
                          alt={review.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        review.user.name.charAt(0).toUpperCase()
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#1e1a19] text-sm font-body">
                          {review.user.name}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#eb7583]" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#8c8583] font-body mt-0.5">
                        {review.booking?.eventType && (
                          <span>{review.booking.eventType}</span>
                        )}
                        <span>•</span>
                        <span>
                          {new Date(review.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < review.rating
                            ? "fill-[#eb7583] text-[#eb7583]"
                            : "fill-[#f0edea] text-[#f0edea]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                {review.comment && (
                  <p className="text-xs sm:text-[13px] text-[#5c5553] leading-relaxed font-body italic">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}

                {/* Photos if attached */}
                {reviewPhotos.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {reviewPhotos.map((photo: string, pIdx: number) => (
                      <div
                        key={pIdx}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#faf8f7] border border-black/[0.06] shadow-xs"
                      >
                        <img
                          src={photo}
                          alt="Review attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Artist Reply */}
                {review.artistReply && (
                  <div className="p-4 rounded-[20px] bg-[#faf8f7] border border-black/[0.05] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-[#eb7583] font-semibold font-body">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Response from {artistName}</span>
                    </div>
                    <p className="text-xs text-[#6e6968] leading-relaxed font-body">
                      {review.artistReply}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
