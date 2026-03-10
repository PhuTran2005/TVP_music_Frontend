import React from "react";
import { createPortal } from "react-dom";
import { Controller, useWatch } from "react-hook-form";
import {
  X,
  Save,
  Camera,
  User as UserIcon,
  ShieldCheck,
  Mail,
  Lock,
  UserCheck,
  UserX,
  AlertCircle,
  Loader2,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type User } from "../types";

// UI Components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Hook
import { useUserForm } from "../hooks/useUserForm";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: User | null;
  onSubmit: (data: FormData) => Promise<void>;
  isPending: boolean;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  userToEdit,
  onSubmit,
  isPending,
}) => {
  // 🔥 TÍCH HỢP HOOK MỚI ĐÃ CHUẨN HÓA
  const {
    form,
    handleSubmit,
    handleAvatarChange,
    avatarPreview,
    isSubmitting: isFormSubmitting,
  } = useUserForm({
    userToEdit,
    isOpen,
    onSubmit,
  });

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;

  // Xem trực tiếp trạng thái các Switch để đổi màu UI
  const isActive = useWatch({ control, name: "isActive" });
  const isVerified = useWatch({ control, name: "isVerified" });

  const isLoading = isPending || isFormSubmitting;

  if (!isOpen) return null;

  // --- Helper Components ---
  const FormLabel = ({
    children,
    required,
  }: {
    children: React.ReactNode;
    required?: boolean;
  }) => (
    <Label className="text-[11px] font-bold uppercase text-foreground/80 tracking-wider ml-0.5 mb-2 block">
      {children}{" "}
      {required && <span className="text-destructive text-sm">*</span>}
    </Label>
  );

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-destructive animate-in slide-in-from-left-1 fade-in duration-300">
        <AlertCircle className="size-3.5 shrink-0" />
        <span>{message}</span>
      </div>
    );
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-[101] w-full max-w-4xl bg-background border border-border shadow-2xl flex flex-col h-full sm:h-auto max-h-[90vh] rounded-2xl animate-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-white/10">
        {/* --- HEADER --- */}
        <header className="px-6 py-4 border-b border-border bg-card/50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20">
              <UserIcon className="size-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground leading-tight">
                {userToEdit ? "Sửa Hồ Sơ (Edit Profile)" : "Tạo Tài Khoản Mới"}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={cn(
                    "flex size-2 rounded-full animate-pulse",
                    userToEdit ? "bg-blue-500" : "bg-emerald-500",
                  )}
                />
                <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest">
                  {userToEdit
                    ? `ID: ${userToEdit._id.slice(-8)}`
                    : "Admin Dashboard"}
                </p>
              </div>
            </div>
          </div>
          <Button
            type="button" // Ngăn chặn trigger submit form
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-destructive/10 hover:text-destructive active:scale-95 transition-colors"
          >
            <X className="size-5" />
          </Button>
        </header>

        {/* --- BODY --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-secondary/5">
          <form
            id="user-form"
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 md:p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* === SIDEBAR (Avatar & Status) === */}
              <aside className="lg:col-span-4 space-y-6">
                {/* Avatar Upload */}
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col items-center text-center">
                  <div className="relative group size-32 rounded-full border-4 border-background shadow-lg overflow-hidden transition-all cursor-pointer bg-secondary/20 mb-4">
                    {avatarPreview ? (
                      <>
                        <img
                          src={avatarPreview}
                          alt="Avatar"
                          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted/30">
                        <UserIcon className="size-10 mb-2 opacity-30 text-foreground" />
                      </div>
                    )}

                    {/* Overlay Upload */}
                    <label className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10">
                      <div className="bg-background/80 backdrop-blur-md text-foreground p-2 rounded-full shadow-lg transform group-hover:scale-110 transition-transform">
                        <Camera className="size-5" />
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        className="hidden"
                        onChange={handleAvatarChange} // Sử dụng hàm đã có validation size từ hook
                      />
                    </label>
                  </div>
                  <h4 className="text-sm font-bold text-foreground mb-1">
                    Ảnh đại diện
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    JPEG, PNG hoặc WebP (Tối đa 5MB)
                  </p>
                  <ErrorMessage message={errors.avatar?.message as string} />
                </div>

                {/* Account Status */}
                <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2.5 rounded-lg border",
                        isActive
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-destructive/10 border-destructive/20 text-destructive",
                      )}
                    >
                      {isActive ? (
                        <UserCheck className="size-5" />
                      ) : (
                        <UserX className="size-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        Trạng thái
                      </p>
                      <p
                        className={cn(
                          "text-[11px] font-medium mt-0.5",
                          isActive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-destructive",
                        )}
                      >
                        {isActive ? "Đang hoạt động" : "Bị khóa (Banned)"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={(v) =>
                      // 🔥 Bổ sung shouldValidate để cập nhật state ngay lập tức
                      setValue("isActive", v, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>

                {/* Verification Badge */}
                <div className="p-4 rounded-xl border border-border bg-card shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "p-2.5 rounded-lg border",
                        isVerified
                          ? "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400"
                          : "bg-secondary border-transparent text-muted-foreground",
                      )}
                    >
                      <ShieldCheck className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        Tích xanh
                      </p>
                      <p className="text-[11px] font-medium mt-0.5 text-muted-foreground">
                        {isVerified
                          ? "Tài khoản xác thực"
                          : "Người dùng thường"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isVerified}
                    onCheckedChange={(v) =>
                      setValue("isVerified", v, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>
              </aside>

              {/* === MAIN CONTENT === */}
              <main className="lg:col-span-8 bg-card rounded-xl border border-border shadow-sm p-6 space-y-6">
                {/* 1. Full Name */}
                <div>
                  <FormLabel required>Họ và tên</FormLabel>
                  <Input
                    {...register("fullName")}
                    autoComplete="off"
                    spellCheck="false"
                    className={cn(
                      "h-11 text-base font-semibold bg-background border-input shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg px-3 transition-all",
                      errors.fullName &&
                        "border-destructive focus-visible:ring-destructive/20 bg-destructive/5",
                    )}
                    placeholder="VD: Sơn Tùng M-TP"
                  />
                  <ErrorMessage message={errors.fullName?.message} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* 2. Email */}
                  <div>
                    <FormLabel required>Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        type="email"
                        {...register("email")}
                        autoComplete="off"
                        // 🔥 Cho phép Admin sửa email nhưng cảnh báo nhẹ
                        className={cn(
                          "pl-9 h-10 rounded-lg bg-background border-input shadow-sm px-3",
                          errors.email && "border-destructive bg-destructive/5",
                        )}
                        placeholder="admin@example.com"
                      />
                    </div>
                    {userToEdit && !errors.email && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-1.5 ml-1 font-medium italic">
                        * Thay đổi email có thể ảnh hưởng đến đăng nhập.
                      </p>
                    )}
                    <ErrorMessage message={errors.email?.message} />
                  </div>

                  {/* 3. Role */}
                  <div>
                    <FormLabel required>Phân quyền (Role)</FormLabel>
                    <Controller
                      control={control}
                      name="role"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-10 w-full bg-background border-input shadow-sm font-medium">
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">
                              Người nghe (User)
                            </SelectItem>
                            <SelectItem value="artist">
                              Nghệ sĩ (Artist)
                            </SelectItem>
                            <SelectItem
                              value="admin"
                              className="text-destructive font-bold focus:text-destructive"
                            >
                              Quản trị viên (Admin)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <ErrorMessage message={errors.role?.message} />
                  </div>
                </div>

                {/* 4. Password */}
                <div>
                  <FormLabel>Mật khẩu</FormLabel>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type="password"
                      autoComplete="new-password" // Tránh tự điền password lộn xộn
                      {...register("password")}
                      className={cn(
                        "pl-9 h-10 rounded-lg bg-background border-input shadow-sm px-3",
                        errors.password &&
                          "border-destructive bg-destructive/5",
                      )}
                      placeholder={
                        userToEdit
                          ? "Bỏ trống nếu không muốn đổi mật khẩu"
                          : "Nhập mật khẩu cho tài khoản mới"
                      }
                    />
                  </div>
                  {userToEdit && !errors.password && (
                    <p className="text-[11px] text-muted-foreground mt-1.5 ml-1 font-medium italic">
                      * Nhập vào đây sẽ ghi đè mật khẩu hiện tại của người dùng.
                    </p>
                  )}
                  <ErrorMessage message={errors.password?.message} />
                </div>

                <Separator className="my-2" />

                {/* 5. Bio */}
                <div>
                  <div className="flex items-center gap-2 mb-2 ml-0.5">
                    <FileText className="size-3.5 text-muted-foreground" />
                    <span className="text-[11px] font-bold uppercase text-foreground/80 tracking-wider">
                      Tiểu sử (Bio)
                    </span>
                  </div>
                  <Textarea
                    {...register("bio")}
                    spellCheck="false"
                    className={cn(
                      "min-h-[120px] text-sm p-3 bg-background border-input shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 rounded-xl resize-none transition-all custom-scrollbar",
                      errors.bio && "border-destructive bg-destructive/5",
                    )}
                    placeholder="Viết một vài dòng giới thiệu về người dùng này..."
                  />
                  <ErrorMessage message={errors.bio?.message} />
                </div>
              </main>
            </div>
          </form>
        </div>

        {/* --- FOOTER --- */}
        <footer className="px-6 py-4 border-t border-border bg-background flex justify-end items-center gap-3 shrink-0 z-20">
          <Button
            variant="ghost"
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 px-6 rounded-lg font-bold text-xs uppercase tracking-wide text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          >
            Hủy
          </Button>
          <Button
            form="user-form"
            type="submit"
            disabled={isLoading}
            className="h-10 px-8 rounded-lg font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <Save className="size-4 mr-2" />
            )}
            {userToEdit ? "Lưu thay đổi" : "Tạo tài khoản"}
          </Button>
        </footer>
      </div>
    </div>,
    document.body,
  );
};

export default UserModal;
