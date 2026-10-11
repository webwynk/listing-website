"use client";

import { useEffect, useState, useCallback } from "react";
import {
  FileText,
  Save,
  RotateCw,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Globe,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StoredStaticPage } from "@/app/api/admin/pages/route";

export default function AdminStaticPagesPage() {
  const [pages, setPages] = useState<StoredStaticPage[]>([]);
  const [activeSlug, setActiveSlug] = useState<string>("about-us");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Current page form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const fetchPages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/pages");
      const json = await res.json();
      if (json.success && json.data.pages) {
        setPages(json.data.pages);
        // Load initial active page
        const current =
          json.data.pages.find((p: StoredStaticPage) => p.slug === activeSlug) ||
          json.data.pages[0];
        if (current) {
          setActiveSlug(current.slug);
          setTitle(current.title || "");
          setContent(current.content || "");
          setMetaTitle(current.metaTitle || "");
          setMetaDescription(current.metaDescription || "");
          setLastUpdated(current.updatedAt || null);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [activeSlug]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const selectPage = (slug: string) => {
    setActiveSlug(slug);
    setStatusMessage(null);
    const target = pages.find((p) => p.slug === slug);
    if (target) {
      setTitle(target.title || "");
      setContent(target.content || "");
      setMetaTitle(target.metaTitle || "");
      setMetaDescription(target.metaDescription || "");
      setLastUpdated(target.updatedAt || null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setStatusMessage({ type: "error", text: "Page title is required." });
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      setStatusMessage({
        type: "error",
        text: "Page content must be at least 10 characters.",
      });
      return;
    }

    try {
      setSaving(true);
      setStatusMessage(null);

      const res = await fetch(`/api/admin/pages/${activeSlug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: activeSlug,
          title: title.trim(),
          content: content.trim(),
          metaTitle: metaTitle.trim() || null,
          metaDescription: metaDescription.trim() || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update static page.");
      }

      setLastUpdated(new Date().toISOString());
      setPages((prev) =>
        prev.map((p) =>
          p.slug === activeSlug
            ? {
                ...p,
                title: title.trim(),
                content: content.trim(),
                metaTitle: metaTitle.trim() || null,
                metaDescription: metaDescription.trim() || null,
                updatedAt: new Date().toISOString(),
              }
            : p
        )
      );

      setStatusMessage({
        type: "success",
        text: "Page content and SEO settings saved successfully!",
      });
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to save static page.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e1a19] tracking-tight">
            Static Pages Editor
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage company information, legal disclosures, and public knowledge pages
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPages()}
            className="rounded-xl h-11 border-border text-[#1e1a19] hover:bg-neutral-100"
          >
            <RotateCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <a
            href={`/${activeSlug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 h-11 px-4 text-xs font-semibold rounded-xl border border-border text-[#1e1a19] hover:bg-neutral-50 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Live Page</span>
          </a>
        </div>
      </div>

      {/* Pages Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {[
          { slug: "about-us", label: "About Us" },
          { slug: "how-it-works", label: "How It Works" },
          { slug: "privacy-policy", label: "Privacy Policy" },
          { slug: "terms-of-service", label: "Terms of Service" },
        ].map((tab) => (
          <button
            key={tab.slug}
            type="button"
            onClick={() => selectPage(tab.slug)}
            className={`px-4 py-2.5 text-xs md:text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${
              activeSlug === tab.slug
                ? "bg-[#eb7583] text-white shadow-xs font-semibold"
                : "bg-white text-muted-foreground hover:text-[#1e1a19] hover:bg-neutral-100 border border-border/60"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Notification Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center gap-3 border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span className="font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Editor Form */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-border p-8 animate-pulse space-y-4">
          <div className="h-6 bg-neutral-200 rounded-sm w-1/4"></div>
          <div className="h-10 bg-neutral-100 rounded-xl"></div>
          <div className="h-64 bg-neutral-100 rounded-xl"></div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-5">
            {/* Title & Slug Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                  Page Title *
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. About GlamBook"
                  className="text-base md:text-sm font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                  URL Route Path
                </label>
                <div className="h-10 px-3 bg-neutral-100 border border-neutral-200 rounded-xl flex items-center text-xs text-muted-foreground font-mono truncate">
                  /{activeSlug}
                </div>
              </div>
            </div>

            {/* Content & Live Preview Controls */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1e1a19]">
                  Page Body Content (Markdown Supported) *
                </label>
                <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setPreviewMode(false)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                      !previewMode
                        ? "bg-white text-[#1e1a19] shadow-xs"
                        : "text-muted-foreground hover:text-[#1e1a19]"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                      previewMode
                        ? "bg-white text-[#1e1a19] shadow-xs"
                        : "text-muted-foreground hover:text-[#1e1a19]"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>

              {previewMode ? (
                <div className="min-h-[350px] p-6 rounded-xl border border-border bg-neutral-50/50 prose prose-neutral max-w-none text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {content || (
                    <span className="text-muted-foreground italic">
                      Nothing to preview yet. Start typing in the editor.
                    </span>
                  )}
                </div>
              ) : (
                <textarea
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the page content here using markdown headers, bullet points, and paragraphs..."
                  className="w-full px-4 py-3 rounded-xl border border-input focus:border-[#eb7583] focus:ring-1 focus:ring-[#eb7583] outline-hidden text-base md:text-sm font-mono leading-relaxed resize-y"
                  required
                />
              )}
            </div>
          </div>

          {/* SEO Metadata Box */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1e1a19]">
              <Globe className="w-4 h-4 text-[#eb7583]" />
              <span>Search Engine Optimization (SEO Metadata)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                  Meta Title Tag
                </label>
                <Input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="e.g. About GlamBook | Verified Beauty Platform"
                  className="text-base md:text-sm"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Appears in browser tabs and search engine title links
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                  Meta Description
                </label>
                <Input
                  type="text"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="e.g. Discover GlamBook, the premier platform for bridal makeup..."
                  className="text-base md:text-sm"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Search snippet shown under the page link on Google
                </p>
              </div>
            </div>
          </div>

          {/* Save Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-border shadow-xs">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>
                {lastUpdated
                  ? `Last saved: ${new Date(lastUpdated).toLocaleString()}`
                  : "Not yet saved"}
              </span>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl h-11 px-8 shadow-sm font-medium flex items-center gap-2"
            >
              {saving ? (
                <span>Saving Page...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Page Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
