"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Trash2,
  Camera,
} from "lucide-react";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string | null;
  avatarUrl: string | null;
  locationCity: string | null;
  locationState: string | null;
  isEmailVerified: boolean;
}

export default function UserProfilePage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"PROFILE" | "SECURITY" | "DANGER">("PROFILE");

  // Profile Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [locationCity, setLocationCity] = useState("");
  const [locationState, setLocationState] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Loading & Alert States
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const [feedback, setFeedback] = useState<{
    type: "SUCCESS" | "ERROR";
    message: string;
  } | null>(null);

  // Fetch initial profile
  async function loadProfile() {
    setIsPageLoading(true);
    try {
      const res = await fetch("/api/user/profile");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to load profile.");

      const u: UserProfileData = json.data.user;
      setName(u.name || "");
      setEmail(u.email || "");
      setPhone(u.phone || "");
      setLocationCity(u.locationCity || "");
      setLocationState(u.locationState || "");
      setAvatarUrl(u.avatarUrl || "");
      setIsEmailVerified(u.isEmailVerified);
    } catch (err: any) {
      setFeedback({ type: "ERROR", message: err.message });
    } finally {
      setIsPageLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  // Update Personal Details
  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    setIsProfileSaving(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim() || null,
          locationCity: locationCity.trim() || null,
          locationState: locationState.trim() || null,
          avatarUrl: avatarUrl.trim() || null,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update profile.");

      setFeedback({ type: "SUCCESS", message: "Profile details updated successfully." });
    } catch (err: any) {
      setFeedback({ type: "ERROR", message: err.message });
    } finally {
      setIsProfileSaving(false);
    }
  }

  // Update Password
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setFeedback({
        type: "ERROR",
        message: "New password must be at least 8 characters with 1 uppercase letter and 1 number.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "ERROR", message: "New passwords do not match." });
      return;
    }

    setIsPasswordSaving(true);

    try {
      const res = await fetch("/api/user/profile/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to update password.");

      setFeedback({ type: "SUCCESS", message: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setFeedback({ type: "ERROR", message: err.message });
    } finally {
      setIsPasswordSaving(false);
    }
  }

  // Deactivate Account
  async function handleDeactivateAccount() {
    setIsDeactivating(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to deactivate account.");

      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login?message=account_deactivated");
    } catch (err: any) {
      alert(err.message || "Could not deactivate account.");
      setIsDeactivating(false);
      setShowDeactivateModal(false);
    }
  }

  // Password validation flags
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  if (isPageLoading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400 mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-wide flex items-center gap-3">
          <User className="w-7 h-7 text-amber-400" />
          Profile & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Manage your personal details, contact preferences, and account security
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-1 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab("PROFILE");
            setFeedback(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition min-h-[44px] flex items-center gap-2 ${
            activeTab === "PROFILE"
              ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
              : "text-neutral-400 hover:text-white hover:bg-neutral-900"
          }`}
        >
          <User className="w-4 h-4" />
          Personal Details
        </button>

        <button
          onClick={() => {
            setActiveTab("SECURITY");
            setFeedback(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition min-h-[44px] flex items-center gap-2 ${
            activeTab === "SECURITY"
              ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
              : "text-neutral-400 hover:text-white hover:bg-neutral-900"
          }`}
        >
          <Lock className="w-4 h-4" />
          Security & Password
        </button>

        <button
          onClick={() => {
            setActiveTab("DANGER");
            setFeedback(null);
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition min-h-[44px] flex items-center gap-2 ${
            activeTab === "DANGER"
              ? "bg-red-500/10 text-red-300 border border-red-500/20"
              : "text-neutral-400 hover:text-red-400 hover:bg-neutral-900"
          }`}
        >
          <Trash2 className="w-4 h-4" />
          Danger Zone
        </button>
      </div>

      {/* Alert Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-start gap-3 border ${
            feedback.type === "SUCCESS"
              ? "bg-emerald-950/30 border-emerald-800/40 text-emerald-300"
              : "bg-red-950/30 border-red-800/40 text-red-300"
          }`}
        >
          {feedback.type === "SUCCESS" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tab 1: Personal Details */}
      {activeTab === "PROFILE" && (
        <form
          onSubmit={handleProfileSubmit}
          className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6"
        >
          {/* Avatar Preview & URL */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-neutral-800/80">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-amber-500/40 shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-neutral-800 border-2 border-neutral-700 text-amber-300 flex items-center justify-center text-2xl font-bold shadow-xl">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>

            <div className="flex-1 w-full space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Avatar Photo URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
              />
              <span className="text-[11px] text-neutral-500 block">
                Paste a direct image link from Unsplash, Imgur, or cloud storage
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                  className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
                />
              </div>
            </div>

            {/* Email (Read-Only) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Email Address
                </label>
                {isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-400">Unverified</span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-600">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950/50 border border-neutral-800/60 rounded-xl text-neutral-400 text-base md:text-sm cursor-not-allowed min-h-[44px]"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                  <Phone className="w-4 h-4" />
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                City / Location
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500">
                  <MapPin className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={locationCity}
                  onChange={(e) => setLocationCity(e.target.value)}
                  placeholder="e.g. Mumbai, Bangalore"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end">
            <button
              type="submit"
              disabled={isProfileSaving}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2 min-h-[44px]"
            >
              {isProfileSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === "SECURITY" && (
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-neutral-900/70 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Change Account Password</h3>
            <p className="text-xs text-neutral-400">
              Update your password periodically to keep your account safe
            </p>
          </div>

          <div className="space-y-4 max-w-md">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-12 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
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
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-base md:text-sm focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/60 transition min-h-[44px]"
              />
              {confirmPassword.length > 0 && !isMatch && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-800 flex justify-end">
            <button
              type="submit"
              disabled={isPasswordSaving || !currentPassword || !hasMinLength || !isMatch}
              className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl text-sm transition disabled:opacity-50 flex items-center gap-2 min-h-[44px]"
            >
              {isPasswordSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Danger Zone */}
      {activeTab === "DANGER" && (
        <div className="bg-red-950/10 border border-red-800/40 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-red-400">Deactivate Account</h3>
            <p className="text-xs text-neutral-400">
              Deactivating your account will suspend your booking inquiries and sign you out across all devices.
            </p>
          </div>

          <div className="p-4 bg-neutral-950 border border-red-900/40 rounded-2xl space-y-2">
            <span className="text-xs text-neutral-300 font-medium block">
              What happens upon deactivation:
            </span>
            <ul className="text-xs text-neutral-400 list-disc pl-4 space-y-1">
              <li>Your saved favorites and booking history will no longer be visible.</li>
              <li>Pending requests with artists will be paused.</li>
              <li>You can reactivate your account anytime by contacting GlamBook support.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setShowDeactivateModal(true)}
            className="px-5 py-2.5 bg-red-600/90 hover:bg-red-600 text-white rounded-xl text-xs font-semibold transition min-h-[44px]"
          >
            Deactivate My Account
          </button>
        </div>
      )}

      {/* Deactivation Confirmation Modal */}
      {showDeactivateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                Deactivate Your Account?
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Are you sure you want to proceed? You will be signed out immediately.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-medium transition min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeactivating}
                onClick={handleDeactivateAccount}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center gap-1.5 min-h-[44px]"
              >
                {isDeactivating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
