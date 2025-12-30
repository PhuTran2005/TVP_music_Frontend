import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const playlistSchema = z.object({
  title: z
    .string()
    .min(1, "Vui lòng nhập tên Playlist")
    .max(100, "Tên Playlist không được quá 100 ký tự")
    .trim(),

  description: z.string().max(1000, "Mô tả tối đa 1000 ký tự").optional(),

  // 🔥 Metadata & Visuals
  themeColor: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Màu Hex không hợp lệ")
    .default("#1db954"),
  visibility: z.enum(["public", "private", "unlisted"]).default("public"),
  type: z.enum(["playlist", "radio", "mix"]).default("playlist"),

  // 🔥 Array Fields
  tags: z.array(z.string()).default([]),
  collaborators: z.array(z.string()).default([]), // Danh sách User ID

  isSystem: z.boolean().default(false),

  // 🔥 Image Validation
  coverImage: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, "Tối đa 5MB")
        .refine(
          (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
          "Định dạng không hỗ trợ"
        ),
      z.string(),
      z.null(),
    ])
    .optional(),
});

export type PlaylistFormValues = z.infer<typeof playlistSchema>;
