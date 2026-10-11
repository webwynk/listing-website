"use client";

import { useState } from "react";
import { User, MapPin, Briefcase, Compass, ArrowRight, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfessionalDetailsData, professionalDetailsSchema } from "@/lib/validations/onboarding";

interface DetailsStepProps {
  initialData: ProfessionalDetailsData;
  onNext: (data: ProfessionalDetailsData) => void;
}

export function DetailsStep({ initialData, onNext }: DetailsStepProps) {
  const [formData, setFormData] = useState<ProfessionalDetailsData>(initialData);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const validated = professionalDetailsSchema.parse(formData);
      onNext(validated);
    } catch (err: any) {
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else {
        setError("Please check your details and try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1e1a19]">
          Step 1: Professional Identity
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Tell clients about your brand, signature beauty style, and experience.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
        {/* Business Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
            Brand / Studio Name *
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="e.g. Zara Makeovers & Bridal Studio"
              className="pl-10 text-base md:text-sm"
              required
            />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            This name will appear on your public listing and search card.
          </p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
            Professional Bio / Background *
          </label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Describe your training, specialties (e.g., HD bridal, airbrush, editorial), products used (e.g., MAC, Huda Beauty), and styling philosophy..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-input focus:border-[#eb7583] focus:ring-1 focus:ring-[#eb7583] outline-hidden text-base md:text-sm resize-none leading-relaxed"
            required
          />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
            <span>Minimum 20 characters</span>
            <span>{formData.bio.length} characters</span>
          </div>
        </div>

        {/* Experience & Service Radius */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
              Years of Experience *
            </label>
            <Input
              type="number"
              min={0}
              max={50}
              value={formData.experienceYears}
              onChange={(e) =>
                setFormData({ ...formData, experienceYears: Number(e.target.value) })
              }
              className="text-base md:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
              Service Travel Radius (Kilometers) *
            </label>
            <div className="relative">
              <Compass className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <Input
                type="number"
                min={1}
                max={500}
                value={formData.serviceRadiusKm}
                onChange={(e) =>
                  setFormData({ ...formData, serviceRadiusKm: Number(e.target.value) })
                }
                className="pl-10 text-base md:text-sm"
                required
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              How far you are willing to travel for on-location bridal shoots and events.
            </p>
          </div>
        </div>

        {/* Primary City & State */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
              Primary City *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                value={formData.locationCity}
                onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                placeholder="e.g. Mumbai"
                className="pl-10 text-base md:text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
              State / Province *
            </label>
            <Input
              type="text"
              value={formData.locationState}
              onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
              placeholder="e.g. Maharashtra"
              className="text-base md:text-sm"
              required
            />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-end pt-2">
        <Button
          type="submit"
          className="bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl h-12 px-8 shadow-sm font-semibold flex items-center gap-2"
        >
          <span>Continue to Services</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
