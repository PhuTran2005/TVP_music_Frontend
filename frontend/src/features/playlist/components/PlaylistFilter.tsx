import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  X,
  Globe,
  Eye,
  SlidersHorizontal,
  ListFilter,
  ChevronDown,
  LayoutTemplate,
  Trash2,
  Lock,
  Link,
  Server,
  User,
} from "lucide-react";
import { type PlaylistFilterParams } from "@/features/playlist/types";
import { useDebounce } from "@/hooks/useDebounce";

// Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

  onSearch: (keyword: string) => void;
  onFilterChange: (key: keyof PlaylistFilterParams, value: any) => void;
  onReset: () => void;
}

const PlaylistFilter: React.FC<PlaylistFilterProps> = ({
  params,
  onSearch,
  onFilterChange,
  onReset,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  // --- 1. Search Logic (Debounce) ---
  const [localSearch, setLocalSearch] = useState(params.keyword || "");
  const debouncedSearch = useDebounce(localSearch, 400);

  // Sync URL -> Input
  useEffect(() => {
    setLocalSearch(params.keyword || "");
  }, [params.keyword]);

  // Sync Input -> URL (API)
  useEffect(() => {
    if (debouncedSearch !== (params.keyword || "")) {
      onSearch(debouncedSearch);
    }
  }, [debouncedSearch, params.keyword, onSearch]);

  const handleClearSearch = () => {
    setLocalSearch("");
    // Không gọi onSearch("") ở đây để tránh race condition với debounce
  };

  // --- 2. Active Count Calculation ---
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (params.isSystem !== undefined) count++;
    if (params.visibility && params.visibility !== "all") count++;
    // Nếu có thêm filter khác (ví dụ type) thì thêm vào đây
    return count;
  }, [params]);

  const removeFilter = (key: keyof PlaylistFilterParams) => {
    onFilterChange(key, undefined);
  };

  return (
    <div className="w-full mb-8">
      {/* CONTAINER CHÍNH: Block Design & High Contrast */}
      <div className="bg-card border border-border rounded-xl shadow-sm transition-all overflow-hidden">
        {/* --- HEADER: SEARCH & ACTIONS --- */}
        <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card">
          {/* 1. Search Input */}
          <div className="relative w-full md:flex-1 md:max-w-xl group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="size-4" />
            </div>
            <Input
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search playlists..."
              // Input nền background nổi trên nền card
              className="pl-9 pr-9 h-10 bg-background border-input shadow-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all"
            />
            {localSearch && (
              <button
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
                <SelectItem value="popular">Popularity</SelectItem>
                <SelectItem value="followers">Followers</SelectItem>
                <SelectItem value="name">A-Z</SelectItem>
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
                <span className="font-medium hidden md:flex">Filter</span>
              </div>

              <div className="flex items-center gap-1">
                {activeFiltersCount > 0 && (
                  <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
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

        {/* --- EXPANDABLE PANEL --- */}
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-300 ease-in-out border-t border-transparent",
            isExpanded ? "grid-rows-[1fr] border-border" : "grid-rows-[0fr]",
          )}
        >
          <div className="overflow-hidden bg-muted/30">
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filter 1: Source (System/User) - Admin Only */}
              {user?.role === "admin" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground/80 tracking-widest flex items-center gap-1.5 ml-1">
                    <LayoutTemplate className="size-3" /> Source
                  </label>
                  <Select
                    value={
                      params.isSystem === undefined
                        ? "all"
                        : String(params.isSystem)
                    }
                    onValueChange={(val) => {
                      const value = val === "all" ? undefined : val === "true";
                      onFilterChange("isSystem", value);
                    }}
                  >
                    <SelectTrigger className="w-full bg-background h-9 text-sm shadow-sm focus:ring-1">
                      <SelectValue placeholder="All Sources" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      <SelectItem value="true">System Only</SelectItem>
                      <SelectItem value="false">User Created</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Filter 2: Visibility */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-muted-foreground/80 tracking-widest flex items-center gap-1.5 ml-1">
                  <Eye className="size-3" /> Visibility
                </label>
                <Select
                  value={params.visibility || "all"}
                  onValueChange={(val) =>
                    onFilterChange(
                      "visibility",
                      val === "all" ? undefined : val,
                    )
                  }
                >
                  <SelectTrigger className="w-full bg-background h-9 text-sm shadow-sm focus:ring-1">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="unlisted">Unlisted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Add more filters here later (e.g., Tags) */}
            </div>
          </div>
        </div>

        {/* --- ACTIVE TAGS (Footer) --- */}
        {activeFiltersCount > 0 && (
          <div className="p-3 bg-muted/20 border-t border-border flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1">
              Active:
            </span>

            {/* Source Tag */}
            {params.isSystem !== undefined && (
              <Badge
                variant="secondary"
                className="h-7 pl-2 pr-1 gap-1.5 bg-background border border-border text-foreground hover:bg-accent transition-colors cursor-default font-normal shadow-sm"
              >
                {params.isSystem ? (
                  <Server className="size-3 text-blue-500" />
                ) : (
                  <User className="size-3 text-purple-500" />
                )}
                <span className="text-muted-foreground">Source:</span>
                <span className="font-medium text-foreground">
                  {params.isSystem ? "System" : "User"}
                </span>
                <button
                  onClick={() => removeFilter("isSystem")}
                  className="ml-1 p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

            {/* Visibility Tag */}
            {params.visibility && params.visibility !== "all" && (
              <Badge
                variant="secondary"
                className="h-7 pl-2 pr-1 gap-1.5 bg-background border border-border text-foreground hover:bg-accent transition-colors cursor-default font-normal shadow-sm"
              >
                {params.visibility === "public" ? (
                  <Globe className="size-3 text-emerald-500" />
                ) : params.visibility === "private" ? (
                  <Lock className="size-3 text-orange-500" />
                ) : (
                  <Link className="size-3 text-blue-500" />
                )}
                <span className="text-muted-foreground">Vis:</span>
                <span className="font-medium text-foreground capitalize">
                  {params.visibility}
                </span>
                <button
                  onClick={() => removeFilter("visibility")}
                  className="ml-1 p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            )}

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

export default PlaylistFilter;
