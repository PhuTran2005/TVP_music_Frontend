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
  placeholder = "Chọn quốc tịch...",
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
            // Base styles: Viền rõ, nền sạch, shadow nhẹ
            "w-full justify-between h-10 bg-background border-input px-3 shadow-sm transition-all",
            "hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
            // Focus/Open state
            open && "ring-2 ring-primary/20 border-primary",
            className
          )}
          disabled={isDetecting || disabled}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {isDetecting ? (
              <Loader2 className="size-4 animate-spin text-primary" />
            ) : selectedCountry ? (
              <span className="text-lg leading-none shrink-0 border border-border/50 rounded-sm overflow-hidden shadow-sm">
                {selectedCountry.flag}
              </span>
            ) : (
              <Globe className="size-4 text-muted-foreground shrink-0" />
            )}

            <span
              className={cn(
                "truncate text-sm",
                // Logic màu chữ: Selected -> Foreground (đậm), Placeholder -> Muted
                selectedCountry
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground"
              )}
            >
              {isDetecting
                ? "Đang xác định vị trí..."
                : selectedCountry?.label || placeholder}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {autoDetect && selectedCountry && !isDetecting && (
              <Sparkles className="size-3 text-amber-500 fill-amber-500/20 animate-pulse" />
            )}
            <ChevronsUpDown className="size-4 text-muted-foreground/50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[280px] p-0 rounded-xl shadow-xl border-border ring-1 ring-black/5 overflow-hidden"
        align="start"
        sideOffset={8}
      >
        <Command className="bg-popover">
          <div className="flex items-center border-b border-border px-3 bg-muted/30">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <CommandInput
              placeholder="Tìm kiếm quốc gia..."
              className="h-10 border-none focus:ring-0 text-sm bg-transparent"
            />
          </div>

          <CommandList className="max-h-[300px] custom-scrollbar p-1">
            <CommandEmpty className="py-6 text-center text-xs font-medium text-muted-foreground">
              Không tìm thấy kết quả phù hợp.
            </CommandEmpty>

            <CommandGroup
              heading={
                <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-primary">
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

            <CommandSeparator className="my-1 bg-border/60" />

            <CommandGroup
              heading={
                <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Tất cả quốc gia
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

// --- SUB-COMPONENT ---
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
        "flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-colors mb-0.5",
        // Hover state rõ ràng
        "aria-selected:bg-accent aria-selected:text-accent-foreground",
        // Active state đậm đà
        isSelected && "bg-primary/15 text-primary aria-selected:bg-primary/20"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg leading-none shrink-0 shadow-sm rounded-sm overflow-hidden">
          {country.flag}
        </span>
        <span
          className={cn(
            "text-sm truncate",
            isSelected ? "font-bold" : "font-medium"
          )}
        >
          {country.label}
        </span>
      </div>

      {isSelected && (
        <Check className="size-4 stroke-[3] text-primary shrink-0 animate-in zoom-in duration-200" />
      )}
      {!isSelected && (
        <span className="text-[10px] font-mono text-muted-foreground/50 uppercase">
          {country.value}
        </span>
      )}
    </CommandItem>
  )
);
