import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-[#eb7583] text-white hover:bg-[#d4616f]",
        secondary: "bg-[#fcdadb] text-[#1e1a19]",
        soft: "bg-[#fcf1ef] text-[#eb7583]",
        success: "bg-[#dcfce7] text-[#15803d]",
        warning: "bg-[#fef3c7] text-[#b45309]",
        error: "bg-[#fee2e2] text-[#b91c1c]",
        outline: "border border-[#e8e5e4] text-[#1e1a19]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
