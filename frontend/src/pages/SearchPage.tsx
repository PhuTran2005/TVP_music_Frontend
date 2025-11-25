import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Clock,
  Play,
  Heart,
  MoreHorizontal,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const trendingSearches = [
  "Aurora Dreams",
  "Midnight Echoes",
  "Electronic",
  "Chill vibes",
  "Indie rock",
  "New releases",
  "Hip hop",
  "Workout music",
];

const searchResults = {
  songs: [
    {
      id: 1,
      title: "Midnight Echoes",
      artist: "Aurora Dreams",
      album: "Digital Dreams",
      duration: "3:24",
      image:
        "https://images.unsplash.com/photo-1629923759854-156b88c433aa?w=100",
    },
    {
      id: 2,
      title: "Vinyl Dreams",
      artist: "The Retro Collective",
      album: "Nostalgic Vibes",
      duration: "4:12",
      image:
        "https://images.unsplash.com/photo-1718217028088-a23cb3b277c4?w=100",
    },
    {
      id: 3,
      title: "Urban Beats",
      artist: "Street Symphony",
      album: "City Nights",
      duration: "3:45",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100",
    },
  ],
  artists: [
    {
      id: 1,
      name: "Aurora Dreams",
      genre: "Electronic",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616c5e93413?w=200",
      monthlyListeners: "2.5M",
    },
    {
      id: 2,
      name: "The Retro Collective",
      genre: "Indie Rock",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      monthlyListeners: "1.8M",
    },
  ],
  albums: [
    {
      id: 1,
      title: "Digital Dreams",
      artist: "Aurora Dreams",
      year: "2024",
      image:
        "https://images.unsplash.com/photo-1629923759854-156b88c433aa?w=200",
    },
    {
      id: 2,
      title: "Nostalgic Vibes",
      artist: "The Retro Collective",
      year: "2024",
      image:
        "https://images.unsplash.com/photo-1718217028088-a23cb3b277c4?w=200",
    },
  ],
  playlists: [
    {
      id: 1,
      title: "Electronic Euphoria",
      creator: "MusicHub",
      songs: 45,
      image:
        "https://images.unsplash.com/photo-1571974599782-87624638275c?w=200",
    },
    {
      id: 2,
      title: "Indie Discoveries",
      creator: "Music Explorer",
      songs: 78,
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200",
    },
  ],
};

export function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    "Aurora Dreams",
    "Chill music",
    "Electronic beats",
  ]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const timer = setTimeout(() => {
        setHasSearched(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setHasSearched(false);
    }
  }, [searchQuery]);

  const handleTrendingSearch = (term: string) => {
    setSearchQuery(term);
    if (!recentSearches.includes(term)) {
      setRecentSearches([term, ...recentSearches.slice(0, 4)]);
    }
  };

  return (
    <div className="container px-4 lg:px-6 py-8">
      {/* Search Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Search
        </h1>

        {/* Search Input */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 text-lg bg-muted/50 border-border/50 focus:bg-background"
          />
        </div>
      </motion.div>

      {!hasSearched ? (
        <>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent searches
              </h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTrendingSearch(search)}
                    className="px-4 py-2 bg-muted/50 hover:bg-muted rounded-full text-sm transition-colors"
                  >
                    {search}
                  </motion.button>
                ))}
              </div>
            </motion.section>
          )}

          {/* Trending Searches */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending searches
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {trendingSearches.map((search, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  onClick={() => handleTrendingSearch(search)}
                  className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted to-muted/70 rounded-lg text-left transition-all duration-200 border border-border/50"
                >
                  <span className="font-medium">{search}</span>
                </motion.button>
              ))}
            </div>
          </motion.section>
        </>
      ) : (
        /* Search Results */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Top Result */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Top result</h2>
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 max-w-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={searchResults.artists[0].image}
                    alt={searchResults.artists[0].name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">
                      {searchResults.artists[0].name}
                    </h3>
                    <Badge variant="secondary" className="mb-2">
                      Artist
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {searchResults.artists[0].monthlyListeners} monthly
                      listeners
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Play className="h-5 w-5" fill="currentColor" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Songs */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Songs</h2>
            <div className="space-y-2">
              {searchResults.songs.map((song, index) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <ImageWithFallback
                      src={song.image}
                      alt={song.title}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <Button
                      size="sm"
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white hover:bg-black/70"
                    >
                      <Play className="h-4 w-4" fill="currentColor" />
                    </Button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{song.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {song.artist} • {song.album}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {song.duration}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Artists */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Artists</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {searchResults.artists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link to={`/artists/${artist.id}`}>
                    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-4 text-center">
                        <ImageWithFallback
                          src={artist.image}
                          alt={artist.name}
                          className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                        />
                        <h4 className="font-semibold mb-1">{artist.name}</h4>
                        <Badge variant="secondary" className="mb-2">
                          {artist.genre}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {artist.monthlyListeners} monthly listeners
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Albums & Playlists */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Albums */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Albums</h2>
              <div className="space-y-3">
                {searchResults.albums.map((album, index) => (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/albums/${album.id}`}>
                      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <ImageWithFallback
                              src={album.image}
                              alt={album.title}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">
                                {album.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {album.artist} • {album.year}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Playlists */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Playlists</h2>
              <div className="space-y-3">
                {searchResults.playlists.map((playlist, index) => (
                  <motion.div
                    key={playlist.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/playlists/${playlist.id}`}>
                      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <ImageWithFallback
                              src={playlist.image}
                              alt={playlist.title}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold mb-1">
                                {playlist.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                By {playlist.creator} • {playlist.songs} songs
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </motion.div>
      )}
    </div>
  );
}
