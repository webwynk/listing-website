import { Star, CheckCircle2 } from "lucide-react";

export interface TestimonialItem {
  id: string;
  clientName: string;
  event: string;
  city: string;
  rating: number;
  comment: string;
  artistName: string;
  avatarUrl: string;
  date: string;
}

export const HOME_TESTIMONIALS: TestimonialItem[] = [
  {
    id: "test-1",
    clientName: "Rhea Singhania",
    event: "Palace Wedding at Udaipur",
    city: "Udaipur / Mumbai",
    rating: 5,
    comment:
      "GlamBook took away the single biggest stress of my wedding. Booking our hair and airbrush team through the concierge was effortless. The makeup stayed intact through 8 hours of rituals without a single crease!",
    artistName: "Ananya Haute Bridal Glam",
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    date: "February 2026",
  },
  {
    id: "test-2",
    clientName: "Meera Krishnan",
    event: "Traditional South Indian Muhurtham",
    city: "Bangalore",
    rating: 5,
    comment:
      "The zero-spam policy is real! I didn't get dozens of random telemarketing calls. The concierge coordinated everything directly with Priya, and the bridal kanchipuram silk draping and dewy look were breathtaking.",
    artistName: "Priya Menon HD Airbrush",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    date: "January 2026",
  },
  {
    id: "test-3",
    clientName: "Dr. Alisha Merchant",
    event: "3-Day Destination Wedding in Goa",
    city: "Goa / Delhi",
    rating: 5,
    comment:
      "Finding an artist capable of capturing glowing sunset candids without heavy cakiness was our priority. The team delivered a stunning editorial look that lasted the entire humid beach night!",
    artistName: "Kapoor Bridal Glam",
    avatarUrl:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    date: "March 2026",
  },
  {
    id: "test-4",
    clientName: "Natasha Roy Chowdhury",
    event: "Royal Heritage Sangeet in Jaipur",
    city: "Jaipur / Kolkata",
    rating: 5,
    comment:
      "The skin prep and radiant glass-skin base created made me feel like royalty. Every guest asked who styled my sangeet look. The transparent pricing on GlamBook saved us weeks of back-and-forth.",
    artistName: "Tanvi Kapoor Luxury Glam",
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop",
    date: "January 2026",
  },
  {
    id: "test-5",
    clientName: "Sanjana Kapoor",
    event: "White Gown Ceremony & Reception",
    city: "Mumbai",
    rating: 5,
    comment:
      "My veil placement, dewy soft-matte contour, and classic Hollywood waves were pure perfection. Zero creasing under 4K studio lights, and the luxury hygiene standards were exceptional.",
    artistName: "Zara D'Souza Bridal Studio",
    avatarUrl:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=400&auto=format&fit=crop",
    date: "February 2026",
  },
  {
    id: "test-6",
    clientName: "Tanya Bansal",
    event: "Grand Anand Karaj in Chandigarh",
    city: "Chandigarh / Delhi",
    rating: 5,
    comment:
      "From our sunrise morning ceremony to late-night reception, my jewelry setting and dupatta draping held impeccably. Booking through GlamBook was by far the best bridal investment we made!",
    artistName: "Simran Kaur Artistry",
    avatarUrl:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop",
    date: "March 2026",
  },
  {
    id: "test-7",
    clientName: "Aakriti Sen",
    event: "Sunset Beach Pheras in Alibaug",
    city: "Alibaug / Pune",
    rating: 5,
    comment:
      "Coastal humidity and ocean breeze didn't budge my look even a millimeter! The waterproof airbrush technique was flawless. GlamBook's verified reviews helped me book with complete confidence.",
    artistName: "Sneha Reddy Couture Glam",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    date: "December 2025",
  },
  {
    id: "test-8",
    clientName: "Pooja Varma",
    event: "Royal Evening Reception in Delhi",
    city: "New Delhi",
    rating: 5,
    comment:
      "No hidden fees, instant verified artist confirmation, and high-end aesthetics. My reception smoky eyes and sculpted blush looked mesmerizing in wedding photography and reel teasers!",
    artistName: "Divya Oberoi Makeovers",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop",
    date: "February 2026",
  },
];

export const TESTIMONIALS_ROW_1 = HOME_TESTIMONIALS.slice(0, 4);
export const TESTIMONIALS_ROW_2 = HOME_TESTIMONIALS.slice(4, 8);

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.324 1.487-4.102 3.655-4.102 5.034.453-.254 1.137-.417 1.839-.417 2.247 0 3.738 1.492 3.738 3.593 0 2.215-1.785 3.91-3.91 3.91-.97 0-2.072-.42-2.905-1.001zm10.04 0C13.593 16.227 13.04 15 13.04 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.324 1.487-4.102 3.655-4.102 5.034.453-.254 1.137-.417 1.839-.417 2.247 0 3.738 1.492 3.738 3.593 0 2.215-1.785 3.91-3.91 3.91-.97 0-2.072-.42-2.905-1.001z" />
    </svg>
  );
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="w-[300px] sm:w-[380px] shrink-0 p-6 sm:p-7 rounded-[26px] bg-gradient-to-b from-[#fbfbfa] to-white border border-black/[0.06] hover:border-[#eb7583]/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(235,117,131,0.09)] transition-all duration-300 flex flex-col justify-between space-y-5 select-none hover:-translate-y-1">
      {/* Top Section: Quote Icon & Stars */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <QuoteIcon className="w-8 h-8 text-[#eb7583]" />
          <div className="flex items-center gap-1">
            {Array.from({ length: item.rating }).map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-[#eb7583] text-[#eb7583]"
              />
            ))}
          </div>
        </div>

        {/* Comment Text */}
        <p className="text-[13.5px] sm:text-[14.5px] text-[#2e2a29] leading-relaxed font-normal">
          &ldquo;{item.comment}&rdquo;
        </p>
      </div>

      {/* Author Footer */}
      <div className="pt-4 border-t border-black/[0.05] flex items-center gap-3">
        <img
          src={item.avatarUrl}
          alt={item.clientName}
          className="w-10 h-10 rounded-full object-cover border border-black/10 shrink-0 shadow-xs"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-sm sm:text-[15px] text-[#1e1a19] truncate tracking-tight">
              {item.clientName}
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#eb7583] shrink-0" />
          </div>
          <span className="text-[11.5px] text-[#787372] block truncate">
            {item.event} • {item.city}
          </span>
          <span className="text-[11px] text-[#eb7583] font-medium block truncate">
            Styled by {item.artistName}
          </span>
        </div>
      </div>
    </div>
  );
}

export function HomeTestimonials() {
  // 4-times repetition ensures mathematical seamlessness across all screen sizes
  const row1Repeated = [
    ...TESTIMONIALS_ROW_1,
    ...TESTIMONIALS_ROW_1,
    ...TESTIMONIALS_ROW_1,
    ...TESTIMONIALS_ROW_1,
  ];

  const row2Repeated = [
    ...TESTIMONIALS_ROW_2,
    ...TESTIMONIALS_ROW_2,
    ...TESTIMONIALS_ROW_2,
    ...TESTIMONIALS_ROW_2,
  ];

  return (
    <section className="bg-white py-16 sm:py-24 relative overflow-hidden border-b border-black/[0.05]">
      {/* Vignette Edge Overlays for Seamless Fade Masking */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-36 md:w-56 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-36 md:w-56 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

      {/* Centered Header with Floating Trust Pill */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-12 sm:mb-16 space-y-4">
        {/* Floating Trust Capsule */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#1e1a19] text-white shadow-[0_6px_20px_rgba(0,0,0,0.14)] border border-white/10">
          <span className="w-4 h-4 rounded-full bg-[#eb7583] flex items-center justify-center text-[9px] text-white font-bold shrink-0">
            ★
          </span>
          <span className="text-xs font-medium tracking-tight">
            Rated 4.9/5 by over 15,000+ brides
          </span>
        </div>

        {/* Display Title */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1e1a19] tracking-tight leading-[1.18] max-w-2xl mx-auto">
          Words of praise from brides about our presence.
        </h2>

        <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto font-body">
          Authentic reflections from brides and families who celebrated their most cherished milestones with verified GlamBook artists.
        </p>
      </div>

      {/* Dual Infinite Looping Tracks */}
      <div className="space-y-5 sm:space-y-6">
        {/* Track 1: Scroll Left */}
        <div className="overflow-hidden flex">
          <div className="flex gap-5 animate-marquee-left pause-on-hover">
            {row1Repeated.map((item, idx) => (
              <TestimonialCard key={`row1-${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>

        {/* Track 2: Scroll Right */}
        <div className="overflow-hidden flex">
          <div className="flex gap-5 animate-marquee-right pause-on-hover">
            {row2Repeated.map((item, idx) => (
              <TestimonialCard key={`row2-${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

