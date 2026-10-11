import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Sparkles,
  BookOpen,
  ArrowRight,
  User,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { HOME_BLOG_POSTS } from "@/components/home/blog-preview";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
      select: { title: true, excerpt: true, metaTitle: true, metaDescription: true },
    });

    if (post) {
      return {
        title: `${post.metaTitle || post.title} | GlamBook Journal`,
        description: post.metaDescription || post.excerpt || "Expert bridal beauty advice on GlamBook.",
      };
    }
  } catch (err) {
    console.error("Error generating metadata:", err);
  }

  return {
    title: "Bridal Artistry Guide | GlamBook Journal",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  let post: any = null;
  let relatedPosts: any[] = [];

  try {
    const dbPost = await prisma.blogPost.findFirst({
      where: { slug, status: "PUBLISHED" },
      include: {
        author: {
          select: { name: true, avatarUrl: true },
        },
      },
    });

    if (dbPost) {
      post = {
        id: dbPost.id,
        title: dbPost.title,
        slug: dbPost.slug,
        content: dbPost.content,
        excerpt: dbPost.excerpt,
        category: dbPost.category || "Bridal Editorial",
        coverImage:
          dbPost.coverImageUrl ||
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop",
        publishedAt: (dbPost.publishedAt || dbPost.createdAt).toLocaleDateString("en-IN", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        author: {
          name: dbPost.author.name,
          avatarUrl: dbPost.author.avatarUrl,
        },
      };

      const dbRelated = await prisma.blogPost.findMany({
        where: { id: { not: dbPost.id }, status: "PUBLISHED" },
        take: 3,
      });

      relatedPosts = dbRelated.map((r) => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        excerpt: r.excerpt,
        coverImage: r.coverImageUrl,
        category: r.category,
      }));
    }
  } catch (err) {
    console.error("Error loading blog post:", err);
  }

  // Fallback to curated mock if not found in db yet
  if (!post) {
    const matchedCurated =
      HOME_BLOG_POSTS.find((p) => p.slug === slug) || HOME_BLOG_POSTS[0];

    post = {
      id: matchedCurated.id,
      title: matchedCurated.title,
      slug: matchedCurated.slug,
      excerpt: matchedCurated.excerpt,
      category: matchedCurated.category,
      coverImage: matchedCurated.coverImage,
      publishedAt: matchedCurated.publishedAt,
      author: {
        name: "GlamBook Beauty Editorial Team",
        avatarUrl: null,
      },
      content: `
Bridal makeup in India has evolved into an exacting art form where traditional cultural reverence meets cutting-edge cosmetic chemistry. Whether you are stepping onto a palace mandap in Udaipur or dancing under the ocean breeze in Goa, your makeup must withstand climate, flash photography, emotional tears, and hours of rituals.

### 1. The Formulation Difference: HD vs Airbrush

High-Definition (HD) makeup uses micro-fine pigment particles designed to scatter light, concealing pores and micro-blemishes without creating texture under 4K video lenses. Applied with high-density brushes and beauty sponges, it offers customizable coverage and supreme blendability.

Airbrush makeup, on the other hand, utilizes a compressed air stylus to atomize silicone-based liquid foundation onto the skin. Because it sits as a seamless, weightless veil rather than being buffed into pores, it creates unmatched sweat resistance and water-repelling endurance.

### 2. Matching the Look to Your Ceremony

- **Morning Phere / Muhurtham**: For sacred daytime rituals under natural sunlight or open-air mandaps, a luminous, dewy finish with neutral gold and rose hues prevents a cakey or overly dramatic appearance.
- **Evening Sangeet & Reception**: Nighttime lighting absorbs makeup intensity. Here, sculpted cheek contours, graphic lash lines, and waterproof glitter pigments command the spotlight effortlessly.

### 3. Preparation Begins 6 Months Before

The most skilled makeup master cannot compensate for chronically dehydrated or irritated skin. Start your bridal skincare routine half a year prior:
1. Hydrating chemical peels (lactic or mandelic acid) every 4 weeks.
2. Barrier-repair ceramides and hyaluronic acid serums nightly.
3. Strict broad-spectrum SPF 50+ protection every single day.

When you book through GlamBook, your chosen artist consults with you months in advance to align skin prep with your wedding day foundation shade.
      `,
    };

    relatedPosts = HOME_BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);
  }

  return (
    <article className="min-h-screen bg-neutral-950 py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition group min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
              {post.category}
            </span>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.publishedAt}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5" />
              <span>5 min read</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.15]">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-light">
            {post.excerpt}
          </p>

          {/* Author Byline */}
          <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center text-xs font-bold text-amber-300">
                {post.author.avatarUrl ? (
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div>
                <span className="font-semibold text-white text-sm block">
                  {post.author.name}
                </span>
                <span className="text-xs text-neutral-400 block">
                  GlamBook Senior Beauty Contributor
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Cover Photo */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-2xl">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-invert prose-amber max-w-none space-y-6 text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
          {post.content.split("\n\n").map((para: string, idx: number) => {
            if (para.startsWith("### ")) {
              return (
                <h3
                  key={idx}
                  className="font-serif text-2xl sm:text-3xl font-bold text-white pt-6 pb-2"
                >
                  {para.replace("### ", "")}
                </h3>
              );
            }
            if (para.startsWith("- ") || para.startsWith("1. ")) {
              return (
                <div key={idx} className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 my-4 text-xs sm:text-sm text-neutral-300 whitespace-pre-line leading-relaxed">
                  {para}
                </div>
              );
            }
            return (
              <p key={idx} className="leading-relaxed">
                {para}
              </p>
            );
          })}
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="pt-12 border-t border-neutral-800 space-y-6">
            <h3 className="font-serif text-2xl font-bold text-white">
              Related Articles &amp; Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedPosts.map((rel: any) => (
                <Link
                  key={rel.id || rel.slug}
                  href={`/blog/${rel.slug}`}
                  className="group rounded-2xl overflow-hidden bg-neutral-900/70 border border-neutral-800 p-4 space-y-3 hover:border-amber-500/40 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider block">
                      {rel.category || "Bridal Guide"}
                    </span>
                    <h4 className="font-serif text-base font-bold text-white group-hover:text-amber-200 transition line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
