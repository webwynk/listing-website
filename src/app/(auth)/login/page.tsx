"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid email or password.");
      }

      const user = data.data.user;

      // Handle role-based smart routing
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else if (user.role === "ARTIST") {
        if (!user.artistProfile || user.artistProfile.status === "PENDING" && !user.artistProfile.businessName) {
          router.push("/artist/onboarding");
        } else {
          router.push("/artist/dashboard");
        }
      } else {
        if (redirectUrl && redirectUrl.startsWith("/")) {
          router.push(redirectUrl);
        } else {
          router.push("/user/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-neutral-900/70 border border-neutral-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
      {/* Title */}
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
          Welcome Back
        </h2>
        <p className="text-xs text-neutral-400">
          Sign in to access your bookings, favorites, or artist dashboard
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-amber-400 hover:text-amber-300 transition"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-12 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500/40"
            />
            <span className="text-xs text-neutral-400">Remember this device</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50 min-h-[44px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Signing In...
            </>
          ) : (
            "Sign In to GlamBook"
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-neutral-800 text-center space-y-3">
        <p className="text-xs text-neutral-400">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/signup"
            className="text-amber-400 hover:text-amber-300 font-semibold transition"
          >
            Create an Account
          </Link>
        </p>

        <p className="text-[11px] text-neutral-500">
          Are you an Admin?{" "}
          <Link href="/admin/login" className="text-neutral-400 hover:text-white underline">
            Admin Portal Access
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-3xl animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
