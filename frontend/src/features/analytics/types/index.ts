// src/features/analytics/types/index.ts

export interface TrackShort {
  _id: string;
  title: string;
  artist: {
    _id: string;
    name: string;
  };
  coverImage: string;
}

export interface RankedTrack {
  track: TrackShort;
  score: number;
}

export interface GeoLocation {
  id: string; // VD: "VN"
  name: string; // VD: "Vietnam"
  value: number; // VD: 150
}

export interface RealtimeStats {
  activeUsers: number;
  nowListening: RankedTrack[];
  trending: RankedTrack[];

  // 🔥 THÊM DÒNG NÀY:
  geoData: GeoLocation[];
}
export interface AnalyticsResponse {
  success: true;
  data: RealtimeStats;
}
