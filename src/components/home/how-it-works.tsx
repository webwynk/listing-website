import Link from "next/link";
import {
  Search,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";

export function HomeHowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Discover & Compare",
      desc: "Filter by city, ceremony date, and discipline. Review authentic 4K portfolios, verified starting prices, and genuine bride reviews.",
      icon: Search,
    },
    {
      step: "02",
      title: "Send Lead Request",
      desc: "Specify your ceremony timing and styling requirements in under 60 seconds with 100% protected contact privacy.",
      icon: Calendar,
    },
    {
      step: "03",
      title: "Concierge Coordination",
      desc: "Our dedicated bridal team verifies artist availability, locks in custom quotes, and acts as your personal bridge for flawless planning.",
      icon: ShieldCheck,
    },
    {
      step: "04",
      title: "Celebrate In Pure Glam",
      desc: "Confirm your dream look with zero platform commission markups. Enjoy hospital-grade cosmetic hygiene standards.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="bg-[#faf8f7] py-12 sm:py-20 border-b border-black/[0.05] relative overflow-hidden select-none">
      {/* Background ambient blush glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#fcdadb]/20 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#fcf1ef] rounded-full blur-3xl pointer-events-none -ml-40 -mb-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2 pb-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] text-[#eb7583] font-body">
            <span className="w-1.5 h-1.5 rounded-full bg-[#eb7583]" />
            <span>The GlamBook Experience</span>
          </div>

          <h2 className="font-title text-2xl sm:text-3xl lg:text-4xl font-normal text-[#1e1a19] tracking-tight leading-tight">
            How GlamBook <span className="italic font-normal text-[#eb7583]">Works</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#5c5553] font-body leading-relaxed max-w-lg mx-auto">
            Securing elite bridal beauty and heirloom cinematography should feel as effortless and elegant as your wedding day itself.
          </p>
        </div>

        {/* Steps Grid / Mobile Snap Carousel */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-[24px] sm:rounded-[26px] p-6 sm:p-7 bg-white border border-black/[0.06] hover:border-[#fcdadb] hover:shadow-[0_16px_40px_rgba(235,117,131,0.14)] transition-all duration-300 flex flex-col justify-between space-y-5 group shrink-0 w-[275px] sm:w-[300px] md:w-auto snap-center"
              >
                {/* Number & Icon Header */}
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-2xl bg-[#fcf1ef] border border-[#fcdadb] flex items-center justify-center text-[#eb7583] group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-[#eb7583] group-hover:to-[#c24e5c] group-hover:text-white transition-all duration-300 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-title text-2xl sm:text-3xl font-medium text-black/[0.12] group-hover:text-[#eb7583]/40 transition-colors">
                    {item.step}
                  </span>
                </div>

                {/* Text Content */}
                <div className="space-y-1.5">
                  <h3 className="font-title text-[19px] sm:text-[21px] font-medium text-[#1e1a19] group-hover:text-[#eb7583] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#5c5553] font-body leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Learn More Action */}
        <div className="text-center pt-2">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#eb7583] hover:text-white text-[#eb7583] border border-[#fcdadb] hover:border-[#eb7583] text-xs sm:text-sm font-semibold font-body transition-all shadow-xs group active:scale-95 min-h-[40px]"
          >
            <span>Explore Our Lead Privacy &amp; Verification Protocol</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
