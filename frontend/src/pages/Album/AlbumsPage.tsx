import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Play,
  Heart,
  MoreHorizontal,
  Calendar,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const albums = [
  {
    id: 1,
    title: "Midnight Echoes",
    artist: "Aurora Dreams",
    year: "2024",
    image: "https://images.unsplash.com/photo-1629923759854-156b88c433aa?w=400",
    genre: "Electronic",
    duration: "42:30",
    tracks: 12,
    type: "Album",
    color: "from-purple-500 to-blue-500",
  },
  {
    id: 2,
    title: "Vinyl Dreams",
    artist: "The Retro Collective",
    year: "2024",
    image: "https://images.unsplash.com/photo-1718217028088-a23cb3b277c4?w=400",
    genre: "Indie Rock",
    duration: "38:15",
    tracks: 10,
    type: "Album",
    color: "from-orange-500 to-red-500",
  },
  {
    id: 3,
    title: "Acoustic Stories",
    artist: "Maya Chen",
    year: "2023",
    image: "https://images.unsplash.com/photo-1629735951612-65b0f1724031?w=400",
    genre: "Folk",
    duration: "45:22",
    tracks: 14,
    type: "Album",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 4,
    title: "Urban Beats",
    artist: "Street Symphony",
    year: "2024",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    genre: "Hip-Hop",
    duration: "35:48",
    tracks: 11,
    type: "Album",
    color: "from-red-500 to-pink-500",
  },
  {
    id: 5,
    title: "Digital Horizons",
    artist: "Synth Wave",
    year: "2024",
    image: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=400",
    genre: "Electronic",
    duration: "40:12",
    tracks: 9,
    type: "Album",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 6,
    title: "Jazz Nights",
    artist: "Midnight Club",
    year: "2023",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
    genre: "Jazz",
    duration: "52:34",
    tracks: 8,
    type: "Album",
    color: "from-amber-500 to-yellow-500",
  },
  {
    id: 7,
    title: "Rock Legends",
    artist: "Thunder Road",
    year: "2023",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    genre: "Rock",
    duration: "48:17",
    tracks: 13,
    type: "Album",
    color: "from-red-500 to-rose-500",
  },
  {
    id: 8,
    title: "Pop Perfection",
    artist: "Luna Martinez",
    year: "2024",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    genre: "Pop",
    duration: "36:45",
    tracks: 12,
    type: "Album",
    color: "from-pink-500 to-purple-500",
  },
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "title", label: "Title A-Z" },
  { value: "artist", label: "Artist A-Z" },
  { value: "duration", label: "Duration" },
];

function AlbumsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [likedAlbums, setLikedAlbums] = useState(new Set([1, 3, 5]));

  const filteredAndSortedAlbums = albums
    .filter(
      (album) =>
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.genre.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return parseInt(b.year) - parseInt(a.year);
        case "oldest":
          return parseInt(a.year) - parseInt(b.year);
        case "title":
          return a.title.localeCompare(b.title);
        case "artist":
          return a.artist.localeCompare(b.artist);
        case "duration":
          return b.duration.localeCompare(a.duration);
        default:
          return 0;
      }
    });

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
    <div className="container px-4 lg:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Albums
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          Explore complete albums from your favorite artists
        </p>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search albums, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Albums Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
      >
        {filteredAndSortedAlbums.map((album, index) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
          >
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                {/* Album Cover */}
                <div className="relative">
                  <Link to={`/albums/${album.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ImageWithFallback
                        src={album.image}
                        alt={album.title}
                        className="w-full aspect-square object-cover"
                      />
                    </motion.div>
                  </Link>

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${album.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      className="group-hover:scale-100 scale-0 transition-all duration-300"
                    >
                      <Button
                        size="lg"
                        className="bg-white text-black hover:bg-white/90"
                      >
                        <Play className="h-5 w-5 mr-2" fill="currentColor" />
                        Play
                      </Button>
                    </motion.div>
                  </div>

                  {/* Genre Badge */}
                  <Badge
                    className={`absolute top-3 right-3 bg-gradient-to-r ${album.color} text-white border-0`}
                  >
                    {album.genre}
                  </Badge>

                  {/* Like Button */}
                  <motion.button
                    className="absolute top-3 left-3 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors"
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                      e.preventDefault();
                      toggleLike(album.id);
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      animate={{
                        scale: likedAlbums.has(album.id) ? [1, 1.3, 1] : 1,
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

                {/* Album Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <Link to={`/albums/${album.id}`}>
                      <h3 className="font-bold text-lg mb-1 hover:text-primary transition-colors line-clamp-1">
                        {album.title}
                      </h3>
                    </Link>
                    <Link to={`/artists/${album.id}`}>
                      <p className="text-muted-foreground hover:text-primary transition-colors line-clamp-1">
                        {album.artist}
                      </p>
                    </Link>
                  </div>

                  {/* Album Details */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{album.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{album.duration}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground mb-4">
                    {album.tracks} tracks • {album.type}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="outline" size="sm" className="flex-1 mr-2">
                      <Play className="h-3 w-3 mr-1" />
                      Play
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
      {filteredAndSortedAlbums.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <h3 className="text-xl font-semibold mb-2">No albums found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search query or filters
          </p>
        </motion.div>
      )}
    </div>
  );
}
export default AlbumsPage;
