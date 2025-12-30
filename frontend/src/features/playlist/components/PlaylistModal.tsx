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
    isOpen
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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-101 w-full max-w-2xl bg-card border border-border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden rounded-2xl animate-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="shrink-0 px-6 py-4 border-b flex justify-between items-center bg-muted/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <ImageIcon className="size-5" />
            </div>
            <h3 className="font-bold text-base text-foreground">
              {playlistToEdit ? "Cập nhật Playlist" : "Tạo Playlist mới"}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form
            id="playlist-form"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Top Section: Artwork & Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Artwork */}
              <div className="space-y-3 shrink-0">
                <Label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">
                  Ảnh bìa
                </Label>
                <div className="relative group size-32 sm:size-40 rounded-xl border-2 border-dashed border-border overflow-hidden bg-muted/20 transition-all hover:border-primary/40">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/30">
                      <ImageIcon className="size-8" />
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer text-white">
                    <Camera className="size-6" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {/* Theme Color Picker Mini */}
                <div className="flex items-center gap-2 bg-muted/50 p-1.5 rounded-lg border w-fit">
                  <Palette className="size-3 text-muted-foreground" />
                  <input
                    type="color"
                    {...register("themeColor")}
                    className="size-4 bg-transparent border-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Title & Desc */}
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider"
                  >
                    Tiêu đề *
                  </Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="VD: Chill cuối tuần..."
                    className={cn(errors.title && "border-destructive")}
                  />
                  {errors.title && (
                    <p className="text-[10px] text-destructive font-medium">
                      {errors.title.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider"
                  >
                    Mô tả
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Vài dòng giới thiệu..."
                    className="resize-none h-20 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                <Tags className="size-3" /> Từ khóa (Tags)
              </Label>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Nhấn Enter để thêm..."
                  />
                )}
              />
            </div>

            {/* Advanced: Collaborators */}
            <div className="space-y-3 pt-4 border-t">
              <Label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                <Users className="size-3" /> Cộng tác viên
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
                    placeholder="Chọn người cùng quản lý..."
                  />
                )}
              />
            </div>

            {/* Visibility Settings */}
            <div className="space-y-3 pt-4 border-t">
              <Label className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">
                Chế độ hiển thị
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    id: "public",
                    label: "Public",
                    icon: Globe,
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10",
                  },
                  {
                    id: "private",
                    label: "Private",
                    icon: Lock,
                    color: "text-orange-500",
                    bg: "bg-orange-500/10",
                  },
                  {
                    id: "unlisted",
                    label: "Unlisted",
                    icon: Link,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                  },
                ].map((item) => {
                  const isSelected = watch("visibility") === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setValue("visibility", item.id as any)}
                      className={cn(
                        "relative p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center gap-2",
                        isSelected
                          ? "border-primary bg-primary/3 ring-1 ring-primary/20"
                          : "border-border hover:bg-muted/50"
                      )}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-lg",
                          item.bg,
                          isSelected ? "scale-110" : "grayscale opacity-50"
                        )}
                      >
                        <item.icon className={cn("size-4", item.color)} />
                      </div>
                      <span className="text-[11px] font-bold">
                        {item.label}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="size-3 absolute top-1.5 right-1.5 text-primary" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 px-6 py-4 border-t bg-muted/5 flex justify-between items-center">
          <div className="flex items-center gap-2 opacity-50">
            <ShieldCheck className="size-3" />
            <span className="text-[10px] font-medium">Verified Action</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button
              form="playlist-form"
              type="submit"
              size="sm"
              className="px-6"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              {playlistToEdit ? "Lưu" : "Khởi tạo"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PlaylistModal;
