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

// Logic
import { useAlbumForm } from "@/features/album/hooks/useAlbumForm";
import { Album } from "@/features/album/types";
import { Form } from "@/components/ui/form"; // Đảm bảo import Form từ shadcn

interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumToEdit?: Album | null;
  // 🔥 UPDATE: Type đổi thành FormData để khớp với hook mới
  onSubmit: (data: FormData) => Promise<void>;
  isPending: boolean;
}

const AlbumModal: React.FC<AlbumModalProps> = ({
  isOpen,
  onClose,
  albumToEdit,
  onSubmit,
  isPending,
}) => {
  const {
    form,
    handleSubmit,
    isSubmitting: isFormSubmitting, // Lấy trạng thái submitting nội bộ của form
  } = useAlbumForm({
    albumToEdit,
    onSubmit,
  });

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
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Container */}
      <div className="relative z-10 w-full max-w-5xl bg-background border border-border rounded-xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-white/10">
        {/* --- HEADER --- */}
        <div className="shrink-0 px-6 py-4 border-b border-border bg-background flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/20 shadow-sm">
              <Disc3 className="size-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-lg font-bold leading-none tracking-tight text-foreground">
                {albumToEdit ? "Edit Album Metadata" : "Create New Album"}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {albumToEdit
                  ? `Ref: ${albumToEdit.title}`
                  : "Studio Release Manager"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={cn(
                "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none",
                isPublic
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-secondary border-border text-muted-foreground hover:bg-secondary/80",
              )}
              onClick={() =>
                form.setValue("isPublic", !isPublic, { shouldDirty: true })
              }
            >
              {isPublic ? (
                <Globe className="size-3.5" />
              ) : (
                <Lock className="size-3.5" />
              )}
              <span className="text-xs font-bold uppercase tracking-wide">
                {isPublic ? "Public" : "Private"}
              </span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {/* --- BODY --- */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-muted/20">
          {/* Bọc Form Provider của Shadcn/RHF */}
          <Form {...form}>
            <form
              id="album-form"
              // 🔥 UPDATE: Dùng handleSubmit từ hook (đã xử lý FormData)
              // Không dùng form.handleSubmit(onSubmit) nữa
              onSubmit={handleSubmit}
              className="flex flex-col lg:flex-row gap-6"
            >
              {/* LEFT COLUMN: Visuals & Relations */}
              <div className="w-full lg:w-[35%] shrink-0 space-y-6">
                <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
                  <CoverUpload form={form} />
                </div>

                <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider mb-2">
                    Associations
                  </h4>
                  <RelationSection form={form} />
                </div>
              </div>

              {/* RIGHT COLUMN: Info & Legal */}
              <div className="w-full lg:w-[65%] space-y-6">
                <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
                  <GeneralInfoSection form={form} />
                </div>

                <div className="bg-background border border-border rounded-xl p-6 shadow-sm">
                  <LegalInfoSection form={form} />
                </div>
              </div>
            </form>
          </Form>
        </div>

        {/* --- FOOTER --- */}
        <div className="shrink-0 px-6 py-4 border-t border-border bg-background flex justify-end gap-3 z-20">
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            className="font-semibold text-muted-foreground hover:text-foreground"
            disabled={isPending || isFormSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="album-form"
            // Kết hợp cả trạng thái từ Parent (API mutation) và Internal Form
            disabled={isPending || isFormSubmitting}
            className="gap-2 shadow-md hover:shadow-lg transition-all font-bold px-6"
          >
            {isPending || isFormSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {albumToEdit ? "Save Changes" : "Publish Album"}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AlbumModal;
