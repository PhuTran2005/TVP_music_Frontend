import { type RouteObject } from "react-router-dom";
import {
  GoogleCallbackPage,
  LoginPage,
  LogoutPage,
  RegisterPage,
  VerifyOtpPage,
} from "@/pages";

// 1. Nhóm dành cho khách (Guest Only) - Đã login thì cấm vào
export const guestAuthRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/verify-otp",
    element: <VerifyOtpPage />,
  },
  {
    path: "/auth/google",
    element: <GoogleCallbackPage />,
  },
];

// 2. Nhóm dành cho người đã login (Protected)
export const protectedAuthRoutes: RouteObject[] = [
  {
    path: "/logout",
    element: <LogoutPage />,
  },
];
