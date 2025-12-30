import React from "react";
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
  AlertCircle, // Icon báo lỗi
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Track } from "../types";
import { type TrackFormValues } from "@/features/track/schemas/track.schema";

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

// Hook
import { useTrackForm } from "../hooks/useTrackForm";

interface TrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackToEdit?: Track | null;
  onSubmit: (data: TrackFormValues) => void;
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
    imagePreview,
    audioName,
    duration,
    handleAudioChange,
    formatDuration,
  } = useTrackForm(trackToEdit, isOpen);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = form;

  // --- Watch Form State ---
  const selectedMainArtist = useWatch({ control, name: "artistId" });
  const isPublic = useWatch({ control, name: "isPublic" });
  const isExplicit = useWatch({ control, name: "isExplicit" });

  const mainArtistValue = selectedMainArtist ? [selectedMainArtist] : [];

  // --- Error Handling ---
  const onError = (errors: any) => {
    console.log("Form Validation Errors:", errors);
    // Bạn có thể thêm toast error tại đây nếu muốn báo lỗi chung
  };

  if (!isOpen) return null;

  // --- Helper Components ---

  const FormLabel = ({
    children,
    required,
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <Label className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider ml-0.5 mb-1.5 block">
      {children} {required && <span className="text-destructive">*</span>}
    </Label>
  );

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-destructive animate-in slide-in-from-left-1 fade-in duration-300">
        <AlertCircle className="size-3 shrink-0" />
        <span>{message}</span>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-101 w-full max-w-5xl bg-card border-none sm:border border-border/40 shadow-2xl flex flex-col h-full sm:h-[90vh] max-h-[90vh] rounded-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* --- HEADER --- */}
        <header className="px-6 py-4 border-b border-border/40 flex justify-between items-center bg-background shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
              <Music className="size-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground leading-tight">
                {trackToEdit ? "Metadata Editor" : "Studio Upload"}
              </h3>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                {trackToEdit
                  ? `Ref: ${trackToEdit._id.slice(-8)}`
                  : "New Entry Drafting"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted active:scale-95"
          >
            <X className="size-5 text-muted-foreground" />
          </Button>
        </header>

        {/* --- BODY --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-background/50">
          <form
            id="track-form"
            onSubmit={handleSubmit(onSubmit, onError)}
            className="p-4 sm:p-6 md:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* === SIDEBAR (Media) === */}
              <aside className="lg:col-span-4 space-y-6">
                {/* Artwork */}
                <div>
                  <FormLabel>Cover Artwork</FormLabel>
                  <div
                    className={cn(
                      "relative group aspect-square rounded-2xl border-2 border-dashed overflow-hidden transition-all cursor-pointer",
                      errors.coverImage
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-border/60 bg-muted/10 hover:border-primary/40 hover:bg-muted/20"
                    )}
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Cover"
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground/40">
                        <Disc className="size-12 mb-3 opacity-20" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          Select Image
                        </span>
                      </div>
                    )}
                    {/* Overlay Upload */}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white backdrop-blur-[2px] cursor-pointer">
                      <Camera className="size-8 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Change Cover
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f)
                            setValue("coverImage", f, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                        }}
                      />
                    </label>
                  </div>
                  <ErrorMessage
                    message={errors.coverImage?.message as string}
                  />
                </div>

                {/* Audio File */}
                <div>
                  <FormLabel required>Audio Source</FormLabel>
                  <div
                    className={cn(
                      "relative p-4 rounded-2xl border-2 border-dashed transition-all group active:scale-[0.99] cursor-pointer",
                      errors.audio
                        ? "border-destructive/50 bg-destructive/5"
                        : "border-border/60 bg-muted/10 hover:border-primary/40 hover:bg-muted/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl bg-background flex items-center justify-center text-primary shrink-0 shadow-sm">
                        {duration > 0 ? (
                          <AudioLines className="size-6" />
                        ) : (
                          <FileAudio className="size-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 my-1">
                        <p
                          className={cn(
                            "text-sm font-bold truncate leading-tight",
                            errors.audio
                              ? "text-destructive"
                              : "text-foreground"
                          )}
                        >
                          {audioName || "Upload Audio File"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="secondary"
                            className="h-5 text-[9px] px-1.5 font-mono text-muted-foreground border-border/50"
                          >
                            {duration > 0
                              ? formatDuration(duration)
                              : "HQ Format Supported"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="audio/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleAudioChange}
                    />
                  </div>
                  <ErrorMessage message={errors.audio?.message as string} />
                  {/* Lỗi duration (nếu có) thường đi kèm audio */}
                  <ErrorMessage message={errors.duration?.message} />
                </div>

                {/* Visibility Status */}
                <div className="p-3.5 rounded-xl border border-border/50 bg-card flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isPublic
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Globe className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground leading-none">
                        Visibility Status
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {isPublic ? "Published globally" : "Hidden draft"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={(v) =>
                      setValue("isPublic", v, { shouldDirty: true })
                    }
                  />
                </div>
              </aside>

              {/* === MAIN CONTENT (Tabs) === */}
              <main className="lg:col-span-8">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="bg-muted/30 p-1 rounded-lg mb-6 border border-border/20 w-full sm:w-auto inline-flex h-9">
                    <TabsTrigger
                      value="general"
                      className="flex-1 sm:flex-none gap-2 text-[10px] font-bold uppercase px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm h-7 rounded-md transition-all"
                    >
                      Basic Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="advanced"
                      className="flex-1 sm:flex-none gap-2 text-[10px] font-bold uppercase px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm h-7 rounded-md transition-all"
                    >
                      Advanced
                    </TabsTrigger>
                    <TabsTrigger
                      value="lyrics"
                      className="flex-1 sm:flex-none gap-2 text-[10px] font-bold uppercase px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm h-7 rounded-md transition-all"
                    >
                      Lyrics
                    </TabsTrigger>
                  </TabsList>

                  {/* --- Tab: General --- */}
                  <TabsContent
                    value="general"
                    className="space-y-5 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div>
                      <FormLabel required>Track Title</FormLabel>
                      <Input
                        {...register("title")}
                        className={cn(
                          "h-10 text-base font-medium bg-muted/30 border-transparent focus-visible:ring-0 rounded-lg px-3 placeholder:text-muted-foreground/50 transition-all",
                          errors.title &&
                            "border-destructive/50 bg-destructive/5 focus-visible:border-destructive"
                        )}
                        placeholder="Enter song title..."
                      />
                      <ErrorMessage message={errors.title?.message} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Controller
                        control={control}
                        name="artistId"
                        render={({ field, fieldState }) => (
                          <div>
                            <ArtistSelector
                              label="Primary Artist"
                              singleSelect
                              value={mainArtistValue}
                              error={fieldState.error?.message}
                              required
                              onChange={(ids) => field.onChange(ids[0] || "")}
                            />
                            {/* Nếu Component Selector không hiện lỗi, dùng dòng dưới */}
                            <ErrorMessage message={fieldState.error?.message} />
                          </div>
                        )}
                      />
                      <Controller
                        control={control}
                        name="albumId"
                        render={({ field }) => (
                          <AlbumSelector
                            label="Album Association"
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Controller
                        control={control}
                        name="genreIds"
                        render={({ field, fieldState }) => (
                          <div>
                            <GenreSelector
                              label="Main Genre"
                              value={field.value}
                              onChange={field.onChange}
                              error={fieldState.error?.message}
                              required
                            />
                            <ErrorMessage message={fieldState.error?.message} />
                          </div>
                        )}
                      />
                      <div>
                        <FormLabel>Release Date</FormLabel>
                        <Input
                          type="date"
                          {...register("releaseDate")}
                          className="h-10 rounded-lg bg-muted/30 border-transparent px-3 text-sm"
                        />
                      </div>
                    </div>

                    <Controller
                      control={control}
                      name="featuringArtistIds"
                      render={({ field }) => (
                        <ArtistSelector
                          label="Guest Features (Optional)"
                          singleSelect={false}
                          value={field.value || []}
                          onChange={field.onChange}
                          disabledIds={mainArtistValue}
                        />
                      )}
                    />

                    <div className="pt-4 border-t border-border/40">
                      <div className="flex items-center justify-between p-3 border border-border/50 rounded-xl bg-muted/10 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <ShieldAlert
                            className={cn(
                              "size-4",
                              isExplicit
                                ? "text-amber-500"
                                : "text-muted-foreground/40"
                            )}
                          />
                          <div>
                            <p className="text-xs font-bold leading-none">
                              Explicit Content
                            </p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Mark as parental advisory
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={isExplicit}
                          onCheckedChange={(v) =>
                            setValue("isExplicit", v, { shouldDirty: true })
                          }
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* --- Tab: Advanced --- */}
                  <TabsContent
                    value="advanced"
                    className="space-y-5 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-300"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* ISRC */}
                      <div>
                        <FormLabel>ISRC Code</FormLabel>
                        <Input
                          {...register("isrc")}
                          className={cn(
                            "h-10 font-mono text-xs rounded-lg bg-muted/30 border-transparent px-3",
                            errors.isrc &&
                              "border-destructive/50 bg-destructive/5 focus-visible:border-destructive"
                          )}
                          placeholder="VN-XXX-24-00001"
                        />
                        {/* 🔥 FIX: Hiện lỗi ISRC */}
                        <ErrorMessage message={errors.isrc?.message} />
                      </div>

                      {/* Copyright */}
                      <div>
                        <FormLabel>Copyright Notice</FormLabel>
                        <Input
                          {...register("copyright")}
                          className="h-10 text-xs rounded-lg bg-muted/30 border-transparent px-3"
                          placeholder="℗ 2024 Record Label"
                        />
                        {/* Copyright thường optional nhưng cứ để ErrorMessage phòng khi schema đổi */}
                        <ErrorMessage message={errors.copyright?.message} />
                      </div>
                    </div>

                    {/* Search Tags */}
                    <div>
                      <FormLabel>Search Tags</FormLabel>
                      <Controller
                        name="tags"
                        control={control}
                        render={({ field }) => (
                          <TagInput
                            value={field.value || []}
                            onChange={field.onChange}
                            className="bg-muted/30 border-transparent min-h-10 rounded-lg"
                            placeholder="Add tags..."
                          />
                        )}
                      />
                      <ErrorMessage message={errors.tags?.message} />
                    </div>

                    {/* Track & Disk Number */}
                    <div className="grid grid-cols-2 gap-5">
                      {/* Track Number */}
                      <div>
                        <FormLabel>Track No.</FormLabel>
                        <Input
                          type="number"
                          {...register("trackNumber", { valueAsNumber: true })}
                          className={cn(
                            "h-10 rounded-lg bg-muted/30 border-transparent px-3",
                            errors.trackNumber &&
                              "border-destructive/50 bg-destructive/5 focus-visible:border-destructive"
                          )}
                        />
                        {/* 🔥 FIX: Hiện lỗi Track Number (Nguyên nhân chính bị nhảy) */}
                        <ErrorMessage message={errors.trackNumber?.message} />
                      </div>

                      {/* Disk Number */}
                      <div>
                        <FormLabel>Disk No.</FormLabel>
                        <Input
                          type="number"
                          {...register("diskNumber", { valueAsNumber: true })}
                          className={cn(
                            "h-10 rounded-lg bg-muted/30 border-transparent px-3",
                            errors.diskNumber &&
                              "border-destructive/50 bg-destructive/5 focus-visible:border-destructive"
                          )}
                        />
                        {/* 🔥 FIX: Hiện lỗi Disk Number */}
                        <ErrorMessage message={errors.diskNumber?.message} />
                      </div>
                    </div>
                  </TabsContent>

                  {/* --- Tab: Lyrics --- */}
                  <TabsContent
                    value="lyrics"
                    className="space-y-3 focus-visible:ring-0"
                  >
                    <div className="flex justify-between items-center">
                      <FormLabel>Lyrics Canvas</FormLabel>
                      <Badge
                        variant="outline"
                        className="text-[9px] bg-muted/30 text-muted-foreground uppercase font-bold px-2 py-0.5 border-border/40"
                      >
                        Synced Supported
                      </Badge>
                    </div>
                    <Textarea
                      {...register("lyrics")}
                      className="min-h-[400px] font-mono text-sm p-4 bg-muted/30 border-transparent focus-visible:border-primary/30 focus-visible:ring-0 rounded-xl leading-relaxed resize-none transition-all custom-scrollbar"
                      placeholder="[00:10.00] Enter lyrics line by line..."
                    />
                  </TabsContent>
                </Tabs>
              </main>
            </div>
          </form>
        </div>

        {/* --- FOOTER --- */}
        <footer className="px-6 py-4 border-t border-border/40 bg-background/80 backdrop-blur-sm flex justify-end items-center gap-3 shrink-0 z-20">
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-9 px-6 rounded-lg font-bold text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground transition-all"
          >
            Cancel
          </Button>
          <Button
            form="track-form"
            type="submit"
            // 🔥 Logic mới: Không disable khi thiếu dữ liệu để cho phép hiển thị lỗi
            // Chỉ disable khi đang call API (isPending)
            disabled={isPending}
            loading={isPending}
            className="h-9 px-8 rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95"
          >
            {!isPending && <Save className="size-4 mr-2" />}
            {trackToEdit ? "Save Changes" : "Publish"}
          </Button>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default TrackModal;
