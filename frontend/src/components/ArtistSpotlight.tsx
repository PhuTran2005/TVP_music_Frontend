import { motion } from "framer-motion";
import { Users } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import PublicArtistCard from "@/features/artist/components/PublicArtistCard";
import { Artist } from "@/features/artist/types";
import { HorizontalScroll } from "@/pages/client/home/HorizontalScroll";
import { SectionHeader } from "@/pages/client/home/SectionHeader";
import { useSpotlightArtist } from "@/features/artist/hooks/useArtistPublic";

export function ArtistSpotlight() {
  const { data: artists, isLoading } = useSpotlightArtist(4);

  return (
    <section className="py-16 lg:py-24 bg-background border-b border-border/40 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8 md:mb-12">
          <SectionHeader
            icon={<Users className="w-4 h-4" />}
            label="Spotlight"
            title="Artist Spotlight"
            description="Những nghệ sĩ đang tạo nên xu hướng âm nhạc."
            viewAllHref="/artists"
          />
        </div>

        {isLoading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="relative">
            {/* Mobile Scroll */}
            <div className="lg:hidden -mx-4 px-4">
              <HorizontalScroll>
                {artists?.map((artist: Artist) => (
                  <div
                    key={artist._id}
                    className="snap-start shrink-0 w-[280px] sm:w-[320px] first:pl-0 last:pr-4"
                  >
                    <PublicArtistCard artist={artist} variant="compact" />
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
              className="hidden lg:grid grid-cols-4 gap-6 xl:gap-8"
            >
              {artists?.map((artist: Artist) => (
                <PublicArtistCard key={artist._id} artist={artist} />
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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-square rounded-2xl" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
