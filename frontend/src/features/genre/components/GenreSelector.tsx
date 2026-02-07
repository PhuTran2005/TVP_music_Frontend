import React, { useState, useMemo } from "react";
import { Search, Check, X, CornerDownRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGenres } from "@/features/genre/hooks/useGenreAdmin";
import type { Genre } from "@/features/genre/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface GenreSelectorProps {
  label?: string;
  required?: boolean;
  error?: string;
  value: string[] | undefined;
  onChange: (ids: string[]) => void;
  singleSelect?: boolean;
  excludeIds?: string[];
  className?: string;
}

type GenreDisplay = Genre & {
  level: number;
  isDisabled: boolean;
  pathName: string;
};

export const GenreSelector: React.FC<GenreSelectorProps> = ({
  label,
  required,
  error,
  value = [],
  onChange,
  singleSelect = false,
  excludeIds = [],
  className,
}) => {
  const [filter, setFilter] = useState("");
  const { data: genreRes, isLoading } = useGenres({
    page: 1,
    limit: 1000,
    sort: "name",
  });

  const rawGenres = useMemo(() => genreRes?.data?.data || [], [genreRes]);

  // Logic Tree Data
  const treeData = useMemo(() => {
    if (!rawGenres.length) return [];
    const childrenMap = new Map<string, Genre[]>();
    rawGenres.forEach((g) => {
      const pId = g.parentId
        ? typeof g.parentId === "object"
          ? (g.parentId as any)._id
          : g.parentId
        : "root";
      if (!childrenMap.has(pId)) childrenMap.set(pId, []);
      childrenMap.get(pId)?.push(g);
    });

    const result: GenreDisplay[] = [];
    const traverse = (
      pId: string,
      level: number,
      parentDisabled: boolean,
      pathPrefix: string
    ) => {
      const kids = childrenMap.get(pId);
      if (!kids) return;
      kids
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((kid) => {
          const isSelfExcluded = excludeIds.includes(kid._id);
          const shouldDisable = parentDisabled || isSelfExcluded;
          const currentPath = pathPrefix
            ? `${pathPrefix} > ${kid.name}`
            : kid.name;
          result.push({
            ...kid,
            level,
            isDisabled: shouldDisable,
            pathName: currentPath,
          });
          traverse(kid._id, level + 1, shouldDisable, currentPath);
        });
    };
    traverse("root", 0, false, "");
    return result;
  }, [rawGenres, excludeIds]);

  const displayGenres = useMemo(() => {
    if (!filter) return treeData;
    return treeData
      .filter((g) => g.name.toLowerCase().includes(filter.toLowerCase()))
      .map((g) => ({ ...g, level: 0 }));
  }, [treeData, filter]);

  const toggleGenre = (id: string) => {
    const currentValues = Array.isArray(value) ? value : [];
    const isAlreadySelected = currentValues.includes(id);
    if (singleSelect) {
      onChange(isAlreadySelected ? [] : [id]);
      return;
    }
    onChange(
      isAlreadySelected
        ? currentValues.filter((gId) => gId !== id)
        : [...currentValues, id]
    );
  };

  return (
    <div className={cn("space-y-3 w-full", className)}>
      {/* --- LABEL --- */}
      {label && (
        <Label className="text-xs font-bold uppercase text-foreground/80 tracking-wider flex items-center gap-1.5 ml-0.5">
          {label}{" "}
          {required && <span className="text-destructive text-sm">*</span>}
        </Label>
      )}

      {/* Search Input Container */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Lọc thể loại..."
          // Thay đổi: Nền rõ hơn (bg-background), viền rõ hơn (border-input)
          className={cn(
            "pl-9 h-10 text-sm bg-background border-input shadow-sm rounded-lg focus-visible:ring-2 focus-visible:ring-primary/20 transition-all",
            error && "border-destructive focus-visible:ring-destructive/20"
          )}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* List container */}
      {/* Thay đổi: Viền đậm hơn, bỏ nền xám mờ để tăng tương phản chữ */}
      <div className="max-h-60 overflow-y-auto custom-scrollbar border border-border shadow-sm rounded-lg bg-background overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12 text-sm text-muted-foreground gap-2">
            <Loader2 className="size-4 animate-spin text-primary" /> Đang tải...
          </div>
        ) : displayGenres.length > 0 ? (
          <div className="p-1.5 space-y-0.5">
            {displayGenres.map((g) => {
              const isSelected = Array.isArray(value) && value.includes(g._id);
              return (
                <div
                  key={g._id}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2.5 text-sm transition-all rounded-md select-none border border-transparent",
                    g.isDisabled
                      ? "opacity-40 cursor-not-allowed bg-muted/50"
                      : "cursor-pointer hover:bg-accent hover:text-accent-foreground",
                    // Thay đổi: Trạng thái Active đậm hơn, có border nhẹ
                    isSelected &&
                      !g.isDisabled &&
                      "bg-primary/15 text-primary font-semibold border-primary/20 shadow-sm"
                  )}
                  style={{
                    paddingLeft: !filter ? `${12 + g.level * 20}px` : "12px",
                  }}
                  onClick={() => !g.isDisabled && toggleGenre(g._id)}
                >
                  {/* Tree Lines Icon */}
                  {!filter && g.level > 0 && (
                    <CornerDownRight
                      // Thay đổi: Màu icon đậm hơn để dễ nhìn cấu trúc
                      className="size-3.5 text-muted-foreground/70 shrink-0"
                    />
                  )}

                  <span className="flex-1 truncate leading-none">{g.name}</span>

                  {isSelected && (
                    <Check className="size-4 stroke-[3] text-primary" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-xs font-bold text-muted-foreground/70 uppercase tracking-widest">
            Không tìm thấy kết quả
          </div>
        )}
      </div>

      {/* Tags for Multi-select */}
      {!singleSelect && value.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {value.map((id) => {
            const g = rawGenres.find((item) => item._id === id);
            if (!g) return null;
            return (
              <Badge
                key={id}
                variant="secondary"
                // Thay đổi: Badge rõ ràng hơn với viền và nền tách biệt
                className="h-7 pl-2.5 pr-1.5 bg-secondary text-secondary-foreground border border-border/50 text-[11px] font-bold uppercase rounded-md shadow-sm hover:bg-secondary/80 transition-colors"
              >
                {g.name}
                <div
                  className="ml-1.5 p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors"
                  onClick={() => toggleGenre(id)}
                >
                  <X className="size-3" />
                </div>
              </Badge>
            );
          })}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 text-destructive animate-in slide-in-from-left-1">
          <span className="text-[11px] font-bold">{error}</span>
        </div>
      )}
    </div>
  );
};
