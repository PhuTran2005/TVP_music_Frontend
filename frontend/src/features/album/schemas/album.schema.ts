import { z } from "zod";

// Enum khớp với Backend nhưng khai báo lại để dùng ở Frontend
const albumTypes = ["album", "single", "ep", "compilation"] as const;

export const albumSchema = z.object({
  title: z.string().trim().min(1, "Tên album không được để trống"),
  description: z.string().max(2000).optional(),

  type: z.enum(albumTypes).default("album"),

  artist: z.string().min(1, "Vui lòng chọn nghệ sĩ"),

  genreIds: z.array(z.string()).default([]),

  tags: z.array(z.string()).default([]),

  coverImage: z.union([z.instanceof(File), z.string(), z.null()]).optional(),

  themeColor: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Màu không hợp lệ")
    .default("#1db954"),

  releaseDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Ngày phát hành không hợp lệ",
  }),

  label: z.string().optional(),
  copyright: z.string().optional(),
  upc: z.string().optional(),

  isPublic: z.boolean().default(false),
});

export type AlbumFormValues = z.infer<typeof albumSchema>;
