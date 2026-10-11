import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Heart,
  Award,
  Users,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Lock,
} from "lucide-react";

export const metadata = {
  title: "About Us | GlamBook — Luxury Bridal & Event Styling Network",
  description:
    "Learn about GlamBook's mission to elevate bridal hair, makeup, and wedding photography through curated verification, lead privacy, and concierge coordination.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Heritage &amp; Vision</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.15]">
            Elevating Indian Bridal Beauty into Haute Couture
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light">
            GlamBook was born out of a simple observation: wedding beauty and photography should be defined by calm, craftsmanship, and pure celebration — not chaotic spam calls, deceptive portfolios, and hidden fees.
          </p>
        </div>

        {/* Milestone Stats */}
        <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 shadow-2xl grid grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="space-y-1">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-amber-400 block">500+</span>
            <span className="text-xs font-bold uppercase tracking-wider text-white block">Verified Artists</span>
            <p className="text-xs text-neutral-400">Strictly vetted for technical mastery &amp; hygiene</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-amber-400 block">15,000+</span>
            <span className="text-xs font-bold uppercase tracking-wider text-white block">Celebrations Styled</span>
            <p className="text-xs text-neutral-400">Bridal, reception, and destination milestones</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-amber-400 block">25+</span>
            <span className="text-xs font-bold uppercase tracking-wider text-white block">Wedding Destinations</span>
            <p className="text-xs text-neutral-400">Metros &amp; heritage hubs across India</p>
          </div>
          <div className="space-y-1">
            <span className="font-serif text-4xl sm:text-5xl font-bold text-amber-400 block">99.4%</span>
            <span className="text-xs font-bold uppercase tracking-wider text-white block">5-Star Satisfaction</span>
            <p className="text-xs text-neutral-400">Over 3,400+ verified bride reviews</p>
          </div>
        </div>

        {/* Story & Philosophy Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-neutral-900 border border-neutral-800 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1200&auto=format&fit=crop"
              alt="GlamBook Bridal Artistry"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-neutral-950/80 backdrop-blur-md border border-neutral-800">
              <span className="text-xs font-bold text-amber-300 block">Editorial Perfection</span>
              <p className="text-xs text-neutral-400">Capturing the sacred essence of royal Indian celebrations</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400">
              <Heart className="w-3.5 h-3.5 fill-amber-400/20" />
              <span>Why We Built GlamBook</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              A Safe Sanctuary for Wedding Planning
            </h2>

            <p className="text-sm text-neutral-300 leading-relaxed">
              For decades, finding a bridal makeup artist in India meant searching uncurated directories, risking stolen photos, and suffering unsolicited calls from dozens of vendors once a phone number was shared.
            </p>

            <p className="text-sm text-neutral-400 leading-relaxed">
              GlamBook was created to set an uncompromising benchmark. We instituted our **Lead Privacy Guarantee**, removing all telemarketing harassment. We created our **Curated Curation Board**, verifying high-definition portfolio authenticity and sterile tool protocols. And we eliminated third-party commission surcharges, so artists keep 100% of their earnings and clients pay genuine quotes.
            </p>

            <div className="space-y-2 pt-2">
              {[
                "Zero lead data selling — your phone number is guarded",
                "Authentic 4K portfolio checks — zero stolen Pinterest images",
                "Direct concierge coordination with verified artists",
              ].map((point) => (
                <div key={point} className="flex items-center gap-2 text-xs text-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The 4 Pillars */}
        <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              The Four Pillars of GlamBook
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              The non-negotiable principles guiding every artist review and client coordination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">100% Vetted Mastery</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Only artists demonstrating genuine technical excellence, sterile hygiene practices, and verifiable references pass our review.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Absolute Privacy</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Client phone numbers and emails are never displayed to artists or sold to third-party telemarketers. Zero spam calls guaranteed.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Zero Commission Fees</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We believe in fair value. We take zero cut from the artist&apos;s hard-earned fee and charge no booking markups to brides.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white">Concierge Harmony</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Our central concierge team verifies calendar availability and custom quotes, ensuring seamless communication.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-amber-500/10 via-neutral-900 to-neutral-900 border border-amber-500/30 text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
            Experience the Future of Wedding Beauty &amp; Artistry
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition min-h-[44px]"
            >
              <span>Explore Verified Artists</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold text-xs sm:text-sm transition min-h-[44px]"
            >
              <span>Speak with Concierge</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
