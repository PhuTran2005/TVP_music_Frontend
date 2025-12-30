import React from "react";
import { type UseFormReturn } from "react-hook-form";
import { Check, ShieldCheck, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ArtistFormValues } from "@/features/artist/schemas/artist.schema";
import { Label } from "@/components/ui/label";

interface SettingsSectionProps {
  form: UseFormReturn<ArtistFormValues>;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ form }) => {
  const isVerified = form.watch("isVerified");

  return (
    <div className="space-y-4 p-6 bg-muted/20 rounded-2xl border border-border/50">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <ShieldAlert className="size-4 text-primary" />
        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">
          Trạng thái & Bảo mật
        </h4>
      </div>

      <Label
        htmlFor="isVerified"
        className={cn(
          "flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer group select-none",
          isVerified
            ? "bg-blue-500/5 border-blue-500/30 ring-4 ring-blue-500/5"
            : "bg-background border-border hover:border-primary/30"
        )}
      >
        <div className="relative flex items-center mt-0.5">
          <input
            id="isVerified"
            type="checkbox"
            {...form.register("isVerified")}
            className="peer sr-only"
          />
          <div className="size-5 border-2 border-muted-foreground/30 rounded-md bg-background transition-all peer-checked:bg-blue-500 peer-checked:border-blue-500 flex items-center justify-center">
            <Check
              className={cn(
                "size-3.5 text-white transition-opacity",
                isVerified ? "opacity-100" : "opacity-0"
              )}
            />
          </div>
        </div>

        <div className="space-y-1">
          <span className="font-bold text-sm flex items-center gap-2 text-foreground group-hover:text-primary transition-colors">
            Official Artist Verification
            {isVerified && (
              <ShieldCheck className="size-4 text-blue-500 animate-in zoom-in" />
            )}
          </span>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Hồ sơ nghệ sĩ sẽ nhận được{" "}
            <span className="text-blue-500 font-semibold italic">
              Huy hiệu Tích xanh
            </span>
            . Việc này giúp tăng độ uy tín và ưu tiên hiển thị trong kết quả tìm
            kiếm của người dùng.
          </p>
        </div>
      </Label>
    </div>
  );
};

export default SettingsSection;
