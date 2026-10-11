"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Image as ImageIcon,
  Plus,
  Search,
  RotateCw,
  Eye,
  Edit2,
  Trash2,
  ExternalLink,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BannerModal, BannerFormData } from "@/components/admin/banner-modal";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { BannerPosition } from "@/types";

interface BannerItem {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  imageUrl: string;
  linkUrl?: string | null;
  position: BannerPosition;
  sortOrder: number;
  isActive: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt: string;
}

interface BannerCounts {
  all: number;
  homeHero: number;
  homeMiddle: number;
  findArtistTop: number;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [counts, setCounts] = useState<BannerCounts>({
    all: 0,
    homeHero: 0,
    homeMiddle: 0,
    findArtistTop: 0,
  });
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerFormData | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      const url =
        activeTab === "ALL"
          ? "/api/admin/banners"
          : `/api/admin/banners?position=${activeTab}`;
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) {
        setBanners(json.data.banners || []);
        if (json.data.counts) {
          setCounts(json.data.counts);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleCreateOrUpdate = async (formData: BannerFormData) => {
    const isEdit = Boolean(formData.id);
    const url = isEdit
      ? `/api/admin/banners/${formData.id}`
      : "/api/admin/banners";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || "Failed to save banner.");
    }

    await fetchBanners();
  };

  const handleToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/banners/${id}/toggle`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (json.success) {
        setBanners((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, isActive: !b.isActive } : b
          )
        );
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/admin/banners/${deleteId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDeleteId(null);
        await fetchBanners();
      }
    } catch {
      // ignore
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredBanners = banners.filter((b) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      b.title?.toLowerCase().includes(term) ||
      b.subtitle?.toLowerCase().includes(term) ||
      b.linkUrl?.toLowerCase().includes(term)
    );
  });

  const getPositionLabel = (pos: BannerPosition) => {
    switch (pos) {
      case "HOME_HERO":
        return "Home Hero Slider";
      case "HOME_MIDDLE":
        return "Home Mid-Page Banner";
      case "FIND_ARTIST_TOP":
        return "Find Artist Header";
      default:
        return pos;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e1a19] tracking-tight">
            Banner Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Control promotional banners, hero carousels, and seasonal campaign spotlights
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchBanners()}
            className="rounded-xl h-11 border-border text-[#1e1a19] hover:bg-neutral-100"
          >
            <RotateCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() => {
              setEditingBanner(null);
              setModalOpen(true);
            }}
            className="bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl h-11 px-5 shadow-sm font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Banner
          </Button>
        </div>
      </div>

      {/* Position Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {[
          { id: "ALL", label: "All Positions", count: counts.all },
          { id: "HOME_HERO", label: "Home Hero", count: counts.homeHero },
          { id: "HOME_MIDDLE", label: "Home Middle", count: counts.homeMiddle },
          { id: "FIND_ARTIST_TOP", label: "Find Artist", count: counts.findArtistTop },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-[#eb7583] text-white shadow-xs"
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

      {/* Search Input */}
      <div className="bg-white p-3.5 rounded-2xl border border-border shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search banners by title, subtitle, or link URL..."
            className="pl-10 text-base md:text-sm border-0 focus-visible:ring-0 shadow-none bg-transparent"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white rounded-2xl border border-border p-4 animate-pulse flex items-center gap-4"
            >
              <div className="w-32 h-16 bg-neutral-200 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 rounded-sm w-1/3"></div>
                <div className="h-3 bg-neutral-100 rounded-sm w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredBanners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#fcf1ef] flex items-center justify-center text-[#eb7583] mb-4">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1e1a19]">No Banners Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {search
              ? "No promotional banners matched your search query."
              : "No banners created for this position yet. Click below to add your first banner."}
          </p>
          <Button
            onClick={() => {
              setEditingBanner(null);
              setModalOpen(true);
            }}
            className="mt-5 bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl px-5 h-11"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Banner
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50/75 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Banner</th>
                  <th className="px-5 py-3.5">Position</th>
                  <th className="px-5 py-3.5">Sort Order</th>
                  <th className="px-5 py-3.5">Schedule</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredBanners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-14 rounded-xl overflow-hidden bg-neutral-100 border border-border shrink-0">
                          <img
                            src={banner.imageUrl}
                            alt={banner.title || "Banner"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <p className="font-semibold text-[#1e1a19] truncate">
                            {banner.title || "Untitled Banner"}
                          </p>
                          {banner.subtitle && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {banner.subtitle}
                            </p>
                          )}
                          {banner.linkUrl && (
                            <a
                              href={banner.linkUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-[#eb7583] hover:underline flex items-center gap-1 mt-1 truncate"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">{banner.linkUrl}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#fcf1ef] text-[#eb7583]">
                        {getPositionLabel(banner.position)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-neutral-600 font-mono text-xs">
                      #{banner.sortOrder}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {banner.startsAt || banner.endsAt ? (
                        <div className="space-y-0.5">
                          {banner.startsAt && (
                            <p>From: {new Date(banner.startsAt).toLocaleDateString()}</p>
                          )}
                          {banner.endsAt && (
                            <p>To: {new Date(banner.endsAt).toLocaleDateString()}</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-400">Always Active</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggle(banner.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          banner.isActive
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {banner.isActive ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingBanner(banner);
                            setModalOpen(true);
                          }}
                          className="h-9 w-9 p-0 text-muted-foreground hover:text-[#1e1a19] rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(banner.id)}
                          className="h-9 w-9 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards View */}
          <div className="md:hidden space-y-3">
            {filteredBanners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-2xl border border-border p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-20 h-14 rounded-xl overflow-hidden bg-neutral-100 border border-border shrink-0">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title || "Banner"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-[#eb7583] bg-[#fcf1ef] px-2 py-0.5 rounded-full">
                        {getPositionLabel(banner.position)}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        #{banner.sortOrder}
                      </span>
                    </div>
                    <p className="font-semibold text-sm text-[#1e1a19] mt-1 truncate">
                      {banner.title || "Untitled Banner"}
                    </p>
                    {banner.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <button
                    onClick={() => handleToggle(banner.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      banner.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {banner.isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingBanner(banner);
                        setModalOpen(true);
                      }}
                      className="h-10 px-3 rounded-xl text-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(banner.id)}
                      className="h-10 px-3 rounded-xl text-xs text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modals */}
      <BannerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingBanner}
      />

      <DeleteConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Promotional Banner"
        description="Are you sure you want to delete this banner? It will be immediately removed from the live website."
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
