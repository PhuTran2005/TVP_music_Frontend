import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  Globe,
  Eye,
  ArrowUpDown,
  RotateCcw,
  Filter,
} from "lucide-react";
import { type PlaylistFilterParams } from "../types";

// Components
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
import { useAppSelector } from "@/store/hooks";

interface PlaylistFilterProps {
  params: PlaylistFilterParams;
  setParams: React.Dispatch<React.SetStateAction<PlaylistFilterParams>>;
}

const PlaylistFilter: React.FC<PlaylistFilterProps> = ({
  params,
  setParams,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

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
    (key: keyof PlaylistFilterParams, value: any) => {
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
      isSystem: undefined,
      visibility: undefined,
    }));
  };

  // Check xem có đang filter không
  const hasFilter = useMemo(() => {
    return !!(
      params.isSystem !== undefined ||
      (params.visibility && params.visibility !== "all") ||
      (params.sort && params.sort !== "newest") ||
      params.keyword
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
              placeholder="Tìm kiếm playlist..."
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
                <SelectItem value="popular">Lượt nghe</SelectItem>
                <SelectItem value="followers">Người theo dõi</SelectItem>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border animate-in slide-in-from-top-2 duration-300">
            {/* 1. Nguồn gốc (isSystem) */}
            {user?.role === "admin" && (
              <Select
                value={
                  params.isSystem === undefined
                    ? "all"
                    : String(params.isSystem)
                }
                onValueChange={(val) => {
                  const value = val === "all" ? undefined : val === "true";
                  handleChange("isSystem", value);
                }}
              >
                <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                  <div className="flex items-center gap-2.5 text-sm">
                    <div className="p-1 bg-muted rounded">
                      <Globe className="w-3.5 h-3.5 text-foreground/70" />
                    </div>
                    <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                      Nguồn:
                    </span>
                    <span className="text-foreground truncate font-semibold">
                      {params.isSystem === undefined
                        ? "Tất cả"
                        : params.isSystem
                        ? "Hệ thống (System)"
                        : "Người dùng (User)"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả nguồn</SelectItem>
                  <SelectItem value="true">Hệ thống</SelectItem>
                  <SelectItem value="false">Người dùng</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* 2. Chế độ hiển thị (Visibility) */}
            <Select
              value={params.visibility || "all"}
              onValueChange={(val) =>
                handleChange("visibility", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background border-input shadow-sm">
                <div className="flex items-center gap-2.5 text-sm">
                  <div className="p-1 bg-muted rounded">
                    <Eye className="w-3.5 h-3.5 text-foreground/70" />
                  </div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wide mr-1">
                    Hiển thị:
                  </span>
                  <span className="text-foreground truncate font-semibold">
                    {params.visibility === "public"
                      ? "Công khai"
                      : params.visibility === "private"
                      ? "Riêng tư"
                      : params.visibility === "unlisted"
                      ? "Hạn chế"
                      : "Tất cả"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="public">Công khai (Public)</SelectItem>
                <SelectItem value="private">Riêng tư (Private)</SelectItem>
                <SelectItem value="unlisted">Hạn chế (Unlisted)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistFilter;
