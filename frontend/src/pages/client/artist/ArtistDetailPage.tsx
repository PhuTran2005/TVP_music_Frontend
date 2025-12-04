import { useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  Play,
  Heart,
  MoreHorizontal,
  Users,
  Verified,
  Clock,
  Calendar,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";

// Mock data - in a real app, this would come from an API
const artistData = {
  id: 1,
  name: "Aurora Dreams",
  genre: "Electronic",
  image: "https://images.unsplash.com/photo-1494790108755-2616c5e93413?w=800",
  coverImage:
    "https://images.unsplash.com/photo-1709731191876-899e32264420?w=1200",
  verified: true,
  monthlyListeners: "2.5M",
  followers: "1.2M",
  bio: "Aurora Dreams is an innovative electronic music producer known for creating ethereal soundscapes that blend modern electronic beats with ambient textures. With over 2.5 million monthly listeners, Aurora has become a defining voice in the contemporary electronic music scene.",
  topSongs: [
    {
      id: 1,
      title: "Midnight Echoes",
      plays: "125M",
      duration: "3:24",
      album: "Digital Dreams",
      image:
        "https://images.unsplash.com/photo-1629923759854-156b88c433aa?w=100",
    },
    {
      id: 2,
      title: "Neon Nights",
      plays: "98M",
      duration: "4:12",
      album: "Digital Dreams",
      image:
        "https://images.unsplash.com/photo-1629923759854-156b88c433aa?w=100",
    },
    {
      id: 3,
      title: "Electric Dreams",
      plays: "87M",
      duration: "3:45",
      album: "Synth Wave",
      image:
        "https://images.unsplash.com/photo-1571974599782-87624638275c?w=100",
    },
    {
      id: 4,
      title: "Cosmic Journey",
      plays: "76M",
      duration: "5:18",
      album: "Digital Dreams",
      image:
        "https://images.unsplash.com/photo-1629923759854-156b88c433aa?w=100",
    },
    {
      id: 5,
      title: "Virtual Reality",
      plays: "65M",
      duration: "4:03",
      album: "Synth Wave",
      image:
        "https://images.unsplash.com/photo-1571974599782-87624638275c?w=100",
    },
  ],
  albums: [
    {
      id: 1,
      title: "Digital Dreams",
      year: "2024",
      image:
        "https://images.unsplash.com/photo-1629923759854-156b88c433aa?w=300",
      type: "Album",
    },
    {
      id: 2,
      title: "Synth Wave",
      year: "2023",
      image:
        "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300",
      type: "Album",
    },
    {
      id: 3,
      title: "Electronic Euphoria",
      year: "2023",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
      type: "EP",
    },
  ],
};

export function ArtistDetailPage() {
  const { id } = useParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [likedSongs, setLikedSongs] = useState(new Set([1, 3]));

  const toggleLike = (songId: number) => {
    const newLiked = new Set(likedSongs);
    if (newLiked.has(songId)) {
      newLiked.delete(songId);
    } else {
      newLiked.add(songId);
    }
    setLikedSongs(newLiked);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 lg:h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
        <ImageWithFallback
          src={artistData.coverImage}
          alt={`${artistData.name} cover`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="container relative z-20 h-full flex items-end px-4 lg:px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-start lg:items-end gap-6 text-white w-full"
          >
            {/* Artist Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="shrink-0"
            >
              <ImageWithFallback
                src={artistData.image}
                alt={artistData.name}
                className="w-48 h-48 lg:w-60 lg:h-60 rounded-full object-cover shadow-2xl border-4 border-white/20"
              />
            </motion.div>

            {/* Artist Info */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 mb-2"
              >
                {artistData.verified && (
                  <Verified className="h-6 w-6 text-blue-400" />
                )}
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0"
                >
                  Artist
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="text-4xl lg:text-6xl font-bold mb-4"
              >
                {artistData.name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-wrap items-center gap-4 text-sm lg:text-base"
              >
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{artistData.monthlyListeners} monthly listeners</span>
                </div>
                <span>•</span>
                <span>{artistData.followers} followers</span>
                <span>•</span>
                <Badge variant="outline" className="text-white border-white/50">
                  {artistData.genre}
                </Badge>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="bg-gradient-to-b from-black/20 to-background pt-8 pb-4">
        <div className="container px-4 lg:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              <Play className="h-5 w-5 mr-2" fill="currentColor" />
              Play
            </Button>
            <Button
              variant={isFollowing ? "secondary" : "outline"}
              size="lg"
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button variant="ghost" size="lg">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Popular Songs */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2 className="text-2xl font-bold mb-6">Popular</h2>
              <div className="space-y-2">
                {artistData.topSongs.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.05 }}
                    className="group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 text-center">
                      <span className="text-muted-foreground group-hover:hidden">
                        {index + 1}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="hidden group-hover:flex h-8 w-8 p-0"
                      >
                        <Play className="h-4 w-4" fill="currentColor" />
                      </Button>
                    </div>

                    <ImageWithFallback
                      src={song.image}
                      alt={song.title}
                      className="w-12 h-12 rounded object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{song.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {song.plays} plays
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleLike(song.id)}
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
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {song.duration}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Discography */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
            >
              <h2 className="text-2xl font-bold mb-6">Discography</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {artistData.albums.map((album, index) => (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="relative mb-4">
                          <ImageWithFallback
                            src={album.image}
                            alt={album.title}
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                            <Button className="bg-white text-black hover:bg-white/90">
                              <Play
                                className="h-4 w-4 mr-2"
                                fill="currentColor"
                              />
                              Play
                            </Button>
                          </div>
                        </div>
                        <h3 className="font-semibold mb-1">{album.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{album.year}</span>
                          <span>•</span>
                          <span>{album.type}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* About */}
            <motion.section
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <h3 className="text-xl font-bold mb-4">About</h3>
              <Card>
                <CardContent className="p-6">
                  <ImageWithFallback
                    src={artistData.image}
                    alt={artistData.name}
                    className="w-full aspect-square object-cover rounded-lg mb-4"
                  />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {artistData.bio}
                  </p>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Monthly listeners
                      </span>
                      <span className="font-medium">
                        {artistData.monthlyListeners}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Followers</span>
                      <span className="font-medium">
                        {artistData.followers}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Genre</span>
                      <Badge variant="secondary">{artistData.genre}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ArtistDetailPage;
