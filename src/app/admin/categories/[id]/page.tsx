"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Plus,
  RotateCw,
  Edit2,
  Trash2,
  FolderTree,
  Tag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubCategoryModal, SubCategoryFormData } from "@/components/admin/sub-category-modal";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

interface SubCategoryItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    artistServices: number;
  };
}

interface CategoryDetails {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isActive: boolean;
  subCategories: SubCategoryItem[];
  _count: {
    artistServices: number;
    portfolioItems: number;
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SubCategoriesPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const categoryId = resolvedParams.id;

  const [category, setCategory] = useState<CategoryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategoryFormData | null>(null);

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SubCategoryItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchCategoryDetails = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load category details.");
      }

      setCategory(data.data);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading category details.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchCategoryDetails();
  }, [fetchCategoryDetails]);

  // Handle Save (Create or Edit Sub-category)
  const handleSaveSubCategory = async (data: SubCategoryFormData) => {
    const isEdit = Boolean(data.id);
    const url = isEdit
      ? `/api/admin/sub-categories/${data.id}`
      : `/api/admin/categories/${categoryId}/sub-categories`;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || "Failed to save sub-category.");
    }

    fetchCategoryDetails(true);
  };

  // Handle Toggle Active/Inactive
  const handleToggleActive = async (item: SubCategoryItem) => {
    try {
      const res = await fetch(`/api/admin/sub-categories/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to update sub-category status.");
      }

      setCategory((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          subCategories: prev.subCategories.map((sc) =>
            sc.id === item.id ? { ...sc, isActive: !sc.isActive } : sc
          ),
        };
      });
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Confirm Delete Sub-category
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleteError(null);

    const res = await fetch(`/api/admin/sub-categories/${itemToDelete.id}`, {
      method: "DELETE",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || "Failed to delete sub-category.");
    }

    fetchCategoryDetails(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Breadcrumb Navigation (20-Point Polish Standard #9) */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link
          href="/admin/categories"
          className="hover:text-[#eb7583] transition-colors flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Categories</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="font-semibold text-gray-800 truncate max-w-xs">
          {category?.name || "Category"}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-400">Sub-categories</span>
      </nav>

      {/* Category Overview Card */}
      {category && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#eb7583] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
              {category.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="font-title text-2xl font-bold text-[#1e1a19]">
                  {category.name}
                </h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                  {category.slug}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full border ${
                    category.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {category.isActive ? "Active Category" : "Hidden Category"}
                </span>
              </div>
              {category.description && (
                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => fetchCategoryDetails(true)}
              disabled={loading || refreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs min-h-[40px] disabled:opacity-50"
              title="Refresh list"
            >
              <RotateCw
                className={`w-3.5 h-3.5 text-gray-500 ${refreshing ? "animate-spin text-[#eb7583]" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Button
              onClick={() => {
                setEditingSubCategory(null);
                setModalOpen(true);
              }}
              className="rounded-xl text-xs font-semibold px-4 py-2 bg-[#eb7583] hover:bg-[#d4616f] text-white flex items-center gap-1.5 shadow-xs min-h-[40px]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Sub-Category</span>
            </Button>
          </div>
        </div>
      )}

      {/* Global Error Banner */}
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

      {/* Sub-categories Table / List */}
      {loading ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-pulse space-y-4">
          <div className="h-6 w-44 bg-gray-100 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 bg-gray-50 rounded-xl" />
            ))}
          </div>
        </div>
      ) : !category || category.subCategories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <FolderTree className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            No Sub-Categories Defined
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Sub-categories help clients filter by specific technique or style (e.g., Airbrush, HD, Matte, etc.).
          </p>
          <Button
            onClick={() => {
              setEditingSubCategory(null);
              setModalOpen(true);
            }}
            className="mt-4 rounded-xl text-xs font-semibold px-4 py-2 bg-[#eb7583] hover:bg-[#d4616f] text-white inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Sub-Category</span>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6">Sub-Category Name</th>
                  <th className="py-3 px-6">Slug</th>
                  <th className="py-3 px-6">Linked Artist Services</th>
                  <th className="py-3 px-6">Display Order</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {category.subCategories.map((sc) => (
                  <tr
                    key={sc.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* Name & Description */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-gray-900">{sc.name}</div>
                      {sc.description && (
                        <div className="text-xs text-gray-400 line-clamp-1 max-w-xs">
                          {sc.description}
                        </div>
                      )}
                    </td>

                    {/* Slug */}
                    <td className="py-4 px-6 font-mono text-xs text-gray-600">
                      <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200">
                        {sc.slug}
                      </span>
                    </td>

                    {/* Linked Services */}
                    <td className="py-4 px-6">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          {sc._count?.artistServices ?? 0}
                        </span>
                        <span>services</span>
                      </span>
                    </td>

                    {/* Sort Order */}
                    <td className="py-4 px-6 font-mono text-xs text-gray-600">
                      {sc.sortOrder}
                    </td>

                    {/* Active Status */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(sc)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                          sc.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {sc.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-gray-400" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingSubCategory(sc);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          title="Edit sub-category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setItemToDelete(sc);
                            setDeleteError(null);
                            setDeleteDialogOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete sub-category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View (20-Point Polish Standard #11) */}
          <div className="md:hidden divide-y divide-gray-100">
            {category.subCategories.map((sc) => (
              <div key={sc.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {sc.name}
                    </h3>
                    <span className="font-mono text-[11px] text-gray-500">
                      {sc.slug}
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleActive(sc)}
                    className={`text-xs px-2.5 py-0.5 rounded-full border ${
                      sc.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {sc.isActive ? "Active" : "Hidden"}
                  </button>
                </div>

                {sc.description && (
                  <p className="text-xs text-gray-500">{sc.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                  <span>{sc._count?.artistServices ?? 0} linked services</span>
                  <span>Order: {sc.sortOrder}</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingSubCategory(sc);
                      setModalOpen(true);
                    }}
                    className="text-xs h-8 px-3 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5 mr-1" />
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setItemToDelete(sc);
                      setDeleteError(null);
                      setDeleteDialogOpen(true);
                    }}
                    className="text-xs h-8 px-3 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Sub-Category Modal */}
      <SubCategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveSubCategory}
        initialData={editingSubCategory}
        parentCategoryName={category?.name}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Sub-Category"
        description="Are you sure you want to delete this sub-category? If any artist services are linked, deletion will be blocked."
        itemName={itemToDelete?.name}
        error={deleteError}
      />
    </div>
  );
}
