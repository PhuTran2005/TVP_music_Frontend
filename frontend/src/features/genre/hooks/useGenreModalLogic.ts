import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateGenre, useUpdateGenre } from "./useGenreAdmin";
import type { Genre } from "../types";
import {
  genreSchema,
  type GenreFormValues,
} from "@/features/genre/schemas/genre.schema";

interface UseGenreModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
  genreToEdit?: Genre | null;
}

export const useGenreModalLogic = ({
  isOpen,
  onClose,
  genreToEdit,
}: UseGenreModalLogicProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const createMutation = useCreateGenre();
  const updateMutation = useUpdateGenre();
  const isEditing = !!genreToEdit;
  const isPending = createMutation.isPending || updateMutation.isPending;

  // 1. Setup Form với đầy đủ các field mới
  const form = useForm<GenreFormValues>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#6366f1",
      image: null,
      // 🔥 New fields
      gradient: "",
      parentId: null, // Hoặc "" tùy schema
      priority: 0,
      isTrending: false,
    },
  });

  // 2. Reset & Map Data khi mở Modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      if (genreToEdit) {
        // --- EDIT MODE: MAP DATA ---
        form.setValue("name", genreToEdit.name);
        form.setValue("description", genreToEdit.description || "");
        form.setValue("color", genreToEdit.color || "#6366f1");

        // 🔥 Map các field mới
        form.setValue("gradient", genreToEdit.gradient || "");
        form.setValue("parentId", genreToEdit.parentId?._id || null);
        form.setValue("priority", genreToEdit.priority || 0);
        form.setValue("isTrending", genreToEdit.isTrending || false);

        setImagePreview(genreToEdit.image || null);
      } else {
        // --- CREATE MODE: RESET ---
        form.reset({
          name: "",
          description: "",
          color: "#6366f1",
          image: null,
          gradient: "",
          parentId: null,
          priority: 0,
          isTrending: false,
        });
        setImagePreview(null);
      }
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, genreToEdit, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File quá lớn (Max 5MB)");
        return;
      }
      form.setValue("image", file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  };

  const onSubmit = (data: GenreFormValues) => {
    // Nếu create thì không cần _id, update thì cần
    const payload = isEditing ? { _id: genreToEdit._id, ...data } : data;

    const mutation = isEditing ? updateMutation : createMutation;

    mutation.mutate(payload as any, {
      onSuccess: () => {
        onClose();
        // Toast success thường được xử lý trong hook mutation rồi
      },
    });
  };

  return {
    form,
    isEditing,
    isPending,
    imagePreview,
    handleImageChange,
    onSubmit: form.handleSubmit(onSubmit),
    watchColor: form.watch("color"),
  };
};
