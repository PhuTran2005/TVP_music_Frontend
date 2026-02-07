import { z } from "zod";

// --- CẤU HÌNH FILE ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// Helper validate file đơn lẻ
const imageFileSchema = z
  .instanceof(File, { message: "Vui lòng tải lên file ảnh hợp lệ" })
  .refine((file) => file.size <= MAX_FILE_SIZE, {
    message: "Kích thước ảnh tối đa là 5MB.",
  })
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
    message: "Chỉ chấp nhận định dạng .jpg, .jpeg, .png hoặc .webp",
  });

// --- MAIN SCHEMA ---
export const becomeArtistSchema = z.object({
  // 1. Thông tin Artist
  artistName: z
    .string()
    .trim()
    .min(2, "Nghệ danh phải có ít nhất 2 ký tự")
    .max(50, "Nghệ danh quá dài (tối đa 50 ký tự)"),

  // Link Social (Bắt buộc 1 link để verify)
  socialLink: z
    .string()
    .trim()
    .url("Vui lòng nhập đúng định dạng URL (VD: https://facebook.com/...)")
    .refine((url) => url.includes("http"), {
      message: "URL phải bắt đầu bằng http:// hoặc https://",
    }),

  // 2. Thông tin pháp lý (Private)
  realName: z
    .string()
    .trim()
    .min(2, "Vui lòng nhập họ tên thật đầy đủ theo giấy tờ")
    .regex(/^[\p{L}\s]+$/u, "Họ tên không được chứa ký tự đặc biệt hoặc số"), // Regex hỗ trợ Tiếng Việt

  emailWork: z.string().trim().toLowerCase().email("Email không hợp lệ"),

  // 3. Ảnh CCCD/Passport (Frontend tách riêng 2 field để dễ validate UI)
  frontImage: imageFileSchema,
  backImage: imageFileSchema,
});

export type BecomeArtistFormValues = z.infer<typeof becomeArtistSchema>;
