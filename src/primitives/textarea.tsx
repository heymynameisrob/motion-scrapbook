import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border bg-base-1 px-3 py-2 text-primary shadow-sm placeholder:text-muted focus disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "dark:bg-base-3",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
