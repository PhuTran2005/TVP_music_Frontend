import { z } from "zod";

// --- 1. ZOD SCHEMAS (Validation) ---

export const dashboardRangeSchema = z.enum(["7d", "30d", "90d"]);

// Schema cho form filter
export const dashboardFilterSchema = z.object({
  range: dashboardRangeSchema.default("7d"),
});

export type DashboardFilter = z.infer<typeof dashboardFilterSchema>;
export type DashboardRange = z.infer<typeof dashboardRangeSchema>;
