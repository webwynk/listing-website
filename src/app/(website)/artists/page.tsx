"use client";

import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import {
  FilterBar,
  FilterState,
  SortControls,
  ResultsGrid,
} from "@/components/find-artist";
import { ArtistCardItem } from "@/components/shared/artist-card";
import { PaginationMeta } from "@/lib/pagination";
import { BookingModal, BookingArtist } from "@/components/booking/booking-modal";

// 12 Curated Master Artists for fallback & directory demo coverage
const EXTENDED_DIRECTORY_ARTISTS: ArtistCardItem[] = [
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
    categoryName: "HD & Airbrush",
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
    categoryName: "Haute Hair Styling",
    city: "Mumbai",
    startingPrice: 18000,
    avgRating: 4.92,
    totalReviews: 38,
    isFeatured: true,
    yearsOfExperience: 6,
  },
  {
    id: "artist-5",
    slug: "vikram-singh-royal-weddings",
    name: "Vikram Rathore",
    businessName: "Rathore Heritage Studios",
    coverImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop",
    categoryName: "Wedding Photography",
    city: "Jaipur",
    startingPrice: 120000,
    avgRating: 4.99,
    totalReviews: 76,
    isFeatured: true,
    yearsOfExperience: 14,
  },
  {
    id: "artist-6",
    slug: "sanya-mirza-glow-couture",
    name: "Sanya Mirza",
    businessName: "Sanya Glam Studio",
    coverImage: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=800&auto=format&fit=crop",
    categoryName: "Bridal Makeup",
    city: "Hyderabad",
    startingPrice: 32000,
    avgRating: 4.96,
    totalReviews: 49,
    isFeatured: true,
    yearsOfExperience: 8,
  },
  {
    id: "artist-7",
    slug: "meera-nair-beach-weddings",
    name: "Meera Nair",
    businessName: "Coastal Glow by Meera",
    coverImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
    categoryName: "Bridal Makeup",
    city: "Goa",
    startingPrice: 42000,
    avgRating: 4.94,
    totalReviews: 31,
    isFeatured: false,
    yearsOfExperience: 8,
  },
  {
    id: "artist-8",
    slug: "arjun-verma-prewedding-couture",
    name: "Arjun Verma",
    businessName: "Verma Cinematic Frames",
    coverImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop",
    categoryName: "Pre-Wedding Shoots",
    city: "Delhi NCR",
    startingPrice: 65000,
    avgRating: 4.88,
    totalReviews: 40,
    isFeatured: false,
    yearsOfExperience: 9,
  },
  {
    id: "artist-9",
    slug: "zoya-khan-party-glam",
    name: "Zoya Khan",
    businessName: "Zoya Luxury Looks",
    coverImage: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=800&auto=format&fit=crop",
    categoryName: "Party & Cocktail Glam",
    city: "Mumbai",
    startingPrice: 22000,
    avgRating: 4.89,
    totalReviews: 29,
    isFeatured: false,
    yearsOfExperience: 5,
  },
  {
    id: "artist-10",
    slug: "kavita-shroff-airbrush-specialist",
    name: "Kavita Shroff",
    businessName: "Kavita Airbrush Art",
    coverImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
    categoryName: "HD & Airbrush",
    city: "Bangalore",
    startingPrice: 38000,
    avgRating: 4.97,
    totalReviews: 57,
    isFeatured: false,
    yearsOfExperience: 10,
  },
  {
    id: "artist-11",
    slug: "rajeshwari-sen-royal-makeovers",
    name: "Rajeshwari Sen",
    businessName: "Sen Royal Draping & Hair",
    coverImage: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop",
    categoryName: "Haute Hair Styling",
    city: "Jaipur",
    startingPrice: 25000,
    avgRating: 4.91,
    totalReviews: 36,
    isFeatured: false,
    yearsOfExperience: 7,
  },
  {
    id: "artist-12",
    slug: "dev-kapur-beach-cinematics",
    name: "Dev Kapur",
    businessName: "Kapur Goa Stories",
    coverImage: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=800&auto=format&fit=crop",
    categoryName: "Wedding Photography",
    city: "Goa",
    startingPrice: 95000,
    avgRating: 4.93,
    totalReviews: 45,
    isFeatured: false,
    yearsOfExperience: 12,
  },
];

function FindArtistsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filter state from URL search params
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
    experience: searchParams.get("experience") || "",
    date: searchParams.get("date") || "",
  });

  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || "relevance"
  );
  const [currentPage, setCurrentPage] = useState<number>(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [artists, setArtists] = useState<ArtistCardItem[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedArtistForBooking, setSelectedArtistForBooking] =
    useState<BookingArtist | null>(null);

  // Update URL search parameters when filters or sort change
  const updateUrl = useCallback(
    (newFilters: FilterState, newSort: string, newPage: number) => {
      const params = new URLSearchParams();
      if (newFilters.search) params.set("search", newFilters.search);
      if (newFilters.city) params.set("city", newFilters.city);
      if (newFilters.category) params.set("category", newFilters.category);
      if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
      if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
      if (newFilters.minRating) params.set("minRating", newFilters.minRating);
      if (newFilters.experience) params.set("experience", newFilters.experience);
      if (newFilters.date) params.set("date", newFilters.date);
      if (newSort && newSort !== "relevance") params.set("sortBy", newSort);
      if (newPage > 1) params.set("page", newPage.toString());

      router.replace(`/artists?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  // Filter fallback dataset locally with high fidelity
  const filterFallbackData = useCallback(() => {
    let result = EXTENDED_DIRECTORY_ARTISTS.filter((a) => {
      // City Filter
      if (filters.city) {
        const targetCity = filters.city.toLowerCase().replace(/-/g, " ");
        const artistCity = (a.city || "").toLowerCase();
        if (!artistCity.includes(targetCity) && !targetCity.includes(artistCity)) {
          return false;
        }
      }

      // Category Filter
      if (filters.category) {
        const catKey = filters.category.toLowerCase().replace(/-/g, " ");
        const artistCat = (a.categoryName || "").toLowerCase();
        if (
          !artistCat.includes(catKey) &&
          !catKey.includes(artistCat.replace("makeup", "").trim())
        ) {
          return false;
        }
      }

      // Price Filters
      if (filters.minPrice) {
        const minP = parseFloat(filters.minPrice);
        if ((a.startingPrice || 0) < minP) return false;
      }
      if (filters.maxPrice) {
        const maxP = parseFloat(filters.maxPrice);
        if ((a.startingPrice || 0) > maxP) return false;
      }

      // Minimum Rating Filter
      if (filters.minRating) {
        const minR = parseFloat(filters.minRating);
        if ((a.avgRating || 5.0) < minR) return false;
      }

      // Experience Filter
      if (filters.experience) {
        const exp = a.yearsOfExperience || 0;
        if (filters.experience === "1-3" && (exp < 1 || exp > 3)) return false;
        if (filters.experience === "3-5" && (exp < 3 || exp > 5)) return false;
        if (filters.experience === "5-10" && (exp < 5 || exp > 10)) return false;
        if (filters.experience === "10+" && exp < 10) return false;
      }

      // Search Filter
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = a.name.toLowerCase().includes(q);
        const matchesBiz = a.businessName.toLowerCase().includes(q);
        const matchesCity = (a.city || "").toLowerCase().includes(q);
        const matchesCat = (a.categoryName || "").toLowerCase().includes(q);
        if (!matchesName && !matchesBiz && !matchesCity && !matchesCat) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (sortBy === "rating_desc") {
      result.sort((x, y) => (y.avgRating || 0) - (x.avgRating || 0));
    } else if (sortBy === "price_asc") {
      result.sort((x, y) => (x.startingPrice || 0) - (y.startingPrice || 0));
    } else if (sortBy === "price_desc") {
      result.sort((x, y) => (y.startingPrice || 0) - (x.startingPrice || 0));
    } else if (sortBy === "experience_desc") {
      result.sort((x, y) => (y.yearsOfExperience || 0) - (x.yearsOfExperience || 0));
    }

    return result;
  }, [filters, sortBy]);

  // Fetch artists from API or gracefully use curated fallback
  const fetchArtists = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filters.search) query.set("search", filters.search);
      if (filters.city) query.set("city", filters.city);
      if (filters.category) query.set("category", filters.category);
      if (filters.minPrice) query.set("minPrice", filters.minPrice);
      if (filters.maxPrice) query.set("maxPrice", filters.maxPrice);
      if (filters.minRating) query.set("minRating", filters.minRating);
      if (filters.experience) query.set("experience", filters.experience);
      if (filters.date) query.set("date", filters.date);
      if (sortBy) query.set("sortBy", sortBy);
      query.set("page", currentPage.toString());
      query.set("limit", "12");

      const res = await fetch(`/api/artists?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const apiArtists = json.data?.artists || [];
        const apiPagination = json.pagination || null;

        if (apiArtists.length > 0) {
          setArtists(apiArtists);
          setPagination(apiPagination);
          return;
        }
      }

      // Graceful fallback when DB is cold or returns empty
      const filtered = filterFallbackData();
      setArtists(filtered);
      setPagination({
        page: 1,
        limit: 12,
        total: filtered.length,
        totalPages: 1,
      });
    } catch (err) {
      console.error("Failed to load artists from API, using curated directory:", err);
      const filtered = filterFallbackData();
      setArtists(filtered);
      setPagination({
        page: 1,
        limit: 12,
        total: filtered.length,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, currentPage, filterFallbackData]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
    updateUrl(newFilters, sortBy, 1);
  };

  const handleResetFilters = () => {
    const cleared: FilterState = {
      search: "",
      city: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      experience: "",
      date: "",
    };
    setFilters(cleared);
    setSortBy("relevance");
    setCurrentPage(1);
    updateUrl(cleared, "relevance", 1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
    updateUrl(filters, newSort, 1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrl(filters, sortBy, newPage);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  const handleOpenBooking = (artist: ArtistCardItem) => {
    setSelectedArtistForBooking({
      id: artist.id,
      name: artist.name,
      businessName: artist.businessName,
      avatarUrl: artist.avatarUrl,
      city: artist.city,
    });
    setBookingModalOpen(true);
  };

  const totalResultsCount = pagination?.total ?? artists.length;

  return (
    <div className="min-h-screen bg-[#faf8f7] py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Editorial Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcf1ef] border border-[#fcdadb] text-[#eb7583] text-xs font-semibold font-body shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#eb7583]" />
            <span>Curated Directory • 100% Verified</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#1e1a19] tracking-tight leading-[1.15]">
            Find Elite Bridal Artists &amp; Studios
          </h1>
          <p className="text-sm sm:text-base text-[#76706e] max-w-2xl font-body leading-relaxed">
            Browse verified bridal beauty squads, couture hair stylists, and wedding photographers across India. Check genuine bride reviews, preview 4K portfolios, and coordinate directly with full privacy.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
          totalCount={totalResultsCount}
        />

        {/* Sort Controls & Meta Bar */}
        <SortControls
          totalCount={totalResultsCount}
          currentCount={artists.length}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Results Grid / List */}
        <ResultsGrid
          artists={artists}
          loading={loading}
          viewMode={viewMode}
          onResetFilters={handleResetFilters}
          pagination={pagination}
          onPageChange={handlePageChange}
          onBookClick={handleOpenBooking}
        />
      </div>

      {/* Booking Inquiry Modal */}
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

export default function FindArtistsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf8f7] py-16 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#eb7583] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#76706e] font-body">Loading verified artists...</p>
          </div>
        </div>
      }
    >
      <FindArtistsContent />
    </Suspense>
  );
}
