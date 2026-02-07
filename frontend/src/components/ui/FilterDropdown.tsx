import React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FilterDropdownProps {
  label: React.ReactNode;
  isActive: boolean;
  onClear?: () => void;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  align?: "start" | "center" | "end";
}

export const FilterDropdown = ({
  label,
  isActive,
  onClear,
  children,
  className,
  contentClassName,
  align = "start",
}: FilterDropdownProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            // Base styles: Border rõ ràng (border-input), nền sạch, shadow nhẹ
            "h-10 px-3.5 rounded-xl border-input bg-background shadow-sm transition-all duration-200",
            "hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/30",
            "data-[state=open]:border-primary data-[state=open]:ring-2 data-[state=open]:ring-primary/10",

            // Active State: Tương phản cao hơn
            isActive && [
              "bg-primary/10 border-primary/30 text-primary", // Nền đậm hơn
              "hover:bg-primary/20 hover:border-primary/50",
              "font-semibold", // Chữ đậm hơn khi active
            ],
            className
          )}
        >
          <div className="flex items-center gap-2.5 max-w-[200px]">
            {/* Label Text */}
            <span
              className={cn(
                "truncate text-sm tracking-tight transition-colors",
                // Logic màu chữ: Active -> Primary, Inactive -> Foreground (không dùng muted quá nhạt)
                isActive
                  ? "text-primary font-bold"
                  : "text-foreground font-medium"
              )}
            >
              {label}
            </span>

            {/* Icons Area */}
            <div className="flex items-center shrink-0">
              {isActive && onClear ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  // Nút X rõ ràng hơn, dễ bấm hơn
                  className="ml-1 p-0.5 rounded-full text-primary hover:bg-primary/20 hover:text-destructive transition-colors active:scale-95 cursor-pointer"
                >
                  <X className="size-3.5 stroke-[3]" />
                </div>
              ) : (
                <ChevronDown
                  className={cn(
                    "size-4 transition-transform duration-300 ease-out",
                    // Icon đậm hơn (foreground/50) thay vì opacity-40
                    isActive ? "text-primary" : "text-muted-foreground/70",
                    "group-data-[state=open]:rotate-180"
                  )}
                />
              )}
            </div>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={8}
        className={cn(
          // Popover container: Viền rõ, Shadow đậm
          "z-[100] p-1.5 overflow-hidden rounded-xl border border-border bg-popover shadow-lg animate-in fade-in zoom-in-95 duration-200",
          "w-auto min-w-[240px] max-w-[95vw]",
          contentClassName
        )}
      >
        <div className="flex flex-col max-h-[400px]">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-0.5">
            {children}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
