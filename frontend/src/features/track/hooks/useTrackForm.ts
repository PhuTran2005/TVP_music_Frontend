import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { type Track } from "../types";
import {
  trackSchema,
  type TrackFormValues,
} from "@/features/track/schemas/track.schema";
import { formatDate } from "@/utils/track-helper";

export const useTrackForm = (
  trackToEdit: Track | null | undefined,
  isOpen: boolean
) => {
  // 1. Init Form
  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      title: "",
      description: "",
      isPublic: false,
      artistId: "",
      // 🔥 Thêm giá trị mặc định cho Feat Artists
      featuringArtistIds: [],
      albumId: "",
      genreIds: [],
      duration: 0,
      audio: null,
      trackNumber: 0,
      diskNumber: 0,
      copyright: "",
      coverImage: null,
      lyrics: "",
    },
  });

  const { reset, setValue, watch } = form;

  // 2. Local State for Previews
  const [audioName, setAudioName] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Watch values for UI
  const duration = watch("duration");
  const isPublic = watch("isPublic");
  const coverValue = watch("coverImage");

  // 3. Reset Form Effect
  useEffect(() => {
    if (isOpen) {
      if (trackToEdit) {
        // --- EDIT MODE ---
        // Helper safely get ID
        const getId = (obj: any) =>
          obj && typeof obj === "object" && "_id" in obj ? obj._id : obj || "";

        // Helper safely get array IDs
        const getIds = (arr: any[]) =>
          Array.isArray(arr)
            ? arr.map((item) => getId(item)).filter(Boolean)
            : [];

        reset({
          title: trackToEdit.title || "",
          description: trackToEdit.description || "",
          isPublic: trackToEdit.isPublic ?? true, // Fallback true
          isExplicit: trackToEdit.isExplicit ?? false,
          isrc: trackToEdit.isrc || "",
          copyright: trackToEdit.copyright || "",
          lyrics: trackToEdit.lyrics || "",
          tags: Array.isArray(trackToEdit.tags) ? trackToEdit.tags : [],
          trackNumber: trackToEdit.trackNumber || 0,
          diskNumber: trackToEdit.diskNumber || 0,
          artistId: getId(trackToEdit.artist),
          featuringArtistIds: getIds(trackToEdit.featuringArtists), // 🔥 Fix map feat
          albumId: getId(trackToEdit.album),
          genreIds: getIds(trackToEdit.genres),
          releaseDate: formatDate(trackToEdit.releaseDate),
          duration: trackToEdit.duration || 0,
          coverImage: trackToEdit.coverImage,

          // 🔥 Quan trọng: Audio luôn null khi edit (trừ khi user chọn file mới)
          audio: null,
        });
        setImagePreview(trackToEdit.coverImage || null);
        setAudioName(trackToEdit.trackUrl ? "Audio File Exists" : "");
      } else {
        // --- MODE: CREATE ---
        reset({
          title: "",
          description: "",
          isPublic: true,
          artistId: "",
          featuringArtistIds: [], // Reset feat
          albumId: "",
          genreIds: [],
          duration: 0,
          isExplicit: false,
          lyrics: "",
          trackNumber: 0,
          diskNumber: 0,
          copyright: "",
          isrc: "",
          audio: null,
          coverImage: null,
          releaseDate: new Date().toISOString().split("T")[0],
        });
        setImagePreview(null);
        setAudioName("");
      }
    }
  }, [isOpen, trackToEdit, reset]);

  // 4. Image Preview Logic
  useEffect(() => {
    if (coverValue instanceof File) {
      const url = URL.createObjectURL(coverValue);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [coverValue]);

  // 5. Handlers

  // Handle Audio File Change (Validate + Duration Calculation)
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate Size (50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File quá lớn (>50MB). Vui lòng chọn file nhỏ hơn.");
        return;
      }

      // Set value & name
      setValue("audio", file, { shouldValidate: true, shouldDirty: true });
      setAudioName(file.name);

      // Calculate Duration
      const audioObj = new Audio(URL.createObjectURL(file));
      audioObj.onloadedmetadata = () => {
        const calculatedDuration = Math.floor(audioObj.duration);
        setValue("duration", calculatedDuration, { shouldValidate: true });
        URL.revokeObjectURL(audioObj.src);
      };

      // Auto fill title if empty
      const currentTitle = form.getValues("title");
      if (!currentTitle) {
        // Remove extension from filename
        const titleFromFileName = file.name.replace(/\.[^/.]+$/, "");
        setValue("title", titleFromFileName, { shouldValidate: true });
      }
    }
  };

  // Helper: Format Duration (seconds -> MM:SS)
  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? "0" + sec : sec}`;
  };

  return {
    form, // react-hook-form object
    imagePreview, // URL string for image preview
    audioName, // Name of selected audio file
    duration, // Current duration value
    isPublic, // Current visibility status
    handleAudioChange,
    formatDuration,
  };
};
