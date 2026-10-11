"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Star,
  RotateCw,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  MessageSquare,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  photos: string[];
  isApproved: boolean;
  artistReply?: string | null;
  artistReplyAt?: string | null;
  createdAt: string;
  clientName: string;
  clientEmail: string;
  clientAvatar?: string | null;
  artistId: string;
  artistName: string;
}

interface ReviewCounts {
  all: number;
  pending: number;
  approved: number;
  averageRating: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [counts, setCounts] = useState<ReviewCounts>({
    all: 0,
    pending: 0,
    approved: 0,
    averageRating: 5.0,
  });
  const [activeTab, setActiveTab] = useState<string>("PENDING");
  const [selectedRating, setSelectedRating] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Photo viewer modal state
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (activeTab !== "ALL") {
        params.set("status", activeTab);
      }
      if (selectedRating !== "ALL") {
        params.set("rating", selectedRating);
      }
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await fetch(`/api/admin/reviews?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setReviews(json.data.reviews || []);
        if (json.data.counts) {
          setCounts(json.data.counts);
        }
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages || 1);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedRating, search, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleToggleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/approve`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (json.success) {
        await fetchReviews();
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/admin/reviews/${deleteId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDeleteId(null);
        await fetchReviews();
      }
    } catch {
      // ignore
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e1a19] tracking-tight">
            Reviews Moderation
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review, verify, and moderate client feedback and ratings left on artist profiles
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchReviews()}
            className="rounded-xl h-11 border-border text-[#1e1a19] hover:bg-neutral-100"
          >
            <RotateCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Total Reviews</p>
            <p className="text-2xl font-serif font-bold text-[#1e1a19] mt-0.5">{counts.all}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#fcf1ef] flex items-center justify-center text-[#eb7583]">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Pending Approval</p>
            <p className="text-2xl font-serif font-bold text-amber-600 mt-0.5">{counts.pending}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Platform Rating</p>
            <p className="text-2xl font-serif font-bold text-amber-500 mt-0.5">
              {counts.averageRating.toFixed(1)} ★
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Moderation Status Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "PENDING", label: "Pending Approval", count: counts.pending },
            { id: "APPROVED", label: "Approved Reviews", count: counts.approved },
            { id: "ALL", label: "All Reviews", count: counts.all },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setPage(1);
              }}
              className={`px-4 py-2 text-xs md:text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-[#eb7583] text-white shadow-xs font-semibold"
                  : "bg-white text-muted-foreground hover:text-[#1e1a19] hover:bg-neutral-100 border border-border/60"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Rating Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            Rating:
          </span>
          <select
            value={selectedRating}
            onChange={(e) => {
              setSelectedRating(e.target.value);
              setPage(1);
            }}
            className="h-10 px-3 rounded-xl border border-input bg-white text-xs text-[#1e1a19] outline-hidden focus:border-[#eb7583]"
          >
            <option value="ALL">All Stars</option>
            <option value="5">5 Stars only</option>
            <option value="4">4 Stars only</option>
            <option value="3">3 Stars only</option>
            <option value="2">2 Stars only</option>
            <option value="1">1 Star only</option>
          </select>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3.5 rounded-2xl border border-border shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search reviews by customer name, artist name, or keywords in comment..."
            className="pl-10 text-base md:text-sm border-0 focus-visible:ring-0 shadow-none bg-transparent"
          />
        </div>
      </div>

      {/* Review Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-border p-6 animate-pulse space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 bg-neutral-200 rounded-sm w-1/4"></div>
                <div className="h-4 bg-neutral-200 rounded-sm w-20"></div>
              </div>
              <div className="h-12 bg-neutral-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#fcf1ef] flex items-center justify-center text-[#eb7583] mb-4">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1e1a19]">No Reviews Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {search
              ? "No client reviews matched your search criteria."
              : activeTab === "PENDING"
              ? "All submitted client reviews have been moderated. Good job!"
              : "No reviews found in this category."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50/75 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Client & Artist</th>
                  <th className="px-5 py-3.5">Rating & Review</th>
                  <th className="px-5 py-3.5">Photos</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-4 align-top">
                      <div className="space-y-1 min-w-48">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-neutral-100 overflow-hidden shrink-0 flex items-center justify-center border border-border">
                            {rev.clientAvatar ? (
                              <img
                                src={rev.clientAvatar}
                                alt={rev.clientName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-4 h-4 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-[#1e1a19]">{rev.clientName}</p>
                            <p className="text-[11px] text-muted-foreground truncate max-w-36">
                              {rev.clientEmail}
                            </p>
                          </div>
                        </div>
                        <div className="pt-1.5 text-xs text-neutral-600">
                          <span className="text-muted-foreground">For: </span>
                          <Link
                            href={`/admin/artists/${rev.artistId}`}
                            className="font-medium text-[#eb7583] hover:underline"
                          >
                            {rev.artistName}
                          </Link>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 align-top max-w-md">
                      <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-neutral-200"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-semibold text-neutral-700 ml-1">
                          {rev.rating}.0
                        </span>
                      </div>
                      <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
                        {rev.comment || <span className="italic text-muted-foreground">No written comment</span>}
                      </p>
                      {rev.artistReply && (
                        <div className="mt-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px]">
                          <span className="font-semibold text-neutral-800">Artist Reply: </span>
                          <span className="text-neutral-600">{rev.artistReply}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-5 py-4 align-top">
                      {rev.photos && rev.photos.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 max-w-28">
                          {rev.photos.map((photo, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActivePhoto(photo)}
                              className="w-9 h-9 rounded-lg overflow-hidden border border-border bg-neutral-100 hover:scale-105 transition-transform"
                            >
                              <img
                                src={photo}
                                alt="Review"
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">None</span>
                      )}
                    </td>

                    <td className="px-5 py-4 align-top text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 align-top whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          rev.isApproved
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {rev.isApproved ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approved</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </>
                        )}
                      </span>
                    </td>

                    <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleApprove(rev.id)}
                          className={`h-8 px-2.5 text-xs font-medium rounded-lg ${
                            rev.isApproved
                              ? "text-neutral-600 hover:bg-neutral-100 border-border"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                          }`}
                        >
                          {rev.isApproved ? "Unapprove" : "Approve"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(rev.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl border border-border p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-neutral-100 overflow-hidden shrink-0 flex items-center justify-center border border-border">
                      {rev.clientAvatar ? (
                        <img
                          src={rev.clientAvatar}
                          alt={rev.clientName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-[#1e1a19]">{rev.clientName}</p>
                      <p className="text-[11px] text-muted-foreground truncate max-w-44">
                        For: <span className="font-medium text-[#eb7583]">{rev.artistName}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      rev.isApproved
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {rev.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-neutral-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs font-semibold text-neutral-700 ml-1">
                    {rev.rating}.0
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {rev.comment}
                </p>

                {/* Photos */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rev.photos.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActivePhoto(photo)}
                        className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-neutral-100"
                      >
                        <img
                          src={photo}
                          alt="Review"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Mobile Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleApprove(rev.id)}
                    className={`h-10 px-4 text-xs font-medium rounded-xl ${
                      rev.isApproved
                        ? "text-neutral-700 border-border"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 border-transparent"
                    }`}
                  >
                    {rev.isApproved ? "Unapprove" : "Approve Review"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(rev.id)}
                    className="h-10 px-3 rounded-xl text-xs text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-border shadow-xs">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl h-10 px-3"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl h-10 px-3"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Photo Viewer Modal */}
      {activePhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div className="relative max-w-2xl max-h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activePhoto}
              alt="Review attachment preview"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Review"
        description="Are you sure you want to permanently delete this client review? The artist's average rating and total review counts will be automatically recalculated."
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
