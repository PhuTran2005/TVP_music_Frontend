import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Globe, Lock } from "lucide-react";
import { type AlbumFormValues } from "@/features/album/schemas/album.schema";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { cn } from "@/lib/utils";

interface GeneralInfoSectionProps {
  form: UseFormReturn<AlbumFormValues>;
}

const GeneralInfoSection: React.FC<GeneralInfoSectionProps> = ({ form }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const themeColor = watch("themeColor");
  const isPublic = watch("isPublic");

  return (
    <div className="space-y-5 animate-in slide-in-from-right-2 duration-500">
      {/* Title */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          {...register("title")}
          placeholder="e.g. Midnight Memories"
          className={cn(
            errors.title && "border-destructive focus-visible:ring-destructive"
          )}
        />
        {errors.title && (
          <p className="text-[10px] text-destructive font-medium">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Type (Native Select for simplicity or Shadcn Select) */}
        <div className="space-y-2">
          <Label>Type</Label>
          <select
            {...register("type")}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="album">Album</option>
            <option value="single">Single</option>
            <option value="ep">EP</option>
            <option value="compilation">Compilation</option>
          </select>
        </div>

        {/* Release Date */}
        <div className="space-y-2">
          <Label>Release Date</Label>
          <Input type="date" {...register("releaseDate")} />
        </div>
      </div>

      {/* Status & Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Visibility Status</Label>
          <div
            onClick={() =>
              setValue("isPublic", !isPublic, { shouldDirty: true })
            }
            className={cn(
              "flex items-center justify-between px-3 h-10 rounded-md border cursor-pointer transition-all select-none hover:bg-accent",
              isPublic
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "bg-background"
            )}
          >
            <span
              className={cn(
                "text-sm font-medium",
                isPublic ? "text-emerald-600" : "text-muted-foreground"
              )}
            >
              {isPublic ? "Public" : "Private"}
            </span>
            {isPublic ? (
              <Globe className="size-4 text-emerald-500" />
            ) : (
              <Lock className="size-4 text-muted-foreground" />
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Theme Color</Label>
          <div className="flex gap-2">
            <div
              className="size-10 rounded-md border shadow-sm shrink-0"
              style={{ backgroundColor: themeColor || "#000000" }}
            />
            <div className="flex-1 relative">
              <Input
                type="color"
                {...register("themeColor")}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Input
                value={themeColor}
                readOnly
                className="font-mono text-xs uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          {...register("description")}
          rows={4}
          placeholder="Brief description about this album..."
          className="resize-none"
        />
      </div>
    </div>
  );
};

export default GeneralInfoSection;
