import React, { useState, useMemo } from "react";
import { Search, Disc, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAlbumAdmin } from "@/features/album/hooks/useAlbumAdmin";
import type { Album } from "@/features/album/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AlbumSelectorProps {
  value: string;
  onChange: (id: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

export const AlbumSelector: React.FC<AlbumSelectorProps> = ({
  value,
  onChange,
  label = "Album",
  error,
  required,
}) => {
  const [filter, setFilter] = useState("");
  const { albums, isLoading } = useAlbumAdmin(100);

  const filteredAlbums = useMemo(() => {
    if (!filter) return albums;
    return albums.filter((album: Album) =>
      album.title.toLowerCase().includes(filter.toLowerCase())
    );
  }, [albums, filter]);

  const selectedAlbum = useMemo(() => {
    return albums.find((a: Album) => a._id === value);
  }, [albums, value]);

  const handleToggle = (id: string) => {
    onChange(value === id ? "" : id);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center">
        <label
          className={cn(
            "text-xs font-bold uppercase flex gap-1.5 items-center",
            error ? "text-destructive" : "text-muted-foreground"
          )}
        >
          <Disc className="size-3.5" /> {label}{" "}
          {required && <span className="text-destructive">*</span>}
        </label>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="h-6 px-2 text-[10px] bg-primary/10 text-primary hover:text-destructive hover:bg-destructive/10 gap-1"
          >
            {selectedAlbum?.title || "ID: " + value.slice(-4)}
            <X className="size-3" />
          </Button>
        )}
      </div>

      <div
        className={cn(
          "p-3 border rounded-xl bg-card/50 space-y-3",
          error && "border-destructive/50 ring-1 ring-destructive/20"
        )}
      >
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Search albums..."
            className="pl-9 h-9 text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
          {filter && (
            <button
              type="button"
              onClick={() => setFilter("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="max-h-48 overflow-y-auto custom-scrollbar pr-1">
          {isLoading ? (
            <div className="py-4 flex justify-center">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : filteredAlbums.length > 0 ? (
            <div className="space-y-1">
              {filteredAlbums.map((album: Album) => {
                const isSelected = value === album._id;
                return (
                  <div
                    key={album._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(album._id);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg cursor-pointer border transition-all",
                      isSelected
                        ? "bg-accent text-accent-foreground border-primary/50 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-muted"
                    )}
                  >
                    <div className="size-8 rounded-md overflow-hidden bg-muted shrink-0 border border-border">
                      <img
                        src={album.coverImage || "/images/default-album.png"}
                        alt={album.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">
                        {album.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {album.artist?.name || "Unknown"}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="size-4 text-primary shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-muted-foreground">
              No albums found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
