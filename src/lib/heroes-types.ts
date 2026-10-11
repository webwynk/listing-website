export interface HeroSlide {
  id: string;
  category: "makeup" | "photography" | "mehendi" | string;
  categoryLabel: string;
  eyebrow: string;
  title: string;
  subheading: string;
  imageUrl: string;
}

export interface PageHeroConfig {
  page: string;
  eyebrow: string;
  title: string;
  subheading: string;
  imageUrl: string;
  mobileImageUrl?: string;
  buttonText?: string;
  badgeText?: string;
  slides?: HeroSlide[];
}

export const DEFAULT_PAGE_HEROES: Record<string, PageHeroConfig> = {
  home: {
    page: "home",
    eyebrow: "PROFESSIONAL MAKEUP ARTISTS",
    title: "Look Beautiful For Every Moment",
    subheading:
      "Find and book the best makeup artists for weddings, parties, photoshoots and more — all in one place.",
    imageUrl: "/images/hero-bride.jpg",
    mobileImageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    buttonText: "Search",
    slides: [
      {
        id: "slide-makeup",
        category: "makeup",
        categoryLabel: "Bridal Makeup",
        eyebrow: "PROFESSIONAL MAKEUP ARTISTS",
        title: "Look Beautiful For Every Moment",
        subheading:
          "Find and book verified bridal makeup artists and celebrity hair stylists across 25+ cities in India.",
        imageUrl: "/images/hero-bride.jpg",
      },
      {
        id: "slide-photography",
        category: "photography",
        categoryLabel: "Wedding Photography",
        eyebrow: "CINEMATIC WEDDING PHOTOGRAPHY",
        title: "Capture Every Timeless Memory",
        subheading:
          "Connect with award-winning wedding photographers and pre-wedding cinematographers for your special celebrations.",
        imageUrl: "/images/hero-photography.jpg",
      },
      {
        id: "slide-mehendi",
        category: "mehendi",
        categoryLabel: "Bridal Mehendi",
        eyebrow: "EXQUISITE BRIDAL MEHENDI",
        title: "Intricate Henna Art For Your Big Day",
        subheading:
          "Discover celebrated henna designers specializing in traditional Rajasthani, Arabic, and contemporary bridal motifs.",
        imageUrl: "/images/hero-mehendi.jpg",
      },
    ],
  },
  artists: {
    page: "artists",
    eyebrow: "CURATED TALENT",
    title: "Discover Elite Makeup Artists",
    subheading:
      "Browse verified bridal stylists and celebrity artists across 25+ cities in India.",
    imageUrl:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069&auto=format&fit=crop",
  },
  packages: {
    page: "packages",
    eyebrow: "BRIDAL PACKAGES",
    title: "Complete Bridal & Occasion Packages",
    subheading:
      "All-inclusive styling, hair, and makeup bundles designed for unforgettable celebrations.",
    imageUrl:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=2070&auto=format&fit=crop",
  },
  "how-it-works": {
    page: "how-it-works",
    eyebrow: "CONCIERGE PROCESS",
    title: "How GlamBook Works",
    subheading:
      "From artist discovery to your wedding day glam — simple, transparent, and verified.",
    imageUrl:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=2074&auto=format&fit=crop",
  },
  about: {
    page: "about",
    eyebrow: "OUR HERITAGE",
    title: "The Art of Elegance",
    subheading:
      "Connecting discerning brides with India's most talented beauty creators.",
    imageUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2087&auto=format&fit=crop",
  },
  contact: {
    page: "contact",
    eyebrow: "REACH OUT",
    title: "We Are Here For You",
    subheading:
      "Have a question about a booking, partnership, or custom requirements? Talk to our concierge.",
    imageUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2000&auto=format&fit=crop",
  },
  blog: {
    page: "blog",
    eyebrow: "BEAUTY JOURNAL",
    title: "Trends, Guides & Inspiration",
    subheading:
      "Expert makeup insights, runway bridal trends, and essential skincare regimens.",
    imageUrl:
      "https://images.unsplash.com/photo-1503236823255-94609f598e71?q=80&w=2069&auto=format&fit=crop",
  },
};
