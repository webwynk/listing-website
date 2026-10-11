import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { ArtistCard, ArtistCardItem } from "@/components/shared/artist-card";

interface SimilarArtistsProps {
  similarArtists: ArtistCardItem[];
  currentCity?: string;
}

export function SimilarArtists({
  similarArtists,
  currentCity,
}: SimilarArtistsProps) {
  if (!similarArtists || similarArtists.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6 pt-10 border-t border-black/[0.06]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#eb7583] font-body mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#eb7583]" />
            <span>Discover More Talent</span>
          </div>
          <h2 className="font-title text-2xl sm:text-3xl font-medium text-[#1e1a19] tracking-tight">
            Similar Artists in {currentCity || "Your Area"}
          </h2>
        </div>

        <Link
          href={`/artists?city=${currentCity || ""}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#eb7583] hover:text-[#d4616f] font-body transition-colors group min-h-[44px] self-start sm:self-auto"
        >
          <span>Explore All in {currentCity || "India"}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {similarArtists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}
