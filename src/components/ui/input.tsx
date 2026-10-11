import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-[#e8e5e4] bg-white px-3.5 py-2 text-base md:text-sm text-[#1e1a19] placeholder:text-[#a09b9a] focus-visible:outline-none focus-visible:border-[#eb7583] focus-visible:ring-2 focus-visible:ring-[#fcdadb] disabled:cursor-not-allowed disabled:opacity-50 transition-colors shadow-sm min-h-[44px]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
