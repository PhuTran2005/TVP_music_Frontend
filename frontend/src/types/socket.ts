// src/types/socket.ts

import { ChartTrack } from "@/features/track/types";

// 1. Sự kiện Server gửi xuống Client (Listen)
export interface ServerToClientEvents {
  // Sự kiện kết nối cơ bản
  connect: () => void;
  disconnect: () => void;

  // Analytics (Admin nhận)
  admin_analytics_update: (data: RealtimeStats) => void;
  chart_update: (data: ChartTrack[]) => void;

  // Admin dashboard (nếu có dùng chung)

  // Đếm người nghe realtime
  listeners_count: (count: number) => void;
  // Thông báo (Ví dụ thêm)
  notification: (data: { message: string; type: string }) => void;
}

// 2. Sự kiện Client gửi lên Server (Emit)
export interface ClientToServerEvents {
  // Analytics (User gửi)
  client_heartbeat: (data: { userId: string; trackId: string }) => void;

  // Admin
  join_admin_dashboard: () => void;
  leave_admin_dashboard: () => void;
  join_chart_page: () => void;
  leave_chart_page: () => void;

  // Báo cáo nghe nhạc
  track_play: (data: { trackId: string; userId?: string }) => void;

  // Tham gia phòng nghe nhạc cụ thể
  listening_track: (trackId: string) => void;
}

// Data Models (Tái sử dụng từ file types trước đó)
export interface RealtimeStats {
  activeUsers: number;
  nowListening: any[];
  trending: any[];
}
