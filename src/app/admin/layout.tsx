"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";
import { CommandPalette } from "@/components/admin/command-palette";
import { SafeUser } from "@/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<SafeUser | null>(null);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage) {
      // Fetch authenticated admin details
      fetch("/api/auth/me")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data?.user) {
            setUser(data.data.user);
          }
        })
        .catch((err) => console.error("Admin user load error:", err));
    }
  }, [isLoginPage]);

  // If on login page, render clean auth view without admin shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0 z-30">
        <AdminSidebar />
      </div>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#1e1a19]">
            <AdminSidebar onCloseMobile={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          user={user}
          onOpenMobile={() => setMobileOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* ⌘K Command Palette Modal */}
      <CommandPalette isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
