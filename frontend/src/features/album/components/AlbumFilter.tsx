import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Search,
  SlidersHorizontal,
  Calendar,
  Mic2,
  Music,
  LayoutGrid,
  Eye,
  Trash2,
  ListFilter,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlbumFilterParams } from "@/features/album/types";
import { useDebounce } from "@/hooks/useDebounce";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { YearPicker } from "@/components/ui/YearPicker";
import FilterDropdown from "@/components/ui/FilterDropdown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Selectors
import { ArtistSelector } from "@/features/artist/components/ArtistSelector";
import { GenreSelector } from "@/features/genre/components/GenreSelector";
import { useAppSelector } from "@/store/hooks";

interface AlbumFilterProps {
  params: AlbumFilterParams;
  onSearch: (keyword: string) => void;
  onFilterChange: (key: keyof AlbumFilterParams, value: any) => void;
  onReset: () => void;
}

const AlbumFilter: React.FC<AlbumFilterProps> = ({
  params,
  onSearch,
  onFilterChange,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // State xử lý lỗi overflow z-index
  const [overflowVisible, setOverflowVisible] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  // --- Search Logic ---
  const [localSearch, setLocalSearch] = useState(params.keyword || "");
  const debouncedSearch = useDebounce(localSearch, 400);

  // 1. Đồng bộ từ URL về Input (trường hợp F5 hoặc Back)
  useEffect(() => {
    setLocalSearch(params.keyword || "");
  }, [params.keyword]);

  // 2. Đồng bộ từ Input ra URL (qua Debounce)
  useEffect(() => {
    // Chỉ gọi khi giá trị debounce thực sự thay đổi so với URL hiện tại
    // Điều này ngăn chặn việc gọi API kép khi clear search
    if (debouncedSearch !== (params.keyword || "")) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, params.keyword, onSearch]);

  // 🔥 FIX 1: Chỉ set local state, để debounce effect tự xử lý
  const handleClearSearch = () => {
    setLocalSearch("");
  };

  // 🔥 FIX 2: Xử lý Z-Index/Overflow cho Animation
  useEffect(() => {
    if (isExpanded) {
      // Khi mở: Đợi animation chạy xong (300ms) rồi mới cho tràn (visible)
      // Để các dropdown như YearPicker không bị cắt
      const timer = setTimeout(() => setOverflowVisible(true), 300);
      return () => clearTimeout(timer);
    } else {
      // Khi đóng: Ẩn ngay lập tức để animation đóng mượt mà
      setOverflowVisible(false);
    }
  }, [isExpanded]);

  // --- Active Filters Calculation ---
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (params.genreId) count++;
    if (params.artistId) count++;
    if (params.year) count++;
    if (params.type) count++;
    if (params.isPublic !== undefined) count++;
    return count;
  }, [params]);

  const removeFilter = (key: keyof AlbumFilterParams) => {
    onFilterChange(key, undefined);
  };

  return (
    <div className="w-full mb-8">
      {/* CONTAINER CHÍNH:
        Dùng nền đặc (bg-card) để đảm bảo độ tương phản cao nhất.
      */}
      <div className="bg-card border border-border rounded-xl shadow-sm transition-all">
        {/* --- SECTION 1: HEADER & SEARCH --- */}
        <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* 1. Search Input */}
          <div className="relative w-full md:flex-1 md:max-w-xl group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="size-4" />
            </div>
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search albums by title..."
              // Sử dụng nền background (thường xám hơn card) để tạo độ sâu cho input
              className="pl-9 pr-9 h-10 bg-background border-input shadow-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* 2. Actions Group */}
          <div className="flex items-center gap-3 w-full md:w-auto md:justify-end">
            {/* Sort Dropdown */}
            <Select
              value={params.sort || "newest"}
              onValueChange={(val) => onFilterChange("sort", val)}
            >
              <SelectTrigger className="h-10 w-full md:w-[160px] bg-background border-input shadow-sm hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-2 truncate">
                  <ListFilter className="size-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs uppercase tracking-wide font-semibold">
                    Sort:
                  </span>
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6 hidden md:block" />

            {/* Filter Toggle Button */}
            <Button
              variant={isExpanded ? "secondary" : "outline"}
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "h-10 px-4 gap-2 shadow-sm border-input hover:bg-accent/50 transition-all min-w-[100px] justify-between",
                isExpanded &&
                  "bg-primary/10 text-primary border-primary/30 hover:bg-primary/15",
              )}
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-3.5" />
                <span className="font-medium">Filter</span>
              </div>

              <div className="flex items-center gap-1">
                {activeFiltersCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    "size-3.5 text-muted-foreground transition-transform duration-200",
                    isExpanded && "rotate-180",
                  )}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* --- SECTION 2: EXPANDABLE PANEL --- */}
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-in-out border-t border-transparent",
            isExpanded ? "grid-rows-[1fr] border-border" : "grid-rows-[0fr]",
          )}
        >
          {/* 🔥 KEY FIX: overflow-hidden khi đang animate, overflow-visible khi đã mở xong.
             Giúp dropdown YearPicker không bị che khuất.
          */}
          <div
            className={cn(
              "bg-muted/30 transition-all",
              overflowVisible ? "overflow-visible" : "overflow-hidden",
            )}
          >
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filter 1: Status */}
              {user?.role === "admin" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 ml-1">
                    <Eye className="size-3" /> Visibility
                  </label>
                  <Select
                    value={
                      params.isPublic === undefined
                        ? "all"
                        : String(params.isPublic)
                    }
                    onValueChange={(val) =>
                      onFilterChange(
                        "isPublic",
                        val === "all" ? undefined : val === "true",
                      )
                    }
                  >
                    <SelectTrigger className="w-full bg-background h-9 text-sm shadow-sm focus:ring-1">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="true">Public Only</SelectItem>
                      <SelectItem value="false">Private Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Filter 2: Type */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 ml-1">
                  <LayoutGrid className="size-3" /> Type
                </label>
                <Select
                  value={params.type || "all"}
                  onValueChange={(val) =>
                    onFilterChange("type", val === "all" ? undefined : val)
                  }
                >
                  <SelectTrigger className="w-full bg-background h-9 text-sm shadow-sm focus:ring-1">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="album">Album</SelectItem>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="ep">EP</SelectItem>
                    <SelectItem value="compilation">Compilation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter 3: Genre */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 ml-1">
                  <Music className="size-3" /> Genre
                </label>
                <FilterDropdown
                  isActive={!!params.genreId}
                  onClear={() => onFilterChange("genreId", undefined)}
                  label={
                    <span className="truncate">
                      {params.genreId ? "Filtered" : "Select Genre"}
                    </span>
                  }
                  contentClassName="w-[280px]"
                  className="w-full bg-background h-9 text-sm font-normal px-3 justify-start shadow-sm focus:ring-1"
                >
                  <div className="p-1">
                    <GenreSelector
                      singleSelect
                      value={params.genreId ? [params.genreId] : []}
                      onChange={(ids) => onFilterChange("genreId", ids[0])}
                    />
                  </div>
                </FilterDropdown>
              </div>

              {/* Filter 4: Artist */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 ml-1">
                  <Mic2 className="size-3" /> Artist
                </label>
                <FilterDropdown
                  isActive={!!params.artistId}
                  onClear={() => onFilterChange("artistId", undefined)}
                  label={
                    <span className="truncate">
                      {params.artistId ? "Filtered" : "Select Artist"}
                    </span>
                  }
                  contentClassName="w-[280px]"
                  className="w-full bg-background h-9 text-sm font-normal px-3 justify-start shadow-sm focus:ring-1"
                >
                  <div className="p-1">
                    <ArtistSelector
                      singleSelect
                      value={params.artistId ? [params.artistId] : []}
                      onChange={(ids) => onFilterChange("artistId", ids[0])}
                    />
                  </div>
                </FilterDropdown>
              </div>

              {/* Filter 5: Year */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest flex items-center gap-1.5 ml-1">
                  <Calendar className="size-3" /> Year
                </label>
                {/* z-index cao hơn các phần tử khác nếu cần thiết */}
                <div className="relative z-50">
                  <YearPicker
                    value={params.year}
                    onChange={(val) => onFilterChange("year", val)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: ACTIVE TAGS (Footer) --- */}
        {activeFiltersCount > 0 && (
          <div className="p-3 bg-muted/20 border-t border-border flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1">
              Active:
            </span>

            {/* Tag Generator */}
            {[
              {
                key: "type",
                label: "Type",
                value: params.type,
                icon: LayoutGrid,
              },
              {
                key: "year",
                label: "Year",
                value: params.year,
                icon: Calendar,
              },
              {
                key: "isPublic",
                label: "Visibility",
                value:
                  params.isPublic !== undefined
                    ? params.isPublic
                      ? "Public"
                      : "Private"
                    : null,
                icon: Eye,
              },
              {
                key: "genreId",
                label: "Genre",
                value: params.genreId ? "Selected" : null,
                icon: Music,
              },
              {
                key: "artistId",
                label: "Artist",
                value: params.artistId ? "Selected" : null,
                icon: Mic2,
              },
            ].map((filter) => {
              if (!filter.value) return null;
              const Icon = filter.icon;
              return (
                <Badge
                  key={filter.key}
                  variant="secondary"
                  className="h-7 pl-2 pr-1 gap-1.5 bg-background border border-border text-foreground hover:bg-accent transition-colors cursor-default font-normal shadow-sm"
                >
                  <Icon className="size-3 text-muted-foreground" />
                  <span className="text-muted-foreground">{filter.label}:</span>
                  <span className="font-medium text-foreground">
                    {filter.value}
                  </span>
                  <button
                    onClick={() =>
                      removeFilter(filter.key as keyof AlbumFilterParams)
                    }
                    className="ml-1 p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              );
            })}

            {/* Clear All */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-7 px-2.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive ml-auto font-medium"
            >
              <Trash2 className="size-3 mr-1.5" /> Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumFilter;
