import { Shapes } from "lucide-react";
import { motion } from "framer-motion";

import { Skeleton } from "@/components/ui/skeleton";

import { Genre } from "@/features/genre/types";
import { useGenres } from "@/features/genre/hooks/useGenreAdmin";
import { SectionHeader } from "@/pages/client/home/SectionHeader";
import { HorizontalScroll } from "@/pages/client/home/HorizontalScroll";
import { GenreCard } from "@/features/genre/components/GenreCard";

export function FeaturedGenres() {
  const { data, isLoading } = useGenres({
    page: 1,
    limit: 8,
    isTrending: true,
    sort: "priority",
  });

  const genres = data?.data.data as Genre[] | undefined;

  return (
    // 🔥 1. Thêm border-y và nền nhẹ để tách biệt section (Visual Separation)
    <section className="py-16 lg:py-24 bg-muted/20 border-y border-border/40 relative">
      {/* 🔥 2. QUAN TRỌNG: Thêm 'mx-auto' để container luôn căn giữa màn hình */}
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-8 md:mb-12">
          <SectionHeader
            icon={<Shapes className="w-4 h-4" />}
            label="Explore"
            title="Browse by Genre"
            description="Khám phá thế giới âm nhạc qua từng thể loại."
            viewAllHref="/genres"
          />
        </div>

        {isLoading ? (
          <SkeletonGrid />
        ) : (
          <div className="relative">
            {/* --- MOBILE VIEW: Horizontal Scroll --- */}
            {/* Ẩn trên lg trở lên */}
            <div className="lg:hidden -mx-4 px-4">
              <HorizontalScroll>
                {genres?.map((genre) => (
                  <div
                    key={genre._id}
                    className="snap-start shrink-0 w-[280px] sm:w-[320px] first:pl-0 last:pr-4"
                  >
                    <GenreCard genre={genre} size="lg" />
                  </div>
                ))}
              </HorizontalScroll>
            </div>

            {/* --- DESKTOP VIEW: Grid Layout --- */}
            {/* Chỉ hiện trên lg trở lên */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="hidden lg:grid lg:grid-cols-4 gap-6 xl:gap-8"
            >
              {genres?.map((genre) => (
                <GenreCard key={genre._id} genre={genre} />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}

// --- Skeleton chuẩn theo Layout mới ---
function SkeletonGrid() {
  return (
    <>
      {/* Mobile Skeleton */}
      <div className="flex gap-4 overflow-hidden lg:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-[280px] aspect-[16/9] rounded-2xl shrink-0"
          />
        ))}
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden lg:grid grid-cols-4 gap-6 xl:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/2] rounded-2xl w-full" />
        ))}
      </div>
    </>
  );
}
