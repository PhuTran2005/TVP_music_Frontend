import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  ListFilter,
  RotateCcw,
  Check,
  ArrowUpDown,
  TrendingUp,
  FolderTree,
  LayoutGrid,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Shadcn Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GenreFilterParams } from "@/features/genre/types";

interface GenreFiltersProps {
  params: GenreFilterParams;
  setParams: React.Dispatch<React.SetStateAction<GenreFilterParams>>;
}

const SORT_OPTIONS = [
  { label: "Mặc định (Priority)", value: "priority" },
  { label: "Phổ biến nhất", value: "popular" },
  { label: "Tên A-Z", value: "a-z" },
  { label: "Mới nhất", value: "newest" },
] as const;

export const GenreFilters: React.FC<GenreFiltersProps> = ({
  params,
  setParams,
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
    (key: keyof GenreFilterParams, value: any) => {
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
      sort: "priority",
      status: undefined,
      parentId: undefined,
      isTrending: undefined,
    }));
  };

  // Check xem có đang filter không
  const hasFilter = useMemo(() => {
    return !!(
      params.keyword ||
      params.status ||
      params.parentId ||
      params.isTrending !== undefined ||
      (params.sort && params.sort !== "priority")
    );
  }, [params]);

  return (
    <div className="w-full bg-card border rounded-xl shadow-sm mb-6 animate-in fade-in duration-500">
      <div className="p-4 space-y-4">
        {/* --- TOP ROW: Search & Main Actions --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search Bar */}
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm kiếm thể loại..."
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
              value={params.sort || "priority"}
              onValueChange={(val) => handleChange("sort", val)}
            >
              <SelectTrigger className="w-[160px] h-9 text-xs bg-background">
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
            {/* 1. Trạng thái (Status) */}
            <Select
              value={params.status || "all"}
              onValueChange={(val) =>
                handleChange("status", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Eye className="w-4 h-4" />
                  <span className="text-foreground truncate uppercase text-[11px] font-bold">
                    {params.status
                      ? `Trạng thái: ${params.status}`
                      : "Trạng thái: Tất cả"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm ẩn</SelectItem>
              </SelectContent>
            </Select>

            {/* 2. Cấp bậc (Hierarchy) */}
            <Select
              value={params.parentId || "all"}
              onValueChange={(val) =>
                handleChange("parentId", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <FolderTree className="w-4 h-4" />
                  <span className="text-foreground truncate uppercase text-[11px] font-bold">
                    {params.parentId === "root"
                      ? "Cấp bậc: Gốc (Root)"
                      : params.parentId
                      ? "Cấp bậc: Thể loại con"
                      : "Cấp bậc: Tất cả"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả cấp bậc</SelectItem>
                <SelectItem value="root">Chỉ thể loại gốc</SelectItem>
              </SelectContent>
            </Select>

            {/* 3. Xu hướng (Trending) */}
            <Select
              value={
                params.isTrending === undefined
                  ? "all"
                  : String(params.isTrending)
              }
              onValueChange={(val) => {
                const value = val === "all" ? undefined : val === "true";
                handleChange("isTrending", value);
              }}
            >
              <SelectTrigger className="w-full h-10 bg-background">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-foreground truncate uppercase text-[11px] font-bold">
                    {params.isTrending === undefined
                      ? "Xu hướng: Tất cả"
                      : "Chỉ mục thịnh hành"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="true">Đang thịnh hành</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenreFilters;
