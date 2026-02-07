import React from "react";
import { createPortal } from "react-dom";
import { Controller } from "react-hook-form";
import {
  X,
  Save,
  Loader2,
  Camera,
  Globe,
  Lock,
  Link,
  ImageIcon,
  CheckCircle2,
  Tags,
  Users,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Playlist } from "../types";
import { usePlaylistForm } from "../hooks/usePlaylistForm";
import { TagInput } from "@/components/ui/tag-input";
import { UserSelector } from "@/features/user/components/UserSelector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistToEdit?: Playlist | null;
  onSubmit: (data: any) => void;
  isPending: boolean;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  playlistToEdit,
  onSubmit,
  isPending,
}) => {
  const { form, preview, handleFileChange } = usePlaylistForm(
    playlistToEdit,
    isOpen,
  );
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = form;

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop: Tối hơn để tăng tương phản */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container: Viền rõ, Shadow đậm */}
      <div className="relative z-[101] w-full max-w-2xl bg-background border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden rounded-2xl animate-in zoom-in-95 duration-200 ring-1 ring-white/10">
        {/* HEADER */}
        <div className="shrink-0 px-6 py-4 border-b border-border flex justify-between items-center bg-background">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary shadow-sm">
              <ImageIcon className="size-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-foreground leading-none">
                {playlistToEdit ? "Update Playlist" : "New Playlist"}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {playlistToEdit
                  ? "Edit your collection details"
                  : "Curate your own music collection"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-muted/10">
          <form
            id="playlist-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Top Section: Artwork & Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Artwork */}
              <div className="space-y-2 shrink-0">
                <Label className="text-xs font-bold uppercase text-foreground/80 tracking-wider">
                  Cover Image
                </Label>
                <div className="relative group size-32 sm:size-40 rounded-xl border-2 border-dashed border-input overflow-hidden bg-background shadow-sm transition-all hover:border-primary hover:bg-accent">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Cover"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/50">
                      <ImageIcon className="size-10 mb-2 opacity-50" />
                      <span className="text-[10px] uppercase font-bold">
                        Upload
                      </span>
                    </div>
                  )}

                  {/* Overlay Upload Button */}
                  <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center cursor-pointer text-white backdrop-blur-[2px]">
                    <Camera className="size-6 mb-1" />
                    <span className="text-[10px] font-bold uppercase">
                      Change
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {/* Theme Color Picker Mini */}
                <div className="flex items-center gap-2 bg-background p-1.5 rounded-lg border border-input w-fit shadow-sm">
                  <Palette className="size-3.5 text-foreground/70" />
                  <input
                    type="color"
                    {...register("themeColor")}
                    className="size-5 bg-transparent border-none cursor-pointer rounded-sm overflow-hidden"
                  />
                </div>
              </div>

              {/* Title & Desc */}
              <div className="flex-1 space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-xs font-bold uppercase text-foreground/80 tracking-wider"
                  >
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="E.g., Chill Vibes 2024..."
                    className={cn(
                      "h-10 font-semibold bg-background border-input focus-visible:ring-2 focus-visible:ring-primary/20",
                      errors.title &&
                        "border-destructive focus-visible:ring-destructive/20",
                    )}
                  />
                  {errors.title && (
                    <p className="text-[11px] text-destructive font-bold animate-in slide-in-from-left-1">
                      {errors.title.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-xs font-bold uppercase text-foreground/80 tracking-wider"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Tell us about this playlist..."
                    className="resize-none h-[88px] text-sm bg-background border-input focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-foreground/80 tracking-wider flex items-center gap-2">
                <Tags className="size-3.5" /> Tags
              </Label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Enter tags..."
                    className="bg-background border-input min-h-[42px]"
                  />
                )}
              />
            </div>

            {/* Advanced: Collaborators */}
            <div className="space-y-3 pt-6 border-t border-border">
              <Label className="text-xs font-bold uppercase text-foreground/80 tracking-wider flex items-center gap-2">
                <Users className="size-3.5" /> Collaborators
              </Label>
              <Controller
                name="collaborators"
                control={control}
                render={({ field }) => (
                  <UserSelector
                    multi
                    value={field.value}
                    onChange={field.onChange}
                    initialUsers={playlistToEdit?.collaborators}
                    placeholder="Invite others to manage..."
                  />
                )}
              />
            </div>

            {/* Visibility Settings */}
            <div className="space-y-3 pt-6 border-t border-border">
              <Label className="text-xs font-bold uppercase text-foreground/80 tracking-wider">
                Visibility
              </Label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    id: "public",
                    label: "Public",
                    icon: Globe,
                    activeColor: "text-emerald-600 dark:text-emerald-400",
                    activeBg: "bg-emerald-500/10 border-emerald-500/50",
                    defaultIconColor: "text-emerald-500/70",
                  },
                  {
                    id: "private",
                    label: "Private",
                    icon: Lock,
                    activeColor: "text-orange-600 dark:text-orange-400",
                    activeBg: "bg-orange-500/10 border-orange-500/50",
                    defaultIconColor: "text-orange-500/70",
                  },
                  {
                    id: "unlisted",
                    label: "Unlisted",
                    icon: Link,
                    activeColor: "text-blue-600 dark:text-blue-400",
                    activeBg: "bg-blue-500/10 border-blue-500/50",
                    defaultIconColor: "text-blue-500/70",
                  },
                ].map((item) => {
                  const isSelected = watch("visibility") === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setValue("visibility", item.id as any)}
                      className={cn(
                        "relative p-3 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center gap-2 select-none",
                        isSelected
                          ? cn("ring-1 ring-primary/5 shadow-sm", item.activeBg)
                          : "border-transparent bg-background hover:bg-accent hover:border-accent border-input/50",
                      )}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          isSelected ? "bg-background shadow-sm" : "bg-muted",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "size-4",
                            isSelected
                              ? item.activeColor
                              : "text-muted-foreground",
                          )}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-xs font-bold",
                          isSelected
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2
                          className={cn(
                            "size-4 absolute top-2 right-2",
                            item.activeColor,
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 px-6 py-4 border-t border-border bg-background flex justify-between items-center z-20">
          <div className="flex items-center gap-2 text-muted-foreground/70">
            <ShieldCheck className="size-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-wide">
              Secure Save
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isPending}
              className="font-semibold text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              form="playlist-form"
              type="submit"
              size="sm"
              className="px-6 font-bold shadow-md hover:shadow-lg transition-all"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              {playlistToEdit ? "Save" : "Create Playlist"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default PlaylistModal;
