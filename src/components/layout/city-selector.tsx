"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Search,
  X,
  Sparkles,
  Check,
} from "lucide-react";

export interface CityOption {
  name: string;
  slug: string;
  state: string;
  isPopular?: boolean;
}

export const TOP_CITIES: CityOption[] = [
  { name: "Mumbai", slug: "mumbai", state: "Maharashtra", isPopular: true },
  { name: "Delhi NCR", slug: "delhi-ncr", state: "Delhi", isPopular: true },
  { name: "Bangalore", slug: "bangalore", state: "Karnataka", isPopular: true },
  { name: "Hyderabad", slug: "hyderabad", state: "Telangana", isPopular: true },
  { name: "Chennai", slug: "chennai", state: "Tamil Nadu", isPopular: true },
  { name: "Kolkata", slug: "kolkata", state: "West Bengal", isPopular: true },
  { name: "Jaipur", slug: "jaipur", state: "Rajasthan", isPopular: true },
  { name: "Udaipur", slug: "udaipur", state: "Rajasthan", isPopular: true },
  { name: "Goa", slug: "goa", state: "Goa", isPopular: true },
  { name: "Chandigarh", slug: "chandigarh", state: "Punjab / Haryana", isPopular: false },
  { name: "Pune", slug: "pune", state: "Maharashtra", isPopular: false },
  { name: "Ahmedabad", slug: "ahmedabad", state: "Gujarat", isPopular: false },
  { name: "Lucknow", slug: "lucknow", state: "Uttar Pradesh", isPopular: false },
  { name: "Kochi", slug: "kochi", state: "Kerala", isPopular: false },
  { name: "Indore", slug: "indore", state: "Madhya Pradesh", isPopular: false },
  { name: "Surat", slug: "surat", state: "Gujarat", isPopular: false },
];

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity?: string | null;
  onSelectCity?: (city: CityOption) => void;
}

export function CitySelectorModal({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}: CitySelectorModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredCities = TOP_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handlePickCity(city: CityOption) {
    if (onSelectCity) {
      onSelectCity(city);
    } else {
      // Default: navigate to /artists?city=slug
      const params = new URLSearchParams(searchParams.toString());
      params.set("city", city.slug);
      router.push(`/artists?${params.toString()}`);
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white">
                Choose Location
              </h3>
              <p className="text-xs text-neutral-400">
                Discover elite makeup artists and studios in your city
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

        {/* Search */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city or destination wedding state..."
            className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
          />
        </div>

        {/* Popular Cities Quick Chips */}
        {!searchQuery && (
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Top Wedding Destinations
            </span>
            <div className="flex flex-wrap gap-2">
              {TOP_CITIES.filter((c) => c.isPopular).map((city) => {
                const isSelected =
                  selectedCity?.toLowerCase() === city.slug.toLowerCase() ||
                  selectedCity?.toLowerCase() === city.name.toLowerCase();

                return (
                  <button
                    key={city.slug}
                    onClick={() => handlePickCity(city)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition min-h-[44px] ${
                      isSelected
                        ? "bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20"
                        : "bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-amber-500/40 hover:text-white"
                    }`}
                  >
                    <MapPin className="w-3 h-3" />
                    <span>{city.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* All Cities List */}
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-2">
            All Cities ({filteredCities.length})
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {filteredCities.map((city) => {
              const isSelected =
                selectedCity?.toLowerCase() === city.slug.toLowerCase() ||
                selectedCity?.toLowerCase() === city.name.toLowerCase();

              return (
                <button
                  key={city.slug}
                  onClick={() => handlePickCity(city)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition min-h-[44px] ${
                    isSelected
                      ? "bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold"
                      : "hover:bg-neutral-950 text-neutral-300 hover:text-white"
                  }`}
                >
                  <div>
                    <span className="block font-medium">{city.name}</span>
                    <span className="text-[10px] text-neutral-500 block">
                      {city.state}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                </button>
              );
            })}
          </div>

          {filteredCities.length === 0 && (
            <div className="text-center py-6 text-xs text-neutral-500">
              No matching cities found for &quot;{searchQuery}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
