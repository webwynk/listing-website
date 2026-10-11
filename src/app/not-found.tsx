import Link from "next/link";
import { Sparkles, ArrowRight, Home, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-primary/30 text-primary text-xs font-semibold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Page Not Found</span>
        </div>

        <h1 className="font-heading text-7xl sm:text-9xl font-bold text-neutral-100 tracking-tight">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-neutral-100">
            The page you seek has vanished into thin air
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-md mx-auto">
            The artist portfolio, bridal look, or link you are looking for may have been moved, updated, or does not exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            asChild
            className="w-full sm:w-auto min-h-[44px] px-6 text-sm font-semibold gap-2"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto min-h-[44px] px-6 text-sm font-semibold gap-2 border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200"
          >
            <Link href="/artists">
              <Compass className="w-4 h-4" />
              Explore Artists
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
