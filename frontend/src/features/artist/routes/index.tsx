import { CLIENT_PATHS } from "@/config/paths";
import { ArtistDetailPage, ArtistsPage } from "@/pages";
import { type RouteObject } from "react-router-dom";

export const artistRoutes: RouteObject[] = [
  { path: "artists", element: <ArtistsPage /> },
  {
    path: CLIENT_PATHS.ARTIST_DETAIL(":slug"),
    element: <ArtistDetailPage />,
  },
];
