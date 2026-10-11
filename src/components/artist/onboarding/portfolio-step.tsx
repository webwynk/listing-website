"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowLeft, ArrowRight, Image as ImageIcon, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PortfolioItemData } from "@/lib/validations/onboarding";

interface PortfolioStepProps {
  portfolio: PortfolioItemData[];
  onNext: (portfolio: PortfolioItemData[]) => void;
  onBack: () => void;
}

export function PortfolioStep({
  portfolio: initialPortfolio,
  onNext,
  onBack,
}: PortfolioStepProps) {
  const [portfolioList, setPortfolioList] = useState<PortfolioItemData[]>(initialPortfolio);
  const [mediaUrl, setMediaUrl] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim()) {
      setError("Please provide a valid image URL.");
      return;
    }

    const newItem: PortfolioItemData = {
      mediaUrl: mediaUrl.trim(),
      thumbnailUrl: mediaUrl.trim(),
      mediaType: "IMAGE",
      title: title.trim() || null,
    };

    setPortfolioList([...portfolioList, newItem]);
    setMediaUrl("");
    setTitle("");
    setError(null);
  };

  const handleRemove = (idx: number) => {
    setPortfolioList(portfolioList.filter((_, i) => i !== idx));
  };

  const handleContinue = () => {
    if (portfolioList.length < 3) {
      setError(`Please add at least 3 portfolio images (currently ${portfolioList.length} added).`);
      return;
    }
    setError(null);
    onNext(portfolioList);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1e1a19]">
          Step 3: Portfolio Showcase
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Upload at least 3 high-resolution photos of your real client work and bridal looks.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Media Box */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
        <h3 className="font-semibold text-sm text-[#1e1a19]">Add Client Photo to Portfolio</h3>

        <form onSubmit={handleAddMedia} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Image Web URL *
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="pl-10 text-base md:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Look / Style Title (Optional)
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Royal Rajasthani Bride"
                className="text-base md:text-sm"
              />
            </div>
          </div>

          {/* Live Preview if URL entered */}
          {mediaUrl && (
            <div className="w-32 h-24 rounded-xl overflow-hidden border border-border bg-neutral-100">
              <img
                src={mediaUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl h-11 px-5 text-xs md:text-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Portfolio</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Gallery Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-[#1e1a19]">
            Portfolio Gallery ({portfolioList.length}/3 minimum)
          </h3>
          {portfolioList.length < 3 && (
            <span className="text-xs text-amber-600 font-medium">
              * Need {3 - portfolioList.length} more image{portfolioList.length === 2 ? "" : "s"}
            </span>
          )}
        </div>

        {portfolioList.length === 0 ? (
          <div className="p-8 bg-neutral-100/60 rounded-2xl border border-dashed border-neutral-300 text-center text-muted-foreground text-xs md:text-sm">
            No portfolio images added yet. Provide image URLs above to showcase your artistry.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {portfolioList.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-border bg-neutral-100 aspect-4/3 shadow-2xs"
              >
                <img
                  src={item.mediaUrl}
                  alt={item.title || "Portfolio look"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="self-end p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  {item.title && (
                    <p className="text-[11px] text-white font-medium truncate bg-black/50 px-2 py-1 rounded-md">
                      {item.title}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-xl h-12 px-6 border-border flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          className="bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl h-12 px-8 shadow-sm font-semibold flex items-center gap-2"
        >
          <span>Continue to Working Hours</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
