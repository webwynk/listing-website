import * as React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showConciergeLink?: boolean;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an unexpected issue while loading this content. Please try again or reach out to our concierge team.",
  onRetry,
  showConciergeLink = true,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-red-500/20 bg-red-500/[0.03] dark:bg-red-950/[0.1]",
        className
      )}
    >
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
        <AlertCircle className="w-7 h-7 stroke-[1.75]" />
      </div>

      <h3 className="font-heading text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
        {message}
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <Button
            onClick={onRetry}
            className="min-h-[44px] px-6 text-sm font-medium gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}

        {showConciergeLink && (
          <Button
            asChild
            variant="outline"
            className="min-h-[44px] px-6 text-sm font-medium gap-2"
          >
            <Link href="/contact">
              <MessageSquare className="w-4 h-4" />
              Contact Concierge
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
