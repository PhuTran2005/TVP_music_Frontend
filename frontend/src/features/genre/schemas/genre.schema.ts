import { z } from "zod";

// Regex cho mã màu Hex
const hexColorRegex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export const genreSchema = z.object({
  name: z.string().trim().min(2, "Tên thể loại phải có ít nhất 2 ký tự"),
  description: z.string().optional(),

  // Validate Hex Color
  color: z
    .string()
    .regex(hexColorRegex, "Mã màu không hợp lệ (VD: #FF0000)")
    .optional()
    .or(z.literal("")), // Cho phép chuỗi rỗng

  // Validate Gradient (Optional string)
  gradient: z.string().optional(),

  // Dropdown chọn Parent (có thể null)
  parentId: z.string().optional().nullable(),

  // Priority (Số nguyên, default 0)
  priority: z.coerce.number().int().min(0).default(0),

  // Switch Trending
  isTrending: z.boolean().default(false),

  // File ảnh
  image: z
    .instanceof(File, { message: "File ảnh không hợp lệ" })
    .optional()
    .or(z.null()),
});

export type GenreFormValues = z.infer<typeof genreSchema>;
