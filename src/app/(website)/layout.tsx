import { Suspense } from "react";
import { PublicHeader, PublicFooter } from "@/components/layout";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/json-ld";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-[#1e1a19]">
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <Suspense fallback={<header className="h-20 w-full bg-[#181515] border-b border-white/10" />}>
        <PublicHeader />
      </Suspense>
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
