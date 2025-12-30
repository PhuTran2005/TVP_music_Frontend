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
} from "lucide-react";
import { ArtistFilterParams } from "@/features/artist/types";
import { useDebounce } from "@/hooks/useDebounce";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { GenreSelector } from "@/features/genre/components/GenreSelector";
import { NationalitySelector } from "@/components/ui/NationalitySelector";

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
    <div className="w-full bg-card border rounded-xl shadow-sm mb-6 animate-in fade-in duration-500">
      <div className="p-4 space-y-4">
        {/* --- TOP ROW: Search & Actions --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search Bar */}
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm kiếm nghệ sĩ, nghệ danh..."
              className="pl-9 bg-background h-9 text-sm focus-visible:ring-1 transition-all"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right Actions Group */}
          <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto justify-end">
            {/* Sort Dropdown */}
            <Select
              value={params.sort || "newest"}
              onValueChange={(val) => handleChange("sort", val)}
            >
              <SelectTrigger className="w-[150px] h-9 text-xs bg-background">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
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

            <div className="h-4 w-px bg-border mx-1 hidden md:block" />

            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2 h-9"
            >
              <LayoutGrid className="w-4 h-4" />
              Bộ lọc
            </Button>

            {hasFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="text-destructive hover:bg-destructive/10 h-9 px-2 gap-1.5 animate-in zoom-in"
              >
                <RotateCcw className="size-3.5" />
                <span className="hidden sm:inline">Xóa lọc</span>
              </Button>
            )}
          </div>
        </div>

        {/* --- BOTTOM ROW: Expanded Filters --- */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border animate-in slide-in-from-top-2">
            {/* 1. Nationality Filter */}
            <FilterDropdown
              isActive={!!params.nationality}
              onClear={() => handleChange("nationality", undefined)}
              label={
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span className="truncate text-xs">
                    {params.nationality
                      ? `Quốc gia: ${params.nationality}`
                      : "Chọn quốc gia"}
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
                  <span className="truncate text-xs">
                    {params.genreId ? "Genre đã chọn" : "Chọn thể loại"}
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
              <SelectTrigger className="w-full h-10 bg-background">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <LayoutGrid className="w-4 h-4" />
                  <span className="text-foreground truncate">
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
              <SelectTrigger className="w-full h-10 bg-background">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                  <span className="text-foreground truncate">
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
