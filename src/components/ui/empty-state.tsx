import * as React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface EmptyStateProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-white/[0.02]",
        className
      )}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
          <Icon className="w-8 h-8 stroke-[1.5]" />
        </div>
      )}
      <h3 className="font-heading text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-wide">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action &&
            (action.href ? (
              <Button asChild className="min-h-[44px] px-6 text-sm font-medium">
                <Link href={action.href}>
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Link>
              </Button>
            ) : (
              <Button
                onClick={action.onClick}
                className="min-h-[44px] px-6 text-sm font-medium"
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            ))}

          {secondaryAction &&
            (secondaryAction.href ? (
              <Button
                asChild
                variant="outline"
                className="min-h-[44px] px-6 text-sm font-medium"
              >
                <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                className="min-h-[44px] px-6 text-sm font-medium"
              >
                {secondaryAction.label}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}
