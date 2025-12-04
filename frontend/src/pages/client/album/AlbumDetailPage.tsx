import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  Play,
  Heart,
  MoreHorizontal,
  Clock,
  Calendar,
  Share2,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";

// Mock data
const albumData = {
  id: 1,
  title: "Midnight Echoes",
  artist: "Aurora Dreams",
  artistId: 1,
  year: "2024",
  genre: "Electronic",
  image: "https://images.unsplash.com/photo-1629923759854-156b88c433aa?w=600",
  duration: "42:30",
  tracks: 12,
  type: "Album",
  releaseDate: "March 15, 2024",
  label: "Electronic Records",
  description:
    "An ethereal journey through ambient soundscapes and electronic beats. Experience the perfect blend of modern production and timeless melodies that will transport you to another dimension.",
  songs: [
    {
      id: 1,
      title: "Midnight Echoes",
      duration: "3:24",
      trackNumber: 1,
      explicit: false,
    },
    {
      id: 2,
      title: "Neon Dreams",
      duration: "4:12",
      trackNumber: 2,
      explicit: false,
    },
    {
      id: 3,
      title: "Electric Pulse",
      duration: "3:45",
      trackNumber: 3,
      explicit: true,
    },
    {
      id: 4,
      title: "Digital Rain",
      duration: "5:18",
      trackNumber: 4,
      explicit: false,
    },
    {
      id: 5,
      title: "Synthetic Love",
      duration: "4:03",
      trackNumber: 5,
      explicit: false,
    },
    {
      id: 6,
      title: "Binary Stars",
      duration: "3:56",
      trackNumber: 6,
      explicit: false,
    },
    {
      id: 7,
      title: "Virtual Reality",
      duration: "4:28",
      trackNumber: 7,
      explicit: false,
    },
    {
      id: 8,
      title: "Cyber Dreams",
      duration: "3:34",
      trackNumber: 8,
      explicit: false,
    },
    {
      id: 9,
      title: "Data Stream",
      duration: "4:15",
      trackNumber: 9,
      explicit: false,
    },
    {
      id: 10,
      title: "Algorithm Heart",
      duration: "3:42",
      trackNumber: 10,
      explicit: false,
    },
    {
      id: 11,
      title: "Digital Horizon",
      duration: "4:57",
      trackNumber: 11,
      explicit: false,
    },
    {
      id: 12,
      title: "Echo Chamber",
      duration: "2:46",
      trackNumber: 12,
      explicit: false,
    },
  ],
};

function AlbumDetailPage() {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set([1, 4, 7]));
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);

  const toggleLike = (songId: number) => {
    const newLiked = new Set(likedSongs);
    if (newLiked.has(songId)) {
      newLiked.delete(songId);
    } else {
      newLiked.add(songId);
    }
    setLikedSongs(newLiked);
  };

  const playTrack = (songId: number) => {
    setCurrentlyPlaying(currentlyPlaying === songId ? null : songId);
  };

  return (
    <div className="min-h-screen">
      {/* Album Header */}
      <section className="bg-gradient-to-b from-muted/50 to-background pt-8 pb-8">
        <div className="container px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-start lg:items-end gap-8"
          >
            {/* Album Cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="shrink-0"
            >
              <div className="relative group">
                <ImageWithFallback
                  src={albumData.image}
                  alt={albumData.title}
                  className="w-60 h-60 lg:w-80 lg:h-80 rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90"
                  >
                    <Play className="h-6 w-6 mr-2" fill="currentColor" />
                    Play Album
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Album Info */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Badge variant="secondary" className="mb-4">
                  {albumData.type}
                </Badge>

                <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                  {albumData.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 text-lg mb-4">
                  <Link
                    to={`/artists/${albumData.artistId}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {albumData.artist}
                  </Link>
                  <span>•</span>
                  <span>{albumData.year}</span>
                  <span>•</span>
                  <span>{albumData.tracks} songs</span>
                  <span>•</span>
                  <span>{albumData.duration}</span>
                </div>

                <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
                  {albumData.description}
                </p>

                <div className="flex items-center gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Play className="h-5 w-5 mr-2" fill="currentColor" />
                    Play
                  </Button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Button variant="outline" size="lg">
                      <motion.div
                        animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart
                          className={`h-5 w-5 mr-2 ${
                            isLiked ? "fill-red-500 text-red-500" : ""
                          }`}
                        />
                      </motion.div>
                      {isLiked ? "Liked" : "Like"}
                    </Button>
                  </motion.button>
                  <Button variant="ghost" size="lg">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </Button>
                  <Button variant="ghost" size="lg">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Track List */}
      <section className="container px-4 lg:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {/* Track List Header */}
          <div className="flex items-center gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-border/50 mb-4">
            <div className="w-8 text-center">#</div>
            <div className="flex-1">Title</div>
            <div className="w-16 text-center">
              <Clock className="h-4 w-4 mx-auto" />
            </div>
          </div>

          {/* Tracks */}
          <div className="space-y-1">
            {albumData.songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.03 }}
                className={`group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer ${
                  currentlyPlaying === song.id ? "bg-primary/10" : ""
                }`}
                onClick={() => playTrack(song.id)}
              >
                <div className="w-8 text-center">
                  {currentlyPlaying === song.id ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-primary"
                    >
                      <div className="flex items-center justify-center">
                        <div className="w-1 h-3 bg-primary animate-pulse mr-0.5"></div>
                        <div
                          className="w-1 h-2 bg-primary animate-pulse mr-0.5"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-1 h-4 bg-primary animate-pulse mr-0.5"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-1 h-2 bg-primary animate-pulse"
                          style={{ animationDelay: "0.3s" }}
                        ></div>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <span className="text-muted-foreground group-hover:hidden">
                        {song.trackNumber}
                      </span>
                      <Play
                        className="h-4 w-4 hidden group-hover:block text-foreground"
                        fill="currentColor"
                      />
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`font-medium truncate ${
                        currentlyPlaying === song.id ? "text-primary" : ""
                      }`}
                    >
                      {song.title}
                    </h4>
                    {song.explicit && (
                      <Badge
                        variant="secondary"
                        className="text-xs px-1.5 py-0.5"
                      >
                        E
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {albumData.artist}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.stopPropagation();
                      toggleLike(song.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedSongs.has(song.id)
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    />
                  </motion.button>
                  <span className="text-sm text-muted-foreground w-12 text-center">
                    {song.duration}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      e.stopPropagation()
                    }
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Separator className="my-8" />

        {/* Album Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm"
        >
          <div>
            <h4 className="font-semibold mb-2">Release Date</h4>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{albumData.releaseDate}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Genre</h4>
            <Badge variant="outline">{albumData.genre}</Badge>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Label</h4>
            <p className="text-muted-foreground">{albumData.label}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Duration</h4>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{albumData.duration}</span>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
export default AlbumDetailPage;
