import { PlaylistDetailPage, PlaylistsPage } from "@/pages";
import { type RouteObject } from "react-router-dom";

export const playlistRoutes: RouteObject[] = [
  { path: "playlists", element: <PlaylistsPage /> },
  { path: "playlists/:id", element: <PlaylistDetailPage /> },
];
