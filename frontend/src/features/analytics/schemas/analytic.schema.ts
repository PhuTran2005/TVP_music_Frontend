// src/features/analytics/schemas/index.ts
import { z } from "zod";

const trackShortSchema = z.object({
  _id: z.string(),
  title: z.string(),
  artist: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  coverImage: z.string(),
});

const rankedTrackSchema = z.object({
  track: trackShortSchema,
  score: z.number(),
});

export const realtimeStatsSchema = z.object({
  activeUsers: z.number(),
  nowListening: z.array(rankedTrackSchema),
  trending: z.array(rankedTrackSchema),
});

export type RealtimeStatsSchema = z.infer<typeof realtimeStatsSchema>;
