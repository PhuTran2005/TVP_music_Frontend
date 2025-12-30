import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { ArtistFormValues } from "@/features/artist/schemas/artist.schema";
import type { Artist } from "@/features/artist/types";
import { UserSelector } from "@/features/user/components/UserSelector";
import { GenreSelector } from "@/features/genre/components/GenreSelector";
import { TagInput } from "@/components/ui/tag-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Languages, UserCircle2, AlignLeft, Fingerprint } from "lucide-react";
import { NationalitySelector } from "@/components/ui/NationalitySelector";

interface InfoSectionProps {
  form: UseFormReturn<ArtistFormValues>;
  artistToEdit?: Artist | null;
}

const InfoSection: React.FC<InfoSectionProps> = ({ form, artistToEdit }) => {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <Label
            htmlFor="name"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"
          >
            <UserCircle2 className="size-3.5" /> Tên Nghệ sĩ{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="VD: Sơn Tùng M-TP"
            className={cn(
              errors.name && "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.name && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>
        {/* Nationality */}
        <div className="space-y-2">
          <Label
            htmlFor="nationality"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"
          >
            <Languages className="size-3.5" /> Quốc tịch
          </Label>
          <Controller
            name="nationality"
            control={form.control}
            render={({ field }) => (
              <NationalitySelector
                autoDetect={!artistToEdit} // Chỉ auto-detect khi tạo mới
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        {/* Aliases */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Fingerprint className="size-3.5" /> Tên gọi khác (Aliases)
          </Label>
          <Controller
            name="aliases"
            control={control}
            render={({ field }) => (
              <TagInput
                value={field.value || []}
                onChange={field.onChange}
                placeholder="VD: MTP, Sky..."
              />
            )}
          />
        </div>
        <div className="space-y-2 relative z-[20]">
          {" "}
          {/* Đặt z-index cao cho container của UserSelector */}
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <UserCircle2 className="size-3.5" /> Liên kết tài khoản
          </Label>
          <Controller
            name="userId"
            control={control}
            render={({ field, fieldState }) => (
              <UserSelector
                value={field.value}
                onChange={field.onChange}
                error={fieldState.error?.message}
                initialUsers={artistToEdit?.user}
              />
            )}
          />
        </div>
      </div>

      {/* Genres */}
      <Controller
        name="genreIds"
        control={control}
        render={({ field, fieldState }) => (
          <GenreSelector
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
            required
          />
        )}
      />

      {/* Bio */}
      <div className="space-y-2">
        <Label
          htmlFor="bio"
          className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"
        >
          <AlignLeft className="size-3.5" /> Tiểu sử
        </Label>
        <Textarea
          id="bio"
          {...register("bio")}
          rows={4}
          className="resize-none"
          placeholder="Giới thiệu về hành trình âm nhạc của nghệ sĩ..."
        />
      </div>
    </div>
  );
};

export default InfoSection;
