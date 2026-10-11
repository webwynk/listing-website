"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPin,
  Tag,
  Clock,
  Image as ImageIcon,
  ShieldCheck,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FullOnboardingData } from "@/lib/validations/onboarding";

interface ReviewStepProps {
  data: FullOnboardingData;
  onSubmit: () => Promise<void>;
  onBack: () => void;
  submitting: boolean;
}

export function ReviewStep({
  data,
  onSubmit,
  onBack,
  submitting,
}: ReviewStepProps) {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please confirm the accuracy of your portfolio and agree to the platform terms.");
      return;
    }
    setError(null);
    await onSubmit();
  };

  const workingDaysCount = data.workingHours.filter((h) => h.isWorking).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1e1a19]">
          Step 5: Final Review & Submission
        </h2>
        <p className="text-xs md:text-sm text-muted-foreground mt-1">
          Review your profile summary before sending your application for administrative verification.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs md:text-sm rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identity & Location */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1e1a19] border-b border-border/60 pb-2">
            <Briefcase className="w-4 h-4 text-[#eb7583]" />
            <span>Professional Details</span>
          </div>
          <div>
            <p className="text-base font-bold text-[#1e1a19]">{data.details.businessName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {data.details.locationCity}, {data.details.locationState} · {data.details.serviceRadiusKm} km travel radius
            </p>
            <p className="text-xs text-neutral-600 mt-2 line-clamp-3">
              {data.details.bio}
            </p>
            <p className="text-xs text-neutral-500 font-medium mt-2">
              Experience: {data.details.experienceYears} Years
            </p>
          </div>
        </div>

        {/* Operating Schedule */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1e1a19] border-b border-border/60 pb-2">
            <Clock className="w-4 h-4 text-[#eb7583]" />
            <span>Operating Schedule</span>
          </div>
          <div className="space-y-1.5 text-xs text-neutral-700">
            <p className="font-semibold text-[#1e1a19]">
              Available {workingDaysCount} out of 7 days a week
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.workingHours.map((h) => (
                <span
                  key={h.dayOfWeek}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium ${
                    h.isWorking
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][h.dayOfWeek]}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground pt-1">
              Standard operating hours: {data.workingHours[1]?.startTime || "09:00"} to {data.workingHours[1]?.endTime || "19:00"}
            </p>
          </div>
        </div>
      </div>

      {/* Services Summary */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1e1a19]">
            <Tag className="w-4 h-4 text-[#eb7583]" />
            <span>Service Offerings ({data.services.length})</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {data.services.map((srv, idx) => (
            <div key={idx} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs space-y-1">
              <span className="font-semibold text-[#1e1a19] block">
                ₹{srv.priceFrom.toLocaleString()}
                {srv.priceTo ? ` - ₹${srv.priceTo.toLocaleString()}` : ""}
              </span>
              <p className="text-[11px] text-muted-foreground">
                Duration: {srv.durationMinutes} minutes · {srv.priceType}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Gallery Summary */}
      <div className="bg-white rounded-2xl border border-border p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#1e1a19]">
            <ImageIcon className="w-4 h-4 text-[#eb7583]" />
            <span>Portfolio Gallery ({data.portfolio.length} items)</span>
          </div>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {data.portfolio.map((item, idx) => (
            <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-border">
              <img
                src={item.mediaUrl}
                alt="Portfolio sample"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Agreement Checkbox */}
      <div className="p-4 bg-white rounded-2xl border border-border shadow-xs">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded text-[#eb7583] focus:ring-[#eb7583]"
          />
          <div className="text-xs text-neutral-700 leading-relaxed">
            <span className="font-semibold text-[#1e1a19]">Authenticity & Professional Standards Declaration: </span>
            I certify that the portfolio photographs submitted belong to my authentic original client work. I agree to GlamBook's Terms of Service and understand that client contact details are safeguarded by administrative lead privacy.
          </div>
        </label>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={submitting}
          className="rounded-xl h-12 px-6 border-border flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Edit</span>
        </Button>
        <Button
          type="submit"
          disabled={submitting || !agreed}
          className="bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl h-12 px-8 shadow-sm font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          {submitting ? (
            <span>Submitting Application...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Profile for Review</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
