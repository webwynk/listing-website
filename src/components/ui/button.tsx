import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-h-[44px]",
  {
    variants: {
      variant: {
        default:
          "bg-[#eb7583] text-white hover:bg-[#d4616f] active:bg-[#c24e5c] shadow-sm",
        secondary:
          "bg-[#fcdadb] text-[#1e1a19] hover:bg-[#fcf1ef] active:opacity-90",
        outline:
          "border border-[#eb7583] text-[#eb7583] bg-transparent hover:bg-[#fcf1ef]",
        ghost:
          "text-[#1e1a19] hover:bg-[#fcf1ef] hover:text-[#eb7583]",
        dark:
          "bg-[#1e1a19] text-white hover:bg-[#332e2d] active:bg-black shadow-sm",
        destructive:
          "bg-[#ef4444] text-white hover:bg-[#dc2626] active:bg-[#b91c1c]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3 text-xs min-h-[36px]",
        lg: "h-12 rounded-xl px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(
          buttonVariants({ variant, size, className }),
          (children.props as any)?.className
        ),
        ref,
        ...props,
      });
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
