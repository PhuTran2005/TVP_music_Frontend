import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Save, Loader2, Disc3, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// Components
import CoverUpload from "./CoverUpload";
import GeneralInfoSection from "./GeneralInfoSection";
import RelationSection from "./RelationSection";
import LegalInfoSection from "./LegalInfoSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Logic
import { useAlbumForm } from "@/features/album/hooks/useAlbumForm";
import type { AlbumFormValues } from "@/features/album/schemas/album.schema";
import { Album } from "@/features/album/types";

interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumToEdit?: Album | null;
  onSubmit: (data: AlbumFormValues) => void;
  isPending: boolean;
}

const AlbumModal: React.FC<AlbumModalProps> = ({
  isOpen,
  onClose,
  albumToEdit,
  onSubmit,
  isPending,
}) => {
  const { form } = useAlbumForm({ isOpen, albumToEdit });
  const isPublic = form.watch("isPublic");

  // Lock scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Container */}
      <div className="relative z-10 w-full max-w-5xl bg-card border border-border rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* --- HEADER --- */}
        <div className="shrink-0 px-6 py-4 border-b flex justify-between items-center bg-muted/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Disc3 className="size-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                {albumToEdit ? "Edit Album Metadata" : "Create New Album"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {albumToEdit
                  ? `Updating: ${albumToEdit.title}`
                  : "Fill in the details to create a new album release."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Public Toggle Badge */}
            <Badge
              variant={isPublic ? "outline" : "secondary"}
              className={cn(
                "cursor-pointer hidden sm:flex gap-1.5 py-1",
                isPublic
                  ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                  : "text-muted-foreground"
              )}
              onClick={() => form.setValue("isPublic", !isPublic)}
            >
              {isPublic ? (
                <Globe className="size-3" />
              ) : (
                <Lock className="size-3" />
              )}
              {isPublic ? "Public" : "Private"}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* --- BODY --- */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form
            id="album-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col lg:flex-row gap-8"
          >
            {/* LEFT COLUMN: Visuals & Relations (35%) */}
            <div className="w-full lg:w-[35%] shrink-0 space-y-6">
              <CoverUpload form={form} />

              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <RelationSection form={form} />
              </div>
            </div>

            {/* RIGHT COLUMN: Info & Legal (65%) */}
            <div className="w-full lg:w-[65%] space-y-8">
              <GeneralInfoSection form={form} />
              <div className="border-t pt-6">
                <LegalInfoSection form={form} />
              </div>
            </div>
          </form>
        </div>

        {/* --- FOOTER --- */}
        <div className="shrink-0 px-6 py-4 border-t bg-muted/10 flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="album-form"
            disabled={isPending}
            className="gap-2 shadow-sm"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {albumToEdit ? "Save Changes" : "Create Album"}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default AlbumModal;
