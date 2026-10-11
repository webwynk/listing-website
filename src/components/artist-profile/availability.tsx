"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export interface AvailabilityEntry {
  id: string;
  date: string | Date;
  status: "AVAILABLE" | "BLOCKED" | "BOOKED";
  startTime?: string | null;
  endTime?: string | null;
  note?: string | null;
}

interface AvailabilityCalendarProps {
  availability: AvailabilityEntry[];
  onSelectDate: (dateStr: string) => void;
}

export function AvailabilityCalendar({
  availability,
  onSelectDate,
}: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // First day of month (0 = Sun, 1 = Mon, ...)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Build availability status lookup map: "YYYY-MM-DD" -> status
  const statusMap = new Map<string, string>();
  availability.forEach((entry) => {
    const d = new Date(entry.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    statusMap.set(key, entry.status);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div id="calendar" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-black/[0.06]">
        <div>
          <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#eb7583] font-body mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#eb7583]" />
            <span>Dates &amp; Schedule</span>
          </div>
          <h2 className="font-title text-2xl sm:text-3xl font-medium text-[#1e1a19] tracking-tight">
            Availability Calendar
          </h2>
          <p className="text-xs sm:text-[13px] text-[#6e6968] font-body mt-0.5">
            Check open dates for your milestone wedding ceremonies or events
          </p>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-full bg-white border border-black/[0.08] hover:border-[#fcdadb] hover:bg-[#fcf1ef] text-[#5c5553] hover:text-[#eb7583] transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs active:scale-95"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-title text-base sm:text-lg font-medium text-[#1e1a19] min-w-[140px] text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full bg-white border border-black/[0.08] hover:border-[#fcdadb] hover:bg-[#fcf1ef] text-[#5c5553] hover:text-[#eb7583] transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-xs active:scale-95"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="p-5 sm:p-7 rounded-[28px] bg-white border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4">
        {/* Day Header Row */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <span
              key={day}
              className="text-[11px] font-bold text-[#8c8583] uppercase tracking-wider py-1 font-body"
            >
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty cells before 1st day */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12 sm:h-14 rounded-2xl opacity-0" />
          ))}

          {/* Days of current month */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const dayNum = i + 1;
            const dateObj = new Date(year, month, dayNum);
            const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
            const isPast = dateObj < today;
            const status = statusMap.get(dateKey) || "AVAILABLE";

            const isBlocked = status === "BLOCKED" || status === "BOOKED";

            return (
              <button
                key={dateKey}
                disabled={isPast || isBlocked}
                onClick={() => onSelectDate(dateKey)}
                className={`relative h-12 sm:h-14 rounded-2xl flex flex-col items-center justify-center text-xs transition-all border min-h-[44px] font-body ${
                  isPast
                    ? "opacity-30 border-transparent text-[#a09b9a] cursor-not-allowed"
                    : isBlocked
                    ? "bg-rose-50/70 border-rose-200 text-[#a09b9a] cursor-not-allowed line-through"
                    : "bg-[#faf8f7] border-black/[0.06] hover:border-[#eb7583] hover:bg-[#fcf1ef] text-[#1e1a19] hover:text-[#eb7583] cursor-pointer shadow-xs active:scale-95"
                }`}
                title={
                  isPast
                    ? "Past date"
                    : isBlocked
                    ? "Unavailable / Booked"
                    : "Available - Click to Inquire"
                }
              >
                <span className="font-semibold text-xs sm:text-[13px]">{dayNum}</span>

                {!isPast && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      isBlocked ? "bg-rose-400" : "bg-emerald-500"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/[0.05] text-xs text-[#6e6968] font-body">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[#1e1a19] font-medium">Available for Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span>Booked / Reserved</span>
            </div>
          </div>

          <span className="text-[11px] text-[#8c8583]">
            Click any open date to start an inquiry
          </span>
        </div>
      </div>
    </div>
  );
}
