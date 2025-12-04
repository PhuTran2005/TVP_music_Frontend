/**
 * MUSIC UI KIT - ULTIMATE EDITION
 * ------------------------------------------------
 * Phong cách: Clean, Light Mode, Modern, Soft Shadows.
 * Dựa trên thiết kế "Artist Spotlight" của MusicHub.
 * * UPDATE: Nâng cấp MusicResult thành phiên bản "Ultimate" hỗ trợ hình ảnh và nội dung mở rộng.
 * * UPDATE v2: Bổ sung đầy đủ các trường hợp lỗi (Error Scenarios) vào Demo.
 * * FIX: Thêm import thiếu (RefreshCw) để sửa lỗi ReferenceError.
 * * FIX v3: Nhúng Style trực tiếp vào MusicContainer để Animation hoạt động khi import lẻ.
 */

import React from "react";
import { Music } from "lucide-react";

// ============================================================================
// 1. GLOBAL STYLES & UTILS
// ============================================================================

const musicStyles = `
  /* --- Typography --- */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  /* --- Animations --- */
  @keyframes liquid-bar-clean {
    0%, 100% { height: 30%; opacity: 0.4; }
    50% { height: 90%; opacity: 1; }
  }
  
  @keyframes vinyl-spin-smooth {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulse-ring {
    0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.1); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); }
    100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
  }

  @keyframes float-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* --- Base Class --- */
  .font-music-hub {
    font-family: 'Inter', sans-serif;
  }

  .hub-card {
    background: white;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    border-radius: 12px;
  }
  
  .hub-btn-primary {
    background-color: #0f172a; 
    color: white;
    transition: all 0.2s;
  }
  .hub-btn-primary:hover {
    background-color: #1e293b;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .hub-btn-secondary {
    background-color: white;
    border: 1px solid #e2e8f0;
    color: #1e293b;
    transition: all 0.2s;
  }
  .hub-btn-secondary:hover {
    border-color: #cbd5e1;
    background-color: #f8fafc;
  }

  /* Custom Scrollbar for demo areas */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 20px;
  }

  .animate-liquid-clean { animation: liquid-bar-clean 1s ease-in-out infinite; }
  .animate-vinyl-smooth { animation: vinyl-spin-smooth 4s linear infinite; }
  .animate-pulse-clean { animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .animate-float { animation: float-in 0.5s ease-out forwards; }
`;

// Interface dùng chung
interface CommonProps {
  fullscreen?: boolean;
  className?: string;
  text?: React.ReactNode;
}

// Wrapper Component
const MusicContainer: React.FC<CommonProps & { children: React.ReactNode }> = ({
  fullscreen,
  children,
  className = "",
}) => {
  const layoutClass = fullscreen
    ? "fixed inset-0 z-[9999] bg-[#fafafa]"
    : "relative w-full h-full bg-[#f8fafc] overflow-hidden";

  return (
    <div
      className={`flex flex-col items-center justify-center font-music-hub ${layoutClass} ${className}`}
    >
      {/* FIX: Nhúng style vào đây để đảm bảo animation chạy khi dùng lẻ component */}
      <style>{musicStyles}</style>

      <div className="absolute inset-0 bg-white opacity-50"></div>
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// ============================================================================
// 2. LOADERS (Equalizer, Vinyl, Pulse)
// ============================================================================

export const EqualizerLoader: React.FC<CommonProps> = ({
  fullscreen,
  text = "Loading...",
}) => {
  return (
    <MusicContainer fullscreen={fullscreen}>
      <div
        className={`flex flex-col items-center gap-6 ${
          fullscreen ? "scale-125" : "scale-100"
        }`}
      >
        <div className="flex items-end justify-center gap-1.5 h-16">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 bg-slate-900 rounded-full animate-liquid-clean"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: `${0.8 + Math.random() * 0.4}s`,
              }}
            />
          ))}
        </div>
        <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
          {text}
        </p>
      </div>
    </MusicContainer>
  );
};

export const VinylLoader: React.FC<CommonProps> = ({
  fullscreen,
  text = "Loading...",
}) => {
  return (
    <MusicContainer fullscreen={fullscreen}>
      <div
        className={`flex flex-col items-center gap-6 ${
          fullscreen ? "scale-125" : "scale-100"
        }`}
      >
        <div className="relative w-28 h-28 rounded-full bg-slate-900 shadow-xl flex items-center justify-center animate-vinyl-smooth">
          <div className="absolute inset-0 rounded-full border-[8px] border-slate-800 opacity-50"></div>
          <div className="absolute inset-6 rounded-full border border-white/10"></div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center relative z-10 shadow-sm">
            <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
        </div>
        <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
          {text}
        </p>
      </div>
    </MusicContainer>
  );
};

export const PulseLoader: React.FC<CommonProps> = ({
  fullscreen,
  text = "Please wait...",
}) => {
  return (
    <MusicContainer fullscreen={fullscreen}>
      <div
        className={`flex flex-col items-center gap-6 ${
          fullscreen ? "scale-125" : "scale-100"
        }`}
      >
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-slate-200 animate-pulse-clean"></div>
          <div
            className="absolute inset-4 rounded-full bg-slate-300 animate-pulse-clean"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div className="relative z-10 w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center shadow-lg text-white">
            <Music size={20} fill="currentColor" />
          </div>
        </div>
        <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase">
          {text}
        </p>
      </div>
    </MusicContainer>
  );
};
