import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Music, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

import { Artist } from "@/features/artist/types";
import { Genre } from "@/features/genre/types";

interface Props {
  artist: Artist;
  variant?: "default" | "compact";
  className?: string;
}

const formatNumber = (num = 0) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
};

const PublicArtistCard: React.FC<Props> = ({
  artist,
  variant = "default",
  className,
}) => {
  const navigate = useNavigate();
  const [isFollowed, setIsFollowed] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      className={cn("h-full", className)}
      onClick={() => navigate(`/artists/${artist._id}`)}
    >
      <Card
        className="
          h-full overflow-hidden cursor-pointer
          border-border/50
          bg-card
          hover:shadow-xl
          transition-shadow
        "
      >
        <CardContent className="p-0 flex flex-col h-full">
          {/* IMAGE */}
          <div className="relative aspect-square">
            <ImageWithFallback
              src={artist.avatar || artist.coverImage}
              alt={artist.name}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-0 p-4 text-white space-y-1">
              <div className="flex items-center gap-1">
                <h3 className="font-bold text-base truncate">{artist.name}</h3>
                {artist.isVerified && (
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                )}
              </div>

              {artist.genres?.[0] && (
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white text-[10px] border-none"
                >
                  {(artist.genres[0] as Genre).name}
                </Badge>
              )}
            </div>
          </div>

          {/* INFO */}
          <div className="p-4 flex flex-col gap-3 flex-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {formatNumber(artist.totalFollowers)}
              </span>

              {(artist.totalAlbums || artist.totalTracks) && (
                <span className="flex items-center gap-1">
                  <Music className="w-3.5 h-3.5" />
                  {artist.totalAlbums
                    ? `${artist.totalAlbums} albums`
                    : `${artist.totalTracks} tracks`}
                </span>
              )}
            </div>

            {variant === "default" && artist.bio && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {artist.bio}
              </p>
            )}

            <Button
              size="sm"
              variant={isFollowed ? "secondary" : "default"}
              className="mt-auto text-xs font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                setIsFollowed(!isFollowed);
              }}
            >
              {isFollowed ? "Following" : "Follow"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PublicArtistCard;
