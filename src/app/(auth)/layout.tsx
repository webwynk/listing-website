import Link from "next/link";
import { Sparkles, ArrowLeft, ShieldCheck, Star, Heart } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col lg:flex-row text-neutral-100">
      {/* Visual Showcase Panel (Desktop / Tablet Large) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-neutral-950 via-neutral-900 to-amber-950/40 p-12 xl:p-16 flex-col justify-between border-r border-neutral-800/80 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-wider text-white">
              Glam<span className="text-amber-400">Book</span>
            </span>
          </Link>
        </div>

        {/* Center Editorial Quote & Features */}
        <div className="relative z-10 max-w-lg space-y-8 my-auto">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              India&apos;s Premier Beauty & Visuals Directory
            </span>
            <h1 className="text-4xl xl:text-5xl font-serif font-bold text-white leading-tight">
              Curating moments of timeless elegance.
            </h1>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Connect directly with verified elite makeup artists and creative photographers across top Indian cities. Direct booking coordination, transparent pricing, and zero commissions.
            </p>
          </div>

          {/* Value Props Pills */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span>100% Verified portfolios & authentic client reviews</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Star className="w-4 h-4" />
              </div>
              <span>Direct WhatsApp & phone coordination with artists</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-neutral-300">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <span>Personalized favorites, booking requests, and calendar alerts</span>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="relative z-10 pt-8 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
          <span>Trusted by thousands of brides & creators</span>
          <span>© {new Date().getFullYear()} GlamBook Luxe</span>
        </div>
      </div>

      {/* Auth Interaction Panel (Right side or full on mobile) */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 relative">
        {/* Top Navigation */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <Link
            href="/"
            className="flex lg:hidden items-center gap-2 group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-serif text-xl font-bold tracking-wider text-white">
              Glam<span className="text-amber-400">Book</span>
            </span>
          </Link>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded-xl transition min-h-[44px] ml-auto"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>

        {/* Center Container for Auth Form */}
        <div className="w-full max-w-md mx-auto my-auto py-8">
          {children}
        </div>

        {/* Bottom Mobile Footer */}
        <div className="w-full max-w-md mx-auto pt-6 text-center text-xs text-neutral-500 lg:hidden">
          © {new Date().getFullYear()} GlamBook • Privacy & Terms
        </div>
      </div>
    </div>
  );
}
