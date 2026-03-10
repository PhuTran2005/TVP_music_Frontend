import { z } from "zod";

// Các hằng số cấu hình giới hạn
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const albumTypes = ["album", "single", "ep", "compilation"] as const;

export const albumSchema = z.object({
  // 1. THÔNG TIN CHÍNH
  title: z
    .string({ required_error: "Vui lòng nhập tên album" })
    .trim()
    .min(1, "Tên album không được để trống")
    .max(100, "Tên album không được vượt quá 100 ký tự"),

  description: z
    .string()
    .trim()
    .max(2000, "Mô tả không được vượt quá 2000 ký tự")
    .optional()
    .nullable()
    // Trick: Nếu ô input trả về chuỗi rỗng "", tự động ép thành undefined để hợp lệ với optional
    .transform((val) => (val === "" ? undefined : val)),

  type: z
    .enum(albumTypes, {
      invalid_type_error: "Loại đĩa không hợp lệ",
    })
    .default("album"),

  // 2. LIÊN KẾT (RELATIONS)
  artist: z
    .string({ required_error: "Vui lòng chọn nghệ sĩ" })
    .trim()
    .min(1, "Vui lòng chọn nghệ sĩ"),

  genreIds: z
    .array(z.string(), { required_error: "Vui lòng chọn thể loại" })
    .min(1, "Vui lòng chọn ít nhất 1 thể loại")
    .max(5, "Chỉ được chọn tối đa 5 thể loại")
    .default([]),

  tags: z
    .array(
      z
        .string()
        .trim()
        .min(1, "Tag không được để trống")
        .max(30, "Mỗi tag tối đa 30 ký tự"),
    )
    .max(10, "Chỉ được nhập tối đa 10 tags")
    .default([]),

  // 3. MEDIA & GIAO DIỆN
  coverImage: z
    .any()
    .optional()
    .nullable()
    .refine((file) => {
      // Cho phép trống (nếu chưa upload) hoặc là URL (string) khi Edit
      if (!file || typeof file === "string") return true;
      return file instanceof File;
    }, "Ảnh bìa phải là file hoặc đường dẫn hợp lệ")
    .refine((file) => {
      if (file instanceof File) return file.size <= MAX_FILE_SIZE;
      return true;
    }, "Kích thước ảnh tối đa là 5MB")
    .refine((file) => {
      if (file instanceof File) return ACCEPTED_IMAGE_TYPES.includes(file.type);
      return true;
    }, "Chỉ chấp nhận các định dạng .jpg, .jpeg, .png, .webp"),

  themeColor: z
    .string()
    .trim()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Mã màu HEX không hợp lệ (VD: #1db954)")
    .default("#1db954"),

  // 4. METADATA PHÁT HÀNH
  releaseDate: z
    .string({ required_error: "Vui lòng chọn ngày phát hành" })
    .trim()
    .min(1, "Vui lòng chọn ngày phát hành")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Định dạng ngày phát hành không hợp lệ",
    }),

  label: z
    .string()
    .trim()
    .max(100, "Hãng đĩa tối đa 100 ký tự")
    .optional()
    .nullable()
    .transform((val) => (val === "" ? undefined : val)),

  copyright: z
    .string()
    .trim()
    .max(150, "Bản quyền tối đa 150 ký tự")
    .optional()
    .nullable()
    .transform((val) => (val === "" ? undefined : val)),

  upc: z
    .string()
    .trim()
    .regex(/^\d*$/, "Mã UPC/EAN chỉ được chứa các chữ số") // Chỉ cho phép nhập số
    .max(14, "Mã UPC tối đa 14 số")
    .optional()
    .nullable()
    .transform((val) => (val === "" ? undefined : val)),

  // 5. CÀI ĐẶT
  isPublic: z.boolean().default(false),
});

export type AlbumFormValues = z.infer<typeof albumSchema>;
