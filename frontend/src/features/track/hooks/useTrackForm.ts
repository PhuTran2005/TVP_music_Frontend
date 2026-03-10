import { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { trackSchema, type TrackFormValues } from "../schemas/track.schema";
import { mapTrackToForm } from "../utils/formMapper";
import { buildTrackPayload } from "../utils/payloadBuilder";
import { ITrack } from "@/features/track/types";

interface UseTrackFormProps {
  trackToEdit?: ITrack | null;
  onSubmit: (formData: FormData) => Promise<void>; // Inject hàm gọi API từ hook mutation
}

export const useTrackForm = ({ trackToEdit, onSubmit }: UseTrackFormProps) => {
  // 1. Map Entity -> Form Values (Chỉ chạy lại khi trackToEdit đổi)
  const defaultValues = useMemo(() => {
    return mapTrackToForm(trackToEdit);
  }, [trackToEdit]);

  // 2. Init Form
  const form = useForm<TrackFormValues>({
    resolver: zodResolver(trackSchema),
    defaultValues,
    mode: "onSubmit", // Validate khi submit
  });

  const { reset, watch, setValue, formState } = form;
  const { dirtyFields, isSubmitting } = formState;

  // 3. Reset form khi data thay đổi (quan trọng cho Modal)
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  // --- PREVIEW LOGIC ---
  const coverValue = watch("coverImage");
  const audioValue = watch("audio");

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [audioPreview, setAudioPreview] = useState<string | null>(null); // Để hiện tên file hoặc player

  // Auto generate/cleanup Image Preview URL
  useEffect(() => {
    if (coverValue instanceof File) {
      const url = URL.createObjectURL(coverValue);
      setImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof coverValue === "string" && coverValue) {
      setImagePreview(coverValue);
    } else {
      setImagePreview(null);
    }
  }, [coverValue]);

  // Auto handle Audio Name display
  useEffect(() => {
    if (audioValue instanceof File) {
      setAudioPreview(audioValue.name);
    } else if (typeof audioValue === "string" && audioValue) {
      setAudioPreview("File âm thanh hiện tại");
    } else {
      setAudioPreview(null);
    }
  }, [audioValue]);

  // --- HANDLERS ---

  /**
   * Xử lý khi chọn file Audio:
   * 1. Validate size/type (đã có Zod lo, nhưng check nhanh ở đây UX tốt hơn)
   * 2. Tính Duration
   * 3. Auto-fill Title (nếu trống)
   */
  const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // UX: Auto fill title nếu chưa nhập
    const currentTitle = form.getValues("title");
    if (!currentTitle) {
      const titleFromFileName = file.name.replace(/\.[^/.]+$/, ""); // Bỏ đuôi .mp3
      setValue("title", titleFromFileName, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }

    // Tính Duration
    const audioObj = new Audio(URL.createObjectURL(file));
    audioObj.onloadedmetadata = () => {
      const calculatedDuration = Math.floor(audioObj.duration);
      setValue("duration", calculatedDuration, {
        shouldValidate: true,
        shouldDirty: true,
      });
      URL.revokeObjectURL(audioObj.src); // Cleanup ngay
    };

    // Set file vào form
    setValue("audio", file, { shouldValidate: true, shouldDirty: true });
  };

  /**
   * Handle Submit thông minh:
   * 1. Dirty Checking: Chỉ gửi field thay đổi
   * 2. Build Payload: Dùng util đã tách
   * 3. Gọi API
   */
  const handleSubmit = form.handleSubmit(async (values) => {
    const isEditMode = !!trackToEdit;

    // Check xem có thay đổi gì không (bao gồm cả file)
    const hasAudioFile = values.audio instanceof File;
    const hasImageFile = values.coverImage instanceof File;
    const hasChanges = Object.keys(dirtyFields).length > 0;

    // Nếu Edit mà không đổi gì -> Bỏ qua
    if (isEditMode && !hasChanges && !hasAudioFile && !hasImageFile) {
      toast.info("Không có thay đổi nào để cập nhật.");
      return;
    }

    try {
      const payload = buildTrackPayload(values, dirtyFields, isEditMode);
      console.log("Built Payload:", values, dirtyFields, isEditMode); // Debug payload trước khi gửi
      await onSubmit(payload);
      // Reset form sau khi thành công được xử lý ở component cha hoặc onSuccess của mutation
    } catch (error) {
      console.error("Form submission error", error);
    }
  });

  // Helper formatting (để UI dùng)
  const formatDuration = (seconds: number) => {
    if (!seconds) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  return {
    form,
    handleSubmit,
    handleAudioChange,

    // States
    imagePreview,
    audioPreview,
    isSubmitting,
    isDirty: formState.isDirty,

    // Helpers
    formatDuration,
  };
};
