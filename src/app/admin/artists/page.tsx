"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RotateCw,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Star,
  MapPin,
  Tag,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArtistRejectModal } from "@/components/admin/artist-reject-modal";

interface ArtistListItem {
  id: string;
  userId: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  emailVerified: boolean;
  avatarUrl?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  isFeatured: boolean;
  avgRating: number;
  totalReviews: number;
  totalBookings: number;
  experienceYears: number;
  primaryCategory: string;
  servicesCount: number;
  portfolioCount: number;
  createdAt: string;
  approvedAt?: string | null;
}

interface TabCounts {
  all: number;
  pending: number;
  approved: number;
  rejected: number;
  suspended: number;
}

export default function AdminArtistsPage() {
  const [artists, setArtists] = useState<ArtistListItem[]>([]);
  const [counts, setCounts] = useState<TabCounts>({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    suspended: 0,
  });
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetArtist, setTargetArtist] = useState<ArtistListItem | null>(null);

  const fetchArtists = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (activeTab !== "ALL") params.append("status", activeTab);
      if (search.trim()) params.append("search", search.trim());

      const res = await fetch(`/api/admin/artists?${params.toString()}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load artists.");
      }

      setArtists(data.data?.artists || []);
      if (data.data?.counts) setCounts(data.data.counts);
      if (data.pagination) setTotalPages(data.pagination.totalPages || 1);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading artists.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, search, page]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  // Handle Quick Approve
  const handleApprove = async (artistId: string) => {
    try {
      const res = await fetch(`/api/admin/artists/${artistId}/approve`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to approve artist.");
      fetchArtists(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Quick Suspend
  const handleSuspend = async (artistId: string) => {
    try {
      const res = await fetch(`/api/admin/artists/${artistId}/suspend`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to toggle suspension.");
      fetchArtists(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Quick Feature
  const handleFeature = async (artistId: string) => {
    try {
      const res = await fetch(`/api/admin/artists/${artistId}/feature`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to toggle featured status.");
      fetchArtists(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Confirm Reject
  const handleConfirmReject = async (reason: string) => {
    if (!targetArtist) return;
    const res = await fetch(`/api/admin/artists/${targetArtist.id}/reject`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || "Failed to reject artist.");
    fetchArtists(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Approved</span>
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
            <Clock className="w-3 h-3" />
            <span>Pending Review</span>
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
            <AlertTriangle className="w-3 h-3" />
            <span>Suspended</span>
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
            Artist Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Verify credentials, approve artist registrations, and manage listings
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchArtists(true)}
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

      {/* Status Tabs (20-Point Polish Standard #15) */}
      <div className="flex items-center gap-2 border-b border-gray-100 overflow-x-auto pb-1 text-xs">
        {[
          { key: "ALL", label: "All Artists", count: counts.all },
          { key: "PENDING", label: "Pending Approval", count: counts.pending, highlight: counts.pending > 0 },
          { key: "APPROVED", label: "Approved", count: counts.approved },
          { key: "REJECTED", label: "Rejected", count: counts.rejected },
          { key: "SUSPENDED", label: "Suspended", count: counts.suspended },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setPage(1);
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 font-semibold rounded-t-xl transition-all whitespace-nowrap border-b-2 -mb-[2px] ${
              activeTab === tab.key
                ? "border-[#eb7583] text-[#eb7583] bg-[#eb7583]/5"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                tab.highlight
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : activeTab === tab.key
                  ? "bg-[#eb7583] text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search by business, name, email, or city..."
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
      ) : artists.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            {search ? "No artists match your query" : "No artists found in this view"}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {search
              ? "Try adjusting your search criteria."
              : activeTab === "PENDING"
              ? "All pending artist applications have been reviewed. Great work!"
              : "Registered artist profiles will be displayed here."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6">Artist / Business</th>
                  <th className="py-3 px-6">Category &amp; Location</th>
                  <th className="py-3 px-6">Experience &amp; Portfolio</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Featured</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {artists.map((artist) => (
                  <tr
                    key={artist.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* Business & Owner Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#eb7583]/10 text-[#eb7583] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {artist.businessName ? artist.businessName.substring(0, 2) : "AR"}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                            <span>{artist.businessName}</span>
                            {artist.emailVerified && (
                              <span title="Verified email">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {artist.ownerName} · <span className="font-mono">{artist.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Location */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 font-medium text-gray-900 text-xs">
                        <Tag className="w-3 h-3 text-[#eb7583]" />
                        <span>{artist.primaryCategory}</span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{artist.city || "Location not set"}</span>
                      </div>
                    </td>

                    {/* Stats & Portfolio */}
                    <td className="py-4 px-6 text-xs text-gray-600">
                      <div>{artist.experienceYears} yrs experience</div>
                      <div className="text-gray-400 mt-0.5">
                        {artist.servicesCount} services · {artist.portfolioCount} photos
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">{getStatusBadge(artist.status)}</td>

                    {/* Featured Toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleFeature(artist.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          artist.isFeatured
                            ? "text-amber-500 hover:text-amber-600 bg-amber-50"
                            : "text-gray-300 hover:text-gray-500 hover:bg-gray-100"
                        }`}
                        title={artist.isFeatured ? "Featured artist (Click to remove)" : "Click to feature"}
                      >
                        <Star className={`w-4 h-4 ${artist.isFeatured ? "fill-amber-400" : ""}`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/artists/${artist.id}`}
                          className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </Link>

                        {artist.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(artist.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                              title="Approve artist application"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => {
                                setTargetArtist(artist);
                                setRejectModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-semibold transition-colors"
                              title="Reject artist application"
                            >
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {artist.status === "APPROVED" && (
                          <button
                            onClick={() => handleSuspend(artist.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors text-xs"
                            title="Suspend artist"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {artist.status === "SUSPENDED" && (
                          <button
                            onClick={() => handleSuspend(artist.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-colors"
                            title="Reactivate artist"
                          >
                            Reactivate
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
            {artists.map((artist) => (
              <div key={artist.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#eb7583]/10 text-[#eb7583] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                      {artist.businessName ? artist.businessName.substring(0, 2) : "AR"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {artist.businessName}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {artist.ownerName} ({artist.email})
                      </p>
                    </div>
                  </div>

                  {getStatusBadge(artist.status)}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 p-2.5 rounded-xl">
                  <span>{artist.primaryCategory}</span>
                  <span>{artist.city || "No location"}</span>
                  <span>{artist.experienceYears} yrs</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-50">
                  <Link
                    href={`/admin/artists/${artist.id}`}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700"
                  >
                    Review Dossier
                  </Link>
                  {artist.status === "PENDING" && (
                    <button
                      onClick={() => handleApprove(artist.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                    >
                      Approve
                    </button>
                  )}
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

      {/* Reject Modal */}
      <ArtistRejectModal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        artistName={targetArtist?.ownerName || "Artist"}
        businessName={targetArtist?.businessName}
      />
    </div>
  );
}
