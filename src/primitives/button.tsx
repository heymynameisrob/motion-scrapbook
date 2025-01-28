import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center whitespace-nowrap border shadow-sm justify-center rounded-lg text-sm leading-4 font-medium transition-colors focus disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-background hover:opacity-90",
        accent: "bg-accent text-white hover:opacity-90",
        destructive: "bg-red-600 text-white hover:bg-destructive/90",
        secondary:
          "bg-white text-primary hover:bg-base-2 dark:bg-base-4 dark:hover:bg-base-4",
        ghost: "border-transparent shadow-none hover:bg-base-4",
        link: "underline-offset-4 hover:underline text-accent",
      },
      size: {
        md: "h-10 py-2 px-4",
        sm: "h-8 px-3",
        lg: "h-12 text-base px-8 rounded-xl shadow",
        icon: "w-8 h-8 rounded-md !p-px",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "sm",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
