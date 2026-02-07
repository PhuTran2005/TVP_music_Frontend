import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Calendar, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface YearPickerProps {
  value?: number;
  onChange: (year?: number) => void;
  minYear?: number;
  maxYear?: number;
  className?: string;
}

export const YearPicker: React.FC<YearPickerProps> = ({
  value,
  onChange,
  minYear = 1990,
  maxYear = new Date().getFullYear(),
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useLayoutEffect(() => {
    if (isOpen && value && scrollRef.current) {
      const selectedEl = scrollRef.current.querySelector(
        `[data-year="${value}"]`
      );
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "center", behavior: "auto" });
      }
    }
  }, [isOpen, value]);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <Button
        type="button"
        variant={value ? "secondary" : "outline"}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full justify-between font-normal h-9",
          value && "bg-accent text-accent-foreground border-accent"
        )}
      >
        <div className="flex items-center gap-2 truncate">
          <Calendar className="size-4 opacity-70" />
          <span>{value ? `Năm ${value}` : "Năm phát hành"}</span>
        </div>

        <div className="flex items-center gap-1 ml-2">
          {value ? (
            <div
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
              className="rounded-full p-0.5 hover:bg-destructive/20 hover:text-destructive transition-colors"
            >
              <X className="size-3.5" />
            </div>
          ) : (
            <ChevronDown
              className={cn(
                "size-4 opacity-50 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          )}
        </div>
      </Button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full min-w-[200px] pt-2 pb-2 bg-popover text-popover-foreground border border-border rounded-xl shadow-lg animate-in fade-in zoom-in-95">
          <div
            ref={scrollRef}
            className="grid grid-cols-4 gap-1 max-h-60 overflow-y-auto custom-scrollbar p-1"
          >
            {years.map((year) => {
              const isSelected = value === year;
              return (
                <Button
                  key={year}
                  data-year={year}
                  type="button"
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    onChange(year);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "h-8 text-xs w-full",
                    isSelected && "font-bold"
                  )}
                >
                  {year}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
