import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB cho icon genre là đủ
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml", // Rất tốt, vì Genre thường dùng SVG làm icon
];
const HEX_COLOR_REGEX = /^#([0-9A-F]{3}){1,2}$/i;

// Tách riêng Image Schema để dễ tái sử dụng và đọc code
const imageSchema = z
  .union([
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "Kích thước ảnh tối đa 2MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Chỉ hỗ trợ định dạng JPG, PNG, WEBP hoặc SVG",
      ),
    z.string().url("Đường dẫn ảnh không hợp lệ"), // Hỗ trợ kiểm tra URL cũ
    z.null(),
  ])
  .optional()
  .nullable();

export const genreSchema = z.object({
  // ==========================================
  // 1. THÔNG TIN CƠ BẢN
  // ==========================================
  name: z
    .string({ required_error: "Vui lòng nhập tên thể loại" })
    .trim()
    .min(2, "Tên thể loại tối thiểu 2 ký tự")
    .max(50, "Tên thể loại tối đa 50 ký tự"),

  description: z
    .string()
    .trim()
    .max(200, "Mô tả tối đa 200 ký tự")
    .optional()
    .nullable()
    // 🔥 BIẾN CHUỖI RỖNG THÀNH UNDEFINED: Giúp DB sạch sẽ, không lưu chuỗi ""
    .transform((val) => (val === "" ? undefined : val)),

  // ==========================================
  // 2. GIAO DIỆN (VISUALS)
  // ==========================================
  color: z
    .string()
    .trim()
    .regex(HEX_COLOR_REGEX, "Mã màu không hợp lệ (VD: #1DB954)")
    .default("#1db954"), // Nên để màu mặc định thân thiện hơn màu đen (#000000)

  gradient: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((val) => (val === "" ? undefined : val)),

  // ==========================================
  // 3. CẤU TRÚC & PHÂN LOẠI
  // ==========================================
  parentId: z
    .string()
    .trim()
    .optional()
    .nullable()
    // 🔥 FIX LỖI FORMDATA: Tự động dọn dẹp các giá trị rác do Frontend/Select tạo ra
    // trước khi nó được build thành FormData
    .transform((val) => {
      if (val === "" || val === "null" || val === "undefined") return null;
      return val;
    }),

  priority: z.coerce
    .number({ invalid_type_error: "Độ ưu tiên phải là số" })
    .int("Độ ưu tiên phải là số nguyên")
    .min(0, "Độ ưu tiên không được âm (Nhỏ nhất là 0)")
    .max(100, "Độ ưu tiên tối đa là 100")
    .default(0),

  isTrending: z.boolean().default(false),

  // ==========================================
  // 4. MEDIA
  // ==========================================
  image: imageSchema,
});

export type GenreFormValues = z.infer<typeof genreSchema>;
