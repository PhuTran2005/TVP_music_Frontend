import { useQuery } from "@tanstack/react-query";
import playlistApi from "@/features/playlist/api/playlistApi";
import albumApi from "@/features/album/api/albumApi";
import genreApi from "@/features/genre/api/genreApi";
import artistApi from "@/features/artist/api/artistApi";
import trackApi from "@/features/track/api/trackApi"; // 🔥 Import thêm trackApi

export const useBrowse = (genreId?: string) => {
  // 1. Fetch Genres
  const genresQuery = useQuery({
    queryKey: ["browse-genres"],
    queryFn: () =>
      genreApi.getAll({
        page: 1,
        limit: 20,
        sort: "popular",
        isTrending: true,
      }),
    staleTime: 10 * 60 * 1000,
  });

  // 2. Fetch System Playlists (Moods/Featured)
  const playlistsQuery = useQuery({
    queryKey: ["browse-playlists", genreId],
    queryFn: () =>
      playlistApi.getAll({
        page: 1,
        limit: 10, // Lấy nhiều hơn chút để slider đẹp
        isSystem: true,
        isPublic: true, // 🔥 Chỉ lấy playlist công khai
        // genreId...
      }),
  });

  // 3. Fetch New Releases (Albums)
  const albumsQuery = useQuery({
    queryKey: ["browse-new-releases", genreId],
    queryFn: () =>
      albumApi.getAll({
        page: 1,
        limit: 10,
        sort: "newest",
        isPublic: true,
        genreId: genreId === "all" ? undefined : genreId,
      }),
  });

  // 4. Fetch Trending Artists
  const artistsQuery = useQuery({
    queryKey: ["browse-artists", genreId],
    queryFn: () =>
      artistApi.getAll({
        page: 1,
        limit: 10,
        sort: "popular",
      }),
  });

  // 5. 🔥 Fetch Top Tracks (Bổ sung quan trọng cho Browse)
  const tracksQuery = useQuery({
    queryKey: ["browse-top-tracks", genreId],
    queryFn: () =>
      trackApi.getAll({
        page: 1,
        limit: 12, // Lấy khoảng 12 bài cho section "Top Songs"
        sort: "popular", // Sắp xếp theo lượt nghe
        status: "ready", // Chỉ lấy bài đã xử lý xong
        genreId: genreId === "all" ? undefined : genreId,
      }),
  });

  const isLoading =
    genresQuery.isLoading ||
    playlistsQuery.isLoading ||
    albumsQuery.isLoading ||
    artistsQuery.isLoading ||
    tracksQuery.isLoading;

  const isError =
    genresQuery.isError ||
    playlistsQuery.isError ||
    albumsQuery.isError ||
    artistsQuery.isError ||
    tracksQuery.isError;

  return {
    genres: genresQuery.data?.data?.data || [],
    featuredPlaylists: playlistsQuery.data?.data?.data || [],
    newReleases: albumsQuery.data?.data?.data || [],
    trendingArtists: artistsQuery.data?.data?.data || [],
    topTracks: tracksQuery.data?.data?.data || [], // 🔥 Return tracks
    isLoading,
    isError,
    refetch: () => {
      genresQuery.refetch();
      playlistsQuery.refetch();
      albumsQuery.refetch();
      artistsQuery.refetch();
      tracksQuery.refetch();
    },
  };
};
