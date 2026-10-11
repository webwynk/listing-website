"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Ban,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Eye,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BlockDateModal } from "@/components/artist/block-date-modal";
import { WorkingHoursSheet, WorkingHourItem } from "@/components/artist/working-hours-sheet";
import { cn, formatDate } from "@/lib/utils";

interface BlockedDateItem {
  id: string;
  date: string;
  status: string;
  note: string | null;
}

interface ConfirmedBookingItem {
  id: string;
  bookingNumber: string;
  bookingDate: string;
  bookingTime: string | null;
  eventType: string | null;
  status: string;
  userName: string;
  numberOfPeople: number;
  service?: {
    category?: { name: string };
    subCategory?: { name: string } | null;
  } | null;
}

const MONTH_NAMES = [
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

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function ArtistCalendarPage() {
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [loading, setLoading] = useState(true);

  const [blockedDates, setBlockedDates] = useState<BlockedDateItem[]>([]);
  const [bookings, setBookings] = useState<ConfirmedBookingItem[]>([]);
  const [workingHours, setWorkingHours] = useState<WorkingHourItem[]>([]);

  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [hoursModalOpen, setHoursModalOpen] = useState(false);
  const [selectedDateForBlock, setSelectedDateForBlock] = useState<string | null>(null);
  const [selectedCellDate, setSelectedCellDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const loadMonthData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/artist/availability?year=${year}&month=${month + 1}`);
      const json = await res.json();

      if (json.success && json.data) {
        setBlockedDates(json.data.blockedDates || []);
        setBookings(json.data.bookings || []);
        setWorkingHours(json.data.workingHours || []);
      }
    } catch (err) {
      console.error("Failed to load availability data:", err);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => {
    loadMonthData();
  }, [loadMonthData]);

  // Calendar Grid Calculation
  const calendarCells = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells: Array<{
      dateString: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isPast: boolean;
      isToday: boolean;
      dayOfWeek: number;
    }> = [];

    const todayStr = new Date().toISOString().split("T")[0];
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    // Padding from previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, d);
      const dateStr = prevDate.toISOString().split("T")[0];
      cells.push({
        dateString: dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isPast: prevDate < todayMidnight,
        isToday: dateStr === todayStr,
        dayOfWeek: prevDate.getDay(),
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const curDate = new Date(year, month, d);
      const dateStr = curDate.toISOString().split("T")[0];
      cells.push({
        dateString: dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isPast: curDate < todayMidnight,
        isToday: dateStr === todayStr,
        dayOfWeek: curDate.getDay(),
      });
    }

    // Padding for next month to complete the row
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const dateStr = nextDate.toISOString().split("T")[0];
      cells.push({
        dateString: dateStr,
        dayNumber: d,
        isCurrentMonth: false,
        isPast: nextDate < todayMidnight,
        isToday: dateStr === todayStr,
        dayOfWeek: nextDate.getDay(),
      });
    }

    return cells;
  }, [year, month]);

  // Helpers to check status for a date string
  function getBlockedItem(dateString: string) {
    return blockedDates.find((b) => b.date.startsWith(dateString));
  }

  function getBookingsForDate(dateString: string) {
    return bookings.filter((b) => b.bookingDate.startsWith(dateString));
  }

  function isWeeklyDayOff(dayOfWeek: number) {
    const config = workingHours.find((h) => h.dayOfWeek === dayOfWeek);
    return config ? !config.isWorking : dayOfWeek === 0;
  }

  // Navigation handlers
  function handlePrevMonth() {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }

  function handleNextMonth() {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }

  function handleToday() {
    setCurrentDate(new Date());
  }

  // Unblock a date
  async function handleUnblockDate(dateString: string) {
    try {
      const res = await fetch(`/api/artist/availability?date=${dateString}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setBlockedDates((prev) => prev.filter((b) => !b.date.startsWith(dateString)));
      }
    } catch (err) {
      console.error("Failed to unblock date:", err);
    }
  }

  // Active detail for selected cell
  const selectedCellDetails = useMemo(() => {
    if (!selectedCellDate) return null;
    const blocked = getBlockedItem(selectedCellDate);
    const dayBookings = getBookingsForDate(selectedCellDate);
    const dayOfWeek = new Date(selectedCellDate).getDay();
    const dayOff = isWeeklyDayOff(dayOfWeek);

    return {
      dateString: selectedCellDate,
      blocked,
      dayBookings,
      dayOff,
    };
  }, [selectedCellDate, blockedDates, bookings, workingHours]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-neutral-900">
            Calendar & Availability
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Manage your booking calendar, block personal leave, and set regular weekly operating hours.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => setHoursModalOpen(true)}
            className="text-xs font-semibold min-h-[44px] flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Operating Hours</span>
          </Button>

          <Button
            onClick={() => {
              setSelectedDateForBlock(null);
              setBlockModalOpen(true);
            }}
            className="bg-neutral-900 hover:bg-neutral-800 text-white min-h-[44px] shadow-xs flex items-center gap-2"
          >
            <Ban className="w-4 h-4" />
            <span>Block Dates</span>
          </Button>
        </div>
      </div>

      {/* Calendar Card Container */}
      <div className="bg-white rounded-2xl border border-border/80 shadow-2xs overflow-hidden">
        {/* Calendar Navigation Header */}
        <div className="p-4 sm:p-6 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900">
              {MONTH_NAMES[month]} {year}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="text-xs h-8 px-2.5 rounded-lg"
            >
              Today
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-xl overflow-hidden p-0.5 bg-neutral-50">
              <button
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg hover:bg-white text-neutral-600 hover:text-neutral-900 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg hover:bg-white text-neutral-600 hover:text-neutral-900 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-neutral-50/70 border-b border-border/60 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-neutral-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Confirmed Booking</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
            <span>Manually Blocked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-300" />
            <span>Regular Day Off</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-3 sm:p-6">
          {/* Weekday Labels */}
          <div className="grid grid-cols-7 mb-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {WEEKDAY_NAMES.map((name) => (
              <div key={name} className="py-1">
                {name}
              </div>
            ))}
          </div>

          {/* Date Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarCells.map((cell) => {
              const blocked = getBlockedItem(cell.dateString);
              const dayBookings = getBookingsForDate(cell.dateString);
              const isDayOff = isWeeklyDayOff(cell.dayOfWeek);
              const isBooked = dayBookings.length > 0;
              const isSelected = selectedCellDate === cell.dateString;

              return (
                <div
                  key={cell.dateString}
                  onClick={() => setSelectedCellDate(cell.dateString)}
                  className={cn(
                    "min-h-[85px] sm:min-h-[110px] p-2 rounded-xl sm:rounded-2xl border transition-all cursor-pointer flex flex-col justify-between text-left select-none relative",
                    cell.isCurrentMonth ? "bg-white" : "bg-neutral-50/50 opacity-40",
                    cell.isPast && "bg-neutral-50/70 opacity-60",
                    isSelected ? "ring-2 ring-[#eb7583] border-[#eb7583]" : "border-border/70 hover:border-[#eb7583]/50",
                    isBooked && "bg-rose-50/30 border-rose-200",
                    blocked && "bg-neutral-100/60 border-neutral-300"
                  )}
                >
                  {/* Top row: day number & indicator */}
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full",
                        cell.isToday
                          ? "bg-[#eb7583] text-white font-bold"
                          : "text-neutral-900"
                      )}
                    >
                      {cell.dayNumber}
                    </span>

                    {/* Status Pill */}
                    {isBooked ? (
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    ) : blocked ? (
                      <span className="w-2 h-2 rounded-full bg-neutral-900 shrink-0" />
                    ) : isDayOff ? (
                      <span className="w-2 h-2 rounded-full bg-neutral-300 shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 opacity-40" />
                    )}
                  </div>

                  {/* Middle: Content tags */}
                  <div className="space-y-1 my-1">
                    {isBooked && (
                      <div className="p-1 rounded bg-rose-100/80 text-rose-900 text-[10px] font-semibold truncate border border-rose-200">
                        {dayBookings[0].bookingTime ? `${dayBookings[0].bookingTime} • ` : ""}
                        {dayBookings[0].service?.subCategory?.name || dayBookings[0].service?.category?.name || "Booking"}
                      </div>
                    )}

                    {blocked && (
                      <div className="p-1 rounded bg-neutral-900 text-white text-[10px] font-medium truncate">
                        {blocked.note || "Blocked"}
                      </div>
                    )}

                    {!isBooked && !blocked && isDayOff && (
                      <span className="text-[10px] text-muted-foreground italic">
                        Day Off
                      </span>
                    )}
                  </div>

                  {/* Bottom: Quick action hint */}
                  <div className="text-[10px] text-muted-foreground truncate hidden sm:block">
                    {isBooked
                      ? `${dayBookings.length} Event`
                      : blocked
                      ? "Unavailable"
                      : isDayOff
                      ? "Closed"
                      : "Available"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Date Detail Drawer / Bottom Card */}
      {selectedCellDetails && (
        <div className="bg-white rounded-2xl border border-border p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in duration-150">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-neutral-900">
                {formatDate(selectedCellDetails.dateString)}
              </span>
              {selectedCellDetails.dayBookings.length > 0 && (
                <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs">
                  {selectedCellDetails.dayBookings.length} Confirmed Booking(s)
                </Badge>
              )}
              {selectedCellDetails.blocked && (
                <Badge className="bg-neutral-900 text-white text-xs">
                  Blocked
                </Badge>
              )}
              {selectedCellDetails.dayOff && !selectedCellDetails.blocked && !selectedCellDetails.dayBookings.length && (
                <Badge className="bg-neutral-100 text-neutral-600 border-neutral-200 text-xs">
                  Regular Day Off
                </Badge>
              )}
            </div>

            {selectedCellDetails.blocked?.note && (
              <p className="text-xs text-neutral-600 mt-1">
                Note: &ldquo;{selectedCellDetails.blocked.note}&rdquo;
              </p>
            )}

            {selectedCellDetails.dayBookings.length > 0 && (
              <div className="mt-2 text-xs text-neutral-700 space-y-1">
                {selectedCellDetails.dayBookings.map((b) => (
                  <p key={b.id}>
                    • <strong>{b.userName}</strong> (#{b.bookingNumber}) —{" "}
                    {b.service?.subCategory?.name || b.service?.category?.name || "Service"}
                    {b.bookingTime ? ` at ${b.bookingTime}` : ""}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {selectedCellDetails.blocked ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUnblockDate(selectedCellDetails.dateString)}
                className="text-xs text-emerald-700 border-emerald-300 hover:bg-emerald-50 min-h-[40px]"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Unblock This Date
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDateForBlock(selectedCellDetails.dateString);
                  setBlockModalOpen(true);
                }}
                className="text-xs min-h-[40px]"
              >
                <Ban className="w-4 h-4 mr-1.5" />
                Block This Date
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCellDate(null)}
              className="text-xs text-muted-foreground min-h-[40px]"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Block Date Modal */}
      <BlockDateModal
        isOpen={blockModalOpen}
        onClose={() => setBlockModalOpen(false)}
        initialDate={selectedDateForBlock}
        onSuccess={loadMonthData}
      />

      {/* Working Hours Sheet */}
      <WorkingHoursSheet
        isOpen={hoursModalOpen}
        onClose={() => setHoursModalOpen(false)}
        initialHours={workingHours}
        onSuccess={(updated) => setWorkingHours(updated)}
      />
    </div>
  );
}
