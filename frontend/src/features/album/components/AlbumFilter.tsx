import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Music,
  Mic2,
  LayoutGrid,
  Eye,
  ArrowUpDown, // Thêm icon sort
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlbumFilterParams } from "@/features/album/types";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { YearPicker } from "@/components/ui/YearPicker";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { ArtistSelector } from "@/features/artist/components/ArtistSelector";
import { GenreSelector } from "@/features/genre/components/GenreSelector";

// Shadcn Select
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/store/store";

interface AlbumFilterProps {
  params: AlbumFilterParams;
  setParams: React.Dispatch<React.SetStateAction<AlbumFilterParams>>;
}

const AlbumFilter: React.FC<AlbumFilterProps> = ({ params, setParams }) => {
  const [showFilters, setShowFilters] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  // --- 1. Debounce Search Logic ---
  const [localSearch, setLocalSearch] = useState(params.keyword || "");

  useEffect(() => {
    // Chỉ setParams khi giá trị thực sự thay đổi sau 500ms
    const timer = setTimeout(() => {
      if (localSearch !== params.keyword) {
        setParams((prev) => ({ ...prev, keyword: localSearch, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, params.keyword, setParams]);

  // Helper change params
  const handleChange = (key: keyof AlbumFilterParams, value: any) => {
    setParams((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // 🔥 FIX 1: Reset chuẩn tất cả các trường về undefined
  const handleReset = () => {
    setLocalSearch("");
    setParams((prev) => ({
      ...prev, // Giữ các config khác nếu có
      page: 1,
      limit: prev.limit,

      // Reset về trạng thái mặc định
      keyword: "",
      sort: "newest",
      type: undefined, // Không để "all"
      isPublic: undefined,
      artistId: undefined,
      genreId: undefined,
      year: undefined,
    }));
  };

  // Check xem có đang filter không
  const hasFilter = !!(
    params.genreId ||
    params.artistId ||
    params.year ||
    params.type || // undefined là false
    params.isPublic !== undefined ||
    params.keyword
  );

  return (
    <div className="w-full bg-card border rounded-xl shadow-sm mb-6">
      <div className="p-4 space-y-4">
        {/* --- TOP ROW --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search Bar */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Tìm kiếm theo tên album..."
              className="pl-9 bg-background h-9 text-sm" // Chỉnh UI compact hơn
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch("")}
                className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 self-end md:self-auto w-full md:w-auto justify-end">
            {/* Sort Dropdown */}
            <Select
              value={params.sort || "newest"}
              onValueChange={(val) => handleChange("sort", val)}
            >
              <SelectTrigger className="w-[140px] h-9 text-xs bg-background">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Sắp xếp" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
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
                className="text-destructive hover:bg-destructive/10 h-9 px-2"
              >
                Xóa lọc
              </Button>
            )}
          </div>
        </div>

        {/* --- EXPANDED FILTERS --- */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-border animate-in slide-in-from-top-2">
            {/* 1. Status */}
            {user.role === "admin" && (
              <Select
                value={
                  params.isPublic === undefined
                    ? "all"
                    : String(params.isPublic)
                }
                onValueChange={(val) => {
                  const value = val === "all" ? undefined : val === "true";
                  handleChange("isPublic", value);
                }}
              >
                <SelectTrigger className="w-full h-10 bg-background">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Eye className="w-4 h-4" />
                    <span className="text-foreground truncate">
                      {params.isPublic === undefined
                        ? "Trạng thái: Tất cả"
                        : params.isPublic
                        ? "Công khai (Public)"
                        : "Riêng tư (Private)"}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="true">Công khai</SelectItem>
                  <SelectItem value="false">Riêng tư</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* 2. Type */}
            <Select
              value={params.type || "all"}
              onValueChange={(val) =>
                handleChange("type", val === "all" ? undefined : val)
              }
            >
              <SelectTrigger className="w-full h-10 bg-background">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <LayoutGrid className="w-4 h-4" />
                  <span className="text-foreground truncate">
                    {params.type
                      ? `Loại: ${params.type.toUpperCase()}`
                      : "Loại: Tất cả"}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="album">Album</SelectItem>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="ep">EP</SelectItem>
                <SelectItem value="compilation">Compilation</SelectItem>
              </SelectContent>
            </Select>

            {/* 3. Genre */}
            <FilterDropdown
              isActive={!!params.genreId}
              onClear={() => handleChange("genreId", undefined)}
              label={
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-primary" />
                  <span className="truncate">
                    {params.genreId ? "Genre đã chọn" : "Chọn thể loại"}
                  </span>
                </div>
              }
            >
              <GenreSelector
                singleSelect
                value={params.genreId ? [params.genreId] : []}
                onChange={(ids) => handleChange("genreId", ids[0])}
              />
            </FilterDropdown>

            {/* 4. Artist */}
            <FilterDropdown
              isActive={!!params.artistId}
              onClear={() => handleChange("artistId", undefined)}
              label={
                <div className="flex items-center gap-2">
                  <Mic2 className="w-4 h-4 text-indigo-500" />
                  <span className="truncate">
                    {params.artistId ? "Artist đã chọn" : "Chọn nghệ sĩ"}
                  </span>
                </div>
              }
            >
              <ArtistSelector
                singleSelect
                value={params.artistId ? [params.artistId] : []}
                onChange={(ids) => handleChange("artistId", ids[0])}
              />
            </FilterDropdown>

            {/* 5. Year */}
            <div className="col-span-full md:col-span-1">
              <YearPicker
                value={params.year}
                onChange={(val) => handleChange("year", val)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlbumFilter;
