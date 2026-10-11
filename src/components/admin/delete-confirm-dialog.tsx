"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  description: string;
  itemName?: string;
  error?: string | null;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  error: initialError,
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError || null);

  useEffect(() => {
    setError(initialError || null);
  }, [initialError, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to delete item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 z-10 animate-in zoom-in-95 fade-in-0 duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="font-title text-xl font-bold text-gray-900 mb-1">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          {description}
          {itemName && (
            <span className="font-semibold text-gray-800 block mt-1">
              &quot;{itemName}&quot;
            </span>
          )}
        </p>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-6">
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
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="rounded-xl text-xs font-semibold px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{loading ? "Deleting..." : "Delete Permanently"}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
