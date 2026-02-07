import React, { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { Camera, ImageIcon, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import type { ArtistFormValues } from "@/features/artist/schemas/artist.schema";
import { Artist } from "@/features/artist/types";

interface ImageSectionProps {
  form: UseFormReturn<ArtistFormValues>;
  initialData: Artist;
}

const ImageSection: React.FC<ImageSectionProps> = ({ form, initialData }) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialData?.avatar || null
  );
  const [coverPreview, setCoverPreview] = useState<string | null>(
    initialData?.coverImage || null
  );
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "avatar" | "coverImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE)
      return toast.error("File size must be under 5MB");

    form.setValue(field, file, { shouldDirty: true });
    const url = URL.createObjectURL(file);
    if (field === "avatar") setAvatarPreview(url);
    else setCoverPreview(url);
  };

  const handleRemove = (
    e: React.MouseEvent,
    field: "avatar" | "coverImage"
  ) => {
    e.preventDefault();
    form.setValue(field, null, { shouldDirty: true });
    if (field === "avatar") setAvatarPreview(null);
    else setCoverPreview(null);
  };

  return (
    <div className="relative mb-20">
      {/* --- COVER IMAGE --- */}
      <div className="group relative w-full h-48 md:h-64 bg-secondary/30 border-b border-border overflow-hidden">
        {coverPreview ? (
          <>
            <img
              src={coverPreview}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              alt="cover"
            />
            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
              <Button
                variant="secondary"
                size="sm"
                className="relative cursor-pointer font-semibold shadow-md"
              >
                <Camera className="w-4 h-4 mr-2" /> Change Cover
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={(e) => handleFile(e, "coverImage")}
                />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="shadow-md"
                onClick={(e) => handleRemove(e, "coverImage")}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer bg-secondary/10">
            <div className="p-4 rounded-full bg-background shadow-sm mb-3 text-muted-foreground group-hover:text-primary transition-colors">
              <ImageIcon className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold text-foreground/70 uppercase tracking-wide">
              Upload Cover Image
            </span>
            <span className="text-[10px] text-muted-foreground mt-1">
              Recommended: 1920x600 px
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFile(e, "coverImage")}
            />
          </label>
        )}

        {/* Theme Color Picker - Rõ ràng hơn */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background p-1.5 pr-3 rounded-full border border-border shadow-lg z-20 hover:scale-105 transition-transform">
          <div className="relative size-7 rounded-full overflow-hidden border border-border shadow-sm">
            <input
              type="color"
              {...form.register("themeColor")}
              className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase leading-none text-foreground">
              Theme
            </span>
            <span className="text-[9px] text-muted-foreground leading-none">
              Color
            </span>
          </div>
        </div>
      </div>

      {/* --- AVATAR IMAGE --- */}
      <div className="absolute -bottom-14 left-6 md:left-10 z-10">
        <div className="group/avatar relative size-32 md:size-36 rounded-full border-[5px] border-card bg-background shadow-xl overflow-hidden ring-1 ring-black/5">
          {avatarPreview ? (
            <>
              <img
                src={avatarPreview}
                className="w-full h-full object-cover"
                alt="avatar"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-all flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]">
                <div className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white">
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => handleFile(e, "avatar")}
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, "avatar")}
                  className="p-2 text-white/70 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-secondary transition-colors bg-muted/30">
              <User className="w-10 h-10 text-muted-foreground mb-1" />
              <span className="text-[9px] font-bold uppercase text-foreground/60">
                Avatar
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFile(e, "avatar")}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageSection;
