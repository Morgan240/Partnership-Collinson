import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "magenta";
  size?: "default" | "lg" | "sm";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50",
          variant === "magenta" &&
            "bg-brand-magenta text-white hover:bg-brand-magenta-deep shadow-lg hover:shadow-xl",
          variant === "default" &&
            "bg-primary text-primary-foreground hover:opacity-90",
          size === "default" && "h-10 px-4 py-2 text-sm",
          size === "lg" && "h-12 px-8 py-3 text-base",
          size === "sm" && "h-8 px-3 py-1 text-sm",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
