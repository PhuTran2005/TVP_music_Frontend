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

  // 1. Init Form
  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues,
    mode: "onSubmit", // Chỉ validate khi user ấn submit
  });

  // 2. Reset form khi data đầu vào thay đổi (Dùng khi mở Modal Edit)
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  // 3. Custom Submit Handler
  const handleSubmit = form.handleSubmit(async (values) => {
    const { dirtyFields } = form.formState;
    const isEditMode = !!albumToEdit;

    const hasFile = values.coverImage instanceof File;
    const hasChanges = Object.keys(dirtyFields).length > 0;

    // TỐI ƯU BĂNG THÔNG
    if (isEditMode && !hasChanges && !hasFile) {
      console.log("⚠️ Không có thay đổi nào, bỏ qua gọi API.");
      // Tùy chọn: Gọi 1 hàm onClose() ở đây nếu muốn tự đóng modal
      return;
    }

    console.log("Dirty fields (Các trường đã sửa):", dirtyFields);

    // Build Payload
    const payload = buildAlbumPayload(values, dirtyFields, isEditMode);
    console.log("🚀 Submitting Album Payload:", payload);

    // MỞ COMMENT DÒNG NÀY ĐỂ GỌI API
    await onSubmit(payload);
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
  };
};
