import { motion } from "framer-motion";
import { Edit, Music, Users, Heart, Calendar, MapPin, ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const profileData = {
  id: 1,
  name: "Alex Johnson",
  username: "alexmusic",
  bio: "Music enthusiast and playlist curator. Always discovering new sounds and sharing them with the world.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
  coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200",
  location: "San Francisco, CA",
  joinDate: "January 2023",
  website: "alexmusic.com",
  stats: {
    followers: 1247,
    following: 856,
    playlists: 23,
    likedSongs: 1892
  },
  recentPlaylists: [
    {
      id: 1,
      title: "Summer Vibes 2024",
      description: "Perfect soundtrack for sunny days",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300",
      songs: 45,
      followers: 127
    },
    {
      id: 2,
      title: "Workout Energy",
      description: "High-energy tracks to power your workout",
      image: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300",
      songs: 32,
      followers: 89
    },
    {
      id: 3,
      title: "Late Night Study",
      description: "Chill beats for focus and concentration",
      image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300",
      songs: 78,
      followers: 234
    }
  ],
  recentActivity: [
    {
      id: 1,
      type: "playlist_created",
      title: "Created playlist 'Summer Vibes 2024'",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "song_liked",
      title: "Liked 'Midnight Echoes' by Aurora Dreams",
      time: "5 hours ago"
    },
    {
      id: 3,
      type: "artist_followed",
      title: "Started following Maya Chen",
      time: "1 day ago"
    },
    {
      id: 4,
      type: "playlist_updated",
      title: "Added 5 songs to 'Workout Energy'",
      time: "2 days ago"
    }
  ],
  topArtists: [
    {
      id: 1,
      name: "Aurora Dreams",
      image: "https://images.unsplash.com/photo-1494790108755-2616c5e93413?w=150",
      genre: "Electronic"
    },
    {
      id: 2,
      name: "Maya Chen",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      genre: "Folk"
    },
    {
      id: 3,
      name: "Street Symphony",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      genre: "Hip-Hop"
    }
  ]
};

export function ProfilePage() {
  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <section className="relative h-80 lg:h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <ImageWithFallback
          src={profileData.coverImage}
          alt="Profile cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="container relative z-20 h-full flex items-end px-4 lg:px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-start lg:items-end gap-6 text-white w-full"
          >
            {/* Profile Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Avatar className="w-32 h-32 lg:w-40 lg:h-40 border-4 border-white/20">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="text-4xl">{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Badge variant="secondary" className="mb-3 bg-white/20 text-white border-0">
                  Profile
                </Badge>
                
                <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                  {profileData.name}
                </h1>
                
                <p className="text-lg opacity-90 mb-4">@{profileData.username}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{profileData.stats.followers.toLocaleString()} followers</span>
                  </div>
                  <span>•</span>
                  <span>{profileData.stats.following} following</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Music className="h-4 w-4" />
                    <span>{profileData.stats.playlists} playlists</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-3"
            >
              <Button className="bg-white text-black hover:bg-white/90">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Profile Content */}
      <div className="container px-4 lg:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="playlists" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="playlists">Playlists</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="artists">Top Artists</TabsTrigger>
              </TabsList>
              
              <TabsContent value="playlists" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {profileData.recentPlaylists.map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-0">
                          <div className="relative">
                            <ImageWithFallback
                              src={playlist.image}
                              alt={playlist.title}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                              <Button className="bg-white text-black hover:bg-white/90">
                                Play
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold mb-2">{playlist.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {playlist.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{playlist.songs} songs</span>
                              <span>{playlist.followers} followers</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {profileData.recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
              
              <TabsContent value="artists" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {profileData.topArtists.map((artist, index) => (
                    <motion.div
                      key={artist.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6 text-center">
                          <Avatar className="w-20 h-20 mx-auto mb-4">
                            <AvatarImage src={artist.image} />
                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <h3 className="font-semibold mb-1">{artist.name}</h3>
                          <Badge variant="secondary" className="text-xs">{artist.genre}</Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {profileData.bio}
                  </p>
                  
                  <Separator />
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {profileData.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <a href={`https://${profileData.website}`} className="text-primary hover:underline">
                        {profileData.website}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {profileData.stats.followers.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {profileData.stats.following}
                      </div>
                      <div className="text-xs text-muted-foreground">Following</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {profileData.stats.playlists}
                      </div>
                      <div className="text-xs text-muted-foreground">Playlists</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {profileData.stats.likedSongs.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Liked Songs</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}