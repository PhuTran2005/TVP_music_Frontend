import api from "@/lib/axios";
import { buildFormData } from "@/utils/form-data"; // Import hàm helper
import type { Track, TrackFilterParams } from "@/features/track/types";
import type { TrackFormValues } from "@/features/track/schemas/track.schema";
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
    console.log(data, ...formData);
    return api.post("/tracks/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 3. Update
  update: async (id: string, data: Partial<TrackFormValues>) => {
    // Tương tự, buildFormData tự lọc các field undefined/null
    const formData = buildFormData(data);

    console.log(data, ...formData);
    return api.patch(`/tracks/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // 4. Delete
  delete: async (id: string) => {
    return api.delete(`/tracks/${id}`);
  },
};

export default trackApi;
