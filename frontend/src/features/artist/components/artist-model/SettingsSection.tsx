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
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
        <ShieldAlert className="size-4 text-primary" />
        <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">
          Trạng thái & Bảo mật
        </h4>
      </div>

      {/* Verification Card */}
      <Label
        htmlFor="isVerified"
        className={cn(
          "flex-1 flex flex-col gap-4 p-5 rounded-xl border-2 transition-all cursor-pointer group select-none relative overflow-hidden",
          isVerified
            ? "bg-blue-500/5 border-blue-500/50 shadow-sm"
            : "bg-background border-input hover:border-foreground/30 hover:bg-muted/30"
        )}
      >
        {/* Checkbox ẩn */}
        <input
          id="isVerified"
          type="checkbox"
          {...form.register("isVerified")}
          className="peer sr-only"
        />

        {/* Header của Card */}
        <div className="flex justify-between items-start w-full">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "size-9 rounded-full flex items-center justify-center transition-colors",
                isVerified
                  ? "bg-blue-100 text-blue-600"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <span
                className={cn(
                  "font-bold text-sm block",
                  isVerified ? "text-blue-700" : "text-foreground"
                )}
              >
                Official Artist
              </span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Verification Status
              </span>
            </div>
          </div>

          {/* Custom Checkbox UI */}
          <div
            className={cn(
              "size-6 border-2 rounded-full flex items-center justify-center transition-all duration-300",
              isVerified
                ? "bg-blue-500 border-blue-500 shadow-md scale-110"
                : "bg-transparent border-muted-foreground/40"
            )}
          >
            <Check
              className={cn(
                "size-3.5 text-white stroke-[4] transition-transform",
                isVerified ? "scale-100" : "scale-0"
              )}
            />
          </div>
        </div>

        {/* Content Description */}
        <div className="mt-2 space-y-2">
          <p className="text-xs text-foreground/80 leading-relaxed font-medium">
            Kích hoạt huy hiệu{" "}
            <span className="text-blue-600 font-bold">Tích xanh</span> cho hồ sơ
            nghệ sĩ này.
          </p>
          <div className="text-[11px] text-muted-foreground bg-background/50 p-2 rounded-lg border border-border/50">
            <ul className="list-disc list-inside space-y-1">
              <li>Tăng độ uy tín hiển thị.</li>
              <li>Ưu tiên trong kết quả tìm kiếm.</li>
              <li>Bảo vệ bản quyền nội dung.</li>
            </ul>
          </div>
        </div>

        {/* Decorative Background Element */}
        {isVerified && (
          <div className="absolute -bottom-6 -right-6 size-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        )}
      </Label>
    </div>
  );
};

export default SettingsSection;
