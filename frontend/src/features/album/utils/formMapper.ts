import type { Album } from "@/features/album/types";
import { type AlbumFormValues } from "../schemas/album.schema";
import { Artist } from "@/features/artist/types";
import { Genre } from "@/features/genre/types";

// 1. Định nghĩa giá trị mặc định chuẩn xác
export const ALBUM_DEFAULT_VALUES: AlbumFormValues = {
  title: "",
  type: "album",
  description: "",
  releaseDate: new Date().toISOString().split("T")[0],
  isPublic: false,
  artist: "",
  genreIds: [],
  tags: [],
  coverImage: null,
  label: "",
  copyright: "",
  upc: "",
  themeColor: "#1db954",
};

export const mapEntityToForm = (album?: Album | null): AlbumFormValues => {
  if (!album) return ALBUM_DEFAULT_VALUES;

  const artistId =
    typeof album.artist === "object" && album.artist
      ? (album.artist as Artist)._id
      : (album.artist as string) || "";

  const genreIds = Array.isArray(album.genres)
    ? album.genres.map((g: Genre) => (typeof g === "object" ? g._id : g))
    : [];

  let formattedDate = new Date().toISOString().split("T")[0];
  if (album.releaseDate) {
    try {
      formattedDate = new Date(album.releaseDate).toISOString().split("T")[0];
    } catch {
      /* ignore */
    }
  }

  return {
    ...ALBUM_DEFAULT_VALUES,
    title: album.title,
    type: album.type || "album",
    description: album.description || "",
    releaseDate: formattedDate,
    isPublic: album.isPublic,
    artist: artistId,
    genreIds: genreIds,
    tags: Array.isArray(album.tags) ? album.tags : [],
    coverImage: album.coverImage,
    label: album.label || "",
    copyright: album.copyright || "",
    upc: album.upc || "",
    themeColor: album.themeColor || "#1db954",
  };
};
