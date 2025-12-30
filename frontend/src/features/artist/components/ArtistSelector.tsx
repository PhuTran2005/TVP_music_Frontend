import React, { useState, useMemo } from "react";
import { Search, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Artist } from "@/features/artist/types";
import { useAdminArtists } from "@/features/artist/hooks";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitialsTextAvartar } from "@/utils/genTextAvartar";
import { Label } from "@/components/ui/label";

interface ArtistSelectorProps {
  label?: string;
  required?: boolean;
  error?: string;
  value: string[] | undefined;
  onChange: (ids: string[]) => void;
  singleSelect?: boolean;
  disabledIds?: string[];
  className?: string;
}

export const ArtistSelector: React.FC<ArtistSelectorProps> = ({
  label,
  required,
  error,
  value = [],
  onChange,
  singleSelect = false,
  disabledIds = [],
  className,
}) => {
  const [filter, setFilter] = useState("");
  const { data: artistRes, isLoading } = useAdminArtists({
    page: 1,
    limit: 50,
  });

  const artists = useMemo(() => artistRes?.data?.data || [], [artistRes]);

  const filteredArtists = useMemo(() => {
    let result = artists;
    if (filter) {
      result = result.filter((a: Artist) =>
        a.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return result;
  }, [artists, filter]);

  const toggleArtist = (id: string) => {
    if (disabledIds.includes(id)) return;
    if (singleSelect) {
      const isSelected = value?.includes(id);
      onChange(isSelected ? [] : [id]);
      return;
    }
    const current = Array.isArray(value) ? value : [];
    const newValues = current.includes(id)
      ? current.filter((aId) => aId !== id)
      : [...current, id];
    onChange(newValues);
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

      {/* --- SEARCH --- */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Tìm nghệ sĩ..."
          className={cn(
            "pl-9 h-10 text-sm bg-muted/20 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/40",
            error && "ring-1 ring-destructive/50"
          )}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        {filter && (
          <button
            type="button"
            onClick={() => setFilter("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* --- LIST --- */}
      <div className="max-h-48 overflow-y-auto custom-scrollbar pr-1 border border-border/50 rounded-xl bg-muted/5">
        {isLoading ? (
          <div className="space-y-3 p-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="size-8 rounded-full bg-muted" />
                <div className="h-3 w-24 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : filteredArtists.length > 0 ? (
          <div className="p-1 space-y-0.5">
            {filteredArtists.map((artist: Artist) => {
              const isSelected =
                Array.isArray(value) && value.includes(artist._id);
              const isDisabled = disabledIds.includes(artist._id);

              return (
                <div
                  key={artist._id}
                  onClick={() => !isDisabled && toggleArtist(artist._id)}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border border-transparent",
                    isSelected
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "hover:bg-muted/50",
                    isDisabled &&
                      "opacity-40 cursor-not-allowed grayscale pointer-events-none"
                  )}
                >
                  <Avatar className="size-7 border border-background shadow-sm">
                    <AvatarImage src={artist.avatar} alt={artist.name} />
                    <AvatarFallback className="text-[9px] font-bold bg-primary/5 text-primary">
                      {getInitialsTextAvartar(artist.name)}
                    </AvatarFallback>
                  </Avatar>

                  <span
                    className={cn(
                      "text-xs flex-1 truncate",
                      isSelected
                        ? "font-bold"
                        : "font-medium text-muted-foreground"
                    )}
                  >
                    {artist.name}
                  </span>

                  {isSelected && <Check className="size-3.5 stroke-3" />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-[11px] text-muted-foreground font-medium italic">
            Không có dữ liệu nghệ sĩ
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-[10px] text-destructive font-bold ml-1">{error}</p>
      )}
    </div>
  );
};
