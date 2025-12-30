import { z } from "zod";

// Enum khớp với Backend nhưng khai báo lại để dùng ở Frontend
const albumTypes = ["album", "single", "ep", "compilation"] as const;

export const albumSchema = z.object({
  // --- BASIC ---
  title: z.string().trim().min(1, "Tên album không được để trống"),
  description: z.string().max(2000).optional(),

  // --- CLASSIFICATION ---
  type: z.enum(albumTypes).default("album"),

  // Artist ID (String)
  artist: z.string().min(1, "Vui lòng chọn nghệ sĩ"),

  // Genre IDs (Mảng String - Khớp với GenreSelector)
  // Không cần preprocess phức tạp vì Component trả về mảng chuẩn rồi
  genreIds: z.array(z.string()).default([]),

  // Tags (Mảng String - Khớp với TagInput)
  tags: z.array(z.string()).default([]),

  // --- VISUALS ---
  // Frontend cần handle cả File (khi upload mới) và String (URL ảnh cũ)
  coverImage: z.union([z.instanceof(File), z.string(), z.null()]).optional(),

  themeColor: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Màu không hợp lệ")
    .default("#1db954"),

  // --- RELEASE & LEGAL ---
  // Dùng z.string() để khớp với <input type="date" />
  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày phát hành không hợp lệ",
  }),

  label: z.string().optional(),
  copyright: z.string().optional(),
  upc: z.string().optional(),

  // --- STATUS ---
  isPublic: z.boolean().default(false),
});

export type AlbumFormValues = z.infer<typeof albumSchema>;
