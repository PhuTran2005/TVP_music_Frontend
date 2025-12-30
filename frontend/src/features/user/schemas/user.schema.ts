import { z } from "zod";

// --- 1. ADMIN CREATE SCHEMA ---
export const createUserSchema = z.object({
  fullName: z.string().min(2, "Họ tên quá ngắn").max(50),
  email: z.string().email("Email không hợp lệ"),
  role: z.enum(["user", "artist", "admin"]),
  avatar: z.any().optional(), // File object
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

// --- 2. ADMIN UPDATE SCHEMA ---
export const adminUpdateUserFormSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email(),
  role: z.enum(["user", "artist", "admin"]),
  isActive: z.boolean(),
  isVerified: z.boolean(),
  password: z.string().min(6).optional().or(z.literal("")),
  avatar: z.any().optional(),
});

export type AdminUpdateUserFormValues = z.infer<
  typeof adminUpdateUserFormSchema
>;
export const claimSchema = z
  .object({
    newEmail: z.string().email("Email không hợp lệ"),
    newPassword: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type ClaimInput = z.infer<typeof claimSchema>;
