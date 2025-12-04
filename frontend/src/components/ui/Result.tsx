/**
 * MUSIC UI KIT - ULTIMATE EDITION
 * ------------------------------------------------
 * Phong cách: Clean, Light Mode, Modern, Soft Shadows.
 * Dựa trên thiết kế "Artist Spotlight" của MusicHub.
 * * UPDATE: Nâng cấp MusicResult thành phiên bản "Ultimate" hỗ trợ hình ảnh và nội dung mở rộng.
 * * UPDATE v2: Bổ sung đầy đủ các trường hợp lỗi (Error Scenarios) vào Demo.
 * * FIX: Thêm import thiếu (RefreshCw) để sửa lỗi ReferenceError.
 */

import React from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Search,
  Lock,
  FolderOpen,
  CreditCard,
  CloudOff,
  ShieldAlert,
} from "lucide-react";

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
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode; // Custom icon override
  image?: string; // Image illustration URL
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: { label: string; onClick: () => void };
  children?: React.ReactNode; // Extra content area
  className?: string;
  style?: React.CSSProperties;
}

const MusicResult: React.FC<MusicResultProps> = ({
  status = "info",
  title,
  description,
  icon: customIcon,
  image,
  primaryAction,
  secondaryAction,
  children,
  className = "",
  style,
}) => {
  // Theme configuration for each status
  const getConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: CheckCircle2,
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-100",
        };
      case "error":
        return {
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-100",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-100",
        };
      case "lock":
        return {
          icon: Lock,
          color: "text-slate-700",
          bg: "bg-slate-100",
          border: "border-slate-200",
        };
      case "404":
        return {
          icon: Search,
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100",
        };
      case "403":
        return {
          icon: ShieldAlert,
          color: "text-orange-600",
          bg: "bg-orange-50",
          border: "border-orange-100",
        };
      case "payment":
        return {
          icon: CreditCard,
          color: "text-violet-600",
          bg: "bg-violet-50",
          border: "border-violet-100",
        };
      case "offline":
        return {
          icon: CloudOff,
          color: "text-slate-500",
          bg: "bg-slate-100",
          border: "border-slate-200",
        };
      case "empty":
        return {
          icon: FolderOpen,
          color: "text-slate-400",
          bg: "bg-slate-50",
          border: "border-slate-100",
        };
      default:
        return {
          icon: Info,
          color: "text-slate-900",
          bg: "bg-slate-100",
          border: "border-slate-200",
        };
    }
  };

  const { icon: DefaultIcon, color, bg, border } = getConfig();

  return (
    <div
      className={`relative w-full h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-white font-music-hub animate-float overflow-y-auto custom-scrollbar ${className}`}
      style={style}
    >
      {/* 1. VISUAL AREA (Image or Icon) */}
      <div className="mb-6 flex justify-center">
        {image ? (
          // Image Mode: Great for illustrations
          <div className="w-64 h-48 rounded-xl overflow-hidden shadow-sm border border-slate-100">
            <img
              src={image}
              alt="Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        ) : customIcon ? (
          // Custom Icon Mode
          <div className={`p-6 rounded-full ${bg} ${color} ${border} border`}>
            {customIcon}
          </div>
        ) : (
          // Default Status Icon Mode
          <div
            className={`p-6 rounded-full ${bg} ${color} ${border} border shadow-sm`}
          >
            <DefaultIcon size={48} strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* 2. TEXT AREA */}
      <div className="text-center max-w-md w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight leading-tight">
          {title}
        </h2>

        {description && (
          <div className="text-slate-500 text-sm md:text-base leading-relaxed mb-6">
            {description}
          </div>
        )}
      </div>

      {/* 3. EXTRA CONTENT SLOT (For children like progress bars, lists, inputs) */}
      {children && <div className="w-full max-w-md mb-8">{children}</div>}

      {/* 4. ACTIONS AREA */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="hub-btn-primary px-8 border-2 py-3 rounded-xl font-semibold text-sm min-w-[140px] flex items-center justify-center gap-2"
          >
            {primaryAction.icon}
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="hub-btn-secondary px-8 py-3 rounded-xl font-semibold text-sm min-w-[140px]"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};
export default MusicResult;
