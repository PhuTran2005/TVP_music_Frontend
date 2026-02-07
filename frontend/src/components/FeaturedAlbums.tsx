import { Disc3 } from "lucide-react";
import { motion } from "framer-motion";

import { Skeleton } from "@/components/ui/skeleton";
import PublicAlbumCard from "@/features/album/components/PublicAlbumCard";
import { useFeatureAlbum } from "@/features/album/hooks/useClientAlbum";
import { Album } from "@/features/album/types";
import { SectionHeader } from "@/pages/client/home/SectionHeader";
import { HorizontalScroll } from "@/pages/client/home/HorizontalScroll";

export function FeaturedAlbums() {
  const { data: albums, isLoading } = useFeatureAlbum(6);

  return (
    <section className="py-16 lg:py-24 bg-background border-b border-border/40 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 md:mb-12">
          <SectionHeader
            icon={<Disc3 className="w-4 h-4" />}
            label="Selection"
            title="Featured Albums"
            description="Album nổi bật được biên tập chọn lọc."
            viewAllHref="/albums"
          />
        </div>

        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : (
          <div className="relative">
            {/* Mobile Scroll */}
            <div className="lg:hidden -mx-4 px-4">
              <HorizontalScroll>
                {albums?.map((album: Album) => (
                  <div
                    key={album._id}
                    className="snap-start shrink-0 w-[260px] sm:w-[300px] first:pl-0 last:pr-4"
                  >
                    <PublicAlbumCard album={album} />
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
              {albums?.map((album: Album) => (
                <PublicAlbumCard key={album._id} album={album} />
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-6 xl:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-2xl" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
