import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Check,
  Globe,
  Search,
  Sparkles,
  ChevronsUpDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { detectUserCountry } from "@/lib/location.service";
import {
  ALL_NATIONALITIES,
  Country,
  TOP_NATIONALITIES,
} from "@/config/constants";

interface NationalitySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  autoDetect?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const NationalitySelector: React.FC<NationalitySelectorProps> = ({
  value,
  onChange,
  autoDetect = false,
  placeholder = "Quốc tịch...",
  className,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (autoDetect && !value) {
      const initDetection = async () => {
        try {
          setIsDetecting(true);
          const code = await detectUserCountry();
          if (code && !value) onChange(code);
        } catch (error) {
          console.error("Country detection failed", error);
        } finally {
          setIsDetecting(false);
        }
      };
      initDetection();
    }
  }, [autoDetect, value, onChange]);

  const selectedCountry = useMemo(
    () => ALL_NATIONALITIES.find((c) => c.value === value),
    [value]
  );

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setOpen(false);
    },
    [onChange]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between h-10 bg-background border-border/50 rounded-xl px-3 transition-all hover:border-primary/30 hover:bg-accent/30",
            open && "ring-2 ring-primary/10 border-primary/30",
            className
          )}
          disabled={isDetecting || disabled}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {isDetecting ? (
              <Loader2 className="size-3.5 animate-spin text-primary" />
            ) : selectedCountry ? (
              <span className="text-base leading-none shrink-0">
                {selectedCountry.flag}
              </span>
            ) : (
              <Globe className="size-4 text-muted-foreground/40 shrink-0" />
            )}

            <span
              className={cn(
                "truncate text-sm font-medium",
                !selectedCountry && "text-muted-foreground font-normal"
              )}
            >
              {isDetecting
                ? "Đang xác định..."
                : selectedCountry?.label || placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {autoDetect && selectedCountry && !isDetecting && (
              <Sparkles className="size-3 text-primary/60 animate-pulse" />
            )}
            <ChevronsUpDown className="size-3.5 opacity-30" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[280px] p-0 rounded-2xl shadow-2xl border-border/40 overflow-hidden"
        align="start"
        sideOffset={6}
      >
        <Command className="rounded-none">
          <div className="flex items-center border-b border-border/40 px-3 bg-muted/20">
            <Search className="size-3.5 shrink-0 opacity-40" />
            <CommandInput
              placeholder="Tìm quốc gia..."
              className="h-10 border-none focus:ring-0 text-sm"
            />
          </div>

          <CommandList className="max-h-[300px] custom-scrollbar p-1">
            <CommandEmpty className="py-8 text-center text-xs text-muted-foreground">
              Không tìm thấy kết quả.
            </CommandEmpty>

            <CommandGroup
              heading={
                <span className="px-2 text-[10px] font-bold uppercase tracking-tighter text-primary/60">
                  Phổ biến
                </span>
              }
            >
              {TOP_NATIONALITIES.map((country) => (
                <CountryItem
                  key={`top-${country.value}`}
                  country={country}
                  isSelected={value === country.value}
                  onSelect={handleSelect}
                />
              ))}
            </CommandGroup>

            <CommandSeparator className="my-1 opacity-50" />

            <CommandGroup
              heading={
                <span className="px-2 text-[10px] font-bold uppercase tracking-tighter text-muted-foreground/50">
                  Tất cả
                </span>
              }
            >
              {ALL_NATIONALITIES.map((country) => (
                <CountryItem
                  key={country.value}
                  country={country}
                  isSelected={value === country.value}
                  onSelect={handleSelect}
                />
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// --- SUB-COMPONENT TỐI GIẢN ---
const CountryItem = React.memo(
  ({
    country,
    isSelected,
    onSelect,
  }: {
    country: Country;
    isSelected: boolean;
    onSelect: (v: string) => void;
  }) => (
    <CommandItem
      value={`${country.label} ${country.value}`}
      onSelect={() => onSelect(country.value)}
      className={cn(
        "flex items-center justify-between py-2 px-2.5 cursor-pointer rounded-lg transition-all duration-150",
        "aria-selected:bg-primary/5 aria-selected:text-primary",
        isSelected && "bg-primary/10 text-primary"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg leading-none shrink-0">{country.flag}</span>
        <span className="text-sm font-medium truncate">{country.label}</span>
        <span className="text-[10px] font-mono opacity-30 uppercase tracking-tighter shrink-0">
          {country.value}
        </span>
      </div>

      {isSelected && (
        <Check className="size-3.5 stroke-[3] text-primary animate-in zoom-in duration-300" />
      )}
    </CommandItem>
  )
);
