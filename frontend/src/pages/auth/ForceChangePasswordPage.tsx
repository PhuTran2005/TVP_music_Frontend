import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForceChangePassword } from "@/features/auth/hooks/useForceChangePassword";
import { ShieldAlert } from "lucide-react";

export const ForceChangePasswordPage = () => {
  // Gọi hook để lấy logic
  const { register, errors, isPending, onSubmit } = useForceChangePassword();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-3">
            <ShieldAlert className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-xl font-bold text-white">Cập nhật Mật khẩu</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Để bảo mật tài khoản, vui lòng đổi mật khẩu mặc định mà Admin đã
            cung cấp.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Mật khẩu hiện tại */}
          <div className="space-y-2">
            <Label className="text-white">Mật khẩu hiện tại (Admin cấp)</Label>
            <Input
              type="password"
              {...register("currentPassword", {
                required: "Vui lòng nhập mật khẩu hiện tại",
              })}
              className="bg-zinc-800 border-zinc-700 text-white focus:ring-amber-500"
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          {/* Mật khẩu mới */}
          <div className="space-y-2">
            <Label className="text-white">Mật khẩu mới</Label>
            <Input
              type="password"
              {...register("newPassword", {
                required: "Vui lòng nhập mật khẩu mới",
                minLength: { value: 6, message: "Tối thiểu 6 ký tự" },
              })}
              className="bg-zinc-800 border-zinc-700 text-white focus:ring-amber-500"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="space-y-2">
            <Label className="text-white">Xác nhận mật khẩu mới</Label>
            <Input
              type="password"
              {...register("confirmPassword", {
                required: "Vui lòng xác nhận mật khẩu",
              })}
              className="bg-zinc-800 border-zinc-700 text-white focus:ring-amber-500"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2 disabled:opacity-50"
          >
            {isPending ? "Đang cập nhật..." : "Đổi mật khẩu & Truy cập"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForceChangePasswordPage;
