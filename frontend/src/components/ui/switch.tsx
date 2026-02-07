"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "./utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        [
          // Layout
          "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full",

          // Background theo theme
          "bg-input data-[state=checked]:bg-primary",

          // Border + elevation
          "border border-border shadow-sm",
          "data-[state=checked]:shadow-md",

          // Focus & accessibility
          "outline-none transition-all",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "focus-visible:ring-offset-background",

          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
        ].join(" "),
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          [
            // Size & shape
            "pointer-events-none block size-4 rounded-full",

            // Color theo theme
            "bg-card",
            "data-[state=checked]:bg-primary-foreground",

            // Elevation cho thumb
            "shadow-md ring-1 ring-border",

            // Animation
            "transition-transform",
            "data-[state=checked]:translate-x-4",
            "data-[state=unchecked]:translate-x-0",
          ].join(" ")
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
