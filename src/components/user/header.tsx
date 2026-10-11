"use client";

import Link from "next/link";
import {
  Menu,
  Bell,
  Sparkles,
  Search,
  User,
} from "lucide-react";

interface UserHeaderProps {
  onOpenMobile: () => void;
  userName?: string;
  avatarUrl?: string | null;
  unreadCount?: number;
}

export function UserHeader({
  onOpenMobile,
  userName = "Client",
  avatarUrl,
  unreadCount = 0,
}: UserHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile Menu Trigger & Welcome Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <span className="text-xs text-neutral-400">Welcome back,</span>
          <h2 className="text-sm font-semibold text-white truncate max-w-[200px]">
            {userName}
          </h2>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Explore Artists CTA */}
        <Link
          href="/artists"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold transition min-h-[44px]"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Find Artists & Studios</span>
          <span className="md:hidden">Explore</span>
        </Link>

        {/* Notifications */}
        <Link
          href="/user/notifications"
          className="relative p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          )}
        </Link>

        {/* User Avatar Chip */}
        <Link
          href="/user/profile"
          className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-neutral-900/80 transition min-h-[44px]"
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-8 h-8 rounded-full object-cover border border-neutral-700"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-xs font-semibold text-amber-300">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
