export interface Track {
  _id: string;
  title: string;
  slug: string;
  description?: string;

  // Populated Data
  artist: { _id: string; name: string; avatar: string };
  featuringArtists: Array<{ _id: string; name: string }>;
  album?: { _id: string; title: string; coverImage: string } | null;
  genres: Array<{ _id: string; name: string }>;
  uploader: string;

  // Resources
  trackUrl: string;
  hlsUrl?: string; // 🔥 Cực kỳ quan trọng cho Streaming player
  coverImage: string;

  // Context
  trackNumber: number;
  diskNumber: number;
  releaseDate: string;
  isExplicit: boolean;
  copyright?: string;
  isrc?: string;

  // Content
  lyrics?: string;
  tags: string[];

  // Technical Specs (Backend trả về sau khi xử lý file)
  duration: number;
  fileSize: number;
  format: string;
  bitrate: number;

  // Stats
  playCount: number;
  likeCount: number;
  status: "pending" | "processing" | "ready" | "failed";
  isPublic: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface TrackFilterParams {
  page: number;
  limit: number;
  keyword?: string;
  artistId?: string;
  albumId?: string;
  genreId?: string;
  status?: "pending" | "processing" | "ready" | "failed";
  sort?: "newest" | "popular" | "alphabetical";
}
