import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { AlbumFormValues } from "@/features/album/schemas/album.schema";
import { GenreSelector } from "@/features/genre/components/GenreSelector";
import { ArtistSelector } from "@/features/artist/components/ArtistSelector";
import { Label } from "@/components/ui/label";

interface RelationSectionProps {
  form: UseFormReturn<AlbumFormValues>;
}

const RelationSection: React.FC<RelationSectionProps> = ({ form }) => {
  return (
    <div className="space-y-5">
      {/* 1. Artist */}
      <div className="space-y-2">
        <Label>
          Main Artist <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="artist" // Sử dụng đúng tên field trong schema (thường là artistId cho ID)
          control={form.control}
          render={({ field, fieldState }) => (
            <ArtistSelector
              singleSelect={true}
              value={field.value ? [field.value] : []}
              onChange={(ids) => field.onChange(ids[0] || "")}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="h-px bg-border/50" />

      {/* 2. Genre */}
      <div className="space-y-2">
        <Label>
          Genres <span className="text-destructive">*</span>
        </Label>
        <Controller
          name="genreIds"
          control={form.control}
          render={({ field, fieldState }) => (
            <GenreSelector
              value={field.value}
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
