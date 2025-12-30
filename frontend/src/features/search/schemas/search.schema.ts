import { z } from "zod";

export const searchInputSchema = z.object({
  q: z.string().trim(), // Cho phép chuỗi rỗng để clear search
  limit: z.number().optional().default(5),
});

export type SearchInput = z.infer<typeof searchInputSchema>;
