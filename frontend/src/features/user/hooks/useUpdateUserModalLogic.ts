// src/features/user/hooks/useUpdateUserModalLogic.ts
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateUser } from "@/features/user/hooks/useUserAdmin";
import type { User } from "@/features/user/types";
import {
  adminUpdateUserFormSchema,
  type AdminUpdateUserFormValues,
} from "@/features/user/schemas/user.schema";

interface UseUpdateUserModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit: User | null;
}

export const useUpdateUserModalLogic = ({
  isOpen,
  onClose,
  userToEdit,
}: UseUpdateUserModalLogicProps) => {
  // 1. Setup Form
  const form = useForm<AdminUpdateUserFormValues>({
    resolver: zodResolver(adminUpdateUserFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      role: "user",
      password: "", // ✅ Thêm default password rỗng
      avatar: null,
    },
  });

  const { mutate: updateUser, isPending } = useUpdateUser();

  // 2. Effect: Map dữ liệu cũ
  useEffect(() => {
    if (isOpen && userToEdit) {
      document.body.style.overflow = "hidden";

      form.reset({
        fullName: userToEdit.fullName,
        email: userToEdit.email,
        role: userToEdit.role,
        password: "", // ✅ Luôn reset password về rỗng khi mở modal
        avatar: userToEdit.avatar || null,
      });
    } else {
      document.body.style.overflow = "unset";
      form.reset();
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, userToEdit, form]);

  // 3. Handle Submit
  const onSubmit = (data: AdminUpdateUserFormValues) => {
    if (!userToEdit) return;

    const payload: any = { ...data };

    // ✅ Clean Data:
    // 1. Nếu avatar là string url cũ -> xóa khỏi payload (không upload lại)
    if (typeof payload.avatar === "string") delete payload.avatar;

    // 2. Nếu password rỗng hoặc null -> xóa khỏi payload (nghĩa là không đổi pass)
    if (!payload.password || payload.password === "") {
      delete payload.password;
    }

    updateUser(
      { id: userToEdit._id, data: payload },
      { onSuccess: () => onClose() }
    );
  };

  return {
    form,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
