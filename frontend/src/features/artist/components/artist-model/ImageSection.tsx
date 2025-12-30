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
    <div className="relative mb-16">
      {/* --- COVER IMAGE --- */}
      <div className="group relative w-full h-48 md:h-64 bg-muted overflow-hidden">
        {coverPreview ? (
          <>
            <img
              src={coverPreview}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt="cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="relative cursor-pointer"
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
                className="h-9 w-9"
                onClick={(e) => handleRemove(e, "coverImage")}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full border-b-2 border-dashed border-border hover:bg-primary/5 transition-colors cursor-pointer">
            <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
            <span className="text-sm font-medium text-muted-foreground">
              Upload Cover Image (1920x600)
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFile(e, "coverImage")}
            />
          </label>
        )}

        {/* Theme Color Picker Overlay */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-md p-1.5 rounded-full border shadow-lg transition-transform hover:scale-105">
          <div
            className="size-6 rounded-full border shadow-inner"
            style={{ backgroundColor: form.watch("themeColor") || "#7c3aed" }}
          />
          <input
            type="color"
            {...form.register("themeColor")}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <span className="text-[10px] font-bold uppercase pr-2 text-foreground">
            Theme
          </span>
        </div>
      </div>

      {/* --- AVATAR IMAGE --- */}
      <div className="absolute -bottom-12 left-6 md:left-10">
        <div className="group/avatar relative size-32 md:size-36 rounded-full border-[6px] border-card bg-muted shadow-xl overflow-hidden">
          {avatarPreview ? (
            <>
              <img
                src={avatarPreview}
                className="w-full h-full object-cover"
                alt="avatar"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-all flex flex-col items-center justify-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white relative cursor-pointer hover:bg-white/20"
                >
                  <Camera className="w-5 h-5" />
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => handleFile(e, "avatar")}
                  />
                </Button>
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, "avatar")}
                  className="text-white/70 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-primary/5 transition-colors">
              <User className="w-10 h-10 text-muted-foreground" />
              <span className="text-[10px] font-bold uppercase mt-1">
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
