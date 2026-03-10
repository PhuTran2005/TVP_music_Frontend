import { z } from "zod";

// ==========================================
// CONSTANTS & RULES
// ==========================================
const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg", // mp3
  "audio/wav",
  "audio/flac",
  "audio/mp4",
  "audio/x-m4a",
  "audio/aac",
];

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// ==========================================
// REUSABLE SCHEMAS (DRY Principle)
// ==========================================

// 1. Xử lý ID Rỗng từ Select/FormData -> Trả về null an toàn
const relationIdSchema = z
  .string()
  .trim()
  .transform((val) =>
    val === "" || val === "null" || val === "undefined" ? null : val,
  )
  .nullable()
  .optional();

// 2. Xử lý Chuỗi rỗng -> undefined (Dành cho Optional Text)
const optionalTextSchema = (maxLength: number, errorMsg: string) =>
  z
    .string()
    .trim()
    .max(maxLength, errorMsg)
    .optional()
    .nullable()
    .transform((val) => (val === "" ? undefined : val));

// 3. Schema cho Tags & Thể loại
const tagsSchema = z
  .array(z.string().trim().max(30, "Mỗi tag tối đa 30 ký tự"))
  .max(20, "Chỉ được thêm tối đa 20 tags")
  .default([]);

const genreIdsSchema = z
  .array(z.string().trim())
  .min(1, "Vui lòng chọn ít nhất 1 thể loại")
  .max(10, "Chỉ chọn tối đa 10 thể loại");

// 4. Schema cho Image
const imageSchema = z
  .union([
    z
      .instanceof(File)
      .refine((file) => file.size <= MAX_IMAGE_SIZE, "Ảnh cover tối đa 5MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Định dạng ảnh không hỗ trợ (Chỉ nhận JPG, PNG, WEBP)",
      ),
    z.string().url("Đường dẫn ảnh không hợp lệ"),
    z.null(),
  ])
  .optional()
  .nullable();

// ==========================================
// MAIN SCHEMAS
// ==========================================

/**
 * SCHEMA: Tạo / Cập nhật 1 bài hát
 */
export const trackSchema = z.object({
  // --- 1. BASIC INFO ---
  title: z
    .string({ required_error: "Vui lòng nhập tên bài hát" })
    .trim()
    .min(1, "Tên bài hát không được để trống")
    .max(200, "Tên bài hát quá dài (Tối đa 200 ký tự)"),

  description: optionalTextSchema(2000, "Mô tả tối đa 2000 ký tự"),
  lyrics: optionalTextSchema(10000, "Lời bài hát quá dài (Tối đa 10000 ký tự)"),

  // --- 2. RELATIONSHIPS ---
  artistId: z.string().trim().min(1, "Vui lòng chọn Nghệ sĩ chính"),

  featuringArtistIds: z
    .array(z.string().trim())
    .max(20, "Tối đa 20 nghệ sĩ hợp tác")
    .default([]),

  albumId: relationIdSchema,

  genreIds: genreIdsSchema,

  // --- 3. METADATA ---
  releaseDate: z.string().default(() => new Date().toISOString()),
  isExplicit: z.boolean().default(false),
  isPublic: z.boolean().default(true),

  trackNumber: z.coerce
    .number()
    .int()
    .min(1, "Track Number tối thiểu là 1")
    .default(1),
  diskNumber: z.coerce
    .number()
    .int()
    .min(1, "Disk Number tối thiểu là 1")
    .default(1),
  duration: z.coerce.number().min(0).default(0),

  // --- 4. ADVANCED INFO ---
  copyright: optionalTextSchema(500, "Thông tin bản quyền quá dài"),

  isrc: z
    .string()
    .trim()
    .optional()
    .nullable()
    // Chuyển chuỗi rỗng thành undefined trước, nếu có chữ mới check Regex
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) => val === undefined || /^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/.test(val),
      "Mã ISRC không hợp lệ (VD: USRC17609839)",
    ),

  tags: tagsSchema,

  // --- 5. FILES ---
  audio: z
    .union([z.instanceof(File), z.string(), z.undefined(), z.null()])
    .refine((file) => {
      if (file instanceof File) return file.size <= MAX_AUDIO_SIZE;
      return true;
    }, "File nhạc quá lớn (Tối đa 100MB)")
    .refine((file) => {
      if (file instanceof File) return ACCEPTED_AUDIO_TYPES.includes(file.type);
      return true;
    }, "Định dạng âm thanh không hỗ trợ (Chỉ nhận MP3, WAV, FLAC, M4A, AAC)"),

  coverImage: imageSchema,
});

/**
 * SCHEMA: Cập nhật hàng loạt (Bulk Edit)
 */
export const bulkTrackSchema = z.object({
  // Đều là optional, nếu Client không gửi -> Giữ nguyên trong DB
  genreIds: genreIdsSchema.optional(),

  tags: tagsSchema.optional(),

  releaseDate: z.string().datetime("Ngày phát hành không hợp lệ").optional(),

  isPublic: z.boolean().optional(),
  isExplicit: z.boolean().optional(),

  // Cần dùng relationIdSchema để hỗ trợ hành động: Gửi null/"" để gỡ bài khỏi Album
  albumId: relationIdSchema,

  featuringArtistIds: z
    .array(z.string().trim())
    .max(20, "Tối đa 20 nghệ sĩ hợp tác")
    .optional(),

  coverImage: imageSchema,
});

export type BulkTrackFormValues = z.infer<typeof bulkTrackSchema>;
export type TrackFormValues = z.infer<typeof trackSchema>;
