import { z } from "zod";

const socialLinkSchema = z
  .string()
  .url("Link không hợp lệ")
  .or(z.literal(""))
  .optional();

export const artistSchema = z.object({
  name: z.string().min(2, "Tên nghệ sĩ tối thiểu 2 ký tự").trim(),

  // 🔥 Mới: Aliases (Mảng string)
  aliases: z.array(z.string()).default([]),

  // 🔥 Mới: Quốc tịch
  nationality: z.string().min(1, "Vui lòng chọn quốc gia").default("VN"),

  userId: z.string().optional().nullable(),
  genreIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 thể loại"),
  bio: z.string().max(2000, "Tiểu sử tối đa 2000 ký tự").optional(),

  // 🔥 Mới: Theme Color
  themeColor: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Màu Hex không hợp lệ")
    .default("#ffffff"),

  isVerified: z.boolean().default(false),
  isActive: z.boolean().default(true),

  socialLinks: z
    .object({
      facebook: socialLinkSchema,
      instagram: socialLinkSchema,
      twitter: socialLinkSchema,
      website: socialLinkSchema,
      spotify: socialLinkSchema, // 🔥 Mới
      youtube: socialLinkSchema, // 🔥 Mới
    })
    .optional(),
  // 🔥 Mới: Quản lý mảng ảnh gallery
  images: z.array(z.union([z.instanceof(File), z.string()])).default([]),
  avatar: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
  coverImage: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
});

export type ArtistFormValues = z.infer<typeof artistSchema>;
