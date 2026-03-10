import { TrackFormValues } from "../schemas/track.schema";

export const buildTrackPayload = (
  values: TrackFormValues,
  dirtyFields: Partial<Record<keyof TrackFormValues, boolean | any>>,
  isEditMode: boolean,
): FormData => {
  const formData = new FormData();

  /**
   * 🔥 CHIẾN THUẬT: PHÂN LOẠI DATA
   * Chúng ta sẽ gom data thành 2 nhóm: Text và File.
   * Luôn append nhóm Text TRƯỚC nhóm File.
   */
  const textFieldData: Record<string, string> = {};
  const fileFieldData: Record<string, File> = {};

  // 1. DUYỆT VÀ PHÂN LOẠI
  (Object.keys(values) as Array<keyof TrackFormValues>).forEach((key) => {
    const value = values[key];

    // Kiểm tra Dirty logic (Edit mode)
    const isDirty = !!dirtyFields[key];
    const isNewFile = value instanceof File;
    const shouldSend = !isEditMode || isDirty || isNewFile;

    if (!shouldSend || value === undefined || value === null) return;

    // Phân loại vào nhóm File
    if (isNewFile) {
      fileFieldData[key] = value as File;
      // Đặc biệt cho Audio: Gửi kèm duration (vì duration tính từ file)
      if (key === "audio") {
        textFieldData["duration"] = String(values.duration);
      }
    }
    // Phân loại vào nhóm Text
    else {
      // Bỏ qua value cũ là string (URL ảnh/nhạc cũ) khi đang ở edit mode
      if (
        typeof value === "string" &&
        (key === "audio" || key === "coverImage")
      )
        return;

      if (Array.isArray(value)) {
        textFieldData[key] = JSON.stringify(value);
      } else if (key === "releaseDate" && value) {
        textFieldData[key] = new Date(value as string).toISOString();
      } else {
        textFieldData[key] = String(value);
      }
    }
  });

  // Ưu tiên append Title đầu tiên để Multer/S3 có slug ngay lập tức
  if (textFieldData["title"]) {
    formData.append("title", textFieldData["title"]);
    delete textFieldData["title"];
  }

  Object.entries(textFieldData).forEach(([key, val]) => {
    formData.append(key, val);
  });

  // 3. APPEND FILE FIELDS SAU CÙNG
  Object.entries(fileFieldData).forEach(([key, file]) => {
    formData.append(key, file);
  });

  return formData;
};
