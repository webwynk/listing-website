"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ArrowRight,
} from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || searchParams.get("code") || "default_reset_token";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isValid = hasMinLength && hasUppercase && hasNumber && isMatch;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!hasMinLength || !hasUppercase || !hasNumber) {
      setError("Please ensure your new password meets all security requirements.");
      return;
    }

    if (!isMatch) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
            Password Reset Complete!
          </h2>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
            Your password has been securely updated. You can now use your new credentials to sign in.
          </p>
        </div>

        <div className="pt-4 border-t border-neutral-800">
          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 min-h-[44px]"
          >
            Sign In with New Password
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/70 border border-neutral-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
          Set New Password
        </h2>
        <p className="text-xs text-neutral-400">
          Choose a strong, unique password to protect your account
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            New Password *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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

          {/* Validation Checklist */}
          {newPassword.length > 0 && (
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

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
            Confirm New Password *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
            />
          </div>
          {confirmPassword.length > 0 && !isMatch && (
            <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !isValid}
          className="w-full mt-2 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50 min-h-[44px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating Password...
            </>
          ) : (
            "Set New Password"
          )}
        </button>
      </form>

      <div className="pt-4 border-t border-neutral-800 text-center">
        <Link
          href="/login"
          className="text-xs text-neutral-400 hover:text-white transition"
        >
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-3xl animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
