import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// ==========================================
// 1. REUSABLE SCHEMAS (Chuẩn hóa)
// ==========================================

// Chuẩn hóa Link MXH: Biến chuỗi rỗng "" thành undefined để DB sạch sẽ
const socialLinkSchema = z
  .string()
  .trim()
  .url("Định dạng link không hợp lệ")
  .optional()
  .or(z.literal(""))
  .transform((val) => (val === "" ? undefined : val));

// Chuẩn hóa File Ảnh Đơn (Avatar, Cover)
const imageSchema = z
  .union([
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, "Kích thước ảnh tối đa 5MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Định dạng không hỗ trợ (Chỉ nhận JPG, PNG, WEBP)",
      ),
    z.string(), // Dành cho URL cũ khi Edit
    z.null(),
  ])
  .optional()
  .nullable();

// Lõi chuẩn hóa File cho mảng Gallery (Bắt buộc phải validate lại File ở đây)
const galleryItemSchema = z.union([
  z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Mỗi ảnh tối đa 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Định dạng ảnh không hỗ trợ",
    ),
  z.string(), // URL cũ
]);

// ==========================================
// 2. MAIN ARTIST SCHEMA
// ==========================================

export const artistSchema = z.object({
  // THÔNG TIN CƠ BẢN
  name: z
    .string({ required_error: "Vui lòng nhập tên nghệ sĩ" })
    .trim()
    .min(2, "Tên nghệ sĩ tối thiểu 2 ký tự")
    .max(100, "Tên nghệ sĩ quá dài (Tối đa 100 ký tự)"),

  aliases: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Alias không được để trống")
        .max(50, "Alias tối đa 50 ký tự"),
    )
    .max(10, "Chỉ được nhập tối đa 10 tên gọi khác")
    .default([]),

  nationality: z
    .string()
    .trim()
    .min(1, "Vui lòng chọn quốc tịch")
    .default("VN"),

  // LIÊN KẾT
  genreIds: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất 1 thể loại")
    .max(5, "Chỉ được chọn tối đa 5 thể loại chính"),

  userId: z
    .string()
    .trim()
    .optional()
    .nullable()
    // Quan trọng: Tránh gửi "" cho trường ObjectId của DB
    .transform((val) => (val === "" ? undefined : val)),

  // CHI TIẾT
  bio: z
    .string()
    .trim()
    .max(3000, "Tiểu sử tối đa 3000 ký tự")
    .optional()
    .nullable()
    .transform((val) => (val === "" ? undefined : val)),

  themeColor: z
    .string()
    .trim()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Mã màu Hex không hợp lệ")
    .default("#ffffff"),

  // TRẠNG THÁI
  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),

  // MẠNG XÃ HỘI
  socialLinks: z
    .object({
      facebook: socialLinkSchema,
      instagram: socialLinkSchema,
      twitter: socialLinkSchema,
      website: socialLinkSchema,
      spotify: socialLinkSchema,
      youtube: socialLinkSchema,
    })
    .optional(),

  // MEDIA (Hình ảnh)
  avatar: imageSchema,
  coverImage: imageSchema,

  // Gallery: Bây giờ đã an toàn, kiểm tra chặt chẽ File và khóa giới hạn 10 ảnh
  images: z
    .array(galleryItemSchema)
    .max(10, "Chỉ được phép đăng tải tối đa 10 ảnh Gallery")
    .default([]),
});

export type ArtistFormValues = z.infer<typeof artistSchema>;
