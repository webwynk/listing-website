"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Tag,
  DollarSign,
  FileText,
  Save,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingDossier {
  id: string;
  bookingNumber: string;
  userName: string;
  userPhone?: string | null;
  userEmail?: string | null;
  bookingDate: string;
  bookingTime?: string | null;
  eventType?: string | null;
  eventLocation?: string | null;
  requirements?: string | null;
  numberOfPeople: number;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED" | "REJECTED";
  rejectionReason?: string | null;
  adminNotes?: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
    locationCity?: string | null;
  };
  artist: {
    id: string;
    businessName?: string | null;
    bio?: string | null;
    avgRating: number;
    totalReviews: number;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string | null;
      avatarUrl?: string | null;
    };
  };
  service?: {
    id: string;
    priceFrom: number;
    priceTo?: number | null;
    priceType: string;
    durationMinutes?: number | null;
    category: { id: string; name: string };
    subCategory?: { id: string; name: string } | null;
  } | null;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const [booking, setBooking] = useState<BookingDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesSuccess, setNotesSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load booking dossier.");
      }

      setBooking(data.data);
      setAdminNotes(data.data.adminNotes || "");
    } catch (err: any) {
      setError(err.message || "An error occurred while loading booking.");
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  // Handle Status Update
  const handleStatusChange = async (newStatus: string) => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      fetchBooking();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Save Admin Notes
  const handleSaveNotes = async () => {
    setNotesSaving(true);
    setNotesSuccess(false);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: adminNotes }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);

      setNotesSuccess(true);
      setTimeout(() => setNotesSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setNotesSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accepted</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Action</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-white rounded-3xl border border-gray-100" />
          <div className="h-64 bg-white rounded-3xl border border-gray-100" />
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
        <h2 className="text-base font-bold text-gray-800">Booking Not Found</h2>
        <p className="text-xs text-gray-500 mt-1">This booking record may have been deleted.</p>
        <Link
          href="/admin/bookings"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#eb7583]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bookings</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link
          href="/admin/bookings"
          className="hover:text-[#eb7583] transition-colors flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Bookings</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-gray-800 font-mono">
          {booking.bookingNumber}
        </span>
      </nav>

      {/* Global Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Header Dossier */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-[#eb7583]/10 text-[#eb7583] flex items-center justify-center font-bold shadow-xs shrink-0">
            <CalendarCheck className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-title text-2xl sm:text-3xl font-bold text-[#1e1a19] font-mono">
                {booking.bookingNumber}
              </h1>
              {getStatusBadge(booking.status)}
            </div>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Received on{" "}
              {new Date(booking.createdAt).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Status Transition Actions */}
        <div className="flex items-center gap-2 flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-gray-100">
          {booking.status === "PENDING" && (
            <>
              <Button
                onClick={() => handleStatusChange("ACCEPTED")}
                disabled={actionLoading}
                className="rounded-xl text-xs font-semibold h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Booking</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatusChange("REJECTED")}
                disabled={actionLoading}
                className="rounded-xl text-xs font-semibold h-10 px-4 text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <XCircle className="w-4 h-4 mr-1" />
                <span>Reject</span>
              </Button>
            </>
          )}

          {booking.status === "ACCEPTED" && (
            <>
              <Button
                onClick={() => handleStatusChange("COMPLETED")}
                disabled={actionLoading}
                className="rounded-xl text-xs font-semibold h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Completed</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatusChange("CANCELLED")}
                disabled={actionLoading}
                className="rounded-xl text-xs font-semibold h-10 px-4 text-gray-600 hover:bg-gray-100"
              >
                <XCircle className="w-4 h-4 mr-1" />
                <span>Cancel</span>
              </Button>
            </>
          )}

          {(booking.status === "COMPLETED" ||
            booking.status === "CANCELLED" ||
            booking.status === "REJECTED") && (
            <Button
              variant="outline"
              onClick={() => handleStatusChange("PENDING")}
              disabled={actionLoading}
              className="rounded-xl text-xs font-semibold h-10 px-4 text-gray-700 border-gray-200 hover:bg-gray-50"
            >
              <span>Reopen to Pending</span>
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Client Lead + Artist Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Lead Dossier (Admin Privileged Lead Data) */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-title text-lg font-bold text-gray-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#eb7583]" />
              <span>Client Lead Information (Privileged)</span>
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Admin Eyes Only
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">
                Client Full Name
              </span>
              <span className="font-bold text-gray-900 text-sm">{booking.userName}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">
                  Phone Number
                </span>
                {booking.userPhone ? (
                  <a
                    href={`tel:${booking.userPhone}`}
                    className="inline-flex items-center gap-1.5 font-bold text-[#eb7583] hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{booking.userPhone}</span>
                  </a>
                ) : (
                  <span className="text-gray-400 italic">No phone provided</span>
                )}
              </div>

              <div>
                <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">
                  Email Address
                </span>
                {booking.userEmail ? (
                  <a
                    href={`mailto:${booking.userEmail}`}
                    className="inline-flex items-center gap-1.5 font-bold text-[#eb7583] hover:underline truncate max-w-full"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{booking.userEmail}</span>
                  </a>
                ) : (
                  <span className="text-gray-400 italic">No email provided</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">
                Event Venue / Location
              </span>
              <div className="flex items-start gap-1.5 font-medium text-gray-800">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <span>{booking.eventLocation || "Location to be confirmed with client"}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">
                  Guest Count
                </span>
                <span className="font-semibold text-gray-800">
                  {booking.numberOfPeople} Person{booking.numberOfPeople > 1 ? "s" : ""}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">
                  Event Category
                </span>
                <span className="font-semibold text-gray-800">
                  {booking.eventType || "Appointment"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Artist Dossier */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-title text-lg font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#eb7583]" />
              <span>Assigned Artist</span>
            </h2>
            <Link
              href={`/admin/artists/${booking.artist.id}`}
              className="text-xs font-semibold text-[#eb7583] hover:underline flex items-center gap-1"
            >
              <span>View Profile</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">
                Business / Artist Name
              </span>
              <span className="font-bold text-gray-900 text-sm">
                {booking.artist.businessName || booking.artist.user.name}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">
                  Artist Owner
                </span>
                <span className="font-medium text-gray-800">{booking.artist.user.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px] uppercase tracking-wider mb-0.5">
                  Artist Contact
                </span>
                <span className="font-medium text-gray-800">{booking.artist.user.phone || booking.artist.user.email}</span>
              </div>
            </div>

            {booking.service && (
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-gray-400 block text-[11px] uppercase tracking-wider">
                  Booked Service
                </span>
                <div className="font-bold text-gray-900 text-sm flex items-center justify-between">
                  <span>
                    {booking.service.subCategory?.name || booking.service.category.name}
                  </span>
                  <span className="text-emerald-700">
                    ${booking.service.priceFrom}
                    {booking.service.priceTo ? ` - $${booking.service.priceTo}` : ""}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500">
                  Category: {booking.service.category.name} · Type: {booking.service.priceType}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Requirements & Admin Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Client Special Requirements */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
          <h2 className="font-title text-lg font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span>Client Notes &amp; Requirements</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {booking.requirements || "No specific instructions or requirements were provided by the client."}
          </p>
        </div>

        {/* Private Administrator Notes */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="font-title text-lg font-bold text-gray-900 flex items-center gap-2">
              <Save className="w-4 h-4 text-[#eb7583]" />
              <span>Admin Internal Coordination Notes</span>
            </h2>
            {notesSuccess && (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved</span>
              </span>
            )}
          </div>

          <textarea
            rows={4}
            placeholder="Record phone calls with client, artist confirmation dates, or payment lead agreements..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            disabled={notesSaving}
            className="w-full rounded-2xl border border-gray-200 p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#eb7583] focus:border-transparent transition-all resize-none"
          />

          <div className="flex justify-end pt-1">
            <Button
              onClick={handleSaveNotes}
              disabled={notesSaving}
              className="rounded-xl text-xs font-semibold px-4 py-2 bg-[#1e1a19] hover:bg-black text-white flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{notesSaving ? "Saving..." : "Save Admin Notes"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
