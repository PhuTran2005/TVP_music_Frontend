import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Redux & API
import { useAppDispatch } from "@/store/store";
import authApi from "@/features/auth/api/authApi";
import { loginSchema, type LoginInput } from "../schemas/auth.schema";
import { login } from "@/features/auth/slice/authSlice";
import type { ApiErrorResponse } from "@/types";

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // State local cho UI (Show/Hide password)
  const [showPassword, setShowPassword] = useState(false);

  // 1. Setup React Hook Form
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // Validate khi rời ô input
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // 2. Logic Submit Form
  const handleLogin = async (data: LoginInput) => {
    try {
      // Gọi API
      const res = await authApi.login(data);

      // Lưu vào Redux Store
      dispatch(
        login({
          accessToken: res.data.accessToken,
          user: res.data.user,
        })
      );

      toast.success("Welcome back!", {
        description: `Logged in as ${
          res.data.user.fullName || res.data.user.username
        }`,
      });

      // Về trang chủ
      navigate("/");
    } catch (error: unknown) {
      const err = error as ApiErrorResponse;
      const errorCode = err.response?.data?.errorCode;
      const message = err.response?.data?.message || "Login failed";

      // CASE 1: Tài khoản chưa xác thực -> Chuyển sang trang OTP
      if (errorCode === "UNVERIFIED_ACCOUNT") {
        const email = err.response?.data?.data?.email; // Lấy email từ response chuẩn

        toast.warning("Account not verified.", {
          description: "Redirecting to verification page...",
        });

        setTimeout(() => {
          navigate("/verify-otp", { state: { email, isResend: true } });
        }, 1500);
        return;
      }

      // CASE 2: Sai thông tin -> Báo lỗi và focus lại input
      toast.error("Login failed", { description: message });

      // Set Error thủ công để hiện viền đỏ
      form.setError("root", { message: message }); // Lỗi chung
      form.setError("email", { type: "manual" });
      form.setError("password", { type: "manual" });
    }
  };

  // 3. Toggle Show/Hide Password
  const toggleShowPassword = () => setShowPassword(!showPassword);

  return {
    form, // Trả về instance form để UI dùng (register, formState...)
    showPassword,
    toggleShowPassword,
    onSubmit: form.handleSubmit(handleLogin), // Hàm submit đã bọc logic
  };
};
