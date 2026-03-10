import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Globe, Lock, AlertCircle } from "lucide-react";
import { type AlbumFormValues } from "@/features/album/schemas/album.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface GeneralInfoSectionProps {
  form: UseFormReturn<AlbumFormValues>;
}

const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const themeColor = watch("themeColor");
  const isPublic = watch("isPublic");

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-[13px] font-bold uppercase tracking-widest text-foreground">
          Thông tin chung
        </h4>
        <p className="text-[13px] text-muted-foreground mt-1">
          Các thông tin cơ bản sẽ hiển thị cho người nghe.
        </p>
      </div>

      {/* Tiêu đề */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Tên Đĩa Nhạc <span className="text-destructive">*</span>
        </Label>
        <Input
          {...register("title")}
          placeholder="VD: Midnight Memories..."
          className={cn(
            "h-11 rounded-md bg-transparent border-input focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-base font-medium",
            errors.title && "border-destructive focus-visible:ring-destructive",
          )}
        />
        {errors.title && (
          <p className="text-[12px] text-destructive font-medium flex items-center gap-1.5">
            <AlertCircle className="size-3.5" /> {errors.title.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Phân loại
          </Label>
          <select
            {...register("type")}
            className="flex h-11 w-full items-center justify-between rounded-md border border-input bg-accent px-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
          >
            <option value="album">Album (Đĩa nhạc)</option>
            <option value="single">Single (Đĩa đơn)</option>
            <option value="ep">EP (Đĩa mở rộng)</option>
            <option value="compilation">Compilation (Tuyển tập)</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Ngày phát hành
          </Label>
          <Input
            type="date"
            {...register("releaseDate")}
            className={cn(
              "h-11 rounded-md bg-transparent border-input font-medium",
              errors.releaseDate && "border-destructive",
            )}
          />
          {errors.releaseDate && (
            <p className="text-[12px] text-destructive font-medium flex items-center gap-1.5">
              <AlertCircle className="size-3.5" /> {errors.releaseDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Trạng thái hiển thị
          </Label>
          <div
            onClick={() =>
              setValue("isPublic", !isPublic, { shouldDirty: true })
            }
            className="flex items-center justify-between px-3 h-11 rounded-md border border-input bg-transparent cursor-pointer transition-colors hover:bg-muted/30"
          >
            <div className="flex items-center gap-2">
              {isPublic ? (
                <Globe className="size-4 text-emerald-500" />
              ) : (
                <Lock className="size-4 text-muted-foreground" />
              )}
              <span className="text-sm font-semibold text-foreground">
                {isPublic ? "Công khai" : "Riêng tư"}
              </span>
            </div>
            {/* Toggle Pro */}
            <div
              className={cn(
                "w-9 h-5 rounded-full relative transition-colors duration-200",
                isPublic ? "bg-primary" : "bg-muted-foreground/30",
              )}
            >
              <div
                className={cn(
                  "absolute top-[2px] w-4 h-4 bg-background rounded-full transition-all duration-200 shadow-sm",
                  isPublic ? "left-[18px]" : "left-[2px]",
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Màu chủ đạo (Theme HEX)
          </Label>
          <div className="flex gap-2">
            <div
              className="size-11 rounded-md border border-border shrink-0"
              style={{ backgroundColor: themeColor || "#000000" }}
            />
            <div className="flex-1 relative">
              <Input
                type="color"
                {...register("themeColor")}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Input
                value={themeColor}
                readOnly
                className="h-11 rounded-md font-mono text-sm uppercase bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Mô tả chi tiết
        </Label>
        <Textarea
          {...register("description")}
          rows={5}
          placeholder="Viết một đoạn ngắn giới thiệu về album..."
          className={cn(
            "resize-none rounded-md p-3 bg-transparent border-input focus-visible:ring-1 focus-visible:ring-primary text-sm",
            errors.description && "border-destructive",
          )}
        />
      </div>
    </div>
  );
};

export default GeneralInfoSection;
