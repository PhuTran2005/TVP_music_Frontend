import { CLIENT_PATHS } from "@/config/paths";
import { ClaimProfilePage } from "@/pages";
import { type RouteObject } from "react-router-dom";

// 1. Nhóm dành cho khách (Guest Only) - Đã login thì cấm vào
export const userRoutes: RouteObject[] = [
  {
    path: CLIENT_PATHS.CLAIM_PROFILE,
    element: <ClaimProfilePage />,
  },
];
