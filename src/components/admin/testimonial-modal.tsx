"use client";

import { useEffect, useState } from "react";
import { X, Star, User, MapPin, Tag, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface TestimonialFormData {
  id?: string;
  clientName: string;
  clientRole?: string | null;
  clientLocation?: string | null;
  avatarUrl?: string | null;
  rating: number;
  reviewText: string;
  serviceCategory?: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TestimonialFormData) => Promise<void>;
  initialData?: TestimonialFormData | null;
}

export function TestimonialModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: TestimonialModalProps) {
  const isEditing = Boolean(initialData?.id);
  const [clientName, setClientName] = useState("");
  const [clientRole, setClientRole] = useState("");
  const [clientLocation, setClientLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setClientName(initialData.clientName || "");
      setClientRole(initialData.clientRole || "");
      setClientLocation(initialData.clientLocation || "");
      setAvatarUrl(initialData.avatarUrl || "");
      setRating(initialData.rating || 5);
      setReviewText(initialData.reviewText || "");
      setServiceCategory(initialData.serviceCategory || "");
      setIsActive(initialData.isActive ?? true);
      setSortOrder(initialData.sortOrder ?? 0);
    } else {
      setClientName("");
      setClientRole("");
      setClientLocation("");
      setAvatarUrl("");
      setRating(5);
      setReviewText("");
      setServiceCategory("");
      setIsActive(true);
      setSortOrder(0);
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setError("Please provide the client name.");
      return;
    }
    if (!reviewText.trim() || reviewText.trim().length < 10) {
      setError("Please provide a testimonial quote of at least 10 characters.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        id: initialData?.id,
        clientName: clientName.trim(),
        clientRole: clientRole.trim() || null,
        clientLocation: clientLocation.trim() || null,
        avatarUrl: avatarUrl.trim() || null,
        rating,
        reviewText: reviewText.trim(),
        serviceCategory: serviceCategory.trim() || null,
        isActive,
        sortOrder: Number(sortOrder) || 0,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save testimonial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1e1a19]">
              {isEditing ? "Edit Client Testimonial" : "Add Client Testimonial"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Highlight authentic client experiences and wedding stories
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-[#1e1a19] rounded-full hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Client Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Client Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="pl-9 text-base md:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Role / Occasion
              </label>
              <Input
                type="text"
                value={clientRole}
                onChange={(e) => setClientRole(e.target.value)}
                placeholder="e.g. Bridal Client"
                className="text-base md:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Location City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={clientLocation}
                  onChange={(e) => setClientLocation(e.target.value)}
                  placeholder="e.g. Bandra, Mumbai"
                  className="pl-9 text-base md:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Service Category
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  placeholder="e.g. Bridal Makeup"
                  className="pl-9 text-base md:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Star Rating Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
              Rating (1 to 5 Stars) *
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1.5 hover:scale-110 transition-transform focus:outline-hidden"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-neutral-300"
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm font-semibold text-neutral-700 ml-2">
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Review Quote */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
              Testimonial Quote *
            </label>
            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write the client's experience and words here..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-input focus:border-[#eb7583] focus:ring-1 focus:ring-[#eb7583] outline-hidden text-base md:text-sm leading-relaxed resize-none"
              required
            />
          </div>

          {/* Avatar URL & Preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
              Client Avatar URL (Optional)
            </label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-border overflow-hidden bg-neutral-100 shrink-0 flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <User className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <Input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="text-base md:text-sm"
              />
            </div>
          </div>

          {/* Sort Order */}
          <div className="w-full">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
              Display Sort Order
            </label>
            <Input
              type="number"
              min={0}
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="text-base md:text-sm"
            />
          </div>

          {/* Active Status */}
          <div className="pt-2 flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
            <div>
              <p className="text-sm font-medium text-[#1e1a19]">Show on Public Home</p>
              <p className="text-xs text-muted-foreground">
                Display in the testimonials carousel on the homepage
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#eb7583]"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl px-5 h-11"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl px-6 h-11 shadow-sm flex items-center gap-2"
            >
              {loading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? "Update Testimonial" : "Add Testimonial"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
