import { Music2 } from "lucide-react";
import { motion } from "framer-motion";

import { Skeleton } from "@/components/ui/skeleton";
import PublicPlaylistCard from "@/features/playlist/components/PublicPlaylistCard";
import { useFeaturePlaylist } from "@/features/playlist/hooks/usePlaylist";
import { Playlist } from "@/features/playlist/types";
import { SectionHeader } from "@/pages/client/home/SectionHeader";
import { HorizontalScroll } from "@/pages/client/home/HorizontalScroll";

export function FeaturedPlaylists() {
  const { data: playlists, isLoading } = useFeaturePlaylist(6);

  return (
    // 🔥 Thêm bg-muted/20 xen kẽ để tạo nhịp điệu (Rhythm) cho trang
    <section className="py-16 lg:py-24 bg-muted/20 border-b border-border/40 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 md:mb-12">
          <SectionHeader
            icon={<Music2 className="w-4 h-4" />}
            label="Curated"
            title="Featured Playlists"
            description="Playlist được tuyển chọn cho mọi cảm xúc."
            viewAllHref="/playlists"
          />
        </div>

        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="relative">
            {/* Mobile Horizontal Scroll */}
            <div className="lg:hidden -mx-4 px-4">
              <HorizontalScroll>
                {playlists?.map((pl: Playlist) => (
                  <div
                    key={pl._id}
                    className="snap-start shrink-0 w-[260px] sm:w-[300px] first:pl-0 last:pr-4"
                  >
                    <PublicPlaylistCard playlist={pl} />
                  </div>
                ))}
              </HorizontalScroll>
            </div>

            {/* Desktop Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="hidden lg:grid grid-cols-5 xl:grid-cols-6 gap-6 xl:gap-8"
            >
              {playlists?.map((pl: Playlist) => (
                <PublicPlaylistCard key={pl._id} playlist={pl} />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

function SkeletonGrid({ count }: { count: number }) {
  return (
    <>
      <div className="flex gap-4 overflow-hidden lg:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="w-[260px] shrink-0 space-y-3">
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
      <div className="hidden lg:grid grid-cols-5 xl:grid-cols-6 gap-6 xl:gap-8">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </>
  );
}
