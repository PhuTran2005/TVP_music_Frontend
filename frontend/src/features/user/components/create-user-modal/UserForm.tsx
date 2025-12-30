import React, { useState, useEffect } from "react";
import { type UseFormReturn } from "react-hook-form";
import { Camera, ChevronDown, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { CreateUserFormValues } from "@/features/user/schemas/user.schema";

interface UserFormProps {
  form: UseFormReturn<CreateUserFormValues>;
  onSubmit: (data: CreateUserFormValues) => void;
  isPending: boolean;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  form,
  onSubmit,
  isPending,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;
  const [preview, setPreview] = useState<string | null>(null);

  // Cleanup URL object để tránh memory leak
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024)
        return toast.error("Ảnh quá lớn (Max 5MB)");
      setValue("avatar", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative group cursor-pointer w-24 h-24">
          <div
            className={cn(
              "w-full h-full rounded-full flex items-center justify-center overflow-hidden border-2 transition-all bg-secondary/30",
              preview
                ? "border-primary"
                : "border-dashed border-muted-foreground/30 group-hover:border-primary"
            )}
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            )}
          </div>

          {/* Overlay Icon */}
          <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg transition-transform group-hover:scale-110">
            <Camera className="w-3.5 h-3.5" />
          </div>

          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
            accept="image/*"
            onChange={handleAvatarChange}
          />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          Ảnh đại diện
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Họ tên <span className="text-red-500">*</span>
          </label>
          <input
            {...register("fullName")}
            placeholder="VD: Nguyễn Văn A"
            className={cn(
              "w-full bg-background border rounded-xl px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary",
              errors.fullName &&
                "border-destructive focus:ring-destructive/20 focus:border-destructive"
            )}
          />
          {errors.fullName && (
            <p className="text-[11px] font-medium text-destructive">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Vai trò
          </label>
          <div className="relative">
            <select
              {...register("role")}
              className="w-full bg-background border rounded-xl px-3 py-2.5 text-sm outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="user">User (Khán giả)</option>
              <option value="artist">Artist (Nghệ sĩ)</option>
              <option value="admin">Admin (Quản trị)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          {...register("email")}
          type="email"
          placeholder="example@email.com"
          className={cn(
            "w-full bg-background border rounded-xl px-3 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary",
            errors.email &&
              "border-destructive focus:ring-destructive/20 focus:border-destructive"
          )}
        />
        {errors.email && (
          <p className="text-[11px] font-medium text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Note */}
      <div className="p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl">
        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
          Hệ thống sẽ <b>tự động sinh mật khẩu</b> và hiển thị sau khi tạo thành
          công. Email thông báo cũng sẽ được gửi đến người dùng.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="px-5 py-2.5 text-sm font-medium hover:bg-secondary rounded-xl transition-colors disabled:opacity-50"
        >
          Hủy bỏ
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Đang xử lý..." : "Tạo tài khoản"}
        </button>
      </div>
    </form>
  );
};

export default UserForm;
