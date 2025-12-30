import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Music, Award, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Artist } from "@/features/artist/types";
import { Badge } from "@/components/ui/badge";
import { Genre } from "@/features/genre/types";

interface PublicArtistCardProps {
  artist: Artist;
  className?: string;
  variant?: "default" | "compact"; // Compact cho danh sách nhỏ, Default cho spotlight
  onFollow?: (artistId: string) => void;
}

const PublicArtistCard: React.FC<PublicArtistCardProps> = ({
  artist,
  className,
  variant = "default",
  onFollow,
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false); // Logic follow tạm thời

  const handleCardClick = () => {
    navigate(`/artists/${artist._id}`);
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFollow) {
      onFollow(artist._id);
    } else {
      setIsFollowed(!isFollowed);
    }
  };

  // Format số lượng follower (VD: 1.2K, 1M)
  const formatNumber = (num?: number) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      className={cn("h-full", className)}
    >
      <Card className="group h-full cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden border-border/40 bg-card/40 hover:bg-card/60 backdrop-blur-sm">
        <CardContent className="p-0 flex flex-col h-full">
          {/* 1. IMAGE AREA */}
          <div className="relative overflow-hidden aspect-[4/3] sm:aspect-square lg:aspect-[4/3]">
            <motion.div
              className="w-full h-full"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.5 }}
            >
              <ImageWithFallback
                src={artist.avatar || artist.coverImage}
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Info Overlay (Name & Verified) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="font-bold text-lg sm:text-xl truncate leading-tight">
                  {artist.name}
                </h3>
                {artist.isVerified && (
                  <div className="text-blue-400" title="Verified Artist">
                    <CheckCircle2 className="w-4 h-4 fill-blue-500/20" />
                  </div>
                )}
              </div>
              {artist.genres &&
                artist.genres.map((g: Genre) => (
                  <Badge
                    variant="secondary"
                    className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold border-none h-5 px-2"
                  >
                    {g.name}
                  </Badge>
                ))}
            </div>
          </div>

          {/* 2. STATS & ACTION AREA */}
          <div className="p-4 flex flex-col gap-4 flex-1 justify-between">
            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5" title="Followers">
                <Users className="h-4 w-4" />
                <span className="font-medium">
                  {formatNumber(artist.totalFollowers)}
                </span>
              </div>

              {(artist.totalAlbums || artist.totalTracks) && (
                <div
                  className="flex items-center gap-1.5"
                  title="Albums/Tracks"
                >
                  <Music className="h-4 w-4" />
                  <span className="font-medium">
                    {artist.totalAlbums
                      ? `${artist.totalAlbums} Albums`
                      : `${artist.totalTracks} Tracks`}
                  </span>
                </div>
              )}
            </div>

            {/* Bio (Optional - Only for default variant) */}
            {variant === "default" && artist.bio && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {artist.bio}
              </p>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
              <Button
                variant={isFollowed ? "secondary" : "default"}
                size="sm"
                className={cn(
                  "w-full text-xs font-semibold transition-all",
                  isFollowed
                    ? "hover:bg-destructive hover:text-destructive-foreground"
                    : "hover:scale-105"
                )}
                onClick={handleFollowClick}
              >
                {isFollowed ? "Unfollow" : "Follow"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold hover:bg-secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
              >
                Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PublicArtistCard;
