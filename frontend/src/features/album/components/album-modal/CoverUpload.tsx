import React, { useState, useEffect } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { type UseFormReturn } from "react-hook-form";
import type { AlbumFormValues } from "@/features/album/schemas/album.schema";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CoverUploadProps {
  form: UseFormReturn<AlbumFormValues>;
}

const CoverUpload: React.FC<CoverUploadProps> = ({ form }) => {
  const { watch, setValue } = form;
  const coverValue = watch("coverImage");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (coverValue instanceof File) {
      const url = URL.createObjectURL(coverValue);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof coverValue === "string") {
      setPreview(coverValue);
    } else {
      setPreview(null);
    }
  }, [coverValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("coverImage", file, { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <div className="space-y-2">
      <Label>Album Cover</Label>

      <div className="relative group aspect-square w-full rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all overflow-hidden bg-muted/20 flex items-center justify-center">
        {preview ? (
          <img
            src={preview}
            alt="Cover Preview"
            className="w-full h-full object-cover transition-opacity group-hover:opacity-75"
          />
        ) : (
          <div className="text-center p-4 flex flex-col items-center">
            <div className="p-3 bg-background rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
              <ImageIcon className="size-6 text-muted-foreground" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Click to upload
            </span>
          </div>
        )}

        {/* Input Overlay */}
        <input
          type="file"
          accept="image/*"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          onChange={handleFileChange}
        />

        {/* Action Button (Remove) */}
        {preview && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 z-20 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            onClick={(e) => {
              e.stopPropagation(); // Ngăn mở file dialog
              setValue("coverImage", null, { shouldDirty: true });
            }}
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground text-center">
        Recommended: 1000x1000px (JPG, PNG). Max 5MB.
      </p>
    </div>
  );
};

export default CoverUpload;
