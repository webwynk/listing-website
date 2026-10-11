"use client";

import { useState, useEffect } from "react";
import {
  Package as PackageIcon,
  Plus,
  Clock,
  CheckCircle2,
  Edit2,
  Trash2,
  Loader2,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { PackageModal, PackageItem } from "@/components/artist/package-modal";

export default function ArtistPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageItem | null>(null);

  // Deletion State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggling Active State
  const [togglingId, setTogglingId] = useState<string | null>(null);

  async function fetchPackages() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/artist/packages");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load packages.");
      }
      setPackages(data.data.packages || []);
    } catch (err: any) {
      setError(err.message || "Failed to load packages.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPackages();
  }, []);

  function handleOpenCreate() {
    setEditingPackage(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(pkg: PackageItem) {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  }

  async function handleToggleActive(pkg: PackageItem) {
    setTogglingId(pkg.id);
    try {
      const res = await fetch(`/api/artist/packages/${pkg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !pkg.isActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to toggle status");
      }
      setPackages((prev) =>
        prev.map((item) =>
          item.id === pkg.id ? { ...item, isActive: !pkg.isActive } : item
        )
      );
    } catch (err: any) {
      alert(err.message || "Could not update status.");
    } finally {
      setTogglingId(null);
    }
  }

  async function confirmDelete() {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/artist/packages/${deletingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete package");
      }
      setPackages((prev) => prev.filter((item) => item.id !== deletingId));
      setDeletingId(null);
    } catch (err: any) {
      alert(err.message || "Could not delete package.");
    } finally {
      setIsDeleting(false);
    }
  }

  const activeCount = packages.filter((p) => p.isActive).length;
  const lowestPrice =
    packages.length > 0
      ? Math.min(...packages.map((p) => p.price))
      : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
            <PackageIcon className="w-7 h-7 text-amber-400" />
            Signature Packages
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Bundle complementary services into premium, all-inclusive luxury offerings
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          Create New Package
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 bg-neutral-900/80 border border-neutral-800 rounded-2xl">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
            Total Packages
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {packages.length}
            </span>
            <span className="text-xs text-neutral-500">configured</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-neutral-900/80 border border-neutral-800 rounded-2xl">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
            Active on Profile
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-amber-400">
              {activeCount}
            </span>
            <span className="text-xs text-neutral-500">
              of {packages.length} visible
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-neutral-900/80 border border-neutral-800 rounded-2xl">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
            Starting From
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-bold text-white">
              {lowestPrice > 0 ? `₹${lowestPrice.toLocaleString()}` : "—"}
            </span>
            <span className="text-xs text-neutral-500">lowest tier</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-4 animate-pulse"
            >
              <div className="h-40 bg-neutral-800/60 rounded-xl" />
              <div className="h-6 w-3/4 bg-neutral-800 rounded" />
              <div className="h-4 w-1/2 bg-neutral-800 rounded" />
              <div className="h-16 bg-neutral-800/40 rounded" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-6 bg-red-950/20 border border-red-800/40 rounded-2xl text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="text-sm text-red-300">{error}</p>
          <button
            onClick={fetchPackages}
            className="px-4 py-2 bg-neutral-800 text-white rounded-lg text-xs font-medium hover:bg-neutral-700 min-h-[44px]"
          >
            Retry
          </button>
        </div>
      ) : packages.length === 0 ? (
        <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-serif font-bold text-white">
              No signature packages yet
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Create bundled offerings like &quot;Bridal Luxe Package&quot; or &quot;Complete Reception Look&quot; to attract higher-value client bookings.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold rounded-xl text-sm transition min-h-[44px]"
          >
            <Plus className="w-4 h-4" />
            Create Your First Package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const inclusions = Array.isArray(pkg.includedServices)
              ? pkg.includedServices
              : [];

            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between bg-neutral-900/80 border rounded-2xl overflow-hidden transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5 ${
                  pkg.isActive ? "border-neutral-800" : "border-neutral-800/50 opacity-75"
                }`}
              >
                {/* Image Cover or Luxury Header */}
                {pkg.imageUrl ? (
                  <div className="relative h-44 w-full bg-neutral-950 overflow-hidden">
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-black/30" />
                    <span
                      className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide backdrop-blur-md ${
                        pkg.isActive
                          ? "bg-amber-500/90 text-neutral-950"
                          : "bg-neutral-800/90 text-neutral-400"
                      }`}
                    >
                      {pkg.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                ) : (
                  <div className="relative h-28 w-full bg-gradient-to-r from-amber-950/40 via-neutral-900 to-amber-900/20 p-4 border-b border-neutral-800/80 flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${
                        pkg.isActive
                          ? "bg-amber-500/20 border border-amber-500/30 text-amber-300"
                          : "bg-neutral-800 text-neutral-400"
                      }`}
                    >
                      {pkg.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                )}

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg font-serif font-bold text-white line-clamp-1">
                        {pkg.name}
                      </h3>
                    </div>

                    {/* Price & Duration */}
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-serif font-bold text-amber-400">
                        ₹{pkg.price.toLocaleString()}
                      </span>
                      {pkg.durationHours != null && (
                        <span className="inline-flex items-center gap-1 text-xs text-neutral-400">
                          <Clock className="w-3.5 h-3.5 text-neutral-500" />
                          ~{pkg.durationHours} hrs
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Inclusions List */}
                  {inclusions.length > 0 && (
                    <div className="pt-3 border-t border-neutral-800/70 space-y-2">
                      <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                        Included Features
                      </span>
                      <ul className="space-y-1.5">
                        {inclusions.slice(0, 4).map((inc, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 text-xs text-neutral-300"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">{inc}</span>
                          </li>
                        ))}
                        {inclusions.length > 4 && (
                          <li className="text-[11px] text-amber-400 font-medium pl-5.5">
                            +{inclusions.length - 4} more inclusions
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-4 border-t border-neutral-800/70 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleActive(pkg)}
                      disabled={togglingId === pkg.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800/60 hover:bg-neutral-800 transition min-h-[44px]"
                    >
                      {pkg.isActive ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-neutral-400" />
                          Publish
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(pkg)}
                        className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800/80 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={`Edit ${pkg.name}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(pkg.id)}
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-800/80 rounded-lg transition min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label={`Delete ${pkg.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Package Create/Edit Modal */}
      <PackageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchPackages}
        packageData={editingPackage}
      />

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                Delete Package?
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Are you sure you want to delete this package? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium transition min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5 min-h-[44px]"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
