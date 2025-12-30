import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PublicArtistCard from "@/features/artist/components/PublicArtistCard"; // Import Card mới
import { useSpotlightArtist } from "@/features/artist/hooks";
import { Artist } from "@/features/artist/types";

// Hooks

export function ArtistSpotlight() {
  // 1. Gọi API: Lấy 4 nghệ sĩ nổi bật nhất để hiển thị
  const { data: artists, isLoading } = useSpotlightArtist(4);

  return (
    <section className="py-16 px-4 md:px-6 bg-muted/30">
      <div className="container">
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row items-end md:items-center justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-3 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Artist Spotlight
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-base md:text-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Gặp gỡ những tài năng đang định hình âm thanh của tương lai. Khám
              phá câu chuyện và đồng hành cùng họ.
            </motion.p>
          </div>

          <motion.div
            whileHover={{ x: 5 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button
              variant="link"
              className="text-primary font-semibold text-base p-0 h-auto group"
            >
              View All Artists
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>

        {/* --- CONTENT SECTION --- */}
        {isLoading ? (
          // LOADING STATE (SKELETON)
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-full space-y-3">
                <Skeleton className="aspect-square w-full rounded-xl" />
                <div className="space-y-2 p-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-10" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 flex-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // DATA STATE
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artists?.map((artist: Artist, index: number) => (
              <motion.div
                key={artist._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="h-full"
              >
                <PublicArtistCard
                  artist={artist}
                  variant="default" // Hiển thị đầy đủ bio nếu có
                  className="h-full"
                  onFollow={(id) => {
                    console.log("Follow artist:", id);
                    // Gọi mutation follow ở đây
                  }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
