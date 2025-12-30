import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  artistSchema,
  type ArtistFormValues,
} from "@/features/artist/schemas/artist.schema";
import type { Artist } from "@/features/artist/types";
import {
  useAdminCreateArtist,
  useAdminUpdateArtist,
} from "@/features/artist/hooks";

interface UseArtistModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
  artistToEdit?: Artist | null;
}

export const useArtistModalLogic = ({
  isOpen,
  onClose,
  artistToEdit,
}: UseArtistModalLogicProps) => {
  const form = useForm<ArtistFormValues>({
    resolver: zodResolver(artistSchema),
    defaultValues: {
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
      images: [], // Gallery
    },
  });

  const createMutation = useAdminCreateArtist();
  const updateMutation = useAdminUpdateArtist();
  const isPending = createMutation.isPending || updateMutation.isPending;

  // Reset form khi mở modal hoặc đổi artist
  useEffect(() => {
    if (isOpen) {
      if (artistToEdit) {
        form.reset({
          name: artistToEdit.name,
          aliases: artistToEdit.aliases || [],
          nationality: artistToEdit.nationality || "VN",
          userId:
            artistToEdit.user?._id ||
            (typeof artistToEdit.user === "string" ? artistToEdit.user : ""),
          genreIds: artistToEdit.genres?.map((g: any) => g._id || g) || [],
          bio: artistToEdit.bio || "",
          themeColor: artistToEdit.themeColor || "#ffffff",
          isVerified: artistToEdit.isVerified,
          isActive: artistToEdit.isActive,
          socialLinks: {
            facebook: artistToEdit.socialLinks?.facebook || "",
            instagram: artistToEdit.socialLinks?.instagram || "",
            twitter: artistToEdit.socialLinks?.twitter || "",
            website: artistToEdit.socialLinks?.website || "",
            spotify: artistToEdit.socialLinks?.spotify || "",
            youtube: artistToEdit.socialLinks?.youtube || "",
          },
          avatar: artistToEdit.avatar || null, // URL ảnh cũ
          coverImage: artistToEdit.coverImage || null, // URL ảnh cũ
          images: artistToEdit.images || [], // URL Gallery cũ
        });
      } else {
        form.reset({
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
        });
      }
    }
  }, [isOpen, artistToEdit, form]);

  const onSubmit = (data: ArtistFormValues) => {
    // 🔥 LOGIC TÁCH DỮ LIỆU GALLERY (CHUẨN PRODUCTION)

    // 1. Tách mảng images hỗn hợp (File + String URL)
    const newGalleryFiles: File[] = [];
    const keptGalleryUrls: string[] = [];

    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((item: any) => {
        if (item instanceof File) {
          newGalleryFiles.push(item);
        } else if (typeof item === "string") {
          keptGalleryUrls.push(item);
        }
      });
    }

    // 2. Chuẩn bị Object dữ liệu sạch để đưa vào buildFormData
    // Lưu ý: Chúng ta ghi đè 'images' và thêm 'keptImages'
    const payload = {
      ...data,
      images: newGalleryFiles, // Chỉ chứa File mới -> buildFormData sẽ append từng file vào key 'images'
      keptImages: keptGalleryUrls, // Mảng string -> buildFormData sẽ JSON.stringify
    };

    // 3. Gọi Mutation
    if (artistToEdit) {
      updateMutation.mutate(
        { id: artistToEdit._id, data: payload }, // Payload này sẽ được API convert sang FormData
        { onSuccess: onClose }
      );
    } else {
      createMutation.mutate(payload, { onSuccess: onClose });
    }
  };

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isPending,
  };
};
