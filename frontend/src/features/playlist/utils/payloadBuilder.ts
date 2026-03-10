import { PlaylistFormValues } from "../schemas/playlist.schema";

export const buildPlaylistPayload = (
  values: PlaylistFormValues,
  dirtyFields: Partial<Record<keyof PlaylistFormValues, boolean | any>>,
  isEditMode: boolean,
): FormData => {
  const formData = new FormData();

  const append = (key: string, value: any) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  };

  // 1. Logic Ảnh: Luôn gửi nếu là File mới
  if (values.coverImage instanceof File) {
    formData.append("coverImage", values.coverImage);
  }

  // 2. Logic Fields khác: Chỉ gửi nếu Create mới HOẶC Field đó bị thay đổi (Dirty)
  (Object.keys(values) as Array<keyof PlaylistFormValues>).forEach((key) => {
    if (key === "coverImage") return;

    if (!isEditMode || dirtyFields[key]) {
      const value = values[key];
      if (Array.isArray(value)) {
        append(key, JSON.stringify(value)); // Mảng -> JSON String
      } else {
        append(key, String(value)); // Primitive -> String
      }
    }
  });

  return formData;
};
