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

  // Style chung cho Label để đồng bộ và dễ đọc
  const labelClass =
    "text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-2 mb-2";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Name */}
        <div className="space-y-1">
          <Label htmlFor="name" className={labelClass}>
            <UserCircle2 className="size-4 text-primary" /> Tên Nghệ sĩ{" "}
            <span className="text-destructive text-sm">*</span>
          </Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="VD: Sơn Tùng M-TP"
            className={cn(
              "h-10 bg-background border-input shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-semibold",
              errors.name &&
                "border-destructive focus-visible:ring-destructive/20 bg-destructive/5"
            )}
          />
          {errors.name && (
            <p className="text-[11px] font-bold text-destructive mt-1 animate-in slide-in-from-left-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Nationality */}
        <div className="space-y-1">
          <Label htmlFor="nationality" className={labelClass}>
            <Languages className="size-4 text-primary" /> Quốc tịch
          </Label>
          <div className="bg-background rounded-lg shadow-sm">
            <Controller
              name="nationality"
              control={form.control}
              render={({ field }) => (
                <NationalitySelector
                  autoDetect={!artistToEdit}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>

        {/* Aliases */}
        <div className="space-y-1">
          <Label className={labelClass}>
            <Fingerprint className="size-4 text-primary" /> Tên gọi khác
            (Aliases)
          </Label>
          <div className="bg-background rounded-lg shadow-sm">
            <Controller
              name="aliases"
              control={control}
              render={({ field }) => (
                <TagInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Nhập tên gọi khác..."
                  className="bg-background border-input min-h-[40px]"
                />
              )}
            />
          </div>
        </div>

        {/* Linked User */}
        <div className="space-y-1 relative z-[20]">
          <Label className={labelClass}>
            <UserCircle2 className="size-4 text-primary" /> Liên kết tài khoản
          </Label>
          <div className="bg-background rounded-lg shadow-sm">
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
      </div>

      {/* Genres */}
      <div className="space-y-1">
        <Label className={labelClass}>
          Thể loại chính <span className="text-destructive text-sm">*</span>
        </Label>
        <div className="bg-background rounded-lg shadow-sm p-1 border border-border">
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
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-1">
        <Label htmlFor="bio" className={labelClass}>
          <AlignLeft className="size-4 text-primary" /> Tiểu sử
        </Label>
        <Textarea
          id="bio"
          {...register("bio")}
          rows={5}
          className="resize-none bg-background border-input shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 text-sm leading-relaxed"
          placeholder="Giới thiệu về hành trình âm nhạc của nghệ sĩ..."
        />
      </div>
    </div>
  );
};

export default InfoSection;
