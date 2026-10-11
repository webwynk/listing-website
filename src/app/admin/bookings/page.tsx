"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  Search,
  RotateCw,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BookingListItem {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  eventDate: string;
  eventTime?: string | null;
  eventType?: string | null;
  eventLocation?: string | null;
  numberOfPeople: number;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED" | "REJECTED";
  adminNotes?: string | null;
  totalAmount: number | null;
  artistId: string;
  artistName: string;
  serviceName: string;
  createdAt: string;
}

interface BookingCounts {
  all: number;
  pending: number;
  accepted: number;
  completed: number;
  cancelled: number;
  rejected: number;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [counts, setCounts] = useState<BookingCounts>({
    all: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    cancelled: 0,
    rejected: 0,
  });
  const [statusTab, setStatusTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (statusTab !== "ALL") params.append("status", statusTab);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load bookings.");
      }

      setBookings(data.data?.bookings || []);
      if (data.data?.counts) setCounts(data.data.counts);
      if (data.pagination) setTotalPages(data.pagination.totalPages || 1);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading bookings.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusTab, search, page]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Handle Quick Status Update
  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      fetchBookings(true);
    } catch (err: any) {
      setError(err.message);
    }
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
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>Pending Action</span>
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <XCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      default:
        return <span className="text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="font-title text-2xl md:text-3xl font-bold text-[#1e1a19]">
            Bookings &amp; Lead Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Admin Lead Center — Full client contact coordinates and artist bookings
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchBookings(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs min-h-[40px] disabled:opacity-50"
            title="Refresh list"
          >
            <RotateCw
              className={`w-3.5 h-3.5 text-gray-500 ${refreshing ? "animate-spin text-[#eb7583]" : ""}`}
            />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-100 overflow-x-auto pb-1 text-xs">
        {[
          { key: "ALL", label: "All Bookings", count: counts.all },
          { key: "PENDING", label: "Pending", count: counts.pending, highlight: counts.pending > 0 },
          { key: "ACCEPTED", label: "Accepted", count: counts.accepted },
          { key: "COMPLETED", label: "Completed", count: counts.completed },
          { key: "CANCELLED", label: "Cancelled", count: counts.cancelled },
          { key: "REJECTED", label: "Rejected", count: counts.rejected },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setStatusTab(tab.key);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 -mb-[2px] ${
              statusTab === tab.key
                ? "border-[#eb7583] text-[#eb7583] bg-[#eb7583]/5"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                tab.highlight
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : statusTab === tab.key
                  ? "bg-[#eb7583] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by booking #, client, phone, or artist..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-xs font-bold text-rose-700 hover:text-rose-900"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-pulse space-y-4">
          <div className="h-6 w-44 bg-gray-100 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-xl" />
            ))}
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            {search ? "No bookings match your query" : "No bookings found in this view"}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {search
              ? "Try searching for a different name, booking number, or phone number."
              : "When users book an artist service, full lead records will appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6">Booking #</th>
                  <th className="py-3 px-6">Client / Contact (Privileged)</th>
                  <th className="py-3 px-6">Artist</th>
                  <th className="py-3 px-6">Service &amp; Event Date</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* Booking Number */}
                    <td className="py-4 px-6 font-mono text-xs font-semibold text-gray-900">
                      {b.bookingNumber}
                    </td>

                    {/* Client & Contact (Admin Privacy Protected) */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900 text-sm">
                        {b.customerName}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        {b.customerPhone && (
                          <a
                            href={`tel:${b.customerPhone}`}
                            className="flex items-center gap-1 hover:text-[#eb7583] transition-colors"
                            title="Call client directly"
                          >
                            <Phone className="w-3 h-3 text-gray-400" />
                            <span>{b.customerPhone}</span>
                          </a>
                        )}
                        {b.customerEmail && (
                          <a
                            href={`mailto:${b.customerEmail}`}
                            className="flex items-center gap-1 hover:text-[#eb7583] transition-colors"
                            title="Email client directly"
                          >
                            <Mail className="w-3 h-3 text-gray-400" />
                            <span className="truncate max-w-[130px]">
                              {b.customerEmail}
                            </span>
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Artist */}
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/artists/${b.artistId}`}
                        className="font-medium text-gray-900 hover:text-[#eb7583] transition-colors"
                      >
                        {b.artistName}
                      </Link>
                    </td>

                    {/* Service & Event Date */}
                    <td className="py-4 px-6 text-xs text-gray-600">
                      <div className="font-semibold text-gray-900">
                        {b.serviceName}
                      </div>
                      <div className="text-gray-500 mt-0.5 flex items-center gap-1">
                        <span>Event: {b.eventDate}</span>
                        {b.eventTime && <span>({b.eventTime})</span>}
                      </div>
                      {b.eventLocation && (
                        <div className="text-gray-400 truncate max-w-[180px] mt-0.5">
                          📍 {b.eventLocation}
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">{getStatusBadge(b.status)}</td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dossier</span>
                        </Link>

                        {b.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(b.id, "ACCEPTED")}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                              title="Accept booking lead"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(b.id, "REJECTED")}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition-colors"
                              title="Reject booking lead"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {b.status === "ACCEPTED" && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, "COMPLETED")}
                            className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-semibold transition-colors"
                            title="Mark as completed"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (20-Point Polish Standard #11) */}
          <div className="lg:hidden divide-y divide-gray-100">
            {bookings.map((b) => (
              <div key={b.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-gray-900">
                    {b.bookingNumber}
                  </span>
                  {getStatusBadge(b.status)}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {b.customerName}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Artist: <span className="font-medium text-gray-700">{b.artistName}</span>
                  </p>
                </div>

                <div className="bg-gray-50 p-2.5 rounded-xl text-xs space-y-1 text-gray-600">
                  <div>
                    <span className="text-gray-400">Service:</span> {b.serviceName}
                  </div>
                  <div>
                    <span className="text-gray-400">Event Date:</span> {b.eventDate}
                  </div>
                  {b.eventLocation && (
                    <div className="truncate">
                      <span className="text-gray-400">Venue:</span> {b.eventLocation}
                    </div>
                  )}
                </div>

                {/* Direct Action Call/Email links for Admin */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  {b.customerPhone && (
                    <a
                      href={`tel:${b.customerPhone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
                    >
                      <Phone className="w-3.5 h-3.5 text-gray-500" />
                      <span>Call Client</span>
                    </a>
                  )}
                  {b.customerEmail && (
                    <a
                      href={`mailto:${b.customerEmail}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
                    >
                      <Mail className="w-3.5 h-3.5 text-gray-500" />
                      <span>Email</span>
                    </a>
                  )}
                  <Link
                    href={`/admin/bookings/${b.id}`}
                    className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#eb7583]"
                  >
                    <span>Dossier</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-lg h-8"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  <span>Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-lg h-8"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
