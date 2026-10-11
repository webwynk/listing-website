"use client";

import Link from "next/link";
import {
  Users,
  UserCheck,
  CalendarCheck,
  Star,
  MessageSquare,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { AdminDashboardMetrics } from "@/types";

interface StatsCardsProps {
  metrics?: AdminDashboardMetrics | null;
  loading?: boolean;
}

export function StatsCards({ metrics, loading }: StatsCardsProps) {
  if (loading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100" />
                <div className="w-14 h-5 rounded-full bg-gray-100" />
              </div>
              <div className="w-20 h-7 bg-gray-100 rounded-md mb-2" />
              <div className="w-32 h-4 bg-gray-100 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Artists",
      value: metrics.totalArtists,
      detail: `${metrics.approvedArtists} approved · ${metrics.pendingArtists} pending`,
      icon: Users,
      iconBg: "bg-[#fcdadb] text-[#eb7583]",
      href: "/admin/artists",
      badge: metrics.pendingArtists > 0 ? `${metrics.pendingArtists} pending` : null,
      badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    },
    {
      label: "Registered Clients",
      value: metrics.totalUsers,
      detail: "Active platform users",
      icon: UserCheck,
      iconBg: "bg-blue-50 text-blue-600",
      href: "/admin/users",
    },
    {
      label: "Total Bookings",
      value: metrics.totalBookings,
      detail: `${metrics.thisMonthBookings} this month`,
      icon: CalendarCheck,
      iconBg: "bg-emerald-50 text-emerald-600",
      href: "/admin/bookings",
      badge: `${metrics.thisMonthBookings} new`,
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      label: "Client Reviews",
      value: metrics.totalReviews,
      detail: "Verified feedback",
      icon: Star,
      iconBg: "bg-amber-50 text-amber-600",
      href: "/admin/reviews",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Pending Artists Action Banner (20-Point Polish Standard #10 & #15) */}
      {metrics.pendingArtists > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-amber-900">
                {metrics.pendingArtists} Artist Application{metrics.pendingArtists > 1 ? "s" : ""} Awaiting Review
              </h2>
              <p className="text-xs text-amber-700 mt-0.5">
                New makeup artists and photographers are waiting for credential verification before going live.
              </p>
            </div>
          </div>
          <Link
            href="/admin/artists?status=PENDING"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-amber-700 text-white hover:bg-amber-800 transition-colors shadow-xs shrink-0 min-h-[40px]"
          >
            <span>Review Applications</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Grid of Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-md hover:border-gray-200 transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200 ${card.iconBg}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {card.badge && (
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}
                  >
                    {card.badge}
                  </span>
                )}
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {card.label}
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="font-title text-3xl font-bold text-[#1e1a19]">
                    {card.value.toLocaleString()}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1">
                  {card.detail}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
