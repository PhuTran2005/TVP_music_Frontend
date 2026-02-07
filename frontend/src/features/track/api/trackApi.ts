import api from "@/lib/axios";
import { buildFormData } from "@/utils/form-data"; // Import hàm helper
import type {
  ChartResponse,
  Track,
  TrackFilterParams,
} from "@/features/track/types";
import type {
  BulkTrackFormValues,
  TrackFormValues,
} from "@/features/track/schemas/track.schema";
import type { ApiResponse, PagedResponse } from "@/types";

const trackApi = {
  // 1. Get List
  getAll: async (params: TrackFilterParams) => {
    // Thêm await để lấy data clean luôn, thay vì trả về nguyên cục response axios
    const response = await api.get<ApiResponse<PagedResponse<Track>>>(
      "/tracks",
      { params }
    );
    return response.data;
  },

  // 2. Create
  create: async (data: TrackFormValues) => {
    // 🔥 Magic ở đây: buildFormData tự xử lý Audio, Image, GenreIds (JSON), Boolean...
    const formData = buildFormData(data);
    return api.post("/tracks/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 3. Update
  update: async (id: string, data: Partial<TrackFormValues>) => {
    // Tương tự, buildFormData tự lọc các field undefined/null
    const formData = buildFormData(data);

    return api.patch(`/tracks/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  changeStatus: async (id: string, status: string): Promise<Track> => {
    // Không cần FormData, chỉ cần gửi JSON object
    const { data } = await api.patch(`/tracks/change-status/${id}`, { status });
    return data.data; // Tùy vào response backend trả về { data: ... } hay trực tiếp
  },

  /**
   * API: Thử lại Transcode
   * Method: POST
   * Body: Empty {} (Vì axios post bắt buộc tham số thứ 2 là body)
   */
  retryTranscode: async (id: string): Promise<ApiResponse<Track>> => {
    // Tham số thứ 2 là body (để rỗng), tham số thứ 3 mới là config (headers)
    const { data } = await api.post(`/tracks/${id}/retry`, {});
    return data;
  },
  bulkUpdate: async (trackIds: string[], updates: BulkTrackFormValues) => {
    // API này nhận JSON, không phải FormData
    // Lưu ý: Route backend phải match (vd: /tracks/bulk/update)
    const { data } = await api.patch("/tracks/bulk/update", {
      trackIds,
      updates,
    });
    return data;
  },
  // 4. Delete
  delete: async (id: string) => {
    return api.delete(`/tracks/${id}`);
  },
  getRealtimeChart: async (): Promise<ChartResponse> => {
    // Gọi endpoint GET mà bạn đã setup ở Backend
    const response = await api.get<ChartResponse>("/tracks/charts/realtime");
    return response.data;
  },
};

export default trackApi;
