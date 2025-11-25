import DefaultLayout from "@/layout/client/defaultLayout";
import AlbumDetailPage from "@/pages/Album/AlbumDetailPage";
import AlbumsPage from "@/pages/Album/AlbumsPage";
import { ArtistsPage } from "@/pages/Artist";
import ArtistDetailPage from "@/pages/Artist/ArtistDetailPage";

import { BrowsePage } from "@/pages/BrowsePage";
import { HomePage } from "@/pages/HomePage";
import { PlaylistDetailPage } from "@/pages/Playlists/PlaylistDetailPage";
import { PlaylistsPage } from "@/pages/Playlists/PlaylistsPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { SearchPage } from "@/pages/SearchPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { useRoutes } from "react-router-dom";

const AllRouters = () => {
  const routers = useRoutes([
    {
      path: "/",
      element: <DefaultLayout />, // 👈 bọc layout
      children: [
        { path: "/", element: <HomePage /> },
        { path: "browse", element: <BrowsePage /> },
        { path: "artists", element: <ArtistsPage /> },
        { path: "artists/:id", element: <ArtistDetailPage /> },
        { path: "albums", element: <AlbumsPage /> },
        { path: "albums/:id", element: <AlbumDetailPage /> },
        { path: "playlists", element: <PlaylistsPage /> },
        { path: "playlists/:id", element: <PlaylistDetailPage /> },
        { path: "search", element: <SearchPage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "settings", element: <SettingsPage /> },
      ],
    },
  ]);

  return routers;
};

export default AllRouters;
