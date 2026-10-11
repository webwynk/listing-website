"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Sparkles,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<"USER" | "ARTIST">("USER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.");
      return;
    }

    if (!agreedToTerms) {
      setError("Please accept the Terms of Service & Privacy Policy to continue.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: Record<string, any> = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      };

      if (phone.trim()) {
        payload.phone = phone.trim();
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  // Success Confirmation View
  if (isSuccess) {
    return (
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            Account Created Successfully!
          </h2>
          <p className="text-sm text-neutral-300">
            We have sent a verification email to:
          </p>
          <p className="text-sm font-semibold text-amber-400">{email}</p>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
          Please check your inbox (and spam folder) and click the verification link to activate your account.
        </p>

        <div className="pt-4 border-t border-neutral-800 space-y-3">
          {role === "ARTIST" ? (
            <Link
              href="/artist/onboarding"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 min-h-[44px]"
            >
              Continue to Artist Onboarding
            </Link>
          ) : (
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 min-h-[44px]"
            >
              Proceed to Sign In
            </Link>
          )}

          <Link
            href={`/verify-email?email=${encodeURIComponent(email)}`}
            className="block text-xs text-neutral-400 hover:text-white transition py-2"
          >
            Enter token manually or resend email →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/70 border border-neutral-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
      {/* Title */}
      <div className="space-y-1 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide">
          Join GlamBook
        </h2>
        <p className="text-xs text-neutral-400">
          Create your account in less than a minute
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="p-1 bg-neutral-950/80 border border-neutral-800 rounded-2xl grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={() => setRole("USER")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition min-h-[44px] ${
            role === "USER"
              ? "bg-neutral-800 text-white shadow-md border border-neutral-700/60"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <User className="w-3.5 h-3.5 text-amber-400" />
          I&apos;m a Client
        </button>

        <button
          type="button"
          onClick={() => setRole("ARTIST")}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition min-h-[44px] ${
            role === "ARTIST"
              ? "bg-amber-500/10 text-amber-300 shadow-md border border-amber-500/30"
              : "text-neutral-400 hover:text-neutral-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          I&apos;m an Artist / Studio
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "ARTIST" ? "e.g. Natasha Mehra" : "e.g. Ananya Sharma"}
              className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Email Address *
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

        {/* Phone (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Phone Number {role === "ARTIST" ? "*" : "(Optional)"}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
              <Phone className="w-4 h-4" />
            </span>
            <input
              type="tel"
              required={role === "ARTIST"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Password *
          </label>
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

          {/* Password Validation Checklist */}
          {password.length > 0 && (
            <div className="mt-2.5 space-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                    hasMinLength ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-800 text-neutral-500"
                  }`}
                >
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className={hasMinLength ? "text-emerald-400" : "text-neutral-500"}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                    hasUppercase ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-800 text-neutral-500"
                  }`}
                >
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className={hasUppercase ? "text-emerald-400" : "text-neutral-500"}>
                  At least 1 uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                    hasNumber ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-800 text-neutral-500"
                  }`}
                >
                  <Check className="w-2.5 h-2.5" />
                </div>
                <span className={hasNumber ? "text-emerald-400" : "text-neutral-500"}>
                  At least 1 number
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Terms of Service Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500/40"
            />
            <span className="text-xs text-neutral-400 leading-normal">
              I agree to the{" "}
              <Link href="/terms" className="text-amber-400 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-amber-400 hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
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
              Creating Account...
            </>
          ) : role === "ARTIST" ? (
            "Register as an Artist"
          ) : (
            "Create Client Account"
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-neutral-800 text-center">
        <p className="text-xs text-neutral-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-amber-400 hover:text-amber-300 font-semibold transition"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
