"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex w-full touch-none select-none items-center group cursor-pointer py-1.5",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:py-0 data-[orientation=vertical]:px-1.5",
        "data-disabled:opacity-50 data-disabled:pointer-events-none",
        className
      )}
      {...props}
    >
      {/* TRACK (Nền) */}
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-foreground relative grow overflow-hidden rounded-full transition-all duration-300",
          // Desktop: Hover vào thì Track dày lên
          "data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-full group-hover:data-[orientation=horizontal]:h-1.5",
          // Mobile: Khi chạm (active) thì Track cũng dày lên
          "group-active:data-[orientation=horizontal]:h-1.5",

          "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1 group-hover:data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute shadow-[0_0_12px_rgba(var(--primary),0.6)]",
            "data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>

      {/* THUMB (Cục nắm) */}
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className={cn(
            "block bg-background border-2 border-primary ring-offset-background shadow-[0_0_10px_rgba(var(--primary),0.5)] rounded-lg transition-all duration-200",

            // --- KÍCH THƯỚC (SIZE) ---
            // Mặc định: size-0 (ẩn)
            "size-0",
            // Desktop: Hover hiện lên size-3.5
            "group-hover:size-3.5",
            // Mobile: Chạm vào (active) hoặc Focus (bàn phím) hiện lên size-4 (to hơn xíu cho dễ nhìn)
            "group-active:size-4 focus-visible:size-4",

            // --- HIỆU ỨNG (SCALE) ---
            // Khi đang kéo (active), phóng to lên 1.25 lần
            "group-active:scale-125 group-active:ring-4 group-active:ring-primary/20",

            // Focus Accessibility
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",

            "disabled:pointer-events-none disabled:opacity-50"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
