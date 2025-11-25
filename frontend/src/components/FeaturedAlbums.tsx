import React, { useState } from "react";
import { Play, MoreHorizontal, Heart, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const albums = [
  {
    id: 1,
    title: "Vinyl Dreams",
    artist: "The Retro Collective",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXIlMjB2aW55bHxlbnwxfHx8fDE3NTg3NjgxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    genre: "Indie Rock",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 2,
    title: "Digital Horizons",
    artist: "Synth Wave",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1718217028088-a23cb3b277c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwbXVzaWMlMjBzdHVkaW98ZW58MXx8fHwxNzU4NzY4MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    genre: "Electronic",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 3,
    title: "Acoustic Stories",
    artist: "Maya Chen",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1629735951612-65b0f1724031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMGFydGlzdCUyMHBlcmZvcm1pbmd8ZW58MXx8fHwxNzU4NzY4MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    genre: "Folk",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    title: "Urban Beats",
    artist: "Street Symphony",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1629923759854-156b88c433aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGFsYnVtJTIwY292ZXIlMjB2aW55bHxlbnwxfHx8fDE3NTg3NjgxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    genre: "Hip-Hop",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 5,
    title: "Jazz Fusion",
    artist: "Midnight Club",
    year: "2024",
    image:
      "https://images.unsplash.com/photo-1629735951612-65b0f1724031?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpY2lhbiUyMGFydGlzdCUyMHBlcmZvcm1pbmd8ZW58MXx8fHwxNzU4NzY4MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    genre: "Jazz",
    color: "from-amber-500 to-yellow-500",
  },
  {
    id: 6,
    title: "Rock Legends",
    artist: "Thunder Road",
    year: "2023",
    image:
      "https://images.unsplash.com/photo-1718217028088-a23cb3b277c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwbXVzaWMlMjBzdHVkaW98ZW58MXx8fHwxNzU4NzY4MTM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    genre: "Rock",
    color: "from-red-500 to-rose-500",
  },
];

export function FeaturedAlbums() {
  const [likedAlbums, setLikedAlbums] = useState(new Set());

  const toggleLike = (albumId: number) => {
    const newLiked = new Set(likedAlbums);
    if (newLiked.has(albumId)) {
      newLiked.delete(albumId);
    } else {
      newLiked.add(albumId);
    }
    setLikedAlbums(newLiked);
  };

  return (
    <section className="py-16 lg:py-24 px-4 lg:px-6">
      <div className="container">
        <motion.div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Featured Albums
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg max-w-2xl">
              Discover the latest releases and trending albums from your
              favorite artists
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" className="group">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 lg:gap-6">
          {albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-500 overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                      <ImageWithFallback
                        src={album.image}
                        alt={album.title}
                        className="w-full aspect-square object-cover"
                      />
                    </motion.div>

                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${album.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    />

                    {/* Play button overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
                      initial={false}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        whileHover={{ scale: 1, rotate: 0 }}
                        className="group-hover:scale-100 scale-0 transition-all duration-300"
                      >
                        <Button
                          size="lg"
                          className="bg-white text-black hover:bg-white/90 shadow-2xl"
                        >
                          <Play className="h-6 w-6 mr-2" fill="currentColor" />
                          Play
                        </Button>
                      </motion.div>
                    </motion.div>

                    {/* Genre badge */}
                    <motion.div
                      className={`absolute top-3 right-3 bg-gradient-to-r ${album.color} text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      {album.genre}
                    </motion.div>

                    {/* Heart button */}
                    <motion.button
                      className="absolute top-3 left-3 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        toggleLike(album.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        animate={{
                          scale: likedAlbums.has(album.id) ? [1, 1.3, 1] : 1,
                          rotate: likedAlbums.has(album.id)
                            ? [0, 10, -10, 0]
                            : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            likedAlbums.has(album.id)
                              ? "fill-red-500 text-red-500"
                              : ""
                          }`}
                        />
                      </motion.div>
                    </motion.button>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {album.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {album.artist}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {album.year}
                      </p>
                    </div>

                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-primary/10"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Play
                        </Button>
                      </motion.div>

                      <div className="flex gap-1">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-primary/10"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-primary/10"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
