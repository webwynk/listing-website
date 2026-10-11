"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  Heart,
  Bell,
  User,
  ExternalLink,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserSidebarProps {
  onCloseMobile?: () => void;
  unreadCount?: number;
  userName?: string;
  avatarUrl?: string | null;
}

const navItems = [
  {
    label: "Overview",
    href: "/user/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Bookings",
    href: "/user/bookings",
    icon: CalendarCheck,
  },
  {
    label: "Saved Favorites",
    href: "/user/favorites",
    icon: Heart,
  },
  {
    label: "Notifications",
    href: "/user/notifications",
    icon: Bell,
    badgeKey: "notifications",
  },
  {
    label: "Profile & Security",
    href: "/user/profile",
    icon: User,
  },
];

export function UserSidebar({
  onCloseMobile,
  unreadCount = 0,
  userName = "Client",
  avatarUrl,
}: UserSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    } finally {
      router.push("/login");
    }
  }

  return (
    <aside className="w-64 h-full bg-neutral-950/95 border-r border-neutral-800/80 flex flex-col justify-between p-4 select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pt-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 shadow-md shadow-amber-500/10 group-hover:scale-105 transition">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-wider text-white">
                Glam<span className="text-amber-400">Book</span>
              </span>
              <span className="block text-[10px] text-amber-400 font-medium tracking-widest uppercase">
                Client Portal
              </span>
            </div>
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User Mini Card */}
        <div className="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-2xl flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-9 h-9 rounded-full object-cover border border-amber-500/30"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-neutral-800 border border-amber-500/20 text-amber-300 flex items-center justify-center text-xs font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span className="text-xs font-semibold text-white block truncate">
              {userName}
            </span>
            <span className="text-[11px] text-neutral-400 block truncate">
              Client Member
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5" aria-label="Client Portal Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/user/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition min-h-[44px]",
                  isActive
                    ? "bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold"
                    : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-amber-400" : "text-neutral-500"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badgeKey === "notifications" && unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500 text-neutral-950 font-bold">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-2 pt-4 border-t border-neutral-800/80">
        <Link
          href="/artists"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-neutral-900/60 transition min-h-[44px]"
        >
          <div className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4 text-neutral-500" />
            <span>Browse Artists</span>
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-red-400 hover:bg-red-950/20 transition min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
