"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  CheckCircle,
  Clock,
  Heart,
  MessageCircle,
  Lock,
} from "lucide-react";
import {
  ProfileHeader,
  ServicesPricing,
  PortfolioGallery,
  AvailabilityCalendar,
  ReviewsSection,
  SimilarArtists,
} from "@/components/artist-profile";
import { BookingModal, BookingArtist } from "@/components/booking/booking-modal";

interface ArtistProfileClientProps {
  artist: any;
}

export function ArtistProfileClient({ artist }: ArtistProfileClientProps) {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(
    undefined
  );

  const bookingArtist: BookingArtist = {
    id: artist.id,
    name: artist.name,
    businessName: artist.businessName,
    avatarUrl: artist.avatarUrl,
    city: artist.city,
    services: artist.services?.map((s: any) => ({
      id: s.id,
      category: s.category ? { name: s.category.name } : undefined,
      priceFrom: s.priceFrom,
      priceTo: s.priceTo,
      priceType: s.priceType,
      durationMinutes: s.durationMinutes,
    })),
    packages: artist.packages?.map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      durationHours: p.durationHours,
    })),
  };

  const handleOpenBooking = (serviceId?: string) => {
    setSelectedServiceId(serviceId);
    setBookingModalOpen(true);
  };

  const formattedStartingPrice =
    artist.startingPrice && artist.startingPrice > 0
      ? `₹${artist.startingPrice.toLocaleString("en-IN")}`
      : "Custom Quote";

  return (
    <div className="min-h-screen bg-[#faf8f7] text-[#1e1a19] pb-28 lg:pb-20 relative overflow-hidden">
      {/* Ambient background blush glows */}
      <div className="absolute top-96 left-0 w-[500px] h-[500px] bg-[#fcdadb]/30 rounded-full blur-3xl pointer-events-none -ml-40" />
      <div className="absolute top-[850px] right-0 w-[500px] h-[500px] bg-[#fcf1ef]/50 rounded-full blur-3xl pointer-events-none -mr-40" />

      {/* 1. Profile Header Hero */}
      <ProfileHeader
        artist={artist}
        onBookClick={() => handleOpenBooking()}
      />

      {/* 2. Main Content Layout (Left Column + Sticky Right Column) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Sections & Nav (col-span-8) */}
          <div className="lg:col-span-8 space-y-12 sm:space-y-14">
            {/* Quick Navigation Pills */}
            <div className="sticky top-20 z-20 py-2.5 -my-2.5 bg-[#faf8f7]/95 backdrop-blur-md flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-black/[0.06]">
              {[
                { label: "Services & Pricing", href: "#services" },
                { label: "Portfolio Gallery", href: "#portfolio" },
                { label: "Availability", href: "#calendar" },
                { label: "Client Reviews", href: "#reviews" },
              ].map((pill) => (
                <a
                  key={pill.href}
                  href={pill.href}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-[#5c5553] hover:text-[#eb7583] hover:bg-[#fcf1ef] border border-black/[0.06] hover:border-[#fcdadb] transition-all whitespace-nowrap min-h-[42px] flex items-center shadow-xs font-body active:scale-95"
                >
                  {pill.label}
                </a>
              ))}
            </div>

            {/* Services & Pricing Menu */}
            <ServicesPricing
              services={artist.services}
              onBookService={(serviceId) => handleOpenBooking(serviceId)}
            />

            {/* Portfolio Gallery & Lightbox */}
            <PortfolioGallery
              items={artist.portfolioItems}
              artistName={artist.businessName || artist.name}
            />

            {/* Availability Calendar */}
            <AvailabilityCalendar
              availability={artist.availability}
              onSelectDate={(dateStr) => handleOpenBooking()}
            />

            {/* Client Reviews */}
            <ReviewsSection
              reviews={artist.reviews}
              avgRating={artist.avgRating}
              totalReviews={artist.totalReviews}
              ratingsBreakdown={artist.ratingsBreakdown}
              artistName={artist.businessName || artist.name}
            />

            {/* Similar Artists */}
            <SimilarArtists
              similarArtists={artist.similarArtists}
              currentCity={artist.city}
            />
          </div>

          {/* Right Column: Sticky Booking Inquire Console (Desktop, col-span-4) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 rounded-[32px] bg-white border border-black/[0.08] p-6 sm:p-7 space-y-6 shadow-[0_16px_48px_rgba(0,0,0,0.06)] backdrop-blur-md">
              {/* Pricing Header */}
              <div className="space-y-1 pb-4 border-b border-black/[0.06]">
                <span className="text-[10.5px] font-bold text-[#8c8583] uppercase tracking-[0.18em] block font-body">
                  Starting Price
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-title text-3xl sm:text-4xl font-medium text-[#1e1a19] tracking-tight">
                    {formattedStartingPrice}
                  </span>
                  <span className="text-xs text-[#6e6968] font-body">/ celebration</span>
                </div>
              </div>

              {/* 4 Rose-Gold Trust Value Points */}
              <div className="space-y-3.5 text-xs text-[#5c5553] font-body">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center shrink-0 border border-[#fcdadb]">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <span>Average Response Time: <strong className="text-[#1e1a19]">Within 2 Hours</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center shrink-0 border border-[#fcdadb]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span>100% Curated &amp; Verified Professional</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center shrink-0 border border-[#fcdadb]">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span>Lead Privacy Guaranteed (Zero Spam Calls)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center shrink-0 border border-[#fcdadb]">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <span>Zero Platform Commission Markup</span>
                </div>
              </div>

              {/* Booking CTA Button */}
              <button
                onClick={() => handleOpenBooking()}
                className="w-full py-3.5 rounded-full bg-[#eb7583] hover:bg-[#d4616f] active:bg-[#c24e5c] text-white font-semibold text-sm shadow-[0_8px_24px_rgba(235,117,131,0.32)] transition-all min-h-[48px] flex items-center justify-center gap-2 active:scale-95 font-body group"
              >
                <Calendar className="w-4 h-4" />
                <span>Check Dates &amp; Inquire</span>
              </button>

              {/* Concierge Assurance Footer */}
              <p className="text-xs text-center text-[#8c8583] font-body leading-relaxed">
                Our GlamBook concierge team verifies artist schedule and coordinates your booking directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Mobile Bottom Sticky Booking Bar (Visible on mobile/tablet only) */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white/95 backdrop-blur-xl border-t border-black/[0.08] p-3.5 sm:p-4 flex items-center justify-between gap-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
        <div>
          <span className="text-[10px] text-[#8c8583] uppercase tracking-wider block font-body font-bold">
            Starting Price
          </span>
          <span className="font-title text-xl font-medium text-[#1e1a19]">
            {formattedStartingPrice}
          </span>
        </div>

        <button
          onClick={() => handleOpenBooking()}
          className="px-6 py-2.5 rounded-full bg-[#eb7583] hover:bg-[#d4616f] active:bg-[#c24e5c] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#eb7583]/20 transition-all min-h-[44px] flex items-center gap-1.5 font-body active:scale-95"
        >
          <Calendar className="w-4 h-4" />
          <span>Inquire Now</span>
        </button>
      </div>

      {/* 4. Booking Wizard Modal */}
      {bookingArtist && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          artist={bookingArtist}
          preSelectedServiceId={selectedServiceId}
        />
      )}
    </div>
  );
}
