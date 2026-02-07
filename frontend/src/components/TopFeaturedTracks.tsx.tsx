import { AnimatePresence } from "framer-motion";
import { Loader2, BarChart3 } from "lucide-react";

import { useRealtimeChart } from "@/features/track/hooks/useRealtimeChart";
import { ChartItem } from "@/features/track/components/ChartItem";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/pages/client/home/SectionHeader";

export const TopFeaturedTracks = () => {
  const { tracks, prevRankMap, isLoading, isUpdating } = useRealtimeChart();
  const top10 = tracks.slice(0, 10);

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center border-b border-border/40">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    // 🔥 Thêm border-b để tách biệt section
    <section className="py-16 lg:py-24 bg-background border-b border-border/40 relative">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <SectionHeader
            icon={<BarChart3 className="w-4 h-4" />}
            label="Top Charts"
            title="Top Featured Tracks"
            description="Những bài hát được yêu thích nhất hiện nay."
            viewAllHref="/charts"
          />
        </div>

        {/* Chart List */}
        <div
          className={cn(
            "flex flex-col gap-2 transition-opacity duration-500", // Tăng gap lên 2 cho thoáng
            isUpdating && "opacity-70 pointer-events-none"
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {top10.map((track, index) => {
              const rank = index + 1;
              const prevRank = prevRankMap[track._id] ?? rank;

              return (
                <ChartItem
                  key={track._id}
                  track={track}
                  rank={rank}
                  prevRank={prevRank}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
