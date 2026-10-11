"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Globe,
  Tag,
  Folder,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminEditBlogPostPage({ params }: EditBlogPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">("DRAFT");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/blog/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          const post = json.data;
          setTitle(post.title || "");
          setSlug(post.slug || "");
          setExcerpt(post.excerpt || "");
          setContent(post.content || "");
          setCoverImageUrl(post.coverImageUrl || "");
          setCategory(post.category || "");
          setTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
          setStatus(post.status || "DRAFT");
          setMetaTitle(post.metaTitle || "");
          setMetaDescription(post.metaDescription || "");
        } else {
          setError(json.message || "Failed to load blog post.");
        }
      } catch {
        setError("Error connecting to server.");
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

  const handleSave = async (publishNow?: boolean) => {
    if (!title.trim()) {
      setError("Article title is required.");
      return;
    }
    if (!slug.trim()) {
      setError("Slug URL is required.");
      return;
    }
    if (!content.trim() || content.trim().length < 10) {
      setError("Article content must be at least 10 characters.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      const targetStatus = publishNow ? "PUBLISHED" : status;

      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        content: content.trim(),
        coverImageUrl: coverImageUrl.trim() || null,
        category: category.trim() || null,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        status: targetStatus,
        metaTitle: metaTitle.trim() || null,
        metaDescription: metaDescription.trim() || null,
      };

      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update blog post.");
      }

      setStatus(targetStatus);
      setSuccessMessage("Blog post saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save blog post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        router.push("/admin/blog");
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto p-8 bg-white rounded-2xl border border-border animate-pulse">
        <div className="h-6 bg-neutral-200 rounded-sm w-1/4"></div>
        <div className="h-12 bg-neutral-100 rounded-xl"></div>
        <div className="h-64 bg-neutral-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/blog">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-10 w-10 p-0 border-border text-[#1e1a19]"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1e1a19]">
              Edit Blog Post
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">
              /blog/{slug}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setDeleteOpen(true)}
            className="rounded-xl h-11 px-4 text-red-600 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="rounded-xl h-11 px-5 border-border"
          >
            Save Changes
          </Button>
          <Button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl h-11 px-6 shadow-sm font-medium flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{status === "PUBLISHED" ? "Update Published" : "Publish Now"}</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm rounded-xl flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Main Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Editor & Body */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Slug */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Article Title *
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 10 Essential Bridal Makeup Trends for 2026"
                className="text-base font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Post URL Slug *
              </label>
              <div className="flex items-center">
                <span className="h-10 px-3 bg-neutral-100 border border-r-0 border-input rounded-l-xl text-xs text-muted-foreground flex items-center font-mono">
                  /blog/
                </span>
                <Input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="10-essential-bridal-makeup-trends-2026"
                  className="rounded-l-none font-mono text-xs text-base md:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Article Excerpt / Summary
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief teaser displayed in blog listings and search engine previews..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-input focus:border-[#eb7583] focus:ring-1 focus:ring-[#eb7583] outline-hidden text-base md:text-sm resize-none"
              />
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19]">
              Article Body Content (Markdown Supported) *
            </label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write the full story here... Use headings, bullet lists, blockquotes, and links."
            />
          </div>
        </div>

        {/* Right Column: Metadata, Cover, SEO */}
        <div className="space-y-6">
          {/* Publication Status & Category */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-sm text-[#1e1a19]">Publication Details</h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-11 px-3.5 rounded-xl border border-input bg-white text-base md:text-sm focus:border-[#eb7583] focus:ring-1 focus:ring-[#eb7583] outline-hidden"
              >
                <option value="DRAFT">Draft (Unpublished)</option>
                <option value="PUBLISHED">Published (Public)</option>
                <option value="ARCHIVED">Archived (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Category
              </label>
              <div className="relative">
                <Folder className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Bridal Makeup"
                  className="pl-9 text-base md:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Tags (Comma-separated)
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="bridal, hd-makeup, beauty tips"
                  className="pl-9 text-base md:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <h3 className="font-semibold text-sm text-[#1e1a19]">Featured Cover Image</h3>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Cover Image URL
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="url"
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="pl-9 text-base md:text-sm"
                />
              </div>
            </div>

            {coverImageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-border h-36 bg-neutral-100 flex items-center justify-center">
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="h-28 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 flex flex-col items-center justify-center text-muted-foreground text-xs">
                <ImageIcon className="w-6 h-6 mb-1 text-neutral-400" />
                <span>No cover image provided</span>
              </div>
            )}
          </div>

          {/* SEO Metadata */}
          <div className="bg-white rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1e1a19]">
              <Globe className="w-4 h-4 text-[#eb7583]" />
              <span>SEO Search Meta</span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Meta Title Tag
              </label>
              <Input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="Google Search title link..."
                className="text-base md:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#1e1a19] mb-1.5">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="Summary snippet displayed beneath title on Google..."
                className="w-full px-3.5 py-2 rounded-xl border border-input focus:border-[#eb7583] focus:ring-1 focus:ring-[#eb7583] outline-hidden text-base md:text-sm resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={deleteOpen}
        title="Delete Blog Post"
        description="Are you sure you want to permanently delete this post? This cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </div>
  );
}
