"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || searchParams.get("token_hash") || "";
  const emailFromUrl = searchParams.get("email") || "";

  const [token, setToken] = useState(tokenFromUrl);
  const [email, setEmail] = useState(emailFromUrl);
  const [status, setStatus] = useState<"IDLE" | "VERIFYING" | "SUCCESS" | "ERROR">(
    tokenFromUrl ? "VERIFYING" : "IDLE"
  );
  const [message, setMessage] = useState<string>("");
  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  // Auto-verify if token is provided in the query string
  useEffect(() => {
    if (tokenFromUrl) {
      handleVerify(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  async function handleVerify(tokenToVerify: string) {
    setStatus("VERIFYING");
    setMessage("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToVerify.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification link is invalid or expired.");
      }

      setStatus("SUCCESS");
      setMessage(data.message || "Your email has been verified successfully!");
    } catch (err: any) {
      setStatus("ERROR");
      setMessage(err.message || "Unable to verify email.");
    }
  }

  async function handleResendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setIsResending(true);
    setResendNotice(null);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend verification email.");
      }

      setResendNotice("Verification link sent! Please check your inbox.");
    } catch (err: any) {
      setResendNotice(err.message || "Failed to resend verification link.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="bg-neutral-900/70 border border-neutral-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
      {/* Verifying State */}
      {status === "VERIFYING" && (
        <div className="text-center py-6 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Verifying Your Email...
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Securing your credentials and confirming your address
            </p>
          </div>
        </div>
      )}

      {/* Success State */}
      {status === "SUCCESS" && (
        <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">
              Email Verified!
            </h2>
            <p className="text-xs text-emerald-300 mt-1.5 font-medium">
              {message}
            </p>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
            Your GlamBook account is now fully active. You can now sign in to browse artists, save favorites, or manage bookings.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 min-h-[44px]"
            >
              Proceed to Sign In
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Error or Idle State */}
      {(status === "IDLE" || status === "ERROR") && (
        <div className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white">
              Verify Your Email Address
            </h2>
            <p className="text-xs text-neutral-400">
              We need to confirm your email before you can access all features
            </p>
          </div>

          {status === "ERROR" && (
            <div className="p-3.5 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
              <span>{message}</span>
            </div>
          )}

          {/* Manual Token Verification Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (token.trim()) handleVerify(token);
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Verification Code / Token
              </label>
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste verification token or code"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
              />
            </div>

            <button
              type="submit"
              disabled={!token.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl text-xs transition disabled:opacity-50 min-h-[44px]"
            >
              Verify Token
            </button>
          </form>

          {/* Resend Verification Email Section */}
          <div className="pt-5 border-t border-neutral-800 space-y-3">
            <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Need a new verification link?
            </h3>

            {resendNotice && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs">
                {resendNotice}
              </div>
            )}

            <form onSubmit={handleResendEmail} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="flex-1 px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
              />
              <button
                type="submit"
                disabled={isResending || !email.trim()}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-xs transition shadow-md shadow-amber-500/10 disabled:opacity-50 flex items-center gap-1.5 min-h-[44px] shrink-0"
              >
                {isResending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                Resend
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-neutral-800 text-center">
            <Link
              href="/login"
              className="text-xs text-neutral-400 hover:text-white transition"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-3xl animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
