import React, { useState, useEffect, useCallback } from "react";
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
  TrendingUp,
  AlertCircle,
  Hash,
  Paintbrush,
  Camera,
  AlignLeft,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Genre } from "../types";

import { useGenreForm } from "../hooks/useGenreForm";

// UI Components
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
  onSubmit: (data: FormData) => Promise<void>;
  isPending: boolean;
}

const GenreModal: React.FC<GenreModalProps> = ({
  isOpen,
  onClose,
  genreToEdit,
  onSubmit,
  isPending,
}) => {
  const {
    form,
    handleSubmit,
    isSubmitting: isFormSubmitting,
  } = useGenreForm({
    genreToEdit,
    onSubmit,
  });

  const {
    register,
    setValue,
    watch,
    control,
    formState: { errors },
  } = form;

  const isEditing = !!genreToEdit;
  const watchGradient = watch("gradient");
  const watchColor = watch("color");
  const currentParentId = watch("parentId");
  const isTrending = watch("isTrending");
  const imageValue = watch("image");

  // --- LOGIC UI: Image Preview ---
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (imageValue instanceof File) {
      const url = URL.createObjectURL(imageValue);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof imageValue === "string" && imageValue.length > 0) {
      setImagePreview(imageValue);
    } else {
      setImagePreview(null);
    }
  }, [imageValue]);

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setValue("image", file, { shouldValidate: true, shouldDirty: true });
      }
    },
    [setValue],
  );

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isWorking = isPending || isFormSubmitting;

  // Chuẩn Label
  const labelClass =
    "text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5 w-fit";

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={!isWorking ? onClose : undefined}
      />

      {/* Modal Content */}
      <div className="relative z-[101] w-full max-w-2xl bg-background border border-border rounded-xl shadow-2xl flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/10 shadow-sm">
              {isEditing ? (
                <Palette className="size-5" />
              ) : (
                <Music className="size-5" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold leading-none text-foreground uppercase tracking-tight">
                {isEditing ? "Cập Nhật Thể Loại" : "Tạo Thể Loại Mới"}
              </h3>
              <p className="text-[13px] font-medium text-muted-foreground mt-1">
                {isEditing
                  ? "Chỉnh sửa thông tin chi tiết của danh mục này."
                  : "Thêm một danh mục âm nhạc mới vào hệ thống."}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isWorking}
            className="rounded-md size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background p-6 sm:p-8">
          <form id="genre-form" onSubmit={handleSubmit} className="space-y-8">
            {/* ===== KHỐI 1: THÔNG TIN CƠ BẢN ===== */}
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-foreground mb-6">
                Thông tin chung
              </h4>
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                {/* --- COVER IMAGE --- */}
                <div className="flex flex-col gap-3 shrink-0">
                  <div
                    className={cn(
                      "relative group size-36 sm:size-40 rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300",
                      errors.image
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-muted-foreground/20 bg-secondary/10 hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md",
                    )}
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="relative cursor-pointer font-semibold shadow-md pointer-events-none"
                          >
                            <Camera className="w-4 h-4 mr-2" /> Đổi ảnh
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground transition-colors group-hover:text-primary">
                        <div className="p-3 rounded-full bg-background shadow-sm mb-2 border border-border/50">
                          <ImageIcon className="size-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wide">
                          Tải ảnh / icon
                        </span>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp, image/svg+xml"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={handleImageChange}
                    />

                    {/* Thông báo lỗi Image đè lên góc */}
                    {errors.image && (
                      <div className="absolute bottom-2 right-2 bg-destructive/90 backdrop-blur px-2 py-1 rounded text-[10px] text-destructive-foreground font-bold flex items-center gap-1 z-20">
                        <AlertCircle className="size-3" /> Lỗi ảnh
                      </div>
                    )}
                  </div>
                </div>

                {/* --- BASIC INFO INPUTS --- */}
                <div className="flex-1 w-full space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name" className={labelClass}>
                      <Music className="size-3.5" /> Tên thể loại{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="VD: Pop, Ballad, Lofi..."
                        className={cn(
                          "h-11 bg-transparent border-input rounded-md text-[15px] font-semibold focus-visible:ring-1 focus-visible:ring-primary transition-all",
                          errors.name &&
                            "border-destructive focus-visible:ring-destructive pr-10",
                        )}
                      />
                      {errors.name && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
                          <AlertCircle className="size-4.5" />
                        </div>
                      )}
                    </div>
                    {errors.name && (
                      <p className="text-[12px] font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in slide-in-from-top-1">
                        {errors.name.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className={labelClass}>
                      <Layers className="size-3.5" /> Thể loại cha (Danh mục
                      gốc)
                    </Label>
                    <div className="bg-background rounded-md border border-input p-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
                      <GenreSelector
                        variant="form"
                        excludeIds={genreToEdit ? [genreToEdit._id] : []}
                        singleSelect={true}
                        value={currentParentId}
                        onChange={(id) => {
                          setValue("parentId", id || "", {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                        className="border-none shadow-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-border border-dashed" />

            {/* ===== KHỐI 2: THIẾT KẾ VÀ HIỂN THỊ ===== */}
            <div>
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-foreground mb-6">
                Cấu hình giao diện
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  {/* Theme Color */}
                  <div>
                    <Label className={labelClass}>
                      <Palette className="size-3.5" /> Màu chủ đạo
                    </Label>
                    <div
                      className={cn(
                        "flex gap-3 items-center p-1.5 border rounded-md bg-transparent transition-colors",
                        errors.color
                          ? "border-destructive ring-1 ring-destructive/20"
                          : "border-input",
                      )}
                    >
                      <div className="relative size-8 rounded overflow-hidden border border-border shadow-inner shrink-0 group hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer">
                        <input
                          type="color"
                          {...register("color")}
                          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] cursor-pointer p-0 m-0"
                        />
                      </div>
                      <span className="text-xs font-mono uppercase text-foreground font-semibold">
                        {watchColor || "#000000"}
                      </span>
                    </div>
                    {errors.color && (
                      <p className="text-[12px] font-medium text-destructive mt-1 flex items-center gap-1.5">
                        <AlertCircle className="size-3.5" />{" "}
                        {errors.color.message as string}
                      </p>
                    )}
                  </div>

                  {/* Priority */}
                  <div>
                    <Label className={labelClass}>
                      <Hash className="size-3.5" /> Độ ưu tiên hiển thị
                    </Label>
                    <Input
                      type="number"
                      {...register("priority", { valueAsNumber: true })}
                      placeholder="0"
                      className={cn(
                        "h-11 bg-transparent border-input font-mono text-[15px] focus-visible:ring-1 focus-visible:ring-primary",
                        errors.priority &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {errors.priority && (
                      <p className="text-[12px] font-medium text-destructive mt-1 flex items-center gap-1.5">
                        <AlertCircle className="size-3.5" />{" "}
                        {errors.priority.message as string}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Gradient */}
                  <div>
                    <Label className={labelClass}>
                      <Paintbrush className="size-3.5" /> Background Gradient
                      CSS
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        {...register("gradient")}
                        placeholder="linear-gradient(to right, ...)"
                        className={cn(
                          "h-11 bg-transparent border-input font-mono text-xs focus-visible:ring-1 focus-visible:ring-primary",
                          errors.gradient &&
                            "border-destructive focus-visible:ring-destructive",
                        )}
                      />
                      <div
                        className="size-11 rounded-md border border-border shadow-sm shrink-0 bg-checkerboard relative overflow-hidden"
                        title="Gradient Preview"
                      >
                        <div
                          className="absolute inset-0"
                          style={{ background: watchGradient || "transparent" }}
                        />
                      </div>
                    </div>
                    {errors.gradient && (
                      <p className="text-[12px] font-medium text-destructive mt-1 flex items-center gap-1.5">
                        <AlertCircle className="size-3.5" />{" "}
                        {errors.gradient.message as string}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description" className={labelClass}>
                      <AlignLeft className="size-3.5" /> Mô tả ngắn
                    </Label>
                    <Textarea
                      {...register("description")}
                      rows={2}
                      className={cn(
                        "resize-none h-[44px] custom-scrollbar bg-transparent border-input text-sm focus-visible:ring-1 focus-visible:ring-primary",
                        errors.description &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                      placeholder="Thông tin thêm (nếu có)..."
                    />
                    {errors.description && (
                      <p className="text-[12px] font-medium text-destructive mt-1 flex items-center gap-1.5">
                        <AlertCircle className="size-3.5" />{" "}
                        {errors.description.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-border border-dashed" />

            {/* ===== KHỐI 3: TRENDING ====== */}
            <div
              className={cn(
                "flex items-center justify-between p-4 border rounded-xl transition-all cursor-pointer select-none group",
                isTrending
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-input bg-transparent hover:border-primary/50 hover:bg-muted/30",
              )}
              onClick={() =>
                setValue("isTrending", !isTrending, { shouldDirty: true })
              }
            >
              <div className="flex gap-4 items-center">
                <div
                  className={cn(
                    "p-2.5 rounded-lg transition-colors",
                    isTrending
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground group-hover:text-foreground",
                  )}
                >
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <Label className="text-sm font-bold text-foreground cursor-pointer block">
                    Trạng thái Trending (Thịnh hành)
                  </Label>
                  <p
                    className={cn(
                      "text-[11px] font-medium mt-0.5 transition-colors",
                      isTrending ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {isTrending
                      ? "Đang được đánh dấu là thể loại thịnh hành"
                      : "Không nằm trong danh sách thịnh hành"}
                  </p>
                </div>
              </div>

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
        <div className="flex items-center justify-between p-5 border-t border-border bg-background shrink-0 z-20">
          <p className="text-[11px] text-muted-foreground font-medium hidden sm:block">
            Các trường có{" "}
            <span className="text-destructive font-bold text-sm">*</span> là bắt
            buộc.
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              type="button"
              onClick={onClose}
              disabled={isWorking}
              className="font-bold border-input bg-background hover:bg-accent hover:text-foreground h-10 px-5 rounded-md flex-1 sm:flex-none"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              form="genre-form"
              disabled={isWorking}
              className="font-bold shadow-md hover:shadow-lg transition-all h-10 px-6 rounded-md flex-1 sm:flex-none"
            >
              {isWorking ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />{" "}
                  {isEditing ? "Lưu thay đổi" : "Tạo thể loại"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default GenreModal;
