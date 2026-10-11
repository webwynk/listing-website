"use client";

import { useEffect, useState, useCallback } from "react";
import {
  RotateCw,
  FolderPlus,
  Users,
  Sliders,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { StatsCards } from "@/components/admin/stats-cards";
import { DashboardCharts } from "@/components/admin/charts";
import { RecentBookings } from "@/components/admin/recent-bookings";
import { RecentArtists } from "@/components/admin/recent-artists";
import { AdminDashboardData } from "@/types";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await fetch("/api/admin/dashboard");
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to load dashboard metrics");
      }

      setData(result.data);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching dashboard statistics.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Today's formatted date string
  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-1">
            <Calendar className="w-3.5 h-3.5 text-[#eb7583]" />
            <span>{todayFormatted}</span>
          </div>
          <h1 className="font-title text-2xl md:text-3xl font-bold text-[#1e1a19]">
            Platform Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Monitor real-time bookings, artist credentials, and customer inquiries
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-2xs min-h-[40px] disabled:opacity-50"
            title="Refresh statistics"
          >
            <RotateCw
              className={`w-3.5 h-3.5 text-gray-500 ${refreshing ? "animate-spin text-[#eb7583]" : ""}`}
            />
            <span>Refresh</span>
          </button>

          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#1e1a19] text-white hover:bg-black transition-colors shadow-2xs min-h-[40px]"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#fcdadb]" />
            <span>Categories</span>
          </Link>

          <Link
            href="/admin/artists"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-[#eb7583] text-white hover:bg-[#d4616f] transition-colors shadow-2xs min-h-[40px]"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Manage Artists</span>
          </Link>
        </div>
      </div>

      {/* Error Alert with Retry */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchDashboardData()}
            className="text-xs font-bold text-rose-700 underline hover:text-rose-900 shrink-0"
          >
            Retry
          </button>
        </div>
      )}

      {/* 1. Core Metric Cards & Pending Alert */}
      <StatsCards metrics={data?.metrics} loading={loading} />

      {/* 2. Visual Analytics & Category Distribution Charts */}
      <DashboardCharts
        trends={data?.bookingTrends || []}
        categories={data?.categoryDistribution || []}
        loading={loading}
      />

      {/* 3. Recent Activity Grid (Recent Bookings & Recent Artists) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <RecentBookings
          bookings={data?.recentBookings || []}
          loading={loading}
        />
        <RecentArtists
          artists={data?.recentArtists || []}
          loading={loading}
        />
      </div>
    </div>
  );
}
