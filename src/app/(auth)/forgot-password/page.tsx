"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to send password reset link.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-neutral-900/70 border border-neutral-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
      {isSubmitted ? (
        <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
              Check Your Inbox
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
              If an account is registered with <span className="text-amber-400 font-semibold">{email}</span>, we&apos;ve sent instructions to reset your password.
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-800 space-y-3">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-neutral-400 hover:text-white transition"
            >
              Didn&apos;t receive an email? Try another address
            </button>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl text-xs transition min-h-[44px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
              Forgot Your Password?
            </h2>
            <p className="text-xs text-neutral-400">
              Enter your registered email address and we&apos;ll send you a secure link to reset it.
            </p>
          </div>

          {error && (
            <div className="p-3.5 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Registered Email Address
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

            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50 min-h-[44px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
