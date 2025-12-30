import z from "zod";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[0-9a-fA-F]{24}$/, "ID không hợp lệ");

// Helper: Xử lý Boolean từ FormData ("true" -> true)
export const booleanSchema = z.preprocess((val) => {
  if (typeof val === "string") return val === "true";
  return Boolean(val);
}, z.boolean().default(true));

export const arrayFromStringSchema = z.preprocess((val) => {
  if (val === "" || val === undefined || val === "null") return [];

  // 1. Nếu đã là mảng thật (ví dụ body parser tự xử lý) -> OK
  if (Array.isArray(val)) return val;

  // 2. 🔥 QUAN TRỌNG: Nếu là String JSON '["id1", "id2"]' -> Parse nó ra
  if (typeof val === "string" && val.trim().startsWith("[")) {
    try {
      return JSON.parse(val);
    } catch (e) {
      return []; // JSON lỗi thì trả về rỗng
    }
  }

  // 3. Trường hợp còn lại: String đơn "id1" -> Đóng gói vào mảng
  return [val];
}, z.array(objectIdSchema).min(1, "Chọn ít nhất 1 thể loại"));
// Helper: Xử lý Mảng ID (Tracks) từ FormData
export const trackIdsSchema = z.preprocess((val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}, z.array(objectIdSchema).max(100, "Chỉ được thêm tối đa 100 bài hát một lần"));

export const socialLinkSchema = z
  .union([
    z.string().trim().url("Link không đúng định dạng URL"),
    z.literal(""), // Cho phép gửi "" để xóa link
  ])
  .optional();
