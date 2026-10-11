"use client";

import { useEffect, useState } from "react";
import { X, Sparkles, FolderTree, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/utils";

export interface SubCategoryFormData {
  id?: string;
  categoryId?: string;
  name: string;
  slug: string;
  description?: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface SubCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SubCategoryFormData) => Promise<void>;
  initialData?: SubCategoryFormData | null;
  parentCategoryName?: string;
}

export function SubCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  parentCategoryName,
}: SubCategoryModalProps) {
  const isEditing = Boolean(initialData?.id);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSlug(initialData.slug || "");
      setSlugManuallyEdited(true);
      setDescription(initialData.description || "");
      setSortOrder(initialData.sortOrder ?? 0);
      setIsActive(initialData.isActive ?? true);
    } else {
      setName("");
      setSlug("");
      setSlugManuallyEdited(false);
      setDescription("");
      setSortOrder(0);
      setIsActive(true);
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlugManuallyEdited(true);
    setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Sub-category name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        id: initialData?.id,
        categoryId: initialData?.categoryId,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        sortOrder: Number(sortOrder),
        isActive,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save sub-category.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 z-10 animate-in zoom-in-95 fade-in-0 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#fcdadb] text-[#eb7583] flex items-center justify-center">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-title text-xl font-bold text-gray-900">
                {isEditing ? "Edit Sub-Category" : "Add Sub-Category"}
              </h2>
              <p className="text-xs text-gray-500">
                {parentCategoryName ? `Under "${parentCategoryName}"` : "Specify service specialization"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sub-Category Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Sub-Category Name *
            </label>
            <Input
              type="text"
              placeholder="e.g. Airbrush Bridal, HD Bridal, Traditional Bridal"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Slug *
              </label>
              {!slugManuallyEdited && (
                <span className="text-[11px] text-[#eb7583] flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3" /> Auto-generated
                </span>
              )}
            </div>
            <Input
              type="text"
              placeholder="airbrush-bridal"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              required
              disabled={loading}
              className="font-mono text-xs"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of this specialization..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#eb7583] focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Sort Order & Active Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Display Order
              </label>
              <Input
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                disabled={loading}
              />
              <span className="text-[11px] text-gray-400 mt-1 block">
                Lower numbers appear first
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isActive ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-xs font-semibold text-gray-700">
                  {isActive ? "Active (Visible)" : "Inactive (Hidden)"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl text-xs font-semibold px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="rounded-xl text-xs font-semibold px-5 py-2 bg-[#eb7583] hover:bg-[#d4616f] text-white flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? "Saving..." : isEditing ? "Update Sub-Category" : "Create Sub-Category"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
