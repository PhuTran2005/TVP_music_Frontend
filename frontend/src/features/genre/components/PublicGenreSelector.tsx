import React, { useState, useMemo } from "react";
import {
  Search,
  Check,
  X,
  Loader2,
  Music,
  Layers,
  CornerDownRight,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGenreTreeQuery } from "@/features/genre/hooks/useGenresQuery";
import type { Genre } from "@/features/genre/types";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

// --- Helper Types ---
type GenreNode = Genre & {
  level: number;
  isDisabled: boolean;
  hasChildren: boolean;
};

// --- Helper Logic Build Tree ---
const buildFlatTree = (
  items: Genre[],
  excludeIds: string[] = [],
  parentId: string | null = null,
  level = 0,
): GenreNode[] => {
  const result: GenreNode[] = [];
  const children = items
    .filter((item) => {
      const itemParentId =
        typeof item.parentId === "object" && item.parentId
          ? (item.parentId as any)._id
          : item.parentId;
      return (itemParentId || null) === parentId;
    })
    .sort((a, b) => (a.priority > b.priority ? -1 : 1));

  for (const child of children) {
    if (excludeIds.includes(child._id)) continue;
    const hasChildren = items.some((i) => {
      const pId =
        typeof i.parentId === "object" && i.parentId
          ? (i.parentId as any)._id
          : i.parentId;
      return (pId || null) === child._id;
    });

    result.push({ ...child, level, isDisabled: false, hasChildren });
    const grandChildren = buildFlatTree(
      items,
      excludeIds,
      child._id,
      level + 1,
    );
    result.push(...grandChildren);
  }
  return result;
};

// --- Props ---
interface PublicGenreSelectorProps {
  label?: string;
  required?: boolean;
  error?: string;
  value: string | string[] | undefined | null;
  onChange: (val: any) => void;
  singleSelect?: boolean;
  excludeIds?: string[];
  className?: string;
  placeholder?: string;
  variant?: "form" | "filter";
}

export const PublicGenreSelector: React.FC<PublicGenreSelectorProps> = ({
  label,
  required,
  error,
  value,
  onChange,
  singleSelect = false,
  excludeIds = [],
  className,
  placeholder = "Tìm thể loại...",
  variant = "form",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: genres, isLoading } = useGenreTreeQuery();

  const selectedIds = useMemo(() => {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return [value];
    return [];
  }, [value]);

  const displayGenres = useMemo(() => {
    if (!genres) return [];
    if (searchTerm) {
      return genres
        .filter((g) => g.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((g) => ({
          ...g,
          level: 0,
          isDisabled: false,
          hasChildren: false,
        }));
    }
    return buildFlatTree(genres, excludeIds);
  }, [genres, searchTerm, excludeIds]);

  const handleSelect = (id: string | null | undefined) => {
    if (singleSelect) {
      onChange(id === value ? undefined : id);
      return;
    }
    if (!id) return;
    const currentIds = selectedIds;
    const isSelected = currentIds.includes(id);
    onChange(
      isSelected
        ? currentIds.filter((item) => item !== id)
        : [...currentIds, id],
    );
  };

  const hexToRgba = (hex: string, opacity: number) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
      : undefined;
  };

  return (
    <div className={cn("space-y-3 w-full flex flex-col", className)}>
      {/* LABEL */}
      {label && (
        <Label className="text-xs font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 ml-1">
          {label} {required && <span className="text-rose-500">*</span>}
        </Label>
      )}

      {/* ================= MAIN CONTAINER ================= */}
      <div
        className={cn(
          "relative rounded-2xl bg-card flex flex-col overflow-hidden transition-all",
          variant === "form"
            ? "border border-border/60 shadow-sm"
            : "border-none bg-transparent",
          error &&
            "border-rose-500/50 ring-1 ring-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]",
        )}
      >
        {/* --- STICKY SEARCH BAR --- */}
        <div className="sticky top-0 z-20 bg-card/80 backdrop-blur-xl border-b border-border/40 p-2 sm:p-3">
          <div className="relative flex items-center bg-muted/50 hover:bg-muted/80 rounded-xl h-11 sm:h-12 px-3 sm:px-4 transition-all focus-within:bg-background focus-within:ring-2 focus-within:ring-primary/30 focus-within:shadow-sm">
            <Search className="size-[18px] text-muted-foreground mr-2.5 shrink-0" />
            <input
              type="text"
              className="flex-1 bg-transparent border-none outline-none text-[14px] sm:text-[15px] placeholder:text-muted-foreground/60 font-medium w-full"
              placeholder={placeholder}
              value={searchTerm}
              autoComplete="off"
              spellCheck="false"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        {/* --- SCROLLABLE LIST AREA --- */}
        {/* Chiều cao linh hoạt: Tối đa 50% màn hình trên mobile, 350px trên Desktop */}
        <div className="overflow-y-auto custom-scrollbar p-2 scroll-smooth relative">
          {isLoading ? (
            <div className="py-14 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="size-6 animate-spin text-primary/70" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary/70">
                Đang tải dữ liệu...
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {/* --- DEFAULT OPTIONS (Tất cả / Gốc) --- */}
              {!searchTerm && (
                <div className="mb-1 space-y-0.5 border-b border-border/40 pb-1">
                  {variant === "filter" && (
                    <DefaultOptionItem
                      icon={Music}
                      label="Tất cả thể loại"
                      isActive={value === undefined}
                      onClick={() => handleSelect(undefined)}
                    />
                  )}
                  {(variant === "filter" || variant === "form") && (
                    <DefaultOptionItem
                      icon={Layers}
                      label={
                        variant === "filter"
                          ? "Chỉ thể loại chính"
                          : "Gốc (Độc lập)"
                      }
                      isActive={
                        value === (variant === "filter" ? "root" : null)
                      }
                      onClick={() =>
                        handleSelect(variant === "filter" ? "root" : null)
                      }
                    />
                  )}
                </div>
              )}

              {/* --- GENRE TREE ITEMS --- */}
              {displayGenres.map((genre) => {
                const isSelected = selectedIds.includes(genre._id);
                const gColor = genre.color || "#8b5cf6";
                const bgTint = hexToRgba(gColor, 0.12);

                // Khống chế thụt lề tối đa (max 48px) để không vỡ layout Mobile
                const indentPadding = searchTerm
                  ? 8
                  : Math.min(genre.level * 18 + 8, 48);

                return (
                  <div
                    key={genre._id}
                    onClick={() => handleSelect(genre._id)}
                    className={cn(
                      "flex items-center gap-3 pr-3 py-2 rounded-xl cursor-pointer transition-all select-none group relative overflow-hidden min-h-[44px]", // min-h-[44px] cho touch mục tiêu chuẩn Apple
                      isSelected
                        ? "shadow-sm"
                        : "hover:bg-muted/60 text-foreground/90 hover:text-foreground",
                    )}
                    style={{
                      paddingLeft: `${indentPadding}px`,
                      backgroundColor: isSelected ? bgTint : undefined,
                    }}
                  >
                    {/* Đường Highlight mỏng bên trái khi Active */}
                    {isSelected && (
                      <div
                        className="absolute left-0 top-[10%] w-[3px] h-[80%] rounded-r-full"
                        style={{ backgroundColor: gColor }}
                      />
                    )}

                    {/* Icon phân nhánh (Chỉ hiện khi có level > 0 và không search) */}
                    {!searchTerm && genre.level > 0 && (
                      <CornerDownRight
                        className="size-4 text-muted-foreground/40 absolute"
                        style={{ left: `${indentPadding - 18}px` }}
                      />
                    )}

                    {/* --- THUMBNAIL ẢNH --- */}
                    <div className="relative size-10 sm:size-11 rounded-xl overflow-hidden shrink-0 bg-muted/80 shadow-sm border border-border/40">
                      {genre.image ? (
                        <ImageWithFallback
                          src={genre.image}
                          alt={genre.name}
                          className={cn(
                            "w-full h-full object-cover transition-transform duration-500",
                            !isSelected && "group-hover:scale-110",
                          )}
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: hexToRgba(gColor, 0.15) }}
                        >
                          <Music
                            className="size-4 sm:size-5"
                            style={{ color: gColor }}
                          />
                        </div>
                      )}
                    </div>

                    {/* --- INFO --- */}
                    <div className="flex flex-col flex-1 min-w-0 justify-center">
                      <span
                        className={cn(
                          "truncate transition-colors leading-tight",
                          genre.level === 0
                            ? "text-[14px] sm:text-[15px] font-bold"
                            : "text-[13px] sm:text-[14px] font-semibold",
                        )}
                        style={{ color: isSelected ? gColor : undefined }}
                      >
                        {genre.name}
                      </span>
                      {/* Có thể thêm trackCount vào đây nếu có data: <span className="text-[10px] text-muted-foreground">120 bài</span> */}
                    </div>

                    {/* --- CHECK ICON --- */}
                    {isSelected && (
                      <div className="shrink-0 animate-in zoom-in-50 duration-200">
                        <div className="size-6 rounded-full bg-background/50 flex items-center justify-center shadow-sm">
                          <Check
                            className="size-3.5"
                            style={{ color: gColor }}
                            strokeWidth={3}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* --- EMPTY STATE --- */}
              {displayGenres.length === 0 && !isLoading && (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-3 animate-in fade-in duration-500">
                  <div className="size-14 rounded-full bg-muted/50 flex items-center justify-center border border-border/50">
                    <Search className="size-6 text-muted-foreground/40" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[14px] font-bold text-foreground/80">
                      Không tìm thấy kết quả
                    </p>
                    <p className="text-[12px] text-muted-foreground font-medium">
                      Thử dùng một từ khóa khác xem sao.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ================= TINTED BADGES (For Form Mode) ================= */}
      {!singleSelect &&
        selectedIds.length > 0 &&
        genres &&
        variant === "form" && (
          <div className="flex flex-wrap gap-2 pt-1 animate-in fade-in slide-in-from-top-2 duration-300">
            {selectedIds.map((id) => {
              const g = genres.find((item) => item._id === id);
              if (!g) return null;
              const gColor = g.color || "#8b5cf6";

              return (
                <Badge
                  key={id}
                  variant="outline"
                  className="pl-1 pr-2.5 py-1 h-9 sm:h-10 text-[13px] font-bold border-none flex items-center gap-2 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: hexToRgba(gColor, 0.15),
                    color: gColor,
                  }}
                  onClick={() => handleSelect(id)} // Cho phép click vào tag để xóa
                  title="Bấm để xóa"
                >
                  {/* Thumbnail nhỏ xíu trên Tag */}
                  {g.image ? (
                    <img
                      src={g.image}
                      alt=""
                      className="size-7 rounded-full object-cover shadow-sm bg-background/50"
                    />
                  ) : (
                    <div className="size-7 rounded-full bg-background/60 flex items-center justify-center shadow-sm">
                      <Music className="size-3.5" style={{ color: gColor }} />
                    </div>
                  )}

                  <span className="truncate max-w-[120px]">{g.name}</span>

                  <div className="size-4 rounded-full bg-black/10 dark:bg-white/20 flex items-center justify-center ml-0.5">
                    <X className="size-[10px]" />
                  </div>
                </Badge>
              );
            })}
          </div>
        )}

      {/* ================= ERROR MESSAGE ================= */}
      {error && (
        <p className="text-[12px] font-bold text-rose-500 animate-in slide-in-from-top-1 flex items-center gap-1.5 mt-1">
          <AlertCircle className="size-3.5" /> {error}
        </p>
      )}
    </div>
  );
};

// --- Sub Component cho Mục Chọn Mặc định (Tránh lặp code) ---
const DefaultOptionItem = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all select-none group min-h-[44px]",
      isActive
        ? "bg-primary/10 text-primary shadow-sm"
        : "hover:bg-muted/60 text-foreground/90 hover:text-foreground",
    )}
  >
    <div
      className={cn(
        "size-10 sm:size-11 rounded-xl flex items-center justify-center shrink-0 transition-colors border border-transparent",
        isActive
          ? "bg-primary/20 border-primary/20"
          : "bg-muted border-border/40 group-hover:bg-background group-hover:shadow-sm",
      )}
    >
      <Icon
        className={cn(
          "size-5",
          isActive ? "text-primary" : "text-muted-foreground",
        )}
      />
    </div>
    <span className="flex-1 text-[14px] sm:text-[15px] font-bold">{label}</span>
    {isActive && (
      <div className="shrink-0 animate-in zoom-in-50 duration-200">
        <Check className="size-5" strokeWidth={2.5} />
      </div>
    )}
  </div>
);
