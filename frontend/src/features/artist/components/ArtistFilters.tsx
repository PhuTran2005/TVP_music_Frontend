import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  ShieldCheck,
  ArrowUpDown,
  RotateCcw,
  Globe,
  Music2,
  LayoutGrid,
  Filter,
} from "lucide-react";
import { ArtistFilterParams } from "@/features/artist/types";
import { useDebounce } from "@/hooks/useDebounce";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { GenreSelector } from "@/features/genre/components/GenreSelector";
import { NationalitySelector } from "@/components/ui/NationalitySelector";
import { cn } from "@/lib/utils";

// Shadcn Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ArtistFiltersProps {
  params: ArtistFilterParams;
  setParams: React.Dispatch<React.SetStateAction<ArtistFilterParams>>;
}

const SORT_OPTIONS = [
  { label: "Mới nhất", value: "newest" },
  { label: "Phổ biến nhất", value: "popular" },
  { label: "Lượt nghe tháng", value: "monthlyListeners" },
  { label: "Tên A-Z", value: "name" },
] as const;

export const ArtistFilters: React.FC<ArtistFiltersProps> = ({
  params,
  setParams,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // --- 1. Debounce Search Logic ---
  const [localSearch, setLocalSearch] = useState(params.keyword || "");
  const debouncedSearch = useDebounce(localSearch, 500);

  useEffect(() => {
    if (debouncedSearch !== params.keyword) {
      setParams((prev) => ({ ...prev, keyword: debouncedSearch, page: 1 }));
    }
  }, [debouncedSearch, params.keyword, setParams]);

  // Helper change params
  const handleChange = useCallback(
    (key: keyof ArtistFilterParams, value: any) => {
      setParams((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    [setParams]
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
      genreId: undefined,
      nationality: undefined,
      isVerified: undefined,
      isActive: undefined,
    }));
  };

  // Check xem có đang filter không
  const hasFilter = useMemo(() => {
    return !!(
      params.keyword ||
      params.genreId ||
      params.nationality ||
      params.isVerified !== undefined ||
      params.isActive !== undefined ||
      (params.sort && params.sort !== "newest")
    );
  }, [params]);

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-sm mb-8 transition-all hover:border-primary/20">
      <div className="p-4 space-y-4">
        {/* --- TOP ROW: Search & Actions --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search Bar */}
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm kiếm nghệ sĩ, nghệ danh..."
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
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-border hidden md:block" />

            <Button
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "gap-2 h-10 px-4 font-bold border-input shadow-sm transition-all",
                showFilters &&
                  "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
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
            {/* 1. Nationality Filter */}
            <FilterDropdown
              isActive={!!params.nationality}
              onClear={() => handleChange("nationality", undefined)}
              label={
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="truncate text-sm font-medium">
                    {params.nationality
                      ? `Quốc gia: ${params.nationality}`
                      : "Quốc gia"}
                  </span>
                </div>
              }
              contentClassName="w-[280px]"
            >
              <div className="p-1">
                <NationalitySelector
                  autoDetect
                  value={params.nationality}
                  onChange={(val) => handleChange("nationality", val)}
                />
              </div>
            </FilterDropdown>

            {/* 2. Genre Filter */}
            <FilterDropdown
              isActive={!!params.genreId}
              onClear={() => handleChange("genreId", undefined)}
              label={
                <div className="flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-primary" />
                  <span className="truncate text-sm font-medium">
                    {params.genreId ? "Genre đã chọn" : "Thể loại nhạc"}
                  </span>
                </div>
              }
              contentClassName="w-[300px]"
            >
              <div className="p-1">
                <GenreSelector
                  singleSelect
                  value={params.genreId ? [params.genreId] : []}
                  onChange={(ids) => handleChange("genreId", ids[0])}
                />
              </div>
            </FilterDropdown>

            {/* 3. Account Status */}
            <Select
              value={
                params.isActive === undefined ? "all" : String(params.isActive)
              }
              onValueChange={(val) => {
                const value = val === "all" ? undefined : val === "true";
                handleChange("isActive", value);
              }}
            >
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                <div className="flex items-center gap-2 text-sm">
                  <LayoutGrid className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground truncate font-medium">
                    {params.isActive === undefined
                      ? "Trạng thái: Tất cả"
                      : params.isActive
                      ? "Đang hoạt động"
                      : "Bị khóa/Ẩn"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="true">Đang hoạt động</SelectItem>
                <SelectItem value="false">Bị khóa/Ẩn</SelectItem>
              </SelectContent>
            </Select>

            {/* 4. Verified Status */}
            <Select
              value={
                params.isVerified === undefined
                  ? "all"
                  : String(params.isVerified)
              }
              onValueChange={(val) => {
                const value = val === "all" ? undefined : val === "true";
                handleChange("isVerified", value);
              }}
            >
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-foreground truncate font-medium">
                    {params.isVerified === undefined
                      ? "Xác minh: Tất cả"
                      : "Nghệ sĩ xác minh"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả hồ sơ</SelectItem>
                <SelectItem value="true">Đã xác minh (Verified)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};
