import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex items-center gap-2 text-primary", className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap gap-1.5 focus duration-200 text-sm font-medium text-secondary rounded-md cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "border border-transparent rounded-md hover:bg-gray-2 data-[state=active]:bg-gray-2 data-[state=active]:text-primary",
        underlined:
          "bg-transparent hover:border-gray-4 border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-gray-12 rounded-none data-[state=active]:bg-transparent",
      },
      size: {
        md: "px-3 py-1.5 h-9",
        sm: "px-2 py-1 h-8",
        lg: "px-4 py-2 h-14",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "default" | "underlined";
    size?: "md" | "sm" | "lg";
  }
>(({ className, variant = "default", size = "md", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size }), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
