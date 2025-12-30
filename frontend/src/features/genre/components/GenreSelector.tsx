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

  // Logic Tree Data (Giữ nguyên logic của bạn)
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
    <div className={cn("space-y-2.5 w-full", className)}>
      {/* --- LABEL --- */}
      {label && (
        <Label className="text-[11px] font-bold uppercase text-muted-foreground tracking-[0.15em] flex items-center gap-1.5 ml-0.5">
          {label}{" "}
          {required && <span className="text-destructive font-black">*</span>}
        </Label>
      )}

      {/* Search */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Lọc thể loại..."
          className={cn(
            "pl-9 h-10 text-sm bg-muted/20 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40",
            error && "ring-1 ring-destructive/50"
          )}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* List container */}
      <div className="max-h-52 overflow-y-auto custom-scrollbar border border-border/50 rounded-xl bg-muted/5 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-10 text-xs text-muted-foreground gap-2">
            <Loader2 className="size-3.5 animate-spin text-primary" /> Đang
            tải...
          </div>
        ) : displayGenres.length > 0 ? (
          <div className="p-1">
            {displayGenres.map((g) => {
              const isSelected = Array.isArray(value) && value.includes(g._id);
              return (
                <div
                  key={g._id}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-2 text-xs transition-all rounded-lg select-none mb-0.5",
                    g.isDisabled
                      ? "opacity-30 cursor-not-allowed grayscale pointer-events-none"
                      : "cursor-pointer hover:bg-muted/80",
                    isSelected &&
                      !g.isDisabled &&
                      "bg-primary/10 text-primary font-bold shadow-sm"
                  )}
                  style={{
                    paddingLeft: !filter ? `${12 + g.level * 18}px` : "12px",
                  }}
                  onClick={() => !g.isDisabled && toggleGenre(g._id)}
                >
                  {!filter && g.level > 0 && (
                    <CornerDownRight className="size-3 text-primary/40 shrink-0" />
                  )}
                  <span className="flex-1 truncate uppercase tracking-tight">
                    {g.name}
                  </span>
                  {isSelected && <Check className="size-3 stroke-[3]" />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center text-[10px] uppercase font-bold text-muted-foreground opacity-50">
            Trống
          </div>
        )}
      </div>

      {/* Tags for Multi-select */}
      {!singleSelect && value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {value.map((id) => {
            const g = rawGenres.find((item) => item._id === id);
            if (!g) return null;
            return (
              <Badge
                key={id}
                variant="secondary"
                className="h-6 px-2 bg-primary/5 text-primary border-primary/10 text-[10px] font-bold uppercase rounded-md"
              >
                {g.name}
                <X
                  className="size-2.5 ml-1.5 cursor-pointer hover:text-destructive transition-colors"
                  onClick={() => toggleGenre(id)}
                />
              </Badge>
            );
          })}
        </div>
      )}

      {error && (
        <p className="text-[10px] text-destructive font-bold ml-1">{error}</p>
      )}
    </div>
  );
};
