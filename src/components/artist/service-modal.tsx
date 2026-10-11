"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Sparkles, AlertCircle, IndianRupee, Clock, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ServiceFormData {
  id?: string;
  categoryId: string;
  subCategoryId?: string | null;
  priceType: "FIXED" | "STARTING_FROM" | "RANGE" | "NEGOTIABLE";
  priceFrom: number;
  priceTo?: number | null;
  durationMinutes: number;
  description?: string | null;
  isActive: boolean;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  subCategories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryOption[];
  initialData?: ServiceFormData | null;
  onSuccess: (service: any) => void;
}

export function ServiceModal({
  isOpen,
  onClose,
  categories,
  initialData,
  onSuccess,
}: ServiceModalProps) {
  const isEditing = Boolean(initialData?.id);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [priceType, setPriceType] = useState<"FIXED" | "STARTING_FROM" | "RANGE" | "NEGOTIABLE">("STARTING_FROM");
  const [priceFrom, setPriceFrom] = useState<number>(5000);
  const [priceTo, setPriceTo] = useState<number | "">("");
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available sub-categories based on selected category
  const availableSubCategories = useMemo(() => {
    const selected = categories.find((c) => c.id === categoryId);
    return selected?.subCategories || [];
  }, [categories, categoryId]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setCategoryId(initialData.categoryId || (categories[0]?.id ?? ""));
        setSubCategoryId(initialData.subCategoryId || "");
        setPriceType(initialData.priceType || "STARTING_FROM");
        setPriceFrom(initialData.priceFrom || 0);
        setPriceTo(initialData.priceTo ?? "");
        setDurationMinutes(initialData.durationMinutes || 60);
        setDescription(initialData.description || "");
        setIsActive(initialData.isActive ?? true);
      } else {
        const defaultCatId = categories[0]?.id ?? "";
        setCategoryId(defaultCatId);
        setSubCategoryId("");
        setPriceType("STARTING_FROM");
        setPriceFrom(5000);
        setPriceTo("");
        setDurationMinutes(60);
        setDescription("");
        setIsActive(true);
      }
      setError(null);
    }
  }, [isOpen, initialData, categories]);

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

    if (!categoryId) {
      setError("Please select a primary category.");
      return;
    }

    if (priceType === "RANGE" && priceTo && Number(priceTo) < Number(priceFrom)) {
      setError("Maximum price must be greater than or equal to starting price.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        categoryId,
        subCategoryId: subCategoryId || null,
        priceType,
        priceFrom: Number(priceFrom),
        priceTo: priceType === "RANGE" && priceTo !== "" ? Number(priceTo) : null,
        durationMinutes: Number(durationMinutes),
        description: description.trim() || null,
        isActive,
      };

      const url = isEditing
        ? `/api/artist/services/${initialData!.id}`
        : "/api/artist/services";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success && json.data) {
        onSuccess(json.data);
        onClose();
      } else {
        setError(json.message || "Failed to save service.");
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
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900 leading-tight">
                {isEditing ? "Edit Service Offering" : "Add New Service"}
              </h2>
              <p className="text-xs text-muted-foreground">
                Set transparent pricing and duration for clients
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubCategoryId("");
              }}
              className="flex h-11 w-full rounded-xl border border-[#e8e5e4] bg-white px-3.5 py-2 text-base md:text-sm text-[#1e1a19] focus-visible:outline-none focus-visible:border-[#eb7583] focus-visible:ring-2 focus-visible:ring-[#fcdadb] transition-colors shadow-2xs min-h-[44px]"
              required
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Category Selector */}
          {availableSubCategories.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
                Specialty / Sub-Category
              </label>
              <select
                value={subCategoryId}
                onChange={(e) => setSubCategoryId(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-[#e8e5e4] bg-white px-3.5 py-2 text-base md:text-sm text-[#1e1a19] focus-visible:outline-none focus-visible:border-[#eb7583] focus-visible:ring-2 focus-visible:ring-[#fcdadb] transition-colors shadow-2xs min-h-[44px]"
              >
                <option value="">General (All Subcategories)</option>
                {availableSubCategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Pricing Model */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              Pricing Model *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "STARTING_FROM", label: "Starting At" },
                { id: "FIXED", label: "Fixed Rate" },
                { id: "RANGE", label: "Price Range" },
                { id: "NEGOTIABLE", label: "Negotiable" },
              ].map((model) => (
                <button
                  type="button"
                  key={model.id}
                  onClick={() => setPriceType(model.id as any)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all min-h-[44px] flex items-center justify-center text-center ${
                    priceType === model.id
                      ? "border-[#eb7583] bg-[#fcf1ef] text-[#eb7583] font-bold shadow-2xs"
                      : "border-border bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {model.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Inputs */}
          {priceType !== "NEGOTIABLE" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
                  {priceType === "RANGE" ? "Minimum Price (₹) *" : "Price (₹) *"}
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min={0}
                    step={100}
                    required
                    value={priceFrom}
                    onChange={(e) => setPriceFrom(Number(e.target.value))}
                    className="pl-10 text-base md:text-sm"
                  />
                </div>
              </div>

              {priceType === "RANGE" && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
                    Maximum Price (₹) *
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      min={0}
                      step={100}
                      required
                      placeholder="e.g. 15000"
                      value={priceTo}
                      onChange={(e) =>
                        setPriceTo(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      className="pl-10 text-base md:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Duration Minutes */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              Service Duration (Minutes) *
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                min={15}
                max={720}
                step={15}
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="pl-10 text-base md:text-sm"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              e.g. 60 min for party makeup, 120–180 min for complete bridal makeover.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-900 mb-1.5">
              Service Inclusions & Details (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Includes false lashes, airbrush touchup, draping, and setting spray..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
              className="flex min-h-[80px] w-full rounded-xl border border-[#e8e5e4] bg-white px-3.5 py-2.5 text-base md:text-sm text-[#1e1a19] placeholder:text-[#a09b9a] focus-visible:outline-none focus-visible:border-[#eb7583] focus-visible:ring-2 focus-visible:ring-[#fcdadb] disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-2xs leading-relaxed"
            />
          </div>

          {/* Active Status Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActiveService"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#eb7583] focus:ring-[#eb7583]"
            />
            <label htmlFor="isActiveService" className="text-xs font-medium text-neutral-800 cursor-pointer">
              Active and visible to prospective clients for booking requests
            </label>
          </div>

          {/* Actions */}
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
              disabled={submitting}
              className="bg-[#eb7583] hover:bg-[#d66573] text-white min-h-[44px] shadow-xs flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Service...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? "Save Changes" : "Create Service"}</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
