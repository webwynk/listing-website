"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, AlertCircle, Sparkles, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PortfolioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Array<{ id: string; name: string }>;
  onSuccess: (newItem: any) => void;
}

export function PortfolioUploadModal({
  isOpen,
  onClose,
  categories,
  onSuccess,
}: PortfolioUploadModalProps) {
  const [mediaUrl, setMediaUrl] = useState("");
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMediaUrl("");
      setTitle("");
      setCategoryId(categories.length > 0 ? categories[0].id : "");
      setError(null);
    }
  }, [isOpen, categories]);

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
    if (!mediaUrl.trim()) {
      setError("Please provide an image URL.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/artist/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaUrl: mediaUrl.trim(),
          title: title.trim() || null,
          categoryId: categoryId || null,
          mediaType: "IMAGE",
        }),
      });

      const json = await res.json();

      if (json.success && json.data) {
        onSuccess(json.data);
        onClose();
      } else {
        setError(json.message || "Failed to add portfolio image.");
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

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center font-bold">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900 leading-tight">
                Add Portfolio Photo
              </h2>
              <p className="text-xs text-muted-foreground">
                Showcase your bridal and beauty artistry
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Media URL */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              Image URL *
            </label>
            <Input
              type="url"
              required
              placeholder="https://images.unsplash.com/photo-..."
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="text-base md:text-sm"
              autoFocus
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Provide a direct, high-resolution photo link.
            </p>
          </div>

          {/* Image Preview Box */}
          {mediaUrl && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700">
                Live Preview
              </label>
              <div className="w-full h-44 rounded-xl border border-border bg-neutral-100 overflow-hidden relative flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            </div>
          )}

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              Category Tag
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-[#e8e5e4] bg-white px-3.5 py-2 text-base md:text-sm text-[#1e1a19] focus-visible:outline-none focus-visible:border-[#eb7583] focus-visible:ring-2 focus-visible:ring-[#fcdadb] transition-colors shadow-2xs min-h-[44px]"
            >
              <option value="">General / Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title / Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              Caption / Title (Optional)
            </label>
            <Input
              type="text"
              placeholder="e.g. Royal Bridal Glam with Kundan Jewelry"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="text-base md:text-sm"
            />
          </div>

          {/* Action Buttons */}
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
              disabled={submitting || !mediaUrl.trim()}
              className="bg-[#eb7583] hover:bg-[#d66573] text-white min-h-[44px] shadow-xs flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding Photo...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Portfolio</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
