"use client";

import { Sparkles, Clock, Calendar, Check } from "lucide-react";

export interface ArtistServiceItem {
  id: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  subCategory?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  priceFrom: number;
  priceTo?: number | null;
  priceType: string;
  durationMinutes?: number | null;
  description?: string | null;
}

interface ServicesPricingProps {
  services: ArtistServiceItem[];
  onBookService: (serviceId: string) => void;
}

export function ServicesPricing({
  services,
  onBookService,
}: ServicesPricingProps) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <div id="services" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 border-b border-black/[0.06]">
        <div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#eb7583] font-body mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#eb7583]" />
            <span>Curated Menu</span>
          </div>
          <h2 className="font-title text-2xl sm:text-3xl font-medium text-[#1e1a19] tracking-tight">
            Services &amp; Pricing Menu
          </h2>
          <p className="text-xs sm:text-[13px] text-[#6e6968] font-body mt-0.5">
            Transparent pricing with zero hidden fees or sales markups
          </p>
        </div>

        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#fcf1ef] text-[#eb7583] border border-[#fcdadb] font-body self-start sm:self-auto shrink-0 shadow-xs">
          {services.length} Services Available
        </span>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {services.map((service) => {
          const serviceName =
            service.subCategory?.name ||
            service.category?.name ||
            "Specialized Styling";

          const formattedPrice =
            service.priceTo && service.priceTo > service.priceFrom
              ? `₹${service.priceFrom.toLocaleString("en-IN")} - ₹${service.priceTo.toLocaleString("en-IN")}`
              : `₹${service.priceFrom.toLocaleString("en-IN")}`;

          return (
            <div
              key={service.id}
              className="p-5 sm:p-6 rounded-[24px] sm:rounded-[28px] bg-white border border-black/[0.06] hover:border-[#fcdadb] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(235,117,131,0.12)] transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#fcf1ef] text-[#eb7583] border border-[#fcdadb]/70 font-body">
                      {service.category?.name || "Beauty & Art"}
                    </span>
                    <h3 className="font-title text-xl sm:text-[22px] font-medium text-[#1e1a19] group-hover:text-[#eb7583] transition-colors leading-snug">
                      {serviceName}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-body text-lg sm:text-xl font-bold text-[#1e1a19] tracking-tight block">
                      {formattedPrice}
                    </span>
                    <span className="text-[10px] text-[#8c8583] uppercase tracking-wider font-semibold font-body">
                      {service.priceType.toLowerCase().replace("_", " ")}
                    </span>
                  </div>
                </div>

                {service.description && (
                  <p className="text-xs sm:text-[13px] text-[#5c5553] leading-relaxed line-clamp-2 font-body">
                    {service.description}
                  </p>
                )}
              </div>

              {/* Card Footer: Timeline & Inquire Button */}
              <div className="pt-3.5 border-t border-black/[0.05] flex items-center justify-between gap-3">
                {service.durationMinutes ? (
                  <div className="flex items-center gap-1.5 text-xs text-[#6e6968] font-body">
                    <Clock className="w-3.5 h-3.5 text-[#eb7583]" />
                    <span>{service.durationMinutes} mins session</span>
                  </div>
                ) : (
                  <div className="text-xs text-[#8c8583] font-body">
                    Customized timeline
                  </div>
                )}

                <button
                  onClick={() => onBookService(service.id)}
                  className="px-4 py-2 rounded-full bg-[#fcf1ef] hover:bg-[#eb7583] text-[#eb7583] hover:text-white border border-[#fcdadb] hover:border-[#eb7583] font-semibold text-xs transition-all shadow-xs active:scale-95 min-h-[44px] flex items-center gap-1.5 font-body group/btn"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Inquire</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
