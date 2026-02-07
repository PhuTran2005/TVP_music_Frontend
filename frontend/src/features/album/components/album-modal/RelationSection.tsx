import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { GenreSelector } from "@/features/genre/components/GenreSelector";
import { ArtistSelector } from "@/features/artist/components/ArtistSelector";
import type { AlbumFormValues } from "@/features/album/schemas/album.schema";

interface RelationSectionProps {
  form: UseFormReturn<AlbumFormValues>;
}

const RelationSection: React.FC<RelationSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      {/* 1. Artist Selector */}
      <div className="space-y-2">
        <Label>
          Main Artist <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="artist"
          control={form.control}
          render={({ field, fieldState }) => (
            <ArtistSelector
              singleSelect
              // Component Selector thường trả về mảng ID, nhưng schema lưu 1 string ID
              value={field.value ? [field.value] : []}
              onChange={(ids) => field.onChange(ids[0] || "")}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="h-px bg-border/50" />

      {/* 2. Genre Selector */}
      <div className="space-y-2">
        <Label>
          Genres <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="genreIds"
          control={form.control}
          render={({ field, fieldState }) => (
            <GenreSelector
              value={field.value} // Schema là mảng string []
              onChange={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>
    </div>
  );
};

export default RelationSection;
