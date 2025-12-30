import { cn } from "@/lib/utils";

export const UploadLabel = ({ field, onChange, label, icon, isRound }: any) => (
  <label
    className={cn(
      "cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white transition-all flex items-center gap-2 font-medium shadow-lg",
      isRound
        ? "px-3 py-1.5 rounded-full text-xs"
        : "px-4 py-2 rounded-lg text-sm"
    )}
  >
    {icon}
    <span>{label}</span>
    <input
      type="file"
      className="hidden"
      accept="image/*"
      onChange={(e) => onChange(e, field)}
    />
  </label>
);

export const SocialInput = ({ icon, placeholder, reg, error }: any) => (
  <div className="group">
    <div
      className={cn(
        "flex items-center gap-3 bg-background border border-input rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm",
        error &&
          "border-destructive focus-within:border-destructive focus-within:ring-destructive/20"
      )}
    >
      <div className="shrink-0 opacity-60 grayscale group-focus-within:grayscale-0 group-focus-within:opacity-100 transition-all">
        {icon}
      </div>
      <input
        {...reg}
        className="bg-transparent text-sm w-full outline-none placeholder:text-muted-foreground/40"
        placeholder={placeholder}
      />
    </div>
    {error && (
      <span className="text-[10px] text-destructive mt-1 ml-1">
        {error.message}
      </span>
    )}
  </div>
);
