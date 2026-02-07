// src/features/analytics/api/analyticsApi.ts
import api from "@/lib/axios";
import { AnalyticsResponse } from "../types";

const analyticsApi = {
  getRealtimeStats: async (): Promise<AnalyticsResponse> => {
    const url = "/analytics/realtime";
    const { data } = await api.get(url);
    return data;
  },

  // (Optional) Gọi force sync nếu cần nút bấm thủ công
  forceSync: async () => {
    return await api.post("/analytics/sync-now");
  },
};

export default analyticsApi;
