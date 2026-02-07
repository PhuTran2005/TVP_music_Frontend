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
  AlertCircle,
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

  const selectedMainArtist = useWatch({ control, name: "artistId" });
  const isPublic = useWatch({ control, name: "isPublic" });
  const isExplicit = useWatch({ control, name: "isExplicit" });

  const mainArtistValue = selectedMainArtist ? [selectedMainArtist] : [];

  const onError = (errors: any) => {
    console.log("Form Validation Errors:", errors);
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
    // Tăng độ đậm của Label (text-foreground/80 thay vì muted)
    <Label className="text-[11px] font-bold uppercase text-foreground/80 tracking-wider ml-0.5 mb-2 block">
      {children}{" "}
      {required && <span className="text-destructive text-sm">*</span>}
    </Label>
  );

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-destructive animate-in slide-in-from-left-1 fade-in duration-300">
        <AlertCircle className="size-3.5 shrink-0" />
        <span>{message}</span>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop: Tối hơn để tăng độ sâu */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container: Thêm border rõ ràng và shadow đậm */}
      <div className="relative z-[101] w-full max-w-5xl bg-background border border-border shadow-2xl flex flex-col h-full sm:h-[90vh] max-h-[90vh] rounded-2xl animate-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-white/10">
        {/* --- HEADER --- */}
        <header className="px-6 py-4 border-b border-border bg-card/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20">
              <Music className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground leading-tight">
                {trackToEdit ? "Metadata Editor" : "Studio Upload"}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex size-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest">
                  {trackToEdit
                    ? `ID: ${trackToEdit._id.slice(-8)}`
                    : "Drafting Mode"}
                </p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-destructive/10 hover:text-destructive active:scale-95 transition-colors"
          >
            <X className="size-5" />
          </Button>
        </header>

        {/* --- BODY --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-secondary/5">
          <form
            id="track-form"
            onSubmit={handleSubmit(onSubmit, onError)}
            className="p-4 sm:p-6 md:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* === SIDEBAR (Media) === */}
              <aside className="lg:col-span-4 space-y-6">
                {/* Artwork */}
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                  <FormLabel>Cover Artwork</FormLabel>
                  <div
                    className={cn(
                      "relative group aspect-square rounded-xl border-2 border-dashed overflow-hidden transition-all cursor-pointer shadow-inner",
                      errors.coverImage
                        ? "border-destructive bg-destructive/5"
                        : "border-border hover:border-primary hover:bg-secondary/50 bg-secondary/20"
                    )}
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Cover"
                          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Gradient Overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                        <Disc className="size-16 mb-4 opacity-50 text-foreground/20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">
                          Upload Image
                        </span>
                      </div>
                    )}
                    {/* Overlay Upload Button */}
                    <label className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10">
                      <div className="bg-background/80 backdrop-blur-md text-foreground p-3 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                        <Camera className="size-6" />
                      </div>
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
                <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                  <FormLabel required>Audio Source</FormLabel>
                  <div
                    className={cn(
                      "relative p-4 rounded-xl border-2 border-dashed transition-all group active:scale-[0.99] cursor-pointer",
                      errors.audio
                        ? "border-destructive bg-destructive/5"
                        : "border-border hover:border-primary hover:bg-secondary/50 bg-secondary/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "size-12 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-border/50",
                          duration > 0
                            ? "bg-primary/10 text-primary"
                            : "bg-background text-muted-foreground"
                        )}
                      >
                        {duration > 0 ? (
                          <AudioLines className="size-6" />
                        ) : (
                          <FileAudio className="size-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm font-bold truncate leading-tight",
                            errors.audio
                              ? "text-destructive"
                              : "text-foreground"
                          )}
                        >
                          {audioName || "Select Audio File"}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge
                            variant="outline"
                            className="h-5 text-[9px] px-1.5 font-mono text-muted-foreground bg-background"
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

                {/* Visibility Status */}
                <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2.5 rounded-lg border",
                        isPublic
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-secondary border-transparent text-muted-foreground"
                      )}
                    >
                      <Globe className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        Visibility
                      </p>
                      <p
                        className={cn(
                          "text-[11px] font-medium mt-0.5",
                          isPublic
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground"
                        )}
                      >
                        {isPublic ? "Published Globally" : "Hidden (Draft)"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isPublic}
                    onCheckedChange={(v) =>
                      setValue("isPublic", v, { shouldDirty: true })
                    }
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
              </aside>

              {/* === MAIN CONTENT (Tabs) === */}
              <main className="lg:col-span-8 bg-card rounded-xl border border-border shadow-sm h-fit">
                <Tabs defaultValue="general" className="w-full">
                  <div className="p-4 border-b border-border">
                    <TabsList className="bg-secondary/50 p-1 rounded-lg w-full sm:w-auto inline-flex h-10 border border-border/50">
                      <TabsTrigger
                        value="general"
                        className="flex-1 sm:flex-none gap-2 text-xs font-bold uppercase px-6 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-8 rounded-md transition-all"
                      >
                        Basic Info
                      </TabsTrigger>
                      <TabsTrigger
                        value="advanced"
                        className="flex-1 sm:flex-none gap-2 text-xs font-bold uppercase px-6 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-8 rounded-md transition-all"
                      >
                        Details
                      </TabsTrigger>
                      <TabsTrigger
                        value="lyrics"
                        className="flex-1 sm:flex-none gap-2 text-xs font-bold uppercase px-6 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-8 rounded-md transition-all"
                      >
                        Lyrics
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6">
                    {/* --- Tab: General --- */}
                    <TabsContent
                      value="general"
                      className="space-y-6 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-1 duration-300 m-0"
                    >
                      <div>
                        <FormLabel required>Track Title</FormLabel>
                        <Input
                          {...register("title")}
                          className={cn(
                            "h-11 text-base font-semibold bg-background border-input shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg px-3 placeholder:text-muted-foreground/60 transition-all",
                            errors.title &&
                              "border-destructive focus-visible:ring-destructive/20 bg-destructive/5"
                          )}
                          placeholder="Ex: Blinding Lights"
                        />
                        <ErrorMessage message={errors.title?.message} />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Controller
                          control={control}
                          name="artistId"
                          render={({ field, fieldState }) => (
                            <div>
                              <ArtistSelector
                                label="Primary Artist"
                                singleSelect
                                value={mainArtistValue}
                                required
                                onChange={(ids) => field.onChange(ids[0] || "")}
                              />
                              <ErrorMessage
                                message={fieldState.error?.message}
                              />
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

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Controller
                          control={control}
                          name="genreIds"
                          render={({ field, fieldState }) => (
                            <div>
                              <GenreSelector
                                label="Main Genre"
                                value={field.value}
                                onChange={field.onChange}
                                required
                              />
                              <ErrorMessage
                                message={fieldState.error?.message}
                              />
                            </div>
                          )}
                        />
                        <div>
                          <FormLabel>Release Date</FormLabel>
                          <Input
                            type="date"
                            {...register("releaseDate")}
                            className="h-10 rounded-lg bg-background border-input shadow-sm px-3 text-sm font-medium"
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

                      <div className="pt-4 border-t border-border">
                        <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-secondary/10">
                          <div className="flex items-center gap-3">
                            <ShieldAlert
                              className={cn(
                                "size-5",
                                isExplicit
                                  ? "text-amber-500 fill-amber-500/20"
                                  : "text-muted-foreground"
                              )}
                            />
                            <div>
                              <p className="text-sm font-bold leading-none text-foreground">
                                Explicit Content
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Contains lyrics or themes for mature audiences
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={isExplicit}
                            onCheckedChange={(v) =>
                              setValue("isExplicit", v, { shouldDirty: true })
                            }
                            className="data-[state=checked]:bg-amber-500"
                          />
                        </div>
                      </div>
                    </TabsContent>

                    {/* --- Tab: Advanced --- */}
                    <TabsContent
                      value="advanced"
                      className="space-y-6 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-1 duration-300 m-0"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <FormLabel>ISRC Code</FormLabel>
                          <Input
                            {...register("isrc")}
                            className={cn(
                              "h-10 font-mono text-sm rounded-lg bg-background border-input shadow-sm px-3 uppercase placeholder:normal-case",
                              errors.isrc &&
                                "border-destructive bg-destructive/5"
                            )}
                            placeholder="VN-XXX-24-00001"
                          />
                          <ErrorMessage message={errors.isrc?.message} />
                        </div>

                        <div>
                          <FormLabel>Copyright Notice</FormLabel>
                          <Input
                            {...register("copyright")}
                            className="h-10 text-sm rounded-lg bg-background border-input shadow-sm px-3"
                            placeholder="℗ 2024 Record Label"
                          />
                          <ErrorMessage message={errors.copyright?.message} />
                        </div>
                      </div>

                      <div>
                        <FormLabel>Search Tags</FormLabel>
                        <Controller
                          name="tags"
                          control={control}
                          render={({ field }) => (
                            <TagInput
                              value={field.value || []}
                              onChange={field.onChange}
                              className="bg-background border-input shadow-sm min-h-10 rounded-lg"
                              placeholder="Add tags (Enter to add)..."
                            />
                          )}
                        />
                        <ErrorMessage message={errors.tags?.message} />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <FormLabel>Track No.</FormLabel>
                          <Input
                            type="number"
                            {...register("trackNumber", {
                              valueAsNumber: true,
                            })}
                            className={cn(
                              "h-10 rounded-lg bg-background border-input shadow-sm px-3",
                              errors.trackNumber &&
                                "border-destructive bg-destructive/5"
                            )}
                          />
                          <ErrorMessage message={errors.trackNumber?.message} />
                        </div>

                        <div>
                          <FormLabel>Disk No.</FormLabel>
                          <Input
                            type="number"
                            {...register("diskNumber", { valueAsNumber: true })}
                            className={cn(
                              "h-10 rounded-lg bg-background border-input shadow-sm px-3",
                              errors.diskNumber &&
                                "border-destructive bg-destructive/5"
                            )}
                          />
                          <ErrorMessage message={errors.diskNumber?.message} />
                        </div>
                      </div>
                    </TabsContent>

                    {/* --- Tab: Lyrics --- */}
                    <TabsContent
                      value="lyrics"
                      className="space-y-3 focus-visible:ring-0 m-0 animate-in fade-in slide-in-from-bottom-1 duration-300"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <FormLabel>Lyrics Canvas</FormLabel>
                        <Badge
                          variant="secondary"
                          className="text-[10px] uppercase font-bold px-2 py-0.5 border border-border"
                        >
                          Synced Supported
                        </Badge>
                      </div>
                      <Textarea
                        {...register("lyrics")}
                        className="min-h-[320px] font-mono text-sm p-4 bg-background border-input shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl leading-relaxed resize-none transition-all custom-scrollbar"
                        placeholder="[00:10.00] Enter lyrics line by line..."
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </main>
            </div>
          </form>
        </div>

        {/* --- FOOTER --- */}
        <footer className="px-6 py-4 border-t border-border bg-background flex justify-end items-center gap-3 shrink-0 z-20">
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-10 px-6 rounded-lg font-bold text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            Cancel
          </Button>
          <Button
            form="track-form"
            type="submit"
            disabled={isPending}
            loading={isPending}
            className="h-10 px-8 rounded-lg font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {!isPending && <Save className="size-4 mr-2" />}
            {trackToEdit ? "Save Changes" : "Publish Track"}
          </Button>
        </footer>
      </div>
    </div>,
    document.body
  );
};

export default TrackModal;
