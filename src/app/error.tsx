"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring if configured
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-neutral-100">
            An Unexpected Glitch Occurred
          </h1>
          <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-md mx-auto">
            We apologize for the inconvenience. Our concierge and technical teams have been alerted. You can attempt to refresh the view or return home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto min-h-[44px] px-6 text-sm font-semibold gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto min-h-[44px] px-6 text-sm font-semibold gap-2 border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-200"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            className="w-full sm:w-auto min-h-[44px] px-4 text-sm font-medium gap-2 text-neutral-400 hover:text-white"
          >
            <Link href="/contact">
              <MessageSquare className="w-4 h-4" />
              Concierge Support
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
