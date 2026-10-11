"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArtistSidebar } from "@/components/artist/sidebar";
import { ArtistHeader } from "@/components/artist/header";

export default function ArtistPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  const isOnboarding = pathname.startsWith("/artist/onboarding");

  useEffect(() => {
    // If on onboarding page, bypass layout authentication check here (handled in onboarding)
    if (isOnboarding) {
      setLoading(false);
      return;
    }

    async function loadArtistContext() {
      try {
        const res = await fetch("/api/artist/profile");
        const json = await res.json();

        if (!res.ok || !json.success) {
          // If unauthorized, redirect to login
          if (res.status === 401) {
            router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
            return;
          }
          // If user doesn't have an artist profile yet, redirect to onboarding
          if (res.status === 404) {
            router.push("/artist/onboarding");
            return;
          }
        } else {
          setProfileData(json.data.profile);
        }
      } catch (err) {
        console.error("Failed to load artist session:", err);
      } finally {
        setLoading(false);
      }
    }

    loadArtistContext();
  }, [pathname, isOnboarding, router]);

  // Clean bypass for onboarding wizard
  if (isOnboarding) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-50/70 flex flex-col lg:flex-row font-sans">
      {/* Desktop Fixed Sidebar */}
      <div className="hidden lg:block h-screen sticky top-0 shrink-0 z-30">
        <ArtistSidebar
          status={profileData?.status}
          artistId={profileData?.id}
        />
      </div>

      {/* Mobile Slide-over Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-[#1e1a19]">
            <ArtistSidebar
              onCloseMobile={() => setMobileOpen(false)}
              status={profileData?.status}
              artistId={profileData?.id}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ArtistHeader
          onOpenMobile={() => setMobileOpen(true)}
          user={profileData?.user}
          artistProfile={profileData}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
