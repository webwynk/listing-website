"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Sparkles, MessageCircle, ArrowUpRight } from "lucide-react";

export interface FaqItem {
  id: string;
  category: "brides" | "services" | "privacy" | "artists";
  question: string;
  answer: string;
}

export const HOME_FAQS: FaqItem[] = [
  {
    id: "faq-privacy",
    category: "privacy",
    question: "How does GlamBook guarantee zero spam and client contact privacy?",
    answer:
      "We strictly uphold our Lead Privacy Guarantee. When you submit an inquiry or request a date check, your personal phone number and email are never broadcasted to telemarketers or third-party agencies. Our verified admin concierge coordinates directly with your chosen artist, ensuring a private, spam-free consultation.",
  },
  {
    id: "faq-pricing",
    category: "brides",
    question: "Are there any booking commission fees or hidden charges for brides?",
    answer:
      "Zero. GlamBook is 100% free for brides, grooms, and families to search, compare verified rates, and submit inquiries. You pay only the artist's authentic transparent package rates directly with zero hidden markups or intermediary commissions.",
  },
  {
    id: "faq-airbrush-hd",
    category: "services",
    question: "What is the difference between Airbrush and Traditional HD bridal makeup?",
    answer:
      "HD (High Definition) makeup utilizes micro-fine cream and liquid foundations applied with sponges and buffing brushes for a radiant, skin-like camera finish. Airbrush makeup uses a specialized compressor pen that sprays a micronized silicone mist for 16+ hour water-resistant wear—making it the gold standard for high-humidity climates, outdoor pheras, and summer destination weddings.",
  },
  {
    id: "faq-timeline",
    category: "brides",
    question: "How far in advance should I book my bridal makeup artist?",
    answer:
      "For peak wedding seasons (October through March) and prime auspicious muhurtham dates, we strongly recommend locking your maestro 6 to 9 months in advance. Royal destination hubs such as Udaipur, Jaipur, Goa, and Mumbai experience exceptionally high demand for master artists.",
  },
  {
    id: "faq-verification",
    category: "services",
    question: "How are artists and studios verified before appearing on GlamBook?",
    answer:
      "Every master artist undergoes our 4-Point Credential Audit: (1) Physical portfolio review with unedited 4K video reel inspection, (2) Backstage hygiene and sanitization protocol compliance, (3) Verification of client review legitimacy, and (4) Professional bridal track record verification.",
  },
  {
    id: "faq-entourage",
    category: "services",
    question: "Can I book family entourage services (mothers, bridesmaids, and saree draping) together?",
    answer:
      "Yes. The majority of our featured artists lead seasoned styling teams capable of managing complete bridal entourages. You can bundle traditional saree or dupatta draping, bridesmaid hair styling, and mother-of-the-bride makeup into a unified timeline.",
  },
  {
    id: "faq-artists",
    category: "artists",
    question: "How can professional bridal artists and photography studios join GlamBook?",
    answer:
      "Elite artists and studios can apply directly through our Artist Portal. Our curation board evaluates portfolio quality, bridal credentials, and client feedback within 48 hours. Accepted artists receive dedicated profile placement, calendar management, and direct inquiries from pre-qualified brides.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "brides", label: "Brides & Booking" },
  { id: "services", label: "Artistry & Services" },
  { id: "privacy", label: "Privacy & Safety" },
  { id: "artists", label: "For Elite Artists" },
] as const;

export function HomeFaqs() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>("faq-privacy");

  const filteredFaqs =
    activeCategory === "all"
      ? HOME_FAQS
      : HOME_FAQS.filter((faq) => faq.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="bg-[#faf8f7] py-16 sm:py-24 border-t border-black/[0.05] relative overflow-hidden">
      {/* Ambient Decorative Glow */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#eb7583]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fcf1ef] border border-[#fcdadb] text-[#eb7583] text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1e1a19] tracking-tight leading-[1.15]">
            Frequently Asked Questions
          </h2>

          <p className="text-xs sm:text-sm text-neutral-500 font-body max-w-xl mx-auto">
            Everything you need to know about booking verified bridal artists, our zero-spam privacy guarantee, and seamless wedding coordination.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {CATEGORIES.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 min-h-[38px] ${
                  isActive
                    ? "bg-[#1e1a19] text-white shadow-sm"
                    : "bg-white text-neutral-600 hover:text-[#1e1a19] border border-black/[0.06] hover:border-black/20"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5 max-w-4xl mx-auto">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-[22px] transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-gradient-to-b from-[#fcf1ef]/25 via-white to-white border border-[#eb7583]/50 shadow-[0_8px_24px_rgba(235,117,131,0.06)]"
                    : "bg-white border border-black/[0.06] hover:border-[#eb7583]/30 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 select-none min-h-[56px] group"
                >
                  <span
                    className={`font-serif text-base sm:text-lg font-medium tracking-tight transition-colors ${
                      isOpen ? "text-[#1e1a19] font-semibold" : "text-[#2e2a29] group-hover:text-[#eb7583]"
                    }`}
                  >
                    {faq.question}
                  </span>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? "bg-[#eb7583] text-white rotate-180 shadow-xs"
                        : "bg-[#fcf1ef] text-[#eb7583] group-hover:bg-[#eb7583] group-hover:text-white"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 transition-colors" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-[14px] text-[#554f4e] leading-relaxed font-body border-t border-black/[0.04]">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Concierge Help Capsule */}
        <div className="max-w-4xl mx-auto rounded-[24px] p-5 sm:p-6 bg-white border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-[#fcf1ef] border border-[#fcdadb] flex items-center justify-center text-[#eb7583] shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-[#1e1a19] tracking-tight">
                Still have questions about your wedding dates?
              </h4>
              <p className="text-xs text-neutral-500 font-body">
                Our wedding concierge is available 7 days a week for personalized bridal consultations.
              </p>
            </div>
          </div>

          <Link
            href="/artists"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1e1a19] hover:bg-[#2e2a29] text-white text-xs font-semibold transition-all shadow-xs shrink-0 active:scale-95 group min-h-[40px]"
          >
            <span>Ask Concierge</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#eb7583]" />
          </Link>
        </div>
      </div>
    </section>
  );
}
