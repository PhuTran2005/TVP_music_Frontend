import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  RotateCcw,
  ArrowUpDown,
  TrendingUp,
  FolderTree,
  Eye,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  { label: "Tên A-Z", value: "name" },
  { label: "Mới nhất", value: "newest" },
] as const;

export const GenreFilters: React.FC<GenreFiltersProps> = ({
  params,
  setParams,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearch, setLocalSearch] = useState(params.keyword || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== params.keyword) {
        setParams((prev) => ({ ...prev, keyword: localSearch, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, params.keyword, setParams]);

  const handleChange = useCallback(
    (key: keyof GenreFilterParams, value: any) => {
      setParams((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    [setParams]
  );

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
    <div className="w-full bg-card border border-border rounded-xl shadow-sm mb-6">
      <div className="p-4 space-y-4">
        {/* --- TOP ROW --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search Bar - Viền rõ ràng */}
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm kiếm thể loại..."
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
              value={params.sort || "priority"}
              onValueChange={(val) => handleChange("sort", val)}
            >
              <SelectTrigger className="w-[180px] h-10 text-sm bg-background border-input shadow-sm font-medium">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                  <SelectValue placeholder="Sắp xếp" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="font-medium"
                  >
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
            {/* 1. Trạng thái */}
            <Select
              value={params.status || "all"}
              onValueChange={(val) =>
                handleChange("status", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-1 bg-muted rounded">
                    <Eye className="w-3.5 h-3.5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                    Trạng thái:
                  </span>
                  <span className="text-sm font-semibold text-foreground truncate">
                    {params.status === "active"
                      ? "Đang hoạt động"
                      : params.status === "inactive"
                      ? "Tạm ẩn"
                      : "Tất cả"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm ẩn</SelectItem>
              </SelectContent>
            </Select>

            {/* 2. Cấp bậc */}
            <Select
              value={params.parentId || "all"}
              onValueChange={(val) =>
                handleChange("parentId", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-1 bg-muted rounded">
                    <FolderTree className="w-3.5 h-3.5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                    Cấp bậc:
                  </span>
                  <span className="text-sm font-semibold text-foreground truncate">
                    {params.parentId === "root" ? "Gốc (Root)" : "Tất cả"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả cấp bậc</SelectItem>
                <SelectItem value="root">Chỉ thể loại gốc</SelectItem>
              </SelectContent>
            </Select>

            {/* 3. Xu hướng */}
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
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                <div className="flex items-center gap-2.5">
                  <div className="p-1 bg-muted rounded">
                    <TrendingUp className="w-3.5 h-3.5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                    Xu hướng:
                  </span>
                  <span className="text-sm font-semibold text-foreground truncate">
                    {params.isTrending === true ? "Đang thịnh hành" : "Tất cả"}
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
