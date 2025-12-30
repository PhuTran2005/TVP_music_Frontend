import React, { useState } from "react";
import {
  CheckCircle2,
  Copy,
  Mail,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SuccessViewProps {
  email: string;
  password?: string; // Optional
  onClose: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({
  email,
  password,
  onClose,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setIsCopied(true);
      toast.success("Đã sao chép mật khẩu");
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Success Banner */}
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex gap-4 items-start">
        <div className="p-2.5 bg-emerald-500/20 rounded-full shrink-0">
          <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h4 className="text-base font-bold text-emerald-700 dark:text-emerald-400">
            Tài khoản đã kích hoạt
          </h4>
          <p className="text-sm text-emerald-600/80 dark:text-emerald-400/70 mt-1 leading-relaxed">
            Người dùng <b>{email}</b> đã được thêm vào hệ thống và có thể đăng
            nhập ngay.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
            Email đăng nhập
          </label>
          <div className="group relative bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-sm font-mono text-foreground flex items-center gap-3 transition-colors hover:bg-muted hover:border-primary/30">
            <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            {email}
          </div>
        </div>

        {/* Password Field - Logic hiển thị an toàn */}
        {password ? (
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
              Mật khẩu tạm thời
            </label>
            <div className="relative group">
              <div className="bg-muted/50 border border-border rounded-xl px-4 py-3.5 text-lg font-mono font-bold text-foreground tracking-wider border-l-4 border-l-primary shadow-sm group-hover:bg-muted transition-colors">
                {password}
              </div>
              <button
                onClick={handleCopy}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all shadow-sm border",
                  isCopied
                    ? "bg-emerald-100 text-emerald-600 border-emerald-200"
                    : "bg-background text-muted-foreground hover:text-primary hover:border-primary/30"
                )}
                title="Sao chép mật khẩu"
              >
                {isCopied ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="flex items-start gap-2 mt-2 px-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Hãy sao chép ngay. Mật khẩu này sẽ không hiển thị lại.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
            <p className="text-sm text-muted-foreground">
              Mật khẩu đã được gửi đến email của người dùng.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="w-full mt-2 px-6 py-3.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <CheckCircle2 className="w-5 h-5" /> Hoàn tất quy trình
      </button>
    </div>
  );
};

export default SuccessView;
