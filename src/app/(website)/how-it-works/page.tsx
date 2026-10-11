"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Calendar,
  Headphones,
  CheckCircle,
  ShieldCheck,
  Lock,
  ChevronDown,
  ArrowRight,
  UserCheck,
  Briefcase,
  Star,
} from "lucide-react";

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"BRIDE" | "ARTIST">("BRIDE");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const brideSteps = [
    {
      num: "01",
      title: "Discover Verified Talent",
      desc: "Explore hundreds of vetted makeup artists and photographers. Compare authentic 4K portfolios, genuine bride testimonials, and transparent service rates across 25+ cities in India.",
      icon: Search,
    },
    {
      num: "02",
      title: "Send Inquiry in 60 Seconds",
      desc: "Specify your event dates, ceremony type (Bridal, Sangeet, Reception), venue city, and styling expectations through our intuitive booking wizard.",
      icon: Calendar,
    },
    {
      num: "03",
      title: "Dedicated Concierge Coordination",
      desc: "Our GlamBook team personally coordinates directly with the artist to confirm availability, lock in custom quotes, and answer special requests with zero telemarketing spam.",
      icon: Headphones,
    },
    {
      num: "04",
      title: "Celebrate In Flawless Glam",
      desc: "Lock in your booking with complete confidence. Pay zero platform commission fees and relax knowing your wedding day glam squad is locked in.",
      icon: Sparkles,
    },
  ];

  const artistSteps = [
    {
      num: "01",
      title: "Submit Your Portfolio",
      desc: "Register your studio and submit your authentic work, business details, service price lists, and experience history for admin review.",
      icon: Briefcase,
    },
    {
      num: "02",
      title: "Editorial Verification",
      desc: "Our quality curation board evaluates your technical artistry, portfolio authenticity, and hygiene standards. Approved artists receive the verified gold badge.",
      icon: ShieldCheck,
    },
    {
      num: "03",
      title: "Receive High-Value Leads",
      desc: "Get matched with high-intent brides and wedding families seeking your specific aesthetic. Manage your calendar and availability in real time.",
      icon: UserCheck,
    },
    {
      num: "04",
      title: "Grow Your Prestige & Stature",
      desc: "Collect verified reviews from milestone clients, feature in bridal editorial spotlights, and scale your wedding business without paying commission cuts.",
      icon: Star,
    },
  ];

  const faqs = [
    {
      q: "How does GlamBook protect my phone number and email?",
      a: "Unlike other directories that blast your contact information to dozens of vendors who bombard you with sales calls, GlamBook guarantees 100% Lead Privacy. Artists only see your name, dates, and requirements. All direct coordination is respectfully handled through our central concierge team.",
    },
    {
      q: "Does GlamBook charge brides any booking commission?",
      a: "Zero. GlamBook is 100% free for brides, grooms, and event hosts. You pay the exact agreed price directly to the artist without any platform convenience markups or booking surcharges.",
    },
    {
      q: "How are artists vetted before receiving the Verified badge?",
      a: "Every single artist profile is manually reviewed by our senior beauty editorial board. We verify real portfolio photos (checking against stolen imagery), validate past wedding references, and ensure hygienic sanitation standards for all cosmetic applications.",
    },
    {
      q: "What happens if an artist is unavailable for my wedding date?",
      a: "If your first choice is booked, our concierge team immediately provides 2 to 3 curated alternatives matching your exact aesthetic, city location, and budget range so your planning never slows down.",
    },
    {
      q: "How can I join GlamBook as a makeup artist or photographer?",
      a: "Click 'Are you an Artist? Apply Now' at the top or bottom of this page. Complete your artist profile and upload at least 4 high-resolution photos of your original work. Our team reviews applications within 24 to 48 business hours.",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The GlamBook Blueprint</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            How GlamBook Works
          </h1>
          <p className="text-sm sm:text-base text-neutral-400">
            A luxury concierge platform engineered for discerning brides and exceptional beauty masters.
          </p>

          {/* Perspective Toggle Switch */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-neutral-900 border border-neutral-800 mt-6">
            <button
              onClick={() => setActiveTab("BRIDE")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition min-h-[44px] ${
                activeTab === "BRIDE"
                  ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              For Brides &amp; Clients
            </button>
            <button
              onClick={() => setActiveTab("ARTIST")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition min-h-[44px] ${
                activeTab === "ARTIST"
                  ? "bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              For Artists &amp; Studios
            </button>
          </div>
        </div>

        {/* 4 Steps Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(activeTab === "BRIDE" ? brideSteps : artistSteps).map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/40 hover:bg-neutral-900 transition-all duration-300 flex flex-col justify-between space-y-6 group shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-serif text-3xl font-bold text-neutral-700 group-hover:text-amber-500/40 transition">
                    {step.num}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-200 transition">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lead Privacy Guarantee Spotlight */}
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-amber-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Prime Directive Standard</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                The GlamBook Lead Privacy Guarantee
              </h2>

              <p className="text-sm text-neutral-300 leading-relaxed">
                We believe wedding planning should be peaceful, not pestered. On traditional platforms, submitting a query leads to your personal mobile number being sold to dozens of vendors.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                  <span className="font-bold text-amber-400 text-sm block">Zero Data Selling</span>
                  <p className="text-xs text-neutral-400">Your phone and email are never shared or sold to marketing brokers.</p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                  <span className="font-bold text-amber-400 text-sm block">Zero Spam Calls</span>
                  <p className="text-xs text-neutral-400">Artists never receive your phone number without explicit concierge clearance.</p>
                </div>
                <div className="p-4 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-1">
                  <span className="font-bold text-amber-400 text-sm block">Concierge Bridge</span>
                  <p className="text-xs text-neutral-400">All queries are coordinated respectfully by trained wedding concierges.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-neutral-950/90 border border-amber-500/20 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-lg font-bold text-white">
                100% Privacy Protected
              </h4>
              <p className="text-xs text-neutral-400">
                Guaranteed on every booking inquiry submitted on GlamBook.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Everything you need to know about booking and coordinating on GlamBook
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-neutral-900/60 border border-neutral-800/80 overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 text-sm sm:text-base font-medium text-white hover:text-amber-300 transition min-h-[44px]"
                  aria-expanded={openFaq === idx}
                >
                  <span className="font-serif font-bold">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-300 ${
                      openFaq === idx ? "rotate-180 text-amber-400" : ""
                    }`}
                  />
                </button>

                {openFaq === idx && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bottom Banner */}
        <div className="text-center space-y-4 pt-6">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Ready to Begin Your Bridal Beauty Journey?
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/artists"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition min-h-[44px]"
            >
              <span>Explore Verified Artists</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/signup?role=artist"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold text-xs sm:text-sm transition min-h-[44px]"
            >
              <span>Apply as an Artist</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
