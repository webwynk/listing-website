"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Lock, Mail, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Verify that user has ADMIN role
      if (data.data?.user?.role !== "ADMIN") {
        // Sign out unauthorized user
        await fetch("/api/auth/logout", { method: "POST" });
        setError("Access Denied: Administrator privileges are required to access this portal.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/dashboard");
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1a19] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle brand glow in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#eb7583]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10 relative z-10 animate-in fade-in-0 duration-300">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#eb7583] text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="font-title text-3xl font-bold text-[#1e1a19]">GlamBook Admin</h1>
          <p className="text-sm text-gray-500 mt-1 font-body">
            Sign in with your master administrator credentials
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <span className="flex-1 font-medium">{error}</span>
          </div>
        )}

        {/* Success Alert Banner */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500" />
            <span className="font-medium">Authentication confirmed. Redirecting...</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Input
                type="email"
                placeholder="admin@glambook.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || success}
                className="pl-10"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || success}
                className="pl-10"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || success}
            className="w-full mt-6 bg-[#eb7583] hover:bg-[#d4616f] text-white font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Verifying credentials...</span>
            ) : success ? (
              <span>Success!</span>
            ) : (
              <>
                <span>Access Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          <span>Protected by GlamBook Security &amp; CSO Access Guards</span>
        </div>
      </div>
    </div>
  );
}
