import { EqualizerLoader } from "@/components/ui/MusicLoadingEffects";
import MusicResult from "@/components/ui/Result";
import { useAppSelector } from "@/store/store";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

/**
 * ✅ ProtectedRoute
 * - Bảo vệ route yêu cầu đăng nhập
 * - Có thể giới hạn role: admin, teacher, student, ...
 */
const ProtectedRoute: React.FC<{ requiredRole?: string }> = ({
  requiredRole,
}) => {
  const navigate = useNavigate();
  const { token, user, isAuthChecking } = useAppSelector((state) => state.auth);
  // 1️⃣ Đang xác thực (ví dụ đang gọi refreshToken)
  if (isAuthChecking) {
    return <EqualizerLoader text="Đang xác thực..." fullscreen />;
  }

  // 2️⃣ Chưa đăng nhập → yêu cầu login
  if (!token) {
    return (
      <MusicResult
        isFullScreen
        status="403"
        title="Yêu cầu đăng nhập"
        description="Vui lòng đăng nhập để truy cập nội dung này."
        primaryAction={{
          label: "Đăng nhập",
          onClick: () => navigate("/login"),
        }}
      />
    );
  }
  if (user?.mustChangePassword) {
    return (
      <MusicResult
        isFullScreen
        status="warning"
        title="Cảnh báo bảo mật"
        description="Bạn phải đổi mật khẩu lần đầu để đảm bảo an toàn."
        primaryAction={{
          label: "Đổi mật khẩu ngay",
          onClick: () => navigate("/force-change-password"),
        }}
      />
    );
  }
  // 3️⃣ Kiểm tra role (nếu route có yêu cầu)
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <MusicResult
        isFullScreen
        status="403"
        title="403 - Không có quyền truy cập"
        description="Xin lỗi! Bạn không có quyền vào trang này."
        primaryAction={{
          label: "Quay lại trang chủ",
          onClick: () => navigate("/"),
        }}
      />
    );
  }

  // 4️⃣ Đã xác thực hợp lệ → cho phép truy cập
  return <Outlet />;
};

export default ProtectedRoute;
