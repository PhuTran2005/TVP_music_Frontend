import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  YAxis,
} from "recharts";
import { ChartTrack } from "@/features/track/types";
import { cn } from "@/lib/utils";
import { EqualizerLoader } from "@/components/ui/MusicLoadingEffects";

// Interface nhận cả Data vẽ biểu đồ VÀ List bài hát để lấy info (tên, ảnh)
interface ChartLineProps {
  data: any[]; // Dữ liệu biểu đồ (Time Series)
  tracks: ChartTrack[]; // Dữ liệu bài hát (Metadata)
}

// Palette màu chuẩn (Top 1: Blue, Top 2: Green, Top 3: Red)
const RANK_COLORS = ["#3b82f6", "#10b981", "#ef4444"];

export const ChartLine = ({ data, tracks }: ChartLineProps) => {
  // Guard clause: Nếu không có data thì không render tránh lỗi
  const hasData = data && data.length > 0 && tracks && tracks.length > 0;

  if (!hasData) {
    // 🔥 FIX: Return khung giữ chỗ trong suốt thay vì text lỗi để tránh layout shift
    // hoặc hiển thị Skeleton Loading
    return (
      <div className="w-full h-[300px] sm:h-[350px] flex items-center justify-center border border-white/5 rounded-xl bg-white/5 animate-pulse">
        {/* Có thể hiện loader nhẹ ở đây nếu muốn */}
        <EqualizerLoader />
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] sm:h-[350px] select-none animate-in fade-in duration-700">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
        >
          {/* --- 1. Gradients (Tạo hiệu ứng mờ dần xuống dưới) --- */}
          <defs>
            {[0, 1, 2].map((i) => (
              <linearGradient
                key={i}
                id={`colorTop${i + 1}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={RANK_COLORS[i]}
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor={RANK_COLORS[i]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          {/* --- 2. Grid & Axes (Tinh tế, mờ nhẹ) --- */}
          <CartesianGrid
            strokeDasharray="4 4"
            vertical={false}
            stroke="hsl(var(--border))"
            opacity={0.3}
          />

          <XAxis
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "hsl(var(--muted-foreground))",
              fontSize: 11,
              fontWeight: 500,
            }}
            dy={10}
            interval="preserveStartEnd"
          />

          {/* Auto Domain: Tự động zoom để biểu đồ luôn cao đẹp dù view thấp */}
          <YAxis hide domain={["auto", "auto"]} />

          {/* --- 3. Custom Tooltip (Glassmorphism & Full Info) --- */}
          <Tooltip
            cursor={{
              stroke: "hsl(var(--muted-foreground))",
              strokeWidth: 1,
              strokeDasharray: "4 4",
              opacity: 0.5,
            }}
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-popover/95 border border-white/10 backdrop-blur-xl p-3 rounded-xl shadow-2xl min-w-[180px] ring-1 ring-white/5 z-50">
                    <p className="text-muted-foreground text-[10px] font-bold mb-3 uppercase tracking-wider text-center border-b border-white/10 pb-2">
                      {label}
                    </p>
                    <div className="space-y-3">
                      {payload.map((entry: any, index: number) => {
                        // Lấy thông tin track tương ứng với line này
                        const track = tracks[index];
                        if (!track) return null;

                        return (
                          <div key={index} className="flex items-center gap-3">
                            {/* Rank Number */}
                            <span
                              className={cn(
                                "font-black text-xs w-4 shrink-0",
                                index === 0
                                  ? "text-blue-500"
                                  : index === 1
                                  ? "text-emerald-500"
                                  : "text-red-500"
                              )}
                            >
                              #{index + 1}
                            </span>

                            {/* Cover Image */}
                            <img
                              src={track.coverImage}
                              className="w-8 h-8 rounded object-cover shadow-sm border border-white/10 shrink-0"
                              alt=""
                            />

                            {/* Info */}
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <div className="flex items-baseline justify-between gap-2">
                                <p className="text-[11px] font-bold text-foreground truncate">
                                  {track.title}
                                </p>
                              </div>
                              <p className="text-[10px] text-muted-foreground font-mono">
                                {/* Hiển thị giá trị tại giờ đó */}+
                                {Math.round(
                                  Number(entry.value)
                                ).toLocaleString()}{" "}
                                views
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          {/* --- 4. Areas (Các đường biểu đồ) --- */}
          {[0, 1, 2].map(
            (i) =>
              // Chỉ vẽ nếu có track tương ứng
              tracks[i] && (
                <Area
                  key={i}
                  type="monotone" // Đường cong mềm mại
                  dataKey={`top${i + 1}`}
                  stroke={RANK_COLORS[i]}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill={`url(#colorTop${i + 1})`}
                  animationDuration={1500}
                  animationEasing="ease-out"
                  activeDot={{
                    r: 6,
                    strokeWidth: 4,
                    stroke: "hsl(var(--background))",
                    fill: RANK_COLORS[i],
                    className: "animate-pulse",
                  }}
                />
              )
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
