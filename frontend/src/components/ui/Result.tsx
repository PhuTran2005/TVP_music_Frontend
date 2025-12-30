import React from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Search,
  Lock,
  CreditCard,
  WifiOff,
  Music,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type MusicResultStatus =
  | "success"
  | "error"
  | "info"
  | "warning"
  | "404"
  | "403"
  | "offline"
  | "lock"
  | "empty"
  | "payment";

interface MusicResultProps {
  status?: MusicResultStatus;
  isFullScreen?: boolean;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  image?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: { label: string; onClick: () => void };
  children?: React.ReactNode;
  className?: string;
}

// Cấu hình màu sắc chuẩn semantic
const getStatusConfig = (status: MusicResultStatus) => {
  switch (status) {
    case "success":
      return {
        icon: CheckCircle2,
        // Dùng màu Emerald (Ngọc lục bảo) cho Success -> Sang hơn Green thường
        colorClass:
          "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-400",
        glow: "bg-emerald-500",
      };
    case "error":
      return {
        icon: XCircle,
        colorClass: "text-destructive bg-destructive/10 border-destructive/20",
        glow: "bg-destructive",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        colorClass:
          "text-amber-600 bg-amber-500/10 border-amber-500/20 dark:text-amber-400",
        glow: "bg-amber-500",
      };
    case "lock":
    case "403":
      return {
        icon: Lock,
        colorClass: "text-muted-foreground bg-muted border-border",
        glow: "bg-gray-500",
      };
    case "payment":
      return {
        icon: CreditCard,
        colorClass:
          "text-pink-600 bg-pink-500/10 border-pink-500/20 dark:text-pink-400",
        glow: "bg-pink-500",
      };
    case "offline":
      return {
        icon: WifiOff,
        colorClass:
          "text-rose-600 bg-rose-500/10 border-rose-500/20 dark:text-rose-400",
        glow: "bg-rose-500",
      };
    case "404":
    case "empty":
      return {
        icon: Search,
        colorClass: "text-primary bg-primary/10 border-primary/20",
        glow: "bg-primary",
      };
    default:
      return {
        icon: Info,
        colorClass:
          "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400",
        glow: "bg-blue-500",
      };
  }
};

const MusicResult: React.FC<MusicResultProps> = ({
  status = "info",
  isFullScreen = false,
  title,
  description,
  icon: customIcon,
  image,
  primaryAction,
  secondaryAction,
  children,
  className,
}) => {
  const { icon: DefaultIcon, colorClass, glow } = getStatusConfig(status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "relative flex flex-col items-center justify-center p-8 text-center overflow-hidden min-h-[400px]",
        // Layout: Fullscreen hoặc Card
        isFullScreen
          ? "fixed inset-0 z-50 h-screen w-screen bg-background"
          : "w-full flex-1 bg-card/50 rounded-xl border border-border/50",
        className
      )}
    >
      {/* Background Effects (Tinh tế hơn, không quá chói) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glow nhẹ phía sau icon */}
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full blur-[80px] opacity-20 mix-blend-screen",
            glow
          )}
        />
        {/* Texture hạt nhiễu (tạo cảm giác đắt tiền) */}
        <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="relative z-10 max-w-md w-full flex flex-col items-center gap-6">
        {/* 1. Visual (Icon hoặc Image) */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {image ? (
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border border-border bg-muted relative group">
              <img
                src={image}
                alt="Status"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay nhẹ */}
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ) : (
            <div
              className={cn(
                "p-6 rounded-full border shadow-lg backdrop-blur-md relative mb-2",
                colorClass
              )}
            >
              {customIcon || (
                <DefaultIcon className="size-12 sm:size-16" strokeWidth={1.5} />
              )}

              {/* Vòng xoay nhẹ (Loading vibes) */}
              <div
                className={cn(
                  "absolute inset-0 rounded-full border border-current opacity-20 animate-[spin_10s_linear_infinite]"
                )}
              />
            </div>
          )}
        </motion.div>

        {/* 2. Text Content */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-2 px-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
            {title}
          </h2>
          {description && (
            <p className="text-muted-foreground text-base sm:text-lg text-pretty max-w-sm mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>

        {/* 3. Custom Children (Form, Input, etc.) */}
        {children && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full py-2"
          >
            {children}
          </motion.div>
        )}

        {/* 4. Action Buttons */}
        {(primaryAction || secondaryAction) && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col-reverse sm:flex-row items-center gap-3 w-full justify-center pt-2"
          >
            {secondaryAction && (
              <Button
                variant="outline"
                size="lg"
                onClick={secondaryAction.onClick}
                className="w-full sm:w-auto rounded-full min-w-[120px]"
              >
                {secondaryAction.label}
              </Button>
            )}
            {primaryAction && (
              <Button
                size="lg"
                onClick={primaryAction.onClick}
                className="w-full sm:w-auto rounded-full shadow-lg shadow-primary/20 gap-2 min-w-[140px]"
              >
                {primaryAction.icon}
                {primaryAction.label}
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* Footer Status (Tech style - Optional) */}
      <div className="absolute bottom-6 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground/30 pointer-events-none select-none">
        <Music className="size-3 animate-pulse" />
        <span>System Status: {status}</span>
      </div>
    </motion.div>
  );
};

export default MusicResult;
