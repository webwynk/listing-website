"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowLeft, ArrowRight, Tag, Clock, IndianRupee, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceItemData } from "@/lib/validations/onboarding";

interface CategoryOption {
  id: string;
  name: string;
  subCategories: Array<{ id: string; name: string }>;
}

interface ServicesStepProps {
  categories: CategoryOption[];
  services: ServiceItemData[];
  onNext: (services: ServiceItemData[]) => void;
  onBack: () => void;
}

export function ServicesStep({
  categories,
  services: initialServices,
  onNext,
  onBack,
}: ServicesStepProps) {
  const [servicesList, setServicesList] = useState<ServiceItemData[]>(initialServices);
  const [error, setError] = useState<string | null>(null);

  // New service draft form
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || "");
  const [selectedSubCatId, setSelectedSubCatId] = useState<string>("");
  const [priceType, setPriceType] = useState<"FIXED" | "STARTING_FROM" | "RANGE" | "NEGOTIABLE">("STARTING_FROM");
  const [priceFrom, setPriceFrom] = useState<string>("5000");
  const [priceTo, setPriceTo] = useState<string>("");
  const [durationMinutes, setDurationMinutes] = useState<string>("60");
  const [description, setDescription] = useState<string>("");

  const currentCategory = categories.find((c) => c.id === selectedCatId);
  const currentSubCategories = currentCategory?.subCategories || [];

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId) {
      setError("Please select a category.");
      return;
    }
    const numFrom = Number(priceFrom);
    if (isNaN(numFrom) || numFrom < 0) {
      setError("Please provide a valid starting price.");
      return;
    }

    const newService: ServiceItemData = {
      categoryId: selectedCatId,
      subCategoryId: selectedSubCatId || null,
      priceType,
      priceFrom: numFrom,
      priceTo: priceType === "RANGE" && priceTo ? Number(priceTo) : null,
      durationMinutes: Number(durationMinutes) || 60,
      description: description.trim() || null,
    };

    setServicesList([...servicesList, newService]);
    setDescription("");
    setError(null);
  };

  const handleRemove = (idx: number) => {
    setServicesList(servicesList.filter((_, i) => i !== idx));
  };

  const handleContinue = () => {
    if (servicesList.length === 0) {
      setError("Please add at least one service offering to proceed.");
      return;
    }
    setError(null);
    onNext(servicesList);
  };

  const getCategoryName = (catId: string) =>
    categories.find((c) => c.id === catId)?.name || "Service";

  const getSubCategoryName = (catId: string, subId?: string | null) => {
    if (!subId) return null;
    const cat = categories.find((c) => c.id === catId);
    return cat?.subCategories.find((s) => s.id === subId)?.name || null;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1e1a19]">
          Step 2: Services & Pricing
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Specify the services you offer, pricing tiers, and typical appointment duration.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Service Box */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
        <h3 className="font-semibold text-sm text-[#1e1a19]">Add a Service Offering</h3>

        <form onSubmit={handleAddService} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Primary Category *
              </label>
              <select
                value={selectedCatId}
                onChange={(e) => {
                  setSelectedCatId(e.target.value);
                  setSelectedSubCatId("");
                }}
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-white text-base md:text-sm focus:border-[#eb7583] focus:ring-1 focus:ring-[#eb7583] outline-hidden"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Sub-Specialization (Optional)
              </label>
              <select
                value={selectedSubCatId}
                onChange={(e) => setSelectedSubCatId(e.target.value)}
                disabled={currentSubCategories.length === 0}
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-white text-base md:text-sm focus:border-[#eb7583] focus:ring-1 focus:ring-[#eb7583] outline-hidden disabled:bg-neutral-100 disabled:text-neutral-400"
              >
                <option value="">General Service</option>
                {currentSubCategories.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing Model & Amounts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Pricing Model *
              </label>
              <select
                value={priceType}
                onChange={(e) => setPriceType(e.target.value as any)}
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-white text-base md:text-sm focus:border-[#eb7583] focus:ring-1 focus:ring-[#eb7583] outline-hidden"
              >
                <option value="STARTING_FROM">Starting From (₹)</option>
                <option value="FIXED">Fixed Price (₹)</option>
                <option value="RANGE">Price Range (₹ - ₹)</option>
                <option value="NEGOTIABLE">Negotiable</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Price (₹) *
              </label>
              <Input
                type="number"
                min={0}
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
                placeholder="5000"
                className="text-base md:text-sm"
                required
              />
            </div>

            {priceType === "RANGE" && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                  Max Price (₹) *
                </label>
                <Input
                  type="number"
                  min={0}
                  value={priceTo}
                  onChange={(e) => setPriceTo(e.target.value)}
                  placeholder="15000"
                  className="text-base md:text-sm"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Est. Duration (Minutes)
              </label>
              <Input
                type="number"
                min={15}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="60"
                className="text-base md:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
              Service Description (Optional)
            </label>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Includes luxury lashes, contouring, hairstyling, and draping assistance"
              className="text-base md:text-sm"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl h-11 px-5 text-xs md:text-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service to List</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Added Services List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-[#1e1a19]">
            Services Added ({servicesList.length})
          </h3>
          {servicesList.length === 0 && (
            <span className="text-xs text-amber-600 font-medium">
              * Minimum 1 service required
            </span>
          )}
        </div>

        {servicesList.length === 0 ? (
          <div className="p-8 bg-neutral-100/60 rounded-2xl border border-dashed border-neutral-300 text-center text-muted-foreground text-xs md:text-sm">
            No services added yet. Use the form above to add your first service.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {servicesList.map((srv, idx) => {
              const catName = getCategoryName(srv.categoryId);
              const subName = getSubCategoryName(srv.categoryId, srv.subCategoryId);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-border p-4 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-[#eb7583] bg-[#fcf1ef] px-2 py-0.5 rounded-full">
                        {catName}
                      </span>
                      <h4 className="font-semibold text-sm text-[#1e1a19] mt-1">
                        {subName || "Standard Styling"}
                      </h4>
                      {srv.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {srv.description}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                    <span className="font-semibold text-[#1e1a19]">
                      ₹{srv.priceFrom.toLocaleString()}
                      {srv.priceTo && ` - ₹${srv.priceTo.toLocaleString()}`}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {srv.durationMinutes} mins
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
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
          <span>Continue to Portfolio</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
