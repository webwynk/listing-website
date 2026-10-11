"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Check,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Star,
} from "lucide-react";
import { BookingModal, BookingArtist } from "@/components/booking/booking-modal";

export interface PackageItem {
  id: string;
  name: string;
  description: string;
  price: number;
  durationHours?: number | null;
  includedServices: string[];
  imageUrl?: string | null;
  category: "BRIDAL" | "PARTY" | "DESTINATION" | "PRE_WEDDING";
  artist: {
    id: string;
    slug: string;
    name: string;
    businessName: string;
    city: string;
    avatarUrl?: string | null;
    avgRating: number;
    totalReviews: number;
  };
}

const CURATED_PACKAGES: PackageItem[] = [
  {
    id: "pkg-1",
    name: "The Royal Maharani Bridal Suite",
    description:
      "A complete bespoke wedding day glam experience featuring international 4K silicone airbrush, customized couture hair styling, fresh floral setting, and royal dupatta draping.",
    price: 45000,
    durationHours: 4.5,
    includedServices: [
      "Temptu 4K HD Airbrush Foundation",
      "Handcrafted Mink Lash Extensions",
      "Haute Floral Hair Braid / Textured Updo",
      "Double Dupatta & Jewelry Pinning",
      "Complimentary Mother-of-the-Bride Touch-up",
      "Luxury Emergency Touch-up Kit",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    category: "BRIDAL",
    artist: {
      id: "artist-1",
      slug: "ananya-sharma-bridal-studio",
      name: "Ananya Sharma",
      businessName: "Ananya Haute Bridal Glam",
      city: "Mumbai",
      avgRating: 4.98,
      totalReviews: 68,
    },
  },
  {
    id: "pkg-2",
    name: "Sangeet & Cocktail Glow Edit",
    description:
      "High-impact evening glam crafted for dance floors and nighttime strobe lighting with waterproof glitter pigments, smokey contours, and Hollywood waves.",
    price: 24000,
    durationHours: 3.0,
    includedServices: [
      "Ultra-Longwear Dewy Skin Base",
      "Custom Graphic / Shimmer Eye Art",
      "Hollywood Waves or Textured Glam Ponytail",
      "Luxury 3D Lashes & Lip Contouring",
      "Setting Spray Strobe Endurance Shield",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
    category: "PARTY",
    artist: {
      id: "artist-3",
      slug: "priya-menon-airbrush-artistry",
      name: "Priya Menon",
      businessName: "Priya Menon HD Airbrush",
      city: "Bangalore",
      avgRating: 5.0,
      totalReviews: 44,
    },
  },
  {
    id: "pkg-3",
    name: "3-Day Destination Wedding Glam Squad",
    description:
      "Dedicated senior makeup artist and hair master traveling on tour for your entire 3-day milestone celebration: Mehendi, Sangeet, Ceremony, and Reception.",
    price: 135000,
    durationHours: 24.0,
    includedServices: [
      "Looks for 4 Major Functions (Mehendi, Sangeet, Wedding, Reception)",
      "Dedicated On-Site Touch-up Artist for All Rituals",
      "Hair Styling with Real Floral Accents & Extensions",
      "Pre-Wedding Look Consultation & Trial Session",
      "Complimentary Styling for 2 Immediate Family Members",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
    category: "DESTINATION",
    artist: {
      id: "artist-5",
      slug: "vikram-singh-royal-weddings",
      name: "Vikram Rathore",
      businessName: "Rathore Heritage Studios",
      city: "Jaipur / Udaipur",
      avgRating: 4.99,
      totalReviews: 76,
    },
  },
  {
    id: "pkg-4",
    name: "Cinematic Pre-Wedding Concept Shoot",
    description:
      "Full-day editorial concept shoot in scenic destination locations with 2 cinematic drone shooters, 1 candid photographer, and same-week trailer teaser.",
    price: 75000,
    durationHours: 8.0,
    includedServices: [
      "4K Cinematic Drone & Gimbal Coverage",
      "3 Location Shifts & Outfit Variations",
      "60-Second Viral Instagram Reel Teaser",
      "100+ High-Resolution Color-Graded Stills",
      "Full 3-5 Minute Cinematic Story Film",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
    category: "PRE_WEDDING",
    artist: {
      id: "artist-2",
      slug: "rohit-kapoor-cinematography",
      name: "Rohit Kapoor",
      businessName: "Kapoor Cinematic Memories",
      city: "Delhi NCR",
      avgRating: 4.95,
      totalReviews: 52,
    },
  },
  {
    id: "pkg-5",
    name: "Couture Hair & Draping Masterclass",
    description:
      "Exclusive hair sculpture package for brides seeking intricate traditional South Indian muhurtham jada braids, floral garlands, or royal vintage waves.",
    price: 18000,
    durationHours: 2.5,
    includedServices: [
      "Muhurtham Floral Jada Braid / Contemporary Bun",
      "Kanjeevaram Saree / Lehenga Precision Draping",
      "Hair Extension Matching & Texturizing",
      "Jewelry Fastening & Mathapatti Security",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
    category: "BRIDAL",
    artist: {
      id: "artist-4",
      slug: "tanvi-deshmukh-couture-hair",
      name: "Tanvi Deshmukh",
      businessName: "Tanvi Hair Couture & Draping",
      city: "Mumbai",
      avgRating: 4.92,
      totalReviews: 38,
    },
  },
  {
    id: "pkg-6",
    name: "The Complete Bridal Duo (Glam + Lens)",
    description:
      "The signature package uniting our top-tier makeup artist and candid photographer for flawless visual harmony from morning getting-ready to final vidaai.",
    price: 95000,
    durationHours: 10.0,
    includedServices: [
      "Bridal HD Airbrush + Hair Styling by Master Artist",
      "Full-Day Candid Photographer with 4K Prime Lenses",
      "Getting-Ready Behind-The-Scenes Portrait Session",
      "300+ Color-Graded Stills + High-Gloss Keepsake Album",
      "Complete Coordination Handled by GlamBook Concierge",
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    category: "BRIDAL",
    artist: {
      id: "artist-1",
      slug: "ananya-sharma-bridal-studio",
      name: "Ananya Sharma",
      businessName: "Ananya Haute Bridal Glam",
      city: "Mumbai",
      avgRating: 4.98,
      totalReviews: 68,
    },
  },
];

export default function PackagesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedArtistForBooking, setSelectedArtistForBooking] =
    useState<BookingArtist | null>(null);

  const filteredPackages = CURATED_PACKAGES.filter((p) => {
    if (activeCategory === "ALL") return true;
    return p.category === activeCategory;
  });

  const handleBookPackage = (pkg: PackageItem) => {
    setSelectedArtistForBooking({
      id: pkg.artist.id,
      name: pkg.artist.name,
      businessName: pkg.artist.businessName,
      city: pkg.artist.city,
      packages: [
        {
          id: pkg.id,
          name: pkg.name,
          price: pkg.price,
          durationHours: pkg.durationHours || null,
        },
      ],
    });
    setBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Styling Collections</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight">
            Curated Bridal &amp; Celebration Packages
          </h1>
          <p className="text-sm sm:text-base text-neutral-400">
            Handcrafted service bundles created by verified stylists and photographers. Transparent rates, comprehensive coverage, and zero booking markups.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "ALL", label: "All Packages" },
            { id: "BRIDAL", label: "Bridal Ceremony" },
            { id: "PARTY", label: "Sangeet & Cocktail" },
            { id: "DESTINATION", label: "Destination Weddings" },
            { id: "PRE_WEDDING", label: "Pre-Wedding Shoots" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition whitespace-nowrap min-h-[44px] ${
                activeCategory === tab.id
                  ? "bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20"
                  : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="rounded-3xl bg-neutral-900/70 border border-neutral-800/80 hover:border-amber-500/40 hover:bg-neutral-900 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl group"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                <img
                  src={pkg.imageUrl || ""}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-md text-[11px] font-semibold text-amber-300 border border-amber-500/30">
                  {pkg.durationHours ? `${pkg.durationHours} Hours Session` : "Custom Duration"}
                </span>
              </div>

              {/* Package Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  {/* Artist Tag */}
                  <div className="flex items-center justify-between text-xs">
                    <Link
                      href={`/artist/${pkg.artist.slug}`}
                      className="font-medium text-amber-400 hover:underline truncate max-w-[200px]"
                    >
                      {pkg.artist.businessName}
                    </Link>
                    <span className="text-neutral-500">{pkg.artist.city}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition">
                    {pkg.name}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {pkg.description}
                  </p>

                  {/* Included Services Checklist */}
                  <div className="pt-2 space-y-2">
                    <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block">
                      Package Inclusions:
                    </span>
                    <ul className="space-y-1.5">
                      {pkg.includedServices.map((service, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Total Package
                    </span>
                    <span className="font-sans text-xl font-bold text-amber-300">
                      ₹{pkg.price.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookPackage(pkg)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition min-h-[44px]"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Inquire Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedArtistForBooking && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => {
            setBookingModalOpen(false);
            setSelectedArtistForBooking(null);
          }}
          artist={selectedArtistForBooking}
        />
      )}
    </div>
  );
}
