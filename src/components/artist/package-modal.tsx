"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";

export interface PackageItem {
  id: string;
  name: string;
  description: string;
  price: number;
  durationHours: number | null;
  includedServices: string[];
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
}

interface PackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  packageData?: PackageItem | null;
}

export function PackageModal({
  isOpen,
  onClose,
  onSuccess,
  packageData,
}: PackageModalProps) {
  const isEditing = !!packageData;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [durationHours, setDurationHours] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [includedServices, setIncludedServices] = useState<string[]>([]);
  const [newServiceTag, setNewServiceTag] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (packageData) {
      setName(packageData.name || "");
      setDescription(packageData.description || "");
      setPrice(packageData.price != null ? packageData.price.toString() : "");
      setDurationHours(
        packageData.durationHours != null ? packageData.durationHours.toString() : ""
      );
      setImageUrl(packageData.imageUrl || "");
      setIsActive(packageData.isActive ?? true);
      const inc = Array.isArray(packageData.includedServices)
        ? packageData.includedServices
        : [];
      setIncludedServices(inc);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setDurationHours("");
      setImageUrl("");
      setIsActive(true);
      setIncludedServices([
        "HD Bridal Makeup",
        "Hairstyling & Extensions",
        "Saree / Dupatta Draping",
      ]);
    }
    setError(null);
  }, [packageData, isOpen]);

  if (!isOpen) return null;

  function handleAddServiceTag() {
    const trimmed = newServiceTag.trim();
    if (!trimmed) return;
    if (includedServices.includes(trimmed)) {
      setNewServiceTag("");
      return;
    }
    setIncludedServices((prev) => [...prev, trimmed]);
    setNewServiceTag("");
  }

  function handleRemoveServiceTag(index: number) {
    setIncludedServices((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setError("Please enter a valid price (₹0 or greater).");
      return;
    }

    if (includedServices.length === 0) {
      setError("Please add at least one included service or feature.");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: parsedPrice,
        durationHours: durationHours ? parseFloat(durationHours) : null,
        imageUrl: imageUrl.trim() || null,
        includedServices,
        isActive,
      };

      const url = isEditing
        ? `/api/artist/packages/${packageData.id}`
        : `/api/artist/packages`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save package");
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
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-white tracking-wide">
                {isEditing ? "Edit Luxury Package" : "Create New Package"}
              </h2>
              <p className="text-xs text-neutral-400">
                Offer bundled signature services & all-inclusive pricing
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Package Name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Package Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Bridal Signature Package"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail what makes this bundle special, luxury cosmetics used, client preparation details..."
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition"
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Total Price (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="0"
                  step="100"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="25000"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Approx Duration (Hours)
              </label>
              <input
                type="number"
                min="0.5"
                max="48"
                step="0.5"
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                placeholder="e.g. 4.5"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
              />
            </div>
          </div>

          {/* Included Services Checklist / Tags */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Included Services & Inclusions *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newServiceTag}
                onChange={(e) => setNewServiceTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddServiceTag();
                  }
                }}
                placeholder="Add inclusion (e.g. Pre-Bridal Consultation)..."
                className="flex-1 px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
              />
              <button
                type="button"
                onClick={handleAddServiceTag}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition flex items-center gap-1.5 min-h-[44px]"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Inclusions Chips */}
            <div className="mt-3 flex flex-wrap gap-2">
              {includedServices.map((service, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium"
                >
                  {service}
                  <button
                    type="button"
                    onClick={() => handleRemoveServiceTag(index)}
                    className="hover:text-red-400 transition"
                    aria-label={`Remove ${service}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
              {includedServices.length === 0 && (
                <span className="text-xs text-neutral-500 italic">
                  No inclusions added yet. Type an inclusion above and press Add.
                </span>
              )}
            </div>
          </div>

          {/* Image URL (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
              Cover Image URL (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                <ImageIcon className="w-4 h-4" />
              </span>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
              />
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-3.5 bg-neutral-950/60 border border-neutral-800/80 rounded-xl">
            <div>
              <span className="text-sm font-medium text-white block">
                Active on Public Profile
              </span>
              <span className="text-xs text-neutral-400">
                Visible to clients seeking premium bookings
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 rounded-xl text-sm font-medium transition min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2 min-h-[44px]"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Publish Package"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
