import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  RotateCcw,
  Mic2,
  Disc,
  Tag,
  LayoutGrid,
  ArrowUpDown,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrackFilterParams } from "@/features/track/types";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { ArtistSelector } from "@/features/artist/components/ArtistSelector";
import { AlbumSelector } from "@/features/album/components/AlbumSelector";
import { GenreSelector } from "@/features/genre/components/GenreSelector";

// Shadcn Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TrackFiltersProps {
  params: TrackFilterParams;
  setParams: React.Dispatch<React.SetStateAction<TrackFilterParams>>;
  className?: string;
  hideStatus?: boolean;
}

const STATUS_OPTIONS = [
  { value: "ready", label: "Ready", color: "bg-emerald-500" },
  { value: "processing", label: "Processing", color: "bg-blue-500" },
  { value: "pending", label: "Pending", color: "bg-yellow-500" },
  { value: "failed", label: "Failed", color: "bg-red-500" },
] as const;

export const TrackFilters: React.FC<TrackFiltersProps> = ({
  params,
  setParams,
  className,
  hideStatus = false,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // --- 1. Debounce Search Logic ---
  const [localSearch, setLocalSearch] = useState(params.keyword || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== params.keyword) {
        setParams((prev) => ({ ...prev, keyword: localSearch, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, params.keyword, setParams]);

  // Helper change params
  const handleChange = useCallback(
    (key: keyof TrackFilterParams, value: any) => {
      setParams((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    [setParams],
  );

  // --- 2. Reset Logic ---
  const handleReset = () => {
    setLocalSearch("");
    setParams((prev) => ({
      ...prev,
      page: 1,
      limit: prev.limit,
      keyword: "",
      sort: "newest",
      status: undefined,
      artistId: undefined,
      albumId: undefined,
      genreId: undefined,
    }));
  };

  // Check xem có đang filter không
  const hasFilter = useMemo(() => {
    return !!(
      params.keyword ||
      params.status ||
      params.artistId ||
      params.albumId ||
      params.genreId ||
      (params.sort && params.sort !== "newest")
    );
  }, [params]);

  return (
    <div
      className={cn(
        "w-full bg-card border border-border rounded-xl shadow-sm mb-8 transition-all hover:border-primary/20",
        className,
      )}
    >
      <div className="p-4 space-y-4">
        {/* --- TOP ROW: Search & Actions --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search Bar */}
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm bài hát, ISRC, lời nhạc..."
              className="pl-9 bg-background h-10 text-sm border-input shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium placeholder:font-normal"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted transition-all"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right Actions Group */}
          <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto justify-end">
            {/* Sort Dropdown */}
            <Select
              value={params.sort || "newest"}
              onValueChange={(val) => handleChange("sort", val)}
            >
              <SelectTrigger className="w-[160px] h-10 text-sm bg-background border-input shadow-sm font-medium">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Sắp xếp" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
                <SelectItem value="monthlyListeners">
                  Lượt nghe tháng
                </SelectItem>
                <SelectItem value="name">Tên A-Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-border hidden md:block" />

            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "gap-2 h-10 px-4 font-bold border-input shadow-sm transition-all",
                showFilters &&
                  "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
              )}
            >
              <Filter className="w-4 h-4" />
              Bộ lọc
            </Button>

            {hasFilter && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-10 px-3 gap-2 font-bold animate-in zoom-in duration-200"
              >
                <RotateCcw className="size-4" />
                Xóa
              </Button>
            )}
          </div>
        </div>

        {/* --- BOTTOM ROW: Expanded Filters --- */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-300">
            {/* 1. Status Select */}
            {!hideStatus && (
              <Select
                value={params.status || "all"}
                onValueChange={(val) =>
                  handleChange("status", val === "all" ? undefined : val)
                }
              >
                <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="p-1 bg-muted rounded">
                      <LayoutGrid className="w-3.5 h-3.5 text-foreground/70" />
                    </div>
                    <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                      Status:
                    </span>
                    <span className="text-foreground truncate font-semibold">
                      {params.status
                        ? params.status.charAt(0).toUpperCase() +
                          params.status.slice(1)
                        : "Tất cả"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center gap-2 font-medium">
                        <div
                          className={cn(
                            "size-2.5 rounded-full ring-1 ring-white/20",
                            opt.color,
                          )}
                        />
                        {opt.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* 2. Artist Filter Dropdown */}
            <FilterDropdown
              isActive={!!params.artistId}
              onClear={() => handleChange("artistId", undefined)}
              label={
                <div className="flex items-center gap-2">
                  <Mic2 className="w-4 h-4 text-indigo-500" />
                  <span className="truncate text-sm font-medium">
                    {params.artistId ? "Đã chọn nghệ sĩ" : "Chọn nghệ sĩ"}
                  </span>
                </div>
              }
              contentClassName="w-[300px]"
            >
              <div className="p-1">
                <ArtistSelector
                  singleSelect
                  value={params.artistId ? [params.artistId] : []}
                  onChange={(ids) => handleChange("artistId", ids[0])}
                />
              </div>
            </FilterDropdown>

            {/* 3. Album Filter Dropdown */}
            <FilterDropdown
              isActive={!!params.albumId}
              onClear={() => handleChange("albumId", undefined)}
              label={
                <div className="flex items-center gap-2">
                  <Disc className="w-4 h-4 text-orange-500" />
                  <span className="truncate text-sm font-medium">
                    {params.albumId ? "Đã chọn album" : "Chọn album"}
                  </span>
                </div>
              }
              contentClassName="w-[300px]"
            >
              <div className="p-1">
                <AlbumSelector
                  value={params.albumId || ""}
                  onChange={(id) => handleChange("albumId", id || undefined)}
                />
              </div>
            </FilterDropdown>

            {/* 4. Genre Filter Dropdown */}
            <FilterDropdown
              isActive={!!params.genreId}
              onClear={() => handleChange("genreId", undefined)}
              label={
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-500" />
                  <span className="truncate text-sm font-medium">
                    {params.genreId ? "Đã chọn thể loại" : "Chọn thể loại"}
                  </span>
                </div>
              }
              contentClassName="w-[320px]"
            >
              <div className="p-1">
                <GenreSelector
                  singleSelect
                  value={params.genreId ? [params.genreId] : []}
                  onChange={(ids) => handleChange("genreId", ids[0])}
                />
              </div>
            </FilterDropdown>
          </div>
        )}
      </div>
    </div>
  );
};
