"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Star,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Image as ImageIcon,
  Tag,
  Clock3,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArtistRejectModal } from "@/components/admin/artist-reject-modal";

interface ArtistService {
  id: string;
  priceFrom: number;
  priceTo?: number | null;
  priceType: string;
  durationMinutes?: number | null;
  description?: string | null;
  category: { id: string; name: string };
  subCategory?: { id: string; name: string } | null;
}

interface PortfolioItem {
  id: string;
  mediaUrl: string;
  mediaType: string;
  title?: string | null;
  description?: string | null;
}

interface WorkingHour {
  id: string;
  dayOfWeek: number;
  isWorking: boolean;
  startTime: string;
  endTime: string;
}

interface ReviewItem {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user: {
    name: string;
    avatarUrl?: string | null;
  };
}

interface ArtistDetails {
  id: string;
  userId: string;
  businessName?: string | null;
  bio?: string | null;
  experienceYears: number;
  serviceRadiusKm: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  rejectionReason?: string | null;
  avgRating: number;
  totalReviews: number;
  totalBookings: number;
  isFeatured: boolean;
  approvedAt?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
    locationCity?: string | null;
    locationState?: string | null;
    isEmailVerified: boolean;
    createdAt: string;
  };
  services: ArtistService[];
  portfolioItems: PortfolioItem[];
  workingHours: WorkingHour[];
  reviews: ReviewItem[];
  _count: {
    bookings: number;
    reviews: number;
    portfolioItems: number;
    packages: number;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function ArtistDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const artistId = resolvedParams.id;

  const [artist, setArtist] = useState<ArtistDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reject modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const fetchArtist = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/artists/${artistId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load artist details.");
      }

      setArtist(data.data);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading artist profile.");
    } finally {
      setLoading(false);
    }
  }, [artistId]);

  useEffect(() => {
    fetchArtist();
  }, [fetchArtist]);

  // Actions
  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/artists/${artistId}/approve`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      fetchArtist();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/artists/${artistId}/suspend`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      fetchArtist();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFeature = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/artists/${artistId}/feature`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      fetchArtist();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async (reason: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/artists/${artistId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      fetchArtist();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved Profile</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Suspended</span>
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-36 bg-gray-200 rounded-md" />
        <div className="h-44 bg-white rounded-3xl border border-gray-100" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-white rounded-3xl border border-gray-100" />
          <div className="lg:col-span-2 h-64 bg-white rounded-3xl border border-gray-100" />
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
        <h2 className="text-base font-bold text-gray-800">Artist Not Found</h2>
        <p className="text-xs text-gray-500 mt-1">This profile may have been deleted.</p>
        <Link
          href="/admin/artists"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#eb7583]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Artists</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Breadcrumb Navigation (20-Point Polish Standard #9) */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link
          href="/admin/artists"
          className="hover:text-[#eb7583] transition-colors flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Artists</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-800 truncate">
          {artist.businessName || artist.user.name}
        </span>
      </nav>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Profile Header Dossier */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#eb7583] text-white flex items-center justify-center font-bold text-2xl uppercase shadow-md shrink-0">
            {artist.businessName ? artist.businessName.substring(0, 2) : "AR"}
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-title text-2xl sm:text-3xl font-bold text-[#1e1a19]">
                {artist.businessName || artist.user.name}
              </h1>
              {getStatusBadge(artist.status)}
              {artist.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  <span>Featured Spotlight</span>
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Registered by <span className="font-medium text-gray-800">{artist.user.name}</span> on{" "}
              {new Date(artist.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
              {artist.user.locationCity && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {artist.user.locationCity}
                    {artist.user.locationState ? `, ${artist.user.locationState}` : ""}
                  </span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-gray-400" />
                <span>{artist.experienceYears} Years Experience</span>
              </span>
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{artist.avgRating.toFixed(1)} ({artist.totalReviews} reviews)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          <Button
            variant="outline"
            onClick={handleFeature}
            disabled={actionLoading}
            className="rounded-xl text-xs font-semibold h-10 px-3.5 flex items-center gap-1.5"
            title="Toggle featured showcase"
          >
            <Star className={`w-3.5 h-3.5 ${artist.isFeatured ? "fill-amber-400 text-amber-500" : ""}`} />
            <span>{artist.isFeatured ? "Unfeature" : "Feature"}</span>
          </Button>

          {artist.status === "PENDING" && (
            <>
              <Button
                onClick={handleApprove}
                disabled={actionLoading}
                className="rounded-xl text-xs font-semibold h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Profile</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setRejectModalOpen(true)}
                disabled={actionLoading}
                className="rounded-xl text-xs font-semibold h-10 px-4 text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <XCircle className="w-4 h-4 mr-1" />
                <span>Reject</span>
              </Button>
            </>
          )}

          {artist.status === "APPROVED" && (
            <Button
              variant="outline"
              onClick={handleSuspend}
              disabled={actionLoading}
              className="rounded-xl text-xs font-semibold h-10 px-4 text-amber-700 border-amber-200 hover:bg-amber-50"
            >
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              <span>Suspend Artist</span>
            </Button>
          )}

          {artist.status === "SUSPENDED" && (
            <Button
              onClick={handleSuspend}
              disabled={actionLoading}
              className="rounded-xl text-xs font-semibold h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Reactivate Listing</span>
            </Button>
          )}
        </div>
      </div>

      {/* Rejection notice banner if rejected */}
      {artist.status === "REJECTED" && artist.rejectionReason && (
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm">
          <div className="font-bold flex items-center gap-2 text-rose-800 mb-1">
            <XCircle className="w-4 h-4" />
            <span>Profile Rejected with Stated Reason:</span>
          </div>
          <p className="mt-1 pl-6 text-rose-700">{artist.rejectionReason}</p>
        </div>
      )}

      {/* Main Grid: Details + Services & Portfolio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Contact & Bio */}
        <div className="space-y-6">
          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h2 className="font-title text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              Contact &amp; Credentials
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">
                  Email Address
                </span>
                <div className="flex items-center gap-2 font-medium text-gray-800">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{artist.user.email}</span>
                  {artist.user.isEmailVerified && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">
                  Phone Number
                </span>
                <div className="flex items-center gap-2 font-medium text-gray-800">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{artist.user.phone || "Not provided"}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">
                  Service Radius
                </span>
                <span className="font-medium text-gray-800">
                  Within {artist.serviceRadiusKm} km of base location
                </span>
              </div>
            </div>
          </div>

          {/* Artist Bio */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
            <h2 className="font-title text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
              Professional Bio
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {artist.bio || "No biography provided by the artist."}
            </p>
          </div>

          {/* Working Hours Schedule */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
            <h2 className="font-title text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>Weekly Schedule</span>
              <Clock3 className="w-4 h-4 text-gray-400" />
            </h2>

            <div className="space-y-2 text-xs">
              {dayNames.map((name, idx) => {
                const hour = artist.workingHours?.find((h) => h.dayOfWeek === idx);
                const isWorking = hour ? hour.isWorking : true;
                return (
                  <div key={idx} className="flex items-center justify-between py-1">
                    <span className="font-medium text-gray-700">{name}</span>
                    <span className={isWorking ? "text-gray-600 font-mono" : "text-gray-400 italic"}>
                      {isWorking ? `${hour?.startTime || "09:00"} - ${hour?.endTime || "18:00"}` : "Off"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Services & Portfolio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Services Table Card */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#eb7583]" />
                <h2 className="font-title text-lg font-bold text-gray-900">
                  Offered Services &amp; Pricing ({artist.services.length})
                </h2>
              </div>
            </div>

            {artist.services.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No services cataloged yet.
              </div>
            ) : (
              <div className="divide-y divide-gray-100 overflow-x-auto">
                {artist.services.map((service) => (
                  <div key={service.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          {service.subCategory?.name || service.category.name}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {service.category.name}
                        </span>
                      </div>
                      {service.description && (
                        <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                      )}
                      {service.durationMinutes && (
                        <span className="text-[11px] text-gray-400 mt-1 block">
                          Duration: {service.durationMinutes} mins
                        </span>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-bold text-sm text-[#1e1a19]">
                        ${service.priceFrom}
                        {service.priceTo ? ` - $${service.priceTo}` : ""}
                      </div>
                      <span className="text-[10px] uppercase font-mono text-gray-400">
                        {service.priceType.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Portfolio Media Gallery */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#eb7583]" />
                <h2 className="font-title text-lg font-bold text-gray-900">
                  Portfolio Gallery ({artist.portfolioItems.length})
                </h2>
              </div>
            </div>

            {artist.portfolioItems.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">
                No portfolio photos uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {artist.portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 group border border-gray-200/50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.mediaUrl}
                      alt={item.title || "Portfolio photo"}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                    {item.title && (
                      <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 text-white text-[11px] truncate">
                        {item.title}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <ArtistRejectModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        artistName={artist.user.name}
        businessName={artist.businessName}
      />
    </div>
  );
}
