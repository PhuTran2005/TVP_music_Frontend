import { ADMIN_PATHS, CLIENT_PATHS } from "@/config/paths";
import { VerificationManager } from "@/pages/admin/VerificationManagerPage";
import { BecomeArtistPage } from "@/pages/client/BecomeArtistPage";
import { type RouteObject } from "react-router-dom";

export const becomeArtistRoutes: RouteObject[] = [
  { path: CLIENT_PATHS.BECOME_ARTIST, element: <BecomeArtistPage /> },
];
export const verifyArtistAdminRoutes: RouteObject[] = [
  { path: ADMIN_PATHS.VERIFY_ARTIST, element: <VerificationManager /> },
];
