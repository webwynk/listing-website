"use client";

import { useMemo, useState } from "react";
import { TrendingUp, PieChart, Layers } from "lucide-react";
import { AdminBookingTrend, AdminCategoryDistribution } from "@/types";

interface ChartsProps {
  trends: AdminBookingTrend[];
  categories: AdminCategoryDistribution[];
  loading?: boolean;
}

export function DashboardCharts({ trends, categories, loading }: ChartsProps) {
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  // Compute maximum count for scaling the SVG bars
  const maxCount = useMemo(() => {
    if (!trends || trends.length === 0) return 5;
    const highest = Math.max(...trends.map((t) => t.count));
    return highest > 0 ? highest : 5;
  }, [trends]);

  // Compute total category services count
  const totalCategoryServices = useMemo(() => {
    return categories.reduce((sum, c) => sum + c.count, 0);
  }, [categories]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-pulse">
          <div className="h-6 w-48 bg-gray-100 rounded-md mb-6" />
          <div className="h-56 bg-gray-50 rounded-xl" />
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs animate-pulse">
          <div className="h-6 w-36 bg-gray-100 rounded-md mb-6" />
          <div className="h-56 bg-gray-50 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 30-Day Activity Trend Bar Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#fcdadb] text-[#eb7583] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-title text-lg font-bold text-[#1e1a19]">
                  30-Day Lead Activity
                </h2>
                <p className="text-xs text-gray-500">
                  Daily incoming booking requests across all categories
                </p>
              </div>
            </div>

            {hoveredTrendIndex !== null && trends[hoveredTrendIndex] && (
              <div className="text-right text-xs bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                <span className="font-semibold text-gray-900">
                  {trends[hoveredTrendIndex].count} booking{trends[hoveredTrendIndex].count !== 1 ? "s" : ""}
                </span>
                <span className="text-gray-500 ml-1.5">
                  on {trends[hoveredTrendIndex].label}
                </span>
              </div>
            )}
          </div>

          {/* SVG Bar Chart Visualization */}
          <div className="relative h-52 w-full mt-6 flex items-end gap-1.5 sm:gap-2 pt-6">
            {trends.map((item, idx) => {
              const heightPercent = (item.count / maxCount) * 100;
              const isHovered = hoveredTrendIndex === idx;

              return (
                <div
                  key={idx}
                  className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                  onMouseEnter={() => setHoveredTrendIndex(idx)}
                  onMouseLeave={() => setHoveredTrendIndex(null)}
                >
                  {/* Hover tooltip bubble */}
                  {isHovered && (
                    <div className="absolute -top-7 z-20 px-2 py-1 bg-[#1e1a19] text-white text-[10px] rounded font-medium whitespace-nowrap shadow-md pointer-events-none">
                      {item.count} leads
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    style={{ height: `${Math.max(heightPercent, 4)}%` }}
                    className={`w-full max-w-[14px] rounded-t-sm transition-all duration-200 ${
                      item.count > 0
                        ? isHovered
                          ? "bg-[#eb7583] shadow-sm"
                          : "bg-[#eb7583]/75 hover:bg-[#eb7583]"
                        : "bg-gray-100"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Axis labels */}
          <div className="flex justify-between items-center text-[10px] font-medium text-gray-400 mt-2 border-t border-gray-100 pt-2">
            <span>{trends[0]?.label || "30 days ago"}</span>
            <span>{trends[Math.floor(trends.length / 2)]?.label || "15 days ago"}</span>
            <span>{trends[trends.length - 1]?.label || "Today"}</span>
          </div>
        </div>
      </div>

      {/* Category Distribution Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#fcdadb] text-[#eb7583] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-title text-lg font-bold text-[#1e1a19]">
                Category Distribution
              </h2>
              <p className="text-xs text-gray-500">
                Service offerings by category
              </p>
            </div>
          </div>

          {/* Stacked Progress Bar */}
          {totalCategoryServices > 0 ? (
            <div className="space-y-4 mt-6">
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                {categories.map((cat, idx) => {
                  const widthPercent = (cat.count / totalCategoryServices) * 100;
                  if (widthPercent === 0) return null;
                  return (
                    <div
                      key={idx}
                      style={{
                        width: `${widthPercent}%`,
                        backgroundColor: cat.color || "#eb7583",
                      }}
                      className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-300"
                      title={`${cat.name}: ${cat.count} services (${Math.round(widthPercent)}%)`}
                    />
                  );
                })}
              </div>

              {/* Category Legend List */}
              <div className="space-y-2 pt-2">
                {categories.map((cat, idx) => {
                  const percentage = totalCategoryServices > 0
                    ? Math.round((cat.count / totalCategoryServices) * 100)
                    : 0;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs py-1 hover:bg-gray-50 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color || "#eb7583" }}
                        />
                        <span className="font-medium text-gray-700 truncate max-w-[140px]">
                          {cat.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <span className="font-semibold text-gray-900">{cat.count}</span>
                        <span className="text-[11px] text-gray-400">({percentage}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2">
                <PieChart className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500">
                Category service metrics will appear as artists list their packages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
