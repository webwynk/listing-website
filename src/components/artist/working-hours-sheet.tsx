"use client";

import { useState, useEffect } from "react";
import { X, Clock, AlertCircle, Loader2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export interface WorkingHourItem {
  dayOfWeek: number;
  isWorking: boolean;
  startTime: string;
  endTime: string;
}

interface WorkingHoursSheetProps {
  isOpen: boolean;
  onClose: () => void;
  initialHours: WorkingHourItem[];
  onSuccess: (updatedHours: WorkingHourItem[]) => void;
}

export function WorkingHoursSheet({
  isOpen,
  onClose,
  initialHours,
  onSuccess,
}: WorkingHoursSheetProps) {
  const [schedule, setSchedule] = useState<WorkingHourItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialHours && initialHours.length === 7) {
        setSchedule(
          [...initialHours].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
        );
      } else {
        setSchedule(
          [0, 1, 2, 3, 4, 5, 6].map((day) => ({
            dayOfWeek: day,
            isWorking: day !== 0,
            startTime: "09:00",
            endTime: "19:00",
          }))
        );
      }
      setError(null);
    }
  }, [isOpen, initialHours]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !submitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  function updateDay(dayIndex: number, fields: Partial<WorkingHourItem>) {
    setSchedule((prev) =>
      prev.map((item) =>
        item.dayOfWeek === dayIndex ? { ...item, ...fields } : item
      )
    );
  }

  function handleCopyMondayToWeekdays() {
    const monday = schedule.find((s) => s.dayOfWeek === 1);
    if (!monday) return;

    setSchedule((prev) =>
      prev.map((item) => {
        // Monday through Friday (1 to 5)
        if (item.dayOfWeek >= 1 && item.dayOfWeek <= 5) {
          return {
            ...item,
            isWorking: monday.isWorking,
            startTime: monday.startTime,
            endTime: monday.endTime,
          };
        }
        return item;
      })
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      const res = await fetch("/api/artist/working-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workingHours: schedule }),
      });

      const json = await res.json();

      if (json.success) {
        onSuccess(schedule);
        onClose();
      } else {
        setError(json.message || "Failed to update operating hours.");
      }
    } catch {
      setError("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!submitting) onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-border overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#fcf1ef] text-[#eb7583] flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-neutral-900 leading-tight">
                Regular Operating Schedule
              </h2>
              <p className="text-xs text-muted-foreground">
                Set standard weekly working hours for each day
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Day & Availability
            </span>
            <button
              type="button"
              onClick={handleCopyMondayToWeekdays}
              className="text-xs font-semibold text-[#eb7583] hover:text-[#d66573] flex items-center gap-1.5 p-1 rounded-md transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Apply Mon to Mon–Fri</span>
            </button>
          </div>

          <div className="divide-y divide-border/60 border border-border/80 rounded-xl overflow-hidden">
            {schedule.map((day) => {
              const dayName = DAYS_OF_WEEK[day.dayOfWeek];
              return (
                <div
                  key={day.dayOfWeek}
                  className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    day.isWorking ? "bg-white" : "bg-neutral-50/70 opacity-75"
                  }`}
                >
                  <div className="flex items-center gap-3 w-32">
                    <input
                      type="checkbox"
                      id={`day-${day.dayOfWeek}`}
                      checked={day.isWorking}
                      onChange={(e) =>
                        updateDay(day.dayOfWeek, { isWorking: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-[#eb7583] focus:ring-[#eb7583]"
                    />
                    <label
                      htmlFor={`day-${day.dayOfWeek}`}
                      className="text-xs font-semibold text-neutral-900 cursor-pointer"
                    >
                      {dayName}
                    </label>
                  </div>

                  {day.isWorking ? (
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground">From</span>
                        <Input
                          type="time"
                          value={day.startTime}
                          onChange={(e) =>
                            updateDay(day.dayOfWeek, { startTime: e.target.value })
                          }
                          className="w-28 text-xs h-9 min-h-[36px]"
                        />
                      </div>
                      <span className="text-muted-foreground text-xs">–</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-muted-foreground">To</span>
                        <Input
                          type="time"
                          value={day.endTime}
                          onChange={(e) =>
                            updateDay(day.dayOfWeek, { endTime: e.target.value })
                          }
                          className="w-28 text-xs h-9 min-h-[36px]"
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-muted-foreground italic">
                      Closed / Day Off
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-muted-foreground pt-1 leading-relaxed">
            * Changes to your weekly schedule apply to upcoming dates. You can also block specific single dates or vacation ranges directly on the calendar.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/80">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#eb7583] hover:bg-[#d66573] text-white min-h-[44px] shadow-xs flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Schedule...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Schedule</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
