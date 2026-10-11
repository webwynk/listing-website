"use client";

import { useEffect, useState } from "react";
import {
  User,
  Briefcase,
  MapPin,
  Compass,
  Phone,
  Mail,
  Camera,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Save,
  ShieldCheck,
  Eye,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ArtistProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [status, setStatus] = useState<string>("PENDING");
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    profileViews: 0,
    servicesCount: 0,
    portfolioCount: 0,
    avgRating: 0,
    totalReviews: 0,
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    avatarUrl: "",
    businessName: "",
    bio: "",
    experienceYears: 2,
    serviceRadiusKm: 25,
    locationCity: "",
    locationState: "",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const res = await fetch("/api/artist/profile");
        const json = await res.json();

        if (json.success && json.data?.profile) {
          const p = json.data.profile;
          setStatus(p.status);
          setRejectionReason(p.rejectionReason);
          setMetrics({
            profileViews: p.profileViews || 0,
            servicesCount: p.servicesCount || 0,
            portfolioCount: p.portfolioCount || 0,
            avgRating: p.avgRating || 0,
            totalReviews: p.totalReviews || 0,
          });

          setFormData({
            name: p.user?.name || "",
            email: p.user?.email || "",
            phone: p.user?.phone || "",
            avatarUrl: p.user?.avatarUrl || "",
            businessName: p.businessName || "",
            bio: p.bio || "",
            experienceYears: p.experienceYears ?? 2,
            serviceRadiusKm: p.serviceRadiusKm ?? 25,
            locationCity: p.user?.locationCity || "",
            locationState: p.user?.locationState || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/artist/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone || null,
          avatarUrl: formData.avatarUrl || null,
          businessName: formData.businessName || null,
          bio: formData.bio || null,
          experienceYears: Number(formData.experienceYears),
          serviceRadiusKm: Number(formData.serviceRadiusKm),
          locationCity: formData.locationCity || null,
          locationState: formData.locationState || null,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setSuccessMessage(json.message || "Profile updated successfully!");
        if (status === "REJECTED") {
          setStatus("PENDING");
          setRejectionReason(null);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setErrorMessage(json.message || "Failed to update profile.");
      }
    } catch {
      setErrorMessage("A network error occurred. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="h-10 w-64 animate-pulse rounded-md bg-neutral-200/70" />
        <div className="h-40 w-full rounded-2xl animate-pulse bg-neutral-200/70" />
        <div className="h-96 w-full rounded-2xl animate-pulse bg-neutral-200/70" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900">
            Artist Profile Management
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Manage your personal identity, brand details, location radius, and portfolio reach.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {status === "APPROVED" && (
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1.5 py-1 px-3 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified & Active
            </Badge>
          )}
          {status === "PENDING" && (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5 py-1 px-3 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Under Review
            </Badge>
          )}
          {status === "REJECTED" && (
            <Badge className="bg-rose-50 text-rose-700 border-rose-200 flex items-center gap-1.5 py-1 px-3 text-xs">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              Action Required
            </Badge>
          )}
        </div>
      </div>

      {/* Alert Notices */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {status === "REJECTED" && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-950 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm text-rose-900">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Profile Revision Required</span>
          </div>
          <p className="text-xs text-rose-900/80">
            The admin review team requested the following updates before your profile can go live:
          </p>
          {rejectionReason && (
            <div className="p-3 bg-white/80 border border-rose-200 rounded-lg text-xs font-medium text-rose-950">
              &ldquo;{rejectionReason}&rdquo;
            </div>
          )}
          <p className="text-[11px] text-muted-foreground pt-1">
            * Once you save changes below, your application will be automatically resubmitted to the administration team.
          </p>
        </div>
      )}

      {/* Performance Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-border/80 shadow-2xs">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-purple-600" /> Views
          </p>
          <p className="text-lg font-bold font-serif text-neutral-900 mt-1">
            {metrics.profileViews}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-border/80 shadow-2xs">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#eb7583]" /> Services
          </p>
          <p className="text-lg font-bold font-serif text-neutral-900 mt-1">
            {metrics.servicesCount}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-border/80 shadow-2xs">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" /> Portfolio
          </p>
          <p className="text-lg font-bold font-serif text-neutral-900 mt-1">
            {metrics.portfolioCount} photos
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-border/80 shadow-2xs">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> Rating
          </p>
          <p className="text-lg font-bold font-serif text-neutral-900 mt-1">
            {metrics.avgRating ? `${metrics.avgRating.toFixed(1)} ★` : "New"}
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Visual Identity */}
        <Card className="border border-border/80 shadow-2xs bg-white">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-base font-semibold text-neutral-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#eb7583]" />
              Visual Identity & Avatar
            </CardTitle>
            <CardDescription className="text-xs">
              This photo is displayed on search listings, booking receipts, and your public dossier.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                {formData.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={formData.avatarUrl}
                    alt={formData.name || "Avatar"}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#eb7583]/30 shadow-xs"
                  />
                ) : (
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center font-bold text-3xl border-2 border-dashed border-[#eb7583]/40">
                    {formData.name ? formData.name[0].toUpperCase() : "A"}
                  </div>
                )}
              </div>

              {/* Avatar URL input */}
              <div className="flex-1 w-full space-y-2">
                <label className="block text-xs font-semibold text-neutral-800">
                  Profile Photo URL
                </label>
                <Input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="text-base md:text-sm"
                />
                <p className="text-[11px] text-muted-foreground">
                  Provide a direct, high-resolution portrait image link (square aspect ratio recommended).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Personal & Brand Information */}
        <Card className="border border-border/80 shadow-2xs bg-white">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-base font-semibold text-neutral-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#eb7583]" />
              Professional Brand & Bio
            </CardTitle>
            <CardDescription className="text-xs">
              Tell clients about your specialty, bridal aesthetic, and industry background.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 text-base md:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Brand / Studio Name
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="e.g. Glamour by Pooja"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="pl-10 text-base md:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-neutral-800">
                  Professional Bio / About You
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {formData.bio?.length || 0} / 2000 chars
                </span>
              </div>
              <textarea
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Describe your background, signature bridal techniques, makeup products used (e.g. MAC, Huda Beauty), and what sets you apart..."
                className="flex min-h-[100px] w-full rounded-xl border border-[#e8e5e4] bg-white px-3.5 py-2.5 text-base md:text-sm text-[#1e1a19] placeholder:text-[#a09b9a] focus-visible:outline-none focus-visible:border-[#eb7583] focus-visible:ring-2 focus-visible:ring-[#fcdadb] disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-2xs leading-relaxed"
                maxLength={2000}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Years of Experience
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
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Travel & Service Radius (km)
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
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Location & Contact */}
        <Card className="border border-border/80 shadow-2xs bg-white">
          <CardHeader className="pb-4 border-b border-border/60">
            <CardTitle className="text-base font-semibold text-neutral-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#eb7583]" />
              Base Location & Contact
            </CardTitle>
            <CardDescription className="text-xs">
              Used for geo-matching clients and official coordination.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Primary City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    value={formData.locationCity}
                    onChange={(e) => setFormData({ ...formData, locationCity: e.target.value })}
                    className="pl-10 text-base md:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  State / Province *
                </label>
                <Input
                  type="text"
                  value={formData.locationState}
                  onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
                  className="text-base md:text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Business Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="pl-10 text-base md:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-800 mb-1.5">
                  Registered Account Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    value={formData.email}
                    disabled
                    className="pl-10 bg-neutral-100/70 text-muted-foreground cursor-not-allowed text-base md:text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="bg-[#eb7583] hover:bg-[#d66573] text-white font-medium px-6 min-h-[44px] shadow-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : status === "REJECTED" ? "Save & Resubmit Profile" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
