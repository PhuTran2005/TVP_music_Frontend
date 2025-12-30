import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Calendar, Globe, Lock, Disc, AlignLeft, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlbumFormValues } from "@/features/album/schemas/album.schema";

// Giả định bạn đã có các component UI từ shadcn
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface InfoSectionProps {
  form: UseFormReturn<AlbumFormValues>;
}

const InfoSection: React.FC<InfoSectionProps> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const isPublic = watch("isPublic");

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Row 1: Title & Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-2">
          <Label
            htmlFor="title"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"
          >
            <Disc className="w-3.5 h-3.5" /> Tên Album
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="VD: Chúng ta của hiện tại"
            className={cn(
              errors.title &&
                "border-destructive focus-visible:ring-destructive"
            )}
          />
          {errors.title && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.title.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="type"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            Phân loại
          </Label>
          <select
            {...register("type")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer"
          >
            <option value="album">Album</option>
            <option value="single">Single</option>
            <option value="ep">EP</option>
          </select>
        </div>
      </div>

      {/* Row 2: Release Date & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label
            htmlFor="releaseDate"
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"
          >
            <Calendar className="w-3.5 h-3.5" /> Ngày phát hành
          </Label>
          <Input
            id="releaseDate"
            type="date"
            {...register("releaseDate")}
            className="w-full"
          />
          {errors.releaseDate && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.releaseDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Chế độ hiển thị
          </Label>
          <button
            type="button"
            onClick={() =>
              setValue("isPublic", !isPublic, { shouldDirty: true })
            }
            className={cn(
              "flex items-center justify-between w-full h-10 px-4 rounded-md border transition-all duration-200 select-none group",
              isPublic
                ? "bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50"
                : "bg-orange-50/50 border-orange-200 hover:bg-orange-50"
            )}
          >
            <div className="flex items-center gap-2">
              {isPublic ? (
                <Globe className="w-4 h-4 text-emerald-600" />
              ) : (
                <Lock className="w-4 h-4 text-orange-600" />
              )}
              <span
                className={cn(
                  "text-sm font-semibold",
                  isPublic ? "text-emerald-700" : "text-orange-700"
                )}
              >
                {isPublic ? "Công khai" : "Riêng tư"}
              </span>
            </div>
            <div
              className={cn(
                "w-8 h-4 rounded-full relative transition-colors duration-300",
                isPublic ? "bg-emerald-500" : "bg-orange-400"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 shadow-sm",
                  isPublic ? "left-4.5" : "left-0.5"
                )}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Row 3: Description */}
      <div className="space-y-2">
        <Label
          htmlFor="description"
          className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"
        >
          <AlignLeft className="w-3.5 h-3.5" /> Mô tả album
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Chia sẻ câu chuyện đằng sau album này..."
          className="min-h-[120px] bg-background/50 focus:bg-background transition-all resize-none"
        />
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Info className="w-3 h-3" />
          <span className="text-[11px]">
            Thông tin này sẽ hiển thị ở trang chi tiết album.
          </span>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;
