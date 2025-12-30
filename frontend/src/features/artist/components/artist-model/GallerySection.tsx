import React from "react";
import { Plus, X, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArtistFormValues } from "@/features/artist/schemas/artist.schema";
import { UseFormReturn } from "react-hook-form";
interface GallerySectionProps {
  form: UseFormReturn<ArtistFormValues>;
}

const GallerySection: React.FC<GallerySectionProps> = ({ form }) => {
  const { watch, setValue } = form;
  const images = watch("images") || [];

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Giới hạn số lượng ảnh nếu cần (ví dụ tối đa 10 ảnh)
    if (images.length + files.length > 10) {
      alert("Tối đa 10 hình ảnh cho gallery");
      return;
    }
    setValue("images", [...images, ...files], { shouldDirty: true });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_: any, i: number) => i !== index);
    setValue("images", newImages, { shouldDirty: true });
  };

  return (
    <div className="space-y-4 pt-6 border-t border-border/50">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label className="text-sm font-bold text-foreground uppercase flex items-center gap-2">
            <LayoutGrid className="size-4 text-primary" /> Gallery & Portfolio
          </Label>
          <p className="text-[11px] text-muted-foreground">
            Hình ảnh sẽ hiển thị trong slider chi tiết nghệ sĩ.
          </p>
        </div>
        <span className="text-[10px] bg-muted px-2 py-1 rounded-full font-medium">
          {images.length} / 10
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {images.map((img: any, index: number) => {
          // Xử lý preview an toàn
          const isFile = img instanceof File;
          const previewUrl = isFile ? URL.createObjectURL(img) : img;

          return (
            <div
              key={index}
              className="group relative aspect-square rounded-xl border border-border bg-muted overflow-hidden hover:shadow-md transition-all"
            >
              <img
                src={previewUrl}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={`Gallery ${index}`}
                onLoad={() => isFile && URL.revokeObjectURL(previewUrl)} // Giải phóng bộ nhớ sau khi load (tùy thuộc vào logic app)
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1.5 right-1.5 size-6 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-lg"
                onClick={() => removeImage(index)}
              >
                <X className="size-3" />
              </Button>
            </div>
          );
        })}

        {/* Nút thêm ảnh */}
        {images.length < 10 && (
          <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-accent hover:border-primary/50 transition-all group active:scale-95">
            <div className="p-2 bg-muted rounded-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Plus className="size-5" />
            </div>
            <span className="text-[10px] font-bold uppercase mt-2 text-muted-foreground group-hover:text-primary">
              Add Photo
            </span>
            <input
              type="file"
              multiple
              className="hidden"
              accept="image/*"
              onChange={handleAddImages}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default GallerySection;
