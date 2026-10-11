"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Sparkles,
  Plus,
  Clock,
  IndianRupee,
  Edit2,
  Trash2,
  CheckCircle2,
  Tag,
  ToggleLeft,
  ToggleRight,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceModal, ServiceFormData } from "@/components/artist/service-modal";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { cn } from "@/lib/utils";

interface ServiceItem {
  id: string;
  artistId: string;
  categoryId: string;
  subCategoryId: string | null;
  priceFrom: number;
  priceTo: number | null;
  priceType: "FIXED" | "STARTING_FROM" | "RANGE" | "NEGOTIABLE";
  description: string | null;
  durationMinutes: number | null;
  isActive: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  subCategory: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  subCategories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export default function ArtistServicesPage() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceFormData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const res = await fetch("/api/artist/services");
        const json = await res.json();

        if (json.success && json.data) {
          setServices(json.data.services || []);
          setCategories(json.data.categories || []);
        }
      } catch (err) {
        console.error("Failed to load services:", err);
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  const filteredServices = useMemo(() => {
    if (selectedCategory === "ALL") return services;
    return services.filter((s) => s.categoryId === selectedCategory);
  }, [services, selectedCategory]);

  const activeCount = useMemo(() => {
    return services.filter((s) => s.isActive).length;
  }, [services]);

  // Quick toggle active state
  async function handleToggleActive(service: ServiceItem) {
    const newStatus = !service.isActive;

    // Optimistic UI update
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, isActive: newStatus } : s))
    );

    try {
      const res = await fetch(`/api/artist/services/${service.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        // Rollback
        setServices((prev) =>
          prev.map((s) => (s.id === service.id ? { ...s, isActive: !newStatus } : s))
        );
      }
    } catch {
      // Rollback
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, isActive: !newStatus } : s))
      );
    }
  }

  // Delete Service
  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    const res = await fetch(`/api/artist/services/${deleteTarget.id}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to delete service.");
    }

    setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  function handleSaveSuccess(savedService: ServiceItem) {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === savedService.id);
      if (exists) {
        return prev.map((s) => (s.id === savedService.id ? savedService : s));
      }
      return [savedService, ...prev];
    });
  }

  function openCreateModal() {
    setEditingService(null);
    setModalOpen(true);
  }

  function openEditModal(service: ServiceItem) {
    setEditingService({
      id: service.id,
      categoryId: service.categoryId,
      subCategoryId: service.subCategoryId,
      priceType: service.priceType,
      priceFrom: service.priceFrom,
      priceTo: service.priceTo,
      durationMinutes: service.durationMinutes || 60,
      description: service.description,
      isActive: service.isActive,
    });
    setModalOpen(true);
  }

  function formatPriceDisplay(s: ServiceItem) {
    if (s.priceType === "NEGOTIABLE") {
      return "Price on Request";
    }
    if (s.priceType === "FIXED") {
      return `₹${s.priceFrom.toLocaleString("en-IN")}`;
    }
    if (s.priceType === "STARTING_FROM") {
      return `From ₹${s.priceFrom.toLocaleString("en-IN")}`;
    }
    if (s.priceType === "RANGE") {
      return `₹${s.priceFrom.toLocaleString("en-IN")} – ₹${(s.priceTo || s.priceFrom).toLocaleString("en-IN")}`;
    }
    return `₹${s.priceFrom.toLocaleString("en-IN")}`;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-64 animate-pulse rounded-md bg-neutral-200/70" />
        <div className="h-12 w-full rounded-xl animate-pulse bg-neutral-200/70" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 rounded-2xl animate-pulse bg-neutral-200/70" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900">
            Services & Pricing
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Define your bridal packages, event styling, and makeover rates. Transparent pricing attracts high-intent clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-neutral-100 text-neutral-800 border-neutral-200 py-1 px-3 text-xs">
            {activeCount} Active / {services.length} Total
          </Badge>

          <Button
            onClick={openCreateModal}
            className="bg-[#eb7583] hover:bg-[#d66573] text-white shadow-xs min-h-[44px] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border/60">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[40px] flex items-center gap-2",
            selectedCategory === "ALL"
              ? "bg-[#1e1a19] text-white shadow-xs"
              : "bg-white text-neutral-600 hover:text-neutral-900 border border-border"
          )}
        >
          <span>All Offerings</span>
          <span
            className={cn(
              "px-1.5 py-0.5 rounded-full text-[10px]",
              selectedCategory === "ALL"
                ? "bg-white/20 text-white"
                : "bg-neutral-100 text-neutral-600"
            )}
          >
            {services.length}
          </span>
        </button>

        {categories.map((cat) => {
          const count = services.filter((s) => s.categoryId === cat.id).length;
          if (count === 0 && selectedCategory !== cat.id) return null;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors min-h-[40px] flex items-center gap-2",
                selectedCategory === cat.id
                  ? "bg-[#1e1a19] text-white shadow-xs"
                  : "bg-white text-neutral-600 hover:text-neutral-900 border border-border"
              )}
            >
              <span>{cat.name}</span>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px]",
                  selectedCategory === cat.id
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-600"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Services Grid or Empty State */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-border p-12 text-center max-w-lg mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-base font-semibold text-neutral-900">
            {selectedCategory === "ALL"
              ? "No Services Configured Yet"
              : "No services under this category"}
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Add bridal makeovers, party glam, or photography packages to allow clients to send you direct inquiries.
          </p>
          <Button
            onClick={openCreateModal}
            className="bg-[#eb7583] hover:bg-[#d66573] text-white min-h-[44px] shadow-xs mt-2"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add First Service
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => {
            const displayName = service.subCategory?.name || service.category?.name || "Service";

            return (
              <div
                key={service.id}
                className={cn(
                  "bg-white rounded-2xl border p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between relative",
                  service.isActive ? "border-border/90" : "border-neutral-200 bg-neutral-50/50 opacity-75"
                )}
              >
                <div>
                  {/* Top Bar: Category badge & Active Toggle */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-semibold tracking-wider text-[#eb7583] bg-[#fcf1ef] px-2 py-0.5 rounded-full uppercase border border-[#eb7583]/20">
                      {service.category?.name}
                    </span>

                    <button
                      onClick={() => handleToggleActive(service)}
                      className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors p-1 rounded-md"
                      title={service.isActive ? "Click to disable" : "Click to activate"}
                    >
                      <span className="text-[11px] text-muted-foreground">
                        {service.isActive ? "Active" : "Paused"}
                      </span>
                      {service.isActive ? (
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-neutral-400" />
                      )}
                    </button>
                  </div>

                  {/* Service Title */}
                  <h3 className="font-serif text-lg font-bold text-neutral-900 leading-tight">
                    {displayName}
                  </h3>

                  {/* Price & Duration Strip */}
                  <div className="flex flex-wrap items-center gap-3 mt-2.5 mb-3 text-sm">
                    <div className="font-bold text-base text-[#1e1a19]">
                      {formatPriceDisplay(service)}
                    </div>
                    {service.durationMinutes && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground bg-neutral-100 px-2 py-0.5 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{service.durationMinutes} mins</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {service.description && (
                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(service)}
                    className="text-xs min-h-[36px] flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(service)}
                    className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 min-h-[36px] flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Service Modal (Add & Edit) */}
      <ServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        categories={categories}
        initialData={editingService}
        onSuccess={handleSaveSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Service Offering"
        description="Are you sure you want to remove this service? Clients will no longer be able to select it when sending booking requests."
        itemName={deleteTarget?.subCategory?.name || deleteTarget?.category?.name || "Service"}
      />
    </div>
  );
}
