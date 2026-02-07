import { useAppSelector } from "@/store/hooks";
import { Navigate, Outlet } from "react-router-dom";

export const GuestRoute = () => {
  const { user } = useAppSelector((state) => state.auth);

  // Nếu đã đăng nhập -> Đá về trang chủ ngay lập tức
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Nếu chưa đăng nhập -> Cho phép hiển thị trang Login/Register
  return <Outlet />;
};
