"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  RotateCw,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImageUrl?: string | null;
  category?: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  viewsCount: number;
  publishedAt?: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
}

interface BlogCounts {
  all: number;
  published: number;
  draft: number;
  archived: number;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [counts, setCounts] = useState<BlogCounts>({
    all: 0,
    published: 0,
    draft: 0,
    archived: 0,
  });
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });
      if (activeTab !== "ALL") {
        params.set("status", activeTab);
      }
      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await fetch(`/api/admin/blog?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setPosts(json.data.posts || []);
        if (json.data.counts) {
          setCounts(json.data.counts);
        }
        if (json.pagination) {
          setTotalPages(json.pagination.totalPages || 1);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog/${id}/publish`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (json.success) {
        await fetchPosts();
      }
    } catch {
      // ignore
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/admin/blog/${deleteId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setDeleteId(null);
        await fetchPosts();
      }
    } catch {
      // ignore
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusBadge = (status: BlogPostItem["status"]) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Published</span>
          </span>
        );
      case "DRAFT":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Draft</span>
          </span>
        );
      case "ARCHIVED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600">
            <Archive className="w-3.5 h-3.5 text-neutral-500" />
            <span>Archived</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1e1a19] tracking-tight">
            Blog Post Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Publish bridal guides, beauty trend reports, and artist spotlights
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchPosts()}
            className="rounded-xl h-11 border-border text-[#1e1a19] hover:bg-neutral-100"
          >
            <RotateCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Link href="/admin/blog/new">
            <Button className="bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl h-11 px-5 shadow-sm font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Write New Post
            </Button>
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        {[
          { id: "ALL", label: "All Posts", count: counts.all },
          { id: "PUBLISHED", label: "Published", count: counts.published },
          { id: "DRAFT", label: "Drafts", count: counts.draft },
          { id: "ARCHIVED", label: "Archived", count: counts.archived },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setPage(1);
            }}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-[#eb7583] text-white shadow-xs font-semibold"
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

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-border shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search articles by title, category, or slug..."
            className="pl-10 text-base md:text-sm border-0 focus-visible:ring-0 shadow-none bg-transparent"
          />
        </div>
      </div>

      {/* Posts Table / Cards */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white rounded-2xl border border-border p-4 animate-pulse flex items-center gap-4"
            >
              <div className="w-24 h-16 bg-neutral-200 rounded-xl"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-neutral-200 rounded-sm w-1/3"></div>
                <div className="h-3 bg-neutral-100 rounded-sm w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#fcf1ef] flex items-center justify-center text-[#eb7583] mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1e1a19]">No Blog Posts Found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {search
              ? "No articles matched your search query."
              : "No blog posts created under this category yet. Click below to publish your first article."}
          </p>
          <Link href="/admin/blog/new">
            <Button className="mt-5 bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl px-5 h-11">
              <Plus className="w-4 h-4 mr-2" />
              Write New Post
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50/75 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Article</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Author</th>
                  <th className="px-5 py-3.5">Published Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 rounded-xl overflow-hidden bg-neutral-100 border border-border shrink-0">
                          {post.coverImageUrl ? (
                            <img
                              src={post.coverImageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-sm">
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="font-semibold text-[#1e1a19] hover:text-[#eb7583] transition-colors truncate block"
                          >
                            {post.title}
                          </Link>
                          <p className="text-xs text-muted-foreground truncate font-mono mt-0.5">
                            /{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {post.category ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fcf1ef] text-[#eb7583]">
                          {post.category}
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-400">Uncategorized</span>
                      )}
                    </td>
                    <td className="px-5 py-4">{getStatusBadge(post.status)}</td>
                    <td className="px-5 py-4 text-xs text-neutral-700">
                      {post.author.name}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString()
                        : "Draft"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(post.id)}
                          className="h-8 px-2 text-xs text-neutral-600 hover:text-[#1e1a19]"
                        >
                          {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        </Button>
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-[#1e1a19] rounded-lg"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(post.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-border p-4 shadow-xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-14 rounded-xl overflow-hidden bg-neutral-100 border border-border shrink-0">
                    {post.coverImageUrl ? (
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      {post.category && (
                        <span className="text-[11px] font-semibold text-[#eb7583] bg-[#fcf1ef] px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                      )}
                      <div>{getStatusBadge(post.status)}</div>
                    </div>
                    <Link
                      href={`/admin/blog/${post.id}/edit`}
                      className="font-semibold text-sm text-[#1e1a19] hover:text-[#eb7583] mt-1 line-clamp-2 block"
                    >
                      {post.title}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "Draft"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(post.id)}
                      className="h-10 px-3 rounded-xl text-xs"
                    >
                      {post.status === "PUBLISHED" ? "Draft" : "Publish"}
                    </Button>
                    <Link href={`/admin/blog/${post.id}/edit`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 px-3 rounded-xl text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(post.id)}
                      className="h-10 px-3 rounded-xl text-xs text-red-600 hover:bg-red-50 border-red-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-border shadow-xs">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl h-10 px-3"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl h-10 px-3"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}
