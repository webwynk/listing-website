"use client";

import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Instagram,
  Lock,
} from "lucide-react";

export function PublicFooter() {
  const topCategories = [
    { label: "Bridal Makeup Artists", href: "/artists?category=bridal-makeup" },
    { label: "HD & Airbrush Specialists", href: "/artists?category=airbrush-makeup" },
    { label: "Wedding Photographers", href: "/artists?category=wedding-photography" },
    { label: "Pre-Wedding Shoot Studios", href: "/artists?category=pre-wedding" },
    { label: "Haute Hair Stylists", href: "/artists?category=hair-styling" },
    { label: "Destination Event Teams", href: "/artists?category=destination" },
  ];

  const popularCities = [
    { label: "Mumbai Artists", href: "/artists?city=mumbai" },
    { label: "Delhi NCR Studios", href: "/artists?city=delhi-ncr" },
    { label: "Bangalore Stylists", href: "/artists?city=bangalore" },
    { label: "Jaipur & Udaipur Weddings", href: "/artists?city=jaipur" },
    { label: "Goa Beach Weddings", href: "/artists?city=goa" },
    { label: "Hyderabad Makeup Artists", href: "/artists?city=hyderabad" },
  ];

  const quickLinks = [
    { label: "Explore All Artists", href: "/artists" },
    { label: "Curated Packages", href: "/packages" },
    { label: "How GlamBook Works", href: "/how-it-works" },
    { label: "About GlamBook", href: "/about" },
    { label: "The GlamBook Journal", href: "/blog" },
    { label: "Customer Concierge", href: "/contact" },
  ];

  const forArtistsLinks = [
    { label: "Apply as an Artist", href: "/signup?role=artist" },
    { label: "Artist Portal Sign In", href: "/login" },
    { label: "Verification Criteria", href: "/how-it-works#verification" },
    { label: "Portfolio Standards", href: "/how-it-works#guidelines" },
  ];

  return (
    <footer className="w-full bg-[#181515] border-t border-white/10 text-neutral-300 relative overflow-hidden">
      {/* Top Value Banner: Trust & Privacy (With Rose-Gold Accents) */}
      <div className="border-b border-white/10 bg-[#1e1a19]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-2xl bg-[#eb7583]/10 border border-[#eb7583]/25 flex items-center justify-center text-[#eb7583] shrink-0 shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-body">
                  100% Curated &amp; Verified
                </h4>
                <p className="text-xs text-[#a09b9a] font-body mt-0.5">Strict portfolio &amp; quality review</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-2xl bg-[#eb7583]/10 border border-[#eb7583]/25 flex items-center justify-center text-[#eb7583] shrink-0 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-body">
                  Lead Privacy Protected
                </h4>
                <p className="text-xs text-[#a09b9a] font-body mt-0.5">Zero phone leaks or sales spam</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-2xl bg-[#eb7583]/10 border border-[#eb7583]/25 flex items-center justify-center text-[#eb7583] shrink-0 shadow-xs">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-body">
                  Direct Coordination
                </h4>
                <p className="text-xs text-[#a09b9a] font-body mt-0.5">Direct connection via admin team</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-2xl bg-[#eb7583]/10 border border-[#eb7583]/25 flex items-center justify-center text-[#eb7583] shrink-0 shadow-xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-body">
                  Zero Hidden Fees
                </h4>
                <p className="text-xs text-[#a09b9a] font-body mt-0.5">Transparent packages &amp; quotes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Column Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 xl:gap-10">
          {/* Brand Info & Socials (Spans 4 columns on lg) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group focus:outline-none" aria-label="GlamBook Home">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#eb7583] to-[#fcdadb] p-[1.5px] shadow-lg shadow-[#eb7583]/15 transition-transform duration-300 group-hover:scale-105 shrink-0">
                <div className="w-full h-full bg-[#181515] rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#eb7583]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-medium tracking-wide text-white leading-tight">
                  GlamBook
                </span>
                <span className="text-[9.5px] tracking-[0.28em] uppercase text-[#eb7583] font-semibold leading-none mt-0.5">
                  HAUTE BEAUTÉ &amp; ART
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-[13px] text-[#a09b9a] leading-relaxed max-w-sm font-body">
              India&apos;s definitive marketplace for finding, previewing, and securing elite bridal makeup artists, hair stylists, and cinematic photographers for milestone celebrations.
            </p>

            <div className="pt-2">
              <h5 className="text-[11px] font-bold text-white uppercase tracking-[0.18em] font-body mb-3">
                Follow GlamBook
              </h5>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#eb7583]/50 hover:bg-[#eb7583]/10 hover:text-[#eb7583] flex items-center justify-center text-[#a09b9a] transition-all min-h-[44px] min-w-[44px]"
                  aria-label="GlamBook on Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://pinterest.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#eb7583]/50 hover:bg-[#eb7583]/10 hover:text-[#eb7583] flex items-center justify-center text-[#a09b9a] transition-all min-h-[44px] min-w-[44px]"
                  aria-label="GlamBook on Pinterest"
                >
                  <Sparkles className="w-4 h-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-[#eb7583]/50 hover:bg-[#eb7583]/10 hover:text-[#eb7583] flex items-center justify-center text-[#a09b9a] transition-all min-h-[44px] min-w-[44px]"
                  aria-label="GlamBook on Facebook"
                >
                  <ShieldCheck className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Specializations (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11.5px] font-bold text-white uppercase tracking-[0.18em] font-body">
              Specializations
            </h4>
            <ul className="space-y-2.5 font-body">
              {topCategories.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs text-[#a09b9a] hover:text-[#eb7583] transition-colors inline-block py-0.5 hover:translate-x-0.5 transform duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Cities (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11.5px] font-bold text-white uppercase tracking-[0.18em] font-body">
              Top Cities
            </h4>
            <ul className="space-y-2.5 font-body">
              {popularCities.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs text-[#a09b9a] hover:text-[#eb7583] transition-colors inline-block py-0.5 hover:translate-x-0.5 transform duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Explore (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11.5px] font-bold text-white uppercase tracking-[0.18em] font-body">
              Explore
            </h4>
            <ul className="space-y-2.5 font-body">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs text-[#a09b9a] hover:text-[#eb7583] transition-colors inline-block py-0.5 hover:translate-x-0.5 transform duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: For Artists & Socials (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-[11.5px] font-bold text-white uppercase tracking-[0.18em] font-body">
              For Artists
            </h4>
            <ul className="space-y-2.5 font-body">
              {forArtistsLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-xs text-[#a09b9a] hover:text-[#eb7583] transition-colors inline-block py-0.5 hover:translate-x-0.5 transform duration-150"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href="/signup?role=artist"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#eb7583]/10 hover:bg-[#eb7583]/20 border border-[#eb7583]/30 text-[#eb7583] text-xs font-medium font-body transition-all"
              >
                <span>Join as an Artist</span>
                <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Legal */}
      <div className="border-t border-white/10 bg-[#120f0f] py-6 sm:py-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-xs text-[#6e6968] font-body">
            &copy; {new Date().getFullYear()} GlamBook Technologies Private Limited. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#a09b9a] font-body">
            <Link href="/privacy" className="hover:text-[#eb7583] transition-colors py-1">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#eb7583] transition-colors py-1">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-[#eb7583] transition-colors py-1">
              Support Concierge
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
