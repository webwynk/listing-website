"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Tag,
  Image as ImageIcon,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DetailsStep } from "@/components/artist/onboarding/details-step";
import { ServicesStep } from "@/components/artist/onboarding/services-step";
import { PortfolioStep } from "@/components/artist/onboarding/portfolio-step";
import { AvailabilityStep } from "@/components/artist/onboarding/availability-step";
import { ReviewStep } from "@/components/artist/onboarding/review-step";
import {
  FullOnboardingData,
  ProfessionalDetailsData,
  ServiceItemData,
  PortfolioItemData,
  WorkingHourItemData,
} from "@/lib/validations/onboarding";

const WIZARD_STEPS = [
  { id: 1, label: "Identity", icon: Briefcase },
  { id: 2, label: "Services", icon: Tag },
  { id: 3, label: "Portfolio", icon: ImageIcon },
  { id: 4, label: "Schedule", icon: Calendar },
  { id: 5, label: "Review", icon: CheckCircle2 },
];

export default function ArtistOnboardingPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Wizard State
  const [onboardingData, setOnboardingData] = useState<FullOnboardingData>({
    details: {
      businessName: "",
      bio: "",
      experienceYears: 2,
      serviceRadiusKm: 25,
      locationCity: "Mumbai",
      locationState: "Maharashtra",
    },
    services: [],
    portfolio: [],
    workingHours: [0, 1, 2, 3, 4, 5, 6].map((day) => ({
      dayOfWeek: day,
      isWorking: day !== 0,
      startTime: "09:00",
      endTime: "19:00",
    })),
  });

  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const res = await fetch("/api/artist/onboarding");
        const json = await res.json();
        if (json.success && json.data) {
          const { profile, categories: cats } = json.data;
          setCategories(cats || []);

          if (profile) {
            setOnboardingData((prev) => ({
              ...prev,
              details: {
                businessName: profile.businessName || profile.user?.name || "",
                bio: profile.bio || "",
                experienceYears: profile.experienceYears || 2,
                serviceRadiusKm: profile.serviceRadiusKm || 25,
                locationCity: profile.user?.locationCity || "Mumbai",
                locationState: profile.user?.locationState || "Maharashtra",
              },
              services:
                profile.services && profile.services.length > 0
                  ? profile.services.map((s: any) => ({
                      categoryId: s.categoryId,
                      subCategoryId: s.subCategoryId || null,
                      priceType: s.priceType || "STARTING_FROM",
                      priceFrom: s.priceFrom || 0,
                      priceTo: s.priceTo || null,
                      durationMinutes: s.durationMinutes || 60,
                      description: s.description || null,
                    }))
                  : [],
              portfolio:
                profile.portfolio && profile.portfolio.length > 0
                  ? profile.portfolio.map((p: any) => ({
                      mediaUrl: p.mediaUrl,
                      thumbnailUrl: p.thumbnailUrl || null,
                      mediaType: p.mediaType || "IMAGE",
                      title: p.title || null,
                      categoryId: p.categoryId || null,
                    }))
                  : [],
              workingHours:
                profile.workingHours && profile.workingHours.length === 7
                  ? profile.workingHours.map((w: any) => ({
                      dayOfWeek: w.dayOfWeek,
                      isWorking: w.isWorking,
                      startTime: w.startTime,
                      endTime: w.endTime,
                    }))
                  : prev.workingHours,
            }));
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  const handleStep1Next = (details: ProfessionalDetailsData) => {
    setOnboardingData((prev) => ({ ...prev, details }));
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep2Next = (services: ServiceItemData[]) => {
    setOnboardingData((prev) => ({ ...prev, services }));
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep3Next = (portfolio: PortfolioItemData[]) => {
    setOnboardingData((prev) => ({ ...prev, portfolio }));
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep4Next = (workingHours: WorkingHourItemData[]) => {
    setOnboardingData((prev) => ({ ...prev, workingHours }));
    setCurrentStep(5);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/artist/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(onboardingData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to submit onboarding application.");
      }

      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      alert(err.message || "Submission failed. Please check all fields.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-border p-12 text-center shadow-xs animate-pulse space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-200 mx-auto"></div>
        <div className="h-6 bg-neutral-200 rounded-sm w-1/3 mx-auto"></div>
        <div className="h-4 bg-neutral-100 rounded-sm w-1/2 mx-auto"></div>
      </div>
    );
  }

  // Application Submitted Success Screen
  if (isCompleted) {
    return (
      <div className="bg-white rounded-3xl border border-border p-8 md:p-12 text-center shadow-xs space-y-6 animate-fade-in max-w-2xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            <Check className="w-3.5 h-3.5" />
            <span>Application Successfully Submitted</span>
          </span>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e1a19]">
            Welcome to the GlamBook Artist Community!
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your professional portfolio, pricing tiers, and operating schedule have been submitted for verification.
            Our administrative curation team will review your application within 24 to 48 hours.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs space-y-2">
          <p className="font-semibold text-[#1e1a19]">What happens next?</p>
          <ul className="space-y-1.5 text-neutral-600 list-disc list-inside">
            <li>Our team will inspect your portfolio authenticity and image resolutions.</li>
            <li>You will receive an email confirmation once your profile is approved.</li>
            <li>In the meantime, you can explore your artist portal and customize your preferences.</li>
          </ul>
        </div>

        <div className="pt-2">
          <Link href="/artist/dashboard">
            <Button className="bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl h-12 px-8 font-semibold shadow-sm flex items-center gap-2 mx-auto">
              <span>Go to Artist Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Wizard Progress Stepper */}
      <div className="bg-white rounded-2xl border border-border p-4 shadow-xs">
        <div className="flex items-center justify-between relative">
          {WIZARD_STEPS.map((step, idx) => {
            const isPassed = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const StepIcon = step.icon;

            return (
              <div key={step.id} className="flex-1 flex flex-col items-center relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    // Allow jumping back to previously completed steps
                    if (isPassed) {
                      setCurrentStep(step.id);
                    }
                  }}
                  disabled={!isPassed}
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center transition-all ${
                    isPassed
                      ? "bg-emerald-600 text-white shadow-xs cursor-pointer hover:bg-emerald-700"
                      : isCurrent
                      ? "bg-[#eb7583] text-white shadow-md ring-4 ring-[#eb7583]/20"
                      : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {isPassed ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </button>
                <span
                  className={`text-[11px] md:text-xs font-semibold mt-2 text-center hidden sm:block ${
                    isCurrent
                      ? "text-[#eb7583]"
                      : isPassed
                      ? "text-[#1e1a19]"
                      : "text-neutral-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wizard Step Content */}
      {currentStep === 1 && (
        <DetailsStep
          initialData={onboardingData.details}
          onNext={handleStep1Next}
        />
      )}

      {currentStep === 2 && (
        <ServicesStep
          categories={categories}
          services={onboardingData.services}
          onNext={handleStep2Next}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <PortfolioStep
          portfolio={onboardingData.portfolio}
          onNext={handleStep3Next}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <AvailabilityStep
          workingHours={onboardingData.workingHours}
          onNext={handleStep4Next}
          onBack={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && (
        <ReviewStep
          data={onboardingData}
          onSubmit={handleFinalSubmit}
          onBack={() => setCurrentStep(4)}
          submitting={submitting}
        />
      )}
    </div>
  );
}
