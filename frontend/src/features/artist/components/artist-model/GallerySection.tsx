import React from "react";
import { Plus, X, LayoutGrid, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArtistFormValues } from "@/features/artist/schemas/artist.schema";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  form: UseFormReturn<ArtistFormValues>;
}

const GallerySection: React.FC<GallerySectionProps> = ({ form }) => {
  const { watch, setValue } = form;
  const images = watch("images") || [];

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <Label className="text-xs font-bold text-foreground uppercase flex items-center gap-2 tracking-wider">
            <LayoutGrid className="size-4 text-primary" /> Gallery & Portfolio
          </Label>
          <p className="text-xs text-foreground/70 font-medium">
            Hình ảnh hiển thị trong slider chi tiết nghệ sĩ (Tối đa 10 ảnh).
          </p>
        </div>
        <div
          className={cn(
            "text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm",
            images.length > 0
              ? "bg-primary/10 text-primary border-primary/20"
              : "bg-muted text-muted-foreground border-border"
          )}
        >
          {images.length} / 10
        </div>
      </div>

      {/* Grid Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img: any, index: number) => {
          const isFile = img instanceof File;
          const previewUrl = isFile ? URL.createObjectURL(img) : img;

          return (
            <div
              key={index}
              className="group relative aspect-square rounded-xl border border-input bg-background overflow-hidden shadow-sm hover:shadow-md transition-all ring-1 ring-black/5"
            >
              <img
                src={previewUrl}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                alt={`Gallery ${index}`}
                onLoad={() => isFile && URL.revokeObjectURL(previewUrl)}
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Delete Button */}
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 size-7 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-lg border border-white/20"
                onClick={() => removeImage(index)}
              >
                <X className="size-3.5" />
              </Button>
            </div>
          );
        })}

        {/* Add Button */}
        {images.length < 10 && (
          <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-input rounded-xl cursor-pointer bg-secondary/20 hover:bg-secondary/40 hover:border-primary/50 transition-all group active:scale-95">
            <div className="p-3 bg-background rounded-full shadow-sm border border-border group-hover:scale-110 transition-transform mb-2">
              <Plus className="size-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-[10px] font-bold uppercase text-foreground/60 group-hover:text-primary tracking-wide">
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
