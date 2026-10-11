"use client";

import { usePathname } from "next/navigation";
import { Menu, Search, Bell, User as UserIcon } from "lucide-react";
import { SafeUser } from "@/types";

interface HeaderProps {
  user?: SafeUser | null;
  onOpenMobile?: () => void;
  onOpenSearch?: () => void;
}

export function AdminHeader({ user, onOpenMobile, onOpenSearch }: HeaderProps) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes("/admin/dashboard")) return "Dashboard Overview";
    if (pathname.includes("/admin/artists")) return "Artist Management";
    if (pathname.includes("/admin/categories")) return "Categories & Sub-Categories";
    if (pathname.includes("/admin/bookings")) return "Bookings & Leads";
    if (pathname.includes("/admin/users")) return "User Management";
    if (pathname.includes("/admin/content")) return "Content & Banners";
    if (pathname.includes("/admin/reviews")) return "Review Moderation";
    if (pathname.includes("/admin/settings")) return "Platform Settings";
    return "Admin Portal";
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 flex items-center justify-between transition-shadow">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="font-title text-xl md:text-2xl font-bold text-[#1e1a19] leading-tight">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right: ⌘K Search, Notification Bell, Admin Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* ⌘K Search Trigger Button (20-Point Polish Standard #1) */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 text-xs transition-colors min-h-[36px]"
          title="Search anything (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <span>Quick search...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-200 text-[10px] font-mono text-gray-500">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Trigger */}
        <button
          className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#eb7583]" />
        </button>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
          <div className="w-9 h-9 rounded-full bg-[#fcdadb] text-[#1e1a19] font-bold text-sm flex items-center justify-center border border-[#eb7583]/30">
            {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
          <div className="hidden md:block text-left">
            <span className="text-sm font-semibold text-[#1e1a19] block leading-none">
              {user?.name || "Admin"}
            </span>
            <span className="text-[11px] text-gray-500 font-medium">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
