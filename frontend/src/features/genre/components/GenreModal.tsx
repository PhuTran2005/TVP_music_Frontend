import React from "react";
import { createPortal } from "react-dom";
import { Controller } from "react-hook-form";
import {
  X,
  Upload,
  Loader2,
  Music,
  Palette,
  Layers,
  Image as ImageIcon,
  TrendingUp, // Thêm icon cho phần Trending
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Genre } from "../types";
import { useGenreModalLogic } from "../hooks/useGenreModalLogic";
import { GenreSelector } from "./GenreSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

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
      control,
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
  const isTrending = watch("isTrending"); // Watch để style UI

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-[101] w-full max-w-lg bg-background border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 ring-1 ring-white/10 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/20 shadow-sm">
              {isEditing ? (
                <Palette className="size-5" />
              ) : (
                <Music className="size-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold leading-none text-foreground">
                {isEditing ? "Edit Genre" : "Create New Genre"}
              </h3>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                {isEditing
                  ? "Update genre details below."
                  : "Fill in the details to create a new genre."}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-muted/10">
          <form id="genre-form" onSubmit={onSubmit} className="space-y-6">
            {/* Top Section: Image & Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Image Upload */}
              <div className="space-y-2 shrink-0">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                  Cover Image
                </Label>
                <div className="group relative w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-input hover:border-primary hover:bg-accent transition-all bg-background shadow-sm cursor-pointer">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground group-hover:text-primary transition-colors">
                      <Upload className="size-6 mb-2 opacity-50" />
                      <span className="text-[10px] font-bold uppercase">
                        Upload
                      </span>
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-[1px]">
                    <ImageIcon className="size-6 mb-1" />
                    <span className="text-[9px] font-bold uppercase">
                      Change
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>

              {/* Basic Info Inputs */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs font-bold uppercase tracking-wider text-foreground/80"
                  >
                    Name <span className="text-destructive text-sm">*</span>
                  </Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="e.g. Indie Pop"
                    className={cn(
                      "h-10 font-semibold bg-background border-input shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20",
                      errors.name &&
                        "border-destructive focus-visible:ring-destructive/20"
                    )}
                  />
                  {errors.name && (
                    <p className="text-[11px] font-bold text-destructive animate-in slide-in-from-left-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5">
                    <Layers className="size-3.5" /> Parent Genre
                  </Label>
                  <div className="bg-background rounded-lg shadow-sm border border-input p-2">
                    <GenreSelector
                      excludeIds={genreToEdit ? [genreToEdit._id] : []}
                      singleSelect={true}
                      value={currentParentId ? [currentParentId] : []}
                      onChange={(ids) => {
                        setValue("parentId", ids.length > 0 ? ids[0] : null, {
                          shouldDirty: true,
                        });
                      }}
                      className="border-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Settings */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                  Theme Color
                </Label>
                <div className="flex gap-2 items-center p-1 border border-input rounded-lg bg-background shadow-sm">
                  <div
                    className="size-8 rounded border border-border shadow-inner shrink-0 transition-colors"
                    style={{ backgroundColor: watchColor || "#000000" }}
                  />
                  <div className="flex-1 relative">
                    <input
                      type="color"
                      {...register("color")}
                      className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                    />
                    <span className="text-xs font-mono pl-1 uppercase text-muted-foreground">
                      {watchColor || "#000000"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                  Priority
                </Label>
                <Input
                  type="number"
                  {...register("priority", { valueAsNumber: true })}
                  placeholder="0"
                  className="h-[42px] bg-background border-input shadow-sm font-mono text-sm"
                />
              </div>
            </div>

            {/* Gradient */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                Gradient CSS
              </Label>
              <div className="flex gap-2">
                <Input
                  {...register("gradient")}
                  placeholder="linear-gradient(...)"
                  className="font-mono text-xs h-10 bg-background border-input shadow-sm"
                />
                <div
                  className="size-10 rounded-lg border border-border shadow-sm shrink-0 bg-checkerboard"
                  style={{ background: watchGradient || "transparent" }}
                  title="Gradient Preview"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                Description
              </Label>
              <Textarea
                {...register("description")}
                rows={3}
                className="resize-none bg-background border-input shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 text-sm"
                placeholder="Brief description about this genre..."
              />
            </div>

            {/* Trending Toggle - FIX: Sử dụng Controller và xử lý sự kiện chuẩn */}
            <div
              className={cn(
                "flex items-center justify-between p-4 border rounded-xl transition-all cursor-pointer select-none group",
                isTrending
                  ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                  : "border-input bg-background hover:bg-muted/40 hover:border-foreground/20"
              )}
              // Click vào container sẽ toggle giá trị
              onClick={() =>
                setValue("isTrending", !isTrending, { shouldDirty: true })
              }
            >
              <div className="flex gap-4 items-center">
                <div
                  className={cn(
                    "p-2.5 rounded-lg border shrink-0 transition-colors",
                    isTrending
                      ? "bg-background border-primary/20 text-primary"
                      : "bg-muted border-transparent text-muted-foreground group-hover:bg-muted/80"
                  )}
                >
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <Label className="text-sm font-bold text-foreground cursor-pointer block">
                    Trending Status
                  </Label>
                  <p
                    className={cn(
                      "text-xs font-medium mt-0.5 transition-colors",
                      isTrending ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {isTrending
                      ? "Currently showing in Trending"
                      : "Not showing in Trending"}
                  </p>
                </div>
              </div>

              {/* Ngăn sự kiện click của Switch lan ra ngoài container */}
              <div
                className="pl-2 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <Controller
                  control={control}
                  name="isTrending"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary scale-110"
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border bg-background shrink-0 z-20">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            className="font-bold border-input bg-background hover:bg-accent hover:text-foreground"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="genre-form"
            disabled={isPending}
            className="font-bold shadow-md px-6 bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
          >
            {isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Create Genre"
            )}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default GenreModal;
