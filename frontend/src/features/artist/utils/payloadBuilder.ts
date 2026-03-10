import { ArtistFormValues } from "../schemas/artist.schema";

export const buildArtistPayload = (
  values: ArtistFormValues,
  dirtyFields: Partial<Record<keyof ArtistFormValues, boolean | any>>,
  isEditMode: boolean,
): FormData => {
  const formData = new FormData();

  const append = (key: string, value: any) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  };

  // 1. FILE UPLOAD (Avatar, Cover) - Chỉ gửi nếu là File mới
  if (values.avatar instanceof File) formData.append("avatar", values.avatar);
  if (values.coverImage instanceof File)
    formData.append("coverImage", values.coverImage);

  // 2. GALLERY IMAGES (Phức tạp hơn: Tách file mới và URL cũ)
  // Chỉ xử lý nếu mảng images có thay đổi (dirty) hoặc tạo mới
  if (!isEditMode || dirtyFields.images) {
    const newFiles: File[] = [];
    const keptUrls: string[] = [];

    values.images.forEach((item) => {
      if (item instanceof File) newFiles.push(item);
      else if (typeof item === "string") keptUrls.push(item);
    });

    // Gửi file mới (API backend cần handle array 'images')
    newFiles.forEach((file) => formData.append("images", file));

    // Gửi URL cũ (để backend biết giữ lại cái nào)
    if (keptUrls.length > 0) {
      formData.append("keptImages", JSON.stringify(keptUrls));
    }
  }

  // 3. OTHER FIELDS (Dirty Checking)
  (Object.keys(values) as Array<keyof ArtistFormValues>).forEach((key) => {
    // Bỏ qua các field file đã xử lý ở trên
    if (["avatar", "coverImage", "images"].includes(key)) return;

    if (
      !isEditMode ||
      dirtyFields[key] ||
      (key === "socialLinks" && dirtyFields.socialLinks)
    ) {
      const value = values[key];
      if (typeof value === "object" && value !== null) {
        append(key, JSON.stringify(value)); // Array/Object -> JSON String
      } else {
        append(key, String(value)); // Primitive -> String
      }
    }
  });

  return formData;
};
