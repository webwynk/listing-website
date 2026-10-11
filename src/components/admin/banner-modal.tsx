"use client";

import { useEffect, useState } from "react";
import { X, Image as ImageIcon, Link as LinkIcon, Calendar, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BannerPosition } from "@/types";

export interface BannerFormData {
  id?: string;
  title?: string | null;
  subtitle?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  position: BannerPosition;
  sortOrder: number;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
}

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BannerFormData) => Promise<void>;
  initialData?: BannerFormData | null;
}

export function BannerModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: BannerModalProps) {
  const isEditing = Boolean(initialData?.id);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [position, setPosition] = useState<BannerPosition>("HOME_HERO");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSubtitle(initialData.subtitle || "");
      setImageUrl(initialData.imageUrl || "");
      setLinkUrl(initialData.linkUrl || "");
      setPosition(initialData.position || "HOME_HERO");
      setSortOrder(initialData.sortOrder ?? 0);
      setIsActive(initialData.isActive ?? true);
      setStartsAt(
        initialData.startsAt ? new Date(initialData.startsAt).toISOString().slice(0, 16) : ""
      );
      setEndsAt(
        initialData.endsAt ? new Date(initialData.endsAt).toISOString().slice(0, 16) : ""
      );
    } else {
      setTitle("");
      setSubtitle("");
      setImageUrl("");
      setLinkUrl("");
      setPosition("HOME_HERO");
      setSortOrder(0);
      setIsActive(true);
      setStartsAt("");
      setEndsAt("");
    }
    setError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      setError("Please provide an image URL for the banner.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSubmit({
        id: initialData?.id,
        title: title.trim() || null,
        subtitle: subtitle.trim() || null,
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl.trim() || null,
        position,
        sortOrder: Number(sortOrder) || 0,
        isActive,
        startsAt: startsAt ? new Date(startsAt).toISOString() : null,
        endsAt: endsAt ? new Date(endsAt).toISOString() : null,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save banner.");
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
              {isEditing ? "Edit Promotional Banner" : "Create New Banner"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Promote campaigns, seasonal discounts, and featured spotlights
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

          {/* Position Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
              Banner Position *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  { id: "HOME_HERO", label: "Home Hero" },
                  { id: "HOME_MIDDLE", label: "Home Middle" },
                  { id: "FIND_ARTIST_TOP", label: "Find Artist" },
                ] as const
              ).map((pos) => (
                <button
                  key={pos.id}
                  type="button"
                  onClick={() => setPosition(pos.id)}
                  className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center ${
                    position === pos.id
                      ? "border-[#eb7583] bg-[#fcf1ef] text-[#eb7583] font-semibold shadow-xs"
                      : "border-border text-muted-foreground hover:bg-neutral-50"
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image URL & Live Preview */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
              Banner Image URL *
            </label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="pl-9 text-base md:text-sm"
                required
              />
            </div>
            {imageUrl && (
              <div className="mt-2 relative rounded-xl overflow-hidden border border-border h-32 bg-neutral-100 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Headline / Title (Optional)
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Special Wedding Season Discount"
                className="text-base md:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Subtitle / Offer Tagline (Optional)
              </label>
              <Input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Book now and enjoy exclusive pre-bridal perks"
                className="text-base md:text-sm"
              />
            </div>
          </div>

          {/* Target Link URL */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
              Target Link URL (Optional)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://glambook.com/artists?category=makeup-artist"
                className="pl-9 text-base md:text-sm"
              />
            </div>
          </div>

          {/* Sort Order & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Sort Order
              </label>
              <Input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="text-base md:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Starts At
              </label>
              <Input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Ends At
              </label>
              <Input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Active Status Toggle */}
          <div className="pt-2 flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
            <div>
              <p className="text-sm font-medium text-[#1e1a19]">Active Status</p>
              <p className="text-xs text-muted-foreground">
                Display this banner on the live public website
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

          {/* Footer Actions */}
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
                  <span>{isEditing ? "Update Banner" : "Create Banner"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
