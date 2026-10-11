"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Bell,
  CheckCircle2,
  Clock,
  AlertCircle,
  ShieldAlert,
  User as UserIcon,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArtistHeaderProps {
  onOpenMobile?: () => void;
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string | null;
  } | null;
  artistProfile?: {
    businessName?: string | null;
    status?: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
    avgRating?: number;
  } | null;
}

export function ArtistHeader({
  onOpenMobile,
  user,
  artistProfile,
}: ArtistHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const status = artistProfile?.status || "PENDING";
  const displayName = artistProfile?.businessName || user?.name || "Artist";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  }

  return (
    <header className="h-16 bg-white border-b border-border/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      {/* Left: Mobile hamburger & title */}
      <div className="flex items-center gap-3">
        {onOpenMobile && (
          <button
            onClick={onOpenMobile}
            className="p-2 -ml-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div>
          <h1 className="font-semibold text-neutral-900 text-sm md:text-base leading-tight truncate max-w-[200px] sm:max-w-xs">
            {displayName}
          </h1>
          <p className="text-[11px] text-muted-foreground hidden sm:block">
            Professional Artist Portal
          </p>
        </div>
      </div>

      {/* Right: Status badge, Notification, and User Menu */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Verification Status Badge */}
        {status === "APPROVED" && (
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5 py-1 px-2.5 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="hidden xs:inline">Profile Active</span>
            <span className="xs:hidden">Live</span>
          </Badge>
        )}

        {status === "PENDING" && (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 flex items-center gap-1.5 py-1 px-2.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="hidden xs:inline">Under Review</span>
            <span className="xs:hidden">Review</span>
          </Badge>
        )}

        {status === "REJECTED" && (
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 flex items-center gap-1.5 py-1 px-2.5 text-xs">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="hidden xs:inline">Action Required</span>
            <span className="xs:hidden">Action</span>
          </Badge>
        )}

        {status === "SUSPENDED" && (
          <Badge className="bg-neutral-100 text-neutral-700 border-neutral-300 flex items-center gap-1.5 py-1 px-2.5 text-xs">
            <ShieldAlert className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            <span>Suspended</span>
          </Badge>
        )}

        {/* Notifications Shortcut */}
        <Link
          href="/artist/dashboard"
          className="relative p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </Link>

        {/* User Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#eb7583]/40 transition-all outline-hidden min-h-[44px] min-w-[44px] justify-center"
            aria-label="User menu"
            aria-expanded={menuOpen}
          >
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name || "Artist avatar"}
                className="w-8 h-8 rounded-full object-cover border border-border"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center font-bold text-xs border border-[#eb7583]/20">
                {user?.name ? user.name[0].toUpperCase() : "A"}
              </div>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-border/80 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3.5 py-2 border-b border-border/60">
                <p className="text-sm font-semibold text-neutral-900 leading-tight">
                  {user?.name || "Artist"}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {user?.email || ""}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/artist/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors min-h-[40px]"
                >
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                  <span>Edit Profile</span>
                </Link>

                <Link
                  href="/artist/services"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors min-h-[40px]"
                >
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  <span>Services & Pricing</span>
                </Link>
              </div>

              <div className="border-t border-border/60 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors min-h-[40px] text-left"
                >
                  <LogOut className="w-4 h-4 text-red-600" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
