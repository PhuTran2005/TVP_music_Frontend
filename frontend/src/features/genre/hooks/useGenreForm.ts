import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Genre } from "../types";
import { genreSchema, GenreFormValues } from "../schemas/genre.schema";
import { mapEntityToForm } from "../utils/formMapper";
import { buildGenrePayload } from "../utils/payloadBuilder";

interface UseGenreFormProps {
  genreToEdit?: Genre | null;
  onSubmit: (formData: FormData) => Promise<void>;
}

export const useGenreForm = ({ genreToEdit, onSubmit }: UseGenreFormProps) => {
  const defaultValues = useMemo(
    () => mapEntityToForm(genreToEdit),
    [genreToEdit],
  );

  const form = useForm<GenreFormValues>({
    resolver: zodResolver(genreSchema),
    defaultValues,
    mode: "onSubmit",
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    const { dirtyFields } = form.formState;
    const isEditMode = !!genreToEdit;

    // Dirty Checking
    const hasFile = values.image instanceof File;
    const hasChanges = Object.keys(dirtyFields).length > 0;

    if (isEditMode && !hasChanges && !hasFile) return;

    const payload = buildGenrePayload(values, dirtyFields, isEditMode);
    console.log(
      "Payload ready to submit:",
      values,
      payload,
      "Dirty Fields:",
      dirtyFields,
    );
    await onSubmit(payload);
  });

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
    isDirty: form.formState.isDirty,
  };
};
