import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { Controller, useWatch } from "react-hook-form";
import {
  X,
  Save,
  Camera,
  Globe,
  FileAudio,
  Music,
  Disc,
  ShieldAlert,
  AudioLines,
  AlertCircle,
  Loader2,
  Calendar,
  ListOrdered,
  Copyright,
  ScanBarcode,
  Type,
  Tags,
  AlignLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

// UI Components
import { ArtistSelector } from "@/features/artist/components/ArtistSelector";
import { GenreSelector } from "@/features/genre/components/GenreSelector";
import { AlbumSelector } from "@/features/album/components/AlbumSelector";
import { TagInput } from "@/components/ui/tag-input";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

import { useTrackForm } from "../hooks/useTrackForm";
import { ITrack } from "@/features/track/types";

interface TrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackToEdit?: ITrack | null;
  onSubmit: (data: FormData) => Promise<void>;
  isPending: boolean;
}

const TrackModal: React.FC<TrackModalProps> = ({
  isOpen,
  onClose,
  trackToEdit,
  onSubmit,
  isPending,
}) => {
  const {
    form,
    handleSubmit,
    handleAudioChange,
    imagePreview,
    audioPreview,
    formatDuration,
    isSubmitting: isFormSubmitting,
  } = useTrackForm({
    trackToEdit,
    onSubmit,
  });

  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = form;

  const isEditing = !!trackToEdit;
  const selectedMainArtist = useWatch({ control, name: "artistId" });
  const isPublic = useWatch({ control, name: "isPublic" });
  const isExplicit = useWatch({ control, name: "isExplicit" });
  const duration = useWatch({ control, name: "duration" });

  const mainArtistValue = selectedMainArtist ? [selectedMainArtist] : [];
  const isLoading = isPending || isFormSubmitting;

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Helpers Chuẩn UI Đồng Bộ với GenreModal ---
  const FormLabel = ({ children, required, icon: Icon }: any) => (
    <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5 flex items-center gap-1.5 w-fit">
      {Icon && <Icon className="size-3.5" />}
      {children}
      {required && (
        <span className="text-destructive text-sm leading-none">*</span>
      )}
    </Label>
  );

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <p className="text-[12px] font-medium text-destructive mt-1 flex items-center gap-1.5 animate-in slide-in-from-top-1">
        <AlertCircle className="size-3.5 shrink-0" />
        <span>{message}</span>
      </p>
    );
  };

  const inputClass =
    "h-11 bg-transparent border-input rounded-md text-[14px] font-medium focus-visible:ring-1 focus-visible:ring-primary transition-all";

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300" />

      {/* Modal Content */}
      <div className="relative z-[101] w-full max-w-6xl bg-background border border-border rounded-xl shadow-2xl flex flex-col h-[95vh] max-h-[92vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* --- HEADER --- */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-background shrink-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary border border-primary/10 shadow-sm">
              <Music className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-none text-foreground uppercase tracking-tight">
                {isEditing ? "Cập Nhật Bài Hát" : "Tải Nhạc Lên Hệ Thống"}
              </h3>
              <p className="text-[13px] font-medium text-muted-foreground mt-1 hidden sm:block">
                {isEditing
                  ? "Chỉnh sửa thông tin chi tiết và tệp âm thanh của bài hát."
                  : "Thêm một bài hát mới vào cơ sở dữ liệu hệ thống."}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* --- BODY --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-muted/10 relative p-4 sm:p-6 lg:p-8">
          <form
            id="track-form"
            onSubmit={handleSubmit}
            className="flex flex-col lg:flex-row gap-6 lg:gap-8"
          >
            {/* === SIDEBAR (Media & Settings) === */}
            <aside className="w-full lg:w-[340px] shrink-0 space-y-6">
              {/* Artwork */}
              <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
                <FormLabel icon={Camera}>Ảnh Bìa Nhạc</FormLabel>
                <div
                  className={cn(
                    "relative mt-2 group aspect-square w-[200px] lg:w-full mx-auto rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center cursor-pointer transition-all duration-300",
                    errors.coverImage
                      ? "border-destructive/50 bg-destructive/5"
                      : "border-muted-foreground/20 bg-secondary/10 hover:border-primary/50 hover:bg-primary/5 shadow-sm hover:shadow-md",
                  )}
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Cover Preview"
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
                        <Disc className="size-6" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wide">
                        Tải ảnh vuông (1:1)
                      </span>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f)
                        setValue("coverImage", f, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                    }}
                  />

                  {errors.coverImage && (
                    <div className="absolute bottom-2 right-2 bg-destructive/90 backdrop-blur px-2 py-1 rounded text-[10px] text-destructive-foreground font-bold flex items-center gap-1 z-20">
                      <AlertCircle className="size-3" /> Lỗi ảnh
                    </div>
                  )}
                </div>
              </div>

              {/* Audio File */}
              <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
                <FormLabel required icon={FileAudio}>
                  Tệp Âm Thanh
                </FormLabel>
                <div
                  className={cn(
                    "relative mt-2 p-3.5 rounded-xl border-2 border-dashed transition-all cursor-pointer shadow-sm group",
                    errors.audio
                      ? "border-destructive/50 bg-destructive/5"
                      : duration > 0
                        ? "border-primary/50 bg-primary/5"
                        : "border-muted-foreground/20 bg-secondary/10 hover:border-primary/50 hover:bg-primary/5",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "size-10 rounded-lg flex items-center justify-center shrink-0 border transition-colors",
                        duration > 0
                          ? "bg-primary/20 text-primary border-primary/20"
                          : "bg-background text-muted-foreground border-border/50 group-hover:text-primary",
                      )}
                    >
                      {duration > 0 ? (
                        <AudioLines className="size-5 animate-pulse" />
                      ) : (
                        <FileAudio className="size-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-[13px] font-bold truncate leading-tight transition-colors",
                          errors.audio
                            ? "text-destructive"
                            : duration > 0
                              ? "text-primary"
                              : "text-foreground group-hover:text-primary",
                        )}
                      >
                        {audioPreview || "Chọn file nhạc..."}
                      </p>
                      <div className="mt-1 flex">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "h-5 text-[9px] px-2 font-mono uppercase tracking-wider bg-background border",
                            duration > 0
                              ? "border-primary/30 text-primary"
                              : "border-border/60 text-muted-foreground",
                          )}
                        >
                          {duration > 0
                            ? formatDuration(duration)
                            : "MP3, WAV, FLAC"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="audio/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    onChange={handleAudioChange}
                  />
                </div>
                <ErrorMessage message={errors.audio?.message as string} />
                <ErrorMessage message={errors.duration?.message} />
              </div>

              {/* Status Toggles (Public & Explicit) */}
              <div className="space-y-3">
                {/* Public Toggle */}
                <div
                  className={cn(
                    "flex items-center justify-between p-4 border rounded-xl transition-all cursor-pointer select-none group",
                    isPublic
                      ? "border-emerald-500/50 bg-emerald-500/5 shadow-sm"
                      : "border-border bg-background hover:border-emerald-500/30",
                  )}
                  onClick={() =>
                    setValue("isPublic", !isPublic, { shouldDirty: true })
                  }
                >
                  <div className="flex gap-3 items-center">
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isPublic
                          ? "bg-emerald-500/20 text-emerald-600"
                          : "bg-muted text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      <Globe className="size-4.5" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-foreground cursor-pointer block leading-none">
                        Trạng thái hiển thị
                      </Label>
                      <p
                        className={cn(
                          "text-[11px] font-medium mt-1 transition-colors",
                          isPublic
                            ? "text-emerald-600"
                            : "text-muted-foreground",
                        )}
                      >
                        {isPublic
                          ? "Phát hành công khai"
                          : "Bản nháp (Đang ẩn)"}
                      </p>
                    </div>
                  </div>
                  <div
                    className="pl-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Switch
                      checked={isPublic}
                      onCheckedChange={(v) =>
                        setValue("isPublic", v, { shouldDirty: true })
                      }
                      className="data-[state=checked]:bg-emerald-500 scale-105"
                    />
                  </div>
                </div>

                {/* Explicit Toggle */}
                <div
                  className={cn(
                    "flex items-center justify-between p-4 border rounded-xl transition-all cursor-pointer select-none group",
                    isExplicit
                      ? "border-amber-500/50 bg-amber-500/5 shadow-sm"
                      : "border-border bg-background hover:border-amber-500/30",
                  )}
                  onClick={() =>
                    setValue("isExplicit", !isExplicit, { shouldDirty: true })
                  }
                >
                  <div className="flex gap-3 items-center">
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isExplicit
                          ? "bg-amber-500/20 text-amber-600"
                          : "bg-muted text-muted-foreground group-hover:text-foreground",
                      )}
                    >
                      <ShieldAlert className="size-4.5" />
                    </div>
                    <div>
                      <Label className="text-sm font-bold text-foreground cursor-pointer block leading-none">
                        Nội dung 18+ (Explicit)
                      </Label>
                      <p
                        className={cn(
                          "text-[11px] font-medium mt-1 transition-colors",
                          isExplicit
                            ? "text-amber-600"
                            : "text-muted-foreground",
                        )}
                      >
                        Ngôn từ nhạy cảm
                      </p>
                    </div>
                  </div>
                  <div
                    className="pl-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Switch
                      checked={isExplicit}
                      onCheckedChange={(v) =>
                        setValue("isExplicit", v, { shouldDirty: true })
                      }
                      className="data-[state=checked]:bg-amber-500 scale-105"
                    />
                  </div>
                </div>
              </div>
            </aside>

            {/* === MAIN CONTENT (Tabs) === */}
            <main className="flex-1 bg-background rounded-xl border border-border shadow-sm h-fit flex flex-col overflow-hidden">
              <Tabs defaultValue="general" className="w-full flex flex-col">
                <div className="px-5 py-4 border-b border-border bg-background sticky top-0 z-30">
                  <TabsList className="w-full h-11 bg-muted p-1 rounded-lg flex justify-start sm:justify-center overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <TabsTrigger
                      value="general"
                      className="flex-1 shrink-0 gap-2 text-[12px] font-bold uppercase tracking-wide px-4 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-full rounded-md transition-all"
                    >
                      Thông tin chính
                    </TabsTrigger>
                    <TabsTrigger
                      value="advanced"
                      className="flex-1 shrink-0 gap-2 text-[12px] font-bold uppercase tracking-wide px-4 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-full rounded-md transition-all"
                    >
                      Chi tiết
                    </TabsTrigger>
                    <TabsTrigger
                      value="lyrics"
                      className="flex-1 shrink-0 gap-2 text-[12px] font-bold uppercase tracking-wide px-4 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-full rounded-md transition-all"
                    >
                      Lời bài hát
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-6 sm:p-8">
                  {/* --- Tab: General --- */}
                  <TabsContent
                    value="general"
                    className="space-y-6 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-300 m-0"
                  >
                    <div className="space-y-1.5">
                      <FormLabel required icon={Type}>
                        Tên Bài Hát
                      </FormLabel>
                      <div className="relative">
                        <Input
                          {...register("title")}
                          className={cn(
                            inputClass,
                            "text-base",
                            errors.title &&
                              "border-destructive focus-visible:ring-destructive pr-10",
                          )}
                          placeholder="VD: Cơn mưa ngang qua..."
                        />
                        {errors.title && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-destructive">
                            <AlertCircle className="size-4.5" />
                          </div>
                        )}
                      </div>
                      <ErrorMessage message={errors.title?.message} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <Controller
                          control={control}
                          name="artistId"
                          render={({ field, fieldState }) => (
                            <div>
                              <ArtistSelector
                                label="Nghệ sĩ chính"
                                singleSelect
                                value={mainArtistValue}
                                required
                                onChange={(ids) => field.onChange(ids[0] || "")}
                                className="bg-transparent border-input rounded-md"
                              />
                              <ErrorMessage
                                message={fieldState.error?.message}
                              />
                            </div>
                          )}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Controller
                          control={control}
                          name="albumId"
                          render={({ field }) => (
                            <div>
                              <AlbumSelector
                                label="Nằm trong Album"
                                value={field.value || ""}
                                onChange={field.onChange}
                              />
                            </div>
                          )}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <Controller
                          control={control}
                          name="genreIds"
                          render={({ field, fieldState }) => (
                            <div>
                              <GenreSelector
                                label="Thể loại nhạc"
                                singleSelect={false}
                                variant="form"
                                value={field.value}
                                onChange={field.onChange}
                                required
                                className="bg-transparent border-input rounded-md"
                              />
                              <ErrorMessage
                                message={fieldState.error?.message}
                              />
                            </div>
                          )}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <FormLabel icon={Calendar}>Ngày Phát Hành</FormLabel>
                        <Input
                          type="date"
                          {...register("releaseDate")}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Controller
                        control={control}
                        name="featuringArtistIds"
                        render={({ field }) => (
                          <ArtistSelector
                            label="Nghệ sĩ hợp tác (Feat)"
                            singleSelect={false}
                            value={field.value || []}
                            onChange={field.onChange}
                            disabledIds={mainArtistValue}
                            className="bg-transparent border-input rounded-md"
                          />
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* --- Tab: Advanced --- */}
                  <TabsContent
                    value="advanced"
                    className="space-y-6 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-300 m-0"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <FormLabel icon={ScanBarcode}>Mã ISRC</FormLabel>
                        <Input
                          {...register("isrc")}
                          className={cn(
                            inputClass,
                            "font-mono uppercase placeholder:normal-case placeholder:font-sans",
                            errors.isrc &&
                              "border-destructive focus-visible:ring-destructive",
                          )}
                          placeholder="VD: VN-XXX-24-00001"
                        />
                        <ErrorMessage message={errors.isrc?.message} />
                      </div>

                      <div className="space-y-1.5">
                        <FormLabel icon={Copyright}>
                          Bản Quyền (Copyright)
                        </FormLabel>
                        <Input
                          {...register("copyright")}
                          className={inputClass}
                          placeholder="℗ 2024 Record Label Name"
                        />
                        <ErrorMessage message={errors.copyright?.message} />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <FormLabel icon={Tags}>Từ Khóa (Tags)</FormLabel>
                      <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                          <TagInput
                            value={field.value || []}
                            onChange={field.onChange}
                            className="bg-transparent border-input min-h-[44px] rounded-md focus-within:ring-1 focus-within:ring-primary"
                            placeholder="Nhập tag và nhấn Enter..."
                          />
                        )}
                      />
                      <ErrorMessage message={errors.tags?.message} />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <FormLabel icon={ListOrdered}>Thứ Tự Track</FormLabel>
                        <Input
                          type="number"
                          {...register("trackNumber", {
                            valueAsNumber: true,
                          })}
                          className={cn(
                            inputClass,
                            "font-mono font-bold",
                            errors.trackNumber && "border-destructive",
                          )}
                        />
                        <ErrorMessage message={errors.trackNumber?.message} />
                      </div>

                      <div className="space-y-1.5">
                        <FormLabel icon={Disc}>Thứ Tự Đĩa (Disk)</FormLabel>
                        <Input
                          type="number"
                          {...register("diskNumber", { valueAsNumber: true })}
                          className={cn(
                            inputClass,
                            "font-mono font-bold",
                            errors.diskNumber && "border-destructive",
                          )}
                        />
                        <ErrorMessage message={errors.diskNumber?.message} />
                      </div>
                    </div>
                  </TabsContent>

                  {/* --- Tab: Lyrics --- */}
                  <TabsContent
                    value="lyrics"
                    className="space-y-4 focus-visible:ring-0 m-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 mb-2">
                      <div className="space-y-1">
                        <Label className="text-[13px] font-bold text-foreground flex items-center gap-2">
                          <AlignLeft className="size-4" /> Khung Nhập Lời Bài
                          Hát
                        </Label>
                        <p className="text-[11px] font-medium text-muted-foreground">
                          Hỗ trợ định dạng LRC để hiển thị karaoke đồng bộ
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="w-fit text-[9px] uppercase font-bold px-2 py-1 border-primary/20 bg-primary/10 text-primary"
                      >
                        LRC Sync Supported
                      </Badge>
                    </div>
                    <Textarea
                      {...register("lyrics")}
                      className={cn(
                        "min-h-[250px] sm:min-h-[350px] font-mono text-[13px] p-4 bg-transparent border-input focus-visible:ring-1 focus-visible:ring-primary rounded-md leading-relaxed resize-none transition-all custom-scrollbar",
                        errors.lyrics &&
                          "border-destructive focus-visible:ring-destructive",
                      )}
                      placeholder="[00:10.00] Nhập lời bài hát dòng theo dòng..."
                    />
                    <ErrorMessage message={errors.lyrics?.message} />
                  </TabsContent>
                </div>
              </Tabs>
            </main>
          </form>
        </div>

        {/* --- FOOTER --- */}
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
              disabled={isLoading}
              className="font-bold border-input bg-background hover:bg-accent hover:text-foreground h-10 px-5 rounded-md flex-1 sm:flex-none"
            >
              Hủy
            </Button>
            <Button
              form="track-form"
              type="submit"
              disabled={isLoading}
              className="font-bold shadow-md hover:shadow-lg transition-all h-10 px-6 rounded-md flex-1 sm:flex-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Đang lưu...
                </>
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  {isEditing ? "Lưu thay đổi" : "Tải lên ngay"}
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

export default TrackModal;
