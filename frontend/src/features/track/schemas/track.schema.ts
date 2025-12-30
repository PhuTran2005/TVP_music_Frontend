import { z } from "zod";

const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // Nâng lên 100MB cho file chất lượng cao (FLAC)
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const AUDIO_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/flac",
  "audio/mp4",
  "audio/x-m4a",
];

export const trackSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tên bài hát").max(200).trim(),
  description: z.string().max(2000).optional(),

  // --- RELATIONSHIPS ---
  artistId: z.string().min(1, "Vui lòng chọn Nghệ sĩ chính"),
  featuringArtistIds: z.array(z.string()).default([]),
  albumId: z.string().optional().nullable(),
  genreIds: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 thể loại"),

  // --- METADATA NÂNG CAO (MỚI) ---
  releaseDate: z.string().default(() => new Date().toISOString()),
  isExplicit: z.boolean().default(false),
  copyright: z.string().optional(),
  isrc: z
    .string()
    .regex(/^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/, "Mã ISRC không hợp lệ")
    .optional()
    .or(z.literal("")),

  lyrics: z.string().optional(), // Hỗ trợ plain text hoặc định dạng LRC
  tags: z.array(z.string()).default([]), // Mood, Keywords

  trackNumber: z.number().min(1).default(1),
  diskNumber: z.number().min(1).default(1),
  isPublic: z.boolean().default(true),

  // --- FILE HANDLING ---
  audio: z
    .union([z.instanceof(File), z.string(), z.undefined(), z.null()])
    .refine((file) => {
      if (file instanceof File) return file.size <= MAX_AUDIO_SIZE;
      return true;
    }, "File nhạc tối đa 100MB")
    .refine((file) => {
      if (file instanceof File) return AUDIO_TYPES.includes(file.type);
      return true;
    }, "Định dạng không hỗ trợ (MP3, WAV, FLAC, M4A)"),

  coverImage: z
    .union([z.instanceof(File), z.string(), z.null()])
    .refine((file) => {
      if (file instanceof File) return file.size <= MAX_IMAGE_SIZE;
      return true;
    }, "Ảnh tối đa 5MB")
    .optional(),

  duration: z.number().default(0), // Frontend tính bằng Audio Context
});

export type TrackFormValues = z.infer<typeof trackSchema>;
