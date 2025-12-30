import {
  DashboardData,
  DashboardRange,
  DashboardResponse,
} from "@/features/dashboard/types";
import api from "@/lib/axios";

export const dashboardApi = {
  getAnalytics: async (
    range: DashboardRange = "7d"
  ): Promise<DashboardData> => {
    // Gọi endpoint: /api/dashboard/analytics?range=7d
    const response = await api.get<DashboardResponse>("/dashboard/analytics", {
      params: { range },
    });

    // Trả về thẳng data bên trong để UI đỡ phải .data.data
    return response.data.data;
  },
};
