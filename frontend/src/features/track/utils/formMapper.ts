import { ITrack } from "@/features/track/types";
import { type TrackFormValues } from "../schemas/track.schema";

export const TRACK_DEFAULT_VALUES: TrackFormValues = {
  title: "",
  description: "",
  artistId: "",
  featuringArtistIds: [],
  albumId: null,
  genreIds: [],
  releaseDate: new Date().toISOString().split("T")[0], // YYYY-MM-DD for input date
  isExplicit: false,
  isPublic: true,
  trackNumber: 1,
  diskNumber: 1,
  copyright: "",
  isrc: "",
  lyrics: "",
  tags: [],
  audio: null,
  coverImage: null,
  duration: 0,
};

export const mapTrackToForm = (track?: ITrack | null): TrackFormValues => {
  if (!track) return TRACK_DEFAULT_VALUES;

  // 1. Xử lý Artist chính
  const artistId =
    typeof track.artist === "object" ? track.artist._id : track.artist || "";

  // 2. Xử lý Featuring Artists
  const featuringArtistIds = Array.isArray(track.featuringArtists)
    ? track.featuringArtists.map((a: any) =>
        typeof a === "object" ? a._id : a,
      )
    : [];

  // 3. Xử lý Genres
  const genreIds = Array.isArray(track.genres)
    ? track.genres.map((g: any) => (typeof g === "object" ? g._id : g))
    : [];

  // 4. Xử lý Album
  const albumId = track.album
    ? typeof track.album === "object"
      ? track.album._id
      : track.album
    : null;

  // 5. Format Date
  let formattedDate = new Date().toISOString().split("T")[0];
  if (track.releaseDate) {
    try {
      formattedDate = new Date(track.releaseDate).toISOString().split("T")[0];
    } catch {
      /* ignore */
    }
  }

  return {
    ...TRACK_DEFAULT_VALUES,
    title: track.title,
    description: track.description || "",
    artistId,
    featuringArtistIds,
    albumId,
    genreIds,
    releaseDate: formattedDate,
    isExplicit: track.isExplicit,
    isPublic: track.isPublic,
    trackNumber: track.trackNumber || 1,
    diskNumber: track.diskNumber || 1,
    copyright: track.copyright || "",
    isrc: track.isrc || "",
    lyrics: track.lyrics || "",
    tags: track.tags || [],
    audio: track.trackUrl, // URL cũ để hiển thị player preview
    coverImage: track.coverImage, // URL cũ
    duration: track.duration || 0,
  };
};
