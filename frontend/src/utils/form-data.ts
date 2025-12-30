// src/lib/form-data.ts

export const buildFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    // 1. Bỏ qua undefined/null
    if (value === undefined || value === null) return;

    // 2. Xử lý Mảng (Array)
    if (Array.isArray(value)) {
      // Kiểm tra xem trong mảng có chứa File/Blob không
      const hasFile = value.some(
        (item) => item instanceof File || item instanceof Blob
      );

      if (hasFile) {
        // 🔥 CASE A: Mảng chứa File (VD: Gallery ảnh)
        // Cần append từng item: formData.append('images', file1), formData.append('images', file2)...
        value.forEach((item) => {
          // Lưu ý: Nếu trong mảng có cả File và String (URL ảnh cũ),
          // FormData vẫn chấp nhận append String, nhưng Multer phía BE thường chỉ bắt File.
          // Tốt nhất bạn nên tách ảnh cũ (URL) ra field riêng như 'keptImages' nếu có thể.
          // Nhưng ở đây ta cứ append hết để đảm bảo không mất dữ liệu.
          formData.append(key, item);
        });
      } else {
        // 🔥 CASE B: Mảng dữ liệu thường (VD: Tags, GenreIds)
        // Stringify để Zod phía BE parse (như logic chúng ta đã fix trước đó)
        formData.append(key, JSON.stringify(value));
      }
      return; // Kết thúc xử lý key này
    }

    // 3. Xử lý File đơn lẻ
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    }
    // 4. Xử lý Date
    else if (value instanceof Date) {
      formData.append(key, value.toISOString());
    }
    // 5. Xử lý Object (Nested Object) -> JSON String
    else if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    }
    // 6. Primitives (String, Number, Boolean)
    else {
      formData.append(key, String(value));
    }
  });

  return formData;
};
