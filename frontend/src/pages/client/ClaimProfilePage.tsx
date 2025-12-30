import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClaimProfile } from "@/features/user/hooks/useUserClient";
import { BadgeCheck, Lock, Mail } from "lucide-react";

const ClaimProfilePage = () => {
  const { form, onSubmit, isPending } = useClaimProfile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
            <BadgeCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Định danh Tài khoản</h1>
          <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
            Bạn đang sử dụng tài khoản được cấp bởi Admin. <br />
            Vui lòng cập nhật{" "}
            <span className="text-white font-semibold">
              Email chính chủ
            </span> và{" "}
            <span className="text-white font-semibold">Mật khẩu mới</span> để
            kích hoạt toàn bộ tính năng.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-zinc-300">Email của bạn (Mới)</Label>
            <div className="relative">
              <Input
                {...register("newEmail")}
                placeholder="name@example.com"
                className="pl-10 bg-zinc-950/50 border-zinc-700 text-white focus:border-indigo-500 transition-all"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            </div>
            {errors.newEmail && (
              <p className="text-red-400 text-xs">{errors.newEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Thiết lập Mật khẩu mới</Label>
            <div className="relative">
              <Input
                type="password"
                {...register("newPassword")}
                placeholder="••••••••"
                className="pl-10 bg-zinc-950/50 border-zinc-700 text-white focus:border-indigo-500 transition-all"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            </div>
            {errors.newPassword && (
              <p className="text-red-400 text-xs">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-300">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Input
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                className="pl-10 bg-zinc-950/50 border-zinc-700 text-white focus:border-indigo-500 transition-all"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            {isPending ? "Đang cập nhật..." : "Xác nhận & Gửi OTP"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ClaimProfilePage;
