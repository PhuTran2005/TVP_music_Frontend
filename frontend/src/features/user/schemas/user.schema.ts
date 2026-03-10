import { z } from "zod";

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// --- SHARED RULES ---
const passwordRule = z
  .string()
  .min(6, "Mật khẩu tối thiểu 6 ký tự")
  .optional()
  .or(z.literal(""));
const avatarRule = z
  .union([z.instanceof(File), z.string(), z.null()])
  .refine((file) => {
    if (file instanceof File) return file.size <= MAX_AVATAR_SIZE;
    return true;
  }, "Ảnh tối đa 5MB")
  .refine((file) => {
    if (file instanceof File) return ACCEPTED_IMAGE_TYPES.includes(file.type);
    return true;
  }, "Định dạng không hỗ trợ")
  .optional()
  .nullable();

// --- 1. ADMIN CREATE/UPDATE USER ---
export const adminUserSchema = z.object({
  fullName: z.string().trim().min(2, "Tên quá ngắn").max(50),
  email: z.string().email("Email không hợp lệ"),
  role: z.enum(["user", "artist", "admin"]),

  // Chỉ Admin mới được sửa các field này
  isActive: z.boolean().default(true),
  isVerified: z.boolean().default(false),

  // Password optional khi edit
  password: passwordRule,
  avatar: avatarRule,
  bio: z.string().max(500).optional(),
});

export type AdminUserFormValues = z.infer<typeof adminUserSchema>;

// --- 2. USER PROFILE UPDATE (Self) ---
export const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(50),
  bio: z.string().max(500).optional(),
  avatar: avatarRule,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
