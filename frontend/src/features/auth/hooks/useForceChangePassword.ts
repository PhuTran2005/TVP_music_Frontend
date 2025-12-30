import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/features/auth/api/authApi";
import type { ChangePasswordRequest } from "@/features/auth/types"; // Đảm bảo import đúng type
import type { ApiErrorResponse } from "@/types";

export const useForceChangePassword = () => {
  const navigate = useNavigate();

  // 1. Setup Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ChangePasswordRequest>(); // Định kiểu cho form

  // 2. Setup API Mutation
  const { mutate, isPending } = useMutation({
    mutationFn: (data: ChangePasswordRequest) => authApi.changePassword(data),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!", {
        description: "Bạn có thể sử dụng tài khoản bình thường.",
      });
      navigate("/"); // Chuyển hướng về trang chủ
    },
    onError: (err: unknown) => {
      const error = err as ApiErrorResponse;
      const message = error.response?.data?.message || "Đổi mật khẩu thất bại";
      toast.error(message);
      // Có thể set error vào form field cụ thể nếu backend trả về field lỗi
      // setError("currentPassword", { message });
    },
  });

  // 3. Logic Submit
  const onSubmit = (data: ChangePasswordRequest) => {
    // Validate client-side
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      setError("confirmPassword", {
        type: "manual",
        message: "Mật khẩu xác nhận không khớp",
      });
      return;
    }

    // Gọi API
    mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });
  };

  return {
    register,
    errors,
    isPending,
    onSubmit: handleSubmit(onSubmit), // Trả về hàm đã được bọc bởi handleSubmit
  };
};
