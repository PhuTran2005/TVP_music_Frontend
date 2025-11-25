import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import {
  Play,
  Heart,
  MoreHorizontal,
  Clock,
  Users,
  Lock,
  Edit3,
  Share2,
  Download,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

// Mock data
const playlistData = {
  id: 1,
  title: "Chill Vibes",
  description: "Perfect for relaxing and unwinding after a long day",
  image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=600",
  creator: {
    id: 1,
    name: "You",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616c5e93413?w=100",
  },
  isOwn: true,
  isPublic: false,
  followers: 0,
  songs: 15,
  duration: "1h 12m",
  lastUpdated: "2 days ago",
  createdDate: "January 15, 2024",
  tracks: [
    {
      id: 1,
      title: "Midnight Echoes",
      artist: "Aurora Dreams",
      artistId: 1,
      album: "Digital Dreams",
      albumId: 1,
      duration: "3:24",
      image:
        "https://images.unsplash.com/photo-1629923759854-156b88c433aa?w=100",
      addedDate: "2 days ago",
      addedBy: "You",
    },
    {
      id: 2,
      title: "Ocean Waves",
      artist: "Calm Collective",
      artistId: 2,
      album: "Nature Sounds",
      albumId: 2,
      duration: "5:18",
      image:
        "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=100",
      addedDate: "3 days ago",
      addedBy: "You",
    },
    {
      id: 3,
      title: "Soft Memories",
      artist: "Maya Chen",
      artistId: 3,
      album: "Acoustic Stories",
      albumId: 3,
      duration: "4:12",
      image:
        "https://images.unsplash.com/photo-1629735951612-65b0f1724031?w=100",
      addedDate: "1 week ago",
      addedBy: "You",
    },
    {
      id: 4,
      title: "Ambient Dreams",
      artist: "Synth Wave",
      artistId: 4,
      album: "Digital Horizons",
      albumId: 4,
      duration: "6:45",
      image:
        "https://images.unsplash.com/photo-1571974599782-87624638275c?w=100",
      addedDate: "1 week ago",
      addedBy: "You",
    },
    {
      id: 5,
      title: "Peaceful Mind",
      artist: "Meditation Masters",
      artistId: 5,
      album: "Inner Peace",
      albumId: 5,
      duration: "4:33",
      image:
        "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=100",
      addedDate: "2 weeks ago",
      addedBy: "You",
    },
  ],
};

export function PlaylistDetailPage() {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set([1, 3]));
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
      {/* Playlist Header */}
      <section className="bg-gradient-to-b from-muted/50 to-background pt-8 pb-8">
        <div className="container px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-start lg:items-end gap-8"
          >
            {/* Playlist Cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="shrink-0"
            >
              <div className="relative group">
                <ImageWithFallback
                  src={playlistData.image}
                  alt={playlistData.title}
                  className="w-60 h-60 lg:w-80 lg:h-80 rounded-2xl object-cover shadow-2xl"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-white/90"
                  >
                    <Play className="h-6 w-6 mr-2" fill="currentColor" />
                    Play Playlist
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Playlist Info */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">Playlist</Badge>
                  {playlistData.isPublic ? (
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <Lock className="h-3 w-3 mr-1" />
                      Private
                    </Badge>
                  )}
                </div>

                <h1 className="text-4xl lg:text-6xl font-bold mb-4 leading-tight">
                  {playlistData.title}
                </h1>

                <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
                  {playlistData.description}
                </p>

                <div className="flex items-center gap-2 mb-6">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={playlistData.creator.avatar} />
                    <AvatarFallback>
                      {playlistData.creator.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Link
                    to={`/profile/${playlistData.creator.id}`}
                    className="font-semibold hover:text-primary transition-colors"
                  >
                    {playlistData.creator.name}
                  </Link>
                  <span>•</span>
                  <span>{playlistData.songs} songs</span>
                  <span>•</span>
                  <span>{playlistData.duration}</span>
                </div>

                <div className="flex items-center gap-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    <Play className="h-5 w-5 mr-2" fill="currentColor" />
                    Play
                  </Button>

                  {!playlistData.isOwn && (
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
                  )}

                  <Button variant="ghost" size="lg">
                    <Download className="h-5 w-5 mr-2" />
                    Download
                  </Button>

                  <Button variant="ghost" size="lg">
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </Button>

                  {playlistData.isOwn && (
                    <Button variant="ghost" size="lg">
                      <Edit3 className="h-5 w-5 mr-2" />
                      Edit
                    </Button>
                  )}

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
            <div className="w-12"></div>
            <div className="flex-1">Title</div>
            <div className="hidden md:block w-32">Album</div>
            <div className="hidden lg:block w-24">Date added</div>
            <div className="w-16 text-center">
              <Clock className="h-4 w-4 mx-auto" />
            </div>
          </div>

          {/* Tracks */}
          <div className="space-y-1">
            {playlistData.tracks.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.05 }}
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
                        {index + 1}
                      </span>
                      <Play
                        className="h-4 w-4 hidden group-hover:block text-foreground"
                        fill="currentColor"
                      />
                    </>
                  )}
                </div>

                <ImageWithFallback
                  src={song.image}
                  alt={song.title}
                  className="w-12 h-12 rounded object-cover"
                />

                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-medium truncate ${
                      currentlyPlaying === song.id ? "text-primary" : ""
                    }`}
                  >
                    {song.title}
                  </h4>
                  <Link
                    to={`/artists/${song.artistId}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      e.stopPropagation()
                    }
                  >
                    {song.artist}
                  </Link>
                </div>

                <div className="hidden md:block w-32">
                  <Link
                    to={`/albums/${song.albumId}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors truncate block"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                      e.stopPropagation()
                    }
                  >
                    {song.album}
                  </Link>
                </div>

                <div className="hidden lg:block w-24 text-sm text-muted-foreground">
                  {song.addedDate}
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

        {/* Playlist Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-sm text-muted-foreground"
        >
          <p className="mb-2">Created on {playlistData.createdDate}</p>
          <p>Last updated {playlistData.lastUpdated}</p>
          {playlistData.followers > 0 && (
            <p className="mt-2">
              {playlistData.followers.toLocaleString()} followers
            </p>
          )}
        </motion.div>
      </section>
    </div>
  );
}
export default PlaylistDetailPage;
