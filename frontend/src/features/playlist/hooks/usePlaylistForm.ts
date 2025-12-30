import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Playlist } from "../types";
import {
  playlistSchema,
  type PlaylistFormValues,
} from "../schemas/playlist.schema";

export const usePlaylistForm = (
  playlistToEdit: Playlist | null | undefined,
  isOpen: boolean
) => {
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<PlaylistFormValues>({
    resolver: zodResolver(playlistSchema),
    defaultValues: {
      title: "",
      description: "",
      visibility: "public",
      type: "playlist",
      tags: [],
      collaborators: [],
      themeColor: "#1db954",
      isSystem: false,
      coverImage: null,
    },
  });

  const { reset, watch, setValue } = form;

  // Sync dữ liệu khi mở Modal Edit
  useEffect(() => {
    if (!isOpen) return;
    if (playlistToEdit) {
      reset({
        title: playlistToEdit.title,
        description: playlistToEdit.description || "",
        visibility: playlistToEdit.visibility || "public",
        type: playlistToEdit.type || "playlist",
        tags: playlistToEdit.tags || [],
        themeColor: playlistToEdit.themeColor || "#1db954",
        isSystem: playlistToEdit.isSystem || false,
        coverImage: playlistToEdit.coverImage || null,
        // 🔥 Chuyển Object User thành mảng ID
        collaborators:
          playlistToEdit.collaborators?.map((u: any) =>
            typeof u === "string" ? u : u._id
          ) || [],
      });
      setPreview(playlistToEdit.coverImage || null);
    } else {
      reset({
        title: "",
        description: "",
        visibility: "public",
        type: "playlist",
        tags: [],
        collaborators: [],
        themeColor: "#1db954",
        isSystem: false,
        coverImage: null,
      });
      setPreview(null);
    }
  }, [isOpen, playlistToEdit, reset]);

  // Handle Image Preview
  const coverValue = watch("coverImage");
  useEffect(() => {
    if (coverValue instanceof File) {
      const url = URL.createObjectURL(coverValue);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [coverValue]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file)
        setValue("coverImage", file, {
          shouldDirty: true,
          shouldValidate: true,
        });
    },
    [setValue]
  );

  return { form, preview, values: watch(), handleFileChange };
};
