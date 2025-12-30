import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PublicAlbumCard from "@/features/album/components/PublicAlbumCard"; // Import component vừa tạo
import { Skeleton } from "@/components/ui/skeleton";
import { Album } from "@/features/album/types";
import { useFeatureAlbum } from "@/features/album/hooks/useClientAlbum";

export function FeaturedAlbums() {
  // 1. Gọi API lấy dữ liệu thật
  const { data: albums, isLoading } = useFeatureAlbum(6);

  return (
    <section className="py-16 lg:py-24 px-4 lg:px-6">
      <div className="container">
        {/* HEADER */}
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-black mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent tracking-tighter">
              Featured Albums
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg max-w-2xl">
              Khám phá những album mới nhất và thịnh hành từ các nghệ sĩ yêu
              thích của bạn.
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              className="group rounded-full px-6 h-10 border-primary/20 text-primary hover:bg-primary/5"
            >
              View All
              <motion.span
                className="ml-2 inline-block"
                animate={{ x: 0 }}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                →
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>

        {/* GRID CONTENT */}
        {isLoading ? (
          // Skeleton Loading
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-2xl w-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Real Data
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-6 gap-y-10">
            {albums?.map((album: Album) => (
              <PublicAlbumCard
                key={album._id}
                album={album}
                // Tùy chỉnh class nếu cần
                className="w-full"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
