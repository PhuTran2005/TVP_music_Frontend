import { LoginForm } from "@/features";
import { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Import UI Form

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Dùng ref để chặn React.StrictMode chạy effect 2 lần (gây hiện 2 toast)
  const toastShownRef = useRef(false);

  useEffect(() => {
    const errorType = searchParams.get("error");

    if (errorType && !toastShownRef.current) {
      toastShownRef.current = true;

      // 🛑 CASE 1: BỊ KHÓA (Từ Axios Interceptor)
      if (errorType === "locked") {
        toast.error("Tài khoản đã bị khóa", {
          description: "Vui lòng liên hệ quản trị viên để biết thêm chi tiết.",
          duration: 6000, // Hiện lâu để user kịp đọc
          action: {
            label: "Hỗ trợ",
            onClick: () =>
              (window.location.href = "mailto:support@musichub.com"),
          },
        });
      }

      // ⚠️ CASE 2: GOOGLE LOGIN THẤT BẠI
      else if (errorType === "auth_failed") {
        toast.error("Đăng nhập Google thất bại", {
          description: "Vui lòng thử lại hoặc sử dụng email/password.",
        });
      }

      // ⚠️ CASE 3: LỖI SERVER CHUNG
      else if (errorType === "server_error") {
        toast.error("Lỗi hệ thống", {
          description: "Không thể kết nối đến server.",
        });
      }

      // Dọn dẹp URL: Xóa ?error=... đi để nhìn cho sạch
      // replace: true để không lưu lịch sử (bấm Back không bị hiện lại lỗi)
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <>
      <LoginForm />
    </>
  );
};

export default LoginPage;
