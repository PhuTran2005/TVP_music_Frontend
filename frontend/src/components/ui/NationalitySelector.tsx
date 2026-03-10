import React, { useState, useMemo, useCallback } from "react";
import {
  Check,
  Globe,
  ChevronsUpDown,
  Loader2,
  X,
  LocateFixed,
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
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  clearable?: boolean; // True nếu dùng cho Filter
}

export const NationalitySelector: React.FC<NationalitySelectorProps> = ({
  value,
  onChange,
  placeholder = "Chọn quốc gia...",
  className,
  disabled = false,
  clearable = false,
}) => {
  const [open, setOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Chuẩn hóa dữ liệu (Luôn so sánh bằng chữ IN HOA để tránh lỗi DB)
  const safeValue = typeof value === "string" ? value.toUpperCase() : "";

  const selectedCountry = useMemo(
    () => ALL_NATIONALITIES.find((c) => c.value.toUpperCase() === safeValue),
    [safeValue],
  );

  // ==========================================
  // 1. LOGIC NHẬN DIỆN VỊ TRÍ (THỦ CÔNG BẰNG NÚT BẤM)
  // ==========================================
  const handleAutoDetect = async () => {
    setOpen(false); // Đóng menu để nhìn thấy trạng thái loading ở ngoài trigger
    setIsDetecting(true);
    try {
      const code = await detectUserCountry();
      if (code) {
        onChange(code.toUpperCase()); // Ghi nhận quốc gia tìm được vào Form
      }
    } catch (error) {
      console.error("Country detection failed", error);
    } finally {
      setIsDetecting(false);
    }
  };

  // ==========================================
  // 2. LOGIC NGƯỜI DÙNG TỰ CHỌN
  // ==========================================
  const handleSelect = useCallback(
    (val: string) => {
      const newVal = val.toUpperCase();

      if (clearable && newVal === safeValue) {
        onChange(""); // Filter: Bấm lại vào nước đang chọn thì Xóa
      } else {
        onChange(newVal); // Chọn nước mới (Kích hoạt Form Edit Dirty)
      }

      setOpen(false); // Chọn xong tự đóng menu
    },
    [onChange, safeValue, clearable],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* asChild bắt buộc thẻ bên trong phải nhận ref/events */}
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // 🔥 FIX 1: Bỏ role="combobox" để tránh lỗi đơ Trigger trên một số trình duyệt
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-11 bg-transparent border-input px-3 shadow-sm transition-all rounded-md",
            "hover:bg-muted/50 hover:text-foreground",
            open && "ring-1 ring-primary border-primary bg-background",
            className,
          )}
          disabled={isDetecting || disabled}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {isDetecting ? (
              <Loader2 className="size-4 animate-spin text-primary" />
            ) : selectedCountry ? (
              <span className="text-lg leading-none shrink-0 shadow-sm border border-border/50 rounded-[2px] overflow-hidden bg-background">
                {selectedCountry.flag}
              </span>
            ) : (
              <Globe className="size-4 text-muted-foreground shrink-0" />
            )}

            <span
              className={cn(
                "truncate text-sm",
                selectedCountry
                  ? "font-semibold text-foreground"
                  : "font-medium text-muted-foreground",
              )}
            >
              {isDetecting
                ? "Đang xác định vị trí..."
                : selectedCountry?.label || placeholder}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            {/* Nút Xóa nhanh (Dùng cho Filter) */}
            {clearable && selectedCountry && !disabled && !isDetecting && (
              <div
                role="button"
                // 🔥 FIX 2: Đổi từ onClick sang onPointerDown và thêm preventDefault
                // để Radix không bị hiểu lầm là đang click mở Popover
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange("");
                }}
                className="p-1 -mr-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors z-10"
              >
                <X className="size-3.5" />
              </div>
            )}

            <ChevronsUpDown className="size-4 text-muted-foreground/60" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        // 🔥 FIX 3: Thêm z-[9999] để menu nổi lên trên Modal Artist
        // Cùng với var(--radix-popover-trigger-width) để rộng bằng nút trigger
        className="z-[9999] p-0 rounded-lg shadow-xl border-border ring-1 ring-black/5 overflow-hidden w-[var(--radix-popover-trigger-width)]"
        align="start"
        sideOffset={6}
      >
        <Command className="bg-popover">
          {/* 🔥 FIX 4: Đã xóa icon <Search /> thừa */}
          <div className="border-b border-border bg-muted/20">
            <CommandInput
              placeholder="Tìm kiếm quốc gia hoặc mã (VD: VN)..."
              className="h-10 border-none focus:ring-0 text-sm bg-transparent w-full"
            />
          </div>

          <CommandList className="max-h-[260px] custom-scrollbar p-1.5">
            <CommandEmpty className="py-6 text-center text-[13px] font-medium text-muted-foreground">
              Không tìm thấy quốc gia.
            </CommandEmpty>

            {/* NÚT TỰ ĐỘNG NHẬN DIỆN MỚI */}
            <CommandGroup>
              <CommandItem
                onSelect={handleAutoDetect}
                className="flex items-center gap-2.5 py-2 px-2.5 rounded-md cursor-pointer transition-colors my-0.5 font-semibold text-primary hover:bg-primary/10 aria-selected:bg-primary/10 aria-selected:text-primary"
              >
                <div className="flex items-center justify-center bg-primary/20 p-1.5 rounded-md">
                  <LocateFixed className="size-4 text-primary" />
                </div>
                Tự động nhận diện (GPS)
              </CommandItem>
            </CommandGroup>

            <CommandSeparator className="my-1.5 bg-border/50" />

            {/* QUỐC GIA PHỔ BIẾN */}
            <CommandGroup
              heading={
                <span className="px-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Phổ biến
                </span>
              }
            >
              {TOP_NATIONALITIES.map((country) => (
                <CountryItem
                  key={`top-${country.value}`}
                  country={country}
                  isSelected={safeValue === country.value.toUpperCase()}
                  onSelect={handleSelect}
                />
              ))}
            </CommandGroup>

            <CommandSeparator className="my-1.5 bg-border/50" />

            {/* TẤT CẢ QUỐC GIA */}
            <CommandGroup
              heading={
                <span className="px-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Tất cả quốc gia
                </span>
              }
            >
              {ALL_NATIONALITIES.map((country) => (
                <CountryItem
                  key={country.value}
                  country={country}
                  isSelected={safeValue === country.value.toUpperCase()}
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

// ==========================================
// SUB-COMPONENT TỐI ƯU GIAO DIỆN CHỌN
// ==========================================
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
      // Tối ưu thuật toán tìm kiếm (cmdk): tìm được cả chữ hoa/thường và tên nước
      keywords={[country.label, country.value, country.value.toLowerCase()]}
      value={`${country.label} ${country.value}`}
      onSelect={() => onSelect(country.value)}
      className={cn(
        "flex items-center justify-between py-2 px-2.5 rounded-md cursor-pointer transition-colors my-0.5",
        "aria-selected:bg-accent aria-selected:text-accent-foreground",
        isSelected && "bg-primary/10 text-primary aria-selected:bg-primary/15",
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-lg leading-none shrink-0 shadow-sm border border-border/50 rounded-[2px] overflow-hidden bg-background">
          {country.flag}
        </span>
        <span
          className={cn(
            "text-[13px] truncate",
            isSelected ? "font-bold" : "font-medium",
          )}
        >
          {country.label}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {!isSelected && (
          <span className="text-[10px] font-mono font-bold text-muted-foreground/40 uppercase">
            {country.value}
          </span>
        )}
        {isSelected && (
          <Check className="size-4 stroke-[3] text-primary shrink-0 animate-in zoom-in duration-200" />
        )}
      </div>
    </CommandItem>
  ),
);
