"use client";

import { useEffect, useState, useCallback } from "react";
import {
  MessageSquareQuote,
  Plus,
  RotateCw,
  Star,
  User,
  MapPin,
  Tag,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TestimonialModal,
  TestimonialFormData,
} from "@/components/admin/testimonial-modal";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { StoredTestimonial } from "@/app/api/admin/testimonials/route";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<StoredTestimonial[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<TestimonialFormData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/testimonials");
      const json = await res.json();
      if (json.success) {
        setTestimonials(json.data.testimonials || []);
        setTotalCount(json.data.total || 0);
        setActiveCount(json.data.activeCount || 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleCreateOrUpdate = async (formData: TestimonialFormData) => {
    const isEdit = Boolean(formData.id);
    const url = isEdit
      ? `/api/admin/testimonials/${formData.id}`
      : "/api/admin/testimonials";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to save testimonial.");
    }

    await fetchTestimonials();
  };

  const handleToggle = async (item: StoredTestimonial) => {
    try {
      const updated: TestimonialFormData = {
        id: item.id,
        clientName: item.clientName,
        clientRole: item.clientRole,
        clientLocation: item.clientLocation,
        avatarUrl: item.avatarUrl,
        rating: item.rating,
        reviewText: item.reviewText,
        serviceCategory: item.serviceCategory,
        isActive: !item.isActive,
        sortOrder: item.sortOrder,
      };

      const res = await fetch(`/api/admin/testimonials/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      const json = await res.json();
      if (json.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, isActive: !t.isActive } : t))
        );
        setActiveCount((prev) => (item.isActive ? prev - 1 : prev + 1));
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/admin/testimonials/${deleteId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDeleteId(null);
        await fetchTestimonials();
      }
    } catch {
      // ignore
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      t.clientName.toLowerCase().includes(term) ||
      t.clientRole?.toLowerCase().includes(term) ||
      t.clientLocation?.toLowerCase().includes(term) ||
      t.reviewText.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e1a19] tracking-tight">
            Client Testimonials
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curate authentic client testimonials and wedding stories showcased on the homepage
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTestimonials()}
            className="rounded-xl h-11 border-border text-[#1e1a19] hover:bg-neutral-100"
          >
            <RotateCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => {
              setEditingTestimonial(null);
              setModalOpen(true);
            }}
            className="bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl h-11 px-5 shadow-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </div>
      </div>

      {/* Stats and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Total Quotes</p>
            <p className="text-2xl font-serif font-bold text-[#1e1a19] mt-0.5">{totalCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#fcf1ef] flex items-center justify-center text-[#eb7583]">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Active on Home</p>
            <p className="text-2xl font-serif font-bold text-emerald-600 mt-0.5">{activeCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-border shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold">Average Rating</p>
            <p className="text-2xl font-serif font-bold text-amber-500 mt-0.5">5.0 ★</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-3.5 rounded-2xl border border-border shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search testimonials by client name, quote, or location..."
            className="pl-10 text-base md:text-sm border-0 focus-visible:ring-0 shadow-none bg-transparent"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-border p-6 animate-pulse space-y-4 shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-200 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-neutral-200 rounded-sm w-1/3"></div>
                  <div className="h-3 bg-neutral-100 rounded-sm w-1/4"></div>
                </div>
              </div>
              <div className="h-16 bg-neutral-100 rounded-xl"></div>
            </div>
          ))}
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#fcf1ef] flex items-center justify-center text-[#eb7583] mb-4">
            <MessageSquareQuote className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1e1a19]">No Testimonials Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {search
              ? "No testimonials matched your search query."
              : "No client testimonials added yet. Click below to add your first client story."}
          </p>
          <Button
            onClick={() => {
              setEditingTestimonial(null);
              setModalOpen(true);
            }}
            className="mt-5 bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl px-5 h-11"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-border p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#eb7583]/40 transition-colors"
            >
              <div>
                {/* Top header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 border border-border shrink-0 flex items-center justify-center">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.clientName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <User className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-[#1e1a19]">
                        {item.clientName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-0.5">
                        {item.clientRole && <span>{item.clientRole}</span>}
                        {item.clientLocation && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {item.clientLocation}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingTestimonial(item);
                        setModalOpen(true);
                      }}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-[#1e1a19] rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(item.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Rating & Service Category */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= item.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                  {item.serviceCategory && (
                    <span className="text-xs font-medium text-[#eb7583] bg-[#fcf1ef] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {item.serviceCategory}
                    </span>
                  )}
                </div>

                {/* Quote */}
                <p className="text-sm text-neutral-600 mt-3 italic leading-relaxed line-clamp-4">
                  "{item.reviewText}"
                </p>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <span className="text-xs text-muted-foreground font-mono">
                  Order #{item.sortOrder}
                </span>

                <button
                  onClick={() => handleToggle(item)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                    item.isActive
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {item.isActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Live on Home</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Hidden</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <TestimonialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingTestimonial}
      />

      <DeleteConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Testimonial"
        description="Are you sure you want to remove this testimonial? It will no longer appear on the public website."
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
