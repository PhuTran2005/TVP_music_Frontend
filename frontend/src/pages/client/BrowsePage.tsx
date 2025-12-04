import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Heart, Filter, Grid, List } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const genres = [
  "All",
  "Pop",
  "Rock",
  "Hip-Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "Country",
  "R&B",
  "Indie",
];

const browseContent = [
  {
    id: 1,
    title: "Top Charts",
    subtitle: "Most played this week",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    type: "playlist",
    count: "50 songs",
  },
  {
    id: 2,
    title: "New Releases",
    subtitle: "Fresh music just dropped",
    image: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=400",
    type: "collection",
    count: "24 albums",
  },
  {
    id: 3,
    title: "Chill Vibes",
    subtitle: "Relax and unwind",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
    type: "mood",
    count: "100+ songs",
  },
  {
    id: 4,
    title: "Workout Hits",
    subtitle: "High energy tracks",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    type: "activity",
    count: "80 songs",
  },
  {
    id: 5,
    title: "Indie Discoveries",
    subtitle: "Hidden gems",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    type: "genre",
    count: "45 artists",
  },
  {
    id: 6,
    title: "Jazz Classics",
    subtitle: "Timeless jazz standards",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
    type: "genre",
    count: "120 songs",
  },
];

const featuredArtists = [
  {
    id: 1,
    name: "Luna Martinez",
    genre: "Pop",
    image: "https://images.unsplash.com/photo-1494790108755-2616c5e93413?w=300",
    monthlyListeners: "2.1M",
  },
  {
    id: 2,
    name: "The Electric Minds",
    genre: "Electronic",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    monthlyListeners: "890K",
  },
  {
    id: 3,
    name: "Soulful Sarah",
    genre: "R&B",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
    monthlyListeners: "1.5M",
  },
  {
    id: 4,
    name: "Rock Legends",
    genre: "Rock",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
    monthlyListeners: "3.2M",
  },
];

export function BrowsePage() {
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="container px-4 lg:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Browse Music
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover new music, artists, and playlists
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-muted/30 rounded-xl"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Featured Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {browseContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="bg-white text-black hover:bg-white/90"
                      >
                        <Play className="h-5 w-5 mr-2" fill="currentColor" />
                        Play
                      </Button>
                    </div>
                    <Badge
                      className="absolute top-3 right-3"
                      variant="secondary"
                    >
                      {item.type}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {item.subtitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.count}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Featured Artists */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Artists</h2>
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredArtists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ImageWithFallback
                        src={artist.image}
                        alt={artist.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto"
                      />
                    </motion.div>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-semibold mb-1">{artist.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {artist.genre}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {artist.monthlyListeners} monthly listeners
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
export default BrowsePage;
