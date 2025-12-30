import React from "react";
import { createPortal } from "react-dom";
import {
  X,
  Upload,
  Loader2,
  Music,
  Palette,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Genre } from "../types";
import { useGenreModalLogic } from "../hooks/useGenreModalLogic";
import { GenreSelector } from "./GenreSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"; // Cần tạo component Label nếu chưa có, hoặc dùng label thường

interface GenreModalProps {
  isOpen: boolean;
  onClose: () => void;
  genreToEdit?: Genre | null;
}

const GenreModal: React.FC<GenreModalProps> = (props) => {
  const { isOpen, onClose, genreToEdit } = props;

  const {
    form: {
      register,
      setValue,
      watch,
      formState: { errors },
    },
    isEditing,
    isPending,
    imagePreview,
    handleImageChange,
    onSubmit,
    watchColor,
  } = useGenreModalLogic(props);

  const watchGradient = watch("gradient");
  const currentParentId = watch("parentId");

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-lg bg-card border border-border rounded-xl shadow-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none tracking-tight flex items-center gap-2">
              {isEditing ? (
                <Palette className="size-5 text-primary" />
              ) : (
                <Music className="size-5 text-primary" />
              )}
              {isEditing ? "Edit Genre" : "Create New Genre"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Update genre details below."
                : "Fill in the details to create a new genre."}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="genre-form" onSubmit={onSubmit} className="space-y-6">
            {/* Top Section: Image & Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="group relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors bg-muted/30 cursor-pointer">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground group-hover:text-primary transition-colors">
                      <Upload className="size-6 mb-2" />
                      <span className="text-[10px] font-medium uppercase">
                        Upload
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ImageIcon className="size-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Basic Info Inputs */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="e.g. Indie Pop"
                    className={cn(
                      errors.name &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive font-medium">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Layers className="size-3.5" /> Parent Genre
                  </Label>
                  <div className="border border-input rounded-md p-1 bg-background">
                    <GenreSelector
                      excludeIds={genreToEdit ? [genreToEdit._id] : []}
                      singleSelect={true}
                      value={currentParentId ? [currentParentId] : []}
                      onChange={(ids) => {
                        setValue("parentId", ids.length > 0 ? ids[0] : null, {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Theme Color</Label>
                <div className="flex gap-2">
                  <div
                    className="size-9 rounded-md border border-border shadow-sm shrink-0"
                    style={{ backgroundColor: watchColor || "#000000" }}
                  />
                  <Input
                    type="color"
                    {...register("color")}
                    className="flex-1 p-1 h-9 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Input
                  type="number"
                  {...register("priority")}
                  placeholder="0"
                  className="h-9"
                />
              </div>
            </div>

            {/* Gradient */}
            <div className="space-y-2">
              <Label>Gradient CSS</Label>
              <div className="flex gap-2">
                <Input
                  {...register("gradient")}
                  placeholder="linear-gradient(...)"
                  className="font-mono text-xs h-9"
                />
                <div
                  className="size-9 rounded-md border border-border shadow-sm shrink-0"
                  style={{ background: watchGradient || "transparent" }}
                  title="Gradient Preview"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                {...register("description")}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Brief description about this genre..."
              />
            </div>

            {/* Trending Toggle */}
            <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
              <div className="space-y-0.5">
                <Label className="text-base">Trending</Label>
                <p className="text-xs text-muted-foreground">
                  Show this genre in the "Hot & Trending" section.
                </p>
              </div>
              <input
                type="checkbox"
                {...register("isTrending")}
                className="size-5 accent-primary cursor-pointer rounded"
                // Hoặc dùng Switch component nếu có
              />
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/20 rounded-b-xl">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="genre-form" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isEditing ? "Save Changes" : "Create Genre"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GenreModal;
