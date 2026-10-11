import Link from "next/link";
import { Sparkles, ShieldCheck, Check, ArrowUpRight } from "lucide-react";

export function HomeCtaBanner() {
  return (
    <section className="bg-white py-16 sm:py-24 border-t border-black/[0.05] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-8">
          {/* Card 1: For Brides & Clients (Luminous Pearl & Rose Gold) */}
          <div className="relative rounded-[32px] p-8 sm:p-11 bg-gradient-to-br from-[#fcf1ef] via-white to-[#faf8f7] border border-[#fcdadb] hover:border-[#eb7583]/40 transition-all duration-300 shadow-[0_12px_40px_rgba(235,117,131,0.08)] overflow-hidden flex flex-col justify-between space-y-8 group">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#eb7583]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#eb7583]/15 transition-colors" />

            <div className="space-y-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#eb7583]/20 text-[#eb7583] text-xs font-semibold shadow-xs backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#eb7583]" />
                <span>For Brides &amp; Celebrants</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal text-[#1e1a19] tracking-tight leading-[1.2]">
                Ready to Look Breathtaking on Your Special Day?
              </h3>

              <p className="text-xs sm:text-[14px] text-[#554f4e] leading-relaxed max-w-lg font-body">
                Explore verified 4K portfolios, genuine bridal reviews, and lock your milestone dates directly with our luxury concierge. Complete peace of mind guaranteed.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Zero platform booking commission fees",
                  "Direct concierge coordination with elite artists",
                  "100% Guaranteed client contact privacy (zero spam)",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs sm:text-[13px] text-[#3e3938] font-body">
                    <div className="w-4 h-4 rounded-full bg-[#fcf1ef] border border-[#fcdadb] flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-2.5 h-2.5 text-[#eb7583]" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-2">
              <Link
                href="/artists"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#eb7583] hover:bg-[#d4616f] text-white font-semibold text-xs sm:text-sm shadow-[0_6px_20px_rgba(235,117,131,0.25)] transition-all active:scale-95 group/btn min-h-[44px]"
              >
                <span>Find Your Dream Artist</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: For Artists & Studios (Obsidian Velvet & Champagne Accent) */}
          <div className="relative rounded-[32px] p-8 sm:p-11 bg-gradient-to-br from-[#1e1a19] via-[#241f1e] to-[#141110] border border-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_16px_48px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col justify-between space-y-8 group">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-[#eb7583]/10 transition-colors" />

            <div className="space-y-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-semibold backdrop-blur-md shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#eb7583]" />
                <span>For Makeup Artists &amp; Studios</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-normal text-white tracking-tight leading-[1.2]">
                Showcase Your Mastery to High-Intent Wedding Clients
              </h3>

              <p className="text-xs sm:text-[14px] text-white/70 leading-relaxed max-w-lg font-body">
                Join India&apos;s definitive curated bridal directory. Receive pre-qualified high-value wedding inquiries, manage availability locks, and elevate your studio stature.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  "Featured portfolio placement on top search filters",
                  "Automated calendar & availability management",
                  "Exclusive editorial spotlight opportunities",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 text-xs sm:text-[13px] text-white/80 font-body">
                    <div className="w-4 h-4 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-2">
              <Link
                href="/signup?role=artist"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-neutral-100 text-[#1e1a19] font-semibold text-xs sm:text-sm shadow-[0_6px_20px_rgba(255,255,255,0.12)] transition-all active:scale-95 group/btn min-h-[44px]"
              >
                <span>Apply as an Artist</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

