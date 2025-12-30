import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  albumSchema,
  type AlbumFormValues,
} from "@/features/album/schemas/album.schema";
import type { Album } from "@/features/album/types";

interface UseAlbumFormProps {
  isOpen: boolean;
  albumToEdit?: Album | null;
}

export const useAlbumForm = ({ isOpen, albumToEdit }: UseAlbumFormProps) => {
  const form = useForm<AlbumFormValues>({
    resolver: zodResolver(albumSchema),
    defaultValues: {
      title: "",
      type: "album",
      description: "",
      releaseDate: new Date().toISOString().split("T")[0],
      isPublic: false,
      artist: "",
      genreIds: [],
      coverImage: null,
      label: "",
      copyright: "",
      upc: "",
      themeColor: "#1db954",

      // 🔥 FIX 1: Default phải là mảng rỗng [], không phải chuỗi ""
      tags: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (albumToEdit) {
        // --- MAP DATA FOR EDIT ---
        const artistId =
          albumToEdit.artist && typeof albumToEdit.artist === "object"
            ? (albumToEdit.artist as any)._id
            : albumToEdit.artist;

        const genreIds = Array.isArray(albumToEdit.genres)
          ? albumToEdit.genres.map((g: any) =>
              typeof g === "object" ? g._id : g
            )
          : [];

        // Map Tags: Đảm bảo luôn là mảng
        const tags = Array.isArray(albumToEdit.tags) ? albumToEdit.tags : [];

        // Format Date
        let formattedDate = "";
        try {
          formattedDate = albumToEdit.releaseDate
            ? new Date(albumToEdit.releaseDate).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];
        } catch {
          formattedDate = new Date().toISOString().split("T")[0];
        }

        form.reset({
          title: albumToEdit.title,
          type: albumToEdit.type || "album",
          description: albumToEdit.description || "",
          releaseDate: formattedDate,
          isPublic: albumToEdit.isPublic,
          artist: artistId || "",
          genreIds: genreIds,
          coverImage: albumToEdit.coverImage,
          label: albumToEdit.label || "",
          copyright: albumToEdit.copyright || "",
          upc: albumToEdit.upc || "",
          themeColor: albumToEdit.themeColor || "#1db954",

          tags: tags, // Đã chuẩn mảng
        });
      } else {
        // --- RESET FOR CREATE ---
        form.reset({
          title: "",
          type: "album",
          description: "",
          releaseDate: new Date().toISOString().split("T")[0],
          isPublic: false,
          artist: "",
          genreIds: [],
          coverImage: null,
          label: "",
          copyright: "",
          upc: "",
          themeColor: "#1db954",

          // 🔥 FIX 2: Reset về mảng rỗng
          tags: [],
        });
      }
    }
  }, [isOpen, albumToEdit, form]);

  return { form };
};
