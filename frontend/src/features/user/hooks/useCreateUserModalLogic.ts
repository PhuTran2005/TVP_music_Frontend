// src/features/user/hooks/useCreateUserModalLogic.ts
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateUser } from "@/features/user/hooks/useUserAdmin";
import {
  createUserSchema,
  type CreateUserFormValues,
} from "@/features/user/schemas/user.schema";
import type { ApiErrorResponse } from "@/types";

interface UseCreateUserModalLogicProps {
  isOpen: boolean;
  onClose: () => void;
}

export const useCreateUserModalLogic = ({
  isOpen,
}: UseCreateUserModalLogicProps) => {
  // 1. Local State quản lý luồng UI
  const [step, setStep] = useState<"form" | "success">("form");
  const [generatedUser, setGeneratedUser] = useState<{
    email: string;
    password?: string;
  } | null>(null);

  // 2. Setup Mutation & Form
  const { mutate: createUser, isPending } = useCreateUser();

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { fullName: "", email: "", role: "user", avatar: null },
  });

  // 3. Effect: Reset form khi đóng modal
  useEffect(() => {
    if (!isOpen) {
      // Delay reset để tránh UI bị giật khi đang đóng modal
      const timer = setTimeout(() => {
        setStep("form");
        setGeneratedUser(null);
        form.reset();
      }, 300);
      return () => clearTimeout(timer);
    }

    // Lock scroll body khi mở modal
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, form]);

  // 4. Handle Submit
  const onSubmit = (data: CreateUserFormValues) => {
    createUser(data, {
      onSuccess: (res: any) => {
        // Lưu thông tin user vừa tạo để hiển thị ở bước Success
        setGeneratedUser({
          email: data.email,
          password: res.data?.generatedPassword, // Lấy password nếu backend trả về
        });

        // Chuyển sang giao diện Success
        setStep("success");
        toast.success("Tạo tài khoản thành công");
      },
      onError: (err: unknown) => {
        const error = err as ApiErrorResponse;
        const msg =
          error?.response?.data?.message || "Có lỗi xảy ra khi tạo user";
        toast.error(msg);
      },
    });
  };

  return {
    form,
    step,
    generatedUser,
    isPending,
    onSubmit: form.handleSubmit(onSubmit),
  };
};
