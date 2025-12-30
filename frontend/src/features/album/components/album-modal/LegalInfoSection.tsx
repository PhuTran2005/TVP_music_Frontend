import React from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Copyright, Barcode, Building2, Tag } from "lucide-react";
import { type AlbumFormValues } from "@/features/album/schemas/album.schema";
import { TagInput } from "@/components/ui/tag-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LegalInfoSectionProps {
  form: UseFormReturn<AlbumFormValues>;
}

const LegalInfoSection: React.FC<LegalInfoSectionProps> = ({ form }) => {
  const { register, control } = form;

  return (
    <div className="space-y-5 animate-in slide-in-from-right-2 duration-700">
      <h4 className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
        <Copyright className="size-4" /> Legal & Metadata
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground">
            Record Label
          </Label>
          <div className="relative">
            <Building2 className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              {...register("label")}
              placeholder="e.g. Sony Music"
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase text-muted-foreground">
            UPC / EAN
          </Label>
          <div className="relative">
            <Barcode className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              {...register("upc")}
              placeholder="Product Code"
              className="pl-9 font-mono"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase text-muted-foreground">
          Copyright Notice
        </Label>
        <Input
          {...register("copyright")}
          placeholder="e.g. ℗ 2024 Artist Name"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase text-muted-foreground flex items-center gap-1.5">
          Tags <Tag className="size-3" />
        </Label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagInput
              value={field.value || []}
              onChange={field.onChange}
              placeholder="Add tags..."
            />
          )}
        />
      </div>
    </div>
  );
};

export default LegalInfoSection;
