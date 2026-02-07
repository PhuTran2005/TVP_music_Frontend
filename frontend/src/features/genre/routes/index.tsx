import { ADMIN_PATHS, CLIENT_PATHS } from "@/config/paths";
import { GenreManagementPage } from "@/pages";
import { GenreDetailPage } from "@/pages/client/genre/GenreDetailPage";
import GenrePage from "@/pages/client/genre/GenrePage";
import { type RouteObject } from "react-router-dom";

export const GenreClientRoutes: RouteObject[] = [
  { path: CLIENT_PATHS.GENRES, element: <GenrePage /> },
  {
    path: CLIENT_PATHS.GENRE_DETAIL(":slug"),
    element: <GenreDetailPage />,
  },
];
export const GenreAdminRoutes: RouteObject[] = [
  { path: ADMIN_PATHS.GENRES, element: <GenreManagementPage /> },
];
