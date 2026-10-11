import { ArtistCardItem } from "@/components/shared/artist-card";

export const CURATED_FEATURED_ARTISTS: ArtistCardItem[] = [
  {
    id: "artist-1",
    slug: "ananya-sharma-bridal-studio",
    name: "Ananya Sharma",
    businessName: "Ananya Haute Bridal Glam",
    coverImage: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
    categoryName: "Bridal Makeup",
    city: "Mumbai",
    startingPrice: 35000,
    avgRating: 4.98,
    totalReviews: 68,
    isFeatured: true,
    yearsOfExperience: 9,
  },
  {
    id: "artist-2",
    slug: "rohit-kapoor-cinematography",
    name: "Rohit Kapoor",
    businessName: "Kapoor Cinematic Memories",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    categoryName: "Wedding Photography",
    city: "Delhi NCR",
    startingPrice: 85000,
    avgRating: 4.95,
    totalReviews: 52,
    isFeatured: true,
    yearsOfExperience: 11,
  },
  {
    id: "artist-3",
    slug: "priya-menon-airbrush-artistry",
    name: "Priya Menon",
    businessName: "Priya Menon HD Airbrush",
    coverImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
    categoryName: "HD Airbrush Makeup",
    city: "Bangalore",
    startingPrice: 28000,
    avgRating: 5.0,
    totalReviews: 44,
    isFeatured: true,
    yearsOfExperience: 7,
  },
  {
    id: "artist-4",
    slug: "tanvi-deshmukh-couture-hair",
    name: "Tanvi Deshmukh",
    businessName: "Tanvi Hair Couture & Draping",
    coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
    categoryName: "Hair Styling",
    city: "Mumbai",
    startingPrice: 18000,
    avgRating: 4.92,
    totalReviews: 38,
    isFeatured: true,
    yearsOfExperience: 6,
  },
  {
    id: "artist-5",
    slug: "rathore-heritage-studios",
    name: "Vikram Rathore",
    businessName: "Rathore Heritage Studios",
    coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
    categoryName: "Wedding Photography",
    city: "Jaipur / Udaipur",
    startingPrice: 120000,
    avgRating: 4.99,
    totalReviews: 76,
    isFeatured: true,
    yearsOfExperience: 14,
  },
  {
    id: "artist-6",
    slug: "sanya-glam-studio",
    name: "Sanya Mirza",
    businessName: "Sanya Glam Studio",
    coverImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    categoryName: "Bridal Makeup",
    city: "Hyderabad",
    startingPrice: 32000,
    avgRating: 4.97,
    totalReviews: 49,
    isFeatured: true,
    yearsOfExperience: 8,
  },
  {
    id: "artist-7",
    slug: "zoya-khan-pre-wedding",
    name: "Zoya Khan",
    businessName: "Zoya Khan Visuals",
    coverImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    categoryName: "Pre-Wedding Shoot",
    city: "Goa",
    startingPrice: 45000,
    avgRating: 4.94,
    totalReviews: 35,
    isFeatured: true,
    yearsOfExperience: 5,
  },
  {
    id: "artist-8",
    slug: "meera-patel-destination-glam",
    name: "Meera Patel",
    businessName: "Meera Patel Luxury Bridal",
    coverImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    categoryName: "Bridal Makeup",
    city: "Jaipur",
    startingPrice: 50000,
    avgRating: 5.0,
    totalReviews: 41,
    isFeatured: true,
    yearsOfExperience: 10,
  },
];

export interface DetailedCuratedArtistProfile {
  id: string;
  userId: string;
  slug: string;
  name: string;
  businessName: string;
  bio: string;
  avatarUrl: string;
  coverImage: string;
  categoryName: string;
  city: string;
  state: string;
  experienceYears: number;
  serviceRadiusKm: number;
  avgRating: number;
  totalReviews: number;
  isFeatured: boolean;
  startingPrice: number;
  ratingsBreakdown: Record<number, number>;
  services: Array<{
    id: string;
    category: { name: string; slug: string };
    subCategory: { name: string; slug: string };
    priceFrom: number;
    priceTo?: number;
    priceType: string;
    durationMinutes: number;
    description: string;
  }>;
  portfolioItems: Array<{
    id: string;
    mediaUrl: string;
    title: string;
    mediaType: string;
  }>;
  packages: Array<{
    id: string;
    name: string;
    price: number;
    durationHours?: number;
    description?: string;
  }>;
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: { id: string; name: string; avatarUrl: string | null };
    booking: { serviceType?: string; eventType?: string; bookingDate: Date | string };
    artistReply?: string;
  }>;
  availability: Array<{
    id: string;
    date: Date | string;
    status: string;
    startTime?: string;
    endTime?: string;
    note?: string;
  }>;
  similarArtists: ArtistCardItem[];
}

export function getCuratedArtistProfile(slug: string): DetailedCuratedArtistProfile {
  const matched =
    CURATED_FEATURED_ARTISTS.find(
      (c) =>
        c.slug === slug ||
        c.id === slug ||
        (slug === "vikram-singh-royal-weddings" && c.slug === "rathore-heritage-studios") ||
        (slug === "sanya-mirza-glow-couture" && c.slug === "sanya-glam-studio")
    ) || CURATED_FEATURED_ARTISTS[0];

  const similar = CURATED_FEATURED_ARTISTS.filter((c) => c.slug !== matched.slug).slice(0, 3);

  // Category-specific services generator
  const isHair = matched.categoryName?.toLowerCase().includes("hair");
  const isPhoto =
    matched.categoryName?.toLowerCase().includes("photo") ||
    matched.categoryName?.toLowerCase().includes("cinemat");

  let services = [
    {
      id: "srv-1",
      category: { name: matched.categoryName || "Bridal Makeup", slug: "bridal-makeup" },
      subCategory: { name: "Signature HD Bridal Glam", slug: "hd-bridal" },
      priceFrom: matched.startingPrice || 25000,
      priceType: "STARTING_FROM",
      durationMinutes: 180,
      description: "Complete bridal makeup with luxury international lashes, hair couture styling, and jewelry draping.",
    },
    {
      id: "srv-2",
      category: { name: "Airbrush Makeup", slug: "airbrush-makeup" },
      subCategory: { name: "Temptu 4K Airbrush Bridal", slug: "temptu-airbrush" },
      priceFrom: (matched.startingPrice || 25000) + 8000,
      priceType: "FIXED",
      durationMinutes: 210,
      description: "Lightweight silicone-based airbrush foundation designed for maximum endurance and 4K flash cameras.",
    },
    {
      id: "srv-3",
      category: { name: "Bridal Makeup", slug: "bridal-makeup" },
      subCategory: { name: "Sangeet / Cocktail Glam", slug: "sangeet-glam" },
      priceFrom: Math.round((matched.startingPrice || 25000) * 0.7),
      priceType: "FIXED",
      durationMinutes: 120,
      description: "Bold evening glam with glitter pigments, editorial waves, and party styling.",
    },
  ];

  if (isHair) {
    services = [
      {
        id: "srv-1",
        category: { name: "Hair Styling", slug: "hair-styling" },
        subCategory: { name: "Royal Bridal Floral Braid & Bun", slug: "royal-bridal-hair" },
        priceFrom: matched.startingPrice || 18000,
        priceType: "STARTING_FROM",
        durationMinutes: 120,
        description: "Elaborate traditional floral braid or structured royal bun with fresh flower extensions and dupatta setting.",
      },
      {
        id: "srv-2",
        category: { name: "Hair Styling", slug: "hair-styling" },
        subCategory: { name: "Hollywood Waves & Textured Styling", slug: "hollywood-waves" },
        priceFrom: (matched.startingPrice || 18000) + 5000,
        priceType: "FIXED",
        durationMinutes: 90,
        description: "Glossy red-carpet waves with ceramic heat styling and 24-hour humidity-resistant hold.",
      },
      {
        id: "srv-3",
        category: { name: "Hair Styling", slug: "hair-styling" },
        subCategory: { name: "Mehendi Boho Braids", slug: "boho-braids" },
        priceFrom: Math.round((matched.startingPrice || 18000) * 0.75),
        priceType: "FIXED",
        durationMinutes: 90,
        description: "Playful boho-chic braids with baby's breath and floral accessories for day ceremonies.",
      },
    ];
  } else if (isPhoto) {
    services = [
      {
        id: "srv-1",
        category: { name: "Wedding Photography", slug: "wedding-photography" },
        subCategory: { name: "Cinematic Wedding Documentation (Full Day)", slug: "cinematic-full-day" },
        priceFrom: matched.startingPrice || 120000,
        priceType: "STARTING_FROM",
        durationMinutes: 600,
        description: "Dual cinematographers, 4K Sony FX3 raw footage, drone aerials, and 300+ hand-color-graded heirloom photographs.",
      },
      {
        id: "srv-2",
        category: { name: "Pre-Wedding Shoot", slug: "pre-wedding-shoot" },
        subCategory: { name: "Destination Cinematic Love Story", slug: "pre-wedding-teaser" },
        priceFrom: Math.round((matched.startingPrice || 120000) * 0.5),
        priceType: "FIXED",
        durationMinutes: 360,
        description: "1-day location shoot with 3 outfit changes, 3-minute teaser reel, and 50 edited portraits.",
      },
      {
        id: "srv-3",
        category: { name: "Wedding Photography", slug: "wedding-photography" },
        subCategory: { name: "Candid Traditional Portraiture", slug: "candid-portraits" },
        priceFrom: Math.round((matched.startingPrice || 120000) * 0.4),
        priceType: "FIXED",
        durationMinutes: 240,
        description: "Focused emotional and ritual coverage covering pheras, varmala, and reception moments.",
      },
    ];
  }

  const bio = isHair
    ? `Celebrated bridal hair stylist and draping artisan with over ${matched.yearsOfExperience || 6} years styling high-profile brides across Mumbai, Udaipur, and Goa. Specialized in architectural hair geometry, delicate floral interlacing, and royal dupatta positioning.`
    : isPhoto
    ? `Acclaimed visual storyteller and wedding cinematographer with ${matched.yearsOfExperience || 10}+ years capturing monumental celebrations. Known for timeless color grading, natural candids, and emotional cinematic films.`
    : `Master bridal makeup artist specializing in luminous, camera-ready high-definition glam and royal Indian wedding looks. Dedicated to enhancing authentic skin tone and creating timeless elegance that stays pristine through 12-hour rituals.`;

  return {
    id: matched.id,
    userId: matched.userId || matched.id,
    slug: matched.slug,
    name: matched.name,
    businessName: matched.businessName,
    bio,
    avatarUrl: matched.coverImage || "",
    coverImage: matched.coverImage || "",
    categoryName: matched.categoryName || "Bridal Makeup",
    city: matched.city || "Mumbai",
    state: "Maharashtra",
    experienceYears: matched.yearsOfExperience || 8,
    serviceRadiusKm: 50,
    avgRating: matched.avgRating || 4.98,
    totalReviews: matched.totalReviews || 45,
    isFeatured: matched.isFeatured ?? true,
    startingPrice: matched.startingPrice || 25000,
    ratingsBreakdown: { 5: Math.round((matched.totalReviews || 45) * 0.88), 4: Math.round((matched.totalReviews || 45) * 0.12), 3: 0, 2: 0, 1: 0 },
    services,
    portfolioItems: [
      {
        id: "port-1",
        mediaUrl: matched.coverImage || "",
        title: "Signature Showcase Look",
        mediaType: "IMAGE",
      },
      {
        id: "port-2",
        mediaUrl: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=800&auto=format&fit=crop",
        title: "Royal Jaipur Heritage Celebration",
        mediaType: "IMAGE",
      },
      {
        id: "port-3",
        mediaUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
        title: "Palace Mandap Vows",
        mediaType: "IMAGE",
      },
      {
        id: "port-4",
        mediaUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop",
        title: "Contemporary Minimalist Reception",
        mediaType: "IMAGE",
      },
    ],
    packages: [
      {
        id: "pkg-1",
        name: "Complete Wedding Milestone Package",
        price: (matched.startingPrice || 25000) * 2,
        durationHours: 8,
        description: "Includes main ceremony and reception coverage with priority date reservation and complimentary trial.",
      },
    ],
    reviews: [
      {
        id: "rev-1",
        rating: 5,
        comment: "Absolutely breathtaking craftsmanship! The styling stayed fresh, radiant, and comfortable from morning pheras until the midnight reception.",
        createdAt: "2026-09-18T10:30:00.000Z",
        user: { id: "u-1", name: "Rhea Singhania", avatarUrl: null },
        booking: { serviceType: services[0].subCategory.name, bookingDate: "2026-09-12" },
        artistReply: "Thank you Rhea! It was an absolute honor being a part of your momentous celebration.",
      },
      {
        id: "rev-2",
        rating: 5,
        comment: "Flawless communication, extreme punctuality, and true mastery of detail. All our guests complimented the styling.",
        createdAt: "2026-08-25T14:20:00.000Z",
        user: { id: "u-2", name: "Ananya Mehta", avatarUrl: null },
        booking: { serviceType: services[0].subCategory.name, bookingDate: "2026-08-20" },
        artistReply: "Much love Ananya! Wishing you both a lifetime of happiness.",
      },
    ],
    availability: [],
    similarArtists: similar,
  };
}
