"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Clock, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WorkingHourItemData } from "@/lib/validations/onboarding";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface AvailabilityStepProps {
  workingHours: WorkingHourItemData[];
  onNext: (workingHours: WorkingHourItemData[]) => void;
  onBack: () => void;
}

export function AvailabilityStep({
  workingHours: initialHours,
  onNext,
  onBack,
}: AvailabilityStepProps) {
  // Ensure all 7 days exist
  const getInitialHours = () => {
    if (initialHours && initialHours.length === 7) return initialHours;
    return [0, 1, 2, 3, 4, 5, 6].map((day) => ({
      dayOfWeek: day,
      isWorking: day !== 0, // Sunday off by default
      startTime: "09:00",
      endTime: "19:00",
    }));
  };

  const [hours, setHours] = useState<WorkingHourItemData[]>(getInitialHours());
  const [copied, setCopied] = useState(false);

  const handleToggleDay = (dayIndex: number) => {
    setHours(
      hours.map((h) =>
        h.dayOfWeek === dayIndex ? { ...h, isWorking: !h.isWorking } : h
      )
    );
  };

  const handleTimeChange = (
    dayIndex: number,
    field: "startTime" | "endTime",
    val: string
  ) => {
    setHours(
      hours.map((h) => (h.dayOfWeek === dayIndex ? { ...h, [field]: val } : h))
    );
  };

  const copyMondayToWeekdays = () => {
    const monday = hours.find((h) => h.dayOfWeek === 1);
    if (!monday) return;

    setHours(
      hours.map((h) => {
        // Monday through Friday (1 to 5)
        if (h.dayOfWeek >= 1 && h.dayOfWeek <= 5) {
          return {
            ...h,
            isWorking: monday.isWorking,
            startTime: monday.startTime,
            endTime: monday.endTime,
          };
        }
        return h;
      })
    );

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl md:text-2xl font-serif font-bold text-[#1e1a19]">
            Step 4: Operating Hours
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Set your weekly operating schedule so clients can view your availability.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={copyMondayToWeekdays}
          className="rounded-xl h-10 px-3 text-xs border-border flex items-center gap-1.5 self-start sm:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Applied to Mon–Fri!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Mon to Mon–Fri</span>
            </>
          )}
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 shadow-xs divide-y divide-border/60">
        {hours.map((day) => (
          <div
            key={day.dayOfWeek}
            className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="flex items-center gap-3 w-40">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={day.isWorking}
                  onChange={() => handleToggleDay(day.dayOfWeek)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5.5 bg-neutral-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#eb7583]"></div>
              </label>
              <span
                className={`text-sm font-semibold ${
                  day.isWorking ? "text-[#1e1a19]" : "text-neutral-400"
                }`}
              >
                {DAY_NAMES[day.dayOfWeek]}
              </span>
            </div>

            {day.isWorking ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>From:</span>
                </div>
                <Input
                  type="time"
                  value={day.startTime}
                  onChange={(e) =>
                    handleTimeChange(day.dayOfWeek, "startTime", e.target.value)
                  }
                  className="h-10 text-xs w-28"
                />
                <span className="text-muted-foreground text-xs">to</span>
                <Input
                  type="time"
                  value={day.endTime}
                  onChange={(e) =>
                    handleTimeChange(day.dayOfWeek, "endTime", e.target.value)
                  }
                  className="h-10 text-xs w-28"
                />
              </div>
            ) : (
              <span className="text-xs font-medium text-neutral-400 italic">
                Closed / Unavailable for bookings
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="rounded-xl h-12 px-6 border-border flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <Button
          type="button"
          onClick={() => onNext(hours)}
          className="bg-[#eb7583] hover:bg-[#d66371] text-white rounded-xl h-12 px-8 shadow-sm font-semibold flex items-center gap-2"
        >
          <span>Continue to Review</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
