import { z } from "zod";

export const dashboardRangeSchema = z.enum(["7d", "30d", "90d"]);

// Schema cho form filter (nếu sau này mở rộng)
export const dashboardFilterSchema = z.object({
  range: dashboardRangeSchema.default("7d"),
});

export type DashboardFilter = z.infer<typeof dashboardFilterSchema>;
