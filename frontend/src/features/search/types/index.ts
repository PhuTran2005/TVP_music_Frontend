// --- Base Entities ---
export interface SearchArtist {
  _id: string;
  name: string;
  slug: string;
  avatar: string;
  totalFollowers: number;
}

export interface SearchTrack {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  duration: number;
  plays: number;
  artist: {
    name: string;
    slug: string;
  };
}

export interface SearchAlbum {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  year: number;
  artist: {
    name: string;
  };
}

export interface SearchPlaylist {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  user: {
    fullName: string;
  };
}

// --- Top Result Union Type ---
// Top Result có thể là Artist hoặc Track
export type TopResultItem =
  | ({ type: "artist" } & SearchArtist)
  | ({ type: "track" } & SearchTrack);

// --- Main Data Structure ---
export interface SearchData {
  topResult: TopResultItem | null;
  tracks: SearchTrack[];
  artists: SearchArtist[];
  albums: SearchAlbum[];
  playlists: SearchPlaylist[];
}

// --- API Response ---
export interface SearchResponse {
  status: string;
  data: SearchData;
}
