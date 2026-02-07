import { VerificationRequest } from "@/features/verification/types";
import api from "@/lib/axios";
import { ApiResponse, PagedResponse } from "@/types";

// --- API DEFINITION ---
const verificationApi = {
  // User: Gửi yêu cầu
  submitRequest: async (formData: FormData) => {
    const res = await api.post("/verification/submit", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  // Admin: Lấy danh sách
  getRequests: async (params: {
    status: string;
    page: number;
    limit: number;
  }) => {
    const res = await api.get<ApiResponse<PagedResponse<VerificationRequest>>>(
      "/verification",
      { params }
    );
    return res.data;
  },

  // Admin: Duyệt/Từ chối
  reviewRequest: async ({
    id,
    status,
    rejectReason,
  }: {
    id: string;
    status: string;
    rejectReason?: string;
  }) => {
    const res = await api.post(`/verification/${id}/review`, {
      status,
      rejectReason,
    });
    return res.data;
  },
};
export default verificationApi;
