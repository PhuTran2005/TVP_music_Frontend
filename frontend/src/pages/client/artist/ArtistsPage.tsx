import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Play,
  Heart,
  MoreHorizontal,
  Users,
  Music,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { ImageWithFallback } from "../../../components/figma/ImageWithFallback";

const artists = [
  {
    id: 1,
    name: "Aurora Dreams",
    genre: "Electronic",
    image: "https://images.unsplash.com/photo-1494790108755-2616c5e93413?w=400",
    monthlyListeners: "2.5M",
    albums: 4,
    topSong: "Midnight Echoes",
    verified: true,
    followers: "1.2M",
  },
  {
    id: 2,
    name: "The Retro Collective",
    genre: "Indie Rock",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    monthlyListeners: "1.8M",
    albums: 6,
    topSong: "Vinyl Dreams",
    verified: true,
    followers: "890K",
  },
  {
    id: 3,
    name: "Maya Chen",
    genre: "Folk",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    monthlyListeners: "950K",
    albums: 3,
    topSong: "Acoustic Stories",
    verified: false,
    followers: "420K",
  },
  {
    id: 4,
    name: "Street Symphony",
    genre: "Hip-Hop",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    monthlyListeners: "3.1M",
    albums: 5,
    topSong: "Urban Beats",
    verified: true,
    followers: "2.1M",
  },
  {
    id: 5,
    name: "Synth Wave",
    genre: "Electronic",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    monthlyListeners: "1.3M",
    albums: 4,
    topSong: "Digital Horizons",
    verified: true,
    followers: "780K",
  },
  {
    id: 6,
    name: "Midnight Club",
    genre: "Jazz",
    image: "https://images.unsplash.com/photo-1494790108755-2616c5e93413?w=400",
    monthlyListeners: "680K",
    albums: 7,
    topSong: "Jazz Fusion",
    verified: false,
    followers: "320K",
  },
  {
    id: 7,
    name: "Thunder Road",
    genre: "Rock",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    monthlyListeners: "2.8M",
    albums: 8,
    topSong: "Rock Legends",
    verified: true,
    followers: "1.9M",
  },
  {
    id: 8,
    name: "Luna Martinez",
    genre: "Pop",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    monthlyListeners: "4.2M",
    albums: 3,
    topSong: "Starlight",
    verified: true,
    followers: "3.1M",
  },
];

export function ArtistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [likedArtists, setLikedArtists] = useState(new Set([1, 4]));

  const filteredArtists = artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleLike = (artistId: number) => {
    const newLiked = new Set(likedArtists);
    if (newLiked.has(artistId)) {
      newLiked.delete(artistId);
    } else {
      newLiked.add(artistId);
    }
    setLikedArtists(newLiked);
  };

  return (
    <div className="container px-4 lg:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Artists
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Discover and follow your favorite artists
        </p>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Artists Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredArtists.map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
          >
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                {/* Artist Image */}
                <div className="relative">
                  <Link to={`/artists/${artist.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ImageWithFallback
                        src={artist.image}
                        alt={artist.name}
                        className="w-full h-64 object-cover"
                      />
                    </motion.div>
                  </Link>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-white/90"
                    >
                      <Play className="h-5 w-5 mr-2" fill="currentColor" />
                      Play
                    </Button>
                  </div>

                  {/* Verified Badge */}
                  {artist.verified && (
                    <Badge className="absolute top-3 right-3 bg-blue-500">
                      Verified
                    </Badge>
                  )}

                  {/* Like Button */}
                  <motion.button
                    className="absolute top-3 left-3 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      toggleLike(artist.id);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      animate={{
                        scale: likedArtists.has(artist.id) ? [1, 1.3, 1] : 1,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          likedArtists.has(artist.id)
                            ? "fill-red-500 text-red-500"
                            : ""
                        }`}
                      />
                    </motion.div>
                  </motion.button>
                </div>

                {/* Artist Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <Link to={`/artists/${artist.id}`}>
                      <h3 className="font-bold text-lg mb-2 hover:text-primary transition-colors">
                        {artist.name}
                      </h3>
                    </Link>
                    <Badge variant="secondary" className="mb-3">
                      {artist.genre}
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-1">
                      Top Song: {artist.topSong}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{artist.monthlyListeners} monthly</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Music className="h-3 w-3" />
                      <span>{artist.albums} albums</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" className="flex-1 mr-2">
                      Follow
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* No Results */}
      {filteredArtists.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <h3 className="text-xl font-semibold mb-2">No artists found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search query
          </p>
        </motion.div>
      )}
    </div>
  );
}
export default ArtistsPage;
