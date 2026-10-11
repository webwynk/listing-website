import { prisma } from "./prisma";

export interface CategoryCardData {
  id: string;
  name: string;
  slug: string;
  description: string;
  tagline?: string;
  artistCount: string;
  imageUrl: string;
  group?: "makeup" | "photography" | "mehendi" | "hair-nails" | string;
  sortOrder?: number;
}

export const DEFAULT_CATEGORIES: CategoryCardData[] = [
  {
    id: "cat-bridal-makeup",
    name: "Bridal Makeup",
    slug: "bridal-makeup",
    description: "Royal traditional ceremony, pheras & evening reception glam",
    tagline: "Ceremony & Reception Glam",
    artistCount: "24+ Artists",
    group: "makeup",
    imageUrl: "/images/hero-bride.jpg",
    sortOrder: 1,
  },
  {
    id: "cat-airbrush-makeup",
    name: "HD & Airbrush Makeup",
    slug: "hd-airbrush-makeup",
    description: "Flawless, sweat-resistant silicone finish engineered for 4K lenses",
    tagline: "Precision 4K Camera Finish",
    artistCount: "18+ Artists",
    group: "makeup",
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=900&auto=format&fit=crop",
    sortOrder: 2,
  },
  {
    id: "cat-wedding-photography",
    name: "Wedding Photography",
    slug: "photographer",
    description: "Cinematic memories, candid tears & heirloom bridal portraits",
    tagline: "Heirloom Cinematography",
    artistCount: "20+ Artists",
    group: "photography",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900&auto=format&fit=crop",
    sortOrder: 3,
  },
  {
    id: "cat-mehndi-artist",
    name: "Bridal Mehndi",
    slug: "mehndi-artist",
    description: "Intricate Rajasthani, Arabic, and personalized bridal henna narratives",
    tagline: "Bespoke Henna Narratives",
    artistCount: "16+ Artists",
    group: "mehendi",
    imageUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=900&auto=format&fit=crop",
    sortOrder: 4,
  },
  {
    id: "cat-pre-wedding",
    name: "Pre-Wedding Shoots",
    slug: "pre-wedding",
    description: "Editorial concept shoots in scenic destinations across India",
    tagline: "Destination Love Stories",
    artistCount: "14+ Artists",
    group: "photography",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=900&auto=format&fit=crop",
    sortOrder: 5,
  },
  {
    id: "cat-hair-styling",
    name: "Haute Hair Styling",
    slug: "hair-stylist",
    description: "Floral South Indian braids, textured Hollywood waves & couture updos",
    tagline: "Couture Braids & Waves",
    artistCount: "15+ Artists",
    group: "hair-nails",
    imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=900&auto=format&fit=crop",
    sortOrder: 6,
  },
  {
    id: "cat-nail-artist",
    name: "Nail Art & Extensions",
    slug: "nail-artist",
    description: "Swarovski crystal embellishments, ombre gel sets & bridal manicures",
    tagline: "Swarovski & Ombre Sets",
    artistCount: "12+ Artists",
    group: "hair-nails",
    imageUrl: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=900&auto=format&fit=crop",
    sortOrder: 7,
  },
  {
    id: "cat-destination-weddings",
    name: "Destination Squads",
    slug: "destination-weddings",
    description: "Full glam entourages travelling to Udaipur, Goa, Jaipur & worldwide",
    tagline: "Traveling Glam Entourages",
    artistCount: "12+ Artists",
    group: "makeup",
    imageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=900&auto=format&fit=crop",
    sortOrder: 8,
  },
];

/**
 * Returns active categories with database sync and high-availability default fallback
 */
export async function getActiveCategories(): Promise<CategoryCardData[]> {
  try {
    const dbCategories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            artistServices: true,
          },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    if (!dbCategories || dbCategories.length === 0) {
      return DEFAULT_CATEGORIES;
    }

    // Map database categories to CategoryCardData
    return dbCategories.map((c, idx) => {
      // Find matching default fallback for image or default fallback image
      const fallback =
        DEFAULT_CATEGORIES.find((df) => df.slug === c.slug) ||
        DEFAULT_CATEGORIES[idx % DEFAULT_CATEGORIES.length];
      const servicesCount = c._count?.artistServices || 0;
      const countLabel =
        servicesCount > 0 ? `${servicesCount * 6 + 10}+ Artists` : fallback.artistCount;

      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || fallback.description,
        tagline: fallback.tagline,
        artistCount: countLabel,
        imageUrl: c.imageUrl || fallback.imageUrl,
        group: fallback.group || "makeup",
        sortOrder: c.sortOrder,
      };
    });
  } catch (error) {
    console.warn("Falling back to DEFAULT_CATEGORIES due to database read error:", error);
    return DEFAULT_CATEGORIES;
  }
}
