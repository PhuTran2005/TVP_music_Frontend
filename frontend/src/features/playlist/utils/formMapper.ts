import { Playlist } from "../types";
import { PlaylistFormValues } from "../schemas/playlist.schema";

export const PLAYLIST_DEFAULT_VALUES: PlaylistFormValues = {
  title: "",
  description: "",
  visibility: "public",
  type: "playlist",
  themeColor: "#1db954",
  isSystem: false,
  tags: [],
  collaborators: [],
  coverImage: null,
};

export const mapEntityToForm = (
  playlist?: Playlist | null,
): PlaylistFormValues => {
  if (!playlist) return PLAYLIST_DEFAULT_VALUES;

  return {
    title: playlist.title,
    description: playlist.description || "",
    visibility: playlist.visibility || "public",
    type: playlist.type || "playlist",
    themeColor: playlist.themeColor || "#1db954",
    isSystem: playlist.isSystem || false,
    coverImage: playlist.coverImage || null,
    tags: playlist.tags || [],
    // Xử lý collaborator: Nếu là object populated -> lấy _id, nếu là string -> giữ nguyên
    collaborators:
      playlist.collaborators?.map((u: any) =>
        typeof u === "object" ? u._id : u,
      ) || [],
  };
};
