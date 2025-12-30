import { createBrowserRouter } from "react-router-dom";
import { albumRoutes } from "@/features/album/routes";
import { artistRoutes } from "@/features/artist/routes";
import { playlistRoutes } from "@/features/playlist/routes";

import { ClientLayout, RootLayout } from "@/layouts";
import AdminLayout from "@/layouts/admin/AdminLayout";
import ProtectedRoute from "@/app/routes/ProtectedRoute";
import {
  AlbumManagementPage,
  AnalyticPage,
  ArtistManagementPage,
  BrowsePage,
  ClaimProfilePage,
  DashboardPage,
  GenrePage,
  HomePage,
  NotFoundPage,
  ProfilePage,
  SearchPage,
  SettingPage,
  SettingsPage,
  SongPage,
  UserPage,
} from "@/pages";
import { GuestRoute } from "@/app/routes/GuestRoute";
import { guestAuthRoutes, protectedAuthRoutes } from "@/features/auth/routes";
import { ADMIN_PATHS, CLIENT_PATHS } from "@/config/paths";
import PlaylistManagementPage from "@/pages/admin/PlaylistManagementPage";

export const router = createBrowserRouter([
  {
    // 🔥 QUAN TRỌNG: RootLayout bao trùm toàn bộ ứng dụng
    // Nó không có path (pathless route), nhiệm vụ chỉ là chạy logic Init Auth
    element: <RootLayout />,
    children: [
      // ===================================================
      // 1. NHÓM AUTH (Login/Register)
      // ===================================================
      {
        element: <GuestRoute />, // <--- Bọc ở đây
        children: [
          ...guestAuthRoutes, // Login, Register
        ],
      },
      // ===================================================
      // 2. NHÓM CLIENT (USER APP)
      // ===================================================
      {
        path: CLIENT_PATHS.CLIENT,
        element: <ClientLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: CLIENT_PATHS.BROWSE, element: <BrowsePage /> },
          { path: CLIENT_PATHS.SEARCH, element: <SearchPage /> },

          // Bung các route feature
          ...playlistRoutes,
          ...artistRoutes,
          ...albumRoutes,

          // Protected Routes
          {
            element: <ProtectedRoute />,
            children: [
              { path: CLIENT_PATHS.PROFILE, element: <ProfilePage /> },
              {
                path: CLIENT_PATHS.CLAIM_PROFILE,
                element: <ClaimProfilePage />,
              },
              { path: CLIENT_PATHS.SETTINGS, element: <SettingsPage /> },
              ...protectedAuthRoutes,
            ],
          },
        ],
      },

      // ===================================================
      // 3. NHÓM ADMIN PORTAL
      // ===================================================
      {
        path: ADMIN_PATHS.ADMIN,
        element: <ProtectedRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              {
                path: ADMIN_PATHS.USERS,
                element: <UserPage />,
              },
              {
                path: ADMIN_PATHS.SONGS,
                element: <SongPage />,
              },
              {
                path: ADMIN_PATHS.ARTISTS,
                element: <ArtistManagementPage />,
              },
              {
                path: ADMIN_PATHS.ALBUMS,
                element: <AlbumManagementPage />,
              },
              {
                path: ADMIN_PATHS.ANALYTICS,
                element: <AnalyticPage />,
              },
              {
                path: ADMIN_PATHS.GENRES,
                element: <GenrePage />,
              },
              {
                path: ADMIN_PATHS.SETTINGS,
                element: <SettingPage />,
              },
              {
                path: ADMIN_PATHS.PLAYLISTS,
                element: <PlaylistManagementPage />,
              },
            ],
          },
        ],
      },

      // ===================================================
      // 4. 404 NOT FOUND
      // ===================================================
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
