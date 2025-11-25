import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Play,
  Heart,
  MoreHorizontal,
  Plus,
  Lock,
  Users,
  Music,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Switch } from "../../components/ui/switch";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const playlists = [
  {
    id: 1,
    title: "My Daily Mix",
    description: "Your personal mix updated daily",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    creator: "MusicHub",
    isOwn: true,
    isPublic: true,
    songs: 50,
    duration: "3h 25m",
    followers: 0,
    lastUpdated: "Today",
    color: "from-blue-500 to-purple-500",
  },
  {
    id: 2,
    title: "Chill Vibes",
    description: "Perfect for relaxing and unwinding",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400",
    creator: "You",
    isOwn: true,
    isPublic: false,
    songs: 32,
    duration: "2h 18m",
    followers: 0,
    lastUpdated: "2 days ago",
    color: "from-green-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Workout Energy",
    description: "High-energy tracks to power your workout",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    creator: "You",
    isOwn: true,
    isPublic: true,
    songs: 45,
    duration: "2h 52m",
    followers: 12,
    lastUpdated: "1 week ago",
    color: "from-red-500 to-orange-500",
  },
  {
    id: 4,
    title: "Indie Discoveries",
    description: "Fresh indie tracks worth discovering",
    image: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=400",
    creator: "Music Explorer",
    isOwn: false,
    isPublic: true,
    songs: 78,
    duration: "4h 45m",
    followers: 1247,
    lastUpdated: "3 days ago",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 5,
    title: "Focus Flow",
    description: "Instrumental tracks for deep focus",
    image: "https://images.unsplash.com/photo-1629735951612-65b0f1724031?w=400",
    creator: "Productivity Pro",
    isOwn: false,
    isPublic: true,
    songs: 62,
    duration: "4h 12m",
    followers: 892,
    lastUpdated: "5 days ago",
    color: "from-teal-500 to-blue-500",
  },
  {
    id: 6,
    title: "Road Trip Hits",
    description: "The ultimate road trip soundtrack",
    image: "https://images.unsplash.com/photo-1718217028088-a23cb3b277c4?w=400",
    creator: "Travel Tunes",
    isOwn: false,
    isPublic: true,
    songs: 84,
    duration: "5h 18m",
    followers: 2341,
    lastUpdated: "1 week ago",
    color: "from-yellow-500 to-red-500",
  },
];

export function PlaylistsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [likedPlaylists, setLikedPlaylists] = useState(new Set([4, 5]));
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    title: "",
    description: "",
    isPublic: true,
  });

  const filteredPlaylists = playlists.filter(
    (playlist) =>
      playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playlist.creator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleLike = (playlistId: number) => {
    const newLiked = new Set(likedPlaylists);
    if (newLiked.has(playlistId)) {
      newLiked.delete(playlistId);
    } else {
      newLiked.add(playlistId);
    }
    setLikedPlaylists(newLiked);
  };

  const handleCreatePlaylist = () => {
    // Handle playlist creation
    console.log("Creating playlist:", newPlaylist);
    setIsCreateDialogOpen(false);
    setNewPlaylist({ title: "", description: "", isPublic: true });
  };

  return (
    <div className="container px-4 lg:px-6 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Playlists
            </h1>
            <p className="text-lg text-muted-foreground">
              Your curated collections and discoveries
            </p>
          </div>

          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-primary/80">
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="title">Playlist Name</Label>
                  <Input
                    id="title"
                    placeholder="Enter playlist name"
                    value={newPlaylist.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewPlaylist({ ...newPlaylist, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your playlist"
                    value={newPlaylist.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewPlaylist({
                        ...newPlaylist,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={newPlaylist.isPublic}
                    onCheckedChange={(checked: boolean) =>
                      setNewPlaylist({ ...newPlaylist, isPublic: checked })
                    }
                  />
                  <Label htmlFor="public">Make playlist public</Label>
                </div>
                <Button onClick={handleCreatePlaylist} className="w-full">
                  Create Playlist
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search playlists..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Playlists Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredPlaylists.map((playlist, index) => (
          <motion.div
            key={playlist.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
          >
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                {/* Playlist Cover */}
                <div className="relative">
                  <Link to={`/playlists/${playlist.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ImageWithFallback
                        src={playlist.image}
                        alt={playlist.title}
                        className="w-full aspect-square object-cover"
                      />
                    </motion.div>
                  </Link>

                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${playlist.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
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

                  {/* Privacy Badge */}
                  <Badge
                    className="absolute top-3 right-3"
                    variant={playlist.isPublic ? "default" : "secondary"}
                  >
                    {playlist.isPublic ? (
                      <Users className="h-3 w-3 mr-1" />
                    ) : (
                      <Lock className="h-3 w-3 mr-1" />
                    )}
                    {playlist.isPublic ? "Public" : "Private"}
                  </Badge>

                  {/* Like Button (only for non-own playlists) */}
                  {!playlist.isOwn && (
                    <motion.button
                      className="absolute top-3 left-3 p-2 bg-black/20 backdrop-blur-sm rounded-full text-white hover:bg-black/40 transition-colors"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        toggleLike(playlist.id);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <motion.div
                        animate={{
                          scale: likedPlaylists.has(playlist.id)
                            ? [1, 1.3, 1]
                            : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            likedPlaylists.has(playlist.id)
                              ? "fill-red-500 text-red-500"
                              : ""
                          }`}
                        />
                      </motion.div>
                    </motion.button>
                  )}
                </div>

                {/* Playlist Info */}
                <div className="p-4">
                  <div className="mb-3">
                    <Link to={`/playlists/${playlist.id}`}>
                      <h3 className="font-bold text-lg mb-1 hover:text-primary transition-colors line-clamp-1">
                        {playlist.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {playlist.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      By {playlist.creator}
                    </p>
                  </div>

                  {/* Playlist Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Music className="h-3 w-3" />
                      <span>{playlist.songs} songs</span>
                    </div>
                    <span>{playlist.duration}</span>
                  </div>

                  {!playlist.isOwn && playlist.followers > 0 && (
                    <div className="text-xs text-muted-foreground mb-4">
                      {playlist.followers.toLocaleString()} followers
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground mb-4">
                    Updated {playlist.lastUpdated}
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
      {filteredPlaylists.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <h3 className="text-xl font-semibold mb-2">No playlists found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search query or create a new playlist
          </p>
        </motion.div>
      )}
    </div>
  );
}
export default PlaylistsPage;
