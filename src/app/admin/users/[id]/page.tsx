"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CalendarCheck,
  Star,
  Heart,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Clock,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

interface BookingItem {
  id: string;
  bookingNumber: string;
  status: string;
  bookingDate: string;
  eventType?: string | null;
  artist: {
    id: string;
    businessName?: string | null;
    user: { name: string };
  };
  service?: {
    priceFrom: number;
    category: { name: string };
    subCategory?: { name: string } | null;
  } | null;
}

interface ReviewItem {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  artist: {
    id: string;
    businessName?: string | null;
    user: { name: string };
  };
}

interface FavoriteItem {
  id: string;
  createdAt: string;
  artist: {
    id: string;
    businessName?: string | null;
    user: { name: string; avatarUrl?: string | null; locationCity?: string | null };
  };
}

interface UserDossier {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "USER" | "ARTIST" | "ADMIN";
  avatarUrl?: string | null;
  locationCity?: string | null;
  locationState?: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  bookings: BookingItem[];
  reviews: ReviewItem[];
  favorites: FavoriteItem[];
  _count: {
    bookings: number;
    reviews: number;
    favorites: number;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  const [user, setUser] = useState<UserDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Delete modal
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load user account details.");
      }

      setUser(data.data);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading user account.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Handle Toggle Status
  const handleToggleStatus = async () => {
    if (!user) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${user.id}/toggle-status`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setUser((prev) => (prev ? { ...prev, isActive: !prev.isActive } : null));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!user) return;
    setDeleteError(null);

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error);

    router.push("/admin/users");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Accepted</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-36 bg-gray-200 rounded-md" />
        <div className="h-44 bg-white rounded-3xl border border-gray-100" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-white rounded-3xl border border-gray-100" />
          <div className="h-64 bg-white rounded-3xl border border-gray-100" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
        <h2 className="text-base font-bold text-gray-800">User Account Not Found</h2>
        <p className="text-xs text-gray-500 mt-1">This user may have been deleted.</p>
        <Link
          href="/admin/users"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#eb7583]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Users</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Breadcrumb Navigation (20-Point Polish Standard #9) */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link
          href="/admin/users"
          className="hover:text-[#eb7583] transition-colors flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Users</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-800 truncate">{user.name}</span>
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

      {/* Header Profile Dossier */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-2xl uppercase shadow-xs shrink-0">
            {user.name.substring(0, 2)}
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-title text-2xl sm:text-3xl font-bold text-[#1e1a19]">
                {user.name}
              </h1>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                  user.isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {user.isActive ? "Active Account" : "Suspended Account"}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {user.role}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1 font-medium text-gray-700">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span>{user.email}</span>
                {user.isEmailVerified && (
                  <span title="Verified email">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  </span>
                )}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{user.phone}</span>
                </span>
              )}
              {user.locationCity && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    {user.locationCity}
                    {user.locationState ? `, ${user.locationState}` : ""}
                  </span>
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          <Button
            variant="outline"
            onClick={handleToggleStatus}
            disabled={actionLoading}
            className="rounded-xl text-xs font-semibold h-10 px-4"
          >
            {user.isActive ? "Suspend Account" : "Reactivate Account"}
          </Button>

          {user.role !== "ADMIN" && (
            <Button
              variant="outline"
              onClick={() => {
                setDeleteError(null);
                setDeleteOpen(true);
              }}
              disabled={actionLoading}
              className="rounded-xl text-xs font-semibold h-10 px-4 text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Delete User</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Bookings + Reviews & Favorites */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bookings History */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#eb7583]" />
              <h2 className="font-title text-lg font-bold text-gray-900">
                Booking History ({user.bookings.length})
              </h2>
            </div>
          </div>

          {user.bookings.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">
              This client has not placed any booking requests yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {user.bookings.map((booking) => (
                <div key={booking.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-gray-900">
                        {booking.bookingNumber}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="text-xs text-gray-700 font-medium mt-1">
                      Artist: {booking.artist.businessName || booking.artist.user.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Service:{" "}
                      {booking.service?.subCategory?.name ||
                        booking.service?.category.name ||
                        booking.eventType ||
                        "Standard"}
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <div className="font-semibold text-gray-900">
                      Event Date: {new Date(booking.bookingDate).toLocaleDateString()}
                    </div>
                    {booking.service?.priceFrom && (
                      <span className="text-gray-500 block mt-0.5">
                        ${booking.service.priceFrom}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Reviews & Favorites */}
        <div className="space-y-6">
          {/* Reviews Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <h2 className="font-title text-lg font-bold text-gray-900">
                Submitted Reviews ({user.reviews.length})
              </h2>
            </div>

            {user.reviews.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No reviews submitted yet.
              </p>
            ) : (
              <div className="space-y-3">
                {user.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-2xl bg-gray-50 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-800">
                        {rev.artist.businessName || rev.artist.user.name}
                      </span>
                      <span className="font-bold text-amber-600 flex items-center gap-1">
                        ★ {rev.rating}
                      </span>
                    </div>
                    {rev.comment && <p className="text-gray-600 italic">&quot;{rev.comment}&quot;</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorites Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-400" />
              <h2 className="font-title text-lg font-bold text-gray-900">
                Saved Favorites ({user.favorites.length})
              </h2>
            </div>

            {user.favorites.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                No saved favorite artists.
              </p>
            ) : (
              <div className="space-y-2.5">
                {user.favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="flex items-center justify-between text-xs p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-800">
                      {fav.artist.businessName || fav.artist.user.name}
                    </span>
                    <span className="text-gray-400">{fav.artist.user.locationCity || ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete User Account"
        description="Are you sure you want to permanently delete this user account? All associated bookings, reviews, and favorites will be permanently removed."
        itemName={user.name}
        error={deleteError}
      />
    </div>
  );
}
