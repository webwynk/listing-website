import Link from "next/link";
import { Sparkles, Calendar, Clock, ArrowUpRight } from "lucide-react";

export interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
}

export const HOME_BLOG_POSTS: BlogPostItem[] = [
  {
    id: "post-1",
    slug: "airbrush-vs-hd-bridal-makeup-guide",
    title: "Airbrush vs Traditional HD: Which is Best for Humid & Summer Weddings?",
    excerpt:
      "A comprehensive technical breakdown from India's top makeup artists on endurance, finish, flash photography compatibility, and skin sensitivity.",
    category: "Bridal Beauty Guide",
    coverImage:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
    publishedAt: "September 24, 2026",
    readTime: "5 min read",
  },
  {
    id: "post-2",
    slug: "top-destination-wedding-photo-spots-udaipur",
    title: "Top 10 Royal Destination Wedding Photography Locations in Udaipur",
    excerpt:
      "From Jagmandir Island sunset angles to Pichola boat shots, discover where cinematic wedding photographers capture royalty-grade portraits.",
    category: "Destination Weddings",
    coverImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    publishedAt: "September 18, 2026",
    readTime: "6 min read",
  },
  {
    id: "post-3",
    slug: "pre-wedding-skincare-timeline",
    title: "The Ultimate 6-Month Bridal Skincare & Hair Prep Masterclass",
    excerpt:
      "Dermatologist-approved steps, hydration treatments, chemical peel timelines, and dietary practices for effortless bridal radiance on the big day.",
    category: "Bridal Wellness",
    coverImage:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
    publishedAt: "September 12, 2026",
    readTime: "4 min read",
  },
];

export function HomeBlogPreview() {
  return (
    <section className="bg-[#faf8f7] py-16 sm:py-24 border-b border-black/[0.05] relative overflow-hidden">
      {/* Decorative Ambient Background Glow */}
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-[#eb7583]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2 border-b border-black/[0.05]">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fcf1ef] border border-[#fcdadb] text-[#eb7583] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The GlamBook Journal</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1e1a19] tracking-tight leading-[1.15]">
              Bridal Trends &amp; Editorial Guides
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-body">
              Expert advice, real wedding breakdowns, and insider beauty secrets curated by our senior stylists.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white hover:bg-[#1e1a19] text-[#1e1a19] hover:text-white border border-black/10 hover:border-[#1e1a19] text-xs font-semibold transition-all shadow-xs shrink-0 group active:scale-95 self-start sm:self-auto min-h-[40px]"
          >
            <span>Visit the Journal</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Blog Posts: Responsive Grid on Desktop / Smooth Snap Swipe on Mobile */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-5 -mx-4 px-4 pb-4 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 md:gap-6">
          {HOME_BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              className="group rounded-[26px] overflow-hidden bg-white border border-black/[0.06] hover:border-[#eb7583]/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(235,117,131,0.09)] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 w-[82vw] sm:w-[360px] md:w-auto shrink-0 snap-center md:shrink"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-semibold text-white border border-white/20">
                  {post.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-neutral-400 text-xs">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#eb7583]" />
                      {post.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#eb7583]" />
                      {post.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1e1a19] group-hover:text-[#eb7583] transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-[13.5px] text-[#554f4e] line-clamp-3 leading-relaxed font-body">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-black/[0.05]">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#eb7583] group-hover:text-[#d4616f] transition-colors group/link"
                  >
                    <span>Read Full Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

