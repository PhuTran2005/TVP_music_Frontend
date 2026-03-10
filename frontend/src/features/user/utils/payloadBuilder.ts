import { AdminUserFormValues } from "../schemas/user.schema";

export const buildUserPayload = (
  values: AdminUserFormValues,
  dirtyFields: Partial<Record<keyof AdminUserFormValues, boolean | any>>,
  isEditMode: boolean,
): FormData => {
  const formData = new FormData();

  const append = (key: string, value: any) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  };

  // 1. File Handling
  if (values.avatar instanceof File) {
    formData.append("avatar", values.avatar);
  }

  // 2. Data Fields
  (Object.keys(values) as Array<keyof AdminUserFormValues>).forEach((key) => {
    if (key === "avatar") return;

    // Dirty Checking: Chỉ gửi field thay đổi (hoặc gửi hết nếu là create)
    if (!isEditMode || dirtyFields[key]) {
      const value = values[key];

      // Xử lý boolean sang string để gửi qua FormData
      if (typeof value === "boolean") {
        append(key, String(value));
      } else {
        append(key, String(value));
      }
    }
  });

  return formData;
};
