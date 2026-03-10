import { Artist } from "../types";
import { ArtistFormValues } from "../schemas/artist.schema";

export const ARTIST_DEFAULT_VALUES: ArtistFormValues = {
  name: "",
  aliases: [],
  nationality: "VN",
  genreIds: [],
  userId: "",
  bio: "",
  themeColor: "#ffffff",
  isVerified: false,
  isActive: true,
  socialLinks: {
    facebook: "",
    instagram: "",
    twitter: "",
    website: "",
    spotify: "",
    youtube: "",
  },
  avatar: null,
  coverImage: null,
  images: [],
};

export const mapEntityToForm = (artist?: Artist | null): ArtistFormValues => {
  if (!artist) return ARTIST_DEFAULT_VALUES;

  return {
    ...ARTIST_DEFAULT_VALUES, // Fallback
    name: artist.name,
    aliases: artist.aliases || [],
    nationality: artist.nationality || "VN",
    // Nếu API trả về object user -> lấy _id
    userId:
      typeof artist.user === "object" ? artist.user?._id : artist.user || "",
    // Nếu API trả về object genre -> lấy _id
    genreIds:
      artist.genres?.map((g: any) => (typeof g === "object" ? g._id : g)) || [],
    bio: artist.bio || "",
    themeColor: artist.themeColor || "#ffffff",
    isVerified: artist.isVerified,
    isActive: artist.isActive,
    socialLinks: {
      facebook: artist.socialLinks?.facebook || "",
      instagram: artist.socialLinks?.instagram || "",
      twitter: artist.socialLinks?.twitter || "",
      website: artist.socialLinks?.website || "",
      spotify: artist.socialLinks?.spotify || "",
      youtube: artist.socialLinks?.youtube || "",
    },
    avatar: artist.avatar || null,
    coverImage: artist.coverImage || null,
    images: artist.images || [],
  };
};
