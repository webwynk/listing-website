"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderTree,
  CalendarCheck,
  UserCheck,
  Image as ImageIcon,
  Star,
  Settings,
  LogOut,
  X,
  Sparkles,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onCloseMobile?: () => void;
  pendingArtistsCount?: number;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Artists",
    href: "/admin/artists",
    icon: Users,
    badgeKey: "pendingArtists",
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: UserCheck,
  },
  {
    label: "Content & Banners",
    href: "/admin/content",
    icon: ImageIcon,
  },
  {
    label: "Page Heroes",
    href: "/admin/content/heroes",
    icon: Sparkles,
  },
  {
    label: "Blog Posts",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar({ onCloseMobile, pendingArtistsCount = 0 }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="w-64 bg-[#1e1a19] text-white flex flex-col h-full border-r border-white/10 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#eb7583] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-title text-xl font-bold tracking-tight text-white block leading-none">
              GlamBook
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#fcdadb] font-semibold">
              Admin Control
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px]",
                isActive
                  ? "bg-[#eb7583] text-white shadow-sm font-semibold"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-400")} />
                <span>{item.label}</span>
              </div>

              {item.badgeKey === "pendingArtists" && pendingArtistsCount > 0 && (
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-bold",
                    isActive
                      ? "bg-white text-[#eb7583]"
                      : "bg-[#eb7583] text-white"
                  )}
                >
                  {pendingArtistsCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
