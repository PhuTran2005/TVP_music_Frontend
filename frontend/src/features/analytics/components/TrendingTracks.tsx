import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { RankedTrack } from "@/features/analytics/types";

interface TrendingTracksProps {
  trendingData: RankedTrack[];
}

const TrendingTracks = ({ trendingData }: TrendingTracksProps) => {
  const maxScore = trendingData?.[0]?.score || 1;

  return (
    <div className="lg:col-span-2 bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-md flex flex-col h-[400px] lg:h-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Radio size={20} />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground uppercase tracking-wide leading-none">
              Trending Now
            </h3>
            <span className="text-xs text-muted-foreground font-medium">
              Top tracks in the last hour
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md border border-border/50">
          1H WINDOW
        </span>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto pr-1 -mr-2 hover:mr-0 transition-all custom-scrollbar">
        <div className="space-y-2 pb-2">
          <AnimatePresence>
            {(trendingData || []).slice(0, 5).map((item, index) => {
              const heatPercent = (item.score / maxScore) * 100;
              return (
                <motion.div
                  key={item.track._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                >
                  {/* Rank Number */}
                  <span
                    className={cn(
                      "w-6 text-center font-black text-xl font-mono tabular-nums",
                      index === 0
                        ? "text-yellow-500 drop-shadow-sm"
                        : index === 1
                        ? "text-gray-400"
                        : index === 2
                        ? "text-orange-500"
                        : "text-muted-foreground/50"
                    )}
                  >
                    {index + 1}
                  </span>

                  {/* Cover Image */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm shrink-0 border border-border/10">
                    <img
                      src={item.track.coverImage}
                      className="w-full h-full object-cover"
                      alt=""
                      loading="lazy"
                    />
                  </div>

                  {/* Info & Score Bar */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                    <div className="flex justify-between items-end">
                      <p className="text-sm font-bold text-foreground truncate pr-2 leading-none">
                        {item.track.title}
                      </p>
                      <span className="text-xs font-mono font-bold text-primary tabular-nums leading-none">
                        {item.score}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-xs text-muted-foreground truncate w-24 shrink-0 font-medium">
                        {item.track.artist.name}
                      </p>
                      {/* Heatmap Bar */}
                      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary/80 to-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${heatPercent}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {(!trendingData || trendingData.length === 0) && (
              <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                <Music size={32} className="opacity-20" />
                <span className="text-sm font-medium">Collecting data...</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default TrendingTracks;
