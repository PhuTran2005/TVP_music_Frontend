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
            "h-10 px-3 rounded-xl border-border/60 bg-background transition-all duration-200",
            "hover:bg-accent hover:border-primary/30",
            "data-[state=open]:border-primary/50 data-[state=open]:bg-accent",
            isActive &&
              "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50",
            className
          )}
        >
          <div className="flex items-center gap-2 max-w-[200px]">
            <span
              className={cn(
                "truncate text-[13px] font-semibold tracking-tight transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              {label}
            </span>

            <div className="flex items-center shrink-0">
              {isActive && onClear ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  className="ml-1 p-0.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-all active:scale-90"
                >
                  <X className="size-3 stroke-[3]" />
                </div>
              ) : (
                <ChevronDown
                  className={cn(
                    "size-3.5 opacity-40 transition-transform duration-300 ease-out",
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
          "z-[100] p-1 overflow-hidden rounded-2xl border border-border/40 bg-popover shadow-xl animate-in fade-in zoom-in-95 duration-200",
          "w-auto min-w-[240px] max-w-[95vw]",
          contentClassName
        )}
      >
        <div className="flex flex-col max-h-[400px]">
          <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
            {children}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
