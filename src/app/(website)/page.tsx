import { Metadata } from "next";
import { getPageHeroConfig } from "@/lib/heroes";
import { getActiveCategories } from "@/lib/categories";
import { HomeHero } from "@/components/home/hero";
import { HomeCategories } from "@/components/home/categories";
import { HomeFeaturedArtists } from "@/components/home/featured-artists";
import { HomeHowItWorks } from "@/components/home/how-it-works";
import { HomeTestimonials } from "@/components/home/testimonials";
import { HomeBlogPreview } from "@/components/home/blog-preview";
import { HomeFaqs } from "@/components/home/faqs";
import { HomeCtaBanner } from "@/components/home/cta-banner";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GlamBook — Luxury Bridal Makeup Artists & Event Styling",
  description:
    "India's definitive marketplace for finding and booking elite bridal makeup artists, party stylists, and wedding maestros.",
  openGraph: {
    title: "GlamBook — Luxury Bridal Makeup Artists",
    description:
      "Find and book verified makeup artists for weddings, parties, photoshoots and more.",
    type: "website",
    locale: "en_IN",
  },
};

export default async function HomePage() {
  const [heroConfig, categories] = await Promise.all([
    getPageHeroConfig("home"),
    getActiveCategories(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* SECTION 1: Full-Width Hero with Responsive Overlays and Floating Search Bar */}
      <HomeHero initialConfig={heroConfig} />

      {/* SECTION 2: Browse by Category / Specialization */}
      <HomeCategories categories={categories} />

      {/* SECTION 3: Featured Verified Artists */}
      <HomeFeaturedArtists />

      {/* SECTION 4: How GlamBook Works */}
      <HomeHowItWorks />

      {/* SECTION 5: Real Bride Stories & Infinite Marquee */}
      <HomeTestimonials />

      {/* SECTION 6: The GlamBook Journal & Editorial Guides */}
      <HomeBlogPreview />

      {/* SECTION 7: Frequently Asked Questions (FAQs) */}
      <HomeFaqs />

      {/* SECTION 8: Dual VIP Onboarding Banner */}
      <HomeCtaBanner />
    </div>
  );
}
