"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderTree,
  Plus,
  Search,
  RotateCw,
  Edit2,
  Trash2,
  ExternalLink,
  Tag,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryModal, CategoryFormData } from "@/components/admin/category-modal";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  iconUrl?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    subCategories: number;
    artistServices: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryFormData | null>(null);

  // Delete dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const url = search.trim()
        ? `/api/admin/categories?search=${encodeURIComponent(search.trim())}`
        : `/api/admin/categories`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load categories.");
      }

      setCategories(data.data || []);
    } catch (err: any) {
      setError(err.message || "An error occurred while loading categories.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle Save (Create or Edit)
  const handleSaveCategory = async (data: CategoryFormData) => {
    const isEdit = Boolean(data.id);
    const url = isEdit
      ? `/api/admin/categories/${data.id}`
      : `/api/admin/categories`;
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || "Failed to save category.");
    }

    fetchCategories(true);
  };

  // Handle Toggle Active/Inactive
  const handleToggleActive = async (category: CategoryItem) => {
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !category.isActive }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to update category status.");
      }

      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, isActive: !c.isActive } : c))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Handle Confirm Delete
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleteError(null);

    const res = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
      method: "DELETE",
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || "Failed to delete category.");
    }

    fetchCategories(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <h1 className="font-title text-2xl md:text-3xl font-bold text-[#1e1a19]">
            Categories &amp; Specializations
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Organize discovery taxonomy for makeup artists and photographers
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => fetchCategories(true)}
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
              setEditingCategory(null);
              setModalOpen(true);
            }}
            className="rounded-xl text-xs font-semibold px-4 py-2 bg-[#eb7583] hover:bg-[#d4616f] text-white flex items-center gap-1.5 shadow-xs min-h-[40px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </Button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search categories by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 text-xs sm:text-sm"
          />
        </div>
      </div>

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

      {/* Content Area */}
      {loading ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-pulse space-y-4">
          <div className="h-6 w-44 bg-gray-100 rounded-md" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-gray-50 rounded-xl" />
            ))}
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <FolderTree className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">
            {search ? "No categories match your search" : "No categories found"}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {search
              ? "Try adjusting your search terms or clear the filter."
              : "Create primary categories like Bridal Makeup, Party Makeup, and Wedding Photography to get started."}
          </p>
          {!search && (
            <Button
              onClick={() => {
                setEditingCategory(null);
                setModalOpen(true);
              }}
              className="mt-4 rounded-xl text-xs font-semibold px-4 py-2 bg-[#eb7583] hover:bg-[#d4616f] text-white inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Category</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3 px-6">Category Name</th>
                  <th className="py-3 px-6">Slug</th>
                  <th className="py-3 px-6">Sub-Categories</th>
                  <th className="py-3 px-6">Linked Services</th>
                  <th className="py-3 px-6">Sort Order</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* Name & Description with Image Thumbnail */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl bg-[#fcf1ef] border border-[#fcdadb] overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                          {c.imageUrl ? (
                            <Image
                              src={c.imageUrl}
                              alt={c.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <span className="font-bold text-xs uppercase text-[#eb7583]">
                              {c.name.substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            {c.name}
                          </div>
                          {c.description && (
                            <div className="text-xs text-gray-400 line-clamp-1 max-w-xs">
                              {c.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="py-4 px-6 font-mono text-xs text-gray-600">
                      <span className="px-2 py-0.5 rounded bg-gray-100 border border-gray-200">
                        {c.slug}
                      </span>
                    </td>

                    {/* Subcategories Count & Link */}
                    <td className="py-4 px-6">
                      <Link
                        href={`/admin/categories/${c.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                        title="Manage sub-categories"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{c._count.subCategories} Sub-categories</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </Link>
                    </td>

                    {/* Linked Services */}
                    <td className="py-4 px-6">
                      <span className="text-xs text-gray-600 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          {c._count.artistServices}
                        </span>
                        <span>services</span>
                      </span>
                    </td>

                    {/* Sort Order */}
                    <td className="py-4 px-6 font-mono text-xs text-gray-600">
                      {c.sortOrder}
                    </td>

                    {/* Active Toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                          c.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                        }`}
                        title="Click to toggle status"
                      >
                        {c.isActive ? (
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
                            setEditingCategory(c);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          title="Edit category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setCategoryToDelete(c);
                            setDeleteError(null);
                            setDeleteDialogOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                          title="Delete category"
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
            {categories.map((c) => (
              <div key={c.id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-10 h-10 rounded-xl bg-[#fcf1ef] border border-[#fcdadb] overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                      {c.imageUrl ? (
                        <Image
                          src={c.imageUrl}
                          alt={c.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="font-bold text-xs uppercase text-[#eb7583]">
                          {c.name.substring(0, 2)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {c.name}
                      </h3>
                      <span className="font-mono text-[11px] text-gray-500">
                        {c.slug}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleActive(c)}
                    className={`text-xs px-2.5 py-0.5 rounded-full border ${
                      c.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}
                  >
                    {c.isActive ? "Active" : "Hidden"}
                  </button>
                </div>

                {c.description && (
                  <p className="text-xs text-gray-500">{c.description}</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-600 pt-1">
                  <Link
                    href={`/admin/categories/${c.id}`}
                    className="inline-flex items-center gap-1 text-blue-700 font-semibold"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{c._count.subCategories} Sub-categories</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                  <span>{c._count.artistServices} services</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingCategory(c);
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
                      setCategoryToDelete(c);
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

      {/* Add / Edit Category Modal */}
      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveCategory}
        initialData={editingCategory}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? If any artist services are linked, deletion will be blocked."
        itemName={categoryToDelete?.name}
        error={deleteError}
      />
    </div>
  );
}
