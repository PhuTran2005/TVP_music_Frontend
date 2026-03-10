import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Artist } from "../types";
import { artistSchema, type ArtistFormValues } from "../schemas/artist.schema";
import { mapEntityToForm } from "../utils/formMapper";
import { buildArtistPayload } from "../utils/payloadBuilder";

interface UseArtistFormProps {
  artistToEdit?: Artist | null;
  onSubmit: (formData: FormData) => Promise<void>;
}

export const useArtistForm = ({
  artistToEdit,
  onSubmit,
}: UseArtistFormProps) => {
  const defaultValues = useMemo(() => {
    return mapEntityToForm(artistToEdit);
  }, [artistToEdit]);

  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(artistSchema),
    defaultValues,
    mode: "onSubmit",
  });

  // Reset form khi thay đổi artistToEdit (ví dụ mở modal edit khác)
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const { dirtyFields } = form.formState;
    const isEditMode = !!artistToEdit;

    // --- OPTIMIZATION: DIRTY CHECKING ---
    // Kiểm tra xem có file nào mới được chọn không
    const hasFiles =
      values.avatar instanceof File ||
      values.coverImage instanceof File ||
      values.images.some((img) => img instanceof File);

    const hasChanges = Object.keys(dirtyFields).length > 0;

    // Nếu không có thay đổi gì cả -> Return ngay
    if (isEditMode && !hasChanges && !hasFiles) {
      return;
    }
    console.log("Dirty fields (Các trường đã sửa):", dirtyFields);
    // Build Payload
    const payload = buildArtistPayload(values, dirtyFields, isEditMode);
    console.log("🚀 Submitting Artist Payload:", values);
    await onSubmit(payload);
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
  };
};
