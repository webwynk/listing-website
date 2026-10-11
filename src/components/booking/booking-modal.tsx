"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  Check,
  AlertCircle,
  FileText,
} from "lucide-react";

export interface BookingArtist {
  id: string; // artistProfile.id
  name: string;
  avatarUrl?: string | null;
  businessName?: string | null;
  city?: string | null;
  services?: Array<{
    id: string;
    category?: { name: string };
    priceFrom: number;
    priceTo?: number | null;
    priceType: string;
    durationMinutes?: number | null;
  }>;
  packages?: Array<{
    id: string;
    name: string;
    price: number;
    durationHours?: number | null;
  }>;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: BookingArtist;
  preSelectedServiceId?: string;
  onSuccess?: (booking: any) => void;
}

const EVENT_TYPES = [
  "Bridal (Wedding Day)",
  "Reception",
  "Sangeet / Mehendi",
  "Engagement / Roka",
  "Party / Cocktail Glam",
  "Pre-Wedding / Photoshoot",
  "Other Special Event",
];

const TIME_SLOTS = [
  "Early Morning (06:00 AM - 09:00 AM)",
  "Morning (09:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 04:00 PM)",
  "Evening (04:00 PM - 08:00 PM)",
  "Night (08:00 PM onwards)",
];

export function BookingModal({
  isOpen,
  onClose,
  artist,
  preSelectedServiceId,
  onSuccess,
}: BookingModalProps) {
  const router = useRouter();

  // Wizard Step (1: Service, 2: Date/Time, 3: Event/Venue, 4: Review/Contact, 5: Success)
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preSelectedServiceId || ""
  );
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>(TIME_SLOTS[0]);
  const [eventType, setEventType] = useState<string>(EVENT_TYPES[0]);
  const [eventLocation, setEventLocation] = useState<string>("");
  const [numberOfPeople, setNumberOfPeople] = useState<number>(1);
  const [requirements, setRequirements] = useState<string>("");

  // Contact Info
  const [userName, setUserName] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<any | null>(null);

  // Auto-populate logged-in user details if available
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const res = await fetch("/api/auth/me");
        const json = await res.json();
        if (json?.data?.user) {
          setUserName(json.data.user.name || "");
          setUserEmail(json.data.user.email || "");
          setUserPhone(json.data.user.phone || "");
        }
      } catch {
        // Unauthenticated or network issue
      }
    }

    if (isOpen) {
      loadCurrentUser();
      // Set default date to 3 days in the future
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 3);
      setBookingDate(futureDate.toISOString().split("T")[0]);
      if (preSelectedServiceId) {
        setSelectedServiceId(preSelectedServiceId);
      }
      setStep(1);
      setError(null);
    }
  }, [isOpen, preSelectedServiceId]);

  if (!isOpen) return null;

  // Validation before advancing to next step
  function validateStep(currentStep: number): boolean {
    setError(null);
    if (currentStep === 2) {
      if (!bookingDate) {
        setError("Please select an event date.");
        return false;
      }
      const selected = new Date(bookingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        setError("Event date cannot be in the past.");
        return false;
      }
    }
    if (currentStep === 3) {
      if (!eventLocation.trim() || eventLocation.trim().length < 3) {
        setError("Please enter the venue address or city location.");
        return false;
      }
      if (numberOfPeople < 1) {
        setError("Number of people must be at least 1.");
        return false;
      }
    }
    if (currentStep === 4) {
      if (!userName.trim() || userName.trim().length < 2) {
        setError("Please enter your name.");
        return false;
      }
      if (!userPhone.trim() || userPhone.trim().length < 10) {
        setError("Please enter a valid 10-digit contact phone number.");
        return false;
      }
      if (!userEmail.trim() || !userEmail.includes("@")) {
        setError("Please enter a valid email address.");
        return false;
      }
    }
    return true;
  }

  function handleNext() {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  }

  function handleBack() {
    setError(null);
    setStep((prev) => Math.max(1, prev - 1));
  }

  async function handleSubmitBooking() {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        artistId: artist.id,
        serviceId: selectedServiceId || null,
        bookingDate,
        bookingTime,
        eventType,
        eventLocation: eventLocation.trim(),
        numberOfPeople,
        requirements: requirements.trim() || null,
        userName: userName.trim(),
        userPhone: userPhone.trim(),
        userEmail: userEmail.trim().toLowerCase(),
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to submit booking inquiry.");
      }

      setCreatedBooking(json.data.booking);
      if (onSuccess) onSuccess(json.data.booking);
      setStep(5);
    } catch (err: any) {
      setError(err.message || "Failed to submit booking inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedServiceObj = artist.services?.find((s) => s.id === selectedServiceId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-neutral-100 flex flex-col justify-between">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              {artist.avatarUrl ? (
                <img
                  src={artist.avatarUrl}
                  alt={artist.name}
                  className="w-10 h-10 rounded-xl object-cover border border-amber-500/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 text-amber-300 flex items-center justify-center text-sm font-bold">
                  {artist.name.charAt(0)}
                </div>
              )}
              <div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-white line-clamp-1">
                  Request Booking with {artist.businessName || artist.name}
                </h2>
                <span className="text-[11px] text-amber-400 font-medium">
                  Direct Coordination • No Online Payments
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close booking modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Indicator (Steps 1 to 4) */}
          {step < 5 && (
            <div className="py-4 border-b border-neutral-800/80">
              <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400 mb-2">
                <span className={step >= 1 ? "text-amber-400 font-bold" : ""}>
                  1. Service
                </span>
                <span className={step >= 2 ? "text-amber-400 font-bold" : ""}>
                  2. Date & Time
                </span>
                <span className={step >= 3 ? "text-amber-400 font-bold" : ""}>
                  3. Event Details
                </span>
                <span className={step >= 4 ? "text-amber-400 font-bold" : ""}>
                  4. Review
                </span>
              </div>

              <div className="w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3.5 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="py-6 space-y-4">
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Choose Service or Package
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Select from {artist.name}&apos;s offerings or choose a custom inquiry
              </p>
            </div>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {artist.services && artist.services.length > 0 ? (
                artist.services.map((svc) => (
                  <div
                    key={svc.id}
                    onClick={() => setSelectedServiceId(svc.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between min-h-[44px] ${
                      selectedServiceId === svc.id
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                        : "bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700"
                    }`}
                  >
                    <div>
                      <span className="text-sm font-semibold text-white block">
                        {svc.category?.name || "Service"}
                      </span>
                      {svc.durationMinutes && (
                        <span className="text-xs text-neutral-400">
                          ~{svc.durationMinutes} mins
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-serif font-bold text-amber-400">
                        ₹{svc.priceFrom.toLocaleString()}
                        {svc.priceTo ? ` - ₹${svc.priceTo.toLocaleString()}` : ""}
                      </span>
                      <span className="text-[10px] text-neutral-500 block uppercase">
                        {svc.priceType.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-neutral-950/60 border border-neutral-800 rounded-2xl text-xs text-neutral-400">
                  No individual service pricing listed. Proceed with a general consultation request.
                </div>
              )}

              {/* General Inquiry Option */}
              <div
                onClick={() => setSelectedServiceId("")}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between min-h-[44px] ${
                  selectedServiceId === ""
                    ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                    : "bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700"
                }`}
              >
                <div>
                  <span className="text-sm font-semibold text-white block">
                    Custom Quote / Consultation
                  </span>
                  <span className="text-xs text-neutral-400">
                    Discuss custom bridal packages or styling specs directly
                  </span>
                </div>
                <span className="text-xs text-amber-400 font-semibold">Custom</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="py-6 space-y-5">
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                When is your event?
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Artists usually reserve slots months in advance during wedding season
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Event Date *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Preferred Time Slot *
                </label>
                <div className="space-y-2">
                  {TIME_SLOTS.map((slot) => (
                    <label
                      key={slot}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition min-h-[44px] ${
                        bookingTime === slot
                          ? "bg-amber-500/10 border-amber-500/40 text-amber-300"
                          : "bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 text-neutral-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="bookingTime"
                        checked={bookingTime === slot}
                        onChange={() => setBookingTime(slot)}
                        className="sr-only"
                      />
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs font-medium">{slot}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Event & Location */}
        {step === 3 && (
          <div className="py-6 space-y-4">
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Event Specifications
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Tell {artist.name} about your venue, occasion, and party size
              </p>
            </div>

            <div className="space-y-4">
              {/* Event Type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Occasion Type *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type} className="bg-neutral-900">
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Event Location */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Venue / Location Address *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="e.g. Taj Lands End, Bandra, Mumbai or Home Address"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
                  />
                </div>
              </div>

              {/* Number of People */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Number of People Needing Styling *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                    <Users className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(parseInt(e.target.value, 10) || 1)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
                  />
                </div>
              </div>

              {/* Requirements & Notes */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                  Special Notes or Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="e.g. Need draping support, airbrush preference, early morning trial..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Contact Information */}
        {step === 4 && (
          <div className="py-6 space-y-5">
            <div>
              <h3 className="text-base font-serif font-bold text-white">
                Review & Contact Details
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Confirm your contact details so {artist.name} can coordinate with you
              </p>
            </div>

            {/* Summary Dossier Box */}
            <div className="p-4 bg-neutral-950/70 border border-neutral-800/80 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Selected Service:</span>
                <span className="text-white font-medium">
                  {selectedServiceObj?.category?.name || "Custom Consultation"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Date & Slot:</span>
                <span className="text-amber-400 font-semibold">
                  {bookingDate} • {bookingTime}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-800/60">
                <span className="text-neutral-400">Event & Venue:</span>
                <span className="text-white font-medium truncate max-w-[220px]">
                  {eventType} ({eventLocation})
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-400">Party Size:</span>
                <span className="text-white font-medium">{numberOfPeople} Person(s)</span>
              </div>
            </div>

            {/* Contact Details Inputs */}
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  WhatsApp / Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
                />
              </div>
            </div>

            {/* Direct Model Guarantee Pill */}
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <span>
                Zero Online Payments: GlamBook connects you directly with the artist. You coordinate details and terms with no commission markup.
              </span>
            </div>
          </div>
        )}

        {/* Step 5: Success Confirmation Screen */}
        {step === 5 && (
          <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">
                Booking Request Sent
              </span>
              <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
                Reference: {createdBooking?.bookingNumber || "GB-CONFIRMED"}
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
                Your request has been routed directly to {artist.businessName || artist.name}. We&apos;ve sent confirmation details to{" "}
                <span className="text-white font-semibold">{userEmail}</span>.
              </p>
            </div>

            <div className="p-4 bg-neutral-950/70 border border-neutral-800 rounded-2xl max-w-sm mx-auto text-left text-xs space-y-2">
              <span className="font-semibold text-neutral-300 block">Next Steps:</span>
              <ol className="list-decimal pl-4 space-y-1 text-neutral-400">
                <li>Artist reviews date availability and specifications.</li>
                <li>Direct communication initiated via WhatsApp or phone.</li>
                <li>Lock in your dates directly with the artist.</li>
              </ol>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/user/bookings"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-xs transition shadow-lg shadow-amber-500/20 min-h-[44px]"
              >
                Go to My Bookings
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium transition min-h-[44px]"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer (Steps 1 to 4) */}
        {step < 5 && (
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 transition min-h-[44px]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-xs transition shadow-md shadow-amber-500/10 min-h-[44px]"
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitBooking}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-xs transition shadow-lg shadow-amber-500/20 disabled:opacity-50 min-h-[44px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Submitting Inquiry...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Submit Booking Request
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
