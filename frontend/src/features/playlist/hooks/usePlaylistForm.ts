import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Playlist } from "../types";
import {
  playlistSchema,
  type PlaylistFormValues,
} from "../schemas/playlist.schema";
import { mapEntityToForm } from "../utils/formMapper";
import { buildPlaylistPayload } from "../utils/payloadBuilder";

interface UsePlaylistFormProps {
  playlistToEdit?: Playlist | null;
  onSubmit: (formData: FormData) => Promise<void>;
}

export const usePlaylistForm = ({
  playlistToEdit,
  onSubmit,
}: UsePlaylistFormProps) => {
  // 1. Memoize default values để tránh tính toán lại mỗi lần render
  const defaultValues = useMemo(() => {
    return mapEntityToForm(playlistToEdit);
  }, [playlistToEdit]);

  // 2. Init Form với Zod Resolver
  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(playlistSchema),
    defaultValues,
    mode: "onSubmit", // Validate khi submit để tối ưu performance
  });

  // 3. Reset form khi data đầu vào thay đổi (Ví dụ: mở modal edit khác)
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  // 4. Custom Submit Handler
  const handleSubmit = form.handleSubmit(async (values) => {
    const { dirtyFields } = form.formState;
    const isEditMode = !!playlistToEdit;

    // --- OPTIMIZATION: DIRTY CHECKING ---
    // Nếu đang Edit mà không có field nào thay đổi (và không up ảnh mới) -> Bỏ qua
    const hasFile = values.coverImage instanceof File;
    const hasChanges = Object.keys(dirtyFields).length > 0;

    if (isEditMode && !hasChanges && !hasFile) {
      return;
    }

    // Build Payload (FormData)
    const payload = buildPlaylistPayload(values, dirtyFields, isEditMode);

    await onSubmit(payload);
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
  };
};
