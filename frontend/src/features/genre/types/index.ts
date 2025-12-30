export interface Genre {
  _id: string;
  name: string;
  slug: string;
  description?: string;

  // 🔥 New Visual & Hierarchy Fields
  image?: string;
  color?: string; // Hex (#ff0000)
  gradient?: string; // CSS String ("linear-gradient(...)")
  parentId?: {
    name: string;
    slug: string;
    _id: string;
  };

  // 🔥 New Curation Fields
  priority: number; // Độ ưu tiên sắp xếp
  isTrending: boolean; // Cờ báo Hot
  isActive: boolean;

  // 🔥 New Stats (Read-only)
  trackCount: number;
  albumCount: number;
  artistCount: number;

  createdAt: string;
}

export interface GenreFilterParams {
  page: number;
  limit: number;
  status?: "active" | "inactive";
  keyword?: string;
  isTrending?: boolean; // Filter theo trending
  parentId?: string | "root"; // Filter theo cha
  sort: "popular" | "priority" | "newest" | "oldest" | "name";
}

// Input để Create/Update
export interface CreateGenreInput {
  name: string;
  description?: string;
  color?: string;
  gradient?: string;
  parentId?: string | null;
  priority?: number;
  isTrending?: boolean;
  image?: File | null;
}

export interface UpdateGenreInput extends Partial<CreateGenreInput> {
  _id: string;
}
