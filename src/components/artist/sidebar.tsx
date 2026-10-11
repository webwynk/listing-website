"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Image as ImageIcon,
  Sparkles,
  Package as PackageIcon,
  Calendar,
  Inbox,
  Star,
  ExternalLink,
  LogOut,
  X,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtistSidebarProps {
  onCloseMobile?: () => void;
  status?: string;
  artistId?: string;
  pendingInquiriesCount?: number;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/artist/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile Details",
    href: "/artist/profile",
    icon: User,
  },
  {
    label: "Portfolio",
    href: "/artist/portfolio",
    icon: ImageIcon,
  },
  {
    label: "Services & Pricing",
    href: "/artist/services",
    icon: Sparkles,
  },
  {
    label: "Packages",
    href: "/artist/packages",
    icon: PackageIcon,
  },
  {
    label: "Calendar & Hours",
    href: "/artist/calendar",
    icon: Calendar,
  },
  {
    label: "Bookings",
    href: "/artist/bookings",
    icon: Inbox,
    badgeKey: "inquiries",
  },
  {
    label: "Reviews",
    href: "/artist/reviews",
    icon: Star,
  },
];

export function ArtistSidebar({
  onCloseMobile,
  status = "PENDING",
  artistId,
  pendingInquiriesCount = 0,
}: ArtistSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

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
    <aside className="w-64 bg-[#1e1a19] text-white flex flex-col h-full select-none border-r border-[#312b29]">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#312b29]">
        <Link
          href="/artist/dashboard"
          className="flex items-center gap-2"
          onClick={onCloseMobile}
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-white hover:text-[#eb7583] transition-colors">
            GlamBook
          </span>
          <span className="text-[10px] font-semibold tracking-wider text-[#eb7583] uppercase px-1.5 py-0.5 rounded-full bg-[#eb7583]/15 border border-[#eb7583]/30">
            Artist
          </span>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/artist/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-[44px]",
                isActive
                  ? "bg-[#eb7583] text-white shadow-xs font-semibold"
                  : "text-neutral-300 hover:text-white hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive ? "text-white" : "text-neutral-400"
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badgeKey === "inquiries" && pendingInquiriesCount > 0 && (
                <span className="bg-amber-500 text-neutral-950 font-bold text-[11px] px-2 py-0.5 rounded-full shrink-0">
                  {pendingInquiriesCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[#312b29] space-y-1">
        {status === "APPROVED" && artistId && (
          <Link
            href={`/artists/${artistId}`}
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Public Profile</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors min-h-[44px]"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
