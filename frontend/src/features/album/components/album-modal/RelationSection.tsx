import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { GenreSelector } from "@/features/genre/components/GenreSelector";
import { ArtistSelector } from "@/features/artist/components/ArtistSelector";
import type { AlbumFormValues } from "@/features/album/schemas/album.schema";

interface RelationSectionProps {
  form: UseFormReturn<AlbumFormValues>;
}

const RelationSection: React.FC<RelationSectionProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-[13px] font-bold uppercase tracking-widest text-foreground">
          Liên kết
        </h4>
      </div>

      <div className="space-y-1">
        <Controller
          name="artist"
          control={form.control}
          render={({ field, fieldState }) => (
            <ArtistSelector
              label="Nghệ sĩ trình bày"
              required
              singleSelect
              value={field.value ? [field.value] : []}
              onChange={(ids) => {
                field.onChange(ids[0] || "");
                // THÊM DÒNG NÀY ĐỂ ÉP DIRTY:
                form.setValue("artist", ids[0] || "", { shouldDirty: true });
              }}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="space-y-1">
        <Controller
          control={form.control}
          name="genreIds"
          render={({ field, fieldState }) => (
            <GenreSelector
              label="Thể loại âm nhạc"
              required
              variant="form"
              singleSelect={false}
              value={field.value || []}
              onChange={(ids) => {
                field.onChange(ids);
                // THÊM DÒNG NÀY ĐỂ ÉP DIRTY:
                form.setValue("genreIds", ids, { shouldDirty: true });
              }}
              error={fieldState.error?.message}
              placeholder="Tìm thể loại..."
            />
          )}
        />
      </div>
    </div>
  );
};

export default RelationSection;
