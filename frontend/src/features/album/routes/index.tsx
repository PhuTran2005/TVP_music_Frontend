import { AlbumDetailPage, AlbumsPage } from "@/pages";
import { type RouteObject } from "react-router-dom";

export const albumRoutes: RouteObject[] = [
  { path: "albums", element: <AlbumsPage /> },
  { path: "albums/:id", element: <AlbumDetailPage /> },
];
