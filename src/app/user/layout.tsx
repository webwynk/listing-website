"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarCheck,
  Heart,
  User,
  Loader2,
} from "lucide-react";
import { UserSidebar } from "@/components/user/sidebar";
import { UserHeader } from "@/components/user/header";
import { cn } from "@/lib/utils";

export default function UserPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (!res.ok || !data?.data?.user) {
          router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
          return;
        }

        setUser(data.data.user);
      } catch {
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <span className="text-xs text-neutral-400 font-sans tracking-wide">
          Loading GlamBook Portal...
        </span>
      </div>
    );
  }

  const bottomNavItems = [
    { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
    { label: "Bookings", href: "/user/bookings", icon: CalendarCheck },
    { label: "Saved", href: "/user/favorites", icon: Heart },
    { label: "Profile", href: "/user/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col lg:flex-row pb-16 lg:pb-0">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:h-screen lg:sticky lg:top-0">
        <UserSidebar
          userName={user?.name || "Client"}
          avatarUrl={user?.avatarUrl}
        />
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="w-64 h-full bg-neutral-950"
            onClick={(e) => e.stopPropagation()}
          >
            <UserSidebar
              onCloseMobile={() => setIsMobileOpen(false)}
              userName={user?.name || "Client"}
              avatarUrl={user?.avatarUrl}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <UserHeader
          onOpenMobile={() => setIsMobileOpen(true)}
          userName={user?.name || "Client"}
          avatarUrl={user?.avatarUrl}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar (20-Point Standard #17) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800/80 px-2 py-1.5 flex items-center justify-around"
        aria-label="Mobile Navigation"
      >
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/user/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition min-h-[44px] min-w-[44px]",
                isActive
                  ? "text-amber-400 font-semibold"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
