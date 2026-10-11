"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Maximize2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PortfolioUploadModal } from "@/components/artist/portfolio-upload-modal";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { cn } from "@/lib/utils";

interface PortfolioItem {
  id: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  mediaType: string;
  title: string | null;
  categoryId: string | null;
  sortOrder: number;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

export default function ArtistPortfolioPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(null);
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    async function loadPortfolio() {
      try {
        setLoading(true);
        const res = await fetch("/api/artist/portfolio");
        const json = await res.json();

        if (json.success && json.data) {
          setItems(json.data.items || []);
          setCategories(json.data.categories || []);
        }
      } catch (err) {
        console.error("Failed to load portfolio:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPortfolio();
  }, []);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (selectedCategory === "ALL") return items;
    return items.filter((item) => item.categoryId === selectedCategory);
  }, [items, selectedCategory]);

  // Reorder Item: swap with previous or next
  async function handleMove(index: number, direction: "prev" | "next") {
    const targetIndex = direction === "prev" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Update sortOrder values
    const payloadItems = newItems.map((item, idx) => ({
      id: item.id,
      sortOrder: idx,
    }));

    setItems(
      newItems.map((item, idx) => ({
        ...item,
        sortOrder: idx,
      }))
    );

    try {
      setReordering(true);
      await fetch("/api/artist/portfolio/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payloadItems }),
      });
    } catch (err) {
      console.error("Failed to persist portfolio order:", err);
    } finally {
      setReordering(false);
    }
  }

  // Delete Portfolio Item
  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    const res = await fetch(`/api/artist/portfolio/${deleteTarget.id}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to delete portfolio photo.");
    }

    setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function handleAddSuccess(newItem: PortfolioItem) {
    setItems((prev) => [...prev, newItem]);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-md bg-neutral-200/70" />
        <div className="h-12 w-full rounded-xl animate-pulse bg-neutral-200/70" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="aspect-[4/5] rounded-2xl animate-pulse bg-neutral-200/70" />
          ))}
        </div>
      </div>
    );
  }

  const isMinMet = items.length >= 3;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900">
            Portfolio Gallery
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Showcase your bridal and beauty transformations. Profiles with 3+ high-quality photos receive 4x more booking leads.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isMinMet ? (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 py-1 px-3 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{items.length} Photos Uploaded</span>
            </Badge>
          ) : (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5 py-1 px-3 text-xs">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Minimum 3 photos required ({items.length}/3)</span>
            </Badge>
          )}

          <Button
            onClick={() => setUploadModalOpen(true)}
            className="bg-[#eb7583] hover:bg-[#d66573] text-white shadow-xs min-h-[44px] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photos</span>
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/60">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[40px] flex items-center gap-2",
            selectedCategory === "ALL"
              ? "bg-[#1e1a19] text-white shadow-xs"
              : "bg-white text-neutral-600 hover:text-neutral-900 border border-border"
          )}
        >
          <span>All Photos</span>
          <span
            className={cn(
              "px-1.5 py-0.5 rounded-full text-[10px]",
              selectedCategory === "ALL"
                ? "bg-white/20 text-white"
                : "bg-neutral-100 text-neutral-600"
            )}
          >
            {items.length}
          </span>
        </button>

        {categories.map((cat) => {
          const count = items.filter((i) => i.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[40px] flex items-center gap-2",
                selectedCategory === cat.id
                  ? "bg-[#1e1a19] text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:text-neutral-900 border border-border"
              )}
            >
              <span>{cat.name}</span>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px]",
                  selectedCategory === cat.id
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-600"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Media Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-border p-12 text-center max-w-lg mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center mx-auto">
            <ImageIcon className="w-7 h-7" />
          </div>
          <h2 className="text-base font-semibold text-neutral-900">
            {selectedCategory === "ALL"
              ? "Your Portfolio is Currently Empty"
              : "No photos in this category"}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload professional photos of your bridal looks, hairstyles, and editorial makeup to impress clients.
          </p>
          <Button
            onClick={() => setUploadModalOpen(true)}
            className="bg-[#eb7583] hover:bg-[#d66573] text-white min-h-[44px] shadow-xs mt-2"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Upload First Photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filteredItems.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === items.length - 1;

            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-2xl overflow-hidden border border-border/80 shadow-2xs hover:shadow-md transition-all flex flex-col"
              >
                {/* Image Container */}
                <div className="aspect-[4/5] w-full relative bg-neutral-100 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.mediaUrl}
                    alt={item.title || "Portfolio photo"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Gradient Overlay for Titles */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none" />

                  {/* Category Pill Tag */}
                  {item.category && (
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="text-[10px] font-semibold tracking-wider text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full uppercase border border-white/20">
                        {item.category.name}
                      </span>
                    </div>
                  )}

                  {/* Sequence Position */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="text-[10px] font-bold text-white bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Caption Title */}
                  {item.title && (
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
                      <p className="text-xs font-medium text-white truncate drop-shadow-xs">
                        {item.title}
                      </p>
                    </div>
                  )}

                  {/* Hover Quick Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-2xs z-20">
                    <button
                      onClick={() => setLightboxItem(item)}
                      className="p-2 rounded-full bg-white/90 text-neutral-800 hover:bg-white hover:text-black shadow-md min-h-[40px] min-w-[40px] flex items-center justify-center transition-all"
                      title="View full-size"
                      aria-label="View photo in lightbox"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-2 rounded-full bg-rose-600/90 text-white hover:bg-rose-600 shadow-md min-h-[40px] min-w-[40px] flex items-center justify-center transition-all"
                      title="Delete photo"
                      aria-label="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Sequence Reordering Controls */}
                <div className="p-2 bg-white border-t border-border flex items-center justify-between">
                  <button
                    disabled={isFirst || reordering}
                    onClick={() => handleMove(index, "prev")}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Move Earlier"
                    aria-label="Move earlier in sequence"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[11px] font-medium text-muted-foreground">
                    Order {index + 1}
                  </span>

                  <button
                    disabled={isLast || reordering}
                    onClick={() => handleMove(index, "next")}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                    title="Move Later"
                    aria-label="Move later in sequence"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <PortfolioUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        categories={categories}
        onSuccess={handleAddSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Portfolio Photo"
        description="Are you sure you want to remove this photo from your portfolio? It will immediately disappear from your public gallery."
        itemName={deleteTarget?.title || "Portfolio photo"}
      />

      {/* Lightbox Preview Modal */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setLightboxItem(null)}
          />
          <div className="relative max-w-3xl w-full max-h-[90vh] bg-neutral-950 rounded-2xl overflow-hidden z-10 flex flex-col items-center">
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 z-20 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close image preview"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxItem.mediaUrl}
              alt={lightboxItem.title || "Fullsize photo"}
              className="max-h-[75vh] w-auto object-contain"
            />
            {lightboxItem.title && (
              <div className="p-4 text-center text-white text-sm font-medium w-full bg-neutral-900 border-t border-neutral-800">
                {lightboxItem.title}
                {lightboxItem.category && (
                  <span className="text-xs text-[#eb7583] ml-2">
                    ({lightboxItem.category.name})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
