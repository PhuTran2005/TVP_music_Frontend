import React from "react";
import { Plus, X, AlertCircle } from "lucide-react"; // Đừng quên import AlertCircle
import { Button } from "@/components/ui/button";
import { ArtistFormValues } from "@/features/artist/schemas/artist.schema";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  form: UseFormReturn<ArtistFormValues>;
}

const GallerySection: React.FC<GallerySectionProps> = ({ form }) => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = form; // Lấy errors ra
  const images = watch("images") || [];
  const MAX_IMAGES = 10;

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > MAX_IMAGES) {
      alert(`Bạn chỉ được phép tải lên tối đa ${MAX_IMAGES} hình ảnh.`);
      return;
    }
    // Set value và kích hoạt trạng thái dirty, validate
    setValue("images", [...images, ...files], {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_: any, i: number) => i !== index);
    setValue("images", newImages, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      {/* Header & Counter */}
      <div className="flex items-end justify-between">
        <div>
          <h4 className="text-[13px] font-bold uppercase tracking-widest text-foreground">
            Thư viện ảnh (Gallery)
          </h4>
          <p className="text-[13px] text-muted-foreground mt-1">
            Hình ảnh bổ sung sẽ xuất hiện ở phần Slider trên trang chi tiết nghệ
            sĩ.
          </p>
        </div>
        <div
          className={cn(
            "text-[11px] font-bold px-3 py-1 rounded-md border",
            images.length === MAX_IMAGES
              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
              : images.length > 0
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-muted text-muted-foreground border-border",
          )}
        >
          {images.length} / {MAX_IMAGES}
        </div>
      </div>

      {/* Grid Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {images.map((img: any, index: number) => {
          const isFile = img instanceof File;
          const previewUrl = isFile ? URL.createObjectURL(img) : img;

          // Kiểm tra xem ảnh cụ thể này có bị lỗi không (Ví dụ ảnh thứ 2 bị quá 5MB)
          const imageError = errors.images?.[index];

          return (
            <div
              key={index}
              className={cn(
                "group relative aspect-square rounded-lg border bg-muted/10 overflow-hidden shadow-sm",
                imageError
                  ? "border-destructive bg-destructive/10"
                  : "border-border",
              )}
            >
              <img
                src={previewUrl}
                className={cn(
                  "w-full h-full object-cover",
                  imageError && "opacity-50",
                )}
                alt={`Gallery ${index}`}
                onLoad={() => isFile && URL.revokeObjectURL(previewUrl)}
              />

              {/* Lớp phủ mờ khi hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

              {/* Báo lỗi trực tiếp trên ảnh hỏng */}
              {imageError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center text-destructive-foreground bg-destructive/80 backdrop-blur-sm z-10">
                  <AlertCircle className="size-5 mb-1" />
                  <span className="text-[10px] font-bold leading-tight">
                    {imageError.message as string}
                  </span>
                </div>
              )}

              {/* Nút xóa */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 size-7 rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-md z-20"
                onClick={() => removeImage(index)}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          );
        })}

        {/* Khối thêm ảnh (Chỉ hiện khi chưa max giới hạn) */}
        {images.length < MAX_IMAGES && (
          <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/10 hover:bg-muted/30 hover:border-primary/50 transition-colors group">
            <div className="p-2.5 bg-background rounded-md shadow-sm border border-border mb-2 group-hover:text-primary transition-colors">
              <Plus className="size-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-[11px] font-bold uppercase text-muted-foreground group-hover:text-primary tracking-wide">
              Thêm ảnh
            </span>
            <input
              type="file"
              multiple
              className="hidden"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleAddImages}
            />
          </label>
        )}
      </div>

      {/* THÔNG BÁO LỖI TỔNG (Ví dụ: Mảng có hơn 10 ảnh) */}
      {errors.images?.message && typeof errors.images.message === "string" && (
        <p className="text-[12px] font-bold text-destructive mt-2 flex items-center gap-1.5 animate-in slide-in-from-top-1">
          <AlertCircle className="size-4" />
          {errors.images.message}
        </p>
      )}
    </div>
  );
};

export default GallerySection;
