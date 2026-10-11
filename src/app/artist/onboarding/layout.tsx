import { ReactNode } from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Artist Onboarding & Verification | GlamBook",
  description: "Complete your professional artist profile to join India's top beauty marketplace",
};

export default function ArtistOnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50/60 flex flex-col font-sans">
      {/* Onboarding Header */}
      <header className="bg-white border-b border-border/80 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1e1a19] group-hover:text-[#eb7583] transition-colors">
              GlamBook
            </span>
            <span className="text-[11px] font-semibold text-[#eb7583] bg-[#fcf1ef] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Artist Verification
            </span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">100% Curated & Verified Profiles</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 py-8 px-4 max-w-4xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground bg-white">
        <p>© 2026 GlamBook. Built for professional makeup artists, stylists, and photographers.</p>
      </footer>
    </div>
  );
}
