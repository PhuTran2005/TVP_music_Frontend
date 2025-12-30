import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  X,
  Globe,
  LayoutGrid,
  Eye,
  ArrowUpDown,
  RotateCcw,
} from "lucide-react";
import { type PlaylistFilterParams } from "../types";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Shadcn Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/store/store";

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

  // Check xem có đang filter không (để hiện nút Xóa lọc)
  const hasFilter = useMemo(() => {
    return !!(
      params.isSystem !== undefined ||
      (params.visibility && params.visibility !== "all") ||
      (params.sort && params.sort !== "newest") ||
      params.keyword
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
              placeholder="Tìm kiếm playlist theo tên..."
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
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="popular">Lượt nghe</SelectItem>
                <SelectItem value="followers">Người theo dõi</SelectItem>
                <SelectItem value="name">Tên A-Z</SelectItem>
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
                <span className="hidden sm:inline">Làm mới</span>
              </Button>
            )}
          </div>
        </div>

        {/* --- BOTTOM ROW: Expanded Filters --- */}

        {showFilters && user?.role === "admin" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border animate-in slide-in-from-top-2">
            {/* 1. Nguồn gốc (isSystem) */}
            <Select
              value={
                params.isSystem === undefined ? "all" : String(params.isSystem)
              }
              onValueChange={(val) => {
                const value = val === "all" ? undefined : val === "true";
                handleChange("isSystem", value);
              }}
            >
              <SelectTrigger className="w-full h-10 bg-background">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Globe className="w-4 h-4" />
                  <span className="text-foreground truncate">
                    {params.isSystem === undefined
                      ? "Nguồn: Tất cả"
                      : params.isSystem
                      ? "Playlist Hệ thống"
                      : "Playlist Người dùng"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nguồn</SelectItem>
                <SelectItem value="true">Hệ thống</SelectItem>
                <SelectItem value="false">Người dùng</SelectItem>
              </SelectContent>
            </Select>

            {/* 2. Chế độ hiển thị (Visibility) */}
            <Select
              value={params.visibility || "all"}
              onValueChange={(val) =>
                handleChange("visibility", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Eye className="w-4 h-4" />
                  <span className="text-foreground truncate uppercase text-[11px] font-bold">
                    {params.visibility
                      ? `Visibility: ${params.visibility}`
                      : "Hiển thị: Tất cả"}
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
