import { ArtistDetailPage, ArtistsPage } from "@/pages";
import { type RouteObject } from "react-router-dom";

export const artistRoutes: RouteObject[] = [
  { path: "artists", element: <ArtistsPage /> },
  { path: "artists/:id", element: <ArtistDetailPage /> },
];
