import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Sparkles, Calendar, Clock, ArrowRight, Search } from "lucide-react";
import prisma from "@/lib/prisma";
import { HOME_BLOG_POSTS } from "@/components/home/blog-preview";

export const metadata: Metadata = {
  title: "The GlamBook Journal — Bridal Beauty, Photography & Wedding Guides",
  description:
    "Explore expert bridal styling advice, 4K photography tips, summer airbrush endurance masterclasses, and royal destination wedding ideas.",
};

export default async function BlogListingPage() {
  let posts: any[] = [];

  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: {
        author: {
          select: { name: true, avatarUrl: true },
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 12,
    });

    if (dbPosts && dbPosts.length > 0) {
      posts = dbPosts.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt || "",
        category: p.category || "Bridal Editorial",
        coverImage:
          p.coverImageUrl ||
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
        publishedAt: (p.publishedAt || p.createdAt).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        readTime: "5 min read",
        authorName: p.author.name,
      }));
    }
  } catch (err) {
    console.error("Error fetching blog posts:", err);
  }

  // Fallback to rich curated editorial articles if DB is not yet populated
  if (posts.length === 0) {
    posts = HOME_BLOG_POSTS.map((p) => ({
      ...p,
      authorName: "GlamBook Editorial Board",
    }));
  }

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-neutral-950 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The GlamBook Journal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Bridal Artistry &amp; Destination Guides
          </h1>
          <p className="text-sm sm:text-base text-neutral-400">
            Expert insights, backstage bridal makeup techniques, and cinematic photography ideas curated by India&apos;s leading wedding artists.
          </p>
        </div>

        {/* Featured Lead Post */}
        {featuredPost && (
          <div className="group rounded-3xl overflow-hidden bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/40 transition-all duration-300 shadow-2xl grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-neutral-950">
              <img
                src={featuredPost.coverImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent lg:hidden" />
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
                  {featuredPost.category}
                </span>

                <Link href={`/blog/${featuredPost.slug}`}>
                  <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white group-hover:text-amber-200 transition leading-tight">
                    {featuredPost.title}
                  </h2>
                </Link>

                <p className="text-sm text-neutral-300 leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                <div className="text-xs text-neutral-400 space-y-0.5">
                  <span className="text-white font-medium block">
                    {featuredPost.authorName}
                  </span>
                  <span>{featuredPost.publishedAt} • {featuredPost.readTime}</span>
                </div>

                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition min-h-[44px]"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Article Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h3 className="font-serif text-2xl font-bold text-white">
              Latest Articles
            </h3>
            <span className="text-xs text-neutral-400">
              Showing {posts.length} Guides
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPosts.map((post) => (
              <article
                key={post.id}
                className="group rounded-3xl overflow-hidden bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/40 hover:bg-neutral-900 transition-all duration-300 flex flex-col justify-between shadow-lg"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-md text-[11px] font-semibold text-amber-300 border border-amber-500/30">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                      <span>{post.publishedAt}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <Link href={`/blog/${post.slug}`}>
                      <h4 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition line-clamp-2">
                        {post.title}
                      </h4>
                    </Link>

                    <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-xs text-neutral-400 font-medium">
                      by {post.authorName}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
