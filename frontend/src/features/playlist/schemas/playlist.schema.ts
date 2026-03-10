import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Tách riêng Image Schema để code gọn gàng, dễ bảo trì
const imageSchema = z
  .union([
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "Kích thước ảnh tối đa 5MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Định dạng không hỗ trợ (Chỉ nhận JPG, PNG, WEBP)",
      ),
    z.string().url("Đường dẫn ảnh không hợp lệ"), // Hỗ trợ kiểm tra URL cũ lúc Edit
    z.null(),
  ])
  .optional()
  .nullable();

export const playlistSchema = z.object({
  // ==========================================
  // 1. THÔNG TIN CƠ BẢN
  // ==========================================
  title: z
    .string({ required_error: "Vui lòng nhập tên Playlist" })
    .trim()
    .min(1, "Tên Playlist không được để trống")
    .max(100, "Tên Playlist quá dài (tối đa 100 ký tự)"),

  description: z
    .string()
    .trim()
    .max(2000, "Mô tả quá dài (Tối đa 2000 ký tự)")
    .optional()
    .nullable()
    // 🔥 BIẾN CHUỖI RỖNG THÀNH UNDEFINED: Giúp DB không bị lưu các chuỗi "" vô nghĩa
    .transform((val) => (val === "" ? undefined : val)),
  // ==========================================
  // 2. METADATA VÀ HIỂN THỊ
  // ==========================================
  themeColor: z
    .string()
    .trim()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Mã màu Hex không hợp lệ (VD: #1DB954)")
    .default("#1db954"),

  visibility: z
    .enum(["public", "private", "unlisted"], {
      errorMap: () => ({ message: "Trạng thái hiển thị không hợp lệ" }),
    })
    .default("public"),

  type: z
    .enum(["playlist", "radio", "mix"], {
      errorMap: () => ({ message: "Loại danh sách phát không hợp lệ" }),
    })
    .default("playlist"),

  // ==========================================
  // 3. DANH SÁCH (MẢNG)
  // ==========================================
  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag không được để trống")
        .max(30, "Mỗi tag tối đa 30 ký tự"),
    )
    // 🔥 CHỐNG SPAM: Khóa số lượng tag tối đa
    .max(20, "Chỉ được thêm tối đa 20 thẻ tags")
    .default([]),

  collaborators: z
    .array(z.string().trim())
    .max(50, "Tối đa 50 người cùng cộng tác")
    .default([]),

  // ==========================================
  // 4. CẤU HÌNH HỆ THỐNG
  // ==========================================
  isSystem: z.boolean().default(false),

  // ==========================================
  // 5. MEDIA
  // ==========================================
  coverImage: imageSchema,
});

export type PlaylistFormValues = z.infer<typeof playlistSchema>;
