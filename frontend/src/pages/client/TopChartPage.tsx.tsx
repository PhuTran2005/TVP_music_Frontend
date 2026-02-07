import React, { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, TrendingUp, Clock, Info, BarChart2 } from "lucide-react";
import { useRealtimeChart } from "@/features/track/hooks/useRealtimeChart";
import { ChartItem } from "@/features/track/components/ChartItem";
import { ChartLine } from "@/features/track/components/ChartLine"; // Đảm bảo component này nhận prop `data`
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const TopChartPage = () => {
  // 🔥 FIX 1: Lấy thêm chartData từ hook
  const { tracks, chartData, prevRankMap, isLoading, isUpdating } =
    useRealtimeChart();
  console.log("Chart Data:", chartData, tracks);
  // Tạo hiệu ứng thời gian thực giả lập
  const lastUpdated = useMemo(
    () =>
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    [tracks] // Update khi list track thay đổi
  );

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium animate-pulse uppercase tracking-widest">
          Loading Data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* --- HERO SECTION --- */}
      <div className="relative pt-16 pb-20 lg:pt-24 lg:pb-32">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background blur-3xl -z-10 pointer-events-none opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10 opacity-30" />

        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-primary mb-4 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live Updating • {lastUpdated}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-tighter drop-shadow-sm mb-4"
            >
              #Chart
            </motion.h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg font-medium">
              The hottest tracks right now, updated in real-time based on
              listener data.
            </p>
          </div>

          {/* --- CHART VISUALIZATION --- */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-5xl mx-auto"
          >
            <div className="bg-card/40 border border-border/50 backdrop-blur-xl rounded-[2.5rem] p-1 shadow-2xl ring-1 ring-white/10 overflow-hidden">
              <div className="bg-background/60 rounded-[2.2rem] p-6 md:p-8 relative overflow-hidden group">
                {/* Header Chart */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <BarChart2 className="w-6 h-6 text-primary" />
                      24H Performance
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      Real-time listening trends
                    </p>
                  </div>

                  {/* Top 3 Avatars */}
                  <div className="flex items-center gap-3 bg-card/50 px-4 py-2 rounded-full border border-border/50 shadow-sm backdrop-blur-md">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Leaders
                    </span>
                    <div className="flex -space-x-3">
                      {tracks.slice(0, 3).map((t, i) => (
                        <div key={t._id} className="relative group/avatar">
                          <img
                            src={t.coverImage}
                            className={cn(
                              "w-8 h-8 rounded-full border-2 border-background object-cover transition-transform hover:scale-110 hover:z-10 shadow-sm",
                              i === 0
                                ? "z-30 border-blue-500"
                                : i === 1
                                ? "z-20 border-green-500"
                                : "z-10 border-red-500"
                            )}
                            alt={t.title}
                            title={`#${i + 1} ${t.title}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chart Line Component */}
                <div className="h-[300px] sm:h-[380px] w-full relative z-10">
                  {/* 🔥 FIX 2: Truyền chartData thay vì tracks */}
                  <ChartLine data={chartData} tracks={tracks} />
                </div>

                {/* Background Grid Pattern (Subtle) */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* --- TRACK LIST SECTION --- */}
      <div className="container mx-auto px-4 md:px-8 max-w-6xl mt-8">
        {/* List Header */}
        <div className="flex items-center justify-between mb-6 px-2 sm:px-4">
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
            Top 100{" "}
            <span className="text-lg font-medium text-muted-foreground font-sans bg-muted px-2 py-0.5 rounded-md">
              Vietnam
            </span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground font-medium"
          >
            <Info className="w-4 h-4 mr-2" /> Rules
          </Button>
        </div>

        {/* List Items */}
        <div
          className={cn(
            "flex flex-col gap-3 transition-opacity duration-500",
            isUpdating ? "opacity-60 pointer-events-none" : "opacity-100"
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {tracks.map((track, index) => {
              const rank = index + 1;
              const prevRank = prevRankMap[track._id] || rank;

              return (
                <motion.div
                  key={track._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <ChartItem track={track} rank={rank} prevRank={prevRank} />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {tracks.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              Chưa có dữ liệu xếp hạng
            </div>
          )}

          {/* Load More Button */}
          {tracks.length > 10 && (
            <div className="mt-12 text-center">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 h-12 font-bold uppercase tracking-widest text-xs border-border/50 bg-card hover:bg-muted transition-all shadow-sm hover:shadow-md"
              >
                View Full 100 Tracks
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
