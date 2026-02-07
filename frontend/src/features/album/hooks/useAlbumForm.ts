import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { albumSchema, type AlbumFormValues } from "../schemas/album.schema";
import type { Album } from "@/features/album/types";
import { mapEntityToForm } from "../utils/formMapper";
import { buildAlbumPayload } from "../utils/payloadBuilder";

interface UseAlbumFormProps {
  albumToEdit?: Album | null;
  onSubmit: (formData: FormData) => Promise<void>; // Inject hàm gọi API vào
}

export const useAlbumForm = ({ albumToEdit, onSubmit }: UseAlbumFormProps) => {
  const defaultValues = useMemo(() => {
    return mapEntityToForm(albumToEdit);
  }, [albumToEdit]);

  // 2. Init Form
  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  // 4. Custom Submit Handler
  const handleSubmit = form.handleSubmit(async (values) => {
    const { dirtyFields } = form.formState;
    const isEditMode = !!albumToEdit;

    // TỐI ƯU BĂNG THÔNG:
    // Nếu đang Edit mà không sửa gì cả (và không up ảnh mới) -> Return luôn
    const hasFile = values.coverImage instanceof File;
    const hasChanges = Object.keys(dirtyFields).length > 0;

    if (isEditMode && !hasChanges && !hasFile) {
      console.log("⚠️ No changes detected, skipping API call.");
      return;
    }

    // Build Payload thông minh (chỉ chứa data thay đổi)
    const payload = buildAlbumPayload(values, dirtyFields, isEditMode);

    
    await onSubmit(payload);
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
  };
};
