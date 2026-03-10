import { GenreFormValues } from "../schemas/genre.schema";

export const buildGenrePayload = (
  values: GenreFormValues,
  dirtyFields: Partial<Record<keyof GenreFormValues, boolean | any>>,
  isEditMode: boolean,
): FormData => {
  const formData = new FormData();

  const append = (key: string, value: any) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  };

  // 1. File Upload: Chỉ gửi nếu là File mới
  if (values.image instanceof File) {
    formData.append("image", values.image);
  }

  // 2. Các field khác: Chỉ gửi nếu thay đổi (Dirty Checking)
  (Object.keys(values) as Array<keyof GenreFormValues>).forEach((key) => {
    if (key === "image") return; // Đã xử lý ở trên

    if (!isEditMode || dirtyFields[key]) {
      const value = values[key];
      append(key, String(value)); // Convert primitive to string
    }
  });

  return formData;
};
